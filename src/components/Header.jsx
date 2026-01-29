import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Ir para a busca">
          Mind Care
        </Link>
        <div className="row">
          <Link to="/appointments" className="btn" aria-label="Ver agendamentos">
            Agendamentos
          </Link>
        </div>
      </div>
    </header>
  )
}
