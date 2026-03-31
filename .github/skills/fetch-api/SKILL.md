---
name: fetch-api
description: Guia para implementar Fetch API no MindCare seguindo padrões do projeto. Use quando precisar consumir dados de APIs ou arquivos JSON.
license: MIT
---

# Fetch API - MindCare

## Padrão do Projeto

No MindCare, usamos **Fetch API nativa** (sem bibliotecas como Axios) para:
- Consumir dados de `/public/professionals.json`
- (Futuro) Integrar com Firebase/APIs externas

## Template Base - useEffect + Fetch

```jsx
import { useState, useEffect } from 'react'

export default function ComponenteComFetch() {
  // 1. Estados
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // 2. Fetch no useEffect
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null) // Limpar erro anterior
        
        const response = await fetch('/public/professionals.json')
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`)
        }
        
        const json = await response.json()
        setData(json)
        
      } catch (err) {
        setError(err.message)
        console.error('Erro ao carregar dados:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, []) // Array vazio = executa uma vez ao montar

  // 3. Renderização condicional
  if (isLoading) {
    return <div className="loading">Carregando...</div>
  }

  if (error) {
    return (
      <div className="error-message">
        <p>❌ {error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (data.length === 0) {
    return <p className="empty-state">Nenhum item encontrado.</p>
  }

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## Estados Obrigatórios

**SEMPRE** gerenciar estes 3 estados:

```jsx
const [data, setData] = useState([])          // ou null, ou {}
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState(null)
```

**Por quê?**
- `data` - Armazena os dados carregados
- `isLoading` - Mostra spinner/loading enquanto carrega
- `error` - Mostra mensagem amigável se falhar

## Exemplos por Caso de Uso

### 1. Fetch de Lista (Array)

**Cenário:** Carregar lista de profissionais

```jsx
export default function SearchPage() {
  const [professionals, setProfessionals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfessionals() {
      try {
        setIsLoading(true)
        const response = await fetch('/public/professionals.json')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar profissionais')
        }
        
        const data = await response.json()
        setProfessionals(data)
        
      } catch (err) {
        setError(err.message)
        console.error('Erro:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfessionals()
  }, [])

  if (isLoading) return <p className="loading">Carregando profissionais...</p>
  if (error) return <ErrorMessage error={error} />
  if (professionals.length === 0) return <p>Nenhum profissional encontrado.</p>

  return (
    <div className="professionals-list">
      {professionals.map(prof => (
        <ProfessionalCard key={prof.id} professional={prof} />
      ))}
    </div>
  )
}
```

### 2. Fetch de Item Único (por ID)

**Cenário:** Carregar perfil de profissional específico

```jsx
import { useParams, useNavigate } from 'react-router-dom'

export default function ProfessionalPage() {
  const { id } = useParams() // Pega ID da URL
  const navigate = useNavigate()
  
  const [professional, setProfessional] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfessional() {
      try {
        setIsLoading(true)
        const response = await fetch('/public/professionals.json')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados')
        }
        
        const data = await response.json()
        const found = data.find(p => p.id === parseInt(id))
        
        if (!found) {
          navigate('/404') // Redireciona se não encontrou
          return
        }
        
        setProfessional(found)
        
      } catch (err) {
        setError(err.message)
        console.error('Erro:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfessional()
  }, [id, navigate])

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro: {error}</p>
  if (!professional) return null

  return (
    <div>
      <h1>{professional.name}</h1>
      <p>{professional.specialty}</p>
    </div>
  )
}
```

### 3. Fetch com Dependência (re-fetch quando prop muda)

**Cenário:** Recarregar dados quando filtro muda

```jsx
export default function FilteredList({ category }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadItems() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/items?category=${category}`)
        const data = await response.json()
        setItems(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [category]) // ← Re-executa quando category mudar

  // ...
}
```

### 4. Fetch Manual (ao clicar em botão)

**Cenário:** Buscar dados apenas quando usuário clicar

```jsx
export default function ManualFetch() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFetch = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Erro na requisição')
      
      const json = await response.json()
      setData(json)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleFetch} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Buscar Dados'}
      </button>
      
      {error && <p>Erro: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

## POST Request (Enviar Dados)

**Cenário:** Criar novo agendamento (futuro - com backend)

```jsx
const handleCreateAppointment = async (appointmentData) => {
  try {
    setIsLoading(true)
    
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    })
    
    if (!response.ok) {
      throw new Error('Erro ao criar agendamento')
    }
    
    const created = await response.json()
    console.log('Agendamento criado:', created)
    
    // Redirecionar ou mostrar sucesso
    navigate('/appointments')
    
  } catch (err) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
}
```

## Componentes de UI

### Loading Spinner

```jsx
// Adicionar em Components.css
export function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Carregando...</p>
    </div>
  )
}
```

```css
/* Components.css */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Error Message Component

```jsx
export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-message">
      <span className="error-icon">❌</span>
      <p className="error-text">{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Tentar novamente
        </button>
      )}
    </div>
  )
}
```

```css
.error-message {
  background: #FEE2E2;
  border: 1px solid var(--danger);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  text-align: center;
  margin: var(--space-4) 0;
}

