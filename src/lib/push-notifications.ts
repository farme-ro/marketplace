/**
 * Push Notifications Service
 * 
 * Handles Web Push Notifications subscription and management
 */

import { apiFetch } from './api/client';
import { isBackendSyncEnabled } from './backend-sync/status';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Check if user has granted notification permission
 */
export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscriptionData | null> {
  if (!isPushNotificationSupported()) {
    console.warn('[Push] Push notifications not supported');
    return null;
  }

  if (!isBackendSyncEnabled('notifications')) {
    console.warn('[Push] Push notifications not enabled in backend sync');
    return null;
  }

  try {
    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('[Push] Notification permission not granted');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
    });

    // Extract subscription data
    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(
          String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))
        ),
        auth: btoa(
          String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))
        ),
      },
    };

    // Send subscription to backend
    try {
      await apiFetch('/notifications/push/subscribe', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });
    } catch (error) {
      console.error('[Push] Error subscribing to backend:', error);
      // Still return subscription data even if backend call fails
    }

    return subscriptionData;
  } catch (error) {
    console.error('[Push] Error subscribing to push notifications:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      return true; // Already unsubscribed
    }

    // Unsubscribe from push manager
    await subscription.unsubscribe();

    // Notify backend
    try {
      await apiFetch('/notifications/push/unsubscribe', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });
    } catch (error) {
      console.error('[SW Push] Error unsubscribing from backend:', error);
    }

    return true;
  } catch (error) {
    console.error('[Push] Error unsubscribing from push notifications:', error);
    return false;
  }
}

/**
 * Get push subscription status
 */
export async function getPushSubscriptionStatus(): Promise<{
  subscribed: boolean;
  publicKey?: string;
}> {
  if (!isPushNotificationSupported()) {
    return { subscribed: false };
  }

  if (!isBackendSyncEnabled('notifications')) {
    return { subscribed: false };
  }

  try {
    const response = await apiFetch<{
      subscribed: boolean;
      subscriptions: Array<{ id: string; endpoint: string }>;
      publicKey?: string;
    }>('/notifications/push/subscription', {
      method: 'GET',
      credentials: 'include',
    });

    return {
      subscribed: response.subscribed,
      publicKey: response.publicKey,
    };
  } catch (error) {
    console.error('[Push] Error getting subscription status:', error);
    return { subscribed: false };
  }
}

/**
 * Check if currently subscribed
 */
export async function isSubscribedToPushNotifications(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('[Push] Error checking subscription:', error);
    return false;
  }
}

