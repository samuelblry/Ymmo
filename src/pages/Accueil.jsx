import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal'
import {
  SearchIcon,
  SlidersIcon,
  HeartIcon,
  BedIcon,
  BathIcon,
  AreaIcon,
} from '../components/ui/icons'
import { latestListings, popularListings } from '../data/listings'
import { articles as blogArticles } from '../data/articles'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'
import { mapArticle, mapListing } from '../lib/dataMappers'

const euro = (n) => `${new Intl.NumberFormat('fr-FR').format(n)}€`

const degrade = 'bg-[linear-gradient(135deg,rgba(196,164,132,0.5)_0%,#C4A484_100%)]'

const iconBase = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', className: 'h-6 w-6' }
const CategoryHouseIcon = () => <svg {...iconBase}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
const CategoryAptIcon = () => <svg {...iconBase}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" /></svg>
const CategoryLandIcon = () => <svg {...iconBase}><path d="M3 20h18" /><path d="m5 20 4-12 4 6 3-4 3 10" /></svg>
const CategoryShopIcon = () => <svg {...iconBase}><path d="M3 9V7l2-4h14l2 4v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" /><path d="M5 11v9h14v-9" /><path d="M10 20v-5h4v5" /></svg>

function ListingCard({ item, isFavorite, onToggleFavorite }) {
  return (
    <Link to={`/annonces/${item.id}`} className="block overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm transition hover:shadow-md">
      <article>
        <div className="relative">
          <img
            src={item.image}
            alt={item.title}
            className="aspect-[4/3] w-full object-cover"
          />
          <button
            type="button"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite(item.id)
            }}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-blanc/90 transition-colors hover:text-marron ${
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
      </article>
    </Link>
  )
}

