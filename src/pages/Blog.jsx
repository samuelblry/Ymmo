import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { articles, categoriesArticles } from '../data/articles'
import { apiFetch } from '../lib/api'
import { mapArticle } from '../lib/dataMappers'
import { SearchIcon } from '../components/ui/icons'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArticleCard({ article, featured = false }) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm transition hover:shadow-md ${
        featured ? 'lg:col-span-2 lg:flex' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2' : ''}`}>
        <img
          src={article.image}
          alt={article.titre}
          className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
            featured ? 'h-full min-h-[280px]' : 'aspect-[16/10]'
          }`}
        />
        <span className="absolute left-3 top-3 rounded-full bg-blanc/95 px-3 py-1 text-xs font-semibold text-noir shadow-sm">
          {article.categorie}
        </span>
      </div>
      <div className={`p-6 ${featured ? 'lg:w-1/2 lg:p-8' : ''}`}>
        <div className="flex items-center gap-3 text-xs text-gris-fonce">
          <span>{formatDate(article.date)}</span>
          <span>·</span>
          <span>{article.tempsLecture} min de lecture</span>
        </div>
        <h3 className={`mt-3 font-bold text-noir ${featured ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
          {article.titre}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gris-fonce">{article.extrait}</p>
        <div className="mt-5 flex items-center justify-between border-t border-gris-moyen/50 pt-4">
          <div className="text-xs">
            <p className="font-semibold text-noir">{article.auteur}</p>
            <p className="text-gris-fonce">{article.role}</p>
          </div>
          <Link
            to={`/blog/${article.id}`}
            className="rounded-full bg-marron px-4 py-2 text-xs font-semibold text-blanc transition hover:bg-marron/90"
          >
            Lire l’article
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Blog() {
  const [categorie, setCategorie] = useState('Toutes')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(articles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    apiFetch('/api/articles')
      .then((data) => {
        if (!ignore) setItems(data.map(mapArticle))
      })
      .catch(() => {
        if (!ignore) setItems(articles)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchCat = categorie === 'Toutes' || a.categorie === categorie
      const matchQuery =
        !query ||
        a.titre.toLowerCase().includes(query.toLowerCase()) ||
        a.extrait.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [categorie, items, query])

  const [featured, ...rest] = filtered

  return (
    <div className="bg-gris-clair pb-20">
      <section className="relative overflow-hidden pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#EFE7DD_0%,#F5F5F4_100%)]" />
        <img
          src="/img/cercle-3.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 w-[480px] opacity-60"
        />
        <img
          src="/img/cercle-1.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 bottom-0 w-[260px] opacity-50"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] text-noir sm:text-6xl">
            Le <span className="font-serif text-marron">journal</span> Ymmo
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gris-fonce">
            Analyses du marché, conseils d’experts et regards sur l’immobilier français. La rédaction Ymmo décrypte pour vous.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt--5 max-w-7xl px-6">
        <div className="rounded-2xl border border-gris-moyen/50 bg-blanc p-4 shadow-sm">
          <div className="flex items-center gap-3 rounded-full border border-gris-moyen/50 bg-gris-clair px-5 py-3">
            <SearchIcon className="h-4 w-4 text-gris-fonce" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="flex-1 bg-transparent text-sm text-noir placeholder:text-gris-fonce focus:outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categoriesArticles.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategorie(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  categorie === c
                    ? 'bg-marron text-blanc shadow-sm'
                    : 'bg-gris-clair text-gris-fonce hover:bg-marron-clair hover:text-noir'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-noir">
            {filtered.length} article{filtered.length > 1 ? 's' : ''}
            {categorie !== 'Toutes' && ` — ${categorie}`}
          </h2>
          <span className="text-sm text-gris-fonce">Trié par date</span>
        </div>

        {loading ? (
          <p className="rounded-2xl border border-gris-moyen/50 bg-blanc p-10 text-center text-gris-fonce">
            Chargement des articles...
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-gris-moyen/50 bg-blanc p-10 text-center text-gris-fonce">
            Aucun article ne correspond à votre recherche.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {featured && <ArticleCard article={featured} featured />}
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
