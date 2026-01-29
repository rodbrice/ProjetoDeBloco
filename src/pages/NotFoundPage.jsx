import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="stack">
      <div className="card">Página não encontrada.</div>
      <Link className="btn btn-primary" to="/">
        Ir para a busca
      </Link>
    </div>
  )
}
