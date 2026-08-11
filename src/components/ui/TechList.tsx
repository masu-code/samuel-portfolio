export default function TechList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-2 font-mono text-sm text-slate sm:grid-cols-3">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="text-mint">▹</span>
          {item}
        </li>
      ))}
    </ul>
  )
}
