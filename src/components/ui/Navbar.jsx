import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/annonces', label: 'Biens' },
  { to: '/agences', label: 'Agences' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // close on navigation
  const close = () => setOpen(false)

  const handleLogout = async () => {
    close()
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-gris-clair/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight text-noir" onClick={close}>
          Ymmo
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-noir' : 'text-gris-fonce hover:text-noir'}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.type === 'employe' && (
                <Link
                  to={user.dashboardPath}
                  className="hidden rounded-full border border-marron px-5 py-2 text-sm font-semibold text-marron transition-colors hover:bg-marron hover:text-blanc sm:inline-flex"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/compte"
                className="flex items-center gap-2 rounded-full bg-marron px-5 py-2 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blanc/20 text-xs font-bold">
                  {user.firstName?.[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:inline">Mon compte</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hidden rounded-full border border-marron px-5 py-2 text-sm font-semibold text-marron transition-colors hover:bg-marron hover:text-blanc sm:inline-flex"
              >
                Créer un compte
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-marron px-5 py-2 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
              >
                Connexion
              </Link>
            </>
          )}

          {/* Burger — mobile only */}
          <button
            type="button"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full border border-gris-moyen bg-blanc md:hidden"
          >
            <span className={`h-0.5 w-4 rounded-full bg-noir transition-transform origin-center ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-0.5 w-4 rounded-full bg-noir transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-4 rounded-full bg-noir transition-transform origin-center ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-gris-moyen/40 bg-gris-clair/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto max-w-7xl space-y-1 px-6 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={close}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-marron-clair text-noir' : 'text-gris-fonce hover:bg-marron-clair/60 hover:text-noir'}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}

            <li className="my-2 border-t border-gris-moyen/40" />

            {user ? (
              <>
                {user.type === 'employe' && (
                  <li>
                    <Link
                      to={user.dashboardPath}
                      onClick={close}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-marron transition-colors hover:bg-marron-clair/60"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/compte"
                    onClick={close}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-gris-fonce transition-colors hover:bg-marron-clair/60 hover:text-noir"
                  >
                    Mon compte
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gris-fonce transition-colors hover:bg-marron-clair/60 hover:text-noir"
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={close}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-gris-fonce transition-colors hover:bg-marron-clair/60 hover:text-noir"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={close}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-marron transition-colors hover:bg-marron-clair/60"
                  >
                    Créer un compte
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
