import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'

const Protected = ({children}) => {
  const {loading , user} = useAuth()
  // const navigate = useNavigate()

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card auth-card--status">
          <h1>Loading your workspace...</h1>
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to={'/login'} />
  }

  return children
}

export default Protected
