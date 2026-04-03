import { createContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export const AuthContext = createContext({})

/* ───── helpers Firestore — coleção "users", doc = UID ───── */
async function saveProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), data, { merge: true })
}

async function loadProfile(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : {}
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await loadProfile(firebaseUser.uid)
        setUser(buildUser(firebaseUser, profile))
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email, password) {
    const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password)
    const profile = await loadProfile(fbUser.uid)
    const appUser = buildUser(fbUser, profile)
    setUser(appUser)
    return appUser
  }

  async function register(name, email, password, userType, extra = {}) {
    const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password)
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
    await saveProfile(fbUser.uid, profile)

    const appUser = buildUser(fbUser, profile)
    setUser(appUser)
    return appUser
  }

  async function logout() {
    await signOut(auth)
    setUser(null)
  }

  async function updatePhoto(photoBase64) {
    if (!user) return
    const updatedUser = { ...user, photo: photoBase64 }
    setUser(updatedUser)
    await updateDoc(doc(db, 'users', user.id), { photo: photoBase64 })
  }

  async function updateProfile(data) {
    if (!user) return
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    await updateDoc(doc(db, 'users', user.id), data)
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

