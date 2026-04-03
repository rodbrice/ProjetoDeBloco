# 🎤 Guia de Apresentação — MindCare
> **Versão completa para defesa técnica.** Organizado para você explicar cada decisão e responder qualquer pergunta do avaliador.

---

## 1. O QUE É O MINDCARE (pitch de 30 segundos)

> "O MindCare é uma plataforma web **mobile-first** que conecta pacientes a psicólogos. O paciente busca profissionais por especialidade, localização e preço, favorita, e agenda consultas. O psicólogo cria uma conta, publica seu anúncio profissional e visualiza as consultas marcadas com ele. Toda a interface foi projetada para funcionar bem em celular, com gestos de swipe e câmera nativa."

---

## 2. STACK TECNOLÓGICO — O QUE USAMOS E POR QUÊ

| Tecnologia | Função | Justificativa técnica |
|---|---|---|
| **React 19** | Construção da interface em componentes | Padrão de mercado, requisito do projeto, modelo de componentes facilita reuso |
| **React Router 7** | Navegação SPA sem recarregamento | Biblioteca oficial de roteamento do React; permite rotas aninhadas e proteção |
| **Vite** | Dev server + build tool | Create React App foi descontinuado; Vite é o substituto oficial — HMR instantâneo |
| **Vitest** | Testes unitários | Integra nativamente com Vite, mesma configuração, sem setup extra |
| **React Testing Library** | Renderizar componentes nos testes | Filosofia de testar como o usuário vê, não a implementação interna |
| **localStorage** | Persistência de dados | Elimina necessidade de backend; dados persistem entre sessões no navegador |
| **Fetch API** | Carregar dados do JSON | API nativa do navegador — zero dependências externas |
| **CSS puro** | Estilização | Sem overhead de bibliotecas; variáveis CSS para design system próprio |

> **Pergunta armadilha:** *"Por que não usaram Tailwind/Bootstrap?"*
> → "Optamos por CSS puro com variáveis customizadas para demonstrar domínio real de CSS. Bibliotecas de utility são válidas em produção, mas aqui queríamos controle total do design system."

---

## 3. ARQUITETURA DO PROJETO

```
src/
├── main.jsx          → Ponto de entrada (monta React no DOM)
├── App.jsx           → Raiz: gerencia agendamentos com useState + useMemo
├── components/       → Peças reutilizáveis de interface
│   ├── AppShell.jsx          → Layout: Header + <Outlet> + BottomNav
│   ├── Header.jsx            → Barra superior com Login/Registro modal
│   ├── BottomNav.jsx         → Navegação inferior mobile
│   ├── PrivateRoute.jsx      → Guard de rotas autenticadas
│   ├── LoginModal.jsx        → Modal de login (createPortal)
│   ├── RegisterModal.jsx     → Modal de cadastro (createPortal)
│   ├── CreateListingModal.jsx→ Modal para psicólogo publicar anúncio
│   ├── ProfessionalCard.jsx  → Card com swipe gesture
│   ├── Badge.jsx             → Badge de status
│   └── CameraCapture.jsx     → Captura de foto via input nativo
├── pages/            → Uma página por rota
│   ├── SearchPage.jsx              → Busca + filtros (pública)
│   ├── ProfessionalPage.jsx        → Perfil detalhado (pública)
│   ├── ProfilePage.jsx             → Minha conta (privada)
│   ├── AppointmentsPage.jsx        → Agendamentos do paciente (privada)
│   ├── PsychologistAppointmentsPage→ Agenda do psicólogo (privada)
│   ├── FavoritesPage.jsx           → Favoritos (privada)
│   ├── NewAppointmentPage.jsx      → Formulário de agendamento (privada)
│   └── AboutPage.jsx               → Sobre o app (pública)
├── routes/
│   └── AppRoutes.jsx   → Declaração centralizada de todas as rotas
├── context/
│   └── AuthContext.jsx → Estado global de autenticação (Context API)
├── hooks/
│   └── useAuth.js      → Hook que consome o AuthContext
├── data/               → Camada de persistência (localStorage)
│   ├── appointmentsStorage.js
│   ├── favoritesStorage.js
│   └── registeredProfessionalsStorage.js
└── styles/
    ├── index.css         → Design system (variáveis, reset, botões)
    └── Components.css    → Estilos específicos de componentes
```

