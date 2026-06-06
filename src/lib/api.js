const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

let accessToken = null

export const setAccessToken = (token) => {
  accessToken = token
}

const buildHeaders = (headers = {}) => {
  const nextHeaders = { ...headers }
  if (accessToken) {
    nextHeaders.Authorization = `Bearer ${accessToken}`
  }
  return nextHeaders
}

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: buildHeaders(options.headers),
  })

  if (response.status !== 401) {
    return parseResponse(response)
  }

  const refreshed = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!refreshed.ok) {
    setAccessToken(null)
    throw new Error('Session expiree')
  }

  const refreshData = await refreshed.json()
  setAccessToken(refreshData.access_token)

  const retry = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: buildHeaders(options.headers),
  })
  return parseResponse(retry)
}

async function parseResponse(response) {
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.detail ?? 'Erreur API')
  }

  return data
}
