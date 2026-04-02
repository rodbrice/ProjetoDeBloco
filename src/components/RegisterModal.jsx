import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Components.css'

const CRP_REGEX = /^\d{2}\/\d{5}$/

// (XX) 9 XXXX-XXXX
const PHONE_REGEX = /^\(\d{2}\) 9 \d{4}-\d{4}$/

/**
 * Aplica máscara de telefone brasileiro: (DDD) 9 XXXX-XXXX
 * Aceita apenas os 11 dígitos do usuário (DDD + 9 + 8 dígitos)
 */
function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`
  let r = `(${digits.slice(0, 2)}) `
  if (digits.length <= 3) return r + digits.slice(2)
  r += `${digits.slice(2, 3)} `
  if (digits.length <= 7) return r + digits.slice(3)
  return r + `${digits.slice(3, 7)}-${digits.slice(7)}`
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [userType, setUserType] = useState('patient')
  const [phone, setPhone] = useState('')
  const [crp, setCrp] = useState('')
  const [clinicAddress, setClinicAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const isPsychologist = userType === 'psychologist'

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    if (isPsychologist && (!crp || !clinicAddress)) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    if (isPsychologist && !CRP_REGEX.test(crp)) {
      setError('CRP inválido. Use o formato XX/NNNNN (ex: 06/12345)')
      return
    }

    if (!PHONE_REGEX.test(phone)) {
      setError('Telefone inválido. Use o formato (DDD) 9 XXXX-XXXX')
      return
    }

    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      try {
        const user = register(name, email, password, userType, {
          phone,
          crp: isPsychologist ? crp : null,
          clinicAddress: isPsychologist ? clinicAddress : null,
        })

        onClose()
        resetFields()

        if (user.userType === 'psychologist') {
          navigate('/profile')
        }
      } catch (err) {
        setError('Erro ao criar conta. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  function resetFields() {
    setName('')
    setEmail('')
    setUserType('patient')
    setPhone('')
    setCrp('')
    setClinicAddress('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  function handleSwitchToLogin() {
    resetFields()
    onSwitchToLogin()
  }

  if (!isOpen) return null

  const inputStyle = {
    padding: '12px 16px',
    border: '2px solid #E5E9F0',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
  }

  const labelStyle = { fontWeight: 600, fontSize: '0.875rem' }
  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }

  return createPortal(
      <div
          onClick={onClose}
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            margin: 0, padding: 0,
            background: 'rgba(46, 52, 64, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
          }}
      >
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(46, 52, 64, 0.25)',
              width: '100%',
              maxWidth: '440px',
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: '16px',
              textAlign: 'left',
            }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E5E9F0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Criar Conta</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '8px', color: '#6B7A8F' }} aria-label="Fechar">✕</button>
          </div>

          {/* Conteúdo */}
          <div style={{ padding: '24px' }}>
            <p style={{ color: '#6B7A8F', marginBottom: '20px' }}>Crie sua conta no MindCare</p>

            {error && (
                <div style={{ background: '#FDECEA', border: '1px solid #BF616A', color: '#BF616A', padding: '12px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px' }}>
                  ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>

              {/* Nome */}
              <div style={fieldStyle}>
                <label htmlFor="register-name" style={labelStyle}>Nome</label>
                <input type="text" id="register-name" style={inputStyle} placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} autoFocus />
              </div>

              {/* Email */}
              <div style={fieldStyle}>
                <label htmlFor="register-email" style={labelStyle}>Email</label>
                <input type="email" id="register-email" style={inputStyle} placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
              </div>

              {/* Tipo de conta */}
              <div style={fieldStyle}>
                <label htmlFor="register-usertype" style={labelStyle}>Tipo de conta</label>
                <select
                    id="register-usertype"
                    style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    disabled={isLoading}
                >
                  <option value="patient">Paciente</option>
                  <option value="psychologist">Psicólogo(a)</option>
                </select>
              </div>

              {/* Contato — para todos */}
              <div style={fieldStyle}>
                <label htmlFor="register-phone" style={labelStyle}>Número de contato</label>
                <input
                  type="tel"
                  id="register-phone"
                  style={inputStyle}
                  placeholder="(11) 9 1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  disabled={isLoading}
                  maxLength={16}
                />
                <small style={{ color: '#6B7A8F', fontSize: '0.75rem' }}>
                  Formato: (DDD) 9 XXXX-XXXX
                </small>
              </div>

              {/* Campos exclusivos do Psicólogo */}
              {isPsychologist && (
                  <>
                    <div style={{ borderTop: '1px dashed #E5E9F0', paddingTop: '4px' }}>
                      <p style={{ fontSize: '0.8rem', color: '#5E81AC', fontWeight: 700, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        📋 Dados Profissionais
                      </p>
                    </div>

                    {/* CRP */}
                    <div style={fieldStyle}>
                      <label htmlFor="register-crp" style={labelStyle}>
                        CRP <span style={{ color: '#6B7A8F', fontWeight: 400 }}>(Conselho Regional de Psicologia)</span>
                      </label>
                      <input
                          type="text"
                          id="register-crp"
                          style={inputStyle}
                          placeholder="Ex: 06/12345"
                          value={crp}
                          onChange={(e) => setCrp(e.target.value)}
                          disabled={isLoading}
                          maxLength={8}
                      />
                      <small style={{ color: '#6B7A8F', fontSize: '0.75rem' }}>
                        Formato: XX/NNNNN (região/registro)
                      </small>
                    </div>

                    {/* Endereço da Clínica */}
                    <div style={fieldStyle}>
                      <label htmlFor="register-clinic" style={labelStyle}>Endereço da clínica</label>
                      <input
                          type="text"
                          id="register-clinic"
                          style={inputStyle}
                          placeholder="Rua, número, bairro, cidade"
                          value={clinicAddress}
                          onChange={(e) => setClinicAddress(e.target.value)}
                          disabled={isLoading}
                      />
                    </div>
                  </>
              )}

              {/* Senha */}
              <div style={fieldStyle}>
                <label htmlFor="register-password" style={labelStyle}>Senha</label>
                <input type="password" id="register-password" style={inputStyle} placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>

              {/* Confirmar Senha */}
              <div style={fieldStyle}>
                <label htmlFor="register-confirm-password" style={labelStyle}>Confirmar Senha</label>
                <input type="password" id="register-confirm-password" style={inputStyle} placeholder="Repita a senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
              </div>

              <button
                  type="submit"
                  style={{ background: '#5E81AC', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '1rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: isLoading ? 0.7 : 1 }}
                  disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E9F0', background: '#F8F9FB', borderRadius: '0 0 16px 16px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: '#4C566A' }}>
              Já tem conta?{' '}
              <button onClick={handleSwitchToLogin} style={{ background: 'none', border: 'none', color: '#5E81AC', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit', textDecoration: 'underline', padding: 0 }}>
                Entrar
              </button>
            </p>
            <small style={{ color: '#6B7A8F', fontSize: '0.75rem' }}>🔓 Autenticação fake para demonstração</small>
          </div>
        </div>
      </div>,
      document.body
  )
}
