import { Link, useParams, Navigate } from 'react-router-dom'
import { agencies } from '../data/agencies'
import { agenciesContent } from '../data/agenciesContent'
import { getListingsByAgency } from '../data/listings'
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal'
import { BedIcon, BathIcon, AreaIcon } from '../components/ui/icons'

/* ── icônes ── */
const MapPinIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const PhoneIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
)
const MailIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const ClockIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
)
const HomeIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" />
  </svg>
)
const ArrowLeftIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)
const CheckIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export default function AgenceDetail() {
  const { id } = useParams()
  const agency = agencies.find((a) => a.id === Number(id))
  const content = agenciesContent[Number(id)]

  if (!agency || !content) return <Navigate to="/agences" replace />

  const others = agencies.filter((a) => a.region === agency.region && a.id !== agency.id).slice(0, 3)
  const listings = getListingsByAgency(agency.id)

  return (
    <div className="pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link
          to="/agences"
          className="inline-flex items-center gap-2 text-sm text-gris-fonce transition-colors hover:text-noir"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Toutes les agences
        </Link>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <Reveal className="relative overflow-hidden rounded-3xl">
          <img
            src={content.heroImage}
            alt={agency.name}
            className="aspect-[21/7] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3">
              {agency.isHQ && (
                <span className="rounded-full bg-marron px-3 py-1 text-xs font-semibold text-blanc">
                  Siège social
                </span>
              )}
              <span className="rounded-full bg-blanc/20 px-3 py-1 text-xs font-medium text-blanc backdrop-blur-sm">
                {agency.region}
              </span>
            </div>
            <h1 className="mt-3 text-4xl font-bold text-blanc md:text-5xl">{agency.name}</h1>
            <p className="mt-2 max-w-xl text-blanc/80">{content.description}</p>
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 pt-8">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {content.highlights.map(({ value, label }) => (
            <StaggerItem key={label}>
              <div className="rounded-2xl bg-blanc p-5 text-center shadow-sm">
                <p className="text-3xl font-bold text-marron">{value}</p>
                <p className="mt-1 text-sm text-gris-fonce">{label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Contenu principal */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* À propos + spécialités + équipe — 2/3 */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* À propos */}
            <Reveal className="rounded-3xl bg-blanc p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-noir">À propos de l'agence</h2>
              <p className="mt-4 leading-relaxed text-gris-fonce">{content.about}</p>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gris-fonce">Nos spécialités</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {content.specialties.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 rounded-full bg-marron-clair px-4 py-1.5 text-sm font-medium text-noir">
                      <CheckIcon className="h-3.5 w-3.5 text-marron" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Équipe */}
            <Reveal>
              <h2 className="text-2xl font-bold text-noir">Notre équipe</h2>
              <Stagger className="mt-5 grid gap-4 sm:grid-cols-3">
                {content.team.map(({ name, role, image }) => (
                  <StaggerItem key={name}>
                    <div className="overflow-hidden rounded-2xl bg-blanc shadow-sm">
                      <img src={image} alt={name} className="aspect-[4/3] w-full object-cover" />
                      <div className="p-4">
                        <p className="font-semibold text-noir">{name}</p>
                        <p className="mt-0.5 text-sm text-gris-fonce">{role}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            {/* Galerie */}
            <Reveal>
              <h2 className="text-2xl font-bold text-noir">Galerie</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {content.gallery.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Vue ${i + 1} — ${agency.name}`}
                    className={`w-full rounded-2xl object-cover ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'}`}
                  />
                ))}
              </div>
            </Reveal>
          </div>

          {/* Infos pratiques — 1/3 */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Reveal className="rounded-3xl bg-blanc p-6 shadow-sm">
              <h2 className="font-bold text-noir">Informations pratiques</h2>

              <div className="mt-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marron-clair">
                    <MapPinIcon className="h-4 w-4 text-marron" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gris-fonce">Adresse</p>
                    <p className="mt-0.5 text-sm font-medium text-noir">{agency.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marron-clair">
                    <PhoneIcon className="h-4 w-4 text-marron" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gris-fonce">Téléphone</p>
                    <a href={`tel:${agency.phone}`} className="mt-0.5 text-sm font-medium text-noir hover:text-marron">
                      {agency.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marron-clair">
                    <MailIcon className="h-4 w-4 text-marron" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gris-fonce">E-mail</p>
                    <a href={`mailto:${content.email}`} className="mt-0.5 text-sm font-medium text-noir hover:text-marron">
                      {content.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marron-clair">
                    <HomeIcon className="h-4 w-4 text-marron" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gris-fonce">Biens en portefeuille</p>
                    <p className="mt-0.5 text-sm font-medium text-noir">{agency.listings} biens actifs</p>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div className="mt-6 border-t border-gris-moyen/40 pt-5">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-marron" />
                  <p className="text-sm font-semibold text-noir">Horaires d'ouverture</p>
                </div>
                <ul className="mt-3 space-y-2">
                  {content.hours.map(({ days, time }) => (
                    <li key={days} className="flex items-center justify-between text-sm">
                      <span className="text-gris-fonce">{days}</span>
                      <span className={`font-medium ${time === 'Fermé' ? 'text-gris-fonce' : 'text-noir'}`}>{time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/contact"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-marron py-3 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
              >
                Contacter l'agence
              </Link>
            </Reveal>

            {/* Agences de la même région */}
            {others.length > 0 && (
              <Reveal className="rounded-3xl bg-marron-clair p-6">
                <h3 className="font-semibold text-noir">Agences en {agency.region}</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {others.map((a) => (
                    <Link
                      key={a.id}
                      to={`/agences/${a.id}`}
                      className="flex items-center justify-between rounded-xl bg-blanc px-4 py-3 text-sm transition-shadow hover:shadow-sm"
                    >
                      <div>
                        <p className="font-medium text-noir">{a.city}</p>
                        <p className="text-xs text-gris-fonce">{a.listings} biens</p>
                      </div>
                      <span className="text-marron">→</span>
                    </Link>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
      {/* Biens disponibles */}
      {listings.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-16">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-marron">Disponible</p>
              <h2 className="mt-2 text-3xl font-bold text-noir md:text-4xl">
                Biens en <span className="font-serif text-marron">portefeuille</span>
              </h2>
              <p className="mt-1 text-sm text-gris-fonce">
                {listings.length} bien{listings.length > 1 ? 's' : ''} proposé{listings.length > 1 ? 's' : ''} par {agency.name}
              </p>
            </div>
            <Link
              to="/annonces"
              className="hidden shrink-0 rounded-full border border-gris-moyen px-5 py-2.5 text-sm font-medium text-noir transition-colors hover:border-marron hover:text-marron md:inline-flex"
            >
              Voir toutes les annonces
            </Link>
          </Reveal>

          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((item) => (
              <StaggerItem key={item.id}>
                <Link to={`/annonces/${item.id}`} className="block group overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-noir/70 px-3 py-1 text-xs font-medium text-blanc backdrop-blur-sm">
                      {item.type}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold leading-snug text-noir">{item.title}</p>
                    <p className="mt-1 text-xs text-gris-fonce">{item.address}</p>
                    <p className="mt-2 text-lg font-bold text-marron">{item.priceLabel}</p>
                    {item.beds > 0 && (
                      <div className="mt-3 flex items-center gap-4 border-t border-gris-moyen/40 pt-3 text-xs text-gris-fonce">
                        <span className="flex items-center gap-1"><BedIcon className="h-3.5 w-3.5 text-marron" />{item.beds} ch.</span>
                        <span className="flex items-center gap-1"><BathIcon className="h-3.5 w-3.5 text-marron" />{item.baths} sdb.</span>
                        <span className="flex items-center gap-1"><AreaIcon className="h-3.5 w-3.5 text-marron" />{item.area} m²</span>
                      </div>
                    )}
                    {item.beds === 0 && (
                      <div className="mt-3 flex items-center gap-1 border-t border-gris-moyen/40 pt-3 text-xs text-gris-fonce">
                        <AreaIcon className="h-3.5 w-3.5 text-marron" />{item.area} m²
                      </div>
                    )}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/annonces"
              className="inline-flex rounded-full border border-gris-moyen px-6 py-2.5 text-sm font-medium text-noir transition-colors hover:border-marron hover:text-marron"
            >
              Voir toutes les annonces
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
