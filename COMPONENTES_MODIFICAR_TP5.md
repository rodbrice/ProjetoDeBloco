# 🔧 COMPONENTES A MODIFICAR - TP5

**Projeto:** MindCare  
**Data:** 31/03/2026  
**Objetivo:** Listar todos os componentes que precisam ser criados ou modificados para implementar as novas funcionalidades

---

## 📊 VISÃO GERAL

### Estatísticas
- **Componentes Novos:** 15
- **Componentes Modificados:** 8
- **Páginas Novas:** 6
- **Utilitários Novos:** 4
- **Testes Novos:** 10

**Total de arquivos:** ~43 arquivos

---

## 🆕 COMPONENTES NOVOS

### 1. Autenticação

#### `src/context/AuthContext.jsx` 🆕
**Tipo:** Context Provider  
**Responsabilidade:** Gerenciar estado global de autenticação  
**Estimativa:** 3h

**Funcionalidades:**
- Expor estado do usuário atual
- Funções de login/logout/register
- Persistência de sessão
- Loading state durante auth

**API:**
```jsx
const { user, loading, login, logout, register, updateProfile } = useAuth()
```

**Dependências:**
- Firebase Authentication
- React Context API

---

#### `src/hooks/useAuth.js` 🆕
**Tipo:** Custom Hook  
**Responsabilidade:** Hook para acessar AuthContext  
**Estimativa:** 0.5h

**Uso:**
```jsx
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { user, logout } = useAuth()
  // ...
}
```

---

#### `src/components/PrivateRoute.jsx` 🆕
**Tipo:** Route Guard  
**Responsabilidade:** Proteger rotas que requerem autenticação  
**Estimativa:** 1h

**Uso:**
```jsx
<Route element={<PrivateRoute />}>
  <Route path="/appointments" element={<AppointmentsPage />} />
</Route>
```

**Comportamento:**
- Se não autenticado → Redireciona para `/login`
- Se autenticado → Renderiza componente

---

#### `src/components/PatientRoute.jsx` 🆕
**Tipo:** Role-based Route Guard  
**Responsabilidade:** Proteger rotas exclusivas de pacientes  
**Estimativa:** 0.5h

**Verifica:** `user.userType === 'patient'`

---

#### `src/components/PsychologistRoute.jsx` 🆕
**Tipo:** Role-based Route Guard  
**Responsabilidade:** Proteger rotas exclusivas de psicólogos  
**Estimativa:** 0.5h

**Verifica:** `user.userType === 'psychologist'`

---

### 2. Páginas de Autenticação

#### `src/pages/LoginPage.jsx` 🆕
**Tipo:** Página  
**Responsabilidade:** Formulário de login  
**Estimativa:** 2h

**Campos:**
- Email (validação)
- Senha (mínimo 6 caracteres)
- Checkbox "Lembrar-me"
- Link "Esqueci senha"
- Link "Criar conta"
- Botão "Entrar com Google"

**Estados:**
- Loading durante login
- Mensagens de erro (credenciais inválidas, etc)

---

#### `src/pages/RegisterPage.jsx` 🆕
**Tipo:** Página  
**Responsabilidade:** Formulário de registro  
**Estimativa:** 3h

**Campos:**
- Nome completo
- Email
- Senha
- Confirmar senha
- Seletor de tipo: "Paciente" ou "Psicólogo"
- Checkbox "Aceito os termos"

**Fluxo:**
1. Usuário preenche formulário
2. Valida dados
3. Cria conta no Firebase Auth
4. Cria documento no Firestore (`users/{uid}`)
5. Se psicólogo → Redireciona para upload de documentos
6. Se paciente → Redireciona para dashboard

---

#### `src/pages/ForgotPasswordPage.jsx` 🆕
**Tipo:** Página  
**Responsabilidade:** Recuperação de senha  
**Estimativa:** 1h

**Campo:**
- Email

**Fluxo:**
1. Usuário digita email
2. Envia email de recuperação via Firebase
3. Mostra mensagem de sucesso
4. Email contém link para resetar senha

---

#### `src/pages/ProfilePage.jsx` 🆕
**Tipo:** Página  
**Responsabilidade:** Perfil do usuário logado  
**Estimativa:** 4h

