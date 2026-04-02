import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Carregar usuário do localStorage ao iniciar
    const savedUser = localStorage.getItem('mindcare_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        localStorage.removeItem('mindcare_user')
      }
    }
  }, [])

  /**
   * Login FAKE - apenas para demonstração
   * Em produção, faria chamada para API real
   */
  function login(email, password) {
    // Determina tipo de usuário baseado no email
    const userType = email.toLowerCase().includes('psi') 
      ? 'psychologist' 
      : 'patient'
    
    const fakeUser = {
      id: Date.now(),
      email,
      name: email.split('@')[0], // Nome é a parte antes do @
      userType,
      photo: null,
      createdAt: new Date().toISOString()
    }
    
    setUser(fakeUser)
    localStorage.setItem('mindcare_user', JSON.stringify(fakeUser))
    
    return fakeUser
  }

  /**
   * Registro FAKE - apenas para demonstração
   * Em produção, faria chamada para API real
   */
  function register(name, email, password, userType, extra = {}) {
    const fakeUser = {
      id: Date.now(),
      email,
      name,
      userType,
      photo: null,
      phone: extra.phone || null,
      crp: extra.crp || null,
      clinicAddress: extra.clinicAddress || null,
      city: extra.city || null,
      state: extra.state || null,
      createdAt: new Date().toISOString()
    }

    setUser(fakeUser)
    localStorage.setItem('mindcare_user', JSON.stringify(fakeUser))


    return fakeUser
  }

  /**
   * Logout - remove usuário do estado e localStorage
   */
  function logout() {
    setUser(null)
    localStorage.removeItem('mindcare_user')
  }

  /**
   * Atualiza foto do usuário
   * @param {string} photoBase64 - Foto em base64
   */
  function updatePhoto(photoBase64) {
    if (!user) return
    
    const updatedUser = { ...user, photo: photoBase64 }
    setUser(updatedUser)
    localStorage.setItem('mindcare_user', JSON.stringify(updatedUser))
  }

  /**
   * Atualiza dados do perfil
   * @param {object} data - Dados a atualizar
   */
  function updateProfile(data) {
    if (!user) return
    
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem('mindcare_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
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

