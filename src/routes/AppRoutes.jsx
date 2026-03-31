import { Route, Routes } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import PrivateRoute from '../components/PrivateRoute.jsx'
import SearchPage from '../pages/SearchPage.jsx'
import ProfessionalPage from '../pages/ProfessionalPage.jsx'
import NewAppointmentPage from '../pages/NewAppointmentPage.jsx'
import AppointmentsPage from '../pages/AppointmentsPage.jsx'
import FavoritesPage from '../pages/FavoritesPage.jsx'
import AboutPage from '../pages/AboutPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

export default function AppRoutes({ appointments, appointmentActions }) {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Rotas Públicas */}
        <Route index element={<SearchPage />} />
        <Route path="/professionals/:id" element={<ProfessionalPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rotas Privadas (requerem autenticação) */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route
            path="/appointments"
            element={
              <AppointmentsPage
                appointments={appointments}
                onCancel={appointmentActions.cancelAppointment}
              />
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