**Seções:**
- **Header:** Foto de perfil, nome, tipo de conta
- **Dados Pessoais:** Nome, email, telefone (editáveis)
- **Foto:** Botão "Alterar foto" → Abre CameraCapture
- **Segurança:** Botão "Alterar senha"
- **Logout:** Botão vermelho "Sair da conta"

**Dados Específicos:**
- **Paciente:** Preferências de terapia, histórico
- **Psicólogo:** CRP, especialidades, preço, bio, documentos

---

#### `src/pages/PatientDashboard.jsx` 🆕
**Tipo:** Página  
**Responsabilidade:** Dashboard do paciente  
**Estimativa:** 3h

**Seções:**
- **Próximas Consultas:** Lista de agendamentos futuros
- **Psicólogos Favoritos:** Cards dos favoritos
- **Atalhos Rápidos:** Buscar profissionais, Nova consulta
- **Estatísticas:** Total de consultas, próxima consulta

---

#### `src/pages/PsychologistDashboard.jsx` 🆕
**Tipo:** Página  
**Responsabilidade:** Dashboard do psicólogo  
**Estimativa:** 3h

**Seções:**
- **Agenda do Dia:** Consultas de hoje
- **Solicitações Pendentes:** Agendamentos aguardando aprovação
- **Estatísticas:** Total de pacientes, consultas hoje, taxa de aprovação
- **Ações Rápidas:** Ver agenda completa, Gerenciar perfil

---

### 3. Câmera e Upload

#### `src/components/CameraCapture.jsx` 🆕
**Tipo:** Componente  
**Responsabilidade:** Captura de foto via câmera  
**Estimativa:** 5h

**Props:**
```jsx
<CameraCapture
  onCapture={(blob) => handlePhoto(blob)}
  onCancel={() => setShowCamera(false)}
  facingMode="user" // 'user' (frontal) ou 'environment' (traseira)
/>
```

**Funcionalidades:**
- Detecta plataforma (iOS, Android, Desktop)
- Tenta `getUserMedia` primeiro
- Fallback para `<input type="file" capture>` em iOS
- Preview da foto capturada
- Botões: "Tirar foto", "Usar essa foto", "Tirar outra", "Cancelar"
- Redimensiona imagem para 800x800px

**Tecnologias:**
- Navigator.mediaDevices.getUserMedia()
- Canvas API (redimensionamento)
- File API

---

#### `src/components/PhotoUpload.jsx` 🆕
**Tipo:** Componente  
**Responsabilidade:** Upload de foto de perfil  
**Estimativa:** 2h

**Props:**
```jsx
<PhotoUpload
  currentPhoto={user.photoURL}
  onUploadComplete={(url) => updateProfile({ photoURL: url })}
/>
```

**Funcionalidades:**
- Preview da foto atual
- Botão "Tirar nova foto" → Abre CameraCapture
- Botão "Escolher arquivo" → Input file
- Loading durante upload
- Compressão antes de enviar
- Upload para Firebase Storage

---

#### `src/components/DocumentUpload.jsx` 🆕
**Tipo:** Componente  
**Responsabilidade:** Upload de documentos (CRP, RG)  
**Estimativa:** 3h

**Props:**
```jsx
<DocumentUpload
  documentType="crp" // 'crp', 'rg_front', 'rg_back'
  onUploadComplete={(url) => handleDocument(url)}
/>
```

**Funcionalidades:**
- Preview do documento
- Captura via câmera ou arquivo
- Validação de qualidade (tamanho mínimo)
- Upload para Firebase Storage
- Status: "pending", "uploaded", "verified"

---

#### `src/pages/DocumentUploadPage.jsx` 🆕
**Tipo:** Página  
**Responsabilidade:** Página de upload de documentos (psicólogos)  
**Estimativa:** 2h

**Fluxo:**
1. Tela 1: "Precisamos verificar sua identidade"
2. Tela 2: Upload do CRP
3. Tela 3: Upload do RG (frente)
4. Tela 4: Upload do RG (verso)
5. Tela 5: "Documentos enviados! Aguarde aprovação"

**Validações:**
- Todos os documentos obrigatórios
- Formato aceito: JPG, PNG, PDF
- Tamanho máximo: 5MB por arquivo