> **Por que separar em pastas assim?**
> "Separação por responsabilidade. `components` são peças reutilizáveis sem regra de negócio. `pages` são as telas completas. `data` é a camada de dados — se trocarmos localStorage por uma API real, só mexemos nessa pasta."

---

## 4. FLUXO DE INICIALIZAÇÃO

```
index.html  →  main.jsx  →  <BrowserRouter>  →  <App>  →  <AuthProvider>  →  <AppRoutes>
```

### `main.jsx`
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```
- `createRoot` → API React 18+, substitui o `ReactDOM.render` antigo
- `StrictMode` → Ativa avisos extras em desenvolvimento (double render, deprecações)
- `BrowserRouter` → Habilita History API do navegador para navegação SPA

### `App.jsx` — Por que o estado de agendamentos fica aqui?
```jsx
const [appointments, setAppointments] = useState(() => loadAppointments())

useEffect(() => {
  saveAppointments(appointments)
}, [appointments])

const appointmentActions = useMemo(() => ({
  createAppointment(draft) { ... },
  cancelAppointment(id) { ... }
}), [])
```
> "O estado de agendamentos fica no `App` porque precisa ser passado para duas rotas diferentes: a lista de agendamentos e o formulário de criação. O `useMemo` garante que o objeto `appointmentActions` não seja recriado a cada render, evitando re-renders desnecessários nos componentes filhos."

---

## 5. SISTEMA DE ROTAS — `AppRoutes.jsx`

```
/                      → SearchPage          (pública)
/professionals/:id     → ProfessionalPage    (pública)
/about                 → AboutPage           (pública)
/profile               → ProfilePage         (privada 🔒)
/favorites             → FavoritesPage       (privada 🔒)
/appointments          → AppointmentsPage OU PsychologistAppointmentsPage (privada 🔒)
/appointments/new      → NewAppointmentPage  (privada 🔒)
*                      → NotFoundPage (404)
```

### Conceito: Layout Compartilhado com `<Outlet>`
```jsx
<Route element={<AppShell />}>        // AppShell = Header + Outlet + BottomNav
  <Route index element={<SearchPage />} />
  <Route path="/about" element={<AboutPage />} />
  ...
</Route>
```
> "O `<Outlet>` dentro do `AppShell` é um buraco onde o React Router injeta a página atual. Header e BottomNav ficam sempre visíveis; só o conteúdo central troca. É o padrão de layout compartilhado do React Router v6+."

### Conceito: `PrivateRoute` — Proteção de rotas
```jsx
export default function PrivateRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return <Outlet />
}
```
> "O `PrivateRoute` funciona como um wrapper que checa o contexto de autenticação. Se não há usuário logado, redireciona para a home com `replace` (não empilha no histórico). Se está logado, renderiza o `<Outlet>` normalmente."

### Conceito: Rota condicional por tipo de usuário
```jsx
<Route
  path="/appointments"
  element={
    user?.userType === 'psychologist'
      ? <PsychologistAppointmentsPage />
      : <AppointmentsPage ... />
  }
