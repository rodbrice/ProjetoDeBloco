const STORAGE_KEY = 'mindcare.favorites.v1'

// Carrega a lista de IDs dos profissionais favoritados
export function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Salva a lista de IDs dos profissionais favoritados
export function saveFavorites(favoriteIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
  } catch {
    // ignora erros de gravação (modo privado, quota excedida, etc)
  }
}

// Adiciona um profissional aos favoritos
export function addFavorite(professionalId) {
  const favorites = loadFavorites()
  if (!favorites.includes(professionalId)) {
    favorites.push(professionalId)
    saveFavorites(favorites)
  }
  return favorites
}

// Remove um profissional dos favoritos
export function removeFavorite(professionalId) {
  const favorites = loadFavorites()
  const updated = favorites.filter(id => id !== professionalId)
  saveFavorites(updated)
  return updated
}

// Verifica se um profissional está nos favoritos
export function isFavorite(professionalId) {
  const favorites = loadFavorites()
  return favorites.includes(professionalId)
}

// Alterna o status de favorito de um profissional
export function toggleFavorite(professionalId) {
  if (isFavorite(professionalId)) {
    return removeFavorite(professionalId)
  } else {
    return addFavorite(professionalId)
  }
}

