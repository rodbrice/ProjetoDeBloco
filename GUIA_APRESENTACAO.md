# 🎤 Guia de Apresentação — MindCare

> Use este documento como cola para a apresentação de hoje. Está organizado na ordem lógica de explicação.

---

## 1. O QUE É O MINDCARE (30 segundos)

**Frase pronta:** "O MindCare é uma plataforma web mobile-first que conecta pacientes a psicólogos. O paciente busca profissionais, favorita, agenda consultas. O psicólogo entra e vê as consultas marcadas com ele."

---

## 2. TECNOLOGIAS — O QUE USAMOS E POR QUÊ

| Tecnologia | Para quê | Por que essa? |
|---|---|---|
| **React 19** | Construir a interface (componentes) | É o framework mais usado do mercado, a faculdade pediu |
| **React Router 7** | Navegação entre páginas (SPA) | Biblioteca padrão para rotas no React |
| **Vite** | Servidor de desenvolvimento e build | Muito mais rápido que Create React App, é o padrão atual |
| **Vitest** | Testes unitários | Integra nativamente com Vite, mesma config |
| **React Testing Library** | Testar componentes React | Testa como o USUÁRIO vê, não a implementação interna |
| **localStorage** | Persistir dados no navegador | Simples, não precisa de backend/banco de dados |
| **Fetch API** | Carregar dados do JSON | API nativa do navegador, não precisa instalar nada |
| **CSS puro** | Estilização | Sem dependência extra, mais fácil de entender |

**Frase pronta:** "Escolhemos ferramentas modernas mas simples. React + Vite é o stack padrão hoje. Não usamos backend — todos os dados ficam no localStorage do navegador e num arquivo JSON estático."

---

## 3. ESTRUTURA DO PROJETO — PASTA POR PASTA

```
src/
├── main.jsx              → Ponto de entrada, monta o React no HTML
├── App.jsx               → Componente raiz, gerencia agendamentos
├── components/           → Componentes reutilizáveis (peças da interface)
├── pages/                → Páginas completas (cada rota = 1 página)
├── routes/               → Configuração de rotas (quem acessa o quê)
├── context/              → Estado global (autenticação do usuário)
├── hooks/                → Hooks customizados (useAuth)
├── data/                 → Funções de persistência (localStorage)
├── styles/               → Arquivos CSS
└── test/                 → Configuração dos testes
```

**Frase pronta:** "Separamos em pastas por responsabilidade: components são peças reutilizáveis, pages são telas inteiras, context é o estado global, data é a camada de dados."

---

## 4. FLUXO DE INICIALIZAÇÃO (como o app começa)

```
index.html
  └── <div id="root">        ← React monta tudo aqui dentro
        └── main.jsx
              └── <BrowserRouter>    ← Habilita navegação por rotas
                    └── <App>
                          └── <AuthProvider>    ← Provê estado de login para todo app
                                └── <AppRoutes> ← Define todas as rotas/páginas
```

### `main.jsx` — Ponto de entrada
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>        // Ativa avisos do React em desenvolvimento
    <BrowserRouter>   // Habilita o React Router (navegação SPA)
      <App />
    </BrowserRouter>
  </StrictMode>
)
```
**O que explicar:** "O `createRoot` é a forma do React 18+ de montar a aplicação. O `BrowserRouter` permite que mudemos de página sem recarregar. O `StrictMode` ajuda a pegar erros durante desenvolvimento."

---

## 5. SISTEMA DE ROTAS — `AppRoutes.jsx`

```
/                       → SearchPage (busca de profissionais) — PÚBLICA
/professionals/:id      → ProfessionalPage (detalhe) — PÚBLICA  
/about                  → AboutPage — PÚBLICA
/profile                → ProfilePage — PRIVADA (precisa login)
/favorites              → FavoritesPage — PRIVADA
/appointments           → AppointmentsPage OU PsychologistAppointmentsPage — PRIVADA
/appointments/new       → NewAppointmentPage — PRIVADA
*                       → NotFoundPage (404)
```

**Conceito chave — Layout Compartilhado:**
```jsx
<Route element={<AppShell />}>    // AppShell = Header + Outlet + BottomNav
  <Route index element={...} />   // Essas páginas aparecem DENTRO do AppShell
