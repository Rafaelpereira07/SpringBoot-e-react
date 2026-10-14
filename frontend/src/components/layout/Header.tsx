import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { Button } from '../ui/Button'
import { useAuth } from '@/hooks/useAuth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? 'text-paper' : 'text-muted hover:text-paper'}`

const ctaLinkClass =
  'inline-flex items-center justify-center rounded-md bg-amber px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-amber-dim'

export function Header() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/cursos" className={navLinkClass}>
              Cursos
            </NavLink>
            <NavLink to="/planos" className={navLinkClass}>
              Planos
            </NavLink>
            <NavLink to="/validar-certificado" className={navLinkClass}>
              Validar certificado
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NavLink to="/conta" className={navLinkClass}>
                Minha conta
              </NavLink>
              <Button variant="secondary" size="sm" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/entrar" className={navLinkClass}>
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className={ctaLinkClass}>
                Comecar agora
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