---

### 4. Utilitários e Helpers

#### `src/utils/cameraUtils.js` 🆕
**Tipo:** Utilitário  
**Responsabilidade:** Detecção de plataforma e capacidades  
**Estimativa:** 2h

**Funções:**
```javascript
export function isCameraSupported()
export function isIOS()
export function isAndroid()
export function isMobile()
export function getCameraConstraints(facingMode)
export function compressImage(file, maxWidth, quality)
```

---

#### `src/utils/imageUtils.js` 🆕
**Tipo:** Utilitário  
**Responsabilidade:** Manipulação de imagens  
**Estimativa:** 1h

**Funções:**
```javascript
export function resizeImage(blob, maxWidth, maxHeight)
export function blobToBase64(blob)
export function base64ToBlob(base64)
export function validateImage(file)
```

---

#### `src/services/firebase.js` 🆕
**Tipo:** Configuração  
**Responsabilidade:** Inicialização do Firebase  
**Estimativa:** 1h

**Exports:**
```javascript
export const auth
export const db
export const storage
export const googleProvider
```

---

#### `src/services/storageService.js` 🆕
**Tipo:** Service  
**Responsabilidade:** Upload/download de arquivos  
**Estimativa:** 2h

**Funções:**
```javascript
export async function uploadProfilePhoto(userId, blob)
export async function uploadDocument(userId, documentType, blob)
export async function getDownloadURL(path)
export async function deleteFile(path)
```

---

## ✏️ COMPONENTES A MODIFICAR

### 1. `src/App.jsx` ✏️
**Mudanças:** Envolver em AuthProvider, adicionar rotas protegidas  
**Estimativa:** 1h

**Antes:**
```jsx
function App() {
  const [appointments, setAppointments] = useState(...)
  return <AppRoutes appointments={appointments} />
}
```

**Depois:**
```jsx
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
```

**Migrações:**
- Estado de appointments → Firestore (via hook)
- Favoritos → Firestore (via hook)

---

### 2. `src/routes/AppRoutes.jsx` ✏️
**Mudanças:** Adicionar rotas de auth, proteger rotas privadas  
**Estimativa:** 2h

**Novas Rotas:**
```jsx
// Públicas
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />

// Privadas (qualquer usuário autenticado)
<Route element={<PrivateRoute />}>
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/favorites" element={<FavoritesPage />} />
</Route>

// Apenas Pacientes
<Route element={<PatientRoute />}>
  <Route path="/patient/dashboard" element={<PatientDashboard />} />
  <Route path="/appointments/new" element={<NewAppointmentPage />} />
</Route>

// Apenas Psicólogos
<Route element={<PsychologistRoute />}>
  <Route path="/psychologist/dashboard" element={<PsychologistDashboard />} />
  <Route path="/psychologist/appointments" element={<AppointmentsPage />} />
  <Route path="/documents/upload" element={<DocumentUploadPage />} />
</Route>
```

---

### 3. `src/components/BottomNav.jsx` ✏️
**Mudanças:** Adaptar itens baseado em autenticação e tipo de usuário  
**Estimativa:** 2h

**Antes:** 4 itens fixos
```jsx
[Buscar, Favoritos, Agenda, Sobre]
```

**Depois:** Dinâmico baseado em auth
```jsx
// Não autenticado
[Buscar, Sobre, Entrar]

// Paciente
[Buscar, Favoritos, Consultas, Perfil]

// Psicólogo
[Buscar, Agenda, Pacientes, Perfil]
```

**Implementação:**
```jsx
function BottomNav() {
  const { user } = useAuth()
  
  if (!user) {
    return <GuestNav />
  }
  
  if (user.userType === 'patient') {
    return <PatientNav />
  }
  
  return <PsychologistNav />
}
```

---

### 4. `src/components/Header.jsx` ✏️
**Mudanças:** Mostrar avatar do usuário, botão de logout  
**Estimativa:** 1h

**Adições:**
- Avatar do usuário (canto direito)
- Dropdown: Perfil, Configurações, Sair
- Badge do tipo de usuário (Paciente/Psicólogo)

---

