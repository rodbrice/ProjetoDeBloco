import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Ir para a busca">
          Mind Care
        </Link>
        <div className="row">
          {user ? (
            <>
              <Link to="/appointments" className="btn" aria-label="Ver agendamentos">
                Agendamentos
              </Link>
              <Link to="/profile" className="header-avatar-link" aria-label="Meu perfil">
                {user.photo ? (
                  <img 
                    src={user.photo} 
                    alt={user.name} 
                    className="header-avatar"
                  />
                ) : (
                  <div className="header-avatar header-avatar-placeholder">
                    {user.name[0].toUpperCase()}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn" aria-label="Entrar">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}


