import '../auth.form.scss'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export const Register = () => {
  const navigate = useNavigate()
  const { loading, error, handleRegister } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await handleRegister({ username, email, password })
      navigate('/')
    } catch {
      return
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card auth-card--status">
          <h1>Preparing your workspace...</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">AI Resume Analyser</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Save reports, compare roles, and build a focused prep plan for every
          application.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
            />
          </div>

          {error ? <p className="form-message error">{error}</p> : null}

          <button className="generate-btn" type="submit">
            Register
          </button>
        </form>
        <button
          type="button"
          className="button primary-button generate-btn"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
          }}
        >
          Continue with Google
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  )
}
