import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal'
import { HeartIcon, BedIcon, BathIcon, AreaIcon } from '../components/ui/icons'

/* ── icônes ── */
const UserIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const BellIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const SearchIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
)
const LogOutIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const TrashIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
)
const ArrowRightIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)
const EditIcon = (p) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </svg>
)

/* ── données mock ── */
const mockFavoris = [
  { id: 1, title: 'Villa moderne avec piscine', price: 620000, address: 'Aix-en-Provence, 13100', area: 180, beds: 5, baths: 2, image: '/img/listing-1.png', type: 'Maison' },
  { id: 2, title: 'Appartement T4 vue mer', price: 385000, address: 'Marseille, 13008', area: 94, beds: 4, baths: 1, image: '/img/listing-2.png', type: 'Appartement' },
  { id: 3, title: 'Maison de village avec jardin', price: 295000, address: 'Aix-en-Provence, 13090', area: 120, beds: 3, baths: 2, image: '/img/listing-1.png', type: 'Maison' },
]

const mockRecherches = [
  { id: 1, label: 'Appartements à Lyon', details: '2–4 pièces · max 300 000 €', date: 'Il y a 2 jours', count: 18 },
  { id: 2, label: 'Maisons à Bordeaux', details: '4+ pièces · max 500 000 €', date: 'Il y a 1 semaine', count: 7 },
]

const mockAlertes = []

const euro = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €'

const TABS = [
  { id: 'profil', label: 'Profil', icon: UserIcon, count: null },
  { id: 'favoris', label: 'Favoris', icon: HeartIcon, count: mockFavoris.length },
  { id: 'recherches', label: 'Recherches', icon: SearchIcon, count: mockRecherches.length },
  { id: 'alertes', label: 'Alertes', icon: BellIcon, count: mockAlertes.length },
]

