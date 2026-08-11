import { site } from '../../content/site'
import TypewriterRich from '../effects/TypewriterRich'
import DotMatrixPortrait from '../effects/DotMatrixPortrait'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section id="home" className="flex min-h-screen items-center px-6 pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="order-2 flex items-center justify-center md:order-1">
          {/* PNG con fondo transparente: el efecto usa el canal alpha como silueta */}
          <DotMatrixPortrait imageSrc="/images/portrait.png" alt={site.name} />
        </div>

        <div className="order-1 md:order-2">
          <h1 className="font-serif text-4xl font-bold text-slate-lightest sm:text-5xl">
            <TypewriterRich
              segments={[
                { text: 'hi, ' },
                { text: site.firstName, className: 'text-mint' },
                { text: ' here.' },
              ]}
            />
          </h1>
          <p className="mt-6 max-w-md text-slate">{site.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded border border-mint px-5 py-3 text-sm font-medium text-mint transition-colors hover:bg-mint/10"
          >
            <MailIcon />
            Say hi!
          </a>
        </div>
      </div>
    </section>
  )
}
