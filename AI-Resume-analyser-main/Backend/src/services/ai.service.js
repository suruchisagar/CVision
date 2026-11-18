const { GoogleGenAI } = require('@google/genai')
const { z, toJSONSchema } = require('zod')
const puppeteer = require("puppeteer")

const ai = process.env.GOOGLE_GENAI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })
  : null

const interviewReportSchema = z.object({
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe('The technical questions that can be asked in an interview'),
        intention: z
          .string()
          .describe('The intention of interviewer behind this question'),
        answer: z
          .string()
          .describe('How to answer this question and what points to cover'),
      })
    )
    .describe('Technical questions that can be asked in the interview'),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe('The behavioral questions that can be asked in an interview'),
        intention: z
          .string()
          .describe('The intention of interviewer behind this question'),
        answer: z
          .string()
          .describe('How to answer this question and what points to cover'),
      })
    )
    .describe('Behavioral questions that can be asked in the interview'),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe('The day number in the preparation plan'),
        focus: z
          .string()
          .describe('The main focus area of the day in the preparation plan'),
        task: z
          .array(z.string())
          .describe('List of tasks to be done on this day'),
      })
    )
    .describe('A day-wise preparation plan for the candidate'),
  title: z.string().describe('The title of the job for which the interview report is generated'),
})

function pickTitle(jobDescription) {
  const firstLine = jobDescription
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)

  return firstLine || 'Target Role'
}