</Route>
```
O `<Outlet />` dentro do AppShell é onde a página atual é renderizada. Header e BottomNav ficam fixos.

**Conceito chave — Rotas Privadas:**
```jsx
<Route element={<PrivateRoute />}>
  <Route path="/profile" ... />   // Só acessa se estiver logado
</Route>
```
O `PrivateRoute` checa se o `user` existe. Se não → redireciona para home.

**Conceito chave — Rotas condicionais (psicólogo vs paciente):**
```jsx
user?.userType === 'psychologist' 
  ? <PsychologistAppointmentsPage />   // Vê consultas dos pacientes dele
  : <AppointmentsPage />               // Vê suas próprias consultas
```

---

## 6. AUTENTICAÇÃO — `AuthContext.jsx` + `useAuth.js`

### Como funciona (NÃO é Firebase, é fake/local):

```
Usuário digita email + senha
        ↓
login() cria um objeto fake com os dados
        ↓
Salva no estado do React (useState) E no localStorage
        ↓
Toda a aplicação reage (Context API)
        ↓
Ao reabrir o site, useEffect lê o localStorage e restaura a sessão
```

### O que é Context API?
**Frase pronta:** "O Context API é um recurso do React que permite compartilhar dados entre componentes sem precisar passar props manualmente de pai para filho. Criamos um 'contexto de autenticação' que qualquer componente pode acessar."

### Fluxo técnico:
1. `AuthProvider` envolve TODA a aplicação (no `App.jsx`)
2. Dentro dele, temos o `useState(null)` que guarda o usuário
3. As funções `login()`, `logout()`, `updatePhoto()` alteram esse estado
4. Qualquer componente chama `useAuth()` para acessar o `user`

### Regra de tipo de conta:
```js
const userType = email.includes('psi') ? 'psychologist' : 'patient'
```
- `psi@email.com` → psicólogo
- `maria@email.com` → paciente

**Por que fake?** "É uma demonstração acadêmica. Em produção usaríamos Firebase Auth ou similar. O conceito de Context API e proteção de rotas é o mesmo."

---

## 7. COMPONENTE LOGIN MODAL — `LoginModal.jsx`

**Conceito chave — createPortal:**
```jsx
return createPortal(
  <div>...conteúdo do modal...</div>,
  document.body    // Renderiza FORA da árvore React normal
)
```
**Frase pronta:** "O `createPortal` é um recurso do React que renderiza um componente fora da hierarquia normal do DOM. Usamos isso para o modal aparecer por CIMA de tudo, fixo na tela, sem ser afetado pelo CSS dos componentes pai."

**Outros pontos:**
- Validação de formulário (email obrigatório, senha mínimo 6 chars)
- Simula delay de rede com `setTimeout(500ms)` para mostrar estado de loading
- Fecha ao clicar fora (overlay) ou no botão ✕

---

## 8. BUSCA DE PROFISSIONAIS — `SearchPage.jsx`

### Fetch API — Carregamento de dados:
```jsx
useEffect(() => {
  async function loadProfessionals() {
    const response = await fetch('/professionals.json')  // Busca o JSON
    const data = await response.json()                   // Converte para objeto JS
    setProfessionals(data.professionals)                 // Salva no estado
  }
  loadProfessionals()
}, [])   // [] = roda só 1 vez quando o componente monta
```

**Frase pronta:** "Usamos a Fetch API nativa do navegador para carregar os dados de um arquivo JSON. O `useEffect` com array vazio significa que essa busca roda apenas uma vez quando a página carrega."

### Filtros com useMemo:
```jsx
const filtered = useMemo(() => {
  return professionals.filter(p => {
    // Filtra por nome/especialidade, localização e preço
  })
}, [query, location, maxPrice, professionals])
```

**Frase pronta:** "O `useMemo` memoriza o resultado da filtragem e só recalcula quando os filtros mudam. Isso evita reprocessar a lista toda vez que qualquer coisa re-renderiza."

### Estados de loading/error/empty:
```jsx
{loading ? <Loading /> : error ? <Error /> : filtered.length === 0 ? <Empty /> : <Lista />}
```
"Tratamos os 4 estados possíveis: carregando, erro, vazio, e com resultados."

---

## 9. GESTOS MOBILE (SWIPE) — `ProfessionalCard.jsx`

```jsx
onTouchStart → guarda posição X inicial do dedo
onTouchMove  → calcula diferença (offset) e move o card visualmente
onTouchEnd   → se arrastou >80px para direita = favoritar
               se arrastou >80px para esquerda = desfavoritar
               reseta posição do card
