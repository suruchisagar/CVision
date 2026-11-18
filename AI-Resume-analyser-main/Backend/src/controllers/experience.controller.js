const InterviewExperience = require('../models/experience.model')

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

async function createExperienceController(req, res) {
  const { company = '', role = '', experience = '' } = req.body

  if (!company.trim() || !role.trim() || !experience.trim()) {
    return res.status(400).json({
      message: 'Company, role, and interview experience are required',
    })
  }

  const interviewExperience = await InterviewExperience.create({
    company: company.trim(),
    role: role.trim(),
    experience: experience.trim(),
    user: req.user.id,
  })

  const populatedExperience = await interviewExperience.populate(
    'user',
    'username',
  )

  res.status(201).json({
    message: 'Interview experience shared successfully',
    interviewExperience: populatedExperience,
  })
}

async function getAllExperiencesController(req, res) {
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 25)
  const cursor = parseCursor(req.query.cursor)
  if (req.query.cursor && !cursor) {
    return res.status(400).json({ message: 'Invalid pagination cursor' })
  }

  const query = {}
  if (cursor) {
    query.$or = [
      { createdAt: { $lt: cursor.createdAt } },
      { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
    ]
  }

  const results = await InterviewExperience.find(query)
    .populate('user', 'username')
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)

  const hasMore = results.length > limit
  const interviewExperiences = hasMore ? results.slice(0, limit) : results

  res.status(200).json({
    interviewExperiences,
    pageInfo: {
      hasMore,
      nextCursor: hasMore ? toCursor(interviewExperiences[interviewExperiences.length - 1]) : null,
    },
  })
}

module.exports = { createExperienceController, getAllExperiencesController }
