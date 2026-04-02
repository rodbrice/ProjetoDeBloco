import { Route, Routes } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrivateRoute from '../components/PrivateRoute.jsx'
import SearchPage from '../pages/SearchPage.jsx'
import ProfessionalPage from '../pages/ProfessionalPage.jsx'
import NewAppointmentPage from '../pages/NewAppointmentPage.jsx'
import AppointmentsPage from '../pages/AppointmentsPage.jsx'
import PsychologistAppointmentsPage from '../pages/PsychologistAppointmentsPage.jsx'
import FavoritesPage from '../pages/FavoritesPage.jsx'
import AboutPage from '../pages/AboutPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import { useAuth } from '../hooks/useAuth'

export default function AppRoutes({ appointments, appointmentActions }) {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Rotas Públicas */}
        <Route index element={<SearchPage />} />
        <Route path="/professionals/:id" element={<ProfessionalPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Rotas Privadas (requerem autenticação) */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          
          {/* Rota de Agendamentos - diferente para psicólogo vs paciente */}
          <Route
            path="/appointments"
            element={
              user?.userType === 'psychologist' ? (
                <PsychologistAppointmentsPage />
              ) : (
                <AppointmentsPage
                  appointments={appointments}
                  onCancel={appointmentActions.cancelAppointment}
                />
              )
            }
          />
          <Route
            path="/appointments/new"
            element={<NewAppointmentPage onCreate={appointmentActions.createAppointment} />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}


