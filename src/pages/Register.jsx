import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Reveal } from '../components/ui/Reveal'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/compte', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <Reveal className="w-full max-w-5xl overflow-hidden rounded-3xl bg-blanc shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Formulaire */}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h1 className="text-3xl font-bold text-noir">Créer un compte</h1>
            <p className="mt-2 text-sm text-gris-fonce">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-medium text-marron underline-offset-4 hover:underline">
                Se connecter
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <p className="rounded-xl border border-marron/30 bg-marron-clair px-4 py-3 text-sm text-marron-fonce">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-noir">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Jean"
                    className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-noir">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Dupont"
                    className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                  />
                </div>
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium text-noir">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="8 caractères minimum"
                  className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-noir">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-marron py-3 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
              >
                {loading ? 'Creation...' : 'Créer mon compte'}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-gris-fonce">
              En créant un compte, vous acceptez nos{' '}
              <Link to="/mentions-legales" className="underline underline-offset-4 hover:text-noir">
                conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link to="/politique-confidentialite" className="underline underline-offset-4 hover:text-noir">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>

          {/* Image */}
          <div className="relative hidden md:block">
            <img
              src="/img/feature-platform.png"
              alt="Salon moderne"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-marron-fonce/80 via-marron/30 to-transparent" />
            <div className="absolute bottom-0 right-0 p-10 text-right">
              <p className="text-3xl font-bold leading-snug text-blanc">
                Votre projet{' '}
                <span className="italic">commence ici</span>
              </p>
              <p className="mt-2 text-sm text-blanc/75">
                Rejoignez des milliers d'utilisateurs qui font confiance à Ymmo pour leurs projets immobiliers.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
