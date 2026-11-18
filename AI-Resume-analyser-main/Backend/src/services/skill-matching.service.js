const SKILLS = [
  { skill: 'JavaScript', aliases: ['javascript', 'ecmascript'], weight: 5 },
  { skill: 'TypeScript', aliases: ['typescript'], weight: 5 },
  { skill: 'React', aliases: ['react', 'react.js', 'reactjs'], weight: 5 },
  { skill: 'Node.js', aliases: ['node.js', 'nodejs', 'node'], weight: 5 },
  { skill: 'Express.js', aliases: ['express', 'express.js'], weight: 4 },
  { skill: 'MongoDB', aliases: ['mongodb', 'mongo db'], weight: 4 },
  { skill: 'SQL', aliases: ['sql', 'mysql', 'postgresql', 'postgres'], weight: 4 },
  { skill: 'REST APIs', aliases: ['rest api', 'restful api', 'restapis'], weight: 4 },
  { skill: 'Python', aliases: ['python'], weight: 5 },
  { skill: 'Java', aliases: ['java'], weight: 4 },
  { skill: 'Docker', aliases: ['docker', 'containerization'], weight: 3 },
  { skill: 'AWS', aliases: ['aws', 'amazon web services'], weight: 3 },
  { skill: 'Git', aliases: ['git', 'github', 'gitlab'], weight: 2 },
  { skill: 'Machine Learning', aliases: ['machine learning'], weight: 5 },
  { skill: 'System Design', aliases: ['system design', 'system-design'], weight: 4 },
]

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findEvidence(text, aliases) {
  const normalized = String(text || '').replace(/\s+/g, ' ')
  for (const alias of aliases) {
    const expression = new RegExp(`(^|[^a-z0-9])${escapeRegex(alias)}(?=$|[^a-z0-9])`, 'i')
    const match = expression.exec(normalized)
    if (match) {
      const start = Math.max(0, match.index - 55)
      const end = Math.min(normalized.length, match.index + match[0].length + 55)
      return normalized.slice(start, end).trim()
    }
  }
  return null
}

function isPreferredRequirement(jobDescription, aliases) {
  const text = String(jobDescription || '')
  for (const alias of aliases) {
    const skill = escapeRegex(alias)
    const qualifier = '(?:nice to have|good to have|preferred|bonus|desirable|plus)'
    const before = new RegExp(`${qualifier}[^.\n:;]{0,20}${skill}`, 'i')
    const after = new RegExp(`${skill}(?:\\s+is)?\\s*(?:a\\s+)?${qualifier}`, 'i')
    if (before.test(text) || after.test(text)) return true
  }
  return false
}

function analyseSkillMatch({ resume = '', selfDescription = '', jobDescription = '' }) {
  const candidateText = `${resume}\n${selfDescription}`
  const requirements = SKILLS.map((definition) => {
    const jobEvidence = findEvidence(jobDescription, definition.aliases)
    if (!jobEvidence) return null

    const candidateEvidence = findEvidence(candidateText, definition.aliases)
    const required = !isPreferredRequirement(jobDescription, definition.aliases)
    const weight = required ? definition.weight : Math.max(1, definition.weight - 2)

    return {
      skill: definition.skill,
      required,
      weight,
      matched: Boolean(candidateEvidence),
      jobEvidence,
      candidateEvidence,
    }
  }).filter(Boolean)

  const totalWeight = requirements.reduce((total, item) => total + item.weight, 0)
  const matchedWeight = requirements
    .filter((item) => item.matched)
    .reduce((total, item) => total + item.weight, 0)

  // No recognised requirements means there is insufficient deterministic evidence,
  // rather than an inaccurate low score.
  const matchScore = totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0
  const missingRequirements = requirements.filter((item) => !item.matched)
  const matchedRequirements = requirements.filter((item) => item.matched)

  return {
    matchScore,
    scoringMethod: 'weighted_skill_coverage_v1',
    requirements,
    matchedRequirements,
    missingRequirements,
    skillGaps: missingRequirements.map((item) => ({
      skill: item.skill,
      severity: item.weight >= 5 ? 'high' : item.weight >= 3 ? 'medium' : 'low',
    })),
  }
}

module.exports = { analyseSkillMatch }
