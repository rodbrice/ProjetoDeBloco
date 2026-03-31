---
name: vitest-testing
description: Guia para criar testes com Vitest e React Testing Library no MindCare. Use quando for pedido para adicionar testes ou aumentar cobertura de testes.
license: MIT
---

# Testes com Vitest - MindCare

## Configuração Existente

O projeto já está configurado com:
- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **jsdom** - Ambiente DOM simulado
- **@testing-library/jest-dom** - Matchers customizados

**Comandos disponíveis:**
```bash
npm test           # Roda testes em watch mode
npm run test:ui    # Abre interface visual
npm run test:coverage  # Gera relatório de cobertura
```

## Estrutura de Testes

### Localização
- Testes ficam **ao lado do arquivo testado**
- Nomenclatura: `NomeDoArquivo.test.jsx`

**Exemplos:**
```
src/
├── components/
│   ├── ProfessionalCard.jsx
│   └── ProfessionalCard.test.jsx  ← Teste aqui
├── pages/
│   ├── SearchPage.jsx
│   └── SearchPage.test.jsx        ← Teste aqui
```

### Template Base

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import NomeDoComponente from './NomeDoComponente.jsx'

// Helper para renderizar com Router (se precisar)
function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('NomeDoComponente', () => {
  it('renderiza corretamente', () => {
    render(<NomeDoComponente />)
    
    // Verificar se elemento aparece
    expect(screen.getByText('Texto esperado')).toBeInTheDocument()
  })
  
  it('responde a interações do usuário', async () => {
    const user = userEvent.setup()
    render(<NomeDoComponente />)
    
    // Simular clique
    const button = screen.getByRole('button', { name: /clique aqui/i })
    await user.click(button)
    
    // Verificar resultado
    expect(screen.getByText('Resultado')).toBeInTheDocument()
  })
})
```

## Padrões do Projeto

### 1. Queries - Como Encontrar Elementos

**Ordem de preferência (do melhor para pior):**

```jsx
// ✅ PREFERIR: Queries acessíveis (como usuário vê)
screen.getByRole('button', { name: /agendar/i })
screen.getByLabelText('Nome completo')
screen.getByPlaceholderText('Digite seu nome')
screen.getByText('Bem-vindo')

// ⚠️ USAR SE NECESSÁRIO: Queries por data-testid
screen.getByTestId('professional-card-123')

// ❌ EVITAR: Queries por classe ou estrutura interna
// container.querySelector('.professional-card')
```

**getBy vs queryBy vs findBy:**

```jsx
// getBy - Lança erro se não encontrar (padrão)
const element = screen.getByText('Texto')

// queryBy - Retorna null se não encontrar (para verificar ausência)
const element = screen.queryByText('Texto que não existe')
expect(element).not.toBeInTheDocument()

// findBy - Async, espera elemento aparecer (para loading)
const element = await screen.findByText('Dados carregados')
```

### 2. Testar Componente com Props

```jsx
describe('ProfessionalCard', () => {
  const mockProfessional = {
    id: 1,
    name: 'Dra. Maria Silva',
    specialty: 'Psicologia Clínica',
    city: 'São Paulo',
    price: 150,
    rating: 4.8,
  }
  
  it('exibe informações do profissional', () => {
    render(<ProfessionalCard professional={mockProfessional} />)
    
    expect(screen.getByText('Dra. Maria Silva')).toBeInTheDocument()
    expect(screen.getByText('Psicologia Clínica')).toBeInTheDocument()
    expect(screen.getByText(/São Paulo/i)).toBeInTheDocument()
    expect(screen.getByText(/R\$ 150/i)).toBeInTheDocument()
  })
})
```

### 3. Testar Interações do Usuário

```jsx
import userEvent from '@testing-library/user-event'

describe('SearchPage', () => {
  it('filtra profissionais ao digitar no campo de busca', async () => {
    const user = userEvent.setup()
    render(<SearchPage />)
    
    // Encontrar input
    const searchInput = screen.getByPlaceholderText(/buscar/i)
    
    // Digitar texto
    await user.type(searchInput, 'Maria')
    
    // Verificar filtro aplicado
    expect(screen.getByText('Dra. Maria Silva')).toBeInTheDocument()
    expect(screen.queryByText('Dr. João Santos')).not.toBeInTheDocument()
  })
  
  it('favorita profissional ao clicar no botão', async () => {
    const user = userEvent.setup()
    render(<ProfessionalCard professional={mockProfessional} />)
    
    // Clicar no botão de favoritar
    const favoriteBtn = screen.getByRole('button', { name: /favoritar/i })
    await user.click(favoriteBtn)
    
    // Verificar mudança visual
    expect(favoriteBtn).toHaveClass('is-favorite')
  })
})
```

### 4. Testar Fetch/API (Mock)

```jsx
import { vi, beforeEach, afterEach } from 'vitest'