### 5. `src/pages/SearchPage.jsx` ✏️
**Mudanças:** Limitar resultados para não autenticados  
**Estimativa:** 1h

**Lógica:**
```jsx
const { user } = useAuth()
const displayProfessionals = user 
  ? professionals 
  : professionals.slice(0, 3) // Apenas 3 para guests

{!user && (
  <div className="auth-prompt">
    <p>Faça login para ver todos os profissionais</p>
    <Link to="/login">Entrar</Link>
  </div>
)}
```

---

### 6. `src/pages/ProfessionalPage.jsx` ✏️
**Mudanças:** Ocultar dados de contato para não autenticados  
**Estimativa:** 1h

**Lógica:**
```jsx
{user ? (
  <div className="contact-info">
    <p>Email: {professional.email}</p>
    <p>Telefone: {professional.phone}</p>
  </div>
) : (
  <div className="auth-required">
    <p>Faça login para ver informações de contato</p>
  </div>
)}
```

---

### 7. `src/pages/FavoritesPage.jsx` ✏️
**Mudanças:** Migrar de localStorage para Firestore  
**Estimativa:** 2h

**Antes:**
```jsx
const favorites = loadFavorites() // localStorage
```

**Depois:**
```jsx
const { favorites } = useFavorites() // Firestore real-time
```

**Hook:**
```jsx
function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  
  useEffect(() => {
    if (!user) return
    
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        setFavorites(doc.data()?.favorites || [])
      }
    )
    
    return unsubscribe
  }, [user])
  
  return { favorites, addFavorite, removeFavorite }
}
```

---

### 8. `src/pages/AppointmentsPage.jsx` ✏️
**Mudanças:** Migrar de localStorage para Firestore, adicionar aprovação  
**Estimativa:** 3h

**Antes:**
```jsx
const appointments = loadAppointments() // localStorage
```

**Depois:**
```jsx
const { appointments } = useAppointments() // Firestore real-time

// Psicólogos veem botões de aprovar/rejeitar
{user.userType === 'psychologist' && appointment.status === 'pending' && (
  <div>
    <button onClick={() => approveAppointment(appointment.id)}>Aprovar</button>
    <button onClick={() => rejectAppointment(appointment.id)}>Rejeitar</button>
  </div>
)}
```

---

## 🧪 TESTES NOVOS

### 1. `src/context/AuthContext.test.jsx` 🆕
**Testa:** Login, logout, register, persistência  
**Estimativa:** 2h

### 2. `src/components/PrivateRoute.test.jsx` 🆕
**Testa:** Redirecionamento quando não autenticado  
**Estimativa:** 1h

### 3. `src/components/CameraCapture.test.jsx` 🆕
**Testa:** Detecção de plataforma, fallbacks  
**Estimativa:** 2h

### 4. `src/pages/LoginPage.test.jsx` 🆕
**Testa:** Validações, submissão, erros  
**Estimativa:** 1h

### 5. `src/pages/RegisterPage.test.jsx` 🆕
**Testa:** Validações, seleção de tipo, criação  
**Estimativa:** 1.5h

### 6. `src/hooks/useAuth.test.jsx` 🆕
**Testa:** Hook retorna dados corretos  
**Estimativa:** 1h

### 7. `src/utils/cameraUtils.test.js` 🆕
**Testa:** Detecção de plataforma  
**Estimativa:** 0.5h

### 8. `src/services/storageService.test.js` 🆕
**Testa:** Upload, download (mock Firebase)  
**Estimativa:** 1.5h

### 9. Atualizar `SearchPage.test.jsx` ✏️
**Adiciona:** Testes de limitação para guests  
**Estimativa:** 0.5h

### 10. Atualizar `AppointmentsPage.test.jsx` ✏️
**Adiciona:** Testes de aprovação/rejeição  
**Estimativa:** 1h

---

## 📊 ESTIMATIVA TOTAL POR CATEGORIA

| Categoria | Arquivos | Horas |
|-----------|----------|-------|
| **Autenticação** | 5 | 8h |
| **Páginas Novas** | 6 | 18h |
| **Câmera e Upload** | 4 | 12h |
| **Utilitários** | 4 | 6h |
| **Modificações** | 8 | 13h |
| **Testes** | 10 | 12h |
| **TOTAL** | **37** | **69h** |

