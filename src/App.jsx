import { useEffect, useMemo, useState } from 'react'
import AppRoutes from './routes/AppRoutes.jsx'
import { loadAppointments, saveAppointments } from './data/appointmentsStorage.js'

function App() {
  const [appointments, setAppointments] = useState(() => loadAppointments())

  useEffect(() => {
    saveAppointments(appointments)
  }, [appointments])

  const appointmentActions = useMemo(() => {
    return {
      createAppointment(draft) {
        const created = {
          id: crypto.randomUUID(),
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          ...draft,
        }

        setAppointments((previous) => [created, ...previous])
        return created
      },
      cancelAppointment(id) {
        setAppointments((previous) =>
          previous.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)),
        )
      },
    }
  }, [])

  return (
    <AppRoutes
      appointments={appointments}
      appointmentActions={appointmentActions}
    />
  )
}

export default App
