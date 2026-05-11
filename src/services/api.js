const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '')

function getApiOrigin() {
  try {
    return new URL(API_BASE_URL).origin
  } catch {
    return ''
  }
}

export function resolveBackendUrl(url) {
  if (!url || typeof url !== 'string') return url
  if (/^https?:\/\//i.test(url)) return url

  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  const origin = getApiOrigin()

  // Absolute API base bo'lsa (Render), media/file URL larini ham backend domeniga yo'naltiramiz.
  if (origin) return `${origin}${normalizedPath}`

  // Relative API base bo'lsa (local proxy), mavjud origin orqali ishlaydi.
  return normalizedPath
}

function getAccessToken() {
  return localStorage.getItem('access_token')
}

async function request(path, options = {}) {
  const { auth = false, headers = {}, body, ...rest } = options
  const isFormData = body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(auth && getAccessToken()
        ? { Authorization: `Bearer ${getAccessToken()}` }
        : {}),
      ...headers,
    },
    body,
    ...rest,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null
        ? data.detail || data.message || JSON.stringify(data)
        : `Request failed: ${response.status}`

    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function fetchWriters() {
  return request('/writers/')
}

export async function fetchWorks(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/works/${query ? '?' + query : ''}`)
}

export async function fetchArticles() {
  return request('/articles/')
}

export async function fetchHomeArticles() {
  return request('/articles/home/')
}

export async function fetchTags() {
  return request('/articles/tags/')
}

export async function fetchScholarships() {
  return request('/meta/scholarships/')
}

export async function fetchTests() {
  return request('/meta/tests/')
}

export async function fetchTestDetail(slug) {
  return request(`/meta/tests/${slug}/`)
}

export async function submitTest(slug, payload) {
  return request(`/meta/tests/${slug}/submit/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function askAIChat(message, history = []) {
  return request('/meta/ai-chat/', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  })
}

export async function applyScholarship(slug, payload) {
  return request(`/meta/scholarships/${slug}/apply/`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  })
}

export async function fetchWriter(slug) {
  return request(`/writers/${slug}/`)
}

export async function fetchWork(slug) {
  return request(`/works/${slug}/`)
}

export async function fetchArticle(slug) {
  return request(`/articles/${slug}/`)
}

export async function loginUser(payload) {
  return request('/users/auth/login/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function registerUser(payload) {
  return request('/users/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createArticle(formData) {
  return request('/articles/create/', {
    method: 'POST',
    auth: true,
    body: formData,
  })
}

export async function fetchProfile() {
  return request('/users/me/', { auth: true })
}

export async function updateProfile(payload) {
  return request('/users/me/update/', {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  })
}

export async function fetchMyArticles() {
  return request('/articles/my-articles/', { auth: true })
}
