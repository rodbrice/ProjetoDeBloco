import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toggleFavorite, isFavorite } from '../data/favoritesStorage.js'
import { loadRegisteredProfessionals } from '../data/registeredProfessionalsStorage'
import '../styles/Components.css'

export default function ProfessionalPage() {
  const { id } = useParams()
  const [professional, setProfessional] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    async function loadProfessional() {
      try {
        setLoading(true)
        const response = await fetch('/professionals.json')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados')
        }
        
        const data = await response.json()
        let found = data.professionals.find((p) => p.id === id)

        // Se não encontrado no JSON, busca nos cadastrados via app
        if (!found) {
          const registered = await loadRegisteredProfessionals()
          found = registered.find((p) => p.id === id) || null
        }

        setProfessional(found || null)
        
        if (found) {
          setIsFav(isFavorite(found.id))
        }
      } catch (err) {
        console.error('Erro:', err)
        setError('Não conseguimos carregar as informações do profissional.')
      } finally {
        setLoading(false)
      }
    }

    loadProfessional()
  }, [id])

  const handleFavoriteClick = () => {
    if (professional) {
      toggleFavorite(professional.id)
      setIsFav(!isFav)
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">⏳</div>
        <div className="loading-text">Carregando informações...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <div className="error-title">Erro ao carregar</div>
        <p>{error}</p>
        <Link className="btn btn-primary" to="/">
          Voltar para a busca
        </Link>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="stack">
        <div className="card">Profissional não encontrado.</div>
        <Link className="btn" to="/">
          Voltar
        </Link>
      </div>
    )
  }

  return (
    <div className="stack stack-lg">
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div>
            <h1 className="profile-title">{professional.name}</h1>
            <div className="profile-meta">
              <span>{professional.location}</span>
              <span>•</span>
              <span>R$ {professional.price}/sessão</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
            <button
              className={`btn-favorite-large ${isFav ? 'is-favorite' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              {isFav ? '⭐' : '☆'}
            </button>
            <Link
              className="btn btn-secondary"
              to={`/appointments/new?professionalId=${professional.id}`}
            >
              Solicitar agendamento
            </Link>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-label">Especialidades</div>
        <div className="specialties-list">
          {professional.specialties.map((s) => (
            <span key={s} className="specialty-badge">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <div className="section-label">Sobre</div>
        <div className="section-content">{professional.bio}</div>
      </div>

      {(professional.clinicAddress || professional.city) && (
        <div className="profile-section">
          <div className="section-label">📍 Endereço da Clínica</div>
          <div className="section-content">
            {professional.clinicAddress && <div>{professional.clinicAddress}</div>}
            {(professional.city || professional.state) && (
              <div style={{ marginTop: professional.clinicAddress ? '4px' : 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                {[professional.city, professional.state].filter(Boolean).join(' - ')}
              </div>
            )}
            {professional.phone && (
              <div style={{ marginTop: '8px', fontSize: 'var(--text-sm)' }}>
                📞 {professional.phone}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="profile-section">
        <div className="section-label">Modalidades</div>
        <div className="tags-list">
          {professional.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <Link className="btn" to="/">
        Voltar para a busca
      </Link>
    </div>
  )
}
