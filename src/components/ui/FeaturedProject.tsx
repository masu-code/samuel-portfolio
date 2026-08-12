import { useState } from 'react'
import type { ProjectEntry } from '../../types/content'
import ImageWithFallback from './ImageWithFallback'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.08.78 2.17v3.22c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

export default function FeaturedProject({ projects }: { projects: ProjectEntry[] }) {
  const [index, setIndex] = useState(0)
  const project = projects[index]

  const goTo = (i: number) => setIndex((i + projects.length) % projects.length)

  return (
    <div className="mb-12">
      <div className="relative overflow-hidden rounded-lg border border-navy-lightest">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="h-72 w-full bg-navy-light object-contain sm:h-96"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-center">
          <h3 className="font-serif text-xl font-bold text-slate-lightest">{project.title}</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-light">{project.description}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-slate">{project.tags.join(' · ')}</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} en GitHub`}
                className="text-slate-light hover:text-mint"
              >
                <GithubIcon />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} en vivo`}
                className="text-slate-light hover:text-mint"
              >
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>

        {projects.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 px-2 text-2xl text-slate-light hover:text-mint"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-2xl text-slate-light hover:text-mint"
            >
              &rsaquo;
            </button>
          </>
        )}
      </div>

      {projects.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i === index ? 'bg-mint' : 'bg-navy-lightest'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
