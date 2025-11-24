/**
 * Backend Status Banner
 * 
 * Global banner that shows when backend is down
 * Uses the status page health check
 */

'use client'

import { useState, useEffect } from 'react'
import { Alert } from 'farme-ui'
import { checkBackendHealth } from '@/lib/api/health'

export function BackendStatusBanner() {
  const [isBackendDown, setIsBackendDown] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkBackend() {
      try {
        const health = await checkBackendHealth()
        const backendOk = health.api === 'ok' || health.status === 'ok'
        setIsBackendDown(!backendOk)
      } catch {
        setIsBackendDown(true)
      } finally {
        setIsChecking(false)
      }
    }

    // Check immediately
    checkBackend()

    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isChecking || !isBackendDown) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
        <div className="container mx-auto px-4">
          <p className="font-semibold">Sistem în mentenanță</p>
          <p className="text-sm mt-1">
            Ne pare rău, serverul nu răspunde momentan. Te rugăm să încerci din nou mai târziu.
          </p>
        </div>
      </Alert>
    </div>
  )
}

