import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { toggleFavorite, isFavorite } from '../data/favoritesStorage.js'

export default function ProfessionalCard({ professional }) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isFav, setIsFav] = useState(() => isFavorite(professional.id))
  const touchStartX = useRef(0)
  const touchCurrentX = useRef(0)

  // Detecta o início do toque
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  // Detecta o movimento do dedo
  const handleTouchMove = (e) => {
    touchCurrentX.current = e.touches[0].clientX
    const diff = touchCurrentX.current - touchStartX.current
    
    // Limita o movimento para não arrastar muito
    const maxOffset = 150
    const limitedOffset = Math.max(-maxOffset, Math.min(maxOffset, diff))
    setSwipeOffset(limitedOffset)
  }

  // Detecta quando solta o dedo
  const handleTouchEnd = () => {
    const swipeThreshold = 80
    
    // Swipe para direita = Favoritar
    if (swipeOffset > swipeThreshold) {
      const newFavorites = toggleFavorite(professional.id)
      setIsFav(newFavorites.includes(professional.id))
      
      // Feedback visual
      showSwipeFeedback('Adicionado aos favoritos! ⭐')
    }
    // Swipe para esquerda = Remover dos favoritos
    else if (swipeOffset < -swipeThreshold) {
      const newFavorites = toggleFavorite(professional.id)
      setIsFav(newFavorites.includes(professional.id))
      
      // Feedback visual
      showSwipeFeedback('Removido dos favoritos')
    }

    // Volta para a posição original
    setSwipeOffset(0)
  }

  const showSwipeFeedback = (message) => {
    // Simples feedback com alert (pode ser melhorado com um toast notification)
    const feedback = document.createElement('div')
    feedback.className = 'swipe-feedback'
    feedback.textContent = message
    document.body.appendChild(feedback)
    
    setTimeout(() => {
      feedback.remove()
    }, 2000)
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    const newFavorites = toggleFavorite(professional.id)
    setIsFav(newFavorites.includes(professional.id))
  }

  // Calcula a opacidade baseada no swipe
  const opacity = 1 - Math.abs(swipeOffset) / 200

  return (
    <article 
      className={`professional-card ${isFav ? 'is-favorite' : ''}`}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        opacity: opacity,
        transition: swipeOffset === 0 ? 'all 0.3s ease' : 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="professional-card-header">
        <div className="professional-info">
          <h3 className="professional-name">{professional.name}</h3>
          <div className="professional-meta">
            <span>{professional.location}</span>
            <span className="meta-separator" />
            <span>R$ {professional.price}/sessão</span>
          </div>
        </div>
        <div className="professional-actions">
          <button
            className={`btn-favorite ${isFav ? 'is-favorite' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isFav ? '⭐' : '☆'}
          </button>
          <Link className="btn btn-primary btn-sm" to={`/professionals/${professional.id}`}>
            Ver perfil
          </Link>
        </div>
      </div>
      <div className="professional-specialties">
        {professional.specialties.slice(0, 3).map((s) => (
          <span key={s} className="specialty-tag">
            {s}
          </span>
        ))}
      </div>
      
      {/* Indicadores de swipe */}
      {swipeOffset > 20 && (
        <div className="swipe-indicator swipe-right">
          ⭐ Favoritar
        </div>
      )}
      {swipeOffset < -20 && (
        <div className="swipe-indicator swipe-left">
          Remover ✖️
        </div>
      )}
    </article>
  )
}
