# 📚 TP5 - VERSÃO SIMPLIFICADA (Estudantes Iniciantes)

**Data:** 31/03/2026  
**Objetivo:** Implementar o MÍNIMO necessário para atender os requisitos do professor

---

## 🎯 O QUE REALMENTE PRECISAMOS FAZER

### Requisitos do Professor:
1. ✅ **Autenticação simples** (login/logout)
2. ✅ **Usar câmera do celular** (tirar foto)
3. ✅ **Funcionar em iOS e Android**

**IMPORTANTE:** Não precisa ser perfeito! É um trabalho de faculdade, foco em funcionar.

---

## ✂️ SIMPLIFICAÇÕES (O que NÃO vamos fazer agora)

❌ **NÃO precisa:**
- Firebase (muito complexo para iniciantes)
- Firestore real-time (localStorage é suficiente)
- Upload de documentos (CRP, RG) - apenas foto de perfil
- Perfis super elaborados
- PWA complexo
- Testes muito elaborados
- Google OAuth (só email/senha)

✅ **Vamos fazer SIMPLES:**
- Autenticação fake (localStorage)
- Câmera básica (input file com capture)
- Salvar foto em base64 (localStorage)
- Perfis básicos (só flag patient/psychologist)
- Funciona = suficiente!

---

## 📦 VERSÃO MÍNIMA VIÁVEL (MVP)

### Sprint 1: Autenticação Fake (8h)

**Pessoa 1:**

#### 1.1 Criar AuthContext Simples

`src/context/AuthContext.jsx`:
```jsx
import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Carregar usuário do localStorage
    const savedUser = localStorage.getItem('mindcare_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  function login(email, password) {
    // Autenticação FAKE - apenas para demonstração
    const fakeUser = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      userType: email.includes('psi') ? 'psychologist' : 'patient',
      photo: null
    }
    
    setUser(fakeUser)
    localStorage.setItem('mindcare_user', JSON.stringify(fakeUser))
    return fakeUser
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('mindcare_user')
  }

  function updatePhoto(photoBase64) {
    const updated = { ...user, photo: photoBase64 }
    setUser(updated)
    localStorage.setItem('mindcare_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePhoto }}>
      {children}
    </AuthContext.Provider>
  )
}
```

#### 1.2 Hook useAuth

`src/hooks/useAuth.js`:
```javascript
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  return useContext(AuthContext)
}
```

#### 1.3 LoginPage Simples

`src/pages/LoginPage.jsx`:
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    login(email, password)
    navigate('/')
  }

  return (
    <div className="page-container">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
      <p className="hint">
        💡 Dica: Email com "psi" vira Psicólogo, outros viram Paciente
      </p>
    </div>
  )
}
```

#### 1.4 Proteger Rotas (SIMPLES)

`src/components/PrivateRoute.jsx`:
```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" />
}
```

---

### Sprint 2: Câmera Básica (6h)

**Pessoa 2:**

#### 2.1 Componente de Câmera SIMPLES

`src/components/CameraCapture.jsx`:
```jsx
import { useRef, useState } from 'react'

export default function CameraCapture({ onCapture, onCancel }) {
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleConfirm() {
    onCapture(preview)
  }

  if (preview) {
    return (
      <div className="camera-preview">
        <img src={preview} alt="Preview" style={{ maxWidth: '100%' }} />
        <div className="camera-actions">
          <button onClick={() => setPreview(null)} className="btn-secondary">
            Tirar outra
          </button>
          <button onClick={handleConfirm} className="btn-primary">
            Usar esta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="camera-capture">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button 
        onClick={() => inputRef.current?.click()}
        className="btn-primary btn-large"
      >
        📷 Tirar Foto
      </button>
      <button onClick={onCancel} className="btn-secondary">
        Cancelar
      </button>
    </div>
  )
}
```

**Explicação:** Usa `<input type="file" capture>` que funciona em iOS e Android!

#### 2.2 ProfilePage com Foto

`src/pages/ProfilePage.jsx`:
```jsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import CameraCapture from '../components/CameraCapture'

export default function ProfilePage() {
  const { user, logout, updatePhoto } = useAuth()
  const [showCamera, setShowCamera] = useState(false)

  function handlePhotoCapture(photoBase64) {
    updatePhoto(photoBase64)
    setShowCamera(false)
  }

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handlePhotoCapture}
        onCancel={() => setShowCamera(false)}
      />
    )
  }

  return (
    <div className="page-container">
      <h1>Meu Perfil</h1>
      
      <div className="profile-photo">
        {user.photo ? (
          <img src={user.photo} alt="Foto" className="avatar-large" />
        ) : (
          <div className="avatar-placeholder">Sem foto</div>
        )}
        <button onClick={() => setShowCamera(true)} className="btn-secondary">
          📷 Alterar Foto
        </button>
      </div>

      <div className="profile-info">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Tipo:</strong> {user.userType === 'patient' ? 'Paciente' : 'Psicólogo'}</p>
      </div>

      <button onClick={logout} className="btn-danger">
        Sair
      </button>
    </div>
  )
}
```

---

### Sprint 3: Adaptações UI (4h)

**Pessoa 3:**

#### 3.1 Atualizar Header com Avatar

`src/components/Header.jsx` (adicionar):
```jsx
import { useAuth } from '../hooks/useAuth'

