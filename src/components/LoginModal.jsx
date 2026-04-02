import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Components.css'

/**
 * Modal de Login - Card estilizado que abre sobre a página
 */
export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validação básica
    if (!email || !password) {
      setError('Preencha todos os campos')
      return
    }

    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)

    // Simular delay de rede (para mostrar loading)
    setTimeout(() => {
      try {
        const user = login(email, password)
        
        // Fecha o modal
        onClose()
        
        // Limpa os campos
        setEmail('')
        setPassword('')
        setError('')
        
        // Opcional: Redireciona se for psicólogo
        if (user.userType === 'psychologist') {
          // Pode redirecionar para dashboard específico no futuro
          navigate('/profile')
        }
      } catch (err) {
        setError('Erro ao fazer login. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  // Se não está aberto, não renderiza nada
  if (!isOpen) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        background: 'rgba(46, 52, 64, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(46, 52, 64, 0.25)',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '16px',
          textAlign: 'left',
        }}
      >
        {/* Header do Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E5E9F0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Entrar</h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '8px', color: '#6B7A8F' }}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '24px' }}>
          <p style={{ color: '#6B7A8F', marginBottom: '20px' }}>
            Acesse sua conta MindCare
          </p>

          {error && (
            <div style={{ background: '#FDECEA', border: '1px solid #BF616A', color: '#BF616A', padding: '12px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="login-email" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Email
              </label>
              <input
                type="email"
                id="login-email"
                style={{ padding: '12px 16px', border: '2px solid #E5E9F0', borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="login-password" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Senha
              </label>
              <input
                type="password"
                id="login-password"
                style={{ padding: '12px 16px', border: '2px solid #E5E9F0', borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              style={{ background: '#5E81AC', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Dicas para teste */}
          <div style={{ background: '#E5EBF3', border: '1px solid rgba(94,129,172,0.2)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ fontWeight: 600, color: '#5E81AC', fontSize: '0.875rem', marginBottom: '8px' }}>💡 Dica para teste:</p>
            <ul style={{ margin: '0 0 12px 0', paddingLeft: '16px', color: '#4C566A', fontSize: '0.875rem' }}>
              <li>Email com <strong>"psi"</strong> → Psicólogo</li>
              <li>Outros emails → Paciente</li>
            </ul>
            <small style={{ fontSize: '0.75rem', color: '#6B7A8F' }}>
              Ex: <code style={{ background: 'rgba(94,129,172,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#5E81AC' }}>psi@example.com</code> ou <code style={{ background: 'rgba(94,129,172,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#5E81AC' }}>maria@example.com</code>
            </small>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E9F0', background: '#F8F9FB', borderRadius: '0 0 16px 16px', textAlign: 'center' }}>
          <small style={{ color: '#6B7A8F', fontSize: '0.75rem' }}>
            🔓 Autenticação fake para demonstração
          </small>
        </div>
      </div>
    </div>,
    document.body
  )
}
