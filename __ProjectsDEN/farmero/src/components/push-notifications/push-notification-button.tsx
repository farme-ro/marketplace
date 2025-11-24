/**
 * Push Notification Button Component
 * 
 * Button to enable/disable push notifications
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from 'farme-ui';
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getPushSubscriptionStatus,
  isPushNotificationSupported,
  getNotificationPermission,
} from '@/lib/push-notifications';

interface PushNotificationButtonProps {
  className?: string;
}

export function PushNotificationButton({ className }: PushNotificationButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const checkSupport = async () => {
      const supported = isPushNotificationSupported();
      setIsSupported(supported);

      if (supported) {
        const perm = await getNotificationPermission();
        setPermission(perm);

        const status = await getPushSubscriptionStatus();
        setIsSubscribed(status.subscribed);
      }
    };

    checkSupport();
  }, []);

  const handleToggle = async () => {
    if (!isSupported) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSubscribed) {
        const success = await unsubscribeFromPushNotifications();
        if (success) {
          setIsSubscribed(false);
        }
      } else {
        const subscription = await subscribeToPushNotifications();
        if (subscription) {
          setIsSubscribed(true);
        }
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  if (permission === 'denied') {
    return (
      <div className={className}>
        <p className="text-sm text-gray-600">
          Notificările push au fost blocate. Activează-le din setările browser-ului.
        </p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={isSubscribed ? 'outline' : 'default'}
      className={className}
    >
      {isLoading
        ? 'Se procesează...'
        : isSubscribed
        ? 'Dezactivează notificări push'
        : 'Activează notificări push'}
    </Button>
  );
}

