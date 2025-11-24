/**
 * Config Page
 * 
 * System configuration and status
 */

export default function ConfigPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'development'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurare</h1>
        <p className="text-muted-foreground">Setări sistem și status</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Configurare API</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                API URL:
              </dt>
              <dd className="text-sm text-foreground">{apiUrl}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-muted-foreground">
                Environment:
              </dt>
              <dd className="text-sm text-foreground">{appEnv}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Status</h2>
          <p className="text-sm text-muted-foreground">
            Link către Feature Flags / Status va fi disponibil aici când backend-ul
            va expune endpoint-ul <code>/internal/status</code> sau{' '}
            <code>/admin/status</code>.
          </p>
        </div>
      </div>
    </div>
  )
}

