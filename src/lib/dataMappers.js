import { agencies as agencyFallbacks } from '../data/agencies'
import { articles as articleFallbacks } from '../data/articles'

const euro = (n) => `${new Intl.NumberFormat('fr-FR').format(Number(n))} €`

const imageUrl = (images, fallback = '/img/listing-1.png') =>
  images?.find((img) => img.is_main)?.url ?? images?.[0]?.url ?? fallback

export const mapListing = (bien, index = 0) => ({
  id: bien.id_bien,
  agencyId: bien.id_agence,
  title: bien.titre,
  type: bien.type_bien,
  price: Number(bien.prix),
  address: bien.adresse ?? `${bien.ville}, ${bien.code_postal}`,
  city: bien.ville,
  status: bien.statut,
  beds: bien.nb_chambres,
  baths: bien.nb_sdb,
  area: bien.surface,
  terraces: bien.caracteristiques?.toLowerCase().includes('terrasse') ? 1 : 0,
  image: imageUrl(bien.images, index % 2 === 0 ? '/img/listing-1.png' : '/img/listing-2.png'),
  images: bien.images?.length ? bien.images.map((img) => img.url) : ['/img/listing-1.png', '/img/listing-2.png'],
  priceLabel: euro(bien.prix),
  description: bien.description,
  details: [
    `Type : ${bien.type_bien}`,
    `Surface : ${bien.surface}m²`,
    `${bien.nb_pieces} pièce${bien.nb_pieces > 1 ? 's' : ''}`,
    ...(bien.nb_chambres > 0 ? [`${bien.nb_chambres} chambre${bien.nb_chambres > 1 ? 's' : ''}`] : []),
    ...(bien.nb_sdb > 0 ? [`${bien.nb_sdb} salle${bien.nb_sdb > 1 ? 's' : ''} de bain`] : []),
    ...(bien.caracteristiques ? bien.caracteristiques.split(',').map((item) => item.trim()) : []),
  ],
  agent: {
    name: 'Conseiller Ymmo',
    role: 'Conseiller immobilier',
    phone: '04 00 00 00 00',
    rating: 4,
    reviews: 8,
  },
})

export const mapAgency = (agence) => {
  const fallback = agencyFallbacks.find((item) => item.id === agence.id_agence)
  return {
    id: agence.id_agence,
    name: agence.nom_agence,
    city: agence.ville,
    region: fallback?.region ?? 'France',
    address: agence.adresse,
    phone: agence.telephone,
    email: agence.email,
    listings: fallback?.listings ?? 0,
    image: agence.image_url ?? fallback?.image ?? '/img/agences/agence_aix.png',
    isHQ: fallback?.isHQ ?? false,
    description: agence.description,
  }
}

export const mapArticle = (article, index = 0) => {
  const fallback = articleFallbacks.find((item) => item.id === article.id_article)
  const paragraphs = article.contenu
    .split(/\n+/)
    .filter(Boolean)
    .map((text) => ({ type: 'p', text }))

  return {
    id: article.id_article,
    titre: article.titre,
    extrait: fallback?.extrait ?? article.contenu.slice(0, 160),
    image: article.image_url ?? fallback?.image ?? `/img/blog-${(index % 3) + 1}.png`,
    auteur: fallback?.auteur ?? 'Equipe Ymmo',
    role: fallback?.role ?? 'Redaction Ymmo',
    date: article.date_envoi,
    categorie: fallback?.categorie ?? 'Tendances',
    tempsLecture: fallback?.tempsLecture ?? Math.max(3, Math.ceil(article.contenu.length / 900)),
    contenu: fallback?.contenu ?? paragraphs,
  }
}
