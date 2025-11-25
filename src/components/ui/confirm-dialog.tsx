/**
 * Confirm Dialog Component
 * 
 * Reusable confirmation dialog for destructive actions
 * Uses i18n for all text
 */

'use client'

import { useState } from 'react'
import { Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils/cn'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'default'
  className?: string
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'destructive',
  className,
}: ConfirmDialogProps) {
  const { t } = useI18n()

  if (!open) return null

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={cn(
          'relative bg-background border border-border rounded-lg shadow-lg p-6 max-w-md w-full mx-4',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="confirm-dialog-title"
          className="text-lg font-semibold text-foreground mb-2"
        >
          {title || t('actions.confirmDeleteTitle', 'Confirmă ștergerea')}
        </h3>
        <p
          id="confirm-dialog-description"
          className="text-sm text-foreground-body mb-6"
        >
          {message || t('actions.confirmDelete', 'Ești sigur că vrei să continui?')}
        </p>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-w-[100px]"
          >
            {cancelText || t('actions.cancel', 'Anulează')}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            className="min-w-[100px]"
          >
            {confirmText || t('actions.confirm', 'Confirmă')}
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook for using confirmation dialog
 */
export function useConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<{
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    variant?: 'destructive' | 'default'
    onConfirm?: () => void
  }>({})

  const confirm = (
    onConfirm: () => void,
    options?: {
      title?: string
      message?: string
      confirmText?: string
      cancelText?: string
      variant?: 'destructive' | 'default'
    }
  ) => {
    setConfig({
      ...options,
      onConfirm,
    })
    setOpen(true)
  }

  const handleConfirm = () => {
    config.onConfirm?.()
    setOpen(false)
  }

  const dialog = (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      onConfirm={handleConfirm}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      variant={config.variant}
    />
  )

  return { confirm, dialog }
}

