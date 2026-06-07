import { useEffect, useState } from 'react'
import DashboardLayout, { KpiCard, Modal, SectionHeader } from '../../components/ui/DashboardLayout'
import { apiFetch } from '../../lib/api'

const b = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }

const GridIcon    = (p) => <svg {...b} {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const UsersIcon   = (p) => <svg {...b} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const LogsIcon    = (p) => <svg {...b} {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const AlertIcon   = (p) => <svg {...b} {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const KeyIcon     = (p) => <svg {...b} {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
const BanIcon     = (p) => <svg {...b} {...p}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
const CheckIcon   = (p) => <svg {...b} {...p}><polyline points="20 6 9 17 4 12"/></svg>
const ShieldIcon  = (p) => <svg {...b} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>

const fmtdt = (d) => new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })

const ROLE_LABELS = { Commercial: 'Commercial', Marketing: 'Marketing', RH_Juridique: 'RH / Jur.', Direction: 'Direction', IT_Support: 'IT / Support' }

const INIT_COMPTES = [
  { id: 1,  prenom: 'Jean',     nom: 'Dupont',    email: 'j.dupont@ymmo.fr',   id_role: 'Commercial',   id_agence: 'Aix-en-Provence', actif: true,  mfa_enabled: true,  last_login: '2024-02-10T08:32:11' },
  { id: 2,  prenom: 'Claire',   nom: 'Martin',    email: 'c.martin@ymmo.fr',   id_role: 'Marketing',    id_agence: 'Siège',           actif: true,  mfa_enabled: false, last_login: '2024-02-10T09:15:44' },
  { id: 3,  prenom: 'Thomas',   nom: 'Bernard',   email: 't.bernard@ymmo.fr',  id_role: 'Commercial',   id_agence: 'Marseille',       actif: true,  mfa_enabled: true,  last_login: '2024-02-08T14:22:00' },
  { id: 4,  prenom: 'Isabelle', nom: 'Moreau',    email: 'i.moreau@ymmo.fr',   id_role: 'RH_Juridique', id_agence: 'Siège',           actif: true,  mfa_enabled: false, last_login: '2024-02-09T10:05:33' },
  { id: 5,  prenom: 'Marc',     nom: 'Lefebvre',  email: 'm.lefebvre@ymmo.fr', id_role: 'Direction',    id_agence: 'Siège',           actif: true,  mfa_enabled: true,  last_login: '2024-02-10T13:45:02' },
  { id: 6,  prenom: 'Ana',      nom: 'Garcia',    email: 'a.garcia@ymmo.fr',   id_role: 'IT_Support',   id_agence: 'Siège',           actif: true,  mfa_enabled: true,  last_login: '2024-02-10T07:59:00' },
  { id: 7,  prenom: 'Pierre',   nom: 'Roux',      email: 'p.roux@ymmo.fr',     id_role: 'Commercial',   id_agence: 'Nice',            actif: false, mfa_enabled: false, last_login: '2024-01-20T11:30:00' },
  { id: 8,  prenom: 'Emma',     nom: 'Petit',     email: 'e.petit@ymmo.fr',    id_role: 'Commercial',   id_agence: 'Toulon',          actif: true,  mfa_enabled: false, last_login: '2024-02-09T16:12:00' },
]

const INIT_LOGS = [
  { id: 1,  employe: 'Jean Dupont',    action: 'login',           ip: '192.168.1.45',    succes: true,  date: '2024-02-10T08:32:11', agent: 'Chrome 121 / Windows' },
  { id: 2,  employe: 'Claire Martin',  action: 'login',           ip: '10.0.0.23',       succes: true,  date: '2024-02-10T09:15:44', agent: 'Safari 17 / macOS'    },
  { id: 3,  employe: 'Thomas Bernard', action: 'tentative_echec', ip: '185.220.101.12',  succes: false, date: '2024-02-10T09:22:03', agent: 'curl/7.88'            },
  { id: 4,  employe: 'Thomas Bernard', action: 'tentative_echec', ip: '185.220.101.12',  succes: false, date: '2024-02-10T09:22:18', agent: 'curl/7.88'            },
  { id: 5,  employe: 'Thomas Bernard', action: 'tentative_echec', ip: '185.220.101.12',  succes: false, date: '2024-02-10T09:22:33', agent: 'curl/7.88'            },
  { id: 6,  employe: 'Jean Dupont',    action: 'logout',          ip: '192.168.1.45',    succes: true,  date: '2024-02-10T12:01:55', agent: 'Chrome 121 / Windows' },
  { id: 7,  employe: 'Marc Lefebvre',  action: 'login',           ip: '10.0.0.5',        succes: true,  date: '2024-02-10T13:45:02', agent: 'Firefox 122 / Windows'},
  { id: 8,  employe: '—',              action: 'tentative_echec', ip: '91.108.56.4',     succes: false, date: '2024-02-10T14:12:09', agent: 'Python-requests/2.31' },
  { id: 9,  employe: '—',              action: 'tentative_echec', ip: '91.108.56.4',     succes: false, date: '2024-02-10T14:12:14', agent: 'Python-requests/2.31' },
  { id: 10, employe: 'Emma Petit',     action: 'login',           ip: '10.0.1.14',       succes: true,  date: '2024-02-10T16:01:30', agent: 'Chrome 121 / Windows' },
  { id: 11, employe: 'Jean Dupont',    action: 'reset_mdp',       ip: '10.0.0.1',        succes: true,  date: '2024-02-09T09:00:00', agent: 'IT Admin Panel'       },
  { id: 12, employe: 'Isabelle Moreau',action: 'login',           ip: '10.0.0.18',       succes: true,  date: '2024-02-09T10:05:33', agent: 'Edge 121 / Windows'   },
]

const mapCompte = (employe, roles, agences) => {
  const role = roles.find((item) => item.id_role === employe.id_role)
  const agence = agences.find((item) => item.id_agence === employe.id_agence)
  return {
    id: employe.id_employe,
    prenom: employe.prenom,
    nom: employe.nom,
    email: employe.email,
    id_role: role?.nom_role ?? 'Commercial',
    id_agence: agence?.ville ?? 'Siège',
    actif: employe.actif,
    mfa_enabled: employe.mfa_enabled,
    last_login: new Date().toISOString(),
  }
}

const mapLog = (log) => ({
  id: log.id_log,
  employe: log.id_employe ? `Employé #${log.id_employe}` : '—',
  action: log.action,
  ip: log.ip_adresse ?? '—',
  succes: log.succes,
  date: log.date_heure,
  agent: 'API Ymmo',
})

const ACTION_LABELS = { login: 'Connexion', logout: 'Déconnexion', tentative_echec: 'Échec auth', reset_mdp: 'Reset MDP' }
const ACTION_CLS    = { login: 'bg-marron-clair text-marron', logout: 'bg-gris-clair text-gris-fonce', tentative_echec: 'bg-noir text-blanc', reset_mdp: 'border border-gris-fonce text-gris-fonce' }

const genToken = () => 'YMMO-' + Math.random().toString(36).slice(2, 8).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

function Overview({ comptes, logs }) {
  const actifs    = comptes.filter(c => c.actif).length
  const mfa       = comptes.filter(c => c.mfa_enabled).length
  const inactifs  = comptes.filter(c => !c.actif).length
  const echecs24h = logs.filter(l => !l.succes && new Date(l.date) > new Date(Date.now() - 86400000)).length

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-noir">Vue d'ensemble</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Comptes actifs"         value={actifs}     Icon={UsersIcon}  />
        <KpiCard label="Échecs auth (24h)"      value={echecs24h}  sub="à surveiller"      Icon={AlertIcon}  />
        <KpiCard label="MFA activés"            value={mfa}        sub={`/${comptes.length} comptes`} Icon={ShieldIcon} />
        <KpiCard label="Comptes désactivés"     value={inactifs}   Icon={BanIcon}    />
      </div>
      <div className="mt-8 rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-noir">Activité récente</h2>
        <div className="space-y-2">
          {INIT_LOGS.slice(0, 5).map(l => (
            <div key={l.id} className="flex items-center gap-4 rounded-xl bg-gris-clair/50 px-4 py-3">
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${ACTION_CLS[l.action]}`}>
                {ACTION_LABELS[l.action]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-noir">{l.employe}</p>
                <p className="text-xs text-gris-fonce">{l.ip}</p>
              </div>
              <p className="shrink-0 text-xs text-gris-fonce">{fmtdt(l.date)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Comptes({ comptes, setComptes }) {
  const [tokenModal, setTokenModal] = useState(null)
  const [search,     setSearch]     = useState('')

  const toggleActif  = (id) => setComptes(prev => prev.map(c => c.id === id ? { ...c, actif: !c.actif } : c))
  const resetMFA     = (id) => setComptes(prev => prev.map(c => c.id === id ? { ...c, mfa_enabled: false } : c))
  const resetMDP     = (employe) => setTokenModal({ employe, token: genToken() })

  const filtered = comptes.filter(c => {
    const q = search.toLowerCase()
    return !q || `${c.prenom} ${c.nom} ${c.email}`.toLowerCase().includes(q)
  })

  return (
    <div>
      <SectionHeader title="Gestion des comptes" />
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher un compte…"
        className="mb-4 w-full max-w-sm rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm focus:border-marron focus:outline-none"
      />
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Employé</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Rôle</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Compte</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">MFA</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce lg:table-cell">Dernière cnx</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {filtered.map(c => (
                <tr key={c.id} className={`transition-colors hover:bg-gris-clair/30 ${!c.actif ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marron-clair text-sm font-semibold text-marron">
                        {c.prenom[0]}{c.nom[0]}
                      </div>
                      <div>
                        <p className="font-medium text-noir">{c.prenom} {c.nom}</p>
                        <p className="text-xs text-gris-fonce">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-gris-fonce md:table-cell">{ROLE_LABELS[c.id_role]}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      c.actif ? 'bg-marron-clair text-marron' : 'bg-gris-moyen text-gris-fonce'
                    }`}>
                      {c.actif ? 'Actif' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      c.mfa_enabled ? 'bg-marron-clair text-marron' : 'border border-gris-moyen text-gris-fonce'
                    }`}>
                      {c.mfa_enabled ? 'Activé' : 'Désactivé'}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-xs text-gris-fonce lg:table-cell">{fmtdt(c.last_login)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => resetMDP(`${c.prenom} ${c.nom}`)}
                        title="Réinitialiser le mot de passe"
                        className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-marron-clair hover:text-marron"
                        aria-label="Reset MDP"
                      >
                        <KeyIcon className="h-4 w-4" />
                      </button>
                      {c.mfa_enabled && (
                        <button
                          onClick={() => resetMFA(c.id)}
                          title="Réinitialiser le MFA"
                          className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-marron-clair hover:text-marron"
                          aria-label="Reset MFA"
                        >
                          <ShieldIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleActif(c.id)}
                        title={c.actif ? 'Désactiver le compte' : 'Réactiver le compte'}
                        className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-gris-clair hover:text-noir"
                        aria-label={c.actif ? 'Désactiver' : 'Réactiver'}
                      >
                        {c.actif ? <BanIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tokenModal && (
        <Modal title="Réinitialisation du mot de passe" onClose={() => setTokenModal(null)}>
          <p className="mb-4 text-sm text-gris-fonce">
            Token de réinitialisation généré pour <strong className="text-noir">{tokenModal.employe}</strong>.
            À transmettre via canal sécurisé (email pro ou en main propre).
          </p>
          <div className="rounded-xl bg-gris-clair px-5 py-4">
            <p className="font-mono text-base font-bold tracking-widest text-noir">{tokenModal.token}</p>
          </div>
          <p className="mt-3 text-xs text-gris-fonce">Ce token expire dans 24h. Il ne sera plus affiché après la fermeture de cette fenêtre.</p>
          <div className="mt-6 flex justify-end">
            <button onClick={() => setTokenModal(null)} className="rounded-full bg-marron px-5 py-2.5 text-sm font-semibold text-blanc hover:opacity-90">
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Logs({ logs }) {
  const [actionF, setActionF] = useState('')
  const [search,  setSearch]  = useState('')

  const filtered = logs.filter(l => {
    const q = search.toLowerCase()
    const matchQ = !q || `${l.employe} ${l.ip}`.toLowerCase().includes(q)
    const matchA = !actionF || l.action === actionF
    return matchQ && matchA
  })

  return (
    <div>
      <SectionHeader title="Logs de connexion" />
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Employé ou adresse IP…"
          className="flex-1 rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm focus:border-marron focus:outline-none"
        />
        <select
          value={actionF}
          onChange={e => setActionF(e.target.value)}
          className="rounded-full border border-gris-moyen bg-blanc px-4 py-2 text-sm focus:border-marron focus:outline-none"
        >
          <option value="">Toutes les actions</option>
          <option value="login">Connexion</option>
          <option value="logout">Déconnexion</option>
          <option value="tentative_echec">Échec auth</option>
          <option value="reset_mdp">Reset MDP</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Employé</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">IP</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce lg:table-cell">User agent</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {filtered.map(l => (
                <tr key={l.id} className={`transition-colors hover:bg-gris-clair/30 ${!l.succes ? 'bg-marron-clair/10' : ''}`}>
                  <td className="px-6 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${ACTION_CLS[l.action]}`}>
                      {ACTION_LABELS[l.action]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-noir">{l.employe}</td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-gris-fonce md:table-cell">{l.ip}</td>
                  <td className="hidden px-4 py-3 text-xs text-gris-fonce lg:table-cell">{l.agent}</td>
                  <td className="px-4 py-3 text-right text-xs text-gris-fonce">{fmtdt(l.date)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gris-fonce">Aucun log trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Alertes({ logs }) {
  const echecs = logs.filter(l => !l.succes)

  const parIP = echecs.reduce((acc, l) => {
    acc[l.ip] = acc[l.ip] ?? { ip: l.ip, count: 0, agent: l.agent, derniere: l.date, employes: new Set() }
    acc[l.ip].count++
    acc[l.ip].employes.add(l.employe)
    if (l.date > acc[l.ip].derniere) acc[l.ip].derniere = l.date
    return acc
  }, {})

  const alertes = Object.values(parIP).sort((a, c) => c.count - a.count)

  return (
    <div>
      <SectionHeader title="Alertes sécurité" />
      {alertes.length === 0 ? (
        <div className="rounded-2xl border border-gris-moyen/40 bg-blanc p-10 text-center shadow-sm">
          <p className="text-sm text-gris-fonce">Aucune activité suspecte détectée.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-2xl border border-marron/30 bg-marron-clair p-4">
            <p className="text-sm font-semibold text-marron-fonce">
              {alertes.length} adresse{alertes.length > 1 ? 's' : ''} IP avec des tentatives d'authentification échouées
            </p>
            <p className="mt-0.5 text-xs text-gris-fonce">Seuil d'alerte : ≥ 2 échecs consécutifs</p>
          </div>
          <div className="space-y-4">
            {alertes.map(a => (
              <div key={a.ip} className={`rounded-2xl border bg-blanc p-6 shadow-sm ${a.count >= 3 ? 'border-noir' : 'border-gris-moyen/40'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        a.count >= 3 ? 'bg-noir text-blanc' : 'bg-gris-moyen text-gris-fonce'
                      }`}>
                        {a.count} tentative{a.count > 1 ? 's' : ''}
                      </span>
                      <span className="font-mono text-sm font-bold text-noir">{a.ip}</span>
                    </div>
                    <p className="mt-2 text-xs text-gris-fonce">User agent : {a.agent}</p>
                    <p className="text-xs text-gris-fonce">Cibles : {[...a.employes].join(', ')}</p>
                    <p className="text-xs text-gris-fonce">Dernière tentative : {fmtdt(a.derniere)}</p>
                  </div>
                  {a.count >= 3 && (
                    <span className="shrink-0 rounded-full bg-noir px-3 py-1 text-xs font-semibold text-blanc">
                      Brute-force
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", Icon: GridIcon   },
  { id: 'comptes',  label: 'Comptes',         Icon: UsersIcon  },
  { id: 'logs',     label: 'Logs',            Icon: LogsIcon   },
  { id: 'alertes',  label: 'Alertes',         Icon: AlertIcon  },
]

export default function DashboardIT() {
  const [activeTab, setActiveTab] = useState('overview')
  const [comptes,   setComptes]   = useState(INIT_COMPTES)
  const [logs, setLogs]           = useState(INIT_LOGS)

  useEffect(() => {
    let ignore = false
    Promise.allSettled([
      apiFetch('/api/employes'),
      apiFetch('/api/roles'),
      apiFetch('/api/agences'),
      apiFetch('/api/logs'),
    ]).then(([employesResult, rolesResult, agencesResult, logsResult]) => {
      if (ignore) return
      const roles = rolesResult.status === 'fulfilled' ? rolesResult.value : []
      const agences = agencesResult.status === 'fulfilled' ? agencesResult.value : []
      if (employesResult.status === 'fulfilled') {
        setComptes(employesResult.value.map((employe) => mapCompte(employe, roles, agences)))
      }
      if (logsResult.status === 'fulfilled') {
        setLogs(logsResult.value.map(mapLog))
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <DashboardLayout roleLabel="IT / Support" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && <Overview comptes={comptes} logs={logs} />}
      {activeTab === 'comptes'  && <Comptes  comptes={comptes} setComptes={setComptes} />}
      {activeTab === 'logs'     && <Logs     logs={logs} />}
      {activeTab === 'alertes'  && <Alertes  logs={logs} />}
    </DashboardLayout>
  )
}
