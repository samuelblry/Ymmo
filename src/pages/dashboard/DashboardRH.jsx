import { useState } from 'react'
import DashboardLayout, { KpiCard, Modal, SectionHeader } from '../../components/ui/DashboardLayout'

const b = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }

const GridIcon    = (p) => <svg {...b} {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const UsersIcon   = (p) => <svg {...b} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const BuildingIcon= (p) => <svg {...b} {...p}><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></svg>
const EditIcon    = (p) => <svg {...b} {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg>
const BanIcon     = (p) => <svg {...b} {...p}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
const CheckIcon   = (p) => <svg {...b} {...p}><polyline points="20 6 9 17 4 12"/></svg>
const UserPlus    = (p) => <svg {...b} {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>

const ROLES = ['Commercial', 'Marketing', 'RH_Juridique', 'Direction', 'IT_Support']
const ROLE_LABELS = { Commercial: 'Commercial', Marketing: 'Marketing', RH_Juridique: 'RH / Juridique', Direction: 'Direction', IT_Support: 'IT / Support' }
const AGENCES_LIST = ['Siège', 'Aix-en-Provence', 'Marseille', 'Nice', 'Lyon', 'Paris', 'Bordeaux', 'Toulouse', 'Toulon', 'Nantes', 'Montpellier', 'Strasbourg', 'Rennes']

const INIT_EMPLOYES = [
  { id: 1, nom: 'Dupont',    prenom: 'Jean',     email: 'j.dupont@ymmo.fr',    telephone: '04 42 11 22 33', id_role: 'Commercial',    id_agence: 'Aix-en-Provence', actif: true  },
  { id: 2, nom: 'Martin',    prenom: 'Claire',   email: 'c.martin@ymmo.fr',    telephone: '04 91 44 55 66', id_role: 'Marketing',     id_agence: 'Siège',           actif: true  },
  { id: 3, nom: 'Bernard',   prenom: 'Thomas',   email: 't.bernard@ymmo.fr',   telephone: '04 42 77 88 99', id_role: 'Commercial',    id_agence: 'Marseille',       actif: true  },
  { id: 4, nom: 'Moreau',    prenom: 'Isabelle', email: 'i.moreau@ymmo.fr',    telephone: '04 73 12 34 56', id_role: 'RH_Juridique',  id_agence: 'Siège',           actif: true  },
  { id: 5, nom: 'Lefebvre',  prenom: 'Marc',     email: 'm.lefebvre@ymmo.fr',  telephone: '04 72 23 45 67', id_role: 'Direction',     id_agence: 'Siège',           actif: true  },
  { id: 6, nom: 'Garcia',    prenom: 'Ana',      email: 'a.garcia@ymmo.fr',    telephone: '04 91 34 56 78', id_role: 'IT_Support',    id_agence: 'Siège',           actif: true  },
  { id: 7, nom: 'Roux',      prenom: 'Pierre',   email: 'p.roux@ymmo.fr',      telephone: '04 42 45 67 89', id_role: 'Commercial',    id_agence: 'Nice',            actif: false },
  { id: 8, nom: 'Petit',     prenom: 'Emma',     email: 'e.petit@ymmo.fr',     telephone: '04 94 56 78 90', id_role: 'Commercial',    id_agence: 'Toulon',          actif: true  },
  { id: 9, nom: 'Lambert',   prenom: 'Sophie',   email: 's.lambert@ymmo.fr',   telephone: '04 91 22 33 44', id_role: 'Commercial',    id_agence: 'Marseille',       actif: true  },
  { id: 10, nom: 'Fournier', prenom: 'Lucas',    email: 'l.fournier@ymmo.fr',  telephone: '04 72 33 44 55', id_role: 'Marketing',     id_agence: 'Siège',           actif: true  },
]

const AGENCES_DETAIL = [
  { id: 1, nom: 'Ymmo Aix-en-Provence', ville: 'Aix-en-Provence', telephone: '04 42 00 11 22', email: 'aix@ymmo.fr' },
  { id: 2, nom: 'Ymmo Marseille',       ville: 'Marseille',        telephone: '04 91 00 11 22', email: 'marseille@ymmo.fr' },
  { id: 3, nom: 'Ymmo Nice',            ville: 'Nice',             telephone: '04 93 00 11 22', email: 'nice@ymmo.fr' },
  { id: 4, nom: 'Ymmo Lyon',            ville: 'Lyon',             telephone: '04 72 00 11 22', email: 'lyon@ymmo.fr' },
  { id: 5, nom: 'Ymmo Paris',           ville: 'Paris',            telephone: '01 40 00 11 22', email: 'paris@ymmo.fr' },
  { id: 6, nom: 'Ymmo Bordeaux',        ville: 'Bordeaux',         telephone: '05 56 00 11 22', email: 'bordeaux@ymmo.fr' },
  { id: 7, nom: 'Ymmo Toulouse',        ville: 'Toulouse',         telephone: '05 61 00 11 22', email: 'toulouse@ymmo.fr' },
  { id: 8, nom: 'Ymmo Toulon',          ville: 'Toulon',           telephone: '04 94 00 11 22', email: 'toulon@ymmo.fr' },
  { id: 9, nom: 'Ymmo Nantes',          ville: 'Nantes',           telephone: '02 40 00 11 22', email: 'nantes@ymmo.fr' },
  { id: 10, nom: 'Ymmo Montpellier',    ville: 'Montpellier',      telephone: '04 67 00 11 22', email: 'montpellier@ymmo.fr' },
  { id: 11, nom: 'Ymmo Strasbourg',     ville: 'Strasbourg',       telephone: '03 88 00 11 22', email: 'strasbourg@ymmo.fr' },
  { id: 12, nom: 'Ymmo Rennes',         ville: 'Rennes',           telephone: '02 99 00 11 22', email: 'rennes@ymmo.fr' },
]

function EmployeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? { prenom: '', nom: '', email: '', telephone: '', id_role: 'Commercial', id_agence: 'Aix-en-Provence', actif: true })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Prénom</label>
          <input required value={form.prenom} onChange={e => set('prenom', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Nom</label>
          <input required value={form.nom} onChange={e => set('nom', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Email professionnel</label>
        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
          className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Téléphone</label>
        <input value={form.telephone} onChange={e => set('telephone', e.target.value)}
          className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Rôle</label>
          <select value={form.id_role} onChange={e => set('id_role', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none">
            {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-noir">Agence</label>
          <select value={form.id_agence} onChange={e => set('id_agence', e.target.value)}
            className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none">
            {AGENCES_LIST.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-gris-moyen px-5 py-2 text-sm font-medium text-noir hover:bg-gris-clair">Annuler</button>
        <button type="submit" className="rounded-full bg-marron px-5 py-2 text-sm font-semibold text-blanc hover:opacity-90">Enregistrer</button>
      </div>
    </form>
  )
}

function Overview({ employes }) {
  const actifs    = employes.filter(e => e.actif).length
  const inactifs  = employes.filter(e => !e.actif).length
  const repartition = ROLES.map(r => ({ role: ROLE_LABELS[r], count: employes.filter(e => e.id_role === r).length })).filter(r => r.count > 0)
  const max = Math.max(...repartition.map(r => r.count))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-noir">Vue d'ensemble</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total employés" value={employes.length} Icon={UsersIcon}   />
        <KpiCard label="Comptes actifs"  value={actifs}         Icon={CheckIcon}   />
        <KpiCard label="Désactivés"      value={inactifs}       sub="comptes suspendus" Icon={BanIcon} />
      </div>
      <div className="mt-8 rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-noir">Répartition par rôle</h2>
        <div className="space-y-4">
          {repartition.map(r => (
            <div key={r.role}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-noir">{r.role}</span>
                <span className="text-gris-fonce">{r.count} employé{r.count > 1 ? 's' : ''}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gris-moyen/30">
                <div className="h-2 rounded-full bg-marron transition-all" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Employes({ employes, setEmployes }) {
  const [modal,    setModal]    = useState(null)
  const [search,   setSearch]   = useState('')
  const [roleF,    setRoleF]    = useState('')

  const handleSave = (data) => {
    if (modal === 'create') {
      setEmployes(prev => [...prev, { ...data, id: Date.now() }])
    } else {
      setEmployes(prev => prev.map(e => e.id === modal.id ? { ...e, ...data } : e))
    }
    setModal(null)
  }

  const toggleActif = (id) => setEmployes(prev => prev.map(e => e.id === id ? { ...e, actif: !e.actif } : e))

  const filtered = employes.filter(e => {
    const q = search.toLowerCase()
    const matchQ = !q || `${e.prenom} ${e.nom} ${e.email}`.toLowerCase().includes(q)
    const matchR = !roleF || e.id_role === roleF
    return matchQ && matchR
  })

  return (
    <div>
      <SectionHeader title="Employés" actionLabel="+ Ajouter un employé" onAction={() => setModal('create')} />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un employé…"
          className="flex-1 rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm focus:border-marron focus:outline-none"
        />
        <select
          value={roleF}
          onChange={e => setRoleF(e.target.value)}
          className="rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm focus:border-marron focus:outline-none"
        >
          <option value="">Tous les rôles</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Employé</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Rôle</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce lg:table-cell">Agence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {filtered.map(e => (
                <tr key={e.id} className={`transition-colors hover:bg-gris-clair/30 ${!e.actif ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marron-clair text-sm font-semibold text-marron">
                        {e.prenom[0]}{e.nom[0]}
                      </div>
                      <div>
                        <p className="font-medium text-noir">{e.prenom} {e.nom}</p>
                        <p className="text-xs text-gris-fonce">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-gris-fonce md:table-cell">{ROLE_LABELS[e.id_role]}</td>
                  <td className="hidden px-4 py-4 text-gris-fonce lg:table-cell">{e.id_agence}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      e.actif ? 'bg-marron-clair text-marron' : 'bg-gris-moyen text-gris-fonce'
                    }`}>
                      {e.actif ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModal(e)} className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-marron-clair hover:text-marron" aria-label="Modifier">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleActif(e.id)}
                        title={e.actif ? 'Désactiver le compte' : 'Réactiver le compte'}
                        className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-gris-clair hover:text-noir"
                        aria-label={e.actif ? 'Désactiver' : 'Réactiver'}
                      >
                        {e.actif ? <BanIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gris-fonce">Aucun employé trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Ajouter un employé' : 'Modifier le profil'} onClose={() => setModal(null)}>
          <EmployeForm initial={modal === 'create' ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}

function Agences({ employes }) {
  return (
    <div>
      <SectionHeader title="Agences" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGENCES_DETAIL.map(a => {
          const equipe = employes.filter(e => e.id_agence === a.ville && e.actif)
          return (
            <div key={a.id} className="rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-noir">{a.nom}</p>
                  <p className="text-sm text-gris-fonce">{a.ville}</p>
                </div>
                <span className="rounded-full bg-marron-clair px-2.5 py-1 text-xs font-semibold text-marron">
                  {equipe.length} agent{equipe.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="mt-3 space-y-0.5 border-t border-gris-moyen/40 pt-3 text-xs text-gris-fonce">
                <p>{a.telephone}</p>
                <p>{a.email}</p>
              </div>
              {equipe.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {equipe.slice(0, 3).map(e => (
                    <span key={e.id} className="rounded-full bg-gris-clair px-2.5 py-1 text-xs text-gris-fonce">
                      {e.prenom} {e.nom}
                    </span>
                  ))}
                  {equipe.length > 3 && (
                    <span className="rounded-full bg-gris-clair px-2.5 py-1 text-xs text-gris-fonce">
                      +{equipe.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", Icon: GridIcon     },
  { id: 'employes', label: 'Employés',        Icon: UsersIcon   },
  { id: 'agences',  label: 'Agences',         Icon: BuildingIcon },
]

export default function DashboardRH() {
  const [activeTab, setActiveTab] = useState('overview')
  const [employes,  setEmployes]  = useState(INIT_EMPLOYES)

  return (
    <DashboardLayout roleLabel="RH / Juridique" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && <Overview employes={employes} />}
      {activeTab === 'employes' && <Employes employes={employes} setEmployes={setEmployes} />}
      {activeTab === 'agences'  && <Agences  employes={employes} />}
    </DashboardLayout>
  )
}
