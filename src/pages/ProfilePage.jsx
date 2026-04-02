import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import CameraCapture from '../components/CameraCapture'
import '../styles/Components.css'

export default function ProfilePage() {
  const { user, logout, updatePhoto } = useAuth()
  const [showCamera, setShowCamera] = useState(false)
  const navigate = useNavigate()

  function handlePhotoCapture(photoBase64) {
    updatePhoto(photoBase64)
    setShowCamera(false)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (showCamera) {
    return (
        <div className="camera-fullscreen">
          <CameraCapture
              onCapture={handlePhotoCapture}
              onCancel={() => setShowCamera(false)}
          />
        </div>
    )
  }

  return (
      <div className="page-container">
        <div className="page-content">
          <div className="profile-container">
            <div className="profile-photo-section">
              {user.photo ? (
                  <img
                      src={user.photo}
                      alt={user.name}
                      className="profile-photo"
                  />
              ) : (
                  <div className="profile-photo profile-photo-placeholder">
                <span className="profile-photo-initial">
                  {user.name[0].toUpperCase()}
                </span>
                  </div>
              )}

              <button
                  onClick={() => setShowCamera(true)}
                  className="btn-secondary btn-photo"
              >
                📷 {user.photo ? 'Alterar' : 'Adicionar'} Foto
              </button>
            </div>

            <div className="profile-info">
              <div className="profile-field">
                <label>Nome</label>
                <p>{user.name}</p>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <p>{user.email}</p>
              </div>

              <div className="profile-field">
                <label>Tipo de Conta</label>
                <p className="profile-type">
                  {user.userType === 'patient' ? (
                      <span className="badge badge-primary">👤 Paciente</span>
                  ) : (
                      <span className="badge badge-secondary">🩺 Psicólogo</span>
                  )}
                </p>
              </div>

              <div className="profile-field">
                <label>Membro desde</label>
                <p>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={handleLogout} className="btn-danger btn-logout">
                🚪 Sair da Conta
              </button>
            </div>

            <div className="profile-note">
              <p>
                💡 <strong>Nota:</strong> Esta é uma autenticação de demonstração.
                Os dados são salvos apenas no seu navegador (localStorage).
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

