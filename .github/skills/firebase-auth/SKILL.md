---
name: firebase-auth
description: Guia para implementar autenticação Firebase no MindCare. Use quando precisar implementar login, registro, ou proteger rotas.
license: MIT
---

# Firebase Authentication - MindCare

## 🎯 Quando Usar Esta Skill

Use esta skill quando precisar:
- Implementar login/registro de usuários
- Proteger rotas privadas
- Gerenciar sessão de usuário
- Diferenciar tipos de perfil (Paciente vs Psicólogo)

---

## 📚 Setup Inicial

### 1. Instalar Firebase

```bash
npm install firebase
```

### 2. Configurar Variáveis de Ambiente

`.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Inicializar Firebase

`src/services/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()
```

---

## 🔐 Padrão: AuthContext + Hook

### AuthContext (`src/context/AuthContext.jsx`)

**Responsabilidade:** Gerenciar estado global de autenticação

```javascript
import { createContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listener de mudanças de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Carregar dados do Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.data()
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          userType: userData?.userType, // 'patient' ou 'psychologist'
          ...userData,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    loading,
    // ... funções de login, logout, etc
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### Hook useAuth (`src/hooks/useAuth.js`)

```javascript
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}
```

### Usar no App (`src/App.jsx`)

```javascript
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
```

---

## 🔑 Funções de Autenticação

### Login com Email/Senha

```javascript
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'

async function login(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    // Tratar erros
    if (error.code === 'auth/wrong-password') {
      throw new Error('Senha incorreta')
    }
    if (error.code === 'auth/user-not-found') {
      throw new Error('Usuário não encontrado')
    }
    throw error
  }
}
```

### Registro

```javascript
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

async function register(email, password, displayName, userType) {
  try {
    // 1. Criar usuário no Authentication
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    // 2. Atualizar perfil
    await updateProfile(result.user, { displayName })
    
    // 3. Criar documento no Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      displayName,
      userType, // 'patient' ou 'psychologist'
      createdAt: new Date().toISOString(),
    })
    
    // 4. Criar documento específico do tipo
    if (userType === 'patient') {
      await setDoc(doc(db, 'patients', result.user.uid), {
        userId: result.user.uid,
        favorites: [],
        preferences: {},
      })
    } else if (userType === 'psychologist') {
      await setDoc(doc(db, 'psychologists', result.user.uid), {
        userId: result.user.uid,
        verified: false,
        crp: '',
        specialties: [],
        bio: '',
        price: 0,
      })
    }
    
    return result.user
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email já cadastrado')
    }
    throw error
  }
}
```

### Login com Google

```javascript
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider, db } from '../services/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    
    // Verificar se é primeiro login
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    
    if (!userDoc.exists()) {
      // Criar documento para novo usuário
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        userType: 'patient', // Default
        createdAt: new Date().toISOString(),
      })
      
      await setDoc(doc(db, 'patients', result.user.uid), {
        userId: result.user.uid,
        favorites: [],
      })
    }
    
    return result.user
  } catch (error) {
    throw error
  }
}
```

### Logout

```javascript
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'

async function logout() {
  await signOut(auth)
}
```

### Recuperar Senha

```javascript
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../services/firebase'

async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
  // Email enviado com link para resetar senha
}
```

---

## 🛡️ Proteger Rotas

### PrivateRoute (Qualquer usuário autenticado)

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
```

**Uso em AppRoutes:**

```jsx
<Route element={<PrivateRoute />}>
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/favorites" element={<FavoritesPage />} />
</Route>
```

### PatientRoute (Apenas Pacientes)

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PatientRoute() {
  const { user, loading } = useAuth()

  if (loading) return <div>Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.userType !== 'patient') {
    return <Navigate to="/psychologist/dashboard" replace />
  }

  return <Outlet />
}
```

**Uso:**

```jsx
<Route element={<PatientRoute />}>
  <Route path="/patient/dashboard" element={<PatientDashboard />} />
  <Route path="/appointments/new" element={<NewAppointmentPage />} />
</Route>
```

### PsychologistRoute (Apenas Psicólogos)

```jsx
export default function PsychologistRoute() {
  const { user, loading } = useAuth()

  if (loading) return <div>Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (user.userType !== 'psychologist') {
    return <Navigate to="/patient/dashboard" replace />
  }

  return <Outlet />
}
```

---

## 📝 Páginas de Autenticação

### LoginPage

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/') // Redireciona após login
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-page">
      <h1>Entrar</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <button onClick={handleGoogleLogin} className="btn-google">
        Entrar com Google
      </button>
      
      <p>
        Não tem conta? <Link to="/register">Criar conta</Link>
      </p>
      
      <Link to="/forgot-password">Esqueci minha senha</Link>
    </div>
  )
}
```

### RegisterPage

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validações
    if (formData.password !== formData.confirmPassword) {
      return setError('As senhas não coincidem')
    }

    if (formData.password.length < 6) {
      return setError('Senha deve ter no mínimo 6 caracteres')
    }

    setLoading(true)

    try {
      await register(
        formData.email,
        formData.password,
        formData.displayName,
        formData.userType
      )
      
      // Redirecionar baseado no tipo
      if (formData.userType === 'psychologist') {
        navigate('/documents/upload') // Enviar documentos
      } else {
        navigate('/patient/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <h1>Criar Conta</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="displayName">Nome completo</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
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
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Tipo de conta</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="userType"
                value="patient"
                checked={formData.userType === 'patient'}
                onChange={handleChange}
              />
              Sou Paciente
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="psychologist"
                checked={formData.userType === 'psychologist'}
                onChange={handleChange}
              />
              Sou Psicólogo
            </label>
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}
```