export default function Header({ title, subtitle, showBackButton }) {
  const { user } = useAuth()
  
  // ...código existente...
  
  return (
    <header className="header">
      {/* ...código existente... */}
      
      {user && (
        <Link to="/profile" className="header-avatar">
          {user.photo ? (
            <img src={user.photo} alt={user.name} className="avatar-small" />
          ) : (
            <div className="avatar-small avatar-placeholder">
              {user.name[0]}
            </div>
          )}
        </Link>
      )}
    </header>
  )
}
```

#### 3.2 Atualizar BottomNav

`src/components/BottomNav.jsx` (modificar):
```jsx
import { useAuth } from '../hooks/useAuth'

export default function BottomNav() {
  const { user } = useAuth()
  
  if (!user) {
    return (
      <nav className="bottom-nav">
        <Link to="/">🔍 Buscar</Link>
        <Link to="/about">ℹ️ Sobre</Link>
        <Link to="/login">🔑 Entrar</Link>
      </nav>
    )
  }
  
  return (
    <nav className="bottom-nav">
      <Link to="/">🔍 Buscar</Link>
      <Link to="/favorites">⭐ Favoritos</Link>
      <Link to="/appointments">📅 Agenda</Link>
      <Link to="/profile">👤 Perfil</Link>
    </nav>
  )
}
```

#### 3.3 CSS Básico para Avatar

`src/styles/Components.css` (adicionar):
```css
/* Avatar */
.avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-large {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
  display: block;
}

.avatar-placeholder {
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
}

.camera-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
```

---

### Sprint 4: Rotas e Finalização (2h)

**Todos:**

#### 4.1 Atualizar AppRoutes

`src/routes/AppRoutes.jsx`:
```jsx
import PrivateRoute from '../components/PrivateRoute'
import LoginPage from '../pages/LoginPage'
import ProfilePage from '../pages/ProfilePage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Públicas */}
        <Route index element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          {/* ...outras rotas privadas... */}
        </Route>
      </Route>
    </Routes>
  )
}
```

#### 4.2 Atualizar App.jsx

`src/App.jsx`:
```jsx
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
```

---

## 📊 ESTIMATIVA SIMPLIFICADA

| Sprint | Pessoa | Horas | Tarefas |
|--------|--------|-------|---------|
| 1 | Pessoa 1 | 8h | Auth fake + Login + Guards |
| 2 | Pessoa 2 | 6h | Câmera + ProfilePage |
| 3 | Pessoa 3 | 4h | UI adaptations + CSS |
| 4 | Todos | 2h | Integração + Testes |
| **TOTAL** | **3 pessoas** | **20h** | **~7h por pessoa** |

**Muito mais simples!** 20 horas total vs 64 horas da versão completa.

---

## ✅ CHECKLIST MÍNIMO

### Para considerar PRONTO:
- [ ] Login funciona (qualquer email/senha)
- [ ] Logout funciona
- [ ] Rotas privadas redirecionam para login
- [ ] Câmera abre (input file)
- [ ] Foto é capturada
- [ ] Foto aparece no perfil
- [ ] Avatar aparece no header
- [ ] BottomNav muda quando logado
- [ ] Funciona em Chrome mobile
- [ ] Funciona em Safari iOS

**Não precisa:**
- ❌ Firebase real
- ❌ Validações complexas
- ❌ Testes unitários elaborados
- ❌ PWA
- ❌ Upload de documentos
- ❌ Google OAuth
- ❌ Perfis super elaborados

---

## 🎓 PARA APRESENTAÇÃO (SIMPLES)

### O que explicar:

**Autenticação:**
> "Implementamos login com Context API do React. Salvamos usuário no localStorage. 
> É simples mas funciona!"

**Câmera:**
> "Usamos `<input type='file' capture='user'>` que funciona em iOS e Android. 
> Convertemos foto para base64 e salvamos no localStorage."

**Diferenças Mobile:**
> "O input file com capture funciona nos dois. iOS usa câmera frontal com 'user', 
> Android também. É a forma mais simples e compatível."

**Rotas:**
> "Usamos PrivateRoute que checa se tem usuário logado. Se não tem, redireciona 
> para login. É um Higher Order Component."

---

## 🚀 COMO COMEÇAR (Passo-a-passo)

### Dia 1 (Pessoa 1):
1. Criar `src/context/AuthContext.jsx`
2. Criar `src/hooks/useAuth.js`
3. Criar `src/pages/LoginPage.jsx`
4. Criar `src/components/PrivateRoute.jsx`
5. Atualizar `App.jsx` (AuthProvider)

### Dia 2 (Pessoa 2):
1. Criar `src/components/CameraCapture.jsx`
2. Criar `src/pages/ProfilePage.jsx`
3. Testar câmera no celular

### Dia 3 (Pessoa 3):
1. Atualizar `Header.jsx` (avatar)
2. Atualizar `BottomNav.jsx` (condicional)
3. Adicionar CSS para avatares

### Dia 4 (Todos):
1. Atualizar `AppRoutes.jsx`
2. Testar tudo funcionando
3. Fazer build
4. Deploy

---

## 💡 DICAS

### Testar Localmente:
```bash
npm run dev
# Abre http://localhost:5173
# Abre DevTools → Toggle Device Toolbar (mobile view)
# Testa login, câmera, perfil
```

### Testar em Celular Real:
1. Descobrir IP local: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Acessar `http://192.168.x.x:5173` no celular
3. Testar câmera (funciona!)

