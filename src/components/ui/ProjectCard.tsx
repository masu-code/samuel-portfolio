import type { ProjectEntry } from '../../types/content'

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-8 w-8">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  )
}

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

export default function ProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <div className="flex flex-col rounded-lg border border-transparent bg-navy-light/40 p-6 transition-colors hover:border-mint/40">
      <div className="flex items-start justify-between">
        <FolderIcon />
        <div className="flex items-center gap-3 text-mint">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} en GitHub`}
              className="hover:text-slate-lightest"
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
              className="hover:text-slate-lightest"
            >
              <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>
      <h3 className="mt-4 font-serif text-lg font-bold text-slate-lightest">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate">{project.description}</p>
      <p className="mt-4 text-xs text-slate-light">{project.tags.join(', ')}</p>
    </div>
  )
}