---

## 🧪 Testar Autenticação

### Mock Firebase em Testes

`src/__mocks__/firebase.js`:

```javascript
import { vi } from 'vitest'

export const auth = {
  currentUser: null,
}

export const db = {}
export const storage = {}
export const googleProvider = {}

export const createUserWithEmailAndPassword = vi.fn()
export const signInWithEmailAndPassword = vi.fn()
export const signOut = vi.fn()
export const onAuthStateChanged = vi.fn((auth, callback) => {
  callback(null) // Não autenticado por padrão
  return vi.fn() // Unsubscribe
})
```

### Teste de LoginPage

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

// Mock useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
  }),
}))

describe('LoginPage', () => {
  it('renderiza formulário de login', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })
  
  it('valida campos obrigatórios', async () => {
    const user = userEvent.setup()
    render(<BrowserRouter><LoginPage /></BrowserRouter>)
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)
    
    // HTML5 validation impede submit
    expect(screen.getByLabelText('Email')).toBeInvalid()
  })
})
```

---

## 🔍 Debugging

### Ver usuário atual

```javascript
import { auth } from './services/firebase'

console.log('Current user:', auth.currentUser)
```

### Verificar estado de autenticação

```javascript
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebase'

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Usuário logado:', user.uid, user.email)
  } else {
    console.log('Nenhum usuário logado')
  }
})
```

---

## ⚠️ Erros Comuns

### "Firebase: Error (auth/invalid-api-key)"
- Verificar `.env` está correto
- Verificar variáveis começam com `VITE_`
- Reiniciar servidor Vite após alterar `.env`

### "Missing or insufficient permissions"
- Verificar regras do Firestore
- Garantir que usuário está autenticado
- Verificar `request.auth.uid` nas regras

### "useAuth must be used within AuthProvider"
- Garantir que `App.jsx` está envolvido em `<AuthProvider>`
- Não usar `useAuth()` fora da árvore de componentes

---

## 📚 Recursos Adicionais

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Criado em:** 31/03/2026  
**Para:** Projeto MindCare TP5  
**Mantenedor:** Equipe MindCare