function buildFallbackReport({ jobDescription }) {
  return {
    title: pickTitle(jobDescription),
    technicalQuestions: [
      {
        question: 'Walk me through a project that is closest to this role.',
        intention: 'The interviewer wants to measure relevance, ownership, and technical depth.',
        answer:
          'Explain the problem, your stack choices, the tradeoffs you made, and the measurable result you achieved.',
      },
      {
        question: 'How would you improve performance or scalability in a product like this?',
        intention: 'The interviewer is testing practical engineering judgment.',
        answer:
          'Describe how you identify bottlenecks, measure current behavior, implement targeted fixes, and validate the outcome.',
      },
      {
        question: 'Which part of the required stack would you be ready to use on day one?',
        intention: 'The interviewer wants clarity on readiness and ramp-up areas.',
        answer:
          'Be direct about your strongest tools, then mention one weaker area and the plan to close that gap quickly.',
      },
    ],
    behavioralQuestions: [
      {
        question: 'Tell me about a time you had to learn something quickly to deliver.',
        intention: 'The interviewer is assessing adaptability and follow-through.',
        answer:
          'Use a STAR structure, show the learning approach you used, and end with the concrete result you delivered.',
      },
      {
        question: 'Describe a situation where feedback improved your work.',
        intention: 'The interviewer wants to see coachability and collaboration.',
        answer:
          'Share the original issue, the feedback you received, how you applied it, and what improved afterward.',
      },
      {
        question: 'How do you handle competing priorities when deadlines are tight?',
        intention: 'The interviewer is checking prioritization and communication habits.',
        answer:
          'Explain how you clarify impact, align on priorities, communicate risks early, and keep stakeholders informed.',
      },
    ],
    preparationPlan: [
      {
        day: 1,
        focus: 'Role breakdown',
        task: [
          'Extract the key responsibilities and must-have skills from the job description.',
          'Map your strongest projects and experiences to those requirements.',
        ],
      },
      {
        day: 2,
        focus: 'Technical stories',
        task: [
          'Prepare two project walkthroughs with problem, solution, tradeoffs, and results.',
          'Practice explaining architecture decisions in simple terms.',
        ],
      },
      {
        day: 3,
        focus: 'Gap reduction',
        task: [
          'Review the top missing skills flagged in this report.',
          'Build short notes, examples, or mini demos for each one.',
        ],
      },
      {
        day: 4,
        focus: 'Mock interview practice',
        task: [
          'Answer the technical and behavioral questions aloud.',
          'Refine answers to stay concise, specific, and evidence-based.',
        ],
      },
      {
        day: 5,
        focus: 'Mock interview practice',
        task: [
          'Answer the technical and behavioral questions aloud.',
          'Refine answers to stay concise, specific, and evidence-based.',
        ],
      },
      {
        day: 6,
        focus: 'Mock interview practice',
        task: [
          'Answer the technical and behavioral questions aloud.',
          'Refine answers to stay concise, specific, and evidence-based.',
        ],
      },
      {
        day: 7,
        focus: 'Mock interview practice',
        task: [
          'Answer the technical and behavioral questions aloud.',
          'Refine answers to stay concise, specific, and evidence-based.',
        ],
      },
    ],
  }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription, matching }) {
  if (!ai) {
    return { ...buildFallbackReport({ jobDescription }), ...matching }
  }

  const prompt = `You are an experienced Technical Interviewer, Senior Hiring Manager, and Career Coach with expertise in evaluating candidates for software engineering and technology roles.

Your task is to generate a comprehensive interview report based ONLY on the information provided below.

=========================
INPUT
=========================

Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

=========================
OBJECTIVE
=========================

Carefully analyze the candidate's resume, self-description, and the target job description.

Generate a professional interview report that accurately evaluates the candidate's suitability for the role.

The report should help both recruiters and candidates understand:

- Strengths
- Weaknesses
- Missing skills
- Interview readiness
- Areas for improvement
- A practical preparation roadmap

=========================
IMPORTANT RULES
=========================

• Use ONLY information present in the Resume and Self Description.

• Never invent:
  - projects
  - companies
  - internships
  - certifications
  - achievements
  - technologies
  - work experience
  - education
  - dates

• If information is missing, acknowledge the gap instead of fabricating details.

• Analyze the Job Description before generating the report.

• Compare the candidate against the job requirements.

• Keep the evaluation objective, professional, and evidence-based.

• Do not exaggerate strengths or weaknesses.

=========================
MATCH SCORE
=========================

The application calculates the match score and skill gaps deterministically.
Do not return a match score or skill-gap list. Use the evidence below only to prioritize interview questions and the preparation plan:

${JSON.stringify(matching.requirements)}

=========================
SUMMARY
=========================

Write a concise professional evaluation (3–6 sentences).

Mention:

- Overall fit
- Strongest qualities
- Biggest gaps
- Interview readiness

Avoid generic statements.

=========================
TECHNICAL QUESTIONS
=========================

Generate 5-10 challenging interview questions tailored to:

- Candidate's resume
- Target job
- Technologies mentioned

For each question provide:

- Question
- Interviewer's intention
- Ideal answer

Questions should test understanding rather than memorization.

Avoid trivial questions.

=========================
BEHAVIORAL QUESTIONS
=========================

Generate 5-10 realistic behavioral questions that assess:

- Communication
- Teamwork
- Leadership
- Conflict resolution
- Learning ability
- Ownership
- Time management
- Problem solving

For each question provide:

- Question
- Interviewer's intention
- Strong sample answer using the STAR framework.

=========================
SKILL GAPS
=========================

Do not return skill gaps. Missing skills are computed by the application from the evidence above.

=========================
PREPARATION PLAN
=========================

Create a practical preparation roadmap for atleast a week.

Each day should include:

- Day number
- Focus area
- 3–5 actionable tasks

Prioritize the highest-impact topics first.

Avoid vague advice.

=========================
RECOMMENDATIONS
=========================

Provide concise recommendations that would most improve the candidate's chances.

Recommendations should be actionable.

Examples:

- Improve SQL joins
- Learn JWT authentication
- Practice REST API design
- Add measurable project outcomes
- Strengthen React state management

Do not recommend technologies unrelated to the target role.

=========================
OUTPUT
=========================

Return ONLY valid JSON.

Do NOT include:

- Markdown
- Code fences
- Explanations
- Comments
- Additional text

The JSON MUST exactly match the provided schema.

Every required field must be present.

All arrays must contain meaningful content whenever sufficient information exists.

Return nothing except the JSON object.`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: toJSONSchema(interviewReportSchema),
      },
    })

    return { ...JSON.parse(response.text), ...matching }
  } catch (error) {
    console.error('Gemini API Error:', error)
    return { ...buildFallbackReport({ jobDescription }), ...matching }
  }
}

