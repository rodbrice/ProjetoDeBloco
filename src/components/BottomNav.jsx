import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação">
      <div className="bottom-nav-inner">
        <NavLink to="/" className="nav-link">
          Buscar
        </NavLink>
        <NavLink to="/appointments" className="nav-link">
          Agenda
        </NavLink>
      </div>
    </nav>
  )
}
