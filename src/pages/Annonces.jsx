import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { allListings } from '../data/listings'
import { apiFetch } from '../lib/api'
import { mapListing } from '../lib/dataMappers'
import {
  SearchIcon,
  HeartIcon,
  BedIcon,
  BathIcon,
  AreaIcon,
} from '../components/ui/icons'

const euro = (n) => `${new Intl.NumberFormat('fr-FR').format(n)}€`

const types = ['Maison', 'Appartement', 'Terrain']
const pieces = ['1', '2', '3', '4+']
const extras = ['Jardin', 'Terrasse', 'Balcon', 'Garage', 'Piscine', 'Ascenseur']

function Radio({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gris-fonce">
      <span
        onClick={onChange}
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          checked ? 'border-marron' : 'border-gris-moyen'
        }`}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-marron" />}
      </span>
      {label}
    </label>
  )
}

function Check({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gris-fonce">
      <span
        onClick={onChange}
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked ? 'border-marron bg-marron text-blanc' : 'border-gris-moyen bg-blanc'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      {label}
    </label>
  )
}

function ListingCard({ item, isFavorite, onToggleFavorite }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
      <Link to={`/annonces/${item.id}`} className="block">
        <div className="relative">
          <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover" />
          <button
            type="button"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite(item.id)
            }}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blanc/90 transition hover:text-marron ${
              isFavorite ? 'text-marron' : 'text-noir'
            }`}
          >
            <HeartIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-noir">{item.title}</h3>
          <p className="mt-1 text-xl font-bold text-marron">{euro(item.price)}</p>
          <p className="mt-1 text-sm text-gris-fonce">{item.address}</p>
          <div className="mt-4 flex items-center gap-5 border-t border-gris-moyen/50 pt-4 text-sm text-gris-fonce">
            <span className="flex items-center gap-1.5">
              <BedIcon className="h-4 w-4 text-marron" />
              {item.beds}
            </span>
            <span className="flex items-center gap-1.5">
              <BathIcon className="h-4 w-4 text-marron" />
              {item.baths}
            </span>
            <span className="flex items-center gap-1.5">
              <AreaIcon className="h-4 w-4 text-marron" />
              {item.area}m²
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function Annonces() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [type, setType] = useState('')
  const [piece, setPiece] = useState('')
  const [city, setCity] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [surfaceMin, setSurfaceMin] = useState('')
  const [surfaceMax, setSurfaceMax] = useState('')
  const [search, setSearch] = useState('')
  const [selectedExtras, setSelectedExtras] = useState([])
  const [page, setPage] = useState(1)
  const [listings, setListings] = useState(allListings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favoriteIds, setFavoriteIds] = useState([])

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (city) params.set('ville', city)
    if (priceMin) params.set('prix_min', priceMin)
    if (priceMax) params.set('prix_max', priceMax)
    if (surfaceMin) params.set('surface_min', surfaceMin)
    if (surfaceMax) params.set('surface_max', surfaceMax)
    if (piece) params.set('nb_pieces', piece.replace('+', ''))
    return params.toString()
  }, [city, piece, priceMax, priceMin, surfaceMax, surfaceMin, type])

  useEffect(() => {
    let ignore = false
    setLoading(true)
    apiFetch(`/api/biens${queryString ? `?${queryString}` : ''}`)
      .then((data) => {
        if (!ignore) {
          setListings(data.map(mapListing))
          setError('')
          setPage(1)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setListings(allListings)
          setError(err.message)
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [queryString])

  useEffect(() => {
    if (user?.type !== 'user') {
      setFavoriteIds([])
      return
    }
    let ignore = false
    apiFetch('/api/favoris/biens')
      .then((data) => {
        if (!ignore) setFavoriteIds(data.map((item) => item.id_bien))
      })
      .catch(() => {
        if (!ignore) setFavoriteIds([])
      })
    return () => {
      ignore = true
    }
  }, [user])

  const toggleFavorite = async (id) => {
    if (user?.type !== 'user') {
      navigate('/login')
      return
    }
    const isFavorite = favoriteIds.includes(id)
    setFavoriteIds((cur) => (isFavorite ? cur.filter((item) => item !== id) : [...cur, id]))
    try {
      await apiFetch(`/api/favoris/biens/${id}`, { method: isFavorite ? 'DELETE' : 'POST' })
    } catch (err) {
      setFavoriteIds((cur) => (isFavorite ? [...cur, id] : cur.filter((item) => item !== id)))
      setError(err.message)
    }
  }

  const toggleExtra = (e) =>
    setSelectedExtras((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]))

  const reset = () => {
    setType('')
    setPiece('')
    setCity('')
    setPriceMin('')
    setPriceMax('')
    setSurfaceMin('')
    setSurfaceMax('')
    setSearch('')
    setSelectedExtras([])
  }

  const visibleListings = listings.filter((item) => {
    if (!search) return true
    const value = search.toLowerCase()
    return [item.title, item.city, item.type, item.address].some((field) => field?.toLowerCase().includes(value))
  })

  return (
    <div className="bg-gris-clair pb-20">
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <h1 className="text-5xl font-bold leading-tight text-noir">
          <span className="font-serif text-marron">Biens</span> disponibles
        </h1>
        <p className="mt-3 text-gris-fonce">
          Trouvez facilement votre futur bien grâce à nos filtres et à nos annonces vérifiées.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-8 px-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Filtres */}
        <aside className="self-start rounded-2xl border border-gris-moyen/50 bg-blanc p-6 shadow-sm">
          <h2 className="border-b border-gris-moyen/50 pb-3 text-lg font-bold text-noir">Filtres</h2>

          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-noir">Type de bien</h3>
            <div className="space-y-2">
              {types.map((t) => (
                <Radio key={t} label={t} checked={type === t} onChange={() => setType(type === t ? '' : t)} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-noir">Ville</h3>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Entrez une ville"
              className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm text-noir placeholder:text-gris-fonce focus:border-marron focus:outline-none"
            />
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-noir">Budget</h3>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Minimum"
                  className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm placeholder:text-gris-fonce focus:border-marron focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gris-fonce">€</span>
              </div>
              <span className="text-gris-fonce">-</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Maximum"
                  className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm placeholder:text-gris-fonce focus:border-marron focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gris-fonce">€</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-noir">Surface</h3>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={surfaceMin}
                  onChange={(e) => setSurfaceMin(e.target.value)}
                  placeholder="Minimum"
                  className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm placeholder:text-gris-fonce focus:border-marron focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gris-fonce">m²</span>
              </div>
              <span className="text-gris-fonce">-</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={surfaceMax}
                  onChange={(e) => setSurfaceMax(e.target.value)}
                  placeholder="Maximum"
                  className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm placeholder:text-gris-fonce focus:border-marron focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gris-fonce">m²</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-noir">Pièces</h3>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {pieces.map((p) => (
                <Radio key={p} label={p} checked={piece === p} onChange={() => setPiece(piece === p ? '' : p)} />
              ))}
            </div>
          </div>

          <div className="mt-6 border-b border-gris-moyen/50 pb-6">
            <h3 className="mb-3 text-sm font-semibold text-noir">Extras</h3>
            <div className="space-y-2">
              {extras.map((e) => (
                <Check
                  key={e}
                  label={e}
                  checked={selectedExtras.includes(e)}
                  onChange={() => toggleExtra(e)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-full bg-[linear-gradient(135deg,#C4A484_0%,#A88B6A_100%)] px-5 py-2.5 text-sm font-semibold text-blanc shadow-sm transition hover:opacity-90"
          >
            Appliquer
          </button>
          <button
            type="button"
            onClick={reset}
            className="mt-3 w-full rounded-full border border-gris-moyen bg-blanc px-5 py-2.5 text-sm font-semibold text-noir transition hover:bg-gris-clair"
          >
            Réinitialiser
          </button>
        </aside>

        {/* Liste */}
        <div>
          <div className="flex items-center gap-3 rounded-full border border-gris-moyen/50 bg-blanc px-5 py-3 shadow-sm">
            <SearchIcon className="h-4 w-4 text-gris-fonce" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ville, type de bien, budget..."
              className="flex-1 bg-transparent text-sm text-noir placeholder:text-gris-fonce focus:outline-none"
            />
            <span className="hidden text-sm text-gris-fonce sm:inline">Trier par :</span>
            <select className="cursor-pointer bg-transparent text-sm font-medium text-noir focus:outline-none">
              <option>Popularité</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Plus récent</option>
            </select>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-marron/30 bg-marron-clair px-5 py-3 text-sm text-marron-fonce">
              API indisponible, affichage des donnees locales.
            </p>
          )}

          {loading ? (
            <p className="mt-6 rounded-2xl border border-gris-moyen/50 bg-blanc p-10 text-center text-gris-fonce">
              Chargement des annonces...
            </p>
          ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {visibleListings.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          )}

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full px-4 py-2 text-sm text-gris-fonce transition hover:text-noir"
            >
              ← Précédent
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
                  page === p
                    ? 'bg-marron text-blanc shadow-sm'
                    : 'bg-blanc text-noir hover:bg-marron-clair'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full px-4 py-2 text-sm text-gris-fonce transition hover:text-noir"
            >
              Suivant →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
