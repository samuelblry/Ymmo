import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { agencies, regions } from '../data/agencies'
import { apiFetch } from '../lib/api'
import { mapAgency } from '../lib/dataMappers'
import { SearchIcon } from '../components/ui/icons'

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.19a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function MapPinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function AgencyCard({ agency }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm transition hover:shadow-md">
      <div className="relative">
        <img src={agency.image} alt={agency.name} className="aspect-[16/10] w-full object-cover" />
        {agency.isHQ && (
          <span className="absolute left-3 top-3 rounded-full bg-marron px-3 py-1 text-xs font-semibold text-blanc shadow-sm">
            Siège
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-blanc/95 px-3 py-1 text-xs font-medium text-noir shadow-sm">
          {agency.region}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-noir">{agency.name}</h3>
        <p className="mt-2 flex items-start gap-2 text-sm text-gris-fonce">
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-marron" />
          {agency.address}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-gris-fonce">
          <PhoneIcon className="h-4 w-4 text-marron" />
          {agency.phone}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-gris-moyen/50 pt-4">
          <span className="flex items-center gap-1.5 text-sm text-gris-fonce">
            <HomeIcon className="h-4 w-4 text-marron" />
            {agency.listings} biens
          </span>
          <Link
            to={`/agences/${agency.id}`}
            className="rounded-full bg-marron px-4 py-2 text-xs font-semibold text-blanc transition hover:bg-marron/90"
          >
            Voir l’agence
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Agences() {
  const [region, setRegion] = useState('Toutes')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(agencies)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    apiFetch('/api/agences')
      .then((data) => {
        if (!ignore) setItems(data.map(mapAgency))
      })
      .catch(() => {
        if (!ignore) setItems(agencies)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchRegion = region === 'Toutes' || a.region === region
      const matchQuery =
        !query ||
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase())
      return matchRegion && matchQuery
    })
  }, [items, region, query])

  return (
    <div className="bg-gris-clair pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#EFE7DD_0%,#F5F5F4_100%)]" />
        <img
          src="/img/cercle-3.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 w-[480px] opacity-60"
        />
        <img
          src="/img/cercle-1.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 bottom-0 w-[260px] opacity-50"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] text-noir sm:text-6xl">
            Nos <span className="font-serif text-marron">agences</span> partout en France
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gris-fonce">
            12 agences à votre service, du siège d’Aix-en-Provence aux quatre coins de l’Hexagone. Trouvez celle qui est près de chez vous.
          </p>

          <div className="mt-10 flex flex-wrap gap-8 text-noir">
            <Stat value="12" label="Agences" />
            <Stat value="8" label="Régions" />
            <Stat value="180+" label="Collaborateurs" />
            <Stat value="500+" label="Biens en portefeuille" />
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="mx-auto -mt--5 max-w-7xl px-6">
        <div className="rounded-2xl border border-gris-moyen/50 bg-blanc p-4 shadow-sm">
          <div className="flex items-center gap-3 rounded-full border border-gris-moyen/50 bg-gris-clair px-5 py-3">
            <SearchIcon className="h-4 w-4 text-gris-fonce" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une ville ou une agence..."
              className="flex-1 bg-transparent text-sm text-noir placeholder:text-gris-fonce focus:outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  region === r
                    ? 'bg-marron text-blanc shadow-sm'
                    : 'bg-gris-clair text-gris-fonce hover:bg-marron-clair hover:text-noir'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste */}
      <section className="mx-auto mt-12 max-w-7xl px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-noir">
            {filtered.length} agence{filtered.length > 1 ? 's' : ''}
            {region !== 'Toutes' && ` en ${region}`}
          </h2>
          <span className="text-sm text-gris-fonce">Trié par ville</span>
        </div>

        {loading ? (
          <p className="rounded-2xl border border-gris-moyen/50 bg-blanc p-10 text-center text-gris-fonce">
            Chargement des agences...
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-gris-moyen/50 bg-blanc p-10 text-center text-gris-fonce">
            Aucune agence ne correspond à votre recherche.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-noir p-10 text-blanc sm:p-14">
          <img
            src="/img/cercle-3.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-10 w-[420px] opacity-30"
          />
          <div className="relative max-w-xl">
            <h3 className="text-3xl font-bold sm:text-4xl">
              Vous êtes une agence ? <span className="font-serif text-marron">Rejoignez-nous.</span>
            </h3>
            <p className="mt-4 text-blanc/80">
              Intégrez le réseau Ymmo et profitez de nos outils, de notre visibilité et de notre accompagnement.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block rounded-full bg-marron px-6 py-3 text-sm font-semibold text-blanc transition hover:bg-marron/90"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-3xl font-bold text-marron">{value}</p>
      <p className="mt-1 text-sm text-gris-fonce">{label}</p>
    </div>
  )
}
