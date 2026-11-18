import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.provider.jsx'
import { InterviewProvider } from './features/interview/interview.provider.jsx'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
        <Analytics />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
