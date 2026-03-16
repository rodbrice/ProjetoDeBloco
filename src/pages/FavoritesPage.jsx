import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfessionalCard from '../components/ProfessionalCard.jsx'
import { loadFavorites } from '../data/favoritesStorage.js'
import '../styles/SearchPage.css'

export default function FavoritesPage() {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        // Carrega os IDs dos favoritos
        const favoriteIds = loadFavorites()

        // Carrega todos os profissionais do JSON
        const response = await fetch('/professionals.json')
        const data = await response.json()
        
        // Filtra apenas os profissionais favoritados
        const favoritedProfessionals = data.professionals.filter(p => 
          favoriteIds.includes(p.id)
        )
        setProfessionals(favoritedProfessionals)
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">⏳</div>
        <div className="loading-text">Carregando favoritos...</div>
      </div>
    )
  }

  return (
    <div className="stack stack-lg">
      <div className="favorites-header">
        <div className="row-between">
          <div>
            <h1 className="favorites-title">Meus Favoritos</h1>
            <p className="favorites-subtitle">
              Profissionais que você marcou como favoritos
            </p>
          </div>
          <Link className="btn btn-primary" to="/">
            Buscar profissionais
          </Link>
        </div>
      </div>

      {professionals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⭐</div>
          <div className="empty-state-title">Nenhum favorito ainda</div>
          <p>Comece a favoritar profissionais para vê-los aqui!</p>
          <Link className="btn btn-primary" to="/" style={{ marginTop: 'var(--space-3)' }}>
            Buscar profissionais
          </Link>
        </div>
      ) : (
        <div className="stack" aria-label="Lista de favoritos">
          {professionals.map((p) => (
            <ProfessionalCard key={p.id} professional={p} showFavoriteButton />
          ))}
        </div>
      )}
    </div>
  )
}

