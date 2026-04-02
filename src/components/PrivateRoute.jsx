import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Componente que protege rotas privadas
 * Redireciona para home se usuário não estiver autenticado
 * (onde o usuário pode clicar em "Entrar" para abrir o modal)
 */
export default function PrivateRoute() {
  const { user } = useAuth()

  if (!user) {
    // Redireciona para home onde usuário pode fazer login via modal
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