describe('SearchPage com Fetch', () => {
  beforeEach(() => {
    // Mock do fetch
    global.fetch = vi.fn()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  it('carrega e exibe profissionais', async () => {
    const mockData = [
      { id: 1, name: 'Dra. Maria', specialty: 'Clínica' },
      { id: 2, name: 'Dr. João', specialty: 'Infantil' },
    ]
    
    // Configurar mock para retornar dados
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })
    
    render(<SearchPage />)
    
    // Aguardar dados carregarem
    expect(await screen.findByText('Dra. Maria')).toBeInTheDocument()
    expect(screen.getByText('Dr. João')).toBeInTheDocument()
  })
  
  it('exibe mensagem de erro quando fetch falha', async () => {
    // Mock de erro
    global.fetch.mockRejectedValueOnce(new Error('Erro de rede'))
    
    render(<SearchPage />)
    
    // Aguardar mensagem de erro
    expect(await screen.findByText(/erro ao carregar/i)).toBeInTheDocument()
  })
  
  it('exibe loading enquanto carrega', () => {
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    )
    
    render(<SearchPage />)
    
    // Verificar que loading aparece
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })
})
```

### 5. Testar Componentes com Router

```jsx
import { BrowserRouter } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'

describe('Componente com Links', () => {
  it('renderiza links corretamente', () => {
    render(
      <BrowserRouter>
        <ProfessionalCard professional={mockProfessional} />
      </BrowserRouter>
    )
    
    const link = screen.getByRole('link', { name: /ver perfil/i })
    expect(link).toHaveAttribute('href', '/professionals/1')
  })
  
  it('navega para página correta ao clicar', async () => {
    const user = userEvent.setup()
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    
    const link = screen.getByRole('link', { name: /favoritos/i })
    await user.click(link)
    
    // Verificar que mudou de página
    expect(screen.getByText('Meus Favoritos')).toBeInTheDocument()
  })
})
```

### 6. Testar localStorage

```jsx
import { afterEach } from 'vitest'
import { saveFavorites, loadFavorites } from '../data/favoritesStorage.js'

describe('favoritesStorage', () => {
  afterEach(() => {
    // Limpar localStorage após cada teste
    localStorage.clear()
  })
  
  it('salva favoritos no localStorage', () => {
    const favorites = [1, 2, 3]
    saveFavorites(favorites)
    
    const stored = JSON.parse(localStorage.getItem('mindcare_favorites'))
    expect(stored).toEqual(favorites)
  })
  
  it('carrega favoritos do localStorage', () => {
    localStorage.setItem('mindcare_favorites', JSON.stringify([1, 2]))
    
    const favorites = loadFavorites()
    expect(favorites).toEqual([1, 2])
  })
  
  it('retorna array vazio se não houver favoritos', () => {
    const favorites = loadFavorites()
    expect(favorites).toEqual([])
  })
})
```

## Matchers Úteis

### Jest-DOM (já configurado)

```jsx
// Visibilidade
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).not.toBeInTheDocument()

// Texto
expect(element).toHaveTextContent('Texto esperado')
expect(element).toHaveTextContent(/regex/i)

// Atributos
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('active')
expect(element).toHaveValue('valor do input')

// Estado
expect(checkbox).toBeChecked()
expect(button).toBeDisabled()
expect(input).toHaveFocus()

// Formulários
expect(input).toHaveValue('Maria')
expect(select).toHaveDisplayValue('São Paulo')
```

### Vitest Padrão

```jsx
// Igualdade
expect(value).toBe(5)           // Igualdade estrita (===)
expect(obj).toEqual({ a: 1 })   // Igualdade profunda

// Arrays
expect(array).toContain('item')
expect(array).toHaveLength(3)

// Booleanos
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBe(true)

// Números
expect(num).toBeGreaterThan(5)
expect(num).toBeLessThanOrEqual(10)

// Funções mock
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(arg1, arg2)
expect(mockFn).toHaveBeenCalledTimes(2)
```

## Boas Práticas

### ✅ FAZER

1. **Testes descritivos:**
```jsx
// ✅ BOM - Descreve comportamento
it('exibe mensagem de erro quando email é inválido', () => {})

// ❌ RUIM - Muito genérico
it('funciona', () => {})
```

2. **Arrange, Act, Assert:**
```jsx
it('calcula total corretamente', () => {
  // Arrange - Preparar
  const items = [10, 20, 30]
  
  // Act - Agir
  const total = calculateTotal(items)
  
  // Assert - Verificar
  expect(total).toBe(60)
})
```

3. **Testar comportamento, não implementação:**
```jsx
// ✅ BOM - Testa resultado final
it('filtra profissionais por cidade', () => {
  // usuário digita
  // verifica que apenas profissionais da cidade aparecem
})

