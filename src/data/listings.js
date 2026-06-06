const altImage = (i) => (i % 2 === 0 ? '/img/listing-1.png' : '/img/listing-2.png')

const gallery = ['/img/listing-1.png', '/img/listing-2.png']

export const listingsDetailed = [
  {
    id: 1,
    title: 'Maison contemporaine',
    city: 'Aix-en-Provence',
    price: 520000,
    address: '290 Chemin de l’Olivier, Aix-en-Provence',
    status: 'À vendre',
    beds: 4,
    terraces: 1,
    baths: 2,
    area: 138,
    images: gallery,
    description:
      'Magnifique maison contemporaine située dans un quartier prisé d’Aix-en-Provence. Elle offre de beaux volumes, des prestations soignées et une luminosité exceptionnelle grâce à de larges baies vitrées. Le jardin paysager et la piscine en font un véritable cocon familial, à deux pas du centre-ville et de toutes les commodités.',
    details: [
      '1 garage',
      'Terrasse 35m²',
      'Piscine chauffée',
      'DPE : A',
      'Jardin clos arboré',
      'Cuisine équipée',
    ],
    agent: {
      name: 'Maxime Durand',
      role: 'Conseiller immobilier',
      photo: '/img/agent-1.png',
      phone: '04 92 92 10 10',
      rating: 5,
      reviews: 24,
    },
  },
]

export const similarListings = [
  { id: 1002, title: 'Appartement T3 centre historique', city: 'Aix-en-Provence', price: 320000, beds: 3, baths: 1, extra: 'Pièces', image: '/img/listing-2.png' },
  { id: 1003, title: 'Villa contemporaine avec jardin', city: 'Aix-en-Provence', price: 620000, beds: 4, baths: 2, extra: 'Jardin', image: '/img/listing-1.png' },
  { id: 2001, title: 'Appartement T4 vue mer Prado', city: 'Marseille', price: 450000, beds: 4, baths: 2, extra: 'Vue mer', image: '/img/listing-2.png' },
]

const euro = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €'

const mkListing = (id, agencyId, title, type, price, address, beds, baths, area, img) => ({
  id, agencyId, title, type, price, address, beds, baths, area,
  image: img === 1 ? '/img/listing-1.png' : '/img/listing-2.png',
  priceLabel: euro(price),
})

