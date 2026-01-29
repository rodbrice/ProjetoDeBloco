import { Link, useLocation } from 'react-router-dom'
import Badge from '../components/Badge.jsx'
import '../styles/Components.css'

function formatStatus(status) {
  if (status === 'scheduled') return 'Agendado'
  if (status === 'cancelled') return 'Cancelado'
  return status
}

function getBadgeVariant(status) {
  if (status === 'scheduled') return 'scheduled'
  if (status === 'cancelled') return 'cancelled'
  return 'pending'
}

export default function AppointmentsPage({ appointments, onCancel }) {
  const location = useLocation()
  const createdId = location.state?.createdId

  return (
    <div className="stack stack-lg">
      <div className="appointments-header">
        <div className="row-between">
          <div>
            <h1 className="appointments-title">Meus agendamentos</h1>
            <p className="appointments-subtitle">
              Acompanhe suas consultas agendadas e histórico
            </p>
          </div>
          <Link className="btn btn-primary" to="/">
            Buscar profissionais
          </Link>
        </div>
      </div>

      {createdId ? (
        <div className="success-message" role="status">
          Solicitação criada com sucesso!
        </div>
      ) : null}

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-title">Nenhum agendamento ainda</div>
          <p>Volte para a busca e solicite sua primeira consulta.</p>
        </div>
      ) : (
        <div className="stack" aria-label="Lista de agendamentos">
          {appointments.map((a) => (
            <article key={a.id} className="appointment-card">
              <div className="appointment-header">
                <h3 className="appointment-professional">{a.professionalName}</h3>
                <Badge variant={getBadgeVariant(a.status)}>
                  {formatStatus(a.status)}
                </Badge>
              </div>
              <div className="appointment-datetime">
                <span>📅 {a.date}</span>
                <span>•</span>
                <span>🕒 {a.time}</span>
              </div>
              {a.status === 'scheduled' ? (
                <div className="appointment-actions">
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => onCancel(a.id)}
                  >
                    Cancelar agendamento
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
