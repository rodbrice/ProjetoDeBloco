import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../hooks/useAuth'
import { saveRegisteredProfessional, buildProfessionalFromListing, findProfessionalByUserId } from '../data/registeredProfessionalsStorage'

const ATTENDANCE_OPTIONS = ['Presencial', 'Online']

export default function CreateListingModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth()

  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('')
  const [approach, setApproach] = useState('')
  const [specialties, setSpecialties] = useState([])
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [tags, setTags] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  // Pré-carrega dados existentes (async) quando o modal abre
  useEffect(() => {
    if (!isOpen || !user) return
    let cancelled = false

    findProfessionalByUserId(user.id).then((existing) => {
      if (cancelled) return
      if (existing) {
        setIsEdit(true)
        setLocation(existing.location ?? '')
        setPrice(existing.price ?? '')
        setBio(existing.bio ?? '')
        setExperience(existing.experience ?? '')
        setApproach(existing.approach ?? '')
        setSpecialties(existing.specialties ?? [])
        setTags(existing.tags ?? [])
      } else {
        setIsEdit(false)
        setLocation([user.city, user.state].filter(Boolean).join(' - ') || user.clinicAddress || '')
        setPrice('')
        setBio('')
        setExperience(user.crp ? `CRP: ${user.crp}` : '')
        setApproach('')
        setSpecialties([])
        setTags([])
      }
    })

    return () => { cancelled = true }
  }, [isOpen, user])

  function addSpecialty() {
    const value = specialtyInput.trim()
    if (!value) return
    if (specialties.includes(value)) {
      setSpecialtyInput('')
      return
    }
    setSpecialties((prev) => [...prev, value])
    setSpecialtyInput('')
  }

  function removeSpecialty(s) {
    setSpecialties((prev) => prev.filter((x) => x !== s))
  }

  function handleSpecialtyKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSpecialty()
    }
  }

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!location.trim()) { setError('Informe o endereço / localização'); return }
    if (!price || Number(price) <= 0) { setError('Informe um valor por sessão válido'); return }
    if (specialties.length === 0) { setError('Adicione ao menos uma especialidade'); return }
    if (!bio.trim()) { setError('Preencha a bio / descrição'); return }
    if (!experience.trim()) { setError('Preencha a experiência'); return }
    if (!approach.trim()) { setError('Preencha a abordagem terapêutica'); return }
    if (tags.length === 0) { setError('Selecione ao menos uma modalidade de atendimento'); return }

    setIsLoading(true)

    try {
      const professional = buildProfessionalFromListing(user, {
        location: location.trim(),
        price,
        bio: bio.trim(),
        experience: experience.trim(),
        approach: approach.trim(),
        specialties,
        tags,
      })
      await saveRegisteredProfessional(professional)
      onClose()
      onSuccess?.()
    } catch {
      setError('Erro ao salvar anúncio. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const inputStyle = {
    padding: '12px 16px',
    border: '2px solid #E5E9F0',
    borderRadius: '12px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  }
  const labelStyle = { fontWeight: 600, fontSize: '0.875rem' }
  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '8px' }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
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
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '16px',
          textAlign: 'left',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E5E9F0' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2px 0' }}>
              {isEdit ? 'Editar Anúncio' : 'Criar Anúncio'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7A8F' }}>
              Aparecerá na busca após salvar
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '8px', color: '#6B7A8F' }} aria-label="Fechar">✕</button>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '24px' }}>

          {error && (
            <div style={{ background: '#FDECEA', border: '1px solid #BF616A', color: '#BF616A', padding: '12px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Nome — somente leitura */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Nome exibido</label>
              <input
                type="text"
                style={{ ...inputStyle, background: '#F8F9FB', color: '#6B7A8F', cursor: 'not-allowed' }}
                value={user?.name || ''}
                disabled
              />
            </div>

            {/* Especialidades */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Especialidades</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Ex: Ansiedade, TCC, Luto…"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyDown={handleSpecialtyKeyDown}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={addSpecialty}
                  style={{ background: '#5E81AC', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 16px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                  disabled={isLoading}
                >
                  + Adicionar
                </button>
              </div>
              {specialties.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {specialties.map((s) => (
                    <span key={s} style={{ background: '#E5EBF3', color: '#5E81AC', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(s)}
                        style={{ background: 'none', border: 'none', color: '#5E81AC', cursor: 'pointer', padding: 0, fontWeight: 700, lineHeight: 1 }}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
              <small style={{ color: '#6B7A8F', fontSize: '0.75rem' }}>Pressione Enter ou clique em "+ Adicionar"</small>
            </div>

            {/* Localização */}
            <div style={fieldStyle}>
              <label htmlFor="listing-location" style={labelStyle}>Localização / Endereço</label>
              <input
                type="text"
                id="listing-location"
                style={inputStyle}
                placeholder="Ex: Centro, Zona Sul, Rua das Flores 100"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Valor por sessão */}
            <div style={fieldStyle}>
              <label htmlFor="listing-price" style={labelStyle}>Valor por sessão (R$)</label>
              <input
                type="number"
                id="listing-price"
                style={inputStyle}
                placeholder="Ex: 150"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
                min="1"
              />
            </div>

            {/* Bio */}
            <div style={fieldStyle}>
              <label htmlFor="listing-bio" style={labelStyle}>Bio / Descrição</label>
              <textarea
                id="listing-bio"
                style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                placeholder="Descreva seu trabalho, abordagem e como você ajuda seus pacientes…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Experiência */}
            <div style={fieldStyle}>
              <label htmlFor="listing-experience" style={labelStyle}>Experiência</label>
              <input
                type="text"
                id="listing-experience"
                style={inputStyle}
                placeholder="Ex: 8 anos de experiência"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Abordagem */}
            <div style={fieldStyle}>
              <label htmlFor="listing-approach" style={labelStyle}>Abordagem terapêutica</label>
              <input
                type="text"
                id="listing-approach"
                style={inputStyle}
                placeholder="Ex: Terapia Cognitivo-Comportamental"
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Modalidade de atendimento */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Modalidade de atendimento</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                {ATTENDANCE_OPTIONS.map((opt) => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={tags.includes(opt)}
                      onChange={() => toggleTag(opt)}
                      disabled={isLoading}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{ background: '#5E81AC', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 16px', fontSize: '1rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: isLoading ? 0.7 : 1, marginTop: '4px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando…' : isEdit ? '💾 Atualizar Anúncio' : '🚀 Publicar Anúncio'}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

