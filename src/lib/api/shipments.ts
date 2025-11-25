/**
 * Shipments API
 * 
 * API layer for shipment and AWB management
 * Integrates with BackendSyncStatus for fallback mode
 */

import { apiFetch } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { DomainShipment, ShipmentStatus } from '@/lib/types/domain'

/**
 * Get shipments for logistics partner
 */
export async function getShipmentsForLogistics(): Promise<DomainShipment[]> {
  if (!isBackendSyncEnabled('shipments')) {
    return []
  }

  try {
    const response = await apiFetch<DomainShipment[]>('/logistics/shipments', {
      method: 'GET',
    })
    return response || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Shipments API] Failed to load logistics shipments:', error)
    }
    return []
  }
}

/**
 * Get shipments for producer
 */
export async function getShipmentsForProducer(): Promise<DomainShipment[]> {
  if (!isBackendSyncEnabled('shipments')) {
    return []
  }

  try {
    const response = await apiFetch<DomainShipment[]>('/producer/shipments', {
      method: 'GET',
    })
    return response || []
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Shipments API] Failed to load producer shipments:', error)
    }
    return []
  }
}

/**
 * Update shipment status
 */
export async function updateShipmentStatus(
  id: string,
  status: ShipmentStatus
): Promise<DomainShipment> {
  if (!isBackendSyncEnabled('shipments')) {
    throw new Error('Shipments feature is not enabled')
  }

  try {
    const response = await apiFetch<DomainShipment>(`/shipments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return response!
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(`[Shipments API] Failed to update shipment ${id}:`, error)
    }
    throw error
  }
}

/**
 * Assign AWB to shipment
 */
export async function assignAwbToShipment(
  id: string,
  awbNumber: string
): Promise<DomainShipment> {
  if (!isBackendSyncEnabled('shipments')) {
    throw new Error('Shipments feature is not enabled')
  }

  try {
    const response = await apiFetch<DomainShipment>(`/shipments/${id}/awb`, {
      method: 'PATCH',
      body: JSON.stringify({ awbNumber }),
    })
    return response!
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(`[Shipments API] Failed to assign AWB to shipment ${id}:`, error)
    }
    throw error
  }
}