/>
```
> "A mesma URL `/appointments` renderiza componentes completamente diferentes dependendo do tipo de conta. Psicólogos veem a agenda dos pacientes deles; pacientes veem seus próprios agendamentos."

---

## 6. AUTENTICAÇÃO — `AuthContext.jsx` + `useAuth.js`

### Por que Context API e não prop drilling?
> "Context API evita passar `user`, `login`, `logout` de pai para filho por todos os níveis da árvore de componentes. O `AuthProvider` envolve toda a aplicação; qualquer componente usa `useAuth()` e acessa o contexto direto."

### Ciclo de vida da autenticação
```
1. App monta → useEffect lê localStorage → restaura sessão (se houver)
2. Usuário faz login/cadastro → estado atualizado + salvo no localStorage
3. Qualquer componente reage via useAuth()
4. Logout → estado limpo + localStorage removido
```

### Objeto do usuário
```js
{
  id: Date.now(),           // Timestamp como ID único
  email: "...",
  name: "...",
  userType: "patient" | "psychologist",
  photo: null,              // base64 quando tiver foto
  phone: "(11) 9 1234-5678",
  // Apenas psicólogos:
  crp: "06/12345",
  clinicAddress: "Rua das Flores, 100",
  city: "São Paulo",
  state: "SP",
  createdAt: "2026-04-03T..."
}
```

### `login()` — Acesso rápido para demonstração
```js
function login(email, password) {
  const userType = email.toLowerCase().includes('psi') ? 'psychologist' : 'patient'
  const fakeUser = { id: Date.now(), email, name: email.split('@')[0], userType, ... }
  setUser(fakeUser)
  localStorage.setItem('mindcare_user', JSON.stringify(fakeUser))
  return fakeUser
}
```
> "O login é fake para facilitar demonstração. Qualquer email com 'psi' vira psicólogo. Em produção, substituiríamos pelo resultado de uma chamada `POST /auth/login` retornando um JWT."

### `register()` — Cadastro completo
```js
function register(name, email, password, userType, extra = {}) {
  const fakeUser = {
    id: Date.now(), email, name, userType,
    phone: extra.phone || null,
    crp: extra.crp || null,
    clinicAddress: extra.clinicAddress || null,
    city: extra.city || null,
    state: extra.state || null,
    ...
  }
  setUser(fakeUser)
  localStorage.setItem('mindcare_user', JSON.stringify(fakeUser))
  return fakeUser
}
```
> "O parâmetro `extra` com valor padrão `{}` é um padrão de optional fields — evita múltiplos parâmetros opcionais. O tipo de conta é escolhido explicitamente pelo usuário via select, não inferido do email."

---

## 7. MODAIS DE AUTENTICAÇÃO

### Por que `createPortal`?
```jsx
return createPortal(
  <div className="overlay">...</div>,
  document.body
)
```
> "O `createPortal` renderiza o modal como filho direto do `<body>`, fora da hierarquia do componente pai. Isso resolve problemas de `z-index`, `overflow: hidden` e `position` de ancestrais. É a forma correta de fazer modais no React."

### `LoginModal.jsx`
- Validação: email + senha obrigatórios, senha ≥ 6 chars
- `setTimeout(500ms)` simula latência de rede → exibe estado de loading
- Fecha ao clicar no overlay ou no ✕
- Footer com link **"Não tem conta? Criar conta"** → abre `RegisterModal`

### `RegisterModal.jsx` — Campos e validações
**Campos comuns (paciente e psicólogo):**
- Nome, Email, Tipo de conta (`<select>`), Telefone

**Campos exclusivos do psicólogo** (renderização condicional):
```jsx
{isPsychologist && (
  <>
    <input id="register-crp" />          {/* CRP */}
    <input id="register-clinic" />        {/* Endereço */}
    <input id="register-city" />          {/* Cidade */}
    <select id="register-state" />        {/* Estado (UF) */}
  </>
)}
```

**Máscara de telefone — sem biblioteca:**
```js
function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11) // só dígitos, max 11
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`
  let r = `(${digits.slice(0, 2)}) `
  if (digits.length <= 3) return r + digits.slice(2)
  r += `${digits.slice(2, 3)} `
  if (digits.length <= 7) return r + digits.slice(3)
  return r + `${digits.slice(3, 7)}-${digits.slice(7)}`
}
// (11) 9 1234-5678
```
> "Implementamos máscara do zero: extrai dígitos, limita a 11 (DDD + 9 + 8), reconstrói a string formatada a cada keystroke. Não precisamos de `react-input-mask` nem nenhuma lib externa."

**Validações no submit:**
```js
const PHONE_REGEX = /^\(\d{2}\) 9 \d{4}-\d{4}$/
const CRP_REGEX   = /^\d{2}\/\d{5}$/
// CRP: XX/NNNNN (região/registro — ex: 06/12345)
```

### Orquestração dos dois modais (Header / BottomNav)
```jsx
const [showLogin, setShowLogin] = useState(false)
const [showRegister, setShowRegister] = useState(false)

<LoginModal
  onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true) }}
/>
<RegisterModal
  onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true) }}
/>
```
> "Os dois modais nunca abrem ao mesmo tempo. O estado de qual está aberto vive no componente pai (Header/BottomNav) para orquestrar a troca. Os modais recebem callbacks simples — não sabem da existência um do outro."

---

## 8. BUSCA DE PROFISSIONAIS — `SearchPage.jsx`

