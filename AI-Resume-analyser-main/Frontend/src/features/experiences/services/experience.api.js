import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

export const getExperiences = async ({ cursor } = {}) => {
  const response = await api.get('/api/experiences', {
    params: { limit: 10, ...(cursor ? { cursor } : {}) },
  })
  return response.data
}

export const createExperience = async (payload) => {
  const response = await api.post('/api/experiences', payload)
  return response.data
}
