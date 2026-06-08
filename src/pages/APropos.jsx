import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal'

const chiffres = [
  { value: '12', label: 'agences en France' },
  { value: '2015', label: 'année de création' },
  { value: '+8 000', label: 'transactions accompagnées' },
  { value: '97%', label: 'clients satisfaits' },
]

const valeurs = [
  {
    titre: 'Transparence',
    texte:
      "Des estimations honnêtes, des informations claires et aucun frais caché. Chaque bien est présenté tel qu'il est, pour des décisions sereines.",
  },
  {
    titre: 'Proximité',
    texte:
      "Douze agences ancrées dans leur territoire, des conseillers qui connaissent leur marché et restent disponibles à chaque étape du projet.",
  },
  {
    titre: 'Innovation',
    texte:
      "Une plateforme moderne et des outils d'analyse de marché qui simplifient la recherche, la mise en relation et la valorisation des biens.",
  },
]

export default function APropos() {
  return (
    <div className="min-h-screen bg-gris-clair">
      <div className="bg-noir px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-marron">Le groupe Ymmo</p>
            <h1 className="text-5xl font-black leading-tight text-blanc">
              L'immobilier, repensé autour de vous.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gris-moyen">
              Né à Aix-en-Provence, Ymmo réunit particuliers et agences sur une même plateforme
              pour rendre l'achat et la vente de biens plus simples, plus transparents et plus humains.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir">Notre mission</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-gris-fonce">
            <p>
              Acheter ou vendre un bien reste l'une des décisions les plus importantes d'une vie.
              Pourtant le parcours est souvent opaque, dispersé et stressant. Ymmo centralise les
              annonces de ses douze agences et offre aux clients une vision claire du marché.
            </p>
            <p>
              En s'appuyant sur l'analyse de données — tendances de prix, zones attractives, popularité
              des biens — nous aidons chacun à avancer avec confiance, qu'il s'agisse d'un premier achat
              ou d'un investissement professionnel.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {chiffres.map((c) => (
            <StaggerItem key={c.label}>
              <div className="rounded-2xl bg-marron-clair p-6 text-center">
                <p className="text-4xl font-black text-marron-fonce">{c.value}</p>
                <p className="mt-2 text-sm text-gris-fonce">{c.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir">Nos valeurs</h2>
        </Reveal>
        <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
          {valeurs.map((v) => (
            <StaggerItem key={v.titre}>
              <div className="h-full rounded-2xl border border-gris-moyen/50 bg-blanc p-6 shadow-sm">
                <h3 className="text-lg font-bold text-noir">{v.titre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gris-fonce">{v.texte}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-marron-fonce p-10 text-blanc md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold leading-snug">Prêt à concrétiser votre projet ?</h2>
              <p className="mt-2 text-sm text-blanc/80">
                Découvrez nos biens ou échangez avec l'une de nos agences.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link
                to="/annonces"
                className="rounded-full bg-blanc px-6 py-3 text-sm font-semibold text-marron-fonce transition-opacity hover:opacity-90"
              >
                Voir les biens
              </Link>
              <Link
                to="/agences"
                className="rounded-full border border-blanc/40 px-6 py-3 text-sm font-semibold text-blanc transition-colors hover:bg-blanc/10"
              >
                Nos agences
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
