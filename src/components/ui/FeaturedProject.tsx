import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

function ChevronIcon({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={`h-8 w-8 ${flip ? 'rotate-180' : ''}`}
    >
      <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
    </svg>
  )
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function FeaturedProject({ projects }: { projects: ProjectEntry[] }) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0])
  const project = projects[index]
  const isPortrait = project.orientation === 'portrait'

  const descRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => setExpanded(false), [index])

  useEffect(() => {
    if (expanded) return
    const el = descRef.current
    if (!el) return
    const measure = () => setIsTruncated(el.scrollHeight > el.clientHeight + 1)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [project, expanded])

  // Preload every slide's image up front so switching slides is instant
  // instead of waiting on a fresh network request each time.
  useEffect(() => {
    const images = projects.map((p) => {
      const img = new Image()
      img.src = p.image
      return img
    })
    return () => {
      images.forEach((img) => {
        img.src = ''
      })
    }
  }, [projects])

  const goTo = (i: number, dir: number) => setSlide([(i + projects.length) % projects.length, dir])

  return (
    <div className="mb-12">
      <div
        className={`relative mx-auto overflow-hidden rounded-2xl ${
          isPortrait ? 'aspect-[9/16] h-[32rem] sm:h-[36rem]' : 'h-80 w-full sm:h-[34rem]'
        }`}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              className="h-full w-full object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 from-0% via-navy/15 via-35% to-transparent to-48%" />

            <div
              className={`absolute inset-x-0 bottom-0 p-6 text-center [text-shadow:0_2px_10px_rgba(10,25,47,0.95),0_1px_3px_rgba(10,25,47,0.95)] ${
                expanded ? 'rounded-t-2xl bg-navy/90 backdrop-blur-sm' : ''
              }`}
            >
              <h3 className="font-serif text-xl font-bold text-slate-lightest">{project.title}</h3>
              <p
                ref={descRef}
                className={`mx-auto mt-2 max-w-xl text-sm text-slate-light ${expanded ? '' : 'line-clamp-2 sm:line-clamp-none'}`}
              >
                {project.description}
              </p>
              {isTruncated && (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="mt-1 text-xs font-medium text-mint underline-offset-2 hover:underline sm:hidden"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
              <p className="mt-2 text-xs uppercase tracking-wide text-slate-light">{project.tags.join(' · ')}</p>
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
          </motion.div>
        </AnimatePresence>

        {projects.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(index - 1, -1)}
              className="absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-slate-lightest opacity-50 transition-opacity hover:opacity-90 focus-visible:opacity-90 sm:w-16"
            >
              <ChevronIcon />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(index + 1, 1)}
              className="absolute inset-y-0 right-0 z-10 flex w-12 items-center justify-center text-slate-lightest opacity-50 transition-opacity hover:opacity-90 focus-visible:opacity-90 sm:w-16"
            >
              <ChevronIcon flip />
            </button>
          </>
        )}
      </div>

      {projects.length > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i, i > index ? 1 : -1)}
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
