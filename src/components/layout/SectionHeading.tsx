export default function SectionHeading({
  title,
  action,
}: {
  title: string
  action?: { label: string; url: string }
}) {
  return (
    <div className="mb-10 flex items-center gap-6">
      <h2 className="whitespace-nowrap font-serif text-2xl font-bold text-slate-lightest sm:text-3xl">
        <span className="text-mint">/</span> {title}
      </h2>
      <span className="h-px flex-1 bg-navy-lightest" />
      {action && (
        <a
          href={action.url}
          target="_blank"
          rel="noreferrer"
          className="hidden whitespace-nowrap text-sm text-mint hover:underline sm:inline-block"
        >
          {action.label} &rarr;
        </a>
      )}
    </div>
  )
}