### Deploy Rápido:
```bash
npm run build
npx vercel --prod
# ou
npx netlify deploy --prod
```

---

## ⚠️ OBSERVAÇÕES

### Por que localStorage ao invés de Firebase?
**Resposta:** Muito mais simples! Firebase requer:
- Conta Google
- Configuração complexa
- Regras de segurança
- API keys
- Aprender SDK

localStorage:
- Apenas JavaScript
- Funciona offline
- Sem configuração
- Sem custos
- Suficiente para MVP

### Por que autenticação "fake"?
**Resposta:** É um projeto de faculdade! Objetivo é demonstrar:
- Como funciona autenticação
- Proteger rotas
- Gerenciar estado
- Context API

Não precisa ser banco de dados real para aprender os conceitos.

### Por que base64 para fotos?
**Resposta:** 
- Não precisa servidor
- Não precisa Storage externo
- Funciona offline
- Simples de implementar
- Suficiente para demonstração

**Limitação:** Fotos grandes ocupam muito espaço no localStorage (limite 5-10MB). 
Para projeto real, usar Firebase Storage ou Cloudinary.

---

## 🎯 RESULTADO FINAL

Ao final, você terá:
- ✅ Login/Logout funcionando
- ✅ Câmera capturando foto
- ✅ Foto aparecendo no perfil
- ✅ Rotas protegidas
- ✅ Funciona em iOS e Android
- ✅ Código simples e explicável

**Tempo:** ~20 horas total, ~7h por pessoa

**Complexidade:** Baixa (estudantes iniciantes conseguem)

**Resultado:** Funciona e atende os requisitos! ✨

---

## 📝 RESUMO DO QUE FAZER

**Pessoa 1 (8h):**
- AuthContext fake (localStorage)
- LoginPage
- PrivateRoute
- Atualizar App.jsx

**Pessoa 2 (6h):**
- CameraCapture (input file)
- ProfilePage com foto
- Testar em celular

**Pessoa 3 (4h):**
- Avatar no Header
- BottomNav condicional
- CSS para avatares

**Todos juntos (2h):**
- Integrar tudo
- Testar
- Deploy

**TOTAL:** 20 horas (muito mais gerenciável!)

---

**Criado em:** 31/03/2026  
**Versão:** Simplificada para estudantes  
**Status:** Pronto para começar!  
**Próximo passo:** Pessoa 1 começa com AuthContext

**Boa sorte! Mantenha simples! 🚀**

