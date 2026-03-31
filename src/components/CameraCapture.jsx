import { useRef, useState } from 'react'

/**
 * Componente para captura de foto usando câmera do dispositivo
 * Usa <input type="file" capture> que funciona em iOS e Android
 */
export default function CameraCapture({ onCapture, onCancel }) {
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande! Máximo 5MB.')
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem.')
      return
    }

    // Ler arquivo como base64
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleConfirm() {
    if (preview) {
      onCapture(preview)
    }
  }

  function handleRetake() {
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  // Se tem preview, mostra a foto capturada
  if (preview) {
    return (
      <div className="camera-preview-container">
        <div className="camera-preview">
          <img src={preview} alt="Preview" className="camera-preview-image" />
        </div>
        
        <div className="camera-actions">
          <button onClick={handleRetake} className="btn-secondary">
            ↺ Tirar outra
          </button>
          <button onClick={handleConfirm} className="btn-primary">
            ✓ Usar esta foto
          </button>
        </div>
      </div>
    )
  }

  // Se não tem preview, mostra botão para tirar foto
  return (
    <div className="camera-capture-container">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div className="camera-prompt">
        <div className="camera-icon">📷</div>
        <p>Clique no botão abaixo para tirar uma foto</p>
        <small>A câmera do seu dispositivo será aberta</small>
      </div>
      
      <div className="camera-actions">
        <button 
          onClick={() => inputRef.current?.click()}
          className="btn-primary btn-large"
        >
          📷 Abrir Câmera
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
  )
}

