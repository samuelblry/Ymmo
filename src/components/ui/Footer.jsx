import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Footer() {
  const { user } = useAuth()

  const columns = [
    {
      title: 'Produit',
      links: [
        ['Accueil', '/'],
        ['Annonces', '/annonces'],
        ['Agences', '/agences'],
        ['Blog', '/blog'],
        ...(user ? [['Mon compte', '/compte']] : [['Créer un compte', '/register']]),
      ],
    },
    {
      title: 'Support',
      links: [
        ['À propos', '/a-propos'],
        ['Contact', '/contact'],
        ["Centre d'aide", '/contact'],
      ],
    },
    {
      title: 'Légal',
      links: [
        ['Mentions légales', '/mentions-legales'],
        ['CGU', '/cgu'],
        ['Politique de confidentialité', '/politique-confidentialite'],
      ],
    },
    {
      title: 'Réseaux sociaux',
      links: [
        ['Instagram', '#'],
        ['LinkedIn', '#'],
      ],
    },
  ]

  return (
    <footer className="relative mt-20 overflow-hidden rounded-t-[40px] bg-marron-fonce text-blanc">
      <div className="pointer-events-none absolute bottom-0 right-0 h-full w-1/2 overflow-hidden">
        <img
          src="/img/cercle-3.svg"
          alt=""
          aria-hidden="true"
          className="absolute -right-[230px] -bottom-[260px] w-[500px]"
        />
        <img
          src="/img/cercle-1.svg"
          alt=""
          aria-hidden="true"
          className="absolute right-[60px] bottom-[30px] w-[180px] opacity-80"
        />
        <img
          src="/img/cercle-2.svg"
          alt=""
          aria-hidden="true"
          className="absolute right-[200px] bottom-[80px] w-[40px] opacity-90"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-2xl font-bold">Ymmo</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-blanc/80">
              La plateforme immobilière moderne qui facilite l'achat et la vente
              de biens partout en France, en connectant particuliers et agences
              de confiance.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-blanc/80 transition-colors hover:text-blanc"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-blanc/20 pt-6 text-center text-sm text-blanc/70">
          © {new Date().getFullYear()} Ymmo · Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
