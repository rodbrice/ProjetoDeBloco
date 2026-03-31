---
name: add-page
description: Guia para adicionar novas páginas (rotas) ao projeto MindCare. Use quando for pedido para criar uma nova página ou rota na aplicação.
license: MIT
---

# Adicionar Nova Página - MindCare

## Processo Passo-a-Passo

Para adicionar uma nova página ao MindCare, siga estes 5 passos:

### 1. Criar o Componente da Página

**Localização:** `/src/pages/NomeDaPagina.jsx`

**Template base:**

```jsx
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import Header from '../components/Header.jsx'

export default function NomeDaPagina() {
  return (
    <AppShell>
      <Header 
        title="Título da Página"
        subtitle="Descrição opcional"
        showBackButton={true} // true se não for página principal
      />
      
      <div className="page-container">
        <div className="page-content">
          {/* Conteúdo da página aqui */}
          <h2>Bem-vindo à nova página!</h2>
        </div>
      </div>
    </AppShell>
  )
}
```

### 2. Adicionar Rota no AppRoutes.jsx

**Arquivo:** `/src/routes/AppRoutes.jsx`

**Como fazer:**

```jsx
import NomeDaPagina from '../pages/NomeDaPagina.jsx'

// Dentro do <Routes>
<Route path="/caminho-da-pagina" element={<NomeDaPagina />} />
```

**Exemplos de paths:**
- Página simples: `/configuracoes`
- Com parâmetro: `/professionals/:id`
- Aninhada: `/appointments/new`
- 404: `*` (catch-all)

### 3. Adicionar Link de Navegação (se aplicável)

**Opção A: No BottomNav** (para páginas principais)

Editar `/src/components/BottomNav.jsx`:

```jsx
<Link to="/caminho-da-pagina" className={isActive('/caminho-da-pagina')}>
  <span className="nav-icon">🔧</span>
  <span className="nav-label">Config</span>
</Link>
```

**Opção B: Como botão/link em outra página**

```jsx
import { Link } from 'react-router-dom'

<Link to="/caminho-da-pagina" className="btn-primary">
  Ir para Nova Página
</Link>
```

### 4. Adicionar Estilos (se necessário)

**Para estilos simples:** Adicionar em `/src/styles/Components.css`

```css
/* Nova Página - Config */
.config-container {
  padding: var(--space-4);
}

.config-option {
  background: white;
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
}
```

**Para páginas complexas:** Criar arquivo separado `/src/styles/NomeDaPagina.css`

```jsx
// No componente da página
import '../styles/NomeDaPagina.css'
```

### 5. Testar a Nova Página

**Checklist de testes:**

- [ ] Página carrega sem erros no console
- [ ] Header aparece corretamente
- [ ] AppShell e BottomNav estão presentes
- [ ] Navegação funciona (ir e voltar)
- [ ] Botão de voltar funciona (se `showBackButton={true}`)
- [ ] Responsivo em mobile (testar no DevTools)
- [ ] Links internos funcionam
- [ ] Estilos aplicados corretamente

## Exemplos de Páginas Comuns

### Página com Fetch de Dados

```jsx
import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell.jsx'
import Header from '../components/Header.jsx'

export default function PaginaComDados() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/endpoint')
        if (!response.ok) throw new Error('Erro ao carregar dados')
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err.message)
        console.error('Erro:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <AppShell>
      <Header title="Dados" />
      
      <div className="page-container">
        {isLoading && <p className="loading">Carregando...</p>}
        
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        )}
        
        {!isLoading && !error && data.length > 0 && (
          <div className="data-list">
            {data.map(item => (
              <div key={item.id}>{item.name}</div>
            ))}
          </div>
        )}
        
        {!isLoading && !error && data.length === 0 && (
          <p className="empty-state">Nenhum item encontrado.</p>
        )}
      </div>
    </AppShell>
  )
}
```

### Página com Formulário

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import Header from '../components/Header.jsx'

export default function PaginaComFormulario() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.nome || !formData.email) {
      alert('Preencha todos os campos')
      return
    }
    
    // Processar dados (salvar, enviar, etc)
    console.log('Dados enviados:', formData)
    
    // Redirecionar
    navigate('/sucesso')
  }

  return (
    <AppShell>
      <Header title="Formulário" showBackButton />
      
      <div className="page-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <button type="submit" className="btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </AppShell>
  )
}
```

### Página com Parâmetro de Rota

```jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell.jsx'
import Header from '../components/Header.jsx'

