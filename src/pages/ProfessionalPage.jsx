import { Link, useParams } from 'react-router-dom'
import { professionals } from '../data/mockProfessionals.js'
import '../styles/Components.css'

export default function ProfessionalPage() {
  const { id } = useParams()
  const professional = professionals.find((p) => p.id === id)

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
          <Link
            className="btn btn-secondary"
            to={`/appointments/new?professionalId=${professional.id}`}
            style={{ flexShrink: 0 }}
          >
            Solicitar agendamento
          </Link>
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