async function generateLegacyPdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "load",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
}

async function generateLegacyResumePdf({resume , selfDescription , jobDescription}){
  const resumepdfSchema = z.object({
    html:z.string().describe("The HTML content of the resume which can be converted to pdf using any library like puppeteer")
  })

  const prompt =`You are a senior resume writer and professional document designer with 15+ years of experience creating resumes for FAANG, Fortune 500, startups, and ATS systems.

Your goal is to produce a resume that could realistically be delivered by a professional resume writing agency.

=========================
INPUT
=========================

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

=========================
OBJECTIVE
=========================

Rewrite and redesign the resume specifically for the target job description.

The final resume must be:

• ATS friendly
• Human-written
• Modern
• Professional
• Information dense
• Limited to ONE A4 page

The resume should maximize the use of the available page space while maintaining excellent readability.

Never leave large empty areas.

=========================
CONTENT RULES
=========================

Use ONLY information contained in:

- Resume
- Self Description

Never invent:

- companies
- projects
- internships
- work experience
- certifications
- dates
- education
- technologies
- achievements
- awards

If information does not exist,
DO NOT fabricate it.

Instead,
remove that section.

=========================
TAILORING
=========================

Analyze the target job description.

Determine:

- important skills
- important keywords
- preferred technologies
- responsibilities
- required soft skills

Rewrite the resume so the candidate's genuine experience is presented using the terminology used in the job description.

Use ATS keywords naturally.

Do NOT keyword stuff.

=========================
WRITING STYLE
=========================

Write like a senior resume consultant.

Every bullet should:

• begin with a strong action verb

Examples:

Developed
Designed
Built
Implemented
Optimized
Integrated
Reduced
Improved
Created
Automated
Analyzed
Led

Avoid weak phrases like:

Responsible for
Worked on
Helped
Participated in

Every sentence should be concise.

Remove unnecessary words.

Avoid repetition.

=========================
SECTION PRIORITY
=========================

Choose sections dynamically.

Typical order:

Name

Contact

Professional Summary

Technical Skills

Experience (if available)

Projects

Education

Achievements

Certifications

Links

Only include sections that have meaningful content.

=========================
PROJECTS
=========================

Projects should look like professional software engineering resumes.

Each project should contain:

Project Name

Tech Stack

3–5 concise impact-focused bullet points.

Mention:

• architecture
• APIs
• authentication
• database
• deployment
• performance
• AI integration
• scalability

only if actually present.

=========================
SKILLS
=========================

Group skills.

Example:

Languages

Frontend

Backend

Database

AI / ML

Cloud

Tools

Frameworks

Do NOT create long paragraphs.

=========================
SUMMARY
=========================

Maximum 4 lines.

Tailor it for the target role.

Do NOT use generic statements.

=========================
DESIGN
=========================

Act like a professional resume designer.

The page should look similar to resumes created in:

- Novoresume
- FlowCV
- Reactive Resume
- Enhancv

Requirements:

• Modern typography

• Strong hierarchy

• Consistent spacing

• Balanced whitespace

• Thin dividers

• Bold section headings

• Professional alignment

• Compact layout

• No unnecessary empty areas

• Fit naturally on ONE A4 page

It should me one column format.

=========================
HTML REQUIREMENTS
=========================

Generate a COMPLETE HTML document.

Must include:

<!DOCTYPE html>

<html>

<head>

<body>

Use ONLY:

HTML

Inline CSS

No JavaScript.

No Tailwind.

No Bootstrap.

No external CSS.

No images.

No SVG.

No icons.

No CDN.

No web fonts.

Use only system fonts.

=========================
PRINT REQUIREMENTS
=========================

The HTML will be rendered using Chromium/Puppeteer.

Therefore:

- A4 portrait

- print optimized

- avoid page breaks

- avoid overflowing content

- use box-sizing:border-box

- use mm units for margins

- use flexbox or CSS grid

- keep everything on one page

=========================
JSON OUTPUT
=========================

Return ONLY

{
  "html": "<complete HTML document>"
}

No markdown.

No explanation.

No code fences.

Return only valid JSON.`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: toJSONSchema(resumepdfSchema),
      },
  })
  const jsonContent = JSON.parse(response.text)

  // console.log(jsonContent)

  const pdfBuffer = await generateLegacyPdfFromHtml(jsonContent.html)