// ❌ RUIM - Testa implementação interna
it('chama setState com valor correto', () => {
  // verifica chamadas de setState
})
```

4. **Um conceito por teste:**
```jsx
// ✅ BOM - Testes separados
it('valida email inválido', () => {})
it('valida senha curta', () => {})

// ❌ RUIM - Testa muita coisa
it('valida formulário', () => {
  // testa email, senha, nome, telefone...
})
```

### ❌ NÃO FAZER

- Testar bibliotecas externas (React Router, etc)
- Testar CSS diretamente (foco em comportamento)
- Deixar testes dependentes da ordem de execução
- Usar `waitFor` sem necessidade (use `findBy` quando possível)
- Testar detalhes de implementação (nomes de funções, estado interno)

## Cobertura de Testes

**Meta do projeto: 70%+**

```bash
npm run test:coverage
```

**O que cobrir:**
- ✅ Renderização básica de componentes
- ✅ Interações do usuário (cliques, digitação)
- ✅ Lógica de filtros e busca
- ✅ Estados de loading/error/success
- ✅ Validações de formulário
- ✅ Funções utilitárias (localStorage, etc)

**O que pode pular:**
- 🤷 Componentes muito simples (apenas layout)
- 🤷 Configurações (vite.config, etc)
- 🤷 Estilos puros

## Exemplos Completos do Projeto

### Teste de Componente (ProfessionalCard)

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import ProfessionalCard from './ProfessionalCard.jsx'

describe('ProfessionalCard', () => {
  const mockProfessional = {
    id: 1,
    name: 'Dra. Maria Silva',
    specialty: 'Psicologia Clínica',
    city: 'São Paulo',
    price: 150,
    rating: 4.8,
  }

  function renderCard() {
    return render(
      <BrowserRouter>
        <ProfessionalCard professional={mockProfessional} />
      </BrowserRouter>
    )
  }

  it('renderiza informações do profissional', () => {
    renderCard()
    
    expect(screen.getByText('Dra. Maria Silva')).toBeInTheDocument()
    expect(screen.getByText(/Psicologia Clínica/i)).toBeInTheDocument()
    expect(screen.getByText(/São Paulo/i)).toBeInTheDocument()
  })

  it('exibe link para página do profissional', () => {
    renderCard()
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/professionals/1')
  })

  it('favorita profissional ao clicar no botão', async () => {
    const user = userEvent.setup()
    renderCard()
    
    const favoriteBtn = screen.getByRole('button', { name: /favoritar/i })
    await user.click(favoriteBtn)
    
    expect(favoriteBtn).toHaveClass('is-favorite')
  })
})
```

### Teste de Página com Fetch (SearchPage)

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import SearchPage from './SearchPage.jsx'

describe('SearchPage', () => {
  const mockProfessionals = [
    { id: 1, name: 'Dra. Maria', city: 'São Paulo', specialty: 'Clínica', price: 150 },
    { id: 2, name: 'Dr. João', city: 'Rio de Janeiro', specialty: 'Infantil', price: 120 },
  ]

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('carrega e exibe profissionais', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfessionals,
    })

    render(<BrowserRouter><SearchPage /></BrowserRouter>)

    expect(await screen.findByText('Dra. Maria')).toBeInTheDocument()
    expect(screen.getByText('Dr. João')).toBeInTheDocument()
  })

  it('filtra por nome', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfessionals,
    })

    const user = userEvent.setup()
    render(<BrowserRouter><SearchPage /></BrowserRouter>)

    await screen.findByText('Dra. Maria')

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    await user.type(searchInput, 'Maria')

    expect(screen.getByText('Dra. Maria')).toBeInTheDocument()
    expect(screen.queryByText('Dr. João')).not.toBeInTheDocument()
  })

  it('exibe erro quando fetch falha', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<BrowserRouter><SearchPage /></BrowserRouter>)

    expect(await screen.findByText(/erro ao carregar/i)).toBeInTheDocument()
  })
})
```

## Troubleshooting

**Erro: "Cannot find module"**
- Verificar imports (case-sensitive, extensão `.jsx`)
- Verificar path relativo correto

**Erro: "act() warning"**
- Usar `await` em interações (`await user.click()`)
- Usar `findBy` ao invés de `getBy` para async

**Testes não encontram elementos:**
- Usar `screen.debug()` para ver HTML renderizado
- Verificar se elemento realmente renderiza
- Tentar query diferente (getByRole, getByText, etc)

**Mock de fetch não funciona:**
- Verificar se `beforeEach` está configurado
- Usar `vi.restoreAllMocks()` em `afterEach`

## Observação para IA

- Projeto de **estudantes** - testes devem ser **simples e didáticos**
- Focar em **testes úteis**, não 100% de cobertura
- Comentários em **português** para explicar lógica
- Evitar over-testing de detalhes irrelevantes