export default function Accueil() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [homeListings, setHomeListings] = useState([...latestListings, ...popularListings])
  const [homeArticles, setHomeArticles] = useState(blogArticles.slice(0, 3))
  const [favoriteIds, setFavoriteIds] = useState([])

  useEffect(() => {
    let ignore = false
    Promise.allSettled([
      apiFetch('/api/biens'),
      apiFetch('/api/articles'),
    ]).then(([biensResult, articlesResult]) => {
        if (ignore) return
        if (biensResult.status === 'fulfilled') {
          setHomeListings(biensResult.value.map(mapListing))
        }
        if (articlesResult.status === 'fulfilled') {
          setHomeArticles(articlesResult.value.slice(0, 3).map(mapArticle))
        }
      })
    return () => {
      ignore = true
    }
  }, [])

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
    } catch {
      setFavoriteIds((cur) => (isFavorite ? [...cur, id] : cur.filter((item) => item !== id)))
    }
  }

  const latestHomeListings = homeListings.slice(0, 3)
  const popularHomeListings = homeListings.slice(3, 6)

  return (
    <div className="pb-8">
      {/* Hero */}
      <section className="px-6 pt-6">
        <div className="relative mx-auto w-fit">
          <div className="relative">
            <img
              src="/img/hero_cut.png"
              alt="Maison moderne au crépuscule"
              className="block max-h-[460px] w-auto select-none"
            />

            <div className="pointer-events-none absolute bottom-0 left-0 h-2/3 w-[45%] bg-gradient-to-tr from-noir/55 via-noir/20 to-transparent" />

            <div className="absolute left-[4%] top-[50%] -translate-y-1/2 pr-6">
              <h1 className="text-3xl font-bold leading-[1.05] text-blanc drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                Trouvez le bien qui vous
                <br />
                correspond
              </h1>
            </div>
          </div>

          <div className="relative mt-4 flex items-center gap-3 rounded-full bg-blanc p-2 pl-6 shadow-lg md:absolute md:bottom-[-3%] md:right-[1.5%] md:mt-0 md:w-[48%]">
            <SearchIcon className="h-5 w-5 shrink-0 text-gris-fonce" />
            <input
              type="text"
              placeholder="Ville, type de bien, budget..."
              className="flex-1 bg-transparent text-sm text-noir placeholder:text-gris-fonce focus:outline-none"
            />
            <Link
              to="/annonces"
              aria-label="Voir tous les biens"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-marron text-blanc transition-opacity hover:opacity-90"
            >
              <SlidersIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Maisons', count: '+ 240 biens', icon: <CategoryHouseIcon />, type: 'Maison' },
            { label: 'Appartements', count: '+ 180 biens', icon: <CategoryAptIcon />, type: 'Appartement' },
            { label: 'Terrains', count: '+ 60 biens', icon: <CategoryLandIcon />, type: 'Terrain' },
            { label: 'Locaux pro', count: '+ 35 biens', icon: <CategoryShopIcon />, type: '' },
          ].map((c, i) => (
            <StaggerItem key={i}>
              <Link
                to={c.type ? `/annonces?type=${c.type}` : '/annonces'}
                className={`flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl p-6 text-blanc transition hover:scale-[1.02] ${degrade}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blanc/20">
                  {c.icon}
                </span>
                <p className="text-base font-semibold">{c.label}</p>
                <p className="text-xs text-blanc/80">{c.count}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA création de compte */}
      <section className="mx-auto max-w-7xl px-6 py-4">
        <Reveal className="overflow-hidden rounded-3xl bg-blanc shadow-sm">
          <div className="grid md:grid-cols-2">
            <img
              src="/img/cta-account.png"
              alt="Intérieur d'une maison"
              className="h-64 w-full object-cover md:h-full"
            />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <h2 className="text-2xl font-bold leading-snug text-noir md:text-3xl">
                Créez votre compte Ymmo et trouvez le bien qui vous correspond.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gris-fonce">
                Profitez d'une plateforme immobilière moderne qui centralise les
                annonces, simplifie la recherche et vous met en relation avec des
                agences de confiance. Accédez à des outils d'analyse du marché,
                sauvegardez vos recherches et avancez sereinement dans votre projet
                immobilier.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex w-fit rounded-full bg-marron px-6 py-3 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
              >
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Dernières annonces */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir md:text-4xl">
            <span className="font-serif text-marron">Dernières</span> annonces
          </h2>
          <p className="mt-2 text-sm text-gris-fonce">
            Découvrez les biens récemment mis en ligne par nos agences
          </p>
        </Reveal>
        <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestHomeListings.map((item, i) => (
            <StaggerItem key={i}>
              <ListingCard
                item={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Annonces populaires */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir md:text-4xl">
            Annonces <span className="font-serif text-marron">populaires</span>
          </h2>
          <p className="mt-2 text-sm text-gris-fonce">
            Les biens les plus consultés et les plus appréciés par nos utilisateurs.
          </p>
        </Reveal>
        <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularHomeListings.map((item, i) => (
            <StaggerItem key={i}>
              <ListingCard
                item={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Pourquoi choisir Ymmo */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir md:text-4xl">
            Pourquoi <span className="font-serif text-marron">choisir</span> Ymmo ?
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Reveal className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl bg-marron-clair p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marron/20">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-marron" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
            </span>
            <div>
              <h3 className="text-lg font-semibold text-noir">Sécurité &amp; fiabilité</h3>
              <p className="mt-2 text-sm text-gris-fonce">
                Vos données et vos transactions sont protégées.
              </p>
            </div>
          </Reveal>

          <Reveal className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl bg-marron-clair p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marron/20">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-marron" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9V7l2-4h14l2 4v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" />
                <path d="M5 11v9h14v-9" />
                <path d="M10 20v-5h4v5" />
              </svg>
            </span>
            <div>
              <h3 className="text-lg font-semibold text-noir">Réseau d'agences de confiance</h3>
              <p className="mt-2 text-sm text-gris-fonce">
                Des professionnels certifiés partout en France.
              </p>
            </div>
          </Reveal>

          <Reveal className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-marron-fonce p-8 text-center text-blanc md:col-start-3 md:row-span-2" style={{isolation:'isolate'}}>
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-marron opacity-30" style={{filter:'blur(40px)'}} />
            <div aria-hidden="true" className="pointer-events-none absolute right-5 top-5 h-8 w-8 rounded-full bg-marron opacity-50" style={{filter:'blur(6px)'}} />
            <div className="relative">
              <h3 className="text-xl font-semibold">Analyse du marché immobilier</h3>
              <p className="mt-3 text-sm text-blanc/80">
                Des données pour prendre les bonnes décisions.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-blanc/75">
                Ymmo exploite les données du marché afin de vous fournir des
                indicateurs clés, des tendances et des estimations pour optimiser vos
                projets d'achat ou de vente.
              </p>
            </div>
          </Reveal>

          <Reveal className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-2xl p-8 text-center text-blanc md:col-span-2">
            <img
              src="/img/feature-platform.png"
              alt="Salon moderne"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-noir/55" />
            <div className="relative">
              <h3 className="text-lg font-semibold">
                Plateforme moderne et performante
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-blanc/85">
                Conçue avec des technologies modernes, la plateforme Ymmo offre une
                navigation fluide, accessible sur tous les appareils et optimisée pour
                la performance.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA connexion */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir md:text-4xl">
            Prêt à concrétiser votre projet immobilier ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gris-fonce">
            Connectez-vous ou créez votre compte pour accéder à l'ensemble des
            annonces, sauvegarder vos recherches et contacter les agences en toute
            simplicité.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex rounded-full bg-marron px-6 py-3 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
          >
            Se connecter
          </Link>
        </Reveal>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir md:text-4xl">
            Le <span className="font-serif text-marron">journal</span> Ymmo
          </h2>
          <p className="mt-2 text-sm text-gris-fonce">
            Analyses, conseils d'experts et regards sur l'immobilier français.
          </p>
        </Reveal>
        <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
          {homeArticles.map((a) => (
            <StaggerItem key={a.id}>
              <Link to={`/blog/${a.id}`} className="group relative block h-72 overflow-hidden rounded-2xl">
                <img
                  src={a.image}
                  alt={a.titre}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-blanc">
                  <h3 className="text-lg font-semibold leading-snug">
                    {a.titre}
                  </h3>
                  <span className="mt-2 inline-block text-sm text-blanc/85 underline underline-offset-4 group-hover:text-blanc">
                    Lire l'article
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  )
}
