import { useState } from 'react'
import DashboardLayout, { KpiCard, Modal, SectionHeader } from '../../components/ui/DashboardLayout'

const b = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }

const GridIcon  = (p) => <svg {...b} {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const BookIcon  = (p) => <svg {...b} {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const ChartIcon = (p) => <svg {...b} {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const EditIcon  = (p) => <svg {...b} {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg>
const TrashIcon = (p) => <svg {...b} {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const EyeIcon   = (p) => <svg {...b} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const HeartIcon = (p) => <svg {...b} {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
const DraftIcon = (p) => <svg {...b} {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
const StarIcon  = (p) => <svg {...b} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>

const fmt = (d) => new Date(d).toLocaleDateString('fr-FR')

const INIT_ARTICLES = [
  { id: 1, titre: 'Le marché immobilier en 2024',           statut: 'publié',   date_envoi: '2024-01-15', image_url: '/img/listing-1.png', vues: 1847, likes: 134, contenu: '' },
  { id: 2, titre: "Investir dans l'immobilier locatif",     statut: 'publié',   date_envoi: '2024-01-22', image_url: '/img/listing-2.png', vues: 1203, likes: 87,  contenu: '' },
  { id: 3, titre: '5 conseils pour vendre rapidement',      statut: 'publié',   date_envoi: '2024-02-01', image_url: '/img/listing-1.png', vues: 956,  likes: 63,  contenu: '' },
  { id: 4, titre: "Guide de l'acheteur premier logement",   statut: 'brouillon', date_envoi: '2024-02-08', image_url: '/img/listing-2.png', vues: 0,    likes: 0,   contenu: '' },
  { id: 5, titre: 'Tendances décoration 2024',              statut: 'brouillon', date_envoi: '2024-02-10', image_url: '/img/listing-1.png', vues: 0,    likes: 0,   contenu: '' },
]

function ArticleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? { titre: '', contenu: '', statut: 'brouillon', image_url: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Titre</label>
        <input required value={form.titre} onChange={e => set('titre', e.target.value)}
          className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Contenu</label>
        <textarea value={form.contenu} onChange={e => set('contenu', e.target.value)} rows={5}
          className="w-full resize-none rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Image de couverture (URL)</label>
        <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="/img/listing-1.png"
          className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none" />
        <p className="mt-1 text-xs text-gris-fonce">Placeholder — remplacer par un upload fichier une fois le backend prêt.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-noir">Statut</label>
        <select value={form.statut} onChange={e => set('statut', e.target.value)}
          className="w-full rounded-xl border border-gris-moyen px-4 py-2.5 text-sm focus:border-marron focus:outline-none">
          <option value="brouillon">Brouillon</option>
          <option value="publié">Publié</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-gris-moyen px-5 py-2 text-sm font-medium text-noir hover:bg-gris-clair">Annuler</button>
        <button type="submit" className="rounded-full bg-marron px-5 py-2 text-sm font-semibold text-blanc hover:opacity-90">Enregistrer</button>
      </div>
    </form>
  )
}

function StatutBadge({ statut }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
      statut === 'publié' ? 'bg-marron-clair text-marron' : 'border border-gris-moyen text-gris-fonce'
    }`}>
      {statut === 'publié' ? 'Publié' : 'Brouillon'}
    </span>
  )
}

function Overview({ articles }) {
  const publiés      = articles.filter(a => a.statut === 'publié').length
  const brouillons   = articles.filter(a => a.statut === 'brouillon').length
  const total_vues   = articles.reduce((s, a) => s + a.vues, 0)
  const top          = [...articles].filter(a => a.statut === 'publié').sort((a, c) => c.vues - a.vues)[0]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-noir">Vue d'ensemble</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Articles publiés" value={publiés}                                      Icon={BookIcon}  />
        <KpiCard label="Brouillons"       value={brouillons}                                   Icon={DraftIcon} />
        <KpiCard label="Vues totales"     value={total_vues.toLocaleString('fr-FR')}           Icon={EyeIcon}   />
        <KpiCard label="Article phare"    value={top?.vues ?? 0} sub={top?.titre ?? '—'}       Icon={StarIcon}  />
      </div>
      <div className="mt-8 rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-noir">Derniers articles</h2>
        <div className="space-y-3">
          {articles.slice(0, 4).map(a => (
            <div key={a.id} className="flex items-center gap-4 rounded-xl bg-gris-clair/50 px-4 py-3">
              <img src={a.image_url || '/img/listing-1.png'} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-noir">{a.titre}</p>
                <p className="text-xs text-gris-fonce">{fmt(a.date_envoi)}</p>
              </div>
              <StatutBadge statut={a.statut} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Articles({ articles, setArticles }) {
  const [modal,    setModal]    = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleSave = (data) => {
    if (modal === 'create') {
      setArticles(prev => [...prev, { ...data, id: Date.now(), vues: 0, likes: 0, date_envoi: new Date().toISOString().slice(0, 10) }])
    } else {
      setArticles(prev => prev.map(a => a.id === modal.id ? { ...a, ...data } : a))
    }
    setModal(null)
  }

  const toggleStatut  = (id) => setArticles(prev => prev.map(a => a.id === id ? { ...a, statut: a.statut === 'publié' ? 'brouillon' : 'publié' } : a))
  const handleDelete  = () => { setArticles(prev => prev.filter(a => a.id !== deleteId)); setDeleteId(null) }

  return (
    <div>
      <SectionHeader title="Articles de blog" actionLabel="+ Nouvel article" onAction={() => setModal('create')} />
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Article</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Statut</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Date</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Vues</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {articles.map(a => (
                <tr key={a.id} className="transition-colors hover:bg-gris-clair/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={a.image_url || '/img/listing-1.png'} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <p className="font-medium text-noir">{a.titre}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleStatut(a.id)}
                      title="Cliquer pour changer le statut"
                      className={`rounded-full px-3 py-1 text-xs font-medium transition hover:opacity-80 ${
                        a.statut === 'publié' ? 'bg-marron-clair text-marron' : 'border border-gris-moyen text-gris-fonce'
                      }`}
                    >
                      {a.statut === 'publié' ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>
                  <td className="hidden px-4 py-4 text-gris-fonce md:table-cell">{fmt(a.date_envoi)}</td>
                  <td className="hidden px-4 py-4 text-right text-noir md:table-cell">{a.vues.toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModal(a)} className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-marron-clair hover:text-marron" aria-label="Modifier">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(a.id)} className="rounded-lg p-1.5 text-gris-fonce transition hover:bg-gris-clair hover:text-noir" aria-label="Supprimer">
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
        <Modal title={modal === 'create' ? 'Nouvel article' : "Modifier l'article"} onClose={() => setModal(null)}>
          <ArticleForm initial={modal === 'create' ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {deleteId && (
        <Modal title="Supprimer l'article" onClose={() => setDeleteId(null)}>
          <p className="mb-6 text-gris-fonce">Confirmer la suppression de cet article ?</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)} className="rounded-full border border-gris-moyen px-5 py-2 text-sm font-medium text-noir hover:bg-gris-clair">Annuler</button>
            <button onClick={handleDelete} className="rounded-full bg-noir px-5 py-2 text-sm font-semibold text-blanc hover:opacity-80">Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function StatsArticles({ articles }) {
  const publiés      = articles.filter(a => a.statut === 'publié')
  const total_vues   = publiés.reduce((s, a) => s + a.vues, 0)
  const total_likes  = publiés.reduce((s, a) => s + a.likes, 0)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-noir">Statistiques articles</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Articles publiés" value={publiés.length}                    Icon={BookIcon}  />
        <KpiCard label="Vues totales"     value={total_vues.toLocaleString('fr-FR')} Icon={EyeIcon}   />
        <KpiCard label="Likes totaux"     value={total_likes}                       Icon={HeartIcon} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Article</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Vues</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Likes</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {[...publiés].sort((a, c) => c.vues - a.vues).map(a => (
                <tr key={a.id} className="hover:bg-gris-clair/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={a.image_url || '/img/listing-1.png'} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-noir">{a.titre}</p>
                        <p className="text-xs text-gris-fonce">{fmt(a.date_envoi)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-noir">{a.vues.toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-4 text-right text-noir">{a.likes}</td>
                  <td className="px-4 py-4 text-right font-medium text-marron">
                    {a.vues > 0 ? ((a.likes / a.vues) * 100).toFixed(1) + '%' : '—'}
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
  { id: 'overview', label: "Vue d'ensemble", Icon: GridIcon  },
  { id: 'articles', label: 'Articles',        Icon: BookIcon  },
  { id: 'stats',    label: 'Statistiques',    Icon: ChartIcon },
]

export default function DashboardMarketing() {
  const [activeTab, setActiveTab]   = useState('overview')
  const [articles,  setArticles]    = useState(INIT_ARTICLES)

  return (
    <DashboardLayout roleLabel="Marketing" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && <Overview  articles={articles} />}
      {activeTab === 'articles' && <Articles  articles={articles} setArticles={setArticles} />}
      {activeTab === 'stats'    && <StatsArticles articles={articles} />}
    </DashboardLayout>
  )
}
