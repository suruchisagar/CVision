import { useCallback, useContext } from 'react'
import {
  getAllInterviewReport,
  getInterviewReportById,
  generateInterviewReport,
  generateResumePdf
} from '../services/interview.api'
import { InterviewContext } from '../interview.context'

export const useInterview = () => {
  const context = useContext(InterviewContext)

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }

  const {
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
  } = context

  const generateReport = useCallback(
    async ({ jobDescription, selfDescription, resumeFile }) => {
      setLoading(true)
      setError('')

      try {
        const response = await generateInterviewReport({
          jobDescription,
          selfDescription,
          resumeFile,
        })

        setReport(response.interviewReport)
        setReports((currentReports) => [response.interviewReport, ...currentReports])
        return response.interviewReport
      } catch (error) {
        const message =
          error.response?.data?.message || 'Unable to generate the report right now.'
        setError(message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setError, setLoading, setReport, setReports]
  )

  const getReportById = useCallback(
    async ({ interviewId }) => {
      setLoading(true)
      setError('')

      try {
        const response = await getInterviewReportById({ interviewId })
        setReport(response.interviewReport)
        return response.interviewReport
      } catch (error) {
        const message =
          error.response?.data?.message || 'Unable to load this interview report.'
        setError(message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setError, setLoading, setReport]
  )

  const getReports = useCallback(async ({ cursor } = {}) => {
    setLoading(true)
    setError('')

    try {
      const response = await getAllInterviewReport({ cursor })
      setReports((current) => cursor ? [...current, ...response.interviewReports] : response.interviewReports)
      setNextReportCursor(response.pageInfo?.nextCursor || null)
      return response.interviewReports
    } catch (error) {
      const message =
        error.response?.data?.message || 'Unable to load your saved reports.'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, setReports, setNextReportCursor])

  const getResumePdf= async(interviewReportId)=>{
    setLoading(true)
    try {
      const response = await generateResumePdf({interviewReportId})
      const url = window.URL.createObjectURL(new Blob([response],{type:'application/pdf'}))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute("download",`resume_${interviewReportId}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
  }

  return { loading, error, report, reports, nextReportCursor, generateReport, getReportById, getReports, getResumePdf}
}
