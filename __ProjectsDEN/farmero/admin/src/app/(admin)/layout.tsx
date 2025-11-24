import { RequireAdmin } from '@/components/auth/RequireAdmin'
import { AdminTopbar } from '@/components/layout/AdminTopbar'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminI18nProvider } from '@/lib/i18n/context'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAdmin>
      <AdminI18nProvider>
        <div className="flex min-h-screen flex-col">
          <AdminTopbar />
          <div className="flex flex-1">
            <AdminSidebar />
            <main className="flex-1 md:ml-64">
              <div className="p-4 md:p-6 lg:p-8">{children}</div>
            </main>
          </div>
        </div>
      </AdminI18nProvider>
    </RequireAdmin>
  )
}

