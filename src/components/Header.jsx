import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default function Header() {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  return (
    <>
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
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="btn"
                aria-label="Entrar"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Login */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => { setShowLoginModal(false); setShowRegisterModal(true) }}
      />

      {/* Modal de Registro */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => { setShowRegisterModal(false); setShowLoginModal(true) }}
      />
    </>
  )
}


