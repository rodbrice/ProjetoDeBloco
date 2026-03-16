# Componentes do MindCare

## 📦 Componentes Reutilizáveis

### `AppShell.jsx`

**Função:** Layout base da aplicação com header, conteúdo e navegação.

**Props:** Nenhuma (usa `<Outlet />` do React Router)

**Estrutura:**
```jsx
<div>
  <Header />
  <main>
    <Outlet /> {/* Páginas são renderizadas aqui */}
  </main>
  <BottomNav />
</div>
```

**Uso:** Wrapper automático de todas as rotas via React Router.

---

### `Header.jsx`

**Função:** Cabeçalho com logo "Mind Care" e link para agendamentos.

**Props:** Nenhuma

**Características:**
- Logo clicável (volta para home)
- Botão "Agendamentos" (desktop)
- Background branco com sombra sutil

**Estilos:** `.header`, `.header-inner`, `.brand`

---

### `BottomNav.jsx`

**Função:** Navegação inferior mobile com 4 links.

**Props:** Nenhuma (lê favoritos do localStorage via hook)

**Links:**
1. 🔍 Buscar (`/`)
2. ⭐ Favoritos (`/favorites`) - com badge de contador
3. 📅 Agenda (`/appointments`)
4. ℹ️ Sobre (`/about`)

**Comportamento:**
- Fixo no bottom da tela (mobile)
- Escondido em desktop (>768px)
- Badge dinâmico mostrando quantidade de favoritos
- Link ativo destacado com barra azul no topo

**Estados:**
```javascript
const [favoritesCount, setFavoritesCount] = useState(0)
```

**Hooks:**
- `useEffect`: Atualiza contador quando página ganha foco

---

### `ProfessionalCard.jsx`

**Função:** Card de profissional com suporte a swipe e favoritar.

**Props:**
- `professional` (object): Dados do profissional
  - `id`, `name`, `location`, `price`, `specialties`
- `showFavoriteButton` (bool, opcional): Se deve mostrar botão favoritar

**Funcionalidades:**
1. **Visualização:**
   - Nome, localização, preço
   - Até 3 especialidades em tags
   - Link "Ver perfil"

2. **Gestos Mobile (Swipe):**
   - **Swipe direita (>80px):** Adiciona aos favoritos
   - **Swipe esquerda (<-80px):** Remove dos favoritos
   - Feedback visual: card se move e fica translúcido
   - Indicadores aparecem durante o arrasto

3. **Desktop:**
   - Botão de favoritar (estrela cheia/vazia)
   - Hover: Card sobe levemente

**Estados Internos:**
```javascript
const [swipeOffset, setSwipeOffset] = useState(0)  // Posição do swipe
const [isFav, setIsFav] = useState(false)           // Se está favoritado
```

**Touch Handlers:**
- `handleTouchStart`: Captura posição inicial
- `handleTouchMove`: Atualiza offset enquanto arrasta
- `handleTouchEnd`: Detecta se passou do threshold, favorita/desfavorita

**Estilos Dinâmicos:**
```jsx
style={{
  transform: `translateX(${swipeOffset}px)`,
  opacity: 1 - Math.abs(swipeOffset) / 200,
  transition: swipeOffset === 0 ? 'all 0.3s ease' : 'none',
}}
```

---

### `Badge.jsx`

**Função:** Badge de status para agendamentos.

**Props:**
- `variant` (string): `'scheduled'`, `'cancelled'`, ou `'pending'`
- `children` (node): Texto a exibir

**Exemplo:**
```jsx
<Badge variant="scheduled">Agendado</Badge>
<Badge variant="cancelled">Cancelado</Badge>
```

**Estilos:** `.badge`, `.badge-scheduled`, `.badge-cancelled`

---

## 📄 Páginas

### `SearchPage.jsx`

**Rota:** `/` (página inicial)

**Função:** Busca e filtro de psicólogos com dados dinâmicos.

