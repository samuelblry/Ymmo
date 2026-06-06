import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui/Reveal'

const sections = [
  {
    id: 'objet',
    titre: 'Objet',
    texte: [
      "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site web Ymmo, accessible à l'adresse ymmo.fr, exploité par Ymmo SAS, groupe immobilier dont le siège social est situé au 12 cours Mirabeau, 13100 Aix-en-Provence.",
      "En accédant au site, l'utilisateur accepte sans réserve les présentes CGU. Ymmo se réserve le droit de les modifier à tout moment ; les modifications prennent effet dès leur publication en ligne.",
    ],
  },
  {
    id: 'acces',
    titre: 'Accès au service',
    texte: [
      "Le site Ymmo est accessible gratuitement à tout utilisateur disposant d'un accès à internet. Ymmo met en oeuvre tous les moyens raisonnables pour assurer la disponibilité du service, mais ne saurait être tenu responsable en cas d'interruption due à des opérations de maintenance, à un incident technique ou à un cas de force majeure.",
      "Certaines fonctionnalités (favoris, messagerie, suivi de demandes) nécessitent la création d'un compte utilisateur. L'accès aux espaces staff (dashboards) est réservé aux employés Ymmo disposant d'identifiants valides.",
    ],
  },
  {
    id: 'compte',
    titre: 'Création de compte',
    texte: [
      "Pour créer un compte, l'utilisateur doit fournir des informations exactes, complètes et à jour. Il est responsable de la confidentialité de ses identifiants et de toutes les actions effectuées depuis son compte.",
      "Ymmo se réserve le droit de suspendre ou de supprimer tout compte en cas de violation des présentes CGU, d'utilisation frauduleuse ou de fourniture d'informations inexactes.",
    ],
  },
  {
    id: 'contenu',
    titre: "Contenu du site",
    texte: [
      "Les annonces immobilières publiées sur Ymmo sont rédigées par les commerciaux des agences du groupe. Ymmo s'efforce d'en assurer l'exactitude mais ne garantit pas l'absence d'erreurs. Les informations sont fournies à titre indicatif et ne constituent pas un engagement contractuel.",
      "Les prix affichés s'entendent en euros toutes taxes comprises. Les surfaces sont déclaratives et peuvent différer légèrement des surfaces Carrez officielles, qui font foi lors de la signature du compromis de vente.",
    ],
  },
  {
    id: 'utilisation',
    titre: 'Utilisation autorisée',
    texte: [
      "Le site est destiné à un usage strictement personnel et non commercial. Il est interdit de copier, reproduire, distribuer ou exploiter à des fins commerciales tout ou partie du contenu du site sans autorisation préalable écrite de Ymmo.",
      "Il est également interdit de : tenter d'accéder sans autorisation aux systèmes informatiques de Ymmo ; introduire des virus ou tout code malveillant ; utiliser des robots ou outils automatisés pour collecter des données (scraping).",
    ],
  },
  {
    id: 'responsabilite',
    titre: 'Responsabilité',
    texte: [
      "Ymmo ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site, de l'inexactitude des informations publiées ou de l'interruption temporaire du service.",
      "Les liens vers des sites tiers sont fournis à titre informatif. Ymmo ne contrôle pas ces sites et décline toute responsabilité quant à leur contenu.",
    ],
  },
  {
    id: 'litiges',
    titre: 'Litiges',
    texte: [
      "Les présentes CGU sont soumises au droit français. En cas de différend, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.",
      "À défaut de règlement amiable, les juridictions compétentes du ressort d'Aix-en-Provence seront saisies.",
    ],
  },
  {
    id: 'contact',
    titre: 'Contact',
    contenu: [
      { label: 'Email', value: 'contact@ymmo.fr' },
      { label: 'Téléphone', value: '+33 4 42 00 00 00' },
      { label: 'Adresse', value: '12 cours Mirabeau, 13100 Aix-en-Provence' },
    ],
  },
]

export default function CGU() {
  return (
    <div className="bg-gris-clair min-h-screen">
      <div className="bg-noir py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="text-marron text-sm font-medium tracking-widest uppercase mb-4">Informations légales</p>
            <h1 className="text-5xl font-black text-blanc leading-tight">Conditions générales d'utilisation</h1>
            <p className="mt-4 text-gris-moyen text-lg">Dernière mise à jour : juin 2025</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-12 pb-4">
        <Reveal>
          <nav className="bg-blanc border border-gris-moyen rounded-lg p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-gris-fonce mb-4">Sommaire</p>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-marron hover:text-marron-fonce font-medium transition-colors text-sm">
                    {s.titre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-12 pb-24">
        {sections.map((section) => (
          <Reveal key={section.id}>
            <section id={section.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-noir mb-6 pb-3 border-b border-gris-moyen">
                {section.titre}
              </h2>

              {section.texte && (
                <div className="space-y-4">
                  {section.texte.map((para, i) => (
                    <p key={i} className="text-gris-fonce leading-relaxed text-sm">{para}</p>
                  ))}
                </div>
              )}

              {section.contenu && (
                <dl className="space-y-3">
                  {section.contenu.map((item) => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:gap-8">
                      <dt className="text-gris-fonce text-sm font-medium w-52 shrink-0">{item.label}</dt>
                      <dd className="text-noir text-sm">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          </Reveal>
        ))}

        <Reveal>
          <div className="pt-8 border-t border-gris-moyen flex flex-wrap gap-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-marron hover:text-marron-fonce transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
            <Link to="/politique-confidentialite" className="text-sm font-semibold text-gris-fonce hover:text-noir transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/mentions-legales" className="text-sm font-semibold text-gris-fonce hover:text-noir transition-colors">
              Mentions légales
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
