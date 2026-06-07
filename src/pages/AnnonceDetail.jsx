import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getListing, similarListings } from '../data/listings'
import { apiFetch } from '../lib/api'
import { mapListing } from '../lib/dataMappers'
import {
  HeartIcon,
  BedIcon,
  BathIcon,
  AreaIcon,
} from '../components/ui/icons'

const euro = (n) => `${new Intl.NumberFormat('fr-FR').format(n)} €`

function Star({ filled = true }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? '#A88B6A' : 'none'} stroke="#A88B6A" strokeWidth="1.5">
      <path strokeLinejoin="round" d="m12 2 3 6.9 7.5.6-5.7 5 1.7 7.5L12 18l-6.5 4 1.7-7.5L1.5 9.5l7.5-.6L12 2Z" />
    </svg>
  )
}

function Arrow({ dir = 'left' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      {dir === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}

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

function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  )
}

function TerraceIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 10h18M5 10v10M19 10v10M3 20h18M9 14h6" />
    </svg>
  )
}

export default function AnnonceDetail() {
  const { id } = useParams()
  const fallbackListing = useMemo(() => getListing(id), [id])
  const [listing, setListing] = useState(fallbackListing)
  const [loading, setLoading] = useState(true)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    apiFetch(`/api/biens/${id}`)
      .then((data) => {
        if (!ignore) {
          setListing(mapListing(data))
          setError('')
        }
      })
      .catch(() => {
        if (!ignore) setListing(fallbackListing)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [fallbackListing, id])

  if (!loading && !listing) return <Navigate to="/annonces" replace />
  if (!listing) return null
  const images = listing.images
  const next = () => setIndex((i) => (i + 1) % images.length)
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const [prenom, ...nomParts] = form.name.trim().split(/\s+/)
    try {
      await apiFetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_agence_dest: listing.agencyId,
          prenom,
          nom: nomParts.join(' ') || prenom,
          email: form.email,
          telephone: form.phone || null,
          sujet: `Annonce ${listing.id}`,
          contenu: `Je suis interesse par le bien ${listing.title}. Pourriez-vous me contacter ?`,
        }),
      })
      setSent(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="bg-gris-clair pb-24">
      {/* Galerie */}
      <section className="px-4 pt-4 sm:px-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl">
          <img
            src={images[index]}
            alt={listing.title}
            className="aspect-[16/7] w-full object-cover"
          />
          <button
            type="button"
            aria-label="Image précédente"
            onClick={prev}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-blanc/90 text-noir shadow-md transition hover:bg-blanc"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            aria-label="Image suivante"
            onClick={next}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-blanc/90 text-noir shadow-md transition hover:bg-blanc"
          >
            <Arrow dir="right" />
          </button>
          <button
            type="button"
            aria-label="Ajouter aux favoris"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blanc/90 text-noir shadow-md transition hover:text-marron"
          >
            <HeartIcon className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-blanc' : 'w-2 bg-blanc/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="mx-auto mt-10 grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px]">
        {/* Colonne gauche */}
        <div>
          <h1 className="text-3xl font-bold leading-tight text-noir sm:text-4xl">
            {listing.title} à <span className="text-marron">{listing.city}</span>
          </h1>
          <p className="mt-3 text-3xl font-bold text-marron">{euro(listing.price)}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-gris-fonce">
              <MapPinIcon className="h-4 w-4 text-marron" />
              {listing.address}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-marron-clair px-3 py-1 text-marron">
              <TagIcon className="h-4 w-4" />
              {listing.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-gris-moyen/50 bg-blanc p-4 sm:grid-cols-4">
            <Spec icon={<BedIcon className="h-5 w-5 text-marron" />} label={`${listing.beds} chambres`} />
            <Spec icon={<TerraceIcon className="h-5 w-5 text-marron" />} label={`${listing.terraces} terrasse`} />
            <Spec icon={<BathIcon className="h-5 w-5 text-marron" />} label={`${listing.baths} salles de bain`} />
            <Spec icon={<AreaIcon className="h-5 w-5 text-marron" />} label={`${listing.area} m²`} />
          </div>

          <h2 className="mt-10 text-2xl font-bold text-noir">Description</h2>
          <p className="mt-3 leading-relaxed text-gris-fonce">{listing.description}</p>

          <ul className="mt-6 grid gap-2 text-sm text-gris-fonce sm:grid-cols-2">
            {listing.details.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-marron" />
                {d}
              </li>
            ))}
          </ul>

          {/* Map placeholder */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-gris-moyen/50 bg-blanc">
            <div className="relative h-64 bg-marron-clair">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#EFE7DD_0%,#F5F5F4_100%)]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <MapPinIcon className="mx-auto h-8 w-8 text-marron" />
                <p className="mt-2 text-sm font-medium text-noir">{listing.city}</p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border-t border-gris-moyen/50 py-3 text-sm font-medium text-marron transition hover:bg-marron-clair/40"
            >
              <MapPinIcon className="h-4 w-4" />
              Voir sur Google Maps
            </a>
          </div>
        </div>

        {/* Colonne droite — agence */}
        <aside className="space-y-4">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-full bg-marron px-5 py-3 text-sm font-semibold text-blanc shadow-sm transition hover:bg-marron/90"
            >
              Contacter l’agence
            </button>
            <a
              href={`tel:${listing.agent.phone.replace(/\s/g, '')}`}
              aria-label="Appeler l'agence"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-marron text-blanc shadow-sm transition hover:bg-marron/90"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>
          </div>

          <div className="rounded-2xl border border-gris-moyen/50 bg-blanc p-5 shadow-sm">
            <h3 className="text-lg font-bold text-noir">Contacter l’agence</h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-marron-clair text-xl font-bold text-marron">
                {listing.agent.name[0]}
              </div>
              <div>
                <p className="font-semibold text-noir">{listing.agent.name}</p>
                <p className="text-xs text-gris-fonce">{listing.agent.role}</p>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < listing.agent.rating} />
                  ))}
                  <span className="ml-1 text-xs text-gris-fonce">{listing.agent.reviews} avis</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${listing.agent.phone.replace(/\s/g, '')}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-noir"
            >
              <PhoneIcon className="h-4 w-4 text-marron" />
              {listing.agent.phone}
            </a>

            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              {sent && (
                <p className="rounded-xl bg-marron-clair px-4 py-3 text-sm text-marron-fonce">
                  Message envoye a l'agence.
                </p>
              )}
              {error && (
                <p className="rounded-xl bg-marron-clair px-4 py-3 text-sm text-marron-fonce">
                  {error}
                </p>
              )}
              <input
                type="text"
                required
                placeholder="Nom et prénom"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2.5 text-sm text-noir placeholder:text-gris-fonce focus:border-marron focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2.5 text-sm text-noir placeholder:text-gris-fonce focus:border-marron focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-full border border-gris-moyen bg-blanc px-4 py-2.5 text-sm text-noir placeholder:text-gris-fonce focus:border-marron focus:outline-none"
              />
              <textarea
                rows="3"
                readOnly
                value={`Je suis intéressé par le bien situé au ${listing.address}. Pourriez-vous me contacter ?`}
                className="w-full resize-none rounded-2xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-gris-fonce focus:border-marron focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-marron px-5 py-3 text-sm font-semibold text-blanc shadow-sm transition hover:bg-marron/90"
              >
                Envoyer
              </button>
            </form>
          </div>
        </aside>
      </section>

      {/* Localisation / Biens similaires */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-noir">Biens similaires</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similarListings.map((s) => (
            <SimilarCard key={s.id} item={s} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Spec({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gris-fonce">
      {icon}
      <span>{label}</span>
    </div>
  )
}

function SimilarCard({ item }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
      <div className="relative">
        <img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
        <button
          type="button"
          aria-label="Ajouter aux favoris"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blanc/90 text-noir transition hover:text-marron"
        >
          <HeartIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-noir">{item.title}</h3>
        <p className="mt-1 text-sm text-gris-fonce">{item.city}</p>
        <p className="mt-2 text-lg font-bold text-marron">{euro(item.price)}</p>
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
            {item.extra}
          </span>
        </div>
        <Link
          to={`/annonces/${item.id}`}
          className="mt-4 block w-full rounded-full bg-marron px-4 py-2.5 text-center text-sm font-semibold text-blanc transition hover:bg-marron/90"
        >
          Voir le bien
        </Link>
      </div>
    </article>
  )
}
