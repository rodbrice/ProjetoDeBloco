import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Componente que protege rotas privadas
 * Redireciona para home se usuário não estiver autenticado
 * (onde o usuário pode clicar em "Entrar" para abrir o modal)
 */
export default function PrivateRoute() {
  const { user, loading } = useAuth()

  // Aguarda Firebase verificar a sessão antes de redirecionar
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#5E81AC', fontSize: '1.1rem' }}>Verificando sessão…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

