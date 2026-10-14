import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-paper">
      <span className="font-mono text-lg text-amber">{'</>'}</span>
      <span className="font-display text-lg font-semibold tracking-tight">devpath</span>
    </Link>
  )
}
