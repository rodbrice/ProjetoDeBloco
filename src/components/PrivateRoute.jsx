import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Componente que protege rotas privadas
 * Redireciona para /login se usuário não estiver autenticado
 */
export default function PrivateRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

