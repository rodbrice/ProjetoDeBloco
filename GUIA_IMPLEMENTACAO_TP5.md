# 🛠️ GUIA DE IMPLEMENTAÇÃO TP5

**Projeto:** MindCare  
**Data:** 31/03/2026  
**Objetivo:** Guia passo-a-passo para implementar autenticação, perfis e câmera

---

## 📚 ÍNDICE

1. [Setup do Projeto](#1-setup-do-projeto)
2. [Firebase Configuration](#2-firebase-configuration)
3. [Implementação da Autenticação](#3-implementação-da-autenticação)
4. [Perfis Diferenciados](#4-perfis-diferenciados)
5. [Camera API](#5-camera-api)
6. [Upload de Documentos](#6-upload-de-documentos)
7. [PWA Configuration](#7-pwa-configuration)
8. [Testes](#8-testes)
9. [Deploy](#9-deploy)

---

## 1. Setup do Projeto

### 1.1 Instalar Dependências

```bash
# Firebase SDK
npm install firebase

# PWA Plugin para Vite
npm install vite-plugin-pwa -D

# Opcional: React Hot Toast para notificações
npm install react-hot-toast
```

### 1.2 Variáveis de Ambiente

Criar `.env` na raiz:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Criar `.env.example` (sem valores sensíveis):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 1.3 Atualizar .gitignore

Adicionar:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
```

---

## 2. Firebase Configuration

### 2.1 Criar Projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique "Add project"
3. Nome: "MindCare" (ou seu nome preferido)
4. Desabilite Google Analytics (opcional para MVP)
5. Clique "Create project"

### 2.2 Configurar Authentication

1. No console, vá em **Authentication** → **Get started**
2. Aba **Sign-in method**
3. Habilite:
   - ✅ **Email/Password** (enable)
   - ✅ **Google** (configure OAuth consent screen)
4. Aba **Settings** → **Authorized domains**
   - Adicione: `localhost` (dev)
   - Adicione: `seu-dominio.vercel.app` (prod)

### 2.3 Configurar Firestore Database

1. No console, vá em **Firestore Database** → **Create database**
2. Selecione **Start in test mode** (por enquanto)
3. Localização: `us-central1` (ou mais próximo)
4. Clique **Enable**

**Regras de Segurança Iniciais:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Patients collection
    match /patients/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Psychologists collection
    match /psychologists/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.patientId == request.auth.uid ||
         resource.data.psychologistId == request.auth.uid);
    }
  }
}
```

### 2.4 Configurar Storage

1. No console, vá em **Storage** → **Get started**
2. Selecione **Start in test mode**
3. Localização: mesma do Firestore
4. Clique **Done**

**Regras de Segurança:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile photos
    match /profile-photos/{userId}.{extension} {
      allow read: if true; // Públicas
      allow write: if request.auth.uid == userId &&
        request.resource.size < 5 * 1024 * 1024 && // Max 5MB
        request.resource.contentType.matches('image/.*');
    }
    
    // Documents (private)
    match /documents/{userId}/{document} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId &&
        request.resource.size < 10 * 1024 * 1024 && // Max 10MB
        (request.resource.contentType.matches('image/.*') ||
         request.resource.contentType == 'application/pdf');
    }
  }
}
```

### 2.5 Obter Credenciais

1. No console, vá em **Project Settings** (ícone engrenagem)
2. Aba **General** → **Your apps**
3. Clique **Web** (</>) → Register app
4. Nome: "MindCare Web"
5. Copie as credenciais e cole no `.env`

---

## 3. Implementação da Autenticação

### 3.1 Firebase Service (`src/services/firebase.js`)

```javascript
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export default app
```

### 3.2 AuthContext (`src/context/AuthContext.jsx`)

```javascript
import { createContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '../services/firebase'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Load user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.data()
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userData, // userType, etc
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Register new user
  async function register(email, password, displayName, userType) {
    try {
      setError(null)
      
      // Create auth user
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile
      await firebaseUpdateProfile(result.user, { displayName })
      
      // Create Firestore document
      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        displayName,
        userType, // 'patient' or 'psychologist'
        createdAt: new Date().toISOString(),
      })
      
      // Create type-specific document
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
          verificationStatus: 'pending',
          crp: '',
          specialties: [],
          bio: '',
          price: 0,
        })
      }
      
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Login with email/password
  async function login(email, password) {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    try {
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      
      if (!userDoc.exists()) {
        // First time login - create document
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          userType: 'patient', // Default to patient
          createdAt: new Date().toISOString(),
        })
        
        await setDoc(doc(db, 'patients', result.user.uid), {
          userId: result.user.uid,
          favorites: [],
          preferences: {},
        })
      }
      
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Logout
  async function logout() {
    try {
      setError(null)
      await signOut(auth)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Reset password
  async function resetPassword(email) {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update profile
  async function updateProfile(data) {
    try {
      setError(null)
      
      if (data.displayName || data.photoURL) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName: data.displayName,
          photoURL: data.photoURL,
        })
      }
      
      // Update Firestore
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        data,
        { merge: true }
      )
      
      // Reload user
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
      setUser({ ...auth.currentUser, ...userDoc.data() })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### 3.3 useAuth Hook (`src/hooks/useAuth.js`)

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

### 3.4 PrivateRoute (`src/components/PrivateRoute.jsx`)

```javascript
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
```

### 3.5 PatientRoute (`src/components/PatientRoute.jsx`)

```javascript
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PatientRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-container">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.userType !== 'patient') {
    return <Navigate to="/psychologist/dashboard" replace />
  }

  return <Outlet />
}
```

### 3.6 PsychologistRoute (`src/components/PsychologistRoute.jsx`)

```javascript
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PsychologistRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-container">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.userType !== 'psychologist') {
    return <Navigate to="/patient/dashboard" replace />
  }

  return <Outlet />
}
```

### 3.7 Atualizar App.jsx

```jsx
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
```

### 3.8 Atualizar AppRoutes.jsx

```jsx
import { Routes, Route } from 'react-router-dom'
import AppShell from '../components/AppShell'
import PrivateRoute from '../components/PrivateRoute'
import PatientRoute from '../components/PatientRoute'
import PsychologistRoute from '../components/PsychologistRoute'

// Import pages
import SearchPage from '../pages/SearchPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'
// ... etc

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {/* Public routes */}
        <Route index element={<SearchPage />} />
        <Route path="/professionals/:id" element={<ProfessionalPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Private routes (any authenticated user) */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>

        {/* Patient-only routes */}
        <Route element={<PatientRoute />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/appointments/new" element={<NewAppointmentPage />} />
        </Route>

        {/* Psychologist-only routes */}
        <Route element={<PsychologistRoute />}>
          <Route path="/psychologist/dashboard" element={<PsychologistDashboard />} />
          <Route path="/psychologist/appointments" element={<AppointmentsPage />} />
          <Route path="/documents/upload" element={<DocumentUploadPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

---

## 4. Perfis Diferenciados

### 4.1 Hook useFavorites (`src/hooks/useFavorites.js`)

```javascript
import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    // Real-time listener
    const unsubscribe = onSnapshot(
      doc(db, 'patients', user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || [])
        }
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching favorites:', error)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user])

  async function addFavorite(professionalId) {
    if (!user) return

    const newFavorites = [...favorites, professionalId]
    await setDoc(
      doc(db, 'patients', user.uid),
      { favorites: newFavorites },
      { merge: true }
    )
  }

  async function removeFavorite(professionalId) {
    if (!user) return

    const newFavorites = favorites.filter(id => id !== professionalId)
    await setDoc(
      doc(db, 'patients', user.uid),
      { favorites: newFavorites },
      { merge: true }
    )
  }

  async function toggleFavorite(professionalId) {
    if (favorites.includes(professionalId)) {
      await removeFavorite(professionalId)
    } else {
      await addFavorite(professionalId)
    }
  }

  function isFavorite(professionalId) {
    return favorites.includes(professionalId)
  }

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}
```

### 4.2 Hook useAppointments (`src/hooks/useAppointments.js`)

```javascript
import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from './useAuth'

export function useAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setAppointments([])
      setLoading(false)
      return
    }

    // Query depends on user type
    const appointmentsRef = collection(db, 'appointments')
    const q = user.userType === 'patient'
      ? query(
          appointmentsRef,
          where('patientId', '==', user.uid),
          orderBy('date', 'desc')
        )
      : query(
          appointmentsRef,
          where('psychologistId', '==', user.uid),
          orderBy('date', 'desc')
        )

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setAppointments(data)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  async function createAppointment(data) {
    if (!user) throw new Error('User not authenticated')

    const appointment = {
      ...data,
      patientId: user.uid,
      patientName: user.displayName,
      status: 'pending_approval', // Requires psychologist approval
      createdAt: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, 'appointments'), appointment)
    return { id: docRef.id, ...appointment }
  }

  async function approveAppointment(appointmentId) {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status: 'approved',
      approvedAt: new Date().toISOString(),
    })
  }

  async function rejectAppointment(appointmentId) {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
    })
  }

  async function cancelAppointment(appointmentId) {
    await updateDoc(doc(db, 'appointments', appointmentId), {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    })
  }

  return {
    appointments,
    loading,
    createAppointment,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
  }
}
```

---

## 5. Camera API

### 5.1 Camera Utils (`src/utils/cameraUtils.js`)

```javascript
/**
 * Detect if camera is supported
 */
