import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Reveal } from '../components/ui/Reveal'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ firstName: 'Jean', lastName: 'Dupont', email: form.email })
    const from = location.state?.from?.pathname ?? '/compte'
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <Reveal className="w-full max-w-5xl overflow-hidden rounded-3xl bg-blanc shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative hidden md:block">
            <img
              src="/img/cta-account.png"
              alt="Intérieur d'une maison"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-marron-fonce/80 via-marron/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10">
              <p className="text-3xl font-bold leading-snug text-blanc">
                Bienvenue sur{' '}
                <span className="italic">Ymmo</span>
              </p>
              <p className="mt-2 text-sm text-blanc/75">
                Accédez à votre espace personnel et gérez vos projets immobiliers.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h1 className="text-3xl font-bold text-noir">Connexion</h1>
            <p className="mt-2 text-sm text-gris-fonce">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-medium text-marron underline-offset-4 hover:underline">
                S'inscrire
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-noir">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-noir">
                    Mot de passe
                  </label>
                  <Link to="/contact" className="text-xs text-gris-fonce underline-offset-4 hover:text-marron hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-marron py-3 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
              >
                Se connecter
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-gris-fonce">
              En vous connectant, vous acceptez nos{' '}
              <Link to="/mentions-legales" className="underline underline-offset-4 hover:text-noir">
                conditions d'utilisation
              </Link>
              .
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