.error-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: var(--space-2);
}

.error-text {
  color: var(--danger);
  font-weight: 600;
  margin-bottom: var(--space-3);
}
```

### Empty State

```jsx
export function EmptyState({ message, icon = '📭' }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <p>{message}</p>
    </div>
  )
}
```

```css
.empty-state {
  text-align: center;
  padding: var(--space-6);
  color: var(--text-gray);
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: var(--space-3);
  opacity: 0.5;
}
```

## Tratamento de Erros

### Tipos Comuns de Erro

```jsx
try {
  const response = await fetch('/api/data')
  
  // Erro HTTP (404, 500, etc)
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  // Erro de validação (dados vazios, formato errado)
  if (!data || data.length === 0) {
    throw new Error('Nenhum dado disponível')
  }
  
  setData(data)
  
} catch (err) {
  // Erro de rede (offline, timeout)
  if (err.name === 'TypeError') {
    setError('Erro de conexão. Verifique sua internet.')
  } else {
    setError(err.message)
  }
  
  console.error('Erro detalhado:', err)
}
```

### Mensagens Amigáveis

```jsx
function getUserFriendlyError(error) {
  if (error.message.includes('Failed to fetch')) {
    return 'Sem conexão com a internet'
  }
  if (error.message.includes('404')) {
    return 'Dados não encontrados'
  }
  if (error.message.includes('500')) {
    return 'Erro no servidor. Tente novamente mais tarde.'
  }
  return 'Algo deu errado. Tente novamente.'
}
```

## Boas Práticas

### ✅ FAZER

1. **Sempre usar try-catch**
```jsx
try {
  const response = await fetch(url)
  // ...
} catch (err) {
  setError(err.message)
}
```

2. **Sempre verificar response.ok**
```jsx
if (!response.ok) {
  throw new Error(`Erro HTTP: ${response.status}`)
}
```

3. **Sempre usar finally para loading**
```jsx
try {
  setIsLoading(true)
  // fetch...
} catch (err) {
  // erro...
} finally {
  setIsLoading(false) // ← sempre executa
}
```

4. **Cancelar fetch em cleanup (componente desmonta)**
```jsx
useEffect(() => {
  const abortController = new AbortController()

  async function fetchData() {
    try {
      const response = await fetch(url, {
        signal: abortController.signal
      })
      // ...
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch cancelado')
        return
      }
      setError(err.message)
    }
  }

  fetchData()

  return () => abortController.abort() // cleanup
}, [])
```

### ❌ NÃO FAZER

1. **Não esquecer setIsLoading(false)**
```jsx
// ❌ RUIM - loading fica true para sempre
try {
  const data = await fetch(url)
  setIsLoading(false) // ← se der erro, não executa!
} catch (err) {
  setError(err)
}

// ✅ BOM - usar finally
finally {
  setIsLoading(false)
}
```

2. **Não usar .then() ao invés de async/await**
```jsx
// ❌ RUIM - projeto usa async/await
fetch(url)
  .then(res => res.json())
  .then(data => setData(data))

// ✅ BOM
const response = await fetch(url)
const data = await response.json()
```

3. **Não deixar console.error em produção sem contexto**
```jsx
// ❌ RUIM
catch (err) {
  console.error(err)
}

// ✅ BOM
catch (err) {
  console.error('Erro ao carregar profissionais:', err)
  setError('Não foi possível carregar os dados')
}
```

## Migração localStorage → API

Quando migrarem para Firebase (TP5):

**Antes (localStorage):**
```jsx
const favorites = loadFavorites() // síncrono
```

**Depois (API):**
```jsx
const [favorites, setFavorites] = useState([])

useEffect(() => {
  async function loadFavorites() {
    const response = await fetch('/api/favorites')
    const data = await response.json()
    setFavorites(data)
  }
  loadFavorites()
}, [])
```

## Timeout/Retry

**Adicionar timeout:**

```jsx
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ])
}

// Uso
const response = await fetchWithTimeout('/api/data', 5000)
```

**Retry automático:**

```jsx
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

## Cache Simples

```jsx
const cache = new Map()

async function fetchWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url)
  }
  
  const response = await fetch(url)
  const data = await response.json()
  
  cache.set(url, data)
  return data
}
```

## Observação para IA

- Projeto de **estudantes** - manter fetch **simples**
- **Não** usar bibliotecas (Axios, SWR, React Query) - fetch nativo
- Sempre incluir **loading, error e success states**
- Mensagens de erro em **português** e **amigáveis**
- Comentários explicativos para lógica async

