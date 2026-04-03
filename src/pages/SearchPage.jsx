import { useEffect, useMemo, useState } from 'react'
import ProfessionalCard from '../components/ProfessionalCard.jsx'
import { loadRegisteredProfessionals } from '../data/registeredProfessionalsStorage'
import '../styles/SearchPage.css'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar dados dos profissionais do JSON
  useEffect(() => {
    async function loadProfessionals() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/professionals.json')
        
        if (!response.ok) {
          throw new Error('Não foi possível carregar os profissionais')
        }
        
        const data = await response.json()
        const fromJson = data.professionals || []
        const fromStorage = await loadRegisteredProfessionals()

        // Evita duplicatas — prioriza o JSON; só adiciona do storage se id não existir
        const jsonIds = new Set(fromJson.map((p) => p.id))
        const newOnes = fromStorage.filter((p) => !jsonIds.has(p.id))

        setProfessionals([...fromJson, ...newOnes])
      } catch (err) {
        console.error('Erro ao carregar profissionais:', err)
        setError('Não conseguimos carregar a lista de profissionais. Por favor, tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }

    loadProfessionals()
  }, [])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedLocation = location.trim().toLowerCase()
    const maxPriceNumber = maxPrice ? Number(maxPrice) : null

    return professionals.filter((p) => {
      const matchQuery = !normalizedQuery
        ? true
        : [p.name, p.bio, ...p.specialties]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery)

      const matchLocation = !normalizedLocation
        ? true
        : p.location.toLowerCase().includes(normalizedLocation)

      const matchPrice = maxPriceNumber ? p.price <= maxPriceNumber : true

      return matchQuery && matchLocation && matchPrice
    })
  }, [query, location, maxPrice, professionals])

  return (
    <div className="stack stack-lg">
      <section className="search-filters">
        <div className="search-header">
          <h1 className="search-title">Buscar psicólogos</h1>
          <p className="search-subtitle">
            Encontre profissionais por especialidade, localização e faixa de preço
          </p>
        </div>

        <div className="stack">
          <div className="field">
            <label className="label" htmlFor="query">
              O que você procura?
            </label>
            <input
              id="query"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: ansiedade, TCC, relacionamento…"
            />
          </div>

          <div className="filters-row">
            <div className="field">
              <label className="label" htmlFor="location">
                Região
              </label>
              <input
                id="location"
                className="input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Centro, Zona Sul"
              />
            </div>

            <div className="field" style={{ minWidth: 140 }}>
              <label className="label" htmlFor="maxPrice">
                Preço máximo (R$)
              </label>
              <input
                id="maxPrice"
                className="input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                inputMode="numeric"
                placeholder="150"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
              className="btn"
              onClick={() => {
                setQuery('')
                setLocation('')
                setMaxPrice('')
              }}
              type="button"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </section>

      <section className="stack" aria-label="Resultados">
        <div className="results-header">
          <h2 className="results-title">Resultados</h2>
          {!loading && !error && (
            <div className="results-count">{filtered.length} encontrado(s)</div>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <div className="loading-text">Carregando profissionais...</div>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <div className="error-title">Ops! Algo deu errado</div>
            <p>{error}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">Nenhum resultado encontrado</div>
            <p>Tente ajustar os filtros ou usar termos diferentes na busca.</p>
          </div>
        ) : (
          <div className="stack">
            {filtered.map((p) => (
              <ProfessionalCard key={p.id} professional={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
