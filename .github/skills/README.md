# 🤖 Agent Skills - MindCare

Este diretório contém **skills personalizadas** para agentes de IA (GitHub Copilot, Claude, etc.) trabalharem no projeto MindCare.

## 📂 Skills Disponíveis

### 1. **react-component** - Criar Componentes React
**Quando usar:** Criar novos componentes seguindo os padrões do projeto

**O que cobre:**
- Estrutura de componentes (hooks, handlers, JSX)
- Convenções de nomenclatura (PascalCase, camelCase, kebab-case)
- Uso de CSS Variables do projeto
- Responsividade mobile-first
- Acessibilidade básica
- Integração com localStorage
- Boas práticas e anti-padrões

**Exemplo de uso com IA:**
```
"Crie um componente ReviewCard para exibir avaliações de usuários"
```

---

### 2. **add-page** - Adicionar Novas Páginas
**Quando usar:** Criar novas rotas/páginas no React Router

**O que cobre:**
- Template de página com AppShell e Header
- Como adicionar rotas em `AppRoutes.jsx`
- Como adicionar links no BottomNav
- Páginas com fetch de dados
- Páginas com formulários
- Páginas com parâmetros de rota (`:id`)
- Navegação programática

**Exemplo de uso com IA:**
```
"Adicione uma página de configurações do usuário em /settings"
```

---

### 3. **vitest-testing** - Criar Testes
**Quando usar:** Adicionar testes unitários e de integração

**O que cobre:**
- Estrutura de testes com Vitest + React Testing Library
- Template de testes para componentes e páginas
- Queries corretas (getByRole, getByText, etc.)
- Testar interações do usuário (clicks, digitação)
- Mock de Fetch API
- Testar componentes com React Router
- Testar localStorage
- Matchers úteis (toBeInTheDocument, toHaveClass, etc.)
- Boas práticas de testes (AAA, um conceito por teste)

**Exemplo de uso com IA:**
```
"Crie testes para o componente ReviewCard testando renderização e interações"
```

---

### 4. **fetch-api** - Consumir APIs
**Quando usar:** Implementar chamadas de API com Fetch

**O que cobre:**
- Template com estados (loading, error, data)
- Fetch de listas (arrays)
- Fetch de item único (por ID)
- Fetch com dependências (re-fetch)
- Fetch manual (ao clicar)
- POST requests
- Componentes de UI (LoadingSpinner, ErrorMessage, EmptyState)
- Tratamento de erros robusto
- Timeout e retry
- Cache simples

**Exemplo de uso com IA:**
```
"Implemente fetch para carregar reviews de /api/reviews.json"
```

---

## 🚀 Como Usar

### Com GitHub Copilot Chat

Simplesmente peça algo relacionado ao projeto:

```
"Crie um componente de filtro de preço com slider"
```

O Copilot automaticamente usará a skill **react-component** para seguir os padrões do projeto.

### Com prompts específicos

Você pode mencionar a skill explicitamente:

```
"Usando a skill de testes, crie testes completos para SearchPage"
```

---

## 📋 Padrões do Projeto (Resumo)

### Nomenclatura
- **Componentes:** PascalCase (`ProfessionalCard.jsx`)
- **Props/variáveis:** camelCase (`professional`, `isLoading`)
- **Classes CSS:** kebab-case (`professional-card`, `btn-primary`)
- **Handlers:** `handle` + ação (`handleClick`, `handleSubmit`)

### Estrutura de Componentes
```jsx
import { useState } from 'react'

export default function ComponentName({ prop1, prop2 }) {
  // 1. Estados
  const [state, setState] = useState(value)
  
  // 2. Efeitos
  useEffect(() => {}, [])
  
  // 3. Handlers
  const handleClick = () => {}
  
  // 4. Retorno JSX
  return <div>...</div>
}
```

### CSS Variables (Principais)
```css
var(--primary)       /* #4A90E2 - Azul */
var(--secondary)     /* #7B68EE - Roxo */
var(--success)       /* #10B981 */
var(--danger)        /* #EF4444 */
var(--space-4)       /* 1rem */
var(--radius-md)     /* 0.5rem */
var(--transition-base) /* 0.3s ease */
```

### Fetch Pattern
```jsx
const [data, setData] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  async function fetchData() {
    try {
      setIsLoading(true)
      const response = await fetch('/path/to/data.json')
      if (!response.ok) throw new Error('Erro')
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [])
```

---

## 🎯 Filosofia do Projeto

Este é um projeto de **estudantes**, então as skills foram criadas com foco em:

- ✅ **Código simples e legível** (não overengineered)
- ✅ **Vanilla JS/CSS** (mínimo de bibliotecas externas)
- ✅ **Comentários em português** para facilitar aprendizado
- ✅ **Padrões consistentes** entre todos os arquivos
- ✅ **Mobile-first** em tudo
- ✅ **Acessibilidade básica** (labels, contraste, semântica)

**O código deve parecer feito por humanos, não por IA** - evite padrões muito sofisticados ou abstrações desnecessárias.

---

## 🔧 Manutenção

Se precisarem atualizar as skills:

1. Edite o arquivo `SKILL.md` correspondente
2. Adicione exemplos práticos do projeto
3. Mantenha a linguagem simples e didática
4. Atualize este README se adicionar novas skills

---

## 📚 Referências

- [GitHub Copilot Custom Skills](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [React Documentation](https://react.dev)
- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Criado por:** Equipe MindCare (Brice, Karina, Sâmela)  
**Última atualização:** Março 2026