### Carregamento com Fetch API + merge com localStorage
```jsx
useEffect(() => {
  async function loadProfessionals() {
    const response = await fetch('/professionals.json')
    const data = await response.json()
    const fromJson    = data.professionals || []
    const fromStorage = loadRegisteredProfessionals()

    // Set garante que IDs do JSON têm prioridade — sem duplicatas
    const jsonIds = new Set(fromJson.map((p) => p.id))
    const newOnes = fromStorage.filter((p) => !jsonIds.has(p.id))

    setProfessionals([...fromJson, ...newOnes])
  }
  loadProfessionals()
}, []) // [] = executa 1x na montagem
```
> "O `Set` de IDs é O(1) para lookup, mais eficiente que `Array.includes`. Psicólogos cadastrados no app aparecem ao final da lista, depois dos mockados."

### Filtros com `useMemo`
```jsx
const filtered = useMemo(() => {
  return professionals.filter(p => {
    const matchQuery    = !query    || [p.name, p.bio, ...p.specialties].join(' ').toLowerCase().includes(query)
    const matchLocation = !location || p.location.toLowerCase().includes(location)
    const matchPrice    = !maxPrice || p.price <= Number(maxPrice)
    return matchQuery && matchLocation && matchPrice
  })
}, [query, location, maxPrice, professionals])
```
> "`useMemo` memoiza o resultado. Sem ele, toda vez que qualquer estado do componente muda, a filtragem rodaria novamente — mesmo que os filtros não tenham mudado. O array `professionals` é incluído nas dependências porque quando um psicólogo cadastrado é adicionado, a lista precisa ser reprocessada."

### Os 4 estados da tela:
```jsx
{loading    ? <Spinner />   :
 error      ? <ErrorState /> :
 filtered.length === 0 ? <EmptyState /> :
 <Lista />}
```

---

## 9. GESTOS DE SWIPE — `ProfessionalCard.jsx`

```jsx
// 1. Início do toque → salva posição X
handleTouchStart: touchStartX.current = e.touches[0].clientX

// 2. Movimento → calcula offset, move o card visualmente
handleTouchMove: offset = currentX - startX  →  setSwipeOffset(clampedOffset)

// 3. Fim → decide ação baseada no threshold
handleTouchEnd:
  if (offset > 80 && !isFav)  → favoritar
  if (offset < -80 && isFav)  → desfavoritar
  setSwipeOffset(0)  → anima de volta

// CSS — o card se move com o dedo
style={{ transform: `translateX(${swipeOffset}px)`, transition: swipeOffset === 0 ? 'all 0.3s' : 'none' }}
```
> "Usamos `useRef` para `touchStartX` e `touchCurrentX` porque **não queremos re-render** a cada pixel movido — refs atualizam sem causar renderização. O `useState` só entra para o `swipeOffset` final que muda o CSS."

> **Por que threshold de 80px?**
> "80px é distância suficiente para ser intencional mas não exige um gesto longo. Testamos empiricamente — abaixo de 80px o usuário normalmente está rolando a tela, não swipando o card."

---

## 10. CÂMERA — `CameraCapture.jsx`

```jsx
<input
  type="file"
  accept="image/*"
  capture="user"    // ← abre câmera frontal no mobile
  ref={inputRef}
  style={{ display: 'none' }}
  onChange={handleFileChange}
/>
```

### Por que `capture="user"` e não `getUserMedia`?
> "A API `getUserMedia` exige HTTPS, permissões explícitas e tratamento complexo de streams — iOS Safari historicamente tinha bugs. O `<input capture>` é HTML5 nativo, funciona em qualquer navegador moderno sem permissões extras, abre câmera no mobile e seletor de arquivo no desktop. Simples e compatível."

### Fluxo da foto:
```
Clique "Abrir Câmera"
  → inputRef.current.click()      // dispara o input hidden
  → Usuário tira foto / escolhe arquivo
  → onChange: FileReader.readAsDataURL(file)  // converte para base64
  → onload: setPreview(result)    // mostra preview
  → Confirmar → updatePhoto(base64) → salvo no localStorage + estado React
```

### Validações:
```js
if (file.size > 5 * 1024 * 1024) // máx 5MB
if (!file.type.startsWith('image/')) // só imagens
```

---

## 11. ANÚNCIO DO PSICÓLOGO — `CreateListingModal.jsx`

