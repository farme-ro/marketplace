'use client'

/**
 * Confirm Dialog Component
 * 
 * Reusable confirmation dialog for destructive actions
 * Supports optional reason/textarea for critical actions
 */

import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason?: string) => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  // Reason/textarea support
  requireReason?: boolean
  reasonLabel?: string
  reasonPlaceholder?: string
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmă',
  cancelText = 'Anulează',
  variant = 'danger',
  requireReason = false,
  reasonLabel = 'Motiv',
  reasonPlaceholder = 'Introduceți motivul acțiunii...',
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('')

  // Reset reason when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setReason('')
    }
  }, [open])

  if (!open) return null

  const variantStyles = {
    danger: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  }

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50 disabled:cursor-not-allowed',
    info: 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const canConfirm = !requireReason || reason.trim().length > 0

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(reason.trim() || undefined)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <div className={`mb-4 rounded-lg border p-4 ${variantStyles[variant]}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        </div>

        {/* Reason textarea */}
        {requireReason && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              {reasonLabel} {requireReason && <span className="text-red-600">*</span>}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required={requireReason}
            />
            {requireReason && reason.trim().length === 0 && (
              <p className="mt-1 text-xs text-red-600">Motivul este obligatoriu pentru această acțiune.</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${buttonStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