export function isCameraSupported() {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  )
}

/**
 * Detect iOS device
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Detect Android device
 */
export function isAndroid() {
  return /Android/.test(navigator.userAgent)
}

/**
 * Detect any mobile device
 */
export function isMobile() {
  return isIOS() || isAndroid()
}

/**
 * Get camera constraints
 * @param {string} facingMode - 'user' (frontal) or 'environment' (back)
 */
export function getCameraConstraints(facingMode = 'user') {
  return {
    video: {
      facingMode,
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  }
}

/**
 * Request camera permission and get stream
 * @param {string} facingMode - 'user' or 'environment'
 * @returns {Promise<MediaStream>}
 */
export async function getCameraStream(facingMode = 'user') {
  try {
    const constraints = getCameraConstraints(facingMode)
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  } catch (error) {
    console.error('Error accessing camera:', error)
    throw error
  }
}

/**
 * Stop camera stream
 * @param {MediaStream} stream
 */
export function stopCameraStream(stream) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}
```

### 5.2 Image Utils (`src/utils/imageUtils.js`)

```javascript
/**
 * Resize image using Canvas API
 * @param {Blob} blob - Image blob
 * @param {number} maxWidth - Max width in pixels
 * @param {number} maxHeight - Max height in pixels
 * @returns {Promise<Blob>}
 */
