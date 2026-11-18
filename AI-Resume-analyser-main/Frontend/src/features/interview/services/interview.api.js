import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData()
  formData.append('jobDescription', jobDescription)
  formData.append('selfDescription', selfDescription)

  if (resumeFile) {
    formData.append('resume', resumeFile)
  }

  const response = await api.post('/api/interview', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const getInterviewReportById = async ({ interviewId }) => {
  const response = await api.get(`/api/interview/report/${interviewId}`)
  return response.data
}

export const getAllInterviewReport = async ({ cursor } = {}) => {
  const response = await api.get('/api/interview', {
    params: { limit: 10, ...(cursor ? { cursor } : {}) },
  })
  return response.data
}

export const generateResumePdf = async ({ interviewReportId}) =>{
  const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`,null,{
    responseType:"blob"
  })
  return response.data
}