**Estados:**
```javascript
const [query, setQuery] = useState('')          // Busca por texto
const [location, setLocation] = useState('')    // Filtro de região
const [maxPrice, setMaxPrice] = useState('')    // Filtro de preço
const [professionals, setProfessionals] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

**Fluxo de Dados:**
1. `useEffect` carrega `/professionals.json` via fetch
2. Mostra loading spinner enquanto carrega
3. Se erro, mostra mensagem amigável com botão "Tentar novamente"
4. Se sucesso, armazena profissionais no estado
5. `useMemo` filtra lista baseado nos critérios:
   - **Query:** Busca em nome, bio e especialidades
   - **Location:** Filtra por região
   - **MaxPrice:** Mostra apenas ≤ valor máximo

**Componentes Filhos:**
- `ProfessionalCard` para cada profissional filtrado
- Empty state se nenhum resultado

**Tratamento de Erro:**
```javascript
catch (err) {
  console.error('Erro ao carregar profissionais:', err)
  setError('Não conseguimos carregar a lista de profissionais...')
}
```

---

### `ProfessionalPage.jsx`

**Rota:** `/professionals/:id`

**Função:** Detalhes completos de um profissional específico.

**Params:** `id` do profissional (via `useParams()`)

**Estados:**
```javascript
const [professional, setProfessional] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [isFav, setIsFav] = useState(false)
```

**Seções:**
1. **Hero:** Nome, local, preço, botão favoritar
2. **Especialidades:** Lista de todas as especialidades
3. **Sobre:** Biografia do profissional
4. **Modalidades:** Tags de atendimento (Online/Presencial)
5. **Ações:** Botão "Solicitar agendamento"

**Navegação:**
- Botão "Solicitar agendamento" → `/appointments/new?professionalId=:id`
- Botão "Voltar para a busca" → `/`

---

### `NewAppointmentPage.jsx`

**Rota:** `/appointments/new?professionalId=:id`

**Função:** Formulário para criar novo agendamento.

**Query Params:** `professionalId` (obrigatório)

**Estados:**
```javascript
const [professionals, setProfessionals] = useState([])
const [loading, setLoading] = useState(true)
const [date, setDate] = useState(todayISO())
const [time, setTime] = useState('09:00')
```

**Horários Disponíveis:**
```javascript
const TIME_SLOTS = ['09:00', '10:30', '14:00', '15:30', '18:00']
```

**Validações:**
- Profissional deve existir
- Data é obrigatória (input type="date")
- Horário selecionado de dropdown

**Ao Submeter:**
1. Cria objeto de agendamento:
   ```javascript
   {
     professionalId,
     professionalName,
     date,
     time
   }
   ```
2. Chama `onCreate()` (prop vinda do App.jsx)
3. Navega para `/appointments` com state `createdId`
4. Página de agendamentos mostra mensagem de sucesso

---

### `AppointmentsPage.jsx`

**Rota:** `/appointments`

**Função:** Lista de agendamentos do usuário.

**Props:**
- `appointments` (array): Lista de agendamentos
- `onCancel` (function): Callback para cancelar agendamento

**Lógica:**
- Se `location.state.createdId` existe, mostra banner de sucesso
- Se lista vazia, mostra empty state com CTA para buscar
- Cards de agendamento com:
  - Nome do profissional
  - Data e hora (📅 🕒)
  - Badge de status
  - Botão "Cancelar" (apenas se `status === 'scheduled'`)

**Helpers:**
```javascript
function formatStatus(status) {
  if (status === 'scheduled') return 'Agendado'
  if (status === 'cancelled') return 'Cancelado'
  return status
}