export async function resizeImage(blob, maxWidth = 800, maxHeight = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (resizedBlob) => {
          resolve(resizedBlob)
        },
        'image/jpeg',
        0.9
      )
    }
    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}

/**
 * Convert blob to base64 (for preview)
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Validate image file
 * @param {File} file
 * @returns {boolean}
 */
export function validateImage(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Formato inválido. Use JPG, PNG ou WEBP.')
  }

  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Máximo 10MB.')
  }

  return true
}
```

### 5.3 CameraCapture Component (`src/components/CameraCapture.jsx`)

```jsx
import { useState, useRef, useEffect } from 'react'
import { isCameraSupported, getCameraStream, stopCameraStream, isIOS } from '../utils/cameraUtils'
import { resizeImage } from '../utils/imageUtils'

export default function CameraCapture({ onCapture, onCancel, facingMode = 'user' }) {
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [error, setError] = useState(null)
  const [useFileInput, setUseFileInput] = useState(!isCameraSupported() || isIOS())
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!useFileInput) {
      startCamera()
    }

    return () => {
      if (stream) {
        stopCameraStream(stream)
      }
    }
  }, [])

  async function startCamera() {
    try {
      const mediaStream = await getCameraStream(facingMode)
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Não foi possível acessar a câmera')
      setUseFileInput(true) // Fallback to file input
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      setCapturedImage({ blob, url })
    }, 'image/jpeg', 0.9)
  }

  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setCapturedImage({ blob: file, url })
  }

  async function handleConfirm() {
    if (!capturedImage) return

    try {
      // Resize before sending
      const resizedBlob = await resizeImage(capturedImage.blob)
      onCapture(resizedBlob)
    } catch (err) {
      setError('Erro ao processar imagem')
    }
  }

  function handleRetake() {
    setCapturedImage(null)
    if (useFileInput && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (capturedImage) {
    return (
      <div className="camera-preview">
        <img src={capturedImage.url} alt="Preview" />
        <div className="camera-actions">
          <button onClick={handleRetake} className="btn-secondary">
            Tirar outra
          </button>
          <button onClick={handleConfirm} className="btn-primary">
            Usar essa foto
          </button>
        </div>
      </div>
    )
  }

  if (useFileInput) {
    return (
      <div className="file-upload">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={facingMode === 'user' ? 'user' : 'environment'}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary btn-large"
        >
          📷 Tirar Foto
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    )
  }

  return (
    <div className="camera-capture">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="camera-video"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="camera-actions">
        <button onClick={capturePhoto} className="btn-capture">
          📷
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
```

**CSS para CameraCapture (`Components.css`):**

```css
/* Camera Capture */
.camera-capture {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.camera-video {
  flex: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-actions {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.btn-capture {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 4px solid var(--primary);
  font-size: 2rem;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-capture:active {
  transform: scale(0.9);
}

.camera-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.camera-preview img {
  flex: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

---

## 6. Upload de Documentos

### 6.1 Storage Service (`src/services/storageService.js`)

```javascript
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'
import { resizeImage } from '../utils/imageUtils'

/**
 * Upload profile photo
 * @param {string} userId
 * @param {Blob} blob
 * @returns {Promise<string>} Download URL
 */
export async function uploadProfilePhoto(userId, blob) {
  // Resize to 400x400
  const resized = await resizeImage(blob, 400, 400)
  
  // Upload to Firebase Storage
  const storageRef = ref(storage, `profile-photos/${userId}.jpg`)
  await uploadBytes(storageRef, resized)
  
  // Get download URL
  const url = await getDownloadURL(storageRef)
  return url
}

/**
 * Upload document (CRP, RG, etc)
 * @param {string} userId
 * @param {string} documentType - 'crp', 'rg_front', 'rg_back'
 * @param {Blob} blob
 * @returns {Promise<string>} Download URL
 */
export async function uploadDocument(userId, documentType, blob) {
  const storageRef = ref(storage, `documents/${userId}/${documentType}.jpg`)
  await uploadBytes(storageRef, blob)
  
  const url = await getDownloadURL(storageRef)
  return url
}

/**
 * Delete file from storage
 * @param {string} path
 */
export async function deleteFile(path) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}
```

---

## 7. PWA Configuration

### 7.1 Configurar Vite PWA Plugin

`vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MindCare - Plataforma de Saúde Mental',
        short_name: 'MindCare',
        description: 'Conectando psicólogos a pacientes',
        theme_color: '#5E81AC',
        background_color: '#ECEFF4',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-storage-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
```

---

## 8. Testes

### 8.1 Mock Firebase em Testes

`src/__mocks__/firebase.js`:

```javascript
import { vi } from 'vitest'

export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}

export const db = {}
export const storage = {}
export const googleProvider = {}
```

`vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  }
})
```

---

## 9. Deploy

### 9.1 Vercel

```bash
npm run build
npx vercel --prod
```

### 9.2 Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

**Criado em:** 31/03/2026  
**Status:** ✅ Pronto para uso  
**Próximo passo:** Começar implementação seguindo este guia

