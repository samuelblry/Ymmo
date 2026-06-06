import { Link, useParams } from 'react-router-dom'
import { articles } from '../data/articles'
import NotFound from './NotFound'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ArrowLeftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )
}

export default function BlogArticle() {
  const { id } = useParams()
  const article = articles.find((a) => String(a.id) === String(id))

  if (!article) return <NotFound />

  const related = articles.filter((a) => a.id !== article.id && a.categorie === article.categorie).slice(0, 3)

  return (
    <div className="bg-gris-clair pb-20">
      <section className="relative h-[420px] w-full overflow-hidden sm:h-[520px]">
        <img src={article.image} alt={article.titre} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-end px-6 pb-12">
          <Link
            to="/blog"
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-blanc/15 px-4 py-2 text-sm font-medium text-blanc backdrop-blur-md transition hover:bg-blanc/25"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour au journal
          </Link>
          <span className="w-fit rounded-full bg-marron px-3 py-1 text-xs font-semibold text-blanc">
            {article.categorie}
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-blanc sm:text-5xl">
            {article.titre}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blanc/80">
            <span className="font-semibold text-blanc">{article.auteur}</span>
            <span>·</span>
            <span>{article.role}</span>
            <span>·</span>
            <span>{formatDate(article.date)}</span>
            <span>·</span>
            <span>{article.tempsLecture} min de lecture</span>
          </div>
        </div>
      </section>

      <article className="mx-auto mt-12 max-w-3xl px-6">
        <div className="rounded-2xl border border-gris-moyen/40 bg-blanc p-8 shadow-sm sm:p-12">
          <p className="border-l-4 border-marron pl-5 text-xl font-medium leading-relaxed text-noir">
            {article.extrait}
          </p>

          <div className="mt-10 space-y-6">
            {article.contenu.map((block, i) =>
              block.type === 'h2' ? (
                <h2 key={i} className="mt-10 text-2xl font-bold text-noir">
                  {block.text}
                </h2>
              ) : (
                <p key={i} className="text-base leading-relaxed text-gris-fonce">
                  {block.text}
                </p>
              )
            )}
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-gris-moyen/50 pt-6">
            <div className="text-sm">
              <p className="font-semibold text-noir">{article.auteur}</p>
              <p className="text-gris-fonce">{article.role}</p>
            </div>
            <Link
              to="/blog"
              className="rounded-full bg-noir px-5 py-2 text-sm font-semibold text-blanc transition hover:bg-noir/90"
            >
              Tous les articles
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-noir">À lire aussi</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.id}
                to={`/blog/${a.id}`}
                className="group overflow-hidden rounded-2xl border border-gris-moyen/40 bg-blanc shadow-sm transition hover:shadow-md"
              >
                <div className="overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.titre}
                    className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-marron">{a.categorie}</span>
                  <h3 className="mt-2 text-base font-bold text-noir">{a.titre}</h3>
                  <p className="mt-2 text-xs text-gris-fonce">{formatDate(a.date)} · {a.tempsLecture} min</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