const agencyListingsData = [
  mkListing(1001, 1, 'Bastide provençale avec piscine', 'Maison', 780000, '14 Chemin des Pins, Aix-en-Provence', 5, 3, 210, 1),
  mkListing(1002, 1, 'Appartement T3 centre historique', 'Appartement', 320000, '8 Rue des Cardeurs, Aix-en-Provence', 3, 1, 72, 2),
  mkListing(1003, 1, 'Villa contemporaine avec jardin', 'Maison', 620000, '32 Route de Galice, Aix-en-Provence', 4, 2, 175, 1),
  mkListing(1004, 1, 'Terrain constructible 800m²', 'Terrain', 195000, 'Chemin de Biver, Aix-en-Provence', 0, 0, 800, 2),

  mkListing(2001, 2, 'Appartement T4 vue mer Prado', 'Appartement', 450000, '18 Bd Michelet, Marseille 8e', 4, 2, 98, 2),
  mkListing(2002, 2, 'Maison de village Les Goudes', 'Maison', 590000, '3 Rue du Phare, Marseille 8e', 4, 2, 140, 1),
  mkListing(2003, 2, 'T2 rénové Cours Julien', 'Appartement', 185000, '21 Rue Crudère, Marseille 6e', 2, 1, 48, 2),
  mkListing(2004, 2, 'Local commercial La Canebière', 'Local pro', 320000, '55 La Canebière, Marseille 1er', 0, 0, 85, 1),

  mkListing(3001, 3, 'Appartement vue mer Promenade', 'Appartement', 680000, '42 Prom. des Anglais, Nice', 3, 2, 105, 1),
  mkListing(3002, 3, 'Maison Cimiez avec terrasse', 'Maison', 890000, '7 Bd de Cimiez, Nice', 5, 3, 195, 2),
  mkListing(3003, 3, 'Studio pied-à-terre vieux-Nice', 'Appartement', 145000, '12 Rue Droite, Nice', 1, 1, 28, 1),

  mkListing(4001, 4, 'Appartement haussmannien Presqu\'île', 'Appartement', 420000, '5 Rue de la République, Lyon 2e', 3, 1, 88, 2),
  mkListing(4002, 4, 'Maison Croix-Rousse avec vue', 'Maison', 550000, '18 Montée de la Grande-Côte, Lyon 1er', 4, 2, 130, 1),
  mkListing(4003, 4, 'T3 neuf Confluence', 'Appartement', 370000, '8 Cours Charlemagne, Lyon 2e', 3, 2, 76, 2),

  mkListing(5001, 5, 'Appartement T3 proche fac', 'Appartement', 195000, '14 Av. Alsace-Lorraine, Grenoble', 3, 1, 65, 1),
  mkListing(5002, 5, 'Maison périurbaine avec jardin', 'Maison', 310000, '6 Rue des Alpes, Échirolles', 4, 2, 115, 2),
  mkListing(5003, 5, 'Studio étudiant centre-ville', 'Appartement', 98000, '3 Rue Jean-Jacques Rousseau, Grenoble', 1, 1, 22, 1),

  mkListing(6001, 6, 'Appartement haussmannien 16e', 'Appartement', 1250000, '12 Av. Foch, Paris 16e', 4, 2, 120, 2),
  mkListing(6002, 6, 'Loft atypique Le Marais', 'Appartement', 980000, '7 Rue de Bretagne, Paris 3e', 2, 1, 95, 1),
  mkListing(6003, 6, 'Pied-à-terre Saint-Germain', 'Appartement', 620000, '22 Rue du Four, Paris 6e', 2, 1, 52, 2),
  mkListing(6004, 6, 'Maison de ville Montmartre', 'Maison', 1480000, '9 Rue Lepic, Paris 18e', 5, 3, 185, 1),

  mkListing(7001, 7, 'Maison familiale quartier Notre-Dame', 'Maison', 740000, '4 Rue des Chantiers, Versailles', 5, 3, 180, 1),
  mkListing(7002, 7, 'Appartement T4 proche château', 'Appartement', 480000, '18 Av. de Paris, Versailles', 4, 2, 102, 2),
  mkListing(7003, 7, 'Pavillon avec jardin Saint-Louis', 'Maison', 590000, '11 Rue de la Paroisse, Versailles', 4, 2, 145, 1),

  mkListing(8001, 8, 'Appartement chartrons vue Garonne', 'Appartement', 390000, '24 Quai des Chartrons, Bordeaux', 3, 1, 82, 2),
  mkListing(8002, 8, 'Maison girondine avec vignes', 'Maison', 485000, '12 Chemin des Vignes, Mérignac', 4, 2, 150, 1),
  mkListing(8003, 8, 'T2 rénové Victoire', 'Appartement', 220000, '5 Place de la Victoire, Bordeaux', 2, 1, 55, 2),

  mkListing(9001, 9, 'Appartement T3 Capitole', 'Appartement', 265000, '8 Rue Saint-Rome, Toulouse', 3, 1, 70, 1),
  mkListing(9002, 9, 'Mas rénové périphérie', 'Maison', 420000, '14 Chemin de la Croix, Tournefeuille', 5, 2, 165, 2),
  mkListing(9003, 9, 'T2 Compans-Caffarelli', 'Appartement', 185000, '3 Allée de Barcelone, Toulouse', 2, 1, 46, 1),

  mkListing(10001, 10, 'Appartement T3 Écusson', 'Appartement', 235000, '6 Rue de l\'Aiguillerie, Montpellier', 3, 1, 68, 2),
  mkListing(10002, 10, 'Villa Port-Marianne', 'Maison', 520000, '22 Av. de la Mer, Montpellier', 4, 2, 140, 1),
  mkListing(10003, 10, 'Studio proche fac médecine', 'Appartement', 88000, '1 Bd Henri IV, Montpellier', 1, 1, 20, 2),

  mkListing(11001, 11, 'Maison île de Nantes', 'Maison', 430000, '8 Quai François Mitterrand, Nantes', 4, 2, 125, 1),
  mkListing(11002, 11, 'Appartement T3 Bouffay', 'Appartement', 270000, '14 Rue de la Juiverie, Nantes', 3, 1, 72, 2),
  mkListing(11003, 11, 'Maison avec jardin Doulon', 'Maison', 310000, '5 Rue de la Planche, Nantes', 4, 2, 108, 1),

  mkListing(12001, 12, 'Maison de ville Vieux-Lille', 'Maison', 395000, '7 Rue de la Monnaie, Lille', 4, 2, 130, 2),
  mkListing(12002, 12, 'Appartement T2 Euralille', 'Appartement', 165000, '3 Av. Willy Brandt, Lille', 2, 1, 44, 1),
  mkListing(12003, 12, 'Maison familiale Lambersart', 'Maison', 340000, '12 Rue de l\'Église, Lambersart', 5, 2, 145, 2),
]

export const getListingsByAgency = (agencyId) =>
  agencyListingsData.filter((l) => l.agencyId === agencyId)

const buildDetailFromAgency = (item) => ({
  id: item.id,
  title: item.title,
  city: item.address.split(',').slice(-1)[0].trim(),
  price: item.price,
  address: item.address,
  status: 'À vendre',
  beds: item.beds,
  terraces: 0,
  baths: item.baths,
  area: item.area,
  images: [item.image, item.image],
  description: `Découvrez ce ${item.type.toLowerCase()} de ${item.area}m² situé à ${item.address}. Un bien soigneusement sélectionné par nos conseillers Ymmo, idéalement positionné sur son marché.`,
  details: [
    `Type : ${item.type}`,
    `Surface : ${item.area}m²`,
    ...(item.beds > 0 ? [`${item.beds} chambre${item.beds > 1 ? 's' : ''}`] : []),
    ...(item.baths > 0 ? [`${item.baths} salle${item.baths > 1 ? 's' : ''} de bain`] : []),
    'DPE : B',
    'Double vitrage',
  ],
  agent: {
    name: 'Conseiller Ymmo',
    role: 'Conseiller immobilier',
    photo: '/img/agent-1.png',
    phone: '04 00 00 00 00',
    rating: 4,
    reviews: 8,
  },
})

export const getListing = (id) =>
  listingsDetailed.find((l) => l.id === Number(id)) ??
  (agencyListingsData.find((l) => l.id === Number(id))
    ? buildDetailFromAgency(agencyListingsData.find((l) => l.id === Number(id)))
    : null)

export const latestListings = agencyListingsData.slice(0, 3)
export const popularListings = agencyListingsData.slice(3, 6)
export const allListings = agencyListingsData
