import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

/** Gera slug URL-safe a partir do nome */
function buildSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

/**
 * Carrega a lista de psicólogos registrados (Firestore)
 */
export async function loadRegisteredProfessionals() {
  try {
    const snap = await getDocs(collection(db, 'professionals'))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}

/**
 * Salva um psicólogo registrado (cria ou atualiza no Firestore)
 */
export async function saveRegisteredProfessional(professional) {
  try {
    await setDoc(doc(db, 'professionals', professional.id), professional, { merge: true })
  } catch (err) {
    console.error('Erro ao salvar profissional no Firestore:', err)
  }
}

/**
 * Busca o anúncio de um psicólogo pelo userId
 */
export async function findProfessionalByUserId(userId) {
  try {
    const q = query(collection(db, 'professionals'), where('userId', '==', userId))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const d = snap.docs[0]
    return { id: d.id, ...d.data() }
  } catch {
    return null
  }
}

/**
 * Constrói o objeto de profissional a partir dos dados do formulário de anúncio
 */
export function buildProfessionalFromListing(user, listing) {
  const slug = buildSlug(user.name) || `psi-${user.id}`
  const shortLocation = [user.city, user.state].filter(Boolean).join(' - ') || listing.location
  return {
    id: slug,
    userId: user.id,
    name: user.name,
    specialties: listing.specialties,
    location: shortLocation,
    price: Number(listing.price),
    bio: listing.bio,
    tags: listing.tags,
    experience: listing.experience,
    approach: listing.approach,
    phone: user.phone || null,
    crp: user.crp || null,
    clinicAddress: user.clinicAddress || null,
    city: user.city || null,
    state: user.state || null,
    isRegistered: true,
  }
}

