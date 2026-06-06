import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-32 text-center">
      <h1 className="text-6xl font-black text-noir">404</h1>
      <p className="mt-4 text-gris-fonce">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-marron px-6 py-3 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
