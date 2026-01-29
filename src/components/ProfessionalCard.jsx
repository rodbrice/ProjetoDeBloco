import { Link } from 'react-router-dom'

export default function ProfessionalCard({ professional }) {
  return (
    <article className="professional-card">
      <div className="professional-card-header">
        <div className="professional-info">
          <h3 className="professional-name">{professional.name}</h3>
          <div className="professional-meta">
            <span>{professional.location}</span>
            <span className="meta-separator" />
            <span>R$ {professional.price}/sessão</span>
          </div>
        </div>
        <Link className="btn btn-primary" to={`/professionals/${professional.id}`}>
          Ver perfil
        </Link>
      </div>
      <div className="professional-specialties">
        {professional.specialties.slice(0, 3).map((s) => (
          <span key={s} className="specialty-tag">
            {s}
          </span>
        ))}
      </div>
    </article>
  )
}
