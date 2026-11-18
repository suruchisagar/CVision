const { PDFParse } = require('pdf-parse')
const {generateInterviewReport , generateResumePdf} = require('../services/ai.service')
const interviewReportModel = require('../models/interview.model')
const { analyseSkillMatch } = require('../services/skill-matching.service')

function parseCursor(cursor) {
  if (!cursor) return null
  try {
    const value = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'))
    if (!value.createdAt || !value.id) throw new Error('Invalid cursor')
    return { createdAt: new Date(value.createdAt), id: value.id }
  } catch {
    return null
  }
}

function toCursor(document) {
  return Buffer.from(JSON.stringify({
    createdAt: document.createdAt.toISOString(),
    id: document._id.toString(),
  })).toString('base64url')
}

/**
 * @description Controller to generate interview report based on user self description , resume and job description
 */

async function generateInterviewReportController(req, res) {
  const { selfDescription = '', jobDescription = '' } = req.body

  if (!jobDescription.trim()) {
    return res.status(400).json({
      message: 'Job description is required',
    })
  }

  if (!req.file && !selfDescription.trim()) {
    return res.status(400).json({
      message: 'Upload a resume or provide a self description',
    })
  }

  let resumeText = ''

  if (req.file) {
    const parser = new PDFParse({ data: Uint8Array.from(req.file.buffer) })
    const parsedResume = await parser.getText()
    resumeText = parsedResume.text.trim()
    await parser.destroy()
  }

  const matching = analyseSkillMatch({
    resume: resumeText,
    selfDescription: selfDescription.trim(),
    jobDescription: jobDescription.trim(),
  })

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeText,
    selfDescription: selfDescription.trim(),
    jobDescription: jobDescription.trim(),
    matching: {
      matchScore: matching.matchScore,
      scoringMethod: matching.scoringMethod,
      skillGaps: matching.skillGaps,
      requirementEvidence: matching.requirements,
    },
  })

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeText,
    selfDescription: selfDescription.trim(),
    jobDescription: jobDescription.trim(),
    ...interviewReportByAi,
  })

  res.status(201).json({
    message: 'Interview report generated successfully',
    interviewReport,
  })
}

/**
 * @description Controller to get interview report be interviewId
 */

async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  })

  if (!interviewReport) {
    return res.status(404).json({
      message: 'Interview report not found',
    })
  }

  res.status(200).json({
    message: 'Interview report fetched successfully.',
    interviewReport,
  })
}

/**
 * @description Controller to get all interview report by logged in user
 */

async function getAllInterviewReportaController(req, res) {
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 25)
  const cursor = parseCursor(req.query.cursor)
  if (req.query.cursor && !cursor) {
    return res.status(400).json({ message: 'Invalid pagination cursor' })
  }

  const query = { user: req.user.id }
  if (cursor) {
    query.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
    ]
  }

  const results = await interviewReportModel
    .find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .select('title matchScore createdAt updatedAt')

  const hasMore = results.length > limit
  const interviewReports = hasMore ? results.slice(0, limit) : results

  res.status(200).json({
    message: 'Interview reports fetched successfully.',
    interviewReports,
    pageInfo: {
      hasMore,
      nextCursor: hasMore ? toCursor(interviewReports[interviewReports.length - 1]) : null,
    },
  })
}

/**
 * @description Controller to generate pdf report based on user self description , resume and job description
 */
async function generateResumePdfController(req,res){
  const {interviewReportId} = req.params
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewReportId,
    user: req.user.id,
  })

  if(!interviewReport){
    return res.status(404).json({
      message:"Interview Report Not Found."
    })
  }

  const {resume , jobDescription , selfDescription} = interviewReport

  const pdfBuffer = await generateResumePdf({resume ,jobDescription , selfDescription })

  res.set({
    "Content-Type" : "application/pdf",
    "Content-Disposition":`attachment;filename = resume_${interviewReportId}.pdf`
  })

  return res.send(pdfBuffer);
}



module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportaController,
  generateResumePdfController
}
