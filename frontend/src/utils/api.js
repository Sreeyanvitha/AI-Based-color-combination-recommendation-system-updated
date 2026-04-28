import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export async function analyzeOutfit({ outfitFile, skinTone, occasion, skinFile }) {
  const formData = new FormData()
  formData.append('outfit', outfitFile)
  formData.append('skin_tone', skinTone)
  formData.append('occasion', occasion)
  if (skinFile) formData.append('skin_image', skinFile)

  const { data } = await api.post('/api/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function detectSkinTone(skinFile) {
  const formData = new FormData()
  formData.append('skin_image', skinFile)
  const { data } = await api.post('/api/detect-skin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function checkHealth() {
  const { data } = await api.get('/health')
  return data
}
