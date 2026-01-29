import { useMemo, useState } from 'react'
import { professionals } from '../data/mockProfessionals.js'
import ProfessionalCard from '../components/ProfessionalCard.jsx'
import '../styles/SearchPage.css'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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
  }, [query, location, maxPrice])

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
          <div className="results-count">{filtered.length} encontrado(s)</div>
        </div>

        {filtered.length === 0 ? (
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
