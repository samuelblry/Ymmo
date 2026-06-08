import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout, { KpiCard, Modal, SectionHeader } from '../../components/ui/DashboardLayout'
import { apiFetch } from '../../lib/api'
import { mapListing } from '../../lib/dataMappers'

const b = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }

const GridIcon    = (p) => <svg {...b} {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const HomeIcon    = (p) => <svg {...b} {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const MsgIcon     = (p) => <svg {...b} {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const ChartIcon   = (p) => <svg {...b} {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const EditIcon    = (p) => <svg {...b} {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg>
const TrashIcon   = (p) => <svg {...b} {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const EuroIcon    = (p) => <svg {...b} {...p}><circle cx="12" cy="12" r="10"/><path d="M14.5 9a4 4 0 1 0 0 6M8 11h7M8 13h7"/></svg>
const CheckIcon   = (p) => <svg {...b} {...p}><polyline points="20 6 9 17 4 12"/></svg>
const HeartIcon   = (p) => <svg {...b} {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
const EyeIcon     = (p) => <svg {...b} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

const euro   = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €'
const fmt    = (d) => new Date(d).toLocaleDateString('fr-FR')
const fmtdt  = (d) => new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })

const STATUS_LABELS = { disponible: 'Disponible', sous_compromis: 'Sous compromis', vendu: 'Vendu' }

const INIT_BIENS = [
  { id: 1, titre: 'Villa avec piscine', prix: 620000, ville: 'Aix-en-Provence', type_bien: 'Maison',      surface: 180, statut: 'disponible',    vues: 142, contacts: 8,  likes: 23, date_ajout: '2024-01-15', image: '/img/listing-1.png' },
  { id: 2, titre: 'Appartement T4 vue mer', prix: 385000, ville: 'Marseille',  type_bien: 'Appartement', surface: 94,  statut: 'sous_compromis', vues: 89,  contacts: 5,  likes: 12, date_ajout: '2024-01-20', image: '/img/listing-2.png' },
  { id: 3, titre: 'Maison de village', prix: 295000, ville: 'Aix-en-Provence', type_bien: 'Maison',      surface: 120, statut: 'vendu',          vues: 231, contacts: 19, likes: 41, date_ajout: '2023-12-10', image: '/img/listing-1.png' },
  { id: 4, titre: 'Studio centre-ville', prix: 145000, ville: 'Marseille',     type_bien: 'Appartement', surface: 32,  statut: 'disponible',    vues: 67,  contacts: 3,  likes: 9,  date_ajout: '2024-02-01', image: '/img/listing-2.png' },
  { id: 5, titre: 'Terrain constructible', prix: 185000, ville: 'Aix-en-Provence', type_bien: 'Terrain', surface: 850, statut: 'disponible',  vues: 45,  contacts: 2,  likes: 7,  date_ajout: '2024-02-05', image: '/img/listing-1.png' },
]

const INIT_MESSAGES = [
  { id: 1, nom: 'Martin',  prenom: 'Sophie',   email: 'sophie.martin@email.fr', telephone: '06 12 34 56 78', sujet: 'Renseignement villa Aix',   contenu: "Bonjour, je suis intéressée par la villa avec piscine et souhaite obtenir plus d'informations sur sa disponibilité.", lu: false, date_envoi: '2024-02-10T10:30:00' },
  { id: 2, nom: 'Bernard', prenom: 'Luc',      email: 'luc.bernard@email.fr',   telephone: '07 98 76 54 32', sujet: 'Visite appartement T4',      contenu: "Bonjour, pouvez-vous organiser une visite pour le T4 vue mer ? Je suis disponible le week-end.",                              lu: false, date_envoi: '2024-02-09T14:15:00' },
  { id: 3, nom: 'Moreau',  prenom: 'Isabelle', email: 'i.moreau@email.fr',      telephone: '06 55 44 33 22', sujet: 'Question financement',       contenu: "Bonjour, je souhaite avoir des informations sur les modalités de financement pour un premier achat.",                         lu: true,  date_envoi: '2024-02-08T09:00:00' },
  { id: 4, nom: 'Durand',  prenom: 'Paul',     email: 'paul.durand@email.fr',   telephone: '07 11 22 33 44', sujet: 'Offre maison village',        contenu: "Je souhaite faire une offre pour la maison de village. Pouvez-vous me contacter dès que possible ?",                          lu: true,  date_envoi: '2024-02-07T16:45:00' },
  { id: 5, nom: 'Petit',   prenom: 'Marie',    email: 'marie.petit@email.fr',   telephone: '06 88 77 66 55', sujet: 'Disponibilité terrain',      contenu: "Le terrain constructible est-il toujours disponible ? Merci de me tenir informée.",                                          lu: true,  date_envoi: '2024-02-06T11:20:00' },
]

const mapDashboardBien = (bien) => {
  const item = mapListing(bien)
  return {
    id: item.id,
    titre: item.title,
    prix: item.price,
    ville: item.city,
    type_bien: item.type,
    surface: item.area,
    statut: item.status,
    vues: 0,
    contacts: 0,
    likes: 0,
    date_ajout: bien.date_ajout,
    image: item.image,
  }
}

const mapDashboardMessage = (message) => ({
  id: message.id_message,
  nom: message.nom,
  prenom: message.prenom,
  email: message.email,
  telephone: message.telephone,
  sujet: message.sujet,
  contenu: message.contenu,
  lu: message.lu,
  date_envoi: message.date_envoi,
})

function BienForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? { titre: '', prix: '', ville: '', type_bien: 'Maison', surface: '', statut: 'disponible' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...form, prix: Number(form.prix), surface: Number(form.surface) }) }} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Titre</label>
        <input required value={form.titre} onChange={e => set('titre', e.target.value)}
          className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Prix (€)</label>
          <input required type="number" value={form.prix} onChange={e => set('prix', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Surface (m²)</label>
          <input required type="number" value={form.surface} onChange={e => set('surface', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Ville</label>
          <input required value={form.ville} onChange={e => set('ville', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Type</label>
          <select value={form.type_bien} onChange={e => set('type_bien', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none">
            <option>Maison</option><option>Appartement</option><option>Terrain</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Statut</label>
        <select value={form.statut} onChange={e => set('statut', e.target.value)}
          className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none">
          <option value="disponible">Disponible</option>
          <option value="sous_compromis">Sous compromis</option>
          <option value="vendu">Vendu</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-gris-moyen px-5 py-2 text-sm font-medium text-noir hover:bg-gris-clair">Annuler</button>
        <button type="submit" className="rounded-full bg-marron px-5 py-2 text-sm font-semibold text-blanc hover:opacity-90">Enregistrer</button>
      </div>
    </form>
  )
}

function StatusBadge({ statut }) {
  const cls = { disponible: 'bg-marron-clair text-marron', sous_compromis: 'border border-gris-fonce text-gris-fonce', vendu: 'bg-noir text-blanc' }
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${cls[statut]}`}>{STATUS_LABELS[statut]}</span>
}

function Overview({ biens, messages }) {
  const actifs = biens.filter(b => b.statut === 'disponible').length
  const vendus = biens.filter(b => b.statut === 'vendu').length
  const nonLus = messages.filter(m => !m.lu).length
  const ca = biens.filter(b => b.statut === 'vendu').reduce((s, b) => s + b.prix, 0)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-noir">Vue d'ensemble</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Biens actifs"        value={actifs}    sub="annonces disponibles"  Icon={HomeIcon}  />
        <KpiCard label="Messages non lus"    value={nonLus}    sub="à traiter"             Icon={MsgIcon}   />
        <KpiCard label="CA — biens vendus"   value={euro(ca)}  sub="ce portefeuille"       Icon={EuroIcon}  />
        <KpiCard label="Biens vendus"        value={vendus}    sub="contrats signés"       Icon={CheckIcon} />
      </div>
      <div className="mt-8 rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-noir">Activité récente</h2>
        <div className="space-y-3">
          {biens.slice(0, 4).map(b => (
            <div key={b.id} className="flex items-center justify-between gap-4 rounded-xl bg-gris-clair/50 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-noir">{b.titre}</p>
                <p className="text-xs text-gris-fonce">{b.ville} · {b.surface} m² · {fmt(b.date_ajout)}</p>
              </div>
              <StatusBadge statut={b.statut} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function toBienPayload(data) {
  return {
    id_agence: 1,
    titre: data.titre,
    description: data.description ?? 'Bien gere depuis le dashboard commercial Ymmo.',
    adresse: data.adresse ?? `${data.ville}, ${data.ville}`,
    prix: data.prix,
    surface: data.surface,
    type_bien: data.type_bien,
    ville: data.ville,
    code_postal: data.code_postal ?? '00000',
    statut: data.statut,
    nb_pieces: data.nb_pieces ?? 3,
    nb_chambres: data.nb_chambres ?? 2,
    nb_sdb: data.nb_sdb ?? 1,
    caracteristiques: data.caracteristiques ?? 'DPE B',
  }
}

function Annonces({ biens, setBiens }) {
  const [modal, setModal]     = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [saveError, setSaveError] = useState('')

  const handleSave = async (data) => {
    setSaveError('')
    if (modal === 'create') {
      try {
        const created = await apiFetch('/api/biens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toBienPayload(data)),
        })
        setBiens(prev => [...prev, mapDashboardBien(created)])
      } catch (err) {
        setSaveError(err.message)
        return
      }
    } else {
      try {
        const updated = await apiFetch(`/api/biens/${modal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toBienPayload({ ...modal, ...data })),
        })
        setBiens(prev => prev.map(b => b.id === modal.id ? mapDashboardBien(updated) : b))
      } catch (err) {
        setSaveError(err.message)
        return
      }
    }
    setModal(null)
  }

  const handleDelete = async () => {
    try {
      await apiFetch(`/api/biens/${deleteId}`, { method: 'DELETE' })
    } catch {
      // Fallback local si l'API est indisponible.
    }
    setBiens(prev => prev.filter(b => b.id !== deleteId))
    setDeleteId(null)
  }
  const changeStatut = async (id, statut) => {
    setBiens(prev => prev.map(b => b.id === id ? { ...b, statut } : b))
    try {
      await apiFetch(`/api/biens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      })
    } catch {
      // La selection reste visible localement pour ne pas bloquer la demo.
    }
  }

  return (
    <div>
      <SectionHeader title="Mes annonces" actionLabel="+ Nouvelle annonce" onAction={() => setModal('create')} />
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Bien</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Statut</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Ville</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {biens.map(b => (
                <tr key={b.id} className="transition-colors hover:bg-gris-clair/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={b.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-noir">{b.titre}</p>
                        <p className="text-xs text-gris-fonce">{b.surface} m² · {b.type_bien}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-marron">{euro(b.prix)}</td>
                  <td className="px-4 py-4">
                    <select
                      value={b.statut}
                      onChange={e => changeStatut(b.id, e.target.value)}
                      className="cursor-pointer rounded-full border-0 bg-transparent text-xs font-medium focus:outline-none"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="sous_compromis">Sous compromis</option>
                      <option value="vendu">Vendu</option>
                    </select>
                  </td>
                  <td className="hidden px-4 py-4 text-gris-fonce md:table-cell">{b.ville}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModal(b)} className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-marron-clair hover:text-marron" aria-label="Modifier">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <Link to={`/annonces/${b.id}`} className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-marron-clair hover:text-marron" aria-label="Voir">
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setDeleteId(b.id)} className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-gris-clair hover:text-noir" aria-label="Supprimer">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Nouvelle annonce' : "Modifier l'annonce"} onClose={() => setModal(null)}>
          {saveError && (
            <p className="mb-4 rounded-xl bg-marron-clair px-4 py-3 text-sm text-marron-fonce">
              {saveError}
            </p>
          )}
          <BienForm initial={modal === 'create' ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteId && (
        <Modal title="Supprimer l'annonce" onClose={() => setDeleteId(null)}>
          <p className="mb-6 text-gris-fonce">Cette action est irréversible. Confirmer la suppression ?</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)} className="rounded-full border border-gris-moyen px-5 py-2 text-sm font-medium text-noir hover:bg-gris-clair">Annuler</button>
            <button onClick={handleDelete} className="rounded-full bg-noir px-5 py-2 text-sm font-semibold text-blanc hover:opacity-80">Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Messages({ messages, setMessages }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (msg) => {
    setSelected(msg)
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, lu: true } : m))
    apiFetch(`/api/messages/${msg.id}/lu`, { method: 'PUT' }).catch(() => {})
  }

  return (
    <div>
      <SectionHeader title="Messages clients" />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
          {messages.map(m => (
            <button
              key={m.id}
              onClick={() => handleSelect(m)}
              className={`w-full border-b border-gris-moyen/30 px-5 py-4 text-left transition-colors last:border-0 ${
                selected?.id === m.id ? 'bg-marron-clair' : 'hover:bg-gris-clair/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.lu && <span className="h-2 w-2 shrink-0 rounded-full bg-marron" />}
                    <p className={`truncate text-sm ${!m.lu ? 'font-semibold text-noir' : 'font-medium text-gris-fonce'}`}>
                      {m.prenom} {m.nom}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gris-fonce">{m.sujet}</p>
                </div>
                <p className="shrink-0 text-xs text-gris-fonce">{fmt(m.date_envoi)}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
          {selected ? (
            <>
              <div className="border-b border-gris-moyen/50 pb-4">
                <h3 className="text-lg font-bold text-noir">{selected.sujet}</h3>
                <p className="mt-1 text-sm text-gris-fonce">{selected.prenom} {selected.nom} · {selected.email}</p>
                <p className="text-sm text-gris-fonce">{selected.telephone} · {fmtdt(selected.date_envoi)}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-noir">{selected.contenu}</p>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.sujet}`}
                className="mt-6 inline-block rounded-full bg-marron px-5 py-2.5 text-sm font-semibold text-blanc transition hover:opacity-90"
              >
                Répondre par email
              </a>
            </>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-gris-fonce">
              Sélectionnez un message
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stats({ biens }) {
  const total_vues     = biens.reduce((s, b) => s + b.vues, 0)
  const total_contacts = biens.reduce((s, b) => s + b.contacts, 0)
  const total_likes    = biens.reduce((s, b) => s + b.likes, 0)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-noir">Statistiques</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Vues totales"       value={total_vues}     Icon={EyeIcon}   />
        <KpiCard label="Contacts générés"   value={total_contacts} Icon={MsgIcon}   />
        <KpiCard label="Likes totaux"       value={total_likes}    Icon={HeartIcon} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Bien</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Vues</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Contacts</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Likes</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {[...biens].sort((a, c) => c.vues - a.vues).map(b => (
                <tr key={b.id} className="hover:bg-gris-clair/30">
                  <td className="px-6 py-4">
                    <p className="font-medium text-noir">{b.titre}</p>
                    <p className="text-xs text-gris-fonce">{b.ville}</p>
                  </td>
                  <td className="px-4 py-4 text-right text-noir">{b.vues}</td>
                  <td className="px-4 py-4 text-right text-noir">{b.contacts}</td>
                  <td className="px-4 py-4 text-right text-noir">{b.likes}</td>
                  <td className="px-4 py-4 text-right font-medium text-marron">
                    {b.vues > 0 ? ((b.contacts / b.vues) * 100).toFixed(1) + '%' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'overview',  label: "Vue d'ensemble", Icon: GridIcon  },
  { id: 'annonces',  label: 'Mes annonces',   Icon: HomeIcon  },
  { id: 'messages',  label: 'Messages',       Icon: MsgIcon   },
  { id: 'stats',     label: 'Statistiques',   Icon: ChartIcon },
]

export default function DashboardCommercial() {
  const [activeTab, setActiveTab] = useState('overview')
  const [biens,     setBiens]     = useState(INIT_BIENS)
  const [messages,  setMessages]  = useState(INIT_MESSAGES)

  useEffect(() => {
    let ignore = false
    Promise.allSettled([
      apiFetch('/api/biens'),
      apiFetch('/api/messages'),
    ]).then(([biensResult, messagesResult]) => {
      if (ignore) return
      if (biensResult.status === 'fulfilled') {
        setBiens(biensResult.value.map(mapDashboardBien))
      }
      if (messagesResult.status === 'fulfilled') {
        setMessages(messagesResult.value.map(mapDashboardMessage))
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <DashboardLayout roleLabel="Commercial" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview'  && <Overview  biens={biens} messages={messages} />}
      {activeTab === 'annonces'  && <Annonces  biens={biens} setBiens={setBiens} />}
      {activeTab === 'messages'  && <Messages  messages={messages} setMessages={setMessages} />}
      {activeTab === 'stats'     && <Stats     biens={biens} />}
    </DashboardLayout>
  )
}