### Fluxo completo de publicação:
```
Conta criada (cadastro)
      ↓
/profile → botão "📢 Criar Anúncio" (visível só para psicólogos)
      ↓
CreateListingModal → formulário com todos os campos profissionais
      ↓
buildProfessionalFromListing(user, listing) → monta objeto no formato do JSON
      ↓
saveRegisteredProfessional(professional) → localStorage
      ↓
Botão vira "✏️ Editar Anúncio" (verde)
      ↓
SearchPage faz merge → psicólogo aparece na busca
```

### Campos do formulário:
| Campo | Origem | Onde aparece |
|---|---|---|
| Nome | Conta do usuário (read-only) | Card + Perfil |
| Especialidades | Input livre + tags | Card + Perfil |
| Localização curta | Cidade-UF do cadastro (editável) | Card |
| Valor por sessão | Digitado | Card + Perfil |
| Bio | Digitado | Perfil |
| Experiência | Digitado | Perfil |
| Abordagem | Digitado | Perfil |
| Modalidade | Checkboxes: Presencial/Online | Card + Perfil |

### Por que localização curta no card mas endereço completo no perfil?
> "Os cards da busca mostram só 'Cidade - UF' para não poluir a lista. O endereço completo (rua, número, cidade, estado) fica na página de perfil do profissional, onde o paciente já decidiu ver mais detalhes."

### `buildProfessionalFromListing` — slug como ID:
```js
const slug = name.toLowerCase()
  .normalize('NFD')               // decompõe acentos
  .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
// "Dr. João Silva" → "dr-joao-silva"
```
> "Geramos um slug URL-safe do nome para usar como ID e na rota `/professionals/dr-joao-silva`. Normalizar NFD + remover diacríticos é a forma correta de lidar com acentos no JS sem bibliotecas."

### Edição de anúncio existente:
```js
const existing = findProfessionalByUserId(user.id)
// initialState = existing ?? defaults
```
> "O `userId` no objeto profissional vincula o anúncio à conta. `findProfessionalByUserId` busca no localStorage pelo `userId`, não pelo slug — isso garante que o psicólogo encontre seu próprio anúncio mesmo que outro tenha o mesmo nome."

---

## 12. PERSISTÊNCIA DE DADOS — `data/`

### Design pattern: módulos de storage isolados

Cada domínio tem seu próprio módulo com chave versionada:

| Arquivo | Chave no localStorage | O que armazena |
|---|---|---|
| `appointmentsStorage.js` | `mindcare.appointments.v1` | Array de agendamentos |
| `favoritesStorage.js` | `mindcare.favorites.v1` | Array de IDs favoritos |
| `registeredProfessionalsStorage.js` | `mindcare.registered_professionals.v1` | Array de profissionais cadastrados |

> "O versionamento na chave (`v1`) permite migrar o schema de dados futuramente sem quebrar dados existentes dos usuários. Se o formato mudar, incrementamos para `v2` e tratamos a migração."

### `favoritesStorage.js` — padrão de toggle:
```js
export function toggleFavorite(id) {
  if (isFavorite(id)) return removeFavorite(id)
  return addFavorite(id)
}
```
> "Funções pequenas e compostas. `toggleFavorite` não duplica lógica — chama `isFavorite`, `removeFavorite` e `addFavorite`. Cada função faz uma coisa só."

### `professionals.json` — simula uma API REST:
```js
await fetch('/professionals.json')  // /professionals.json → pública em /public
```
> "O arquivo está na pasta `public/` do Vite, que serve arquivos estáticos diretamente. O `fetch('/professionals.json')` é idêntico a `fetch('https://api.mindcare.com/professionals')` — a lógica de consumo não muda ao trocar para uma API real."

---

## 13. TESTES AUTOMATIZADOS — `vitest` + `@testing-library/react`

### Configuração (`vitest.config.js`):
```js
test: {
  globals: true,          // vi, describe, it sem importar
  environment: 'jsdom',   // DOM simulado no Node.js
  setupFiles: './src/test/setup.js'
}
```

### Setup (`src/test/setup.js`):
```js
import '@testing-library/jest-dom'  // toBeInTheDocument(), toHaveTextContent()...
afterEach(() => cleanup())          // limpa DOM entre cada teste
```

### Filosofia: testar comportamento, não implementação
```jsx
// ✅ BOM — testa o que o usuário vê
expect(screen.getByText('Dr. Teste Silva')).toBeInTheDocument()

// ❌ RUIM — testa detalhe de implementação
expect(component.state.name).toBe('Dr. Teste Silva')
```

