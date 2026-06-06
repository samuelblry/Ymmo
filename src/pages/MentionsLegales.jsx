import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui/Reveal'

const sections = [
  {
    id: 'editeur',
    titre: 'Éditeur du site',
    contenu: [
      { label: 'Dénomination sociale', value: 'Ymmo SAS' },
      { label: 'Siège social', value: '12 cours Mirabeau, 13100 Aix-en-Provence' },
      { label: 'Capital social', value: '50 000 €' },
      { label: 'SIRET', value: '123 456 789 00012' },
      { label: 'RCS', value: 'Aix-en-Provence B 123 456 789' },
      { label: 'Téléphone', value: '+33 4 42 00 00 00' },
      { label: 'Email', value: 'contact@ymmo.fr' },
      { label: 'Directeur de la publication', value: 'Direction Ymmo' },
    ],
  },
  {
    id: 'hebergement',
    titre: 'Hébergement',
    contenu: [
      { label: 'Hébergeur', value: 'Ymmo – Infrastructure interne' },
      { label: 'Adresse', value: '12 cours Mirabeau, 13100 Aix-en-Provence' },
      { label: 'Email technique', value: 'it@ymmo.fr' },
    ],
  },
  {
    id: 'donnees',
    titre: 'Données personnelles & RGPD',
    texte: [
      "Ymmo collecte des données personnelles dans le cadre de la gestion des demandes de contact, des comptes utilisateurs et des services immobiliers proposés. Ces données sont traitées conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.",
      "Les données collectées (nom, prénom, adresse e-mail, numéro de téléphone) sont utilisées exclusivement pour répondre aux demandes d'information et assurer le suivi des mandats immobiliers. Elles ne sont ni cédées, ni vendues à des tiers.",
      "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité de vos données. Pour exercer ces droits ou pour toute question relative au traitement de vos données, contactez notre délégué à la protection des données à l'adresse : dpo@ymmo.fr.",
      "Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : www.cnil.fr.",
    ],
  },
  {
    id: 'cookies',
    titre: 'Cookies',
    texte: [
      "Le site Ymmo utilise des cookies strictement nécessaires au bon fonctionnement du service (session utilisateur, préférences de navigation). Aucun cookie publicitaire ou de tracking tiers n'est déposé sans votre consentement.",
      "Vous pouvez configurer votre navigateur pour refuser les cookies. Certaines fonctionnalités du site peuvent alors être limitées.",
    ],
  },
  {
    id: 'propriete',
    titre: 'Propriété intellectuelle',
    texte: [
      "L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes, structure) est la propriété exclusive de Ymmo ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.",
      "Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Ymmo.",
    ],
  },
  {
    id: 'responsabilite',
    titre: 'Limitation de responsabilité',
    texte: [
      "Les informations contenues sur ce site sont fournies à titre indicatif. Ymmo s'efforce de maintenir les informations exactes et à jour mais ne peut garantir l'exactitude, la complétude ou l'actualité des contenus.",
      "Ymmo décline toute responsabilité pour tout dommage direct ou indirect résultant de l'utilisation du site ou de l'impossibilité d'y accéder. Les liens hypertextes présents sur le site renvoyant vers des sites tiers sont fournis à titre informatif ; Ymmo n'est pas responsable du contenu de ces sites.",
    ],
  },
  {
    id: 'droit',
    titre: 'Droit applicable',
    texte: [
      "Le présent site et les présentes mentions légales sont soumis au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux compétents du ressort d'Aix-en-Provence seront saisis.",
    ],
  },
]

export default function MentionsLegales() {
  return (
    <div className="bg-gris-clair min-h-screen">
      <div className="bg-noir py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="text-marron text-sm font-medium tracking-widest uppercase mb-4">Informations légales</p>
            <h1 className="text-5xl font-black text-blanc leading-tight">Mentions légales</h1>
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

              {section.texte && (
                <div className="space-y-4">
                  {section.texte.map((para, i) => (
                    <p key={i} className="text-gris-fonce leading-relaxed text-sm">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        ))}

        <Reveal>
          <div className="pt-8 border-t border-gris-moyen">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-marron hover:text-marron-fonce transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
