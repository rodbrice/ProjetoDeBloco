# Arquitetura do MindCare

## 📋 Visão Geral

O MindCare é uma plataforma web desenvolvida em **React** que conecta pacientes a psicólogos. A aplicação utiliza uma arquitetura baseada em componentes, com gerenciamento de estado local via React Hooks e armazenamento persistente usando **localStorage**.

## 🏗️ Estrutura de Pastas

```
ProjetoDeBloco/
├── public/                      # Arquivos estáticos públicos
│   ├── professionals.json       # Dados dos profissionais (simula API)
│   └── vite.svg                 # Favicon
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── AppShell.jsx         # Layout principal da aplicação
│   │   ├── Badge.jsx            # Badge de status (agendado/cancelado)
│   │   ├── BottomNav.jsx        # Navegação inferior (mobile)
│   │   ├── Header.jsx           # Cabeçalho com logo
│   │   └── ProfessionalCard.jsx # Card de profissional (com swipe)
│   ├── data/                    # Gerenciamento de dados
│   │   ├── appointmentsStorage.js  # CRUD de agendamentos (localStorage)
│   │   ├── favoritesStorage.js     # CRUD de favoritos (localStorage)
│   │   └── mockProfessionals.js    # [DEPRECATED] Dados antigos
│   ├── pages/                   # Páginas da aplicação
│   │   ├── AboutPage.jsx        # Página "Sobre o MindCare"
│   │   ├── AppointmentsPage.jsx # Lista de agendamentos do usuário
│   │   ├── FavoritesPage.jsx    # Profissionais favoritados
│   │   ├── NewAppointmentPage.jsx  # Formulário de novo agendamento
│   │   ├── NotFoundPage.jsx     # Página 404
│   │   ├── ProfessionalPage.jsx # Detalhes do profissional
│   │   └── SearchPage.jsx       # Busca de profissionais (página inicial)
│   ├── routes/
│   │   └── AppRoutes.jsx        # Configuração de rotas (React Router)
│   ├── styles/                  # Estilos CSS
│   │   ├── Components.css       # Estilos de componentes específicos
│   │   └── SearchPage.css       # Estilos da página de busca
│   ├── test/                    # Configuração de testes
│   │   └── setup.js             # Setup do Vitest + Testing Library
│   ├── App.jsx                  # Componente raiz
│   ├── App.css                  # [POUCO USADO] Estilos do App
│   ├── index.css                # Estilos globais e sistema de design
│   └── main.jsx                 # Ponto de entrada da aplicação
├── package.json                 # Dependências e scripts
├── vite.config.js               # Configuração do Vite
└── vitest.config.js             # Configuração dos testes
```

## 🔄 Fluxo de Dados

### 1. Carregamento de Profissionais (Fetch API)

```
SearchPage.jsx
    ↓ (useEffect)
fetch('/professionals.json')
    ↓
setProfessionals(data.professionals)
    ↓
Renderiza lista filtrada
```

**Caminho dos dados:**
1. Usuário acessa a página inicial (`/`)
2. `SearchPage` executa `useEffect` ao montar
3. Faz `fetch()` para `/public/professionals.json`
4. Trata loading/error/success com estados
5. Atualiza lista de profissionais no estado local
6. Aplica filtros (query, localização, preço)
7. Renderiza cards com os profissionais filtrados

### 2. Sistema de Favoritos

```
ProfessionalCard.jsx
    ↓ (click/swipe)
toggleFavorite(professionalId)
    ↓
favoritesStorage.js
    ↓
localStorage.setItem('mindcare.favorites.v1', ...)
    ↓
setIsFav(true/false)
    ↓
Atualiza UI (ícone ⭐/☆)
```

**Como funciona:**
- Cada profissional tem botão de favoritar (⭐/☆)
- **Desktop:** Click no botão
- **Mobile:** Swipe para direita/esquerda no card
- Dados salvos no `localStorage` como array de IDs
- Página de Favoritos (`/favorites`) carrega IDs e busca profissionais

### 3. Gerenciamento de Agendamentos

```
NewAppointmentPage.jsx
    ↓ (submit form)
onCreate({ professionalId, date, time })
    ↓
App.jsx (appointmentActions.createAppointment)
    ↓
setAppointments([...previous, newAppointment])
    ↓
appointmentsStorage.js (saveAppointments)
    ↓
localStorage.setItem('mindcare.appointments.v1', ...)
    ↓
Navigate → /appointments
```

