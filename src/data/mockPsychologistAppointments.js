/**
 * Mock de consultas para psicólogos
 * Simula consultas que pacientes agendaram com cada profissional
 */

export const psychologistAppointments = {
  'ana-souza': [
    {
      id: 'psy-apt-1',
      patientName: 'Maria Silva',
      date: '2026-04-05',
      time: '14:00',
      status: 'scheduled',
      type: 'Primeira consulta',
      createdAt: '2026-03-28T10:00:00Z'
    },
    {
      id: 'psy-apt-2',
      patientName: 'João Santos',
      date: '2026-04-07',
      time: '16:00',
      status: 'scheduled',
      type: 'Retorno',
      createdAt: '2026-03-29T14:30:00Z'
    },
    {
      id: 'psy-apt-3',
      patientName: 'Carlos Oliveira',
      date: '2026-03-30',
      time: '10:00',
      status: 'cancelled',
      type: 'Primeira consulta',
      createdAt: '2026-03-20T09:00:00Z'
    }
  ],
  'bruno-lima': [
    {
      id: 'psy-apt-4',
      patientName: 'Ana Paula Costa',
      date: '2026-04-03',
      time: '15:00',
      status: 'scheduled',
      type: 'Primeira consulta',
      createdAt: '2026-03-30T11:00:00Z'
    },
    {
      id: 'psy-apt-5',
      patientName: 'Pedro Henrique',
      date: '2026-04-08',
      time: '09:00',
      status: 'scheduled',
      type: 'Retorno',
      createdAt: '2026-03-31T16:00:00Z'
    }
  ],
  'carla-mendes': [
    {
      id: 'psy-apt-6',
      patientName: 'Fernanda Lima',
      date: '2026-04-04',
      time: '11:00',
      status: 'scheduled',
      type: 'Primeira consulta',
      createdAt: '2026-03-27T13:00:00Z'
    },
    {
      id: 'psy-apt-7',
      patientName: 'Roberto Alves',
      date: '2026-04-06',
      time: '14:00',
      status: 'scheduled',
      type: 'Retorno',
      createdAt: '2026-03-28T15:00:00Z'
    },
    {
      id: 'psy-apt-8',
      patientName: 'Julia Martins',
      date: '2026-04-09',
      time: '16:00',
      status: 'scheduled',
      type: 'Primeira consulta',
      createdAt: '2026-03-30T10:00:00Z'
    }
  ],
  'daniel-costa': [
    {
      id: 'psy-apt-9',
      patientName: 'Lucas Ferreira',
      date: '2026-04-02',
      time: '10:00',
      status: 'scheduled',
      type: 'Retorno',
      createdAt: '2026-03-25T12:00:00Z'
    }
  ],
  'elisa-rocha': [
    {
      id: 'psy-apt-10',
      patientName: 'Beatriz Souza',
      date: '2026-04-05',
      time: '13:00',
      status: 'scheduled',
      type: 'Primeira consulta',
      createdAt: '2026-03-29T09:00:00Z'
    },
    {
      id: 'psy-apt-11',
      patientName: 'Ricardo Gomes',
      date: '2026-04-10',
      time: '15:00',
      status: 'scheduled',
      type: 'Retorno',
      createdAt: '2026-03-31T11:00:00Z'
    }
  ]
}

/**
 * Retorna as consultas de um psicólogo específico
 * @param {string} professionalId - ID do profissional (ex: 'ana-souza')
 * @returns {Array} - Array de consultas ou array vazio
 */
export function getPsychologistAppointments(professionalId) {
  return psychologistAppointments[professionalId] || []
}

/**
 * Mapeia email do psicólogo para ID do profissional
 * Convenção: email com "ana" -> "ana-souza", "bruno" -> "bruno-lima", etc.
 * @param {string} email - Email do psicólogo
 * @returns {string|null} - ID do profissional ou null
 */
export function mapEmailToProfessionalId(email) {
  const emailLower = email.toLowerCase()
  
  if (emailLower.includes('ana')) return 'ana-souza'
  if (emailLower.includes('bruno')) return 'bruno-lima'
  if (emailLower.includes('carla')) return 'carla-mendes'
  if (emailLower.includes('daniel')) return 'daniel-costa'
  if (emailLower.includes('elisa')) return 'elisa-rocha'
  
  // Psicólogo genérico - retorna primeiro profissional para demonstração
  return 'ana-souza'
}

