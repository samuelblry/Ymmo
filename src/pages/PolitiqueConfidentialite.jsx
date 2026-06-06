import { Link } from 'react-router-dom'
import { Reveal } from '../components/ui/Reveal'

const sections = [
  {
    id: 'introduction',
    titre: 'Introduction',
    texte: [
      "Ymmo SAS (ci-après « Ymmo ») s'engage à protéger la vie privée des utilisateurs de son site web. La présente Politique de confidentialité décrit quelles données personnelles sont collectées, pourquoi elles le sont, comment elles sont utilisées et quels droits vous disposez à leur égard.",
      "Cette politique s'applique à toute personne utilisant le site ymmo.fr, qu'elle soit simple visiteur, utilisateur inscrit ou employé du groupe.",
    ],
  },
  {
    id: 'responsable',
    titre: 'Responsable du traitement',
    contenu: [
      { label: 'Société', value: 'Ymmo SAS' },
      { label: 'Adresse', value: '12 cours Mirabeau, 13100 Aix-en-Provence' },
      { label: 'DPO', value: 'dpo@ymmo.fr' },
    ],
  },
  {
    id: 'collecte',
    titre: 'Données collectées',
    texte: [
      "Nous collectons uniquement les données nécessaires à la fourniture de nos services :",
    ],
    liste: [
      "Données d'identification : nom, prénom, adresse e-mail, numéro de téléphone — lors de l'inscription ou de l'envoi d'un formulaire de contact.",
      "Données de navigation : adresse IP, type de navigateur, pages consultées, durée des visites — via des cookies techniques strictement nécessaires.",
      "Données de transaction : historique des biens consultés, favoris enregistrés, messages envoyés aux agences.",
      "Données staff : pour les employés Ymmo, adresse e-mail professionnelle, rôle, agence d'appartenance, historique de connexion (logs) à des fins de sécurité.",
    ],
  },
  {
    id: 'finalites',
    titre: 'Finalités du traitement',
    liste: [
      "Gestion des comptes utilisateurs et de l'authentification.",
      "Réponse aux demandes de contact et mise en relation avec les agences.",
      "Personnalisation de l'expérience (favoris, historique de recherche).",
      "Sécurité du site et prévention des accès non autorisés (logs de connexion).",
      "Amélioration des services via des statistiques agrégées anonymisées.",
      "Respect des obligations légales (conservation des logs conformément à la loi pour la Confiance dans l'Économie Numérique).",
    ],
  },
  {
    id: 'base-legale',
    titre: 'Base légale',
    texte: [
      "Les traitements reposent sur les bases légales suivantes : exécution du contrat (gestion du compte utilisateur), intérêt légitime (sécurité du site, statistiques), obligation légale (conservation des logs), et consentement pour tout traitement non strictement nécessaire.",
    ],
  },
  {
    id: 'conservation',
    titre: 'Durée de conservation',
    liste: [
      "Données de compte utilisateur : conservées pendant la durée d'activité du compte, puis 3 ans après la dernière connexion.",
      "Messages de contact : 1 an après le traitement de la demande.",
      "Logs de connexion : 1 an, conformément à la réglementation LCEN.",
      "Données de navigation (cookies) : 13 mois maximum.",
    ],
  },
  {
    id: 'partage',
    titre: 'Partage des données',
    texte: [
      "Ymmo ne vend ni ne loue vos données personnelles à des tiers. Les données peuvent être partagées uniquement dans les cas suivants :",
    ],
    liste: [
      "Avec les agences Ymmo concernées par votre demande de contact — dans le cadre strict de la relation client.",
      "Avec des prestataires techniques (hébergement, maintenance) liés par des clauses de confidentialité strictes.",
      "Avec les autorités compétentes sur réquisition judiciaire ou obligation légale.",
    ],
  },
  {
    id: 'droits',
    titre: 'Vos droits',
    texte: [
      "Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :",
    ],
    liste: [
      "Droit d'accès : obtenir une copie des données vous concernant.",
      "Droit de rectification : corriger des données inexactes ou incomplètes.",
      "Droit à l'effacement (« droit à l'oubli ») : demander la suppression de vos données, sous réserve des obligations légales de conservation.",
      "Droit à la limitation : restreindre temporairement le traitement de vos données.",
      "Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine.",
      "Droit d'opposition : vous opposer à certains traitements basés sur l'intérêt légitime.",
    ],
    textePost: [
      "Pour exercer ces droits, contactez notre DPO à dpo@ymmo.fr. Nous répondons sous 30 jours. En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la CNIL : www.cnil.fr.",
    ],
  },
  {
    id: 'securite',
    titre: 'Sécurité',
    texte: [
      "Ymmo met en oeuvre des mesures techniques et organisationnelles adaptées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation : chiffrement des communications (HTTPS/TLS), hachage des mots de passe, authentification double facteur pour le personnel, segmentation réseau et pare-feu.",
      "En cas de violation de données présentant un risque pour vos droits et libertés, nous notifierons la CNIL dans les 72 heures et vous en informerons sans délai injustifié.",
    ],
  },
  {
    id: 'cookies',
    titre: 'Cookies',
    texte: [
      "Le site utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session utilisateur, préférences). Aucun cookie publicitaire ni tracker tiers n'est déposé.",
      "Vous pouvez configurer votre navigateur pour bloquer ou supprimer les cookies. Certaines fonctionnalités du site pourraient alors être altérées.",
    ],
  },
  {
    id: 'modifications',
    titre: 'Modifications',
    texte: [
      "Ymmo se réserve le droit de mettre à jour cette politique à tout moment, notamment pour se conformer à de nouvelles obligations légales. La date de dernière mise à jour est indiquée en haut de page. En cas de modification substantielle, nous vous en informerons par e-mail ou via une notification visible sur le site.",
    ],
  },
]

export default function PolitiqueConfidentialite() {
  return (
    <div className="bg-gris-clair min-h-screen">
      <div className="bg-noir py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="text-marron text-sm font-medium tracking-widest uppercase mb-4">Informations légales</p>
            <h1 className="text-5xl font-black text-blanc leading-tight">Politique de confidentialité</h1>
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
                <dl className="space-y-3 mb-4">
                  {section.contenu.map((item) => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:gap-8">
                      <dt className="text-gris-fonce text-sm font-medium w-52 shrink-0">{item.label}</dt>
                      <dd className="text-noir text-sm">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {section.texte && (
                <div className="space-y-4 mb-4">
                  {section.texte.map((para, i) => (
                    <p key={i} className="text-gris-fonce leading-relaxed text-sm">{para}</p>
                  ))}
                </div>
              )}

              {section.liste && (
                <ul className="space-y-2 mb-4 pl-4 border-l-2 border-marron-clair">
                  {section.liste.map((item, i) => (
                    <li key={i} className="text-gris-fonce text-sm leading-relaxed flex gap-2">
                      <span className="text-marron mt-0.5 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.textePost && (
                <div className="space-y-4">
                  {section.textePost.map((para, i) => (
                    <p key={i} className="text-gris-fonce leading-relaxed text-sm">{para}</p>
                  ))}
                </div>
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
            <Link to="/cgu" className="text-sm font-semibold text-gris-fonce hover:text-noir transition-colors">
              CGU
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