//   console.log("PDF Buffer:", pdfBuffer);
// console.log("Buffer Length:", pdfBuffer?.length);

  return pdfBuffer
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildResumeHtml(data) {
  const skills = (data.skills || []).map(escapeHtml).join(' · ')
  const sections = (data.sections || []).map((section) => `
    <section>
      <h2>${escapeHtml(section.heading)}</h2>
      ${section.items.map((item) => `<div class="item"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.subtitle || '')}</p><ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul></div>`).join('')}
    </section>`).join('')

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 12mm; } * { box-sizing: border-box; }
    body { color:#172033; font-family:Arial, Helvetica, sans-serif; font-size:9.5pt; line-height:1.35; margin:0; }
    header { border-bottom:2px solid #1f4b7a; padding-bottom:8px; margin-bottom:9px; }
    h1 { font-size:22pt; margin:0 0 3px; } .contact { color:#44546a; margin:0; }
    .summary { margin:8px 0 0; } h2 { color:#1f4b7a; border-bottom:1px solid #cbd5e1; font-size:11pt; letter-spacing:.04em; margin:10px 0 5px; padding-bottom:2px; text-transform:uppercase; }
    h3 { font-size:10pt; margin:5px 0 1px; } p { margin:1px 0; } ul { margin:3px 0 6px; padding-left:17px; } li { margin:1px 0; }.skills { margin:0; }
  </style></head><body><header><h1>${escapeHtml(data.name || 'Candidate')}</h1><p class="contact">${escapeHtml(data.contact || '')}</p>${data.summary ? `<p class="summary">${escapeHtml(data.summary)}</p>` : ''}</header>${skills ? `<section><h2>Skills</h2><p class="skills">${skills}</p></section>` : ''}${sections}</body></html>`
}

async function renderResumePdf(htmlContent) {
  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'load' })
    return await page.pdf({ format: 'A4', printBackground: true })
  } finally {
    await browser.close()
  }
}

const resumeContentSchema = z.object({
  name: z.string(),
  contact: z.string(),
  summary: z.string(),
  skills: z.array(z.string()).max(24),
  sections: z.array(z.object({
    heading: z.string(),
    items: z.array(z.object({
      title: z.string(),
      subtitle: z.string(),
      bullets: z.array(z.string()).max(5),
    })).max(5),
  })).max(5),
})

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  let content = {
    name: 'Candidate', contact: '', summary: selfDescription || '', skills: [],
    sections: [{ heading: 'Resume', items: [{ title: '', subtitle: '', bullets: [resume || selfDescription || 'No resume information provided.'] }] }],
  }

  if (ai) {
    const prompt = `Rewrite only the factual content in this resume for the target role. Never invent facts. Return JSON matching the schema: name, contact, summary, skills, and sections. Sections can be Experience, Projects, Education, or Certifications. Keep content concise enough for one A4 page.\n\nResume:\n${resume}\n\nSelf description:\n${selfDescription}\n\nTarget job description:\n${jobDescription}`
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', contents: prompt,
      config: { responseMimeType: 'application/json', responseJsonSchema: toJSONSchema(resumeContentSchema) },
    })
    content = resumeContentSchema.parse(JSON.parse(response.text))
  }

  return renderResumePdf(buildResumeHtml(content))
}

module.exports = { generateInterviewReport, generateResumePdf }
