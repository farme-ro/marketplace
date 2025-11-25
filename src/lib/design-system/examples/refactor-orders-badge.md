# Exemplu Refactorizare: Status Badge în Orders Page

## Înainte (Old Code)

```tsx
// src/app/(site)/orders/page.tsx

const statusConfig: Record<OrderStatus, { 
  icon: typeof Clock; 
  label: string; 
  color: string; 
  bg: string; 
  border: string 
}> = {
  pending: {
    icon: Clock,
    label: t('orders.status.pending', 'În așteptare'),
    color: 'text-yellow-700 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  // ... alte status-uri
}

// În render:
<span
  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
>
  <StatusIcon className="w-3.5 h-3.5" />
  {statusInfo.label}
</span>
```

## După (New Code)

```tsx
// src/app/(site)/orders/page.tsx

import { StatusBadge } from '@/components/ui/status-badge'
import { Clock, CheckCircle2, XCircle, Package, Truck } from 'lucide-react'

const statusConfig: Record<OrderStatus, { 
  variant: StatusBadgeVariant
  label: string
  icon?: LucideIcon
}> = {
  pending: {
    variant: 'pending',
    label: t('orders.status.pending', 'În așteptare'),
    icon: Clock,
  },
  confirmed: {
    variant: 'success',
    label: t('orders.status.confirmed', 'Confirmată'),
    icon: CheckCircle2,
  },
  processing: {
    variant: 'processing',
    label: t('orders.status.processing', 'În procesare'),
    icon: Package,
  },
  shipped: {
    variant: 'info',
    label: t('orders.status.shipped', 'Expediată'),
    icon: Truck,
  },
  delivered: {
    variant: 'delivered',
    label: t('orders.status.delivered', 'Livrată'),
    icon: CheckCircle2,
  },
  cancelled: {
    variant: 'cancelled',
    label: t('orders.status.cancelled', 'Anulată'),
    icon: XCircle,
  },
}

// În render:
const statusInfo = statusConfig[order.status] || statusConfig.pending

<StatusBadge 
  label={statusInfo.label}
  variant={statusInfo.variant}
  icon={statusInfo.icon}
  size="md"
/>
```

## Beneficii

1. **Consistență:** Toate badge-urile folosesc același component
2. **Mentenabilitate:** Schimbări de styling într-un singur loc
3. **Type Safety:** TypeScript verifică variant-urile valide
4. **Accessibility:** Icon-urile sunt gestionate automat
5. **Dark Mode:** Suport automat pentru dark mode

