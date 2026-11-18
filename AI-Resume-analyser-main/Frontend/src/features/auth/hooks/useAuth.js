import { useContext, useEffect } from 'react'
import { AuthContext } from '../auth.context'
import { login, register, logout, getMe } from '../services/auth.api'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const { user, setUser, loading, setLoading, error, setError } = context

  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    setError('')

    try {
      const data = await login({ email, password })
      setUser(data.user)
      return data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to login right now.'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)
    setError('')

    try {
      const data = await register({ username, email, password })
      setUser(data.user)
      return data.user
    } catch (error) {
      const message =
        error.response?.data?.message || 'Unable to create your account right now.'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    setError('')

    try {
      await logout()
      setUser(null)
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to logout right now.'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getAndSetUser()
  }, [setLoading, setUser])

  return { user, loading, error, handleLogin, handleLogout, handleRegister }
}