**Divisão para 3 pessoas:** ~23h cada (1 semana full-time ou 2-3 semanas part-time)

---

## 🎯 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### Sprint 1 (Semana 1): Fundação
1. ✅ Firebase setup (`firebase.js`)
2. ✅ AuthContext e useAuth
3. ✅ LoginPage e RegisterPage
4. ✅ PrivateRoute, PatientRoute, PsychologistRoute
5. ✅ Atualizar AppRoutes e App.jsx

**Resultado:** Sistema de autenticação funcional

---

### Sprint 2 (Semana 2): Perfis e Dashboards
1. ✅ ProfilePage
2. ✅ PatientDashboard e PsychologistDashboard
3. ✅ Migrar FavoritesPage para Firestore
4. ✅ Migrar AppointmentsPage para Firestore
5. ✅ Atualizar BottomNav e Header

**Resultado:** Perfis diferenciados funcionando

---

### Sprint 3 (Semana 3): Câmera e Upload
1. ✅ cameraUtils.js e imageUtils.js
2. ✅ CameraCapture componente
3. ✅ PhotoUpload componente
4. ✅ storageService.js
5. ✅ Integrar em ProfilePage

**Resultado:** Foto de perfil via câmera funcional

---

### Sprint 4 (Semana 3-4): Documentos e Polish
1. ✅ DocumentUpload componente
2. ✅ DocumentUploadPage
3. ✅ Atualizar SearchPage (limitação guests)
4. ✅ Atualizar ProfessionalPage (ocultar contato)
5. ✅ Testes completos

**Resultado:** Sistema completo e testado

---

## 🔄 DIAGRAMA DE DEPENDÊNCIAS

```
firebase.js
    ↓
AuthContext.jsx
    ↓
├─→ useAuth.js
│   ↓
├─→ PrivateRoute.jsx
│   ├─→ PatientRoute.jsx
│   └─→ PsychologistRoute.jsx
│       ↓
└─→ AppRoutes.jsx
    ↓
    ├─→ LoginPage.jsx
    ├─→ RegisterPage.jsx
    ├─→ ProfilePage.jsx
    │   └─→ PhotoUpload.jsx
    │       └─→ CameraCapture.jsx
    │           └─→ cameraUtils.js
    ├─→ PatientDashboard.jsx
    ├─→ PsychologistDashboard.jsx
    └─→ DocumentUploadPage.jsx
        └─→ DocumentUpload.jsx
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Pessoa 1: Autenticação e Context
- [ ] Configurar Firebase (Authentication + Firestore + Storage)
- [ ] Criar AuthContext.jsx
- [ ] Criar useAuth.js
- [ ] Criar PrivateRoute.jsx, PatientRoute.jsx, PsychologistRoute.jsx
- [ ] Criar LoginPage.jsx
- [ ] Criar RegisterPage.jsx
- [ ] Criar ForgotPasswordPage.jsx
- [ ] Atualizar App.jsx e AppRoutes.jsx
- [ ] Testes de autenticação

### Pessoa 2: Perfis e Migração
- [ ] Criar ProfilePage.jsx
- [ ] Criar PatientDashboard.jsx
- [ ] Criar PsychologistDashboard.jsx
- [ ] Migrar FavoritesPage para Firestore
- [ ] Migrar AppointmentsPage para Firestore
- [ ] Criar hooks useFavorites e useAppointments
- [ ] Atualizar BottomNav.jsx
- [ ] Atualizar Header.jsx
- [ ] Testes de perfis

### Pessoa 3: Câmera e Upload
- [ ] Criar cameraUtils.js
- [ ] Criar imageUtils.js
- [ ] Criar CameraCapture.jsx
- [ ] Criar PhotoUpload.jsx
- [ ] Criar DocumentUpload.jsx
- [ ] Criar DocumentUploadPage.jsx
- [ ] Criar storageService.js
- [ ] Atualizar SearchPage e ProfessionalPage
- [ ] Testes de câmera e upload

---

**Criado em:** 31/03/2026  
**Status:** 📋 Pronto para implementação  
**Próximo passo:** Começar pelo Sprint 1

