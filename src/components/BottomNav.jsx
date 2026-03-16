import { NavLink } from 'react-router-dom'
import { loadFavorites } from '../data/favoritesStorage.js'
import { useEffect, useState } from 'react'

export default function BottomNav() {
  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    // Atualiza o contador de favoritos
    const updateCount = () => {
      const favorites = loadFavorites()
      setFavoritesCount(favorites.length)
    }

    updateCount()

    // Atualiza quando a página fica visível novamente
    window.addEventListener('focus', updateCount)
    return () => window.removeEventListener('focus', updateCount)
  }, [])

  return (
    <nav className="bottom-nav" aria-label="Navegação">
      <div className="bottom-nav-inner">
        <NavLink to="/" className="nav-link">
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Buscar</span>
        </NavLink>
        <NavLink to="/favorites" className="nav-link">
          <span className="nav-icon">
            ⭐
            {favoritesCount > 0 && (
              <span className="nav-badge">{favoritesCount}</span>
            )}
          </span>
          <span className="nav-label">Favoritos</span>
        </NavLink>
        <NavLink to="/appointments" className="nav-link">
          <span className="nav-icon">📅</span>
          <span className="nav-label">Agenda</span>
        </NavLink>
        <NavLink to="/about" className="nav-link">
          <span className="nav-icon">ℹ️</span>
          <span className="nav-label">Sobre</span>
        </NavLink>
      </div>
    </nav>
  )
}
