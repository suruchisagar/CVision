import { useState } from 'react'
import { InterviewContext } from './interview.context'

export const InterviewProvider = ({ children }) => {
  const [report, setReport] = useState(null)
  const [reports, setReports] = useState([])
  const [nextReportCursor, setNextReportCursor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <InterviewContext.Provider
      value={{
        report,
        setReport,
        reports,
        setReports,
        nextReportCursor,
        setNextReportCursor,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}