/* ── sous-composants ── */
function FavorisTab() {
  const [favoris, setFavoris] = useState(mockFavoris)
  const remove = (id) => setFavoris((f) => f.filter((x) => x.id !== id))

  if (favoris.length === 0)
    return (
      <EmptyState
        icon={HeartIcon}
        title="Aucun favori pour l'instant"
        text="Explorez nos annonces et ajoutez des biens à vos favoris pour les retrouver ici."
        cta="Voir les annonces"
        to="/annonces"
      />
    )

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2">
      {favoris.map((item) => (
        <StaggerItem key={item.id}>
          <article className="group relative overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc transition-shadow hover:shadow-md">
            <div className="relative">
              <img src={item.image} alt={item.title} className="aspect-[16/9] w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-noir/70 px-3 py-1 text-xs font-medium text-blanc backdrop-blur-sm">
                {item.type}
              </span>
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label="Retirer des favoris"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blanc/90 text-marron transition-colors hover:bg-marron hover:text-blanc"
              >
                <HeartIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="font-semibold text-noir">{item.title}</p>
              <p className="mt-0.5 text-sm text-gris-fonce">{item.address}</p>
              <p className="mt-2 text-lg font-bold text-marron">{euro(item.price)}</p>
              <div className="mt-3 flex items-center gap-4 border-t border-gris-moyen/40 pt-3 text-xs text-gris-fonce">
                <span className="flex items-center gap-1"><BedIcon className="h-3.5 w-3.5 text-marron" />{item.beds} ch.</span>
                <span className="flex items-center gap-1"><BathIcon className="h-3.5 w-3.5 text-marron" />{item.baths} sdb.</span>
                <span className="flex items-center gap-1"><AreaIcon className="h-3.5 w-3.5 text-marron" />{item.area} m²</span>
              </div>
              <Link
                to={`/annonces/${item.id}`}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-marron transition-opacity hover:opacity-70"
              >
                Voir l'annonce <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function RecherchesTab() {
  const [recherches, setRecherches] = useState(mockRecherches)
  const remove = (id) => setRecherches((r) => r.filter((x) => x.id !== id))

  if (recherches.length === 0)
    return (
      <EmptyState
        icon={SearchIcon}
        title="Aucune recherche sauvegardée"
        text="Lancez une recherche et sauvegardez-la pour être notifié des nouvelles annonces correspondantes."
        cta="Rechercher un bien"
        to="/annonces"
      />
    )

  return (
    <Stagger className="flex flex-col gap-3">
      {recherches.map((r) => (
        <StaggerItem key={r.id}>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-gris-moyen/40 bg-blanc px-5 py-4 transition-shadow hover:shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marron-clair">
                <SearchIcon className="h-4 w-4 text-marron" />
              </span>
              <div>
                <p className="font-semibold text-noir">{r.label}</p>
                <p className="mt-0.5 text-xs text-gris-fonce">{r.details} · {r.date}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full bg-marron-clair px-3 py-1 text-xs font-semibold text-marron">
                {r.count} biens
              </span>
              <Link
                to="/annonces"
                className="rounded-full bg-marron px-4 py-1.5 text-xs font-semibold text-blanc transition-opacity hover:opacity-90"
              >
                Voir
              </Link>
              <button
                type="button"
                onClick={() => remove(r.id)}
                aria-label="Supprimer la recherche"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gris-fonce transition-colors hover:bg-gris-clair hover:text-noir"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function AlertesTab() {
  return (
    <EmptyState
      icon={BellIcon}
      title="Aucune alerte active"
      text="Activez des alertes e-mail pour recevoir les nouvelles annonces correspondant à vos critères directement dans votre boîte mail."
      cta="Créer une alerte"
      to="/annonces"
    />
  )
}

function ProfilTab({ user }) {
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName, email: user.email })
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const fields = [
    { name: 'firstName', label: 'Prénom', type: 'text' },
    { name: 'lastName', label: 'Nom', type: 'text' },
    { name: 'email', label: 'Adresse e-mail', type: 'email' },
  ]

  return (
    <Reveal className="rounded-2xl border border-gris-moyen/40 bg-blanc p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-noir">Informations personnelles</h3>
        <button
          type="button"
          onClick={() => setEdit((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-gris-moyen px-4 py-1.5 text-xs font-medium text-noir transition-colors hover:border-marron hover:text-marron"
        >
          <EditIcon className="h-3.5 w-3.5" />
          {edit ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {edit ? (
        <form onSubmit={(e) => { e.preventDefault(); setEdit(false) }} className="mt-5 space-y-4">
          {fields.map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-xs font-medium uppercase tracking-widest text-gris-fonce">{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={change}
                className="mt-1.5 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-2.5 text-sm text-noir focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-gris-fonce">Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="Laisser vide pour ne pas changer"
              className="mt-1.5 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-2.5 text-sm text-noir placeholder:text-gris-fonce/50 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
            />
          </div>
          <button type="submit" className="mt-2 rounded-full bg-marron px-6 py-2.5 text-sm font-semibold text-blanc transition-opacity hover:opacity-90">
            Enregistrer
          </button>
        </form>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Prénom', value: form.firstName },
            { label: 'Nom', value: form.lastName },
            { label: 'E-mail', value: form.email },
            { label: 'Mot de passe', value: '••••••••' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-gris-clair px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-gris-fonce">{label}</p>
              <p className="mt-1 text-sm font-semibold text-noir">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-gris-moyen/40 pt-5">
        <h3 className="font-bold text-noir">Zone de danger</h3>
        <p className="mt-1 text-sm text-gris-fonce">La suppression de votre compte est irréversible.</p>
        <button
          type="button"
          className="mt-4 rounded-full border border-gris-moyen px-5 py-2 text-sm font-medium text-gris-fonce transition-colors hover:border-red-400 hover:text-red-500"
        >
          Supprimer mon compte
        </button>
      </div>
    </Reveal>
  )
}

function EmptyState({ icon: Icon, title, text, cta, to }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gris-moyen py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-marron-clair">
        <Icon className="h-6 w-6 text-marron" />
      </span>
      <p className="mt-4 font-semibold text-noir">{title}</p>
      <p className="mx-auto mt-2 max-w-xs text-sm text-gris-fonce">{text}</p>
      <Link
        to={to}
        className="mt-6 rounded-full bg-marron px-6 py-2.5 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
      >
        {cta}
      </Link>
    </div>
  )
}

/* ── page principale ── */
export default function Compte() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profil')

  const handleLogout = () => { logout(); navigate('/') }
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()

  const tabContent = {
    favoris: <FavorisTab />,
    recherches: <RecherchesTab />,
    alertes: <AlertesTab />,
    profil: <ProfilTab user={user} />,
  }

  return (
    <div className="min-h-screen bg-gris-clair pb-20">
      {/* Hero compte */}
      <div className="bg-blanc">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-marron text-2xl font-bold text-blanc ring-4 ring-marron/20">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-blanc bg-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-noir">{user.firstName} {user.lastName}</p>
                <p className="mt-0.5 text-sm text-gris-fonce">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-fit items-center gap-2 rounded-full border border-gris-moyen px-5 py-2.5 text-sm font-medium text-gris-fonce transition-colors hover:border-noir hover:text-noir"
            >
              <LogOutIcon className="h-4 w-4" />
              Se déconnecter
            </button>
          </Reveal>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gris-moyen/40 pt-8">
            {[
              { label: 'Favoris', value: mockFavoris.length },
              { label: 'Recherches', value: mockRecherches.length },
              { label: 'Alertes actives', value: mockAlertes.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-noir">{value}</p>
                <p className="mt-0.5 text-xs text-gris-fonce">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex gap-1 border-t border-gris-moyen/40">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'text-noir after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-marron'
                    : 'text-gris-fonce hover:text-noir'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {count !== null && count > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${activeTab === id ? 'bg-marron text-blanc' : 'bg-gris-clair text-gris-fonce'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu tab */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <div className="min-h-[400px]">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  )
}
