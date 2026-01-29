const STORAGE_KEY = 'mindcare.appointments.v1'

export function loadAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveAppointments(appointments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  } catch {
    // ignore write errors (private mode, quota, etc)
  }
}