### Mock do `fetch` nos testes:
```jsx
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ professionals: mockData })
  })
})
afterEach(() => vi.restoreAllMocks())
```
> "O `vi.fn()` substitui o `fetch` real por uma função controlada. Assim testamos o comportamento do componente sem depender de rede ou do arquivo JSON real. O `mockResolvedValue` retorna uma Promise resolvida — simula o async/await do fetch."

### O que está coberto:
- ✅ `ProfessionalCard.test.jsx` — renderização, swipe feedback, favoritar
- ✅ `SearchPage.test.jsx` — carregamento, filtros, estados de loading/error/empty

### Rodar os testes:
```bash
npm test               # modo watch
npm run test:coverage  # relatório de cobertura
```

---

## 14. DESIGN SYSTEM — CSS com variáveis customizadas

```css
:root {
  --primary: #5E81AC;       /* Azul principal */
  --secondary: #81A1C1;     /* Azul secundário */
  --success: #A3BE8C;       /* Verde */
  --error: #BF616A;         /* Vermelho */
  --text: #2E3440;          /* Texto principal */
  --surface: #FFFFFF;       /* Fundo de cards */
  --border: #E5E9F0;        /* Bordas */
  --radius-full: 999px;     /* Bordas pill */
}
```

> "Criamos um design system próprio com variáveis CSS. Isso permite mudar toda a paleta de cor em um lugar só. O padrão Nord de cores foi escolhido por ser acessível e profissional."

### Sistema de botões:
```css
.btn { /* base: border-radius full, padding, transition */ }
.btn-primary   { background: var(--primary) }
.btn-secondary { background: var(--secondary) }
.btn-danger    { background: var(--error-bg); color: var(--error) }
```
> "Qualquer botão no app começa com a classe `.btn` e adiciona um modificador. Isso garante consistência visual e reduz CSS duplicado."

---

## 15. CONCEITOS REACT — REFERÊNCIA RÁPIDA

| Hook/Conceito | Onde usamos | Explicação em 1 frase |
|---|---|---|
| `useState` | Em quase tudo | Variável reativa — quando muda, o componente re-renderiza |
| `useEffect` | SearchPage, AuthContext | Efeito colateral: roda código após render (fetch, localStorage) |
| `useMemo` | SearchPage, App | Memoiza resultado de cálculo pesado; recalcula só quando dependências mudam |
| `useRef` | ProfessionalCard, CameraCapture | Referência mutável que NÃO causa re-render (posição do toque, input hidden) |
| `useContext` | useAuth | Acessa o contexto global sem passar props |
| `Context API` | AuthContext | "Loja global" de dados acessível por qualquer componente |
| `createPortal` | LoginModal, RegisterModal, CreateListingModal | Renderiza fora da hierarquia DOM normal |
| `<Outlet>` | AppShell, PrivateRoute | Slot onde React Router injeta a rota filha |
| `<Navigate>` | PrivateRoute | Redirecionamento programático |
| `useParams` | ProfessionalPage | Lê parâmetros da URL (`:id`) |

---

## 16. DIVISÃO DA EQUIPE

| Membro | Responsabilidades principais |
|---|---|
| **Brice** | Fetch de dados, JSON, testes, arquitetura geral |
| **Karina** | Navegação (rotas, Header, BottomNav), favoritos, agendamentos |
| **Sâmela** | Swipe gestures, câmera, documentação |

*Funcionalidades de autenticação (Login, Registro, Anúncio do Psicólogo) foram desenvolvidas em conjunto.*

---

## 17. PERGUNTAS DIFÍCEIS — RESPOSTAS PRONTAS

**"Por que não usaram Firebase ou um backend real?"**
> "O foco do projeto é front-end React. O `localStorage` simula persistência sem overhead de infraestrutura. A migração para um backend real seria trocar apenas as funções da pasta `data/` por chamadas HTTP — o restante da aplicação não muda."

**"O app é seguro? Qualquer um pode logar com qualquer email?"**
> "Propositalmente, para demonstração. Em produção, usaríamos JWT, hash de senha (bcrypt) e HTTPS. O Context API, proteção de rotas e separação de tipo de usuário são idênticos ao padrão de produção — só a validação das credenciais seria real."

