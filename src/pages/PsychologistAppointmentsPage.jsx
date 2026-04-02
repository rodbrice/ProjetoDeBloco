import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getPsychologistAppointments, mapEmailToProfessionalId } from '../data/mockPsychologistAppointments'
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

export default function PsychologistAppointmentsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [professionalId, setProfessionalId] = useState(null)

  useEffect(() => {
    if (user && user.userType === 'psychologist') {
      // Mapeia email do psicólogo para ID do profissional
      const id = mapEmailToProfessionalId(user.email)
      setProfessionalId(id)
      
      // Carrega consultas do mock
      const userAppointments = getPsychologistAppointments(id)
      setAppointments(userAppointments)
    }
  }, [user])

  if (!user || user.userType !== 'psychologist') {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-title">Acesso não autorizado</div>
          <p>Esta página é exclusiva para psicólogos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stack stack-lg">
      <div className="appointments-header">
        <div className="row-between">
          <div>
            <h1 className="appointments-title">Minhas Consultas</h1>
            <p className="appointments-subtitle">
              Acompanhe os agendamentos dos seus pacientes
            </p>
          </div>
          <div className="profile-type">
            <span className="badge badge-secondary">🩺 Psicólogo</span>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-title">Nenhuma consulta agendada</div>
          <p>Quando pacientes agendarem consultas com você, elas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="stack" aria-label="Lista de consultas">
          {appointments.map((a) => (
            <article key={a.id} className="appointment-card">
              <div className="appointment-header">
                <div>
                  <h3 className="appointment-professional">👤 {a.patientName}</h3>
                  <p className="appointment-type">{a.type}</p>
                </div>
                <Badge variant={getBadgeVariant(a.status)}>
                  {formatStatus(a.status)}
                </Badge>
              </div>
              <div className="appointment-datetime">
                <span>📅 {new Date(a.date).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>🕒 {a.time}</span>
              </div>
              {a.status === 'scheduled' ? (
                <div className="appointment-info">
                  <p className="info-note">
                    💡 <strong>Nota:</strong> Esta é uma consulta de demonstração. 
                    Em produção, você poderia confirmar, remarcar ou cancelar.
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <div className="profile-note" style={{ marginTop: '2rem' }}>
        <p>
          ℹ️ <strong>Demonstração:</strong> Estas são consultas fictícias para ilustrar 
          como seria a visualização de um psicólogo. Para simular diferentes agendas, 
          faça login com emails diferentes (ex: ana.psi@email.com, bruno.psi@email.com).
        </p>
      </div>
    </div>
  )
}

