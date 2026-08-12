export default function TechList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span className="text-mint">▹</span>
          {item}
        </li>
      ))}
    </ul>
  )
}
