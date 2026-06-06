import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const b = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }

const LogOutIcon = (p) => (
  <svg {...b} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export function KpiCard({ label, value, sub, Icon }) {
  return (
    <div className="rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gris-fonce">{label}</p>
          <p className="mt-1 text-3xl font-bold text-noir">{value}</p>
          {sub && <p className="mt-1 text-xs text-gris-fonce">{sub}</p>}
        </div>
        {Icon && (
          <div className="shrink-0 rounded-xl bg-marron-clair p-2.5">
            <Icon className="h-5 w-5 text-marron" />
          </div>
        )}
      </div>
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-noir/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-blanc p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-noir">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gris-fonce transition hover:bg-gris-clair hover:text-noir"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-noir">{title}</h1>
      {actionLabel && (
        <button
          onClick={onAction}
          className="rounded-full bg-marron px-5 py-2.5 text-sm font-semibold text-blanc transition hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default function DashboardLayout({ roleLabel, tabs, activeTab, onTabChange, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex bg-gris-clair">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gris-moyen/50 bg-blanc p-6 lg:flex">
        <div className="border-b border-gris-moyen/50 pb-6">
          <span className="inline-block rounded-full bg-marron px-3 py-1 text-xs font-semibold text-blanc">
            {roleLabel}
          </span>
          <p className="mt-3 font-semibold text-noir">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gris-fonce">{user?.agence ?? 'Ymmo'}</p>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-marron-clair text-marron'
                  : 'text-gris-fonce hover:bg-gris-clair hover:text-noir'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gris-fonce transition-colors hover:bg-gris-clair hover:text-noir"
        >
          <LogOutIcon className="h-4 w-4" />
          Déconnexion
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex gap-1 overflow-x-auto border-b border-gris-moyen/50 bg-blanc px-4 py-3 lg:hidden">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === id ? 'bg-marron text-blanc' : 'text-gris-fonce hover:text-noir'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