function getBadgeVariant(status) {
  // Retorna variant para o Badge component
}
```

---

### `FavoritesPage.jsx`

**Rota:** `/favorites`

**Função:** Lista de profissionais favoritados.

**Estados:**
```javascript
const [professionals, setProfessionals] = useState([])
const [favorites, setFavorites] = useState([])
const [loading, setLoading] = useState(true)
```

**Fluxo:**
1. Carrega IDs favoritados do localStorage
2. Faz fetch de `/professionals.json`
3. Filtra apenas profissionais cujo ID está nos favoritos
4. Renderiza lista com `ProfessionalCard`

**Empty State:**
- Mensagem: "Nenhum favorito ainda"
- CTA para buscar profissionais

---

### `AboutPage.jsx`

**Rota:** `/about`

**Função:** Página institucional sobre o MindCare.

**Seções:**
1. **Missão:** O que é o MindCare
2. **O que oferecemos:** Lista de funcionalidades
3. **Equipe:** Cards dos 3 membros (Brice, Karina, Sâmela)
4. **Tecnologias:** Tags com React, Vite, etc.
5. **Footer:** Versão e créditos

**Não tem lógica complexa**, apenas conteúdo estático.

---

### `NotFoundPage.jsx`

**Rota:** `*` (catch-all)

**Função:** Página 404 para rotas inexistentes.

**Simples:** Mensagem + link para voltar à home.

---

## 🎯 Patterns e Boas Práticas

### Nomenclatura

- **Componentes:** PascalCase (`ProfessionalCard`)
- **Funções:** camelCase (`handleTouchStart`)
- **CSS Classes:** kebab-case (`.professional-card`)
- **Arquivos:** PascalCase para componentes, camelCase para utils

### Composição

Todos os componentes seguem o pattern:
```jsx
export default function ComponentName({ prop1, prop2 }) {
  // 1. Estados
  const [state, setState] = useState()
  
  // 2. Hooks (useEffect, useMemo)
  useEffect(() => { ... }, [])
  
  // 3. Handlers
  const handleAction = () => { ... }
  
  // 4. Early returns (loading, error, not found)
  if (loading) return <LoadingState />
  if (error) return <ErrorState />
  
  // 5. Render principal
  return (
    <div>...</div>
  )
}
```

### Tratamento de Loading/Error

**Padrão consistente em todas as páginas que fazem fetch:**

```jsx
if (loading) {
  return (
    <div className="loading-state">
      <div className="loading-spinner">⏳</div>
      <div className="loading-text">Carregando...</div>
    </div>
  )
}

if (error) {
  return (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <div className="error-title">Ops! Algo deu errado</div>
      <p>{error}</p>
      <button onClick={retry}>Tentar novamente</button>
    </div>
  )
}
```

### PropTypes

**Não usamos PropTypes** neste projeto (equipe optou por manter simples). Para produção, recomenda-se TypeScript ou PropTypes.

---

## 📊 Hierarquia de Componentes

```
App
 └─ AppRoutes
     └─ AppShell
         ├─ Header
         ├─ Outlet (páginas)
         │   ├─ SearchPage
         │   │   └─ ProfessionalCard (vários)
         │   ├─ ProfessionalPage
         │   ├─ NewAppointmentPage
         │   ├─ AppointmentsPage
         │   │   └─ Badge (vários)
         │   ├─ FavoritesPage
         │   │   └─ ProfessionalCard (vários)
         │   ├─ AboutPage
         │   └─ NotFoundPage
         └─ BottomNav
```

---

## 🔄 Ciclo de Vida Típico

### Exemplo: Favoritar um profissional

1. **Usuário:** Swipe direita no `ProfessionalCard`
2. **ProfessionalCard:** Detecta `handleTouchEnd` com offset > 80px
3. **ProfessionalCard:** Chama `toggleFavorite(professionalId)`
4. **favoritesStorage.js:** Adiciona ID ao array no localStorage
5. **ProfessionalCard:** Atualiza estado `setIsFav(true)`
6. **UI:** Ícone muda para ⭐, card volta à posição
7. **BottomNav:** Badge atualiza contador (via event listener 'focus')
8. **FavoritesPage:** Se usuário navegar, verá profissional na lista

---

## 🧹 Código Limpo

### Comentários em Português

Todos os comentários do código estão em **português** para facilitar compreensão da equipe:

```javascript
// Carrega os dados dos profissionais do JSON
useEffect(() => {
  async function loadProfessionals() {
    // ... implementação
  }
  loadProfessionals()
}, [])
```

### Funções Helper

Funções auxiliares ficam **fora do componente** quando não precisam de estado:

```javascript
function formatStatus(status) {
  if (status === 'scheduled') return 'Agendado'
  // ...
}

export default function AppointmentsPage() {
  // Usa formatStatus aqui
}
```

### Early Returns

Sempre validamos casos especiais no início:

```javascript
if (!professional) {
  return <NotFound />
}

// Código principal continua limpo
return <ProfileView />
```

