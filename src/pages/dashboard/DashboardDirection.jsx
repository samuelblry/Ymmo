import { useEffect, useState } from 'react'
import DashboardLayout, { KpiCard, SectionHeader } from '../../components/ui/DashboardLayout'
import { apiFetch } from '../../lib/api'

const b = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }

const GridIcon    = (p) => <svg {...b} {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const BuildingIcon= (p) => <svg {...b} {...p}><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
const HomeIcon    = (p) => <svg {...b} {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const BookIcon    = (p) => <svg {...b} {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const TrendIcon   = (p) => <svg {...b} {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
const EuroIcon    = (p) => <svg {...b} {...p}><circle cx="12" cy="12" r="10"/><path d="M14.5 9a4 4 0 1 0 0 6M8 11h7M8 13h7"/></svg>
const UsersIcon   = (p) => <svg {...b} {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const MsgIcon     = (p) => <svg {...b} {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const MapIcon     = (p) => <svg {...b} {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>

const euro = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €'
const fmt  = (d) => new Date(d).toLocaleDateString('fr-FR')

const AGENCES = [
  { id: 1,  nom: 'Ymmo Paris',          ville: 'Paris',         ca: 9200000, biens_vendus: 22, biens_actifs: 18, agents: 8 },
  { id: 2,  nom: 'Ymmo Marseille',      ville: 'Marseille',     ca: 6100000, biens_vendus: 18, biens_actifs: 12, agents: 6 },
  { id: 3,  nom: 'Ymmo Nice',           ville: 'Nice',          ca: 5300000, biens_vendus: 15, biens_actifs: 9,  agents: 5 },
  { id: 4,  nom: 'Ymmo Lyon',           ville: 'Lyon',          ca: 4800000, biens_vendus: 14, biens_actifs: 11, agents: 5 },
  { id: 5,  nom: 'Ymmo Aix-en-Provence',ville: 'Aix',           ca: 4200000, biens_vendus: 12, biens_actifs: 8,  agents: 4 },
  { id: 6,  nom: 'Ymmo Bordeaux',       ville: 'Bordeaux',      ca: 3900000, biens_vendus: 11, biens_actifs: 7,  agents: 4 },
  { id: 7,  nom: 'Ymmo Montpellier',    ville: 'Montpellier',   ca: 3500000, biens_vendus: 10, biens_actifs: 8,  agents: 4 },
  { id: 8,  nom: 'Ymmo Toulouse',       ville: 'Toulouse',      ca: 3600000, biens_vendus: 10, biens_actifs: 6,  agents: 3 },
  { id: 9,  nom: 'Ymmo Nantes',         ville: 'Nantes',        ca: 3200000, biens_vendus: 9,  biens_actifs: 7,  agents: 3 },
  { id: 10, nom: 'Ymmo Strasbourg',     ville: 'Strasbourg',    ca: 2900000, biens_vendus: 8,  biens_actifs: 6,  agents: 3 },
  { id: 11, nom: 'Ymmo Toulon',         ville: 'Toulon',        ca: 2800000, biens_vendus: 8,  biens_actifs: 5,  agents: 3 },
  { id: 12, nom: 'Ymmo Rennes',         ville: 'Rennes',        ca: 2600000, biens_vendus: 7,  biens_actifs: 5,  agents: 3 },
]

const ARTICLES = [
  { id: 1, titre: 'Le marché immobilier en 2024',         date: '2024-01-15', vues: 1847, likes: 134 },
  { id: 2, titre: "Investir dans l'immobilier locatif",   date: '2024-01-22', vues: 1203, likes: 87  },
  { id: 3, titre: '5 conseils pour vendre rapidement',    date: '2024-02-01', vues: 956,  likes: 63  },
  { id: 4, titre: 'Comprendre le marché lyonnais',        date: '2024-02-05', vues: 721,  likes: 48  },
  { id: 5, titre: 'Zoom sur la Côte d\'Azur',            date: '2024-02-08', vues: 583,  likes: 41  },
]

const PREDICTIONS = [
  { ville: 'Paris 15e',            tendance: '+8,2% prévu',  score: 92, type: 'Appartement' },
  { ville: 'Lyon Confluence',      tendance: '+6,5% prévu',  score: 87, type: 'Appartement' },
  { ville: 'Marseille 8e',         tendance: '+7,1% prévu',  score: 84, type: 'Maison'       },
  { ville: 'Nice Promenade',       tendance: '+9,3% prévu',  score: 91, type: 'Appartement' },
  { ville: 'Bordeaux Chartrons',   tendance: '+5,8% prévu',  score: 79, type: 'Maison'       },
  { ville: 'Aix Centre-ville',     tendance: '+4,9% prévu',  score: 74, type: 'Appartement' },
]

function Overview({ agences }) {
  const total_ca      = agences.reduce((s, a) => s + a.ca, 0)
  const total_vendus  = agences.reduce((s, a) => s + a.biens_vendus, 0)
  const total_actifs  = agences.reduce((s, a) => s + a.biens_actifs, 0)
  const top_agence    = [...agences].sort((a, c) => c.ca - a.ca)[0]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-noir">Vue d'ensemble Ymmo</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="CA total réseau"    value={euro(total_ca)}     sub={`${agences.length} agences`} Icon={EuroIcon}    />
        <KpiCard label="Biens vendus"       value={total_vendus}       sub="contrats signés"      Icon={HomeIcon}    />
        <KpiCard label="Annonces actives"   value={total_actifs}       sub="en ligne"             Icon={BuildingIcon}/>
        <KpiCard label="Agences réseau"     value={agences.length}     sub="France entière"       Icon={MapIcon}     />
        <KpiCard label="Agents terrain"     value={51}                 sub="commerciaux actifs"   Icon={UsersIcon}   />
        <KpiCard label="Agence leader"      value={top_agence.nom.replace('Ymmo ','')} sub={euro(top_agence.ca)} Icon={TrendIcon} />
      </div>

      <div className="mt-8 rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-noir">Classement CA — top 5</h2>
        <div className="space-y-4">
          {agences.slice(0, 5).map((a, i) => (
            <div key={a.id} className="flex items-center gap-4">
              <span className="w-5 shrink-0 text-sm font-bold text-gris-fonce">{i + 1}</span>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-noir">{a.nom}</span>
                  <span className="font-semibold text-marron">{euro(a.ca)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gris-moyen/30">
                  <div className="h-2 rounded-full bg-marron transition-all" style={{ width: `${(a.ca / agences[0].ca) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AgencesTab({ agences }) {
  const maxCA = agences[0]?.ca || 1

  return (
    <div>
      <SectionHeader title="Agences — chiffre d'affaires" />
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Rang</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Agence</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">CA</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Vendus</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Actifs</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce lg:table-cell">Agents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {agences.map((a, i) => (
                <tr key={a.id} className="hover:bg-gris-clair/30">
                  <td className="px-6 py-4">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? 'bg-marron text-blanc' : 'bg-gris-clair text-gris-fonce'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-noir">{a.nom}</p>
                    <div className="mt-1 h-1.5 w-24 rounded-full bg-gris-moyen/30">
                      <div className="h-1.5 rounded-full bg-marron" style={{ width: `${(a.ca / maxCA) * 100}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-marron">{euro(a.ca)}</td>
                  <td className="hidden px-4 py-4 text-right text-noir md:table-cell">{a.biens_vendus}</td>
                  <td className="hidden px-4 py-4 text-right text-noir md:table-cell">{a.biens_actifs}</td>
                  <td className="hidden px-4 py-4 text-right text-noir lg:table-cell">{a.agents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function BiensTab({ agences }) {
  return (
    <div>
      <SectionHeader title="Biens — vue globale" />
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <KpiCard label="Total vendus"        value={agences.reduce((s, a) => s + a.biens_vendus, 0)} Icon={HomeIcon}  />
        <KpiCard label="Annonces actives"    value={agences.reduce((s, a) => s + a.biens_actifs, 0)}  Icon={EuroIcon}  />
        <KpiCard label="Agence la + active"  value={agences[0]?.ville ?? '—'} sub={`${agences[0]?.biens_actifs ?? 0} biens actifs`} Icon={TrendIcon} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Agence</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Vendus</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Actifs</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">CA moyen/vente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {agences.map(a => (
                <tr key={a.id} className="hover:bg-gris-clair/30">
                  <td className="px-6 py-4 font-medium text-noir">{a.nom}</td>
                  <td className="px-4 py-4 text-right text-noir">{a.biens_vendus}</td>
                  <td className="px-4 py-4 text-right text-noir">{a.biens_actifs}</td>
                  <td className="hidden px-4 py-4 text-right font-medium text-marron md:table-cell">
                    {euro(Math.round(a.ca / a.biens_vendus))}
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

function BlogTab({ articles }) {
  const total_vues  = articles.reduce((s, a) => s + a.vues, 0)
  const total_likes = articles.reduce((s, a) => s + a.likes, 0)

  return (
    <div>
      <SectionHeader title="Blog — performance" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Articles publiés" value={articles.length}                          Icon={BookIcon} />
        <KpiCard label="Vues totales"     value={total_vues.toLocaleString('fr-FR')}       Icon={UsersIcon} />
        <KpiCard label="Likes totaux"     value={total_likes}                              Icon={TrendIcon} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-moyen/50 bg-gris-clair/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gris-fonce">Article</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Vues</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce">Likes</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gris-fonce md:table-cell">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-moyen/30">
              {[...articles].sort((a, c) => c.vues - a.vues).map(a => (
                <tr key={a.id} className="hover:bg-gris-clair/30">
                  <td className="px-6 py-4">
                    <p className="font-medium text-noir">{a.titre}</p>
                    <p className="text-xs text-gris-fonce">{fmt(a.date)}</p>
                  </td>
                  <td className="px-4 py-4 text-right text-noir">{a.vues.toLocaleString('fr-FR')}</td>
                  <td className="px-4 py-4 text-right text-noir">{a.likes}</td>
                  <td className="hidden px-4 py-4 text-right font-medium text-marron md:table-cell">
                    {((a.likes / a.vues) * 100).toFixed(1)}%
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

function AnalyseTab({ predictions }) {
  return (
    <div>
      <SectionHeader title="Analyse prédictive" />
      <div className="mb-6 rounded-2xl border border-gris-moyen/40 bg-blanc p-6 shadow-sm">
        <p className="text-sm text-gris-fonce">
          Modèle scikit-learn entraîné sur l'historique de ventes 2020–2024.
          Prédictions sur 6 mois — données à actualiser via <code className="rounded bg-gris-clair px-1.5 py-0.5 text-xs">/api/analytics/predictions</code>.
        </p>
      </div>

      <h2 className="mb-4 text-lg font-bold text-noir">Zones attractives — score de potentiel</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {predictions.map(p => (
          <div key={p.ville} className="rounded-2xl border border-gris-moyen/40 bg-blanc p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-noir">{p.ville}</p>
                <p className="text-sm text-gris-fonce">{p.type}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-marron text-sm font-bold text-blanc">
                {p.score}
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-marron">{p.tendance}</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-gris-moyen/30">
              <div className="h-1.5 rounded-full bg-marron transition-all" style={{ width: `${p.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gris-moyen/40 bg-marron-clair p-6">
        <p className="text-sm font-semibold text-marron-fonce">Recommandation modèle</p>
        <p className="mt-1 text-sm text-noir">
          Concentrer les efforts commerciaux sur Nice et Paris en priorité (+9,3% et +8,2%).
          Le segment Appartement domine les zones à fort potentiel.
          Rebalancer le portefeuille actif vers ces zones pourrait augmenter le CA réseau de ~12%.
        </p>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", Icon: GridIcon     },
  { id: 'agences',  label: 'Agences',         Icon: BuildingIcon },
  { id: 'biens',    label: 'Biens',           Icon: HomeIcon     },
  { id: 'blog',     label: 'Blog',            Icon: BookIcon     },
  { id: 'analyse',  label: 'Analyse',         Icon: TrendIcon    },
]

export default function DashboardDirection() {
  const [activeTab, setActiveTab] = useState('overview')
  const [agences, setAgences] = useState(AGENCES)
  const [articles, setArticles] = useState(ARTICLES)
  const [predictions, setPredictions] = useState(PREDICTIONS)

  useEffect(() => {
    let ignore = false
    Promise.allSettled([
      apiFetch('/api/stats/agences'),
      apiFetch('/api/stats/articles'),
      apiFetch('/api/analytics/predictions'),
    ]).then(([agencesResult, articlesResult, predictionsResult]) => {
      if (ignore) return
      if (agencesResult.status === 'fulfilled') {
        setAgences(agencesResult.value.map((item, index) => ({
          id: index + 1,
          nom: item.agence,
          ville: item.agence.replace('Ymmo ', ''),
          ca: Number(item.valeur_portefeuille),
          biens_vendus: 0,
          biens_actifs: item.nb_biens,
          agents: 0,
        })).sort((a, b) => b.ca - a.ca))
      }
      if (articlesResult.status === 'fulfilled') {
        setArticles(articlesResult.value.map((item) => ({
          id: item.id_article,
          titre: item.titre,
          date: new Date().toISOString(),
          vues: item.vues,
          likes: item.likes,
        })))
      }
      if (predictionsResult.status === 'fulfilled') {
        setPredictions(predictionsResult.value.map((item) => ({
          ville: item.ville,
          tendance: `${Math.round(item.prix_m2_moyen).toLocaleString('fr-FR')} €/m² moyen`,
          score: Math.round(item.score_attractivite),
          type: `Est. 90m² : ${euro(Math.round(item.estimation_90m2))}`,
        })))
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <DashboardLayout roleLabel="Direction" tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && <Overview agences={agences} />}
      {activeTab === 'agences'  && <AgencesTab agences={agences} />}
      {activeTab === 'biens'    && <BiensTab agences={agences} />}
      {activeTab === 'blog'     && <BlogTab articles={articles} />}
      {activeTab === 'analyse'  && <AnalyseTab predictions={predictions} />}
    </DashboardLayout>
  )
}