```

**Frase pronta:** "Implementamos gestos de swipe usando os eventos nativos de toque do navegador (Touch Events). Arrastar para a direita favorita o profissional, para a esquerda remove. Também tem o botão de estrela como alternativa para desktop."

**Detalhe visual:**
```jsx
style={{ transform: `translateX(${swipeOffset}px)` }}
```
"O card se move fisicamente seguindo o dedo do usuário com CSS transform."

---

## 10. CÂMERA — `CameraCapture.jsx`

```jsx
<input type="file" accept="image/*" capture="user" />
```

**Frase pronta:** "Usamos o input nativo de HTML5 com o atributo `capture='user'`. Esse atributo faz o celular abrir a câmera frontal automaticamente no iOS e Android. No desktop, abre o seletor de arquivo normal. É a forma mais simples e compatível de acessar a câmera."

### Fluxo:
1. Usuário clica "Abrir Câmera"
2. Input hidden é ativado via `inputRef.current.click()`
3. Celular abre câmera / Desktop abre seletor
4. Foto é lida como base64 via `FileReader`
5. Mostra preview para confirmar
6. Se confirmar → `updatePhoto()` salva no localStorage

**Diferença iOS vs Android:** "O atributo `capture` abre a câmera em ambos os sistemas. A validação de tamanho (max 5MB) e tipo (só imagens) garante compatibilidade."

---

## 11. PERSISTÊNCIA DE DADOS — `data/`

### `appointmentsStorage.js` — Agendamentos
```js
loadAppointments()  → JSON.parse(localStorage.getItem(key))
saveAppointments()  → localStorage.setItem(key, JSON.stringify(data))
```

### `favoritesStorage.js` — Favoritos
```js
loadFavorites()     → Carrega array de IDs
addFavorite(id)     → Adiciona ID ao array
removeFavorite(id)  → Filtra o ID fora do array
toggleFavorite(id)  → Se tem, remove. Se não tem, adiciona.
isFavorite(id)      → Retorna true/false
```

### `mockPsychologistAppointments.js` — Consultas do psicólogo
```js
// Objeto com chave = ID do profissional, valor = array de consultas
{ 'ana-souza': [{patientName: 'Maria', date: '...', status: 'scheduled'}] }
```

### `professionals.json` (pasta public/) — Dados dos profissionais
"É um JSON estático que simula uma API. O `fetch('/professionals.json')` carrega ele como se fosse um endpoint de API real."

**Frase pronta sobre os dois arquivos:** "O `professionals.json` na pasta public é acessado via fetch, simulando uma API REST. Os dados de mock em JS são importados diretamente no código. Na prática, ambos seriam substituídos por um backend real."

---

## 12. TESTES — COMO E POR QUÊ

### Setup (`vitest.config.js`):
```js
test: {
  globals: true,           // vi, describe, it disponíveis globalmente
  environment: 'jsdom',    // Simula um navegador no Node.js
  setupFiles: './src/test/setup.js'  // Roda antes de cada teste
}
```

### Setup file (`setup.js`):
```js
import '@testing-library/jest-dom'  // Adiciona matchers como toBeInTheDocument()
afterEach(() => cleanup())          // Limpa DOM entre testes
```

### Exemplo de teste — `ProfessionalCard.test.jsx`:
```jsx
it('deve renderizar o nome do profissional', () => {
  render(<ProfessionalCard professional={mockProfessional} />)
  expect(screen.getByText('Dr. Teste Silva')).toBeInTheDocument()
})
```

**Frase pronta:** "Usamos Vitest como framework de teste e React Testing Library para renderizar componentes. A filosofia é testar o que o USUÁRIO vê — por exemplo, verificamos se o nome aparece na tela, não se o estado interno mudou."

### O que testamos:
- ✅ Renderização de componentes (nome, preço, localização aparecem?)
- ✅ Fetch de dados (mock do fetch para simular resposta da API)
- ✅ Filtros de busca (digitar "ansiedade" filtra corretamente?)
- ✅ Interação do usuário (clicar em "limpar filtros" funciona?)
- ✅ Estados de erro (o que aparece quando a API falha?)

### Como o mock de fetch funciona:
```jsx
global.fetch = vi.fn()                          // Substitui o fetch real por um fake
fetch.mockResolvedValue({                        // Define o que o fake retorna
  ok: true,
  json: async () => mockProfessionals
})
```
**Frase pronta:** "O `vi.fn()` cria uma função mock — um fake. Substituímos o `fetch` real para controlar a resposta. Assim podemos testar o comportamento com dados bons, com erro, ou com loading."

### Comandos:
```bash
npm test              # Roda os testes
npm run test:coverage # Vê cobertura de código
```

---

## 13. CONCEITOS REACT USADOS (para perguntas)

| Conceito | Onde usamos | Explicação simples |
|---|---|---|
| **useState** | Em quase tudo | "Cria uma variável reativa. Quando muda, o componente re-renderiza." |
| **useEffect** | SearchPage, AuthContext | "Executa código quando o componente monta ou quando algo muda. Usamos para carregar dados." |
| **useMemo** | SearchPage, App | "Memoriza um cálculo pesado e só refaz quando as dependências mudam." |
| **useRef** | CameraCapture, ProfessionalCard | "Referência direta a um elemento DOM. Usamos para acessar o input de arquivo." |
| **useContext** | useAuth | "Acessa dados compartilhados globalmente sem passar props." |
| **Context API** | AuthContext | "Cria um 'depósito global' de dados que qualquer componente acessa." |
| **createPortal** | LoginModal | "Renderiza um componente fora da árvore DOM normal, por cima de tudo." |
| **Props** | ProfessionalCard, etc | "Dados passados de pai para filho. Ex: `<Card professional={p} />`" |
| **Outlet** | AppShell | "Marca onde o React Router renderiza a rota filha. É o 'buraco' do layout." |

---

## 14. DIVISÃO DA EQUIPE

| Membro | Responsabilidades |
|---|---|
| **Brice** | Dados dinâmicos (fetch, JSON), testes, coordenação |
| **Karina** | Navegação (rotas, header, bottom nav), favoritos |
| **Sâmela** | Gestos mobile (swipe), documentação, câmera |

---

## 15. PERGUNTAS QUE PODEM SURGIR (e respostas prontas)

**"Por que não usaram Firebase/backend real?"**
→ "Para manter simples e focar nos conceitos de front-end. O localStorage simula persistência. A migração para um backend real seria trocar as funções do `data/` por chamadas HTTP."

**"Como funciona a autenticação?"**
→ "É fake. O `login()` cria um objeto com os dados do email e salva no localStorage. O Context API distribui esse dado para toda a aplicação. O conceito de Context + proteção de rotas é idêntico ao de uma autenticação real."

**"Como funciona o swipe?"**
→ "Usamos Touch Events nativos: onTouchStart, onTouchMove, onTouchEnd. Calculamos a distância do arraste e se passar de 80px, ativa a ação. O card se move visualmente com CSS transform."

**"Como funciona a câmera?"**
→ "Usamos `<input capture='user'>` que é HTML5 puro. Em celular, abre a câmera. A foto é lida como base64 com FileReader e salva no localStorage."

**"Por que Vite e não Create React App?"**
→ "O Create React App foi descontinuado. O Vite é o recomendado oficial do React agora. É mais rápido no desenvolvimento e no build."

**"O que são os testes?"**
→ "Código que verifica automaticamente se os componentes funcionam. Renderizamos o componente, simulamos o que o usuário faria, e verificamos se a tela mostra o esperado."

---

## ROTEIRO SUGERIDO PARA APRESENTAÇÃO

1. **Abrir o app rodando** (`npm run dev`) — mostrar a busca, filtros
2. **Fazer login** como paciente → mostrar rotas privadas aparecendo
3. **Favoritar** um profissional (swipe no celular / botão no desktop)
4. **Agendar consulta** → mostrar na lista de agendamentos
5. **Tirar foto de perfil** → mostrar câmera/upload
6. **Logout e login como psicólogo** (email com "psi") → mostrar tela diferente
7. **Rodar os testes** (`npm test`) → mostrar que todos passam
8. **Mostrar código** brevemente — AppRoutes, AuthContext, SearchPage

