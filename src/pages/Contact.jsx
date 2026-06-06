import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal'
import { agencies } from '../data/agencies'

const hq = agencies.find((a) => a.isHQ)

const MapPinIcon = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const PhoneIcon = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
)
const MailIcon = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const ClockIcon = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)
const CheckIcon = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const sujets = [
  'Achat d\'un bien',
  'Vente d\'un bien',
  'Estimation gratuite',
  'Prise de contact avec une agence',
  'Problème technique',
  'Autre',
]

const infos = [
  {
    icon: MapPinIcon,
    label: 'Siège social',
    value: hq.address,
  },
  {
    icon: PhoneIcon,
    label: 'Téléphone',
    value: hq.phone,
  },
  {
    icon: MailIcon,
    label: 'E-mail',
    value: 'contact@ymmo.fr',
  },
  {
    icon: ClockIcon,
    label: 'Horaires',
    value: 'Lun – Ven : 9h – 18h',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ sujet: '', nom: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-marron">Contact</p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.05] text-noir md:text-6xl lg:text-7xl">
            Parlons de votre
            <br />
            <span className="font-serif text-marron">projet.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gris-fonce">
            Notre équipe est disponible pour répondre à toutes vos questions sur l'achat, la vente ou
            la gestion de vos biens immobiliers.
          </p>
        </Reveal>
      </section>

      {/* Contenu principal */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Formulaire — 3/5 */}
          <div className="lg:col-span-3">
            <Reveal className="rounded-3xl bg-blanc p-8 shadow-sm md:p-10">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-marron/10">
                    <CheckIcon className="h-8 w-8 text-marron" />
                  </span>
                  <h2 className="mt-6 text-2xl font-bold text-noir">Message envoyé !</h2>
                  <p className="mt-3 max-w-sm text-sm text-gris-fonce">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSent(false); setForm({ sujet: '', nom: '', email: '', message: '' }) }}
                    className="mt-8 rounded-full border border-gris-moyen px-6 py-2.5 text-sm font-medium text-noir transition-colors hover:border-marron hover:text-marron"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-noir">Envoyer un message</h2>
                  <p className="mt-1 text-sm text-gris-fonce">Tous les champs sont obligatoires.</p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                      <label htmlFor="sujet" className="block text-sm font-medium text-noir">
                        Sujet
                      </label>
                      <select
                        id="sujet"
                        name="sujet"
                        required
                        value={form.sujet}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                      >
                        <option value="" disabled>Choisir un sujet…</option>
                        {sujets.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-noir">
                          Nom complet
                        </label>
                        <input
                          id="nom"
                          name="nom"
                          type="text"
                          required
                          value={form.nom}
                          onChange={handleChange}
                          placeholder="Jean Dupont"
                          className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-noir">
                          Adresse e-mail
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="exemple@email.com"
                          className="mt-2 w-full rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-noir">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre projet ou votre demande…"
                        className="mt-2 w-full resize-none rounded-xl border border-gris-moyen bg-gris-clair px-4 py-3 text-sm text-noir placeholder:text-gris-fonce/60 focus:border-marron focus:outline-none focus:ring-2 focus:ring-marron/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-marron py-3 text-sm font-semibold text-blanc transition-opacity hover:opacity-90"
                    >
                      Envoyer le message
                    </button>
                  </form>
                </>
              )}
            </Reveal>
          </div>

          {/* Infos — 2/5 */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Stagger className="flex flex-col gap-4">
              {infos.map(({ icon: Icon, label, value }) => (
                <StaggerItem key={label}>
                  <div className="flex items-start gap-4 rounded-2xl border border-gris-moyen/40 bg-blanc p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marron-clair">
                      <Icon className="h-5 w-5 text-marron" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-gris-fonce">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-noir">{value}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {/* CTA agences */}
            <Reveal className="mt-2 overflow-hidden rounded-2xl bg-marron-fonce p-7 text-blanc">
              <p className="text-lg font-bold leading-snug">
                Trouver une agence<br />
                <span className="font-serif text-marron-clair/80">près de chez vous</span>
              </p>
              <p className="mt-3 text-sm text-blanc/70">
                Ymmo compte {agencies.length} agences réparties dans toute la France.
              </p>
              <Link
                to="/agences"
                className="mt-5 inline-flex rounded-full bg-blanc/10 px-5 py-2.5 text-sm font-semibold text-blanc transition-colors hover:bg-blanc/20"
              >
                Voir toutes les agences
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <Reveal>
          <h2 className="text-3xl font-bold text-noir md:text-4xl">
            Questions <span className="font-serif text-marron">fréquentes</span>
          </h2>
        </Reveal>
        <Stagger className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            {
              q: 'Comment obtenir une estimation de mon bien ?',
              a: 'Contactez-nous via ce formulaire en sélectionnant "Estimation gratuite". Un conseiller Ymmo vous rappellera sous 48 h.',
            },
            {
              q: 'Puis-je visiter un bien sans créer de compte ?',
              a: 'Vous pouvez consulter toutes les annonces librement. La prise de rendez-vous nécessite un compte Ymmo.',
            },
            {
              q: 'Quel est le délai de réponse moyen ?',
              a: 'Notre équipe traite les demandes sous 24 à 48 h ouvrées. Pour les urgences, préférez un appel téléphonique.',
            },
            {
              q: 'Comment contacter une agence spécifique ?',
              a: "Rendez-vous sur la page Agences pour trouver les coordonnées de l'agence la plus proche.",
            },
          ].map(({ q, a }) => (
            <StaggerItem key={q}>
              <div className="rounded-2xl bg-marron-clair p-6">
                <p className="font-semibold text-noir">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-gris-fonce">{a}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  )
}
