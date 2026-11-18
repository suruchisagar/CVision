import '../auth.form.scss'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export const Login = () => {
  const { loading, error, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await handleLogin({ email, password })
      navigate('/')
    } catch {
      return
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card auth-card--status">
          <h1>Checking your session...</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">AI Resume Analyser</p>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">
          Sign in to generate interview reports and revisit your preparation
          plans.
        </p>

        <form onSubmit={handleSubmit}>
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

          <button className="button primary-button generate-btn" type="submit">
            Login
          </button>
        </form>
        {/* <p className='italic center'>----or----</p> */}
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
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  )
}
