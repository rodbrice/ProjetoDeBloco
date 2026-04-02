const STORAGE_KEY = 'mindcare.registered_professionals.v1'

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
 * Carrega a lista de psicólogos registrados pelo app
 */
export function loadRegisteredProfessionals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Salva um psicólogo registrado pelo app (cria ou atualiza)
 */
export function saveRegisteredProfessional(professional) {
  try {
    const current = loadRegisteredProfessionals()
    const withoutDuplicate = current.filter((p) => p.id !== professional.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...withoutDuplicate, professional]))
  } catch {
    // ignora erros de gravação (modo privado, quota excedida, etc)
  }
}

/**
 * Busca o anúncio de um psicólogo pelo userId da conta
 */
export function findProfessionalByUserId(userId) {
  return loadRegisteredProfessionals().find((p) => p.userId === userId) || null
}

/**
 * Constrói o objeto de profissional a partir dos dados do formulário de anúncio
 * @param {object} user    - Usuário autenticado
 * @param {object} listing - Dados preenchidos no formulário
 */
export function buildProfessionalFromListing(user, listing) {
  const slug = buildSlug(user.name) || `psi-${user.id}`
  return {
    id: slug,
    userId: user.id,
    name: user.name,
    specialties: listing.specialties,
    location: listing.location,
    price: Number(listing.price),
    bio: listing.bio,
    tags: listing.tags,
    experience: listing.experience,
    approach: listing.approach,
    phone: user.phone || null,
    crp: user.crp || null,
    isRegistered: true,
  }
}

