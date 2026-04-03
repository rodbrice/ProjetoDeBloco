import { createContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

export const AuthContext = createContext({})

/* ───── helpers para perfil extra (localStorage por UID) ───── */
const profileKey = (uid) => `mindcare_profile_${uid}`

function saveProfile(uid, data) {
  localStorage.setItem(profileKey(uid), JSON.stringify(data))
}

function loadProfile(uid) {
  try {
    return JSON.parse(localStorage.getItem(profileKey(uid))) || {}
  } catch {
    return {}
  }
}

/** Monta o objeto "user" que o app inteiro consome */
function buildUser(firebaseUser, profile = {}) {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: profile.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
    userType: profile.userType || 'patient',
    photo: profile.photo || null,
    phone: profile.phone || null,
    crp: profile.crp || null,
    clinicAddress: profile.clinicAddress || null,
    city: profile.city || null,
    state: profile.state || null,
    createdAt: profile.createdAt || new Date().toISOString(),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)   // true enquanto verifica sessão

  /* ── onAuthStateChanged: reidrata sessão automaticamente ── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const profile = loadProfile(firebaseUser.uid)
        setUser(buildUser(firebaseUser, profile))
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe   // cleanup ao desmontar
  }, [])

  /**
   * Login real com Firebase Auth
   * @returns {Promise<object>} user
   */
  async function login(email, password) {
    const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password)
    const profile = loadProfile(fbUser.uid)
    const appUser = buildUser(fbUser, profile)
    setUser(appUser)
    return appUser
  }

  /**
   * Registro real com Firebase Auth
   * Cria conta + salva dados extras no localStorage (perfil)
   */
  async function register(name, email, password, userType, extra = {}) {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password)

    // Salva displayName no Firebase Auth
    await fbUpdateProfile(fbUser, { displayName: name })

    const profile = {
      name,
      userType,
      photo: null,
      phone: extra.phone || null,
      crp: extra.crp || null,
      clinicAddress: extra.clinicAddress || null,
      city: extra.city || null,
      state: extra.state || null,
      createdAt: new Date().toISOString(),
    }
    saveProfile(fbUser.uid, profile)

    const appUser = buildUser(fbUser, profile)
    setUser(appUser)
    return appUser
  }

  /**
   * Logout via Firebase — limpa sessão automaticamente
   */
  async function logout() {
    await signOut(auth)
    setUser(null)
  }

  /**
   * Atualiza foto do usuário (localStorage + estado)
   */
  function updatePhoto(photoBase64) {
    if (!user) return
    const updatedUser = { ...user, photo: photoBase64 }
    setUser(updatedUser)
    saveProfile(user.id, { ...loadProfile(user.id), photo: photoBase64 })
  }

  /**
   * Atualiza dados do perfil (localStorage + estado)
   */
  function updateProfile(data) {
    if (!user) return
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    saveProfile(user.id, { ...loadProfile(user.id), ...data })
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updatePhoto,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