export default function PaginaComParametro() {
  const { id } = useParams() // Pega o :id da URL
  const navigate = useNavigate()
  const [item, setItem] = useState(null)

  useEffect(() => {
    // Buscar item pelo ID
    async function loadItem() {
      try {
        const response = await fetch(`/public/data.json`)
        const data = await response.json()
        const found = data.find(i => i.id === parseInt(id))
        
        if (!found) {
          navigate('/404') // Redireciona se não encontrou
          return
        }
        
        setItem(found)
      } catch (error) {
        console.error('Erro:', error)
      }
    }
    
    loadItem()
  }, [id, navigate])

  if (!item) return <p>Carregando...</p>

  return (
    <AppShell>
      <Header title={item.name} showBackButton />
      
      <div className="page-container">
        <p>ID: {id}</p>
        <p>Nome: {item.name}</p>
      </div>
    </AppShell>
  )
}
```

## Estrutura de Pastas

```
src/
├── pages/
│   ├── SearchPage.jsx         ✅ Existente
│   ├── ProfessionalPage.jsx   ✅ Existente
│   ├── AppointmentsPage.jsx   ✅ Existente
│   ├── FavoritesPage.jsx      ✅ Existente
│   ├── AboutPage.jsx          ✅ Existente
│   ├── NotFoundPage.jsx       ✅ Existente
│   └── NovaPagina.jsx         ← Nova página aqui
├── routes/
│   └── AppRoutes.jsx          ← Adicionar rota aqui
├── styles/
│   ├── Components.css         ← Estilos compartilhados
│   └── NovaPagina.css         ← Se precisar de CSS específico
└── components/
    ├── AppShell.jsx           ✅ Usar em todas as páginas
    ├── Header.jsx             ✅ Usar em todas as páginas
    └── BottomNav.jsx          ✅ Já incluído no AppShell
```

## Navegação Programática

### Redirecionar após ação

```jsx
import { useNavigate } from 'react-router-dom'

function MinhaPageina() {
  const navigate = useNavigate()
  
  const handleSave = () => {
    // salvar dados...
    navigate('/sucesso') // Redireciona para /sucesso
  }
  
  const handleCancel = () => {
    navigate(-1) // Volta para página anterior (como botão voltar)
  }
  
  return (
    <div>
      <button onClick={handleSave}>Salvar</button>
      <button onClick={handleCancel}>Cancelar</button>
    </div>
  )
}
```

## Proteção de Rotas (Futuro - TP5)

Quando implementarem autenticação, proteger rotas assim:

```jsx
// PrivateRoute.jsx (criar no futuro)
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const isAuthenticated = /* lógica de verificação */
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}

// Em AppRoutes.jsx
<Route 
  path="/dashboard" 
  element={
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  } 
/>
```

## Boas Práticas

✅ **FAZER:**
- Sempre usar `AppShell` para manter navegação consistente
- Sempre usar `Header` para título da página
- Usar `showBackButton={true}` em páginas que não são principais
- Validar dados antes de processar
- Tratar erros de fetch
- Testar em mobile (DevTools → Toggle Device Toolbar)

❌ **NÃO FAZER:**
- Criar páginas sem AppShell (navegação fica quebrada)
- Esquecer de adicionar a rota em AppRoutes.jsx
- Usar `<a href>` ao invés de `<Link to>` (causa reload)
- Hardcodar valores (usar CSS variables)
- Deixar console.log em produção

## Observações para o Projeto

- **Mantenha simples:** Projeto de estudantes, código deve ser fácil de entender
- **Mobile-First:** Sempre pensar em mobile primeiro
- **Consistência:** Seguir padrão das páginas existentes
- **Acessibilidade:** Labels, botões semânticos, contraste
- **Performance:** Lazy loading de páginas pode ser adicionado depois

## Troubleshooting

**Página não aparece:**
- Verificar se a rota foi adicionada em `AppRoutes.jsx`
- Verificar console do navegador para erros
- Verificar se o path está correto (começar com `/`)

**Navegação quebrada:**
- Verificar se está usando `<Link>` do React Router, não `<a>`
- Verificar se `AppShell` está sendo usado
- Verificar se `BrowserRouter` está no `main.jsx`

**Estilos não aplicam:**
- Verificar se o CSS foi importado
- Verificar nome das classes (case-sensitive)
- Limpar cache do navegador
- Inspecionar elemento no DevTools

