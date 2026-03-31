---
name: react-component
description: Guia para criar novos componentes React no projeto MindCare seguindo os padrões da equipe. Use quando for solicitado criar um novo componente React.
license: MIT
---

# Criar Componente React - MindCare

## Padrões do Projeto

Ao criar componentes React para o MindCare, siga SEMPRE estes padrões:

### 1. Estrutura de Arquivos
- Todos os componentes ficam em `/src/components/`
- Nome do arquivo: **PascalCase** (ex: `ProfessionalCard.jsx`)
- Sempre usar extensão `.jsx` para componentes React
- Se houver teste, criar `NomeComponente.test.jsx` no mesmo diretório

### 2. Estrutura do Componente

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' // se precisar

export default function NomeDoComponente({ prop1, prop2 }) {
  // 1. Estados primeiro
  const [state, setState] = useState(initialValue)
  
  // 2. Efeitos depois
  useEffect(() => {
    // lógica de efeitos
  }, [dependencies])
  
  // 3. Handlers
  const handleClick = () => {
    // lógica
  }
  
  // 4. Retorno JSX
  return (
    <div className="component-name">
      {/* conteúdo */}
    </div>
  )
}
```

### 3. Convenções de Nomenclatura

- **Componentes**: PascalCase (`ProfessionalCard`, `BottomNav`)
- **Props**: camelCase (`professional`, `appointmentActions`)
- **Handlers**: `handle` + ação (`handleClick`, `handleSubmit`, `handleFavoriteClick`)
- **Classes CSS**: kebab-case (`professional-card`, `btn-primary`)
- **Variáveis de estado**: camelCase descritivo (`isLoading`, `errorMessage`, `professionals`)

### 4. Estilo CSS

**NÃO** criar arquivo CSS separado para cada componente pequeno. Use:
- `/src/styles/Components.css` para estilos de componentes
- `/src/styles/SearchPage.css` apenas se for página complexa

**Usar CSS Variables do projeto:**
```css
/* Cores */
var(--primary)        /* #4A90E2 - Azul principal */
var(--primary-dark)   /* #357ABD */
var(--primary-light)  /* #E8F4FD */
var(--secondary)      /* #7B68EE - Roxo */
var(--success)        /* #10B981 */
var(--danger)         /* #EF4444 */
var(--warning)        /* #F59E0B */

/* Espaçamentos */
var(--space-1)  /* 0.25rem */
var(--space-2)  /* 0.5rem */
var(--space-3)  /* 0.75rem */
var(--space-4)  /* 1rem */
var(--space-5)  /* 1.5rem */
var(--space-6)  /* 2rem */

/* Fontes */
var(--text-sm)   /* 0.875rem */
var(--text-base) /* 1rem */
var(--text-lg)   /* 1.125rem */
var(--text-xl)   /* 1.25rem */

/* Bordas */
var(--radius-sm) /* 0.375rem */
var(--radius-md) /* 0.5rem */
var(--radius-lg) /* 0.75rem */

/* Transições */
var(--transition-fast) /* 0.15s ease */
var(--transition-base) /* 0.3s ease */
```

### 5. Responsividade

**Mobile-First!** Sempre começar com mobile e adicionar breakpoints:

```css
/* Mobile (padrão) */
.component {
  padding: var(--space-3);
}

