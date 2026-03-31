import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AppShell from '../components/AppShell'
import Header from '../components/Header'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validação básica
    if (!email || !password) {
      setError('Preencha todos os campos')
      return
    }

    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      const user = login(email, password)
      
      // Redireciona baseado no tipo
      if (user.userType === 'psychologist') {
        navigate('/psychologist/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    }
  }

  return (
    <AppShell>
      <Header 
        title="Entrar" 
        subtitle="Acesse sua conta MindCare"
      />
      
      <div className="page-container">
        <div className="page-content">
          <div className="login-container">
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn-primary">
                Entrar
              </button>
            </form>

            <div className="login-hint">
              <p>💡 <strong>Dica para teste:</strong></p>
              <ul>
                <li>Email com "psi" vira <strong>Psicólogo</strong></li>
                <li>Outros emails viram <strong>Paciente</strong></li>
                <li>Qualquer senha funciona (mínimo 6 caracteres)</li>
              </ul>
              <p className="login-examples">
                <strong>Exemplos:</strong><br/>
                📧 psi@example.com = Psicólogo<br/>
                📧 maria@example.com = Paciente
              </p>
            </div>

            <p className="login-footer">
              Projeto de demonstração - Autenticação fake com localStorage
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

