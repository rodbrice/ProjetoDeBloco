import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCpPm1z2CSMQ6VTXpJBktc2XiUT6q8DItk",
  authDomain: "mindcare-projetodebloco.firebaseapp.com",
  projectId: "mindcare-projetodebloco",
  storageBucket: "mindcare-projetodebloco.firebasestorage.app",
  messagingSenderId: "269410631821",
  appId: "1:269410631821:web:630d835127bd03560b62c4",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)


