import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Hook para acessar contexto de autenticação
 * @returns {object} Contexto de autenticação (user, login, logout, etc)
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}