**Estados dos agendamentos:**
- `scheduled`: Agendamento ativo (pode cancelar)
- `cancelled`: Agendamento cancelado (não pode reverter)

## 🎨 Sistema de Design

### Cores Principais

```css
--primary: #5E81AC;        /* Azul sereno */
--secondary: #88C0D0;      /* Verde menta/aqua */
--accent: #8FBCBB;         /* Teal suave */
--text: #2E3440;           /* Chumbo suave */
--bg: #F8F9FB;             /* Branco suave */
--success: #A3BE8C;        /* Verde aprovado */
--error: #BF616A;          /* Vermelho erro */
--warning: #EBCB8B;        /* Amarelo favorito */
```

### Espaçamento (Sistema de 4px)

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
```

### Componentes Utilitários

- `.stack`: Layout vertical com gap
- `.row`: Layout horizontal com flexbox
- `.btn`: Botão padrão
- `.card`: Container com borda e sombra
- `.surface`: Surface elevada

## 📱 Responsividade

### Estratégia Mobile-First

1. **Base:** Tudo projetado para mobile (320px+)
2. **Tablet:** `@media (min-width: 768px)`
3. **Desktop:** `@media (min-width: 1024px)`

### Navegação

- **Mobile:** `BottomNav` fixo (4 itens com ícones)
- **Desktop:** `Header` com links no topo

### Breakpoint Principal: 768px

```css
@media (min-width: 768px) {
  .bottom-nav { display: none; }
  .main { padding-bottom: var(--space-5); }
}
```

## 🧪 Estratégia de Testes

### Ferramentas
- **Vitest:** Test runner (alternativa ao Jest)
- **React Testing Library:** Renderização de componentes
- **jsdom:** Ambiente DOM simulado

### Casos de Teste Cobertos

1. **ProfessionalCard.test.jsx**
   - Renderização de informações
   - Botão de favoritar
   - Link para perfil

2. **SearchPage.test.jsx**
   - Loading states
   - Fetch de dados
   - Filtros dinâmicos
   - Tratamento de erros

3. **AppointmentsPage.test.jsx**
   - Lista de agendamentos
   - Cancelamento
   - Empty state

## 🔐 Armazenamento Local (localStorage)

### Keys Utilizadas

```javascript
'mindcare.appointments.v1'  // Array de agendamentos
'mindcare.favorites.v1'     // Array de IDs favoritados
```

### Estrutura de Dados

**Agendamento:**
```json
{
  "id": "uuid-gerado",
  "professionalId": "ana-souza",
  "professionalName": "Dra. Ana Souza",
  "date": "2026-03-20",
  "time": "14:00",
  "status": "scheduled",
  "createdAt": "2026-03-13T10:30:00.000Z"
}
```

**Favoritos:**
```json
["ana-souza", "bruno-lima", "carla-mendes"]
```

## 🚀 Fluxo de Navegação

```
/ (SearchPage)
    ↓ Click em card
/professionals/:id (ProfessionalPage)
    ↓ Click "Solicitar agendamento"
/appointments/new?professionalId=:id (NewAppointmentPage)
    ↓ Submit formulário
/appointments (AppointmentsPage)
```

### Todas as Rotas

- `/` → Busca de profissionais
- `/professionals/:id` → Detalhes do profissional
- `/appointments` → Meus agendamentos
- `/appointments/new` → Novo agendamento
- `/favorites` → Profissionais favoritos
- `/about` → Sobre o MindCare
- `*` → Página 404

## 📦 Dependências Principais

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "vite": "^7.2.4"
}
```

**Dev Dependencies:**
- `@testing-library/react`
- `@testing-library/jest-dom`
- `vitest`
- `jsdom`

## 🎯 Decisões Arquiteturais

### Por que não usar Redux?

Para este projeto de escopo limitado, **React Hooks + localStorage** são suficientes. Redux seria over-engineering considerando:
- Apenas 2 estados globais (appointments, favorites)
- Sem necessidade de time-travel debugging
- Equipe pequena (3 pessoas)

### Por que localStorage ao invés de API real?

- **TP4 foca em:** Fetch API, testes, gestos mobile
- **Próximo TP5:** Autenticação (Firebase) + API real
- localStorage simula persistência de forma simples e didática

### Por que Vite ao invés de Create React App?

- **Vite:** Mais rápido (HMR instantâneo)
- **CRA:** Deprecated desde 2023
- Build time reduzido em ~10x

## 🔮 Próximas Melhorias (Backlog)

Ver arquivo `BACKLOG.md` para roadmap completo.

