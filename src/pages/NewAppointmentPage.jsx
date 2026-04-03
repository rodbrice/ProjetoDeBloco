import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { loadRegisteredProfessionals } from '../data/registeredProfessionalsStorage'
import '../styles/Components.css'

const TIME_SLOTS = ['09:00', '10:30', '14:00', '15:30', '18:00']

function todayISO() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function NewAppointmentPage({ onCreate }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const professionalId = searchParams.get('professionalId')

  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [date, setDate] = useState(todayISO())
  const [time, setTime] = useState(TIME_SLOTS[0])

  useEffect(() => {
    async function loadProfessionals() {
      try {
        const response = await fetch('/professionals.json')
        const data = await response.json()
        const fromJson = data.professionals || []

        const fromFirestore = await loadRegisteredProfessionals()

        // Evita duplicatas — prioriza o JSON; só adiciona do Firestore se id não existir
        const jsonIds = new Set(fromJson.map((p) => p.id))
        const newOnes = fromFirestore.filter((p) => !jsonIds.has(p.id))

        setProfessionals([...fromJson, ...newOnes])
      } catch (err) {
        console.error('Erro ao carregar profissionais:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfessionals()
  }, [])

  const professional = useMemo(() => {
    return professionals.find((p) => p.id === professionalId) || null
  }, [professionalId, professionals])

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner">⏳</div>
        <div className="loading-text">Carregando...</div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="stack">
        <div className="card">
          Selecione um profissional para solicitar o agendamento.
        </div>
        <Link className="btn" to="/">
          Voltar para a busca
        </Link>
      </div>
    )
  }

  return (
    <div className="stack stack-lg">
      <div className="appointment-form">
        <div className="form-header">
          <h1 className="form-title">Solicitar agendamento</h1>
          <p className="form-subtitle">
            {professional.name} • {professional.location} • R$ {professional.price}/sessão
          </p>
        </div>

        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault()
            const created = onCreate({
              professionalId: professional.id,
              professionalName: professional.name,
              date,
              time,
            })
            navigate('/appointments', { state: { createdId: created.id } })
          }}
        >
          <div className="field">
            <label className="label" htmlFor="date">
              Data da consulta
            </label>
            <input
              id="date"
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="time">
              Horário
            </label>
            <select
              id="time"
              className="select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Link className="btn" to={`/professionals/${professional.id}`}>
              Cancelar
            </Link>
            <button className="btn btn-primary" type="submit">
              Confirmar solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