**"Por que a senha não é validada no login?"**
> "No login fake, qualquer senha com 6+ chars funciona. O objetivo é demonstrar o fluxo de autenticação, não implementar segurança real. Registrar uma conta exige os campos corretos e validações reais de formato."

**"Como funciona o `useMemo` nos filtros? Por que não usar `useEffect`?"**
> "`useMemo` é síncrono e retorna um valor derivado diretamente — ideal para filtragem. `useEffect` é para efeitos colaterais (fetch, timers). Filtrar um array é um cálculo puro, não um efeito colateral. Usar `useEffect` para filtrar exigiria um estado extra e causaria um render adicional desnecessário."

**"Por que `useRef` para o swipe e não `useState`?"**
> "`useState` causa re-render a cada atualização. Durante o swipe, atualizamos a posição dezenas de vezes por segundo — `useState` causaria 60 re-renders/segundo só para calcular o offset. `useRef` atualiza sem re-render; o único `useState` que fica é o `swipeOffset` final que de fato muda o CSS."

**"Como vocês garantem que não há duplicatas na busca?"**
> "Usamos `Set` de IDs do JSON: `const jsonIds = new Set(fromJson.map(p => p.id))`. Lookup em Set é O(1) — mais eficiente que `Array.find`. Só adicionamos do localStorage se o ID não existir no Set."

**"O que acontece se o localStorage estiver cheio ou indisponível (modo privado)?"**
> "Todos os nossos módulos de storage têm try/catch. Se falhar, o `loadX()` retorna array vazio e o `saveX()` simplesmente ignora o erro. O app continua funcionando, sem os dados persistidos."

**"Por que criar o anúncio separado do cadastro?"**
> "Separação de responsabilidades. O cadastro cria a identidade (conta). O anúncio é uma publicação profissional com dados detalhados — especialidades, preço, bio. Um psicólogo pode existir sem anúncio publicado, pode editar o anúncio depois, pode ter uma conta sem aparecer na busca."

**"Como o psicólogo aparece na busca?"**
> "A `SearchPage` faz merge de duas fontes: o `professionals.json` (dados mockados) e o `registeredProfessionalsStorage` (localStorage). O `buildProfessionalFromListing` constrói um objeto no mesmo schema do JSON, então o `ProfessionalCard` os trata de forma idêntica."

**"O `createPortal` é necessário? Por que não usar só CSS?"**
> "CSS sozinho não resolve todos os casos. Se um componente pai tiver `overflow: hidden` ou `transform`, o modal poderia ser cortado ou ter z-index incorreto mesmo com `position: fixed`. O `createPortal` garante que o modal está no `<body>`, completamente fora de qualquer contexto de empilhamento CSS."

---

## 18. ROTEIRO SUGERIDO DE DEMONSTRAÇÃO

```
1.  npm run dev                  → abrir no navegador
2.  Mostrar busca                → filtrar por especialidade, preço, localização
3.  Clicar "Ver perfil"          → mostrar página detalhada de um psicólogo mockado
4.  Criar conta como PACIENTE    → mostrar máscara de telefone, validações
5.  Tentar acessar /favorites    → redireciona para home (PrivateRoute funcionando)
6.  Fazer login como paciente    → rotas privadas liberadas
7.  Swipe em um card             → favoritar com gesto (celular) ou botão (desktop)
8.  Ver Favoritos                → lista com os favoritados
9.  Agendar consulta             → NewAppointmentPage → aparece em /appointments
10. Cancelar agendamento         → status muda para cancelado
11. Foto de perfil               → abrir câmera / upload
12. Logout → criar conta PSICÓLOGO → preencher CRP, endereço, cidade, estado
13. Perfil do psicólogo          → botão "📢 Criar Anúncio"
14. Preencher formulário         → publicar
15. Ir para busca                → novo psicólogo aparece na lista
16. Clicar "Ver perfil" dele     → endereço completo na página de perfil
17. npm test                     → mostrar testes passando
```

---

## 19. COMANDOS ÚTEIS

```bash
npm run dev         # Inicia servidor de desenvolvimento (localhost:5173)
npm run build       # Build de produção (pasta dist/)
npm run preview     # Preview do build de produção
npm test            # Roda testes em modo watch
npm run test:ui     # Interface visual dos testes (Vitest UI)
npm run lint        # Verifica problemas de código (ESLint)
```