/* Tablet */
@media (min-width: 768px) {
  .component {
    padding: var(--space-5);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-6);
  }
}
```

### 6. Acessibilidade

**Sempre** incluir:
- Labels em inputs (`<label htmlFor="id">`)
- Alt text em imagens
- Botões semânticos (`<button>` ao invés de `<div onClick>`)
- ARIA attributes quando necessário
- Contraste adequado (seguir CSS variables)

### 7. Boas Práticas

✅ **FAZER:**
- Usar `export default function NomeComponente()`
- Desestruturar props no parâmetro
- Usar arrow functions para handlers
- Comentar lógica complexa em português
- Validar props básicas (ex: `if (!data) return null`)
- Usar ternários simples no JSX

❌ **NÃO FAZER:**
- Inline styles (use classes CSS)
- Lógica complexa dentro do JSX
- Componentes muito grandes (>200 linhas = refatorar)
- Styled-components ou CSS-in-JS (projeto usa CSS puro)
- PropTypes (projeto não usa)
- Deixar console.log em produção

### 8. Integração com localStorage

Se o componente precisa persistir dados, use os utilitários existentes:

```jsx
import { loadAppointments, saveAppointments } from '../data/appointmentsStorage.js'
import { loadFavorites, saveFavorites, toggleFavorite, isFavorite } from '../data/favoritesStorage.js'

// Exemplo de uso
const favorites = loadFavorites() // retorna array de IDs
const isCurrentFav = isFavorite(professionalId) // retorna boolean
```

### 9. Exemplo Completo

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ExampleCard({ item, onAction }) {
  const [isActive, setIsActive] = useState(false)
  
  const handleToggle = () => {
    setIsActive(!isActive)
    onAction?.(item.id) // optional chaining para callbacks opcionais
  }
  
  if (!item) {
    return null // validação básica
  }
  
  return (
    <article className={`example-card ${isActive ? 'is-active' : ''}`}>
      <h3 className="example-title">{item.title}</h3>
      <p className="example-description">{item.description}</p>
      
      <div className="example-actions">
        <button 
          onClick={handleToggle}
          className="btn-primary"
          aria-pressed={isActive}
        >
          {isActive ? 'Desativar' : 'Ativar'}
        </button>
        
        <Link to={`/items/${item.id}`} className="btn-secondary">
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}
```

### 10. CSS Correspondente

```css
/* Components.css */
.example-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  transition: var(--transition-base);
}

.example-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.example-card.is-active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.example-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: var(--space-2);
}

.example-description {
  color: var(--text-gray);
  margin-bottom: var(--space-4);
}

.example-actions {
  display: flex;
  gap: var(--space-3);
}
```

## Checklist de Criação

Antes de considerar o componente pronto:

- [ ] Arquivo nomeado em PascalCase com extensão `.jsx`
- [ ] Export default no topo
- [ ] Props desestruturadas
- [ ] Validação básica de props (`if (!data) return null`)
- [ ] Handlers nomeados com `handle`
- [ ] Classes CSS em kebab-case
- [ ] Estilos adicionados em `/src/styles/Components.css`
- [ ] CSS Variables utilizadas (não valores hardcoded)
- [ ] Mobile-first implementado
- [ ] Acessibilidade básica (labels, buttons, alt)
- [ ] Comentários em português para lógica complexa
- [ ] Testado no navegador (Chrome/Safari)
- [ ] Sem console.log ou debuggers
- [ ] Componente reutilizável (não específico demais)

## Dicas de Debugging

Se o componente não aparece:
1. Verificar se está sendo importado corretamente
2. Verificar se o path está correto (`../components/Nome.jsx`)
3. Abrir DevTools → Console para erros
4. Verificar se as props estão sendo passadas
5. Adicionar `console.log(props)` temporário para debug

Se o CSS não funciona:
1. Verificar se a classe está no HTML (inspecionar elemento)
2. Verificar se o arquivo CSS está importado em `main.jsx` ou `App.jsx`
3. Verificar especificidade CSS (usar classe única, evitar IDs)
4. Limpar cache do navegador (Ctrl+Shift+R)

## Observação para IA

Este é um projeto de **estudantes**, então:
- Mantenha código **simples e legível** (não overengineer)
- Use **português nos comentários** e nomes de variáveis quando fizer sentido
- Prefira **vanilla JS/CSS** ao invés de bibliotecas externas
- O código deve parecer **feito por humanos**, não por IA (evite padrões muito sofisticados)
- Explique decisões técnicas de forma didática

