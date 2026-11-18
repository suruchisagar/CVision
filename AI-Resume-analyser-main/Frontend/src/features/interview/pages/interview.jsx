import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'
import { useAuth } from '../../auth/hooks/useAuth'

export const Interview = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('technical')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { report, loading, error, getReportById, getResumePdf } = useInterview()

  useEffect(() => {
    if (!interviewId || report?._id === interviewId) {
      return
    }

    getReportById({ interviewId }).catch(() => {})
  }, [getReportById, interviewId, report?._id])

  const technical = report?.technicalQuestions ?? []
  const behavioral = report?.behavioralQuestions ?? []
  const skillGaps = report?.skillGaps ?? []
  const requirements = report?.requirementEvidence ?? []
  const roadmap = report?.preparationPlan ?? []

  const currentTechnical = technical[selectedIndex]
  const currentBehavioral = behavioral[selectedIndex]
  const currentRoadmap = roadmap[selectedIndex]

  // const handleLogout = async () => {
  //   try {
  //     await axios.post('/api/auth/logout', {}, { withCredentials: true })
  //   } catch (err) {
  //     console.log(err)
  //   }

  //   localStorage.removeItem('token')
  //   navigate('/login')
  // }
  const { handleLogout } = useAuth()

  const nextItem = () => {
    if (activeTab === 'technical' && selectedIndex < technical.length - 1) {
      setSelectedIndex((value) => value + 1)
    }

    if (activeTab === 'behavioral' && selectedIndex < behavioral.length - 1) {
      setSelectedIndex((value) => value + 1)
    }

    if (activeTab === 'roadmap' && selectedIndex < roadmap.length - 1) {
      setSelectedIndex((value) => value + 1)
    }
  }

  const previousItem = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((value) => value - 1)
    }
  }

  const changeTab = (tab) => {
    setActiveTab(tab)
    setSelectedIndex(0)
  }

  if (loading && !report) {
    return (
      <main className="interview-page">
        <div className="background-circle one"></div>
        <div className="background-circle two"></div>
        <div className="interview-container">
          <section className="content loading-state-card">
            <div className="spinner"></div>
            <h2>Loading your interview dashboard...</h2>
          </section>
        </div>
      </main>
    )
  }

  if (error && !report) {
    return (
      <main className="interview-page">
        <div className="background-circle one"></div>
        <div className="background-circle two"></div>
        <div className="interview-container">
          <section className="content empty-state">
            <h2>We couldn&apos;t load this report</h2>
            <p>{error}</p>
            <button className="primary-action" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </section>
        </div>
      </main>
    )
  }

  if (!report) {
    return (
      <main className="interview-page">
        <div className="background-circle one"></div>
        <div className="background-circle two"></div>
        <div className="interview-container">
          <section className="content empty-state">
            <h2>No report available</h2>
            <p>Generate a new interview plan to see the dashboard here.</p>
            <button className="primary-action" onClick={() => navigate('/')}>
              Generate a Report
            </button>
          </section>
        </div>
      </main>
    )
  }

  const matchScore = report.matchScore ?? 0

  return (
    <main className="interview-page">
      <button className="generate-btn active logout" onClick={handleLogout}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"></path>
        </svg>
      </button>
      <div className="background-circle one"></div>
      <div className="background-circle two"></div>

      <div className="interview-container">
        <div className="page-header">
          <div>
            <p className="badge">{report.title}</p>
            <h1>Interview Preparation Dashboard</h1>
            <p>
              Practice targeted questions, fix your gaps, and follow a practical
              prep roadmap for this role.
            </p>
          </div>

          <div className="score-card">
            <h4>Match Score</h4>
            <div className="score-circle">{matchScore}%</div>
            <div className="match-status">
              <strong>
                {matchScore >= 80
                  ? 'Strong fit'
                  : matchScore >= 60
                    ? 'Promising fit'
                    : 'Needs preparation'}
              </strong>
              <p>{report.title}</p>
            </div>
          </div>
        </div>

        <div className="dashboard">
          <aside className="sidebar">
            <div>
              <button
                className={activeTab === 'technical' ? 'active' : ''}
                onClick={() => changeTab('technical')}
              >
                Technical Questions
              </button>

              <button
                className={activeTab === 'behavioral' ? 'active' : ''}
                onClick={() => changeTab('behavioral')}
              >
                Behavioral Questions
              </button>

              <button
                className={activeTab === 'roadmap' ? 'active' : ''}
                onClick={() => changeTab('roadmap')}
              >
                Preparation Roadmap
              </button>
            </div>

            <button
              className="generate-btn active"
              onClick={() => getResumePdf(interviewId)}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                style={{ marginRight: '0.8rem' }}
              >
                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
              </svg>
              {loading
                ? 'Downloading . . . . .'
                : 'Download Resume'}
              
            </button>
          </aside>

          <section className="content">
            {activeTab === 'technical' && currentTechnical ? (
              <>
                <div className="content-header">
                  <span className="question-chip">
                    Question {selectedIndex + 1} of {technical.length}
                  </span>
                </div>

                <div className="card">
                  <h2>Question</h2>
                  <p>{currentTechnical.question}</p>
                </div>

                <div className="card">
                  <h2>Interviewer&apos;s Intention</h2>
                  <p>{currentTechnical.intention}</p>
                </div>

                <div className="card">
                  <h2>Recommended Answer</h2>
                  <p>{currentTechnical.answer}</p>
                </div>
              </>
            ) : null}

            {activeTab === 'behavioral' && currentBehavioral ? (
              <>
                <div className="content-header">
                  <span className="question-chip">
                    Question {selectedIndex + 1} of {behavioral.length}
                  </span>
                </div>

                <div className="card">
                  <h2>Question</h2>
                  <p>{currentBehavioral.question}</p>
                </div>

                <div className="card">
                  <h2>Interviewer&apos;s Intention</h2>
                  <p>{currentBehavioral.intention}</p>
                </div>

                <div className="card">
                  <h2>Recommended Answer</h2>
                  <p>{currentBehavioral.answer}</p>
                </div>
              </>
            ) : null}

            {activeTab === 'roadmap' && currentRoadmap ? (
              <div className="card timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h2>Day {currentRoadmap.day}</h2>
                    <h3>{currentRoadmap.focus}</h3>
                    <ul>
                      {currentRoadmap.task.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === 'technical' && technical.length === 0 ? (
              <div className="empty-state compact-empty-state">
                <h2>No technical questions yet</h2>
                <p>This report did not include technical prompts.</p>
              </div>
            ) : null}

            {activeTab === 'behavioral' && behavioral.length === 0 ? (
              <div className="empty-state compact-empty-state">
                <h2>No behavioral questions yet</h2>
                <p>This report did not include behavioral prompts.</p>
              </div>
            ) : null}

            {activeTab === 'roadmap' && roadmap.length === 0 ? (
              <div className="empty-state compact-empty-state">
                <h2>No preparation roadmap yet</h2>
                <p>This report did not include a day-by-day plan.</p>
              </div>
            ) : null}

            <div className="navigation">
              <button onClick={previousItem} disabled={selectedIndex === 0}>
                Previous
              </button>

              <button onClick={nextItem}>Next</button>
            </div>
          </section>

          <aside className="skill-panel">
            <div>
              <h3>Skill Gaps</h3>
              <p className="score-explanation">Score uses weighted, evidence-based skill coverage.</p>
              <div className="skills">
                {skillGaps.length ? (
                  skillGaps.map((skill, index) => (
                    <div className="skill-card" key={index}>
                      <span>{skill.skill}</span>
                      <small className={`severity ${skill.severity}`}>
                        {skill.severity}
                      </small>
                    </div>
                  ))
                ) : (
                  <div className="skill-card">
                    <span>
                      No major skill gaps were flagged in this report.
                    </span>
                  </div>
                )}
              </div>
            </div>
            {requirements.length ? <div className="evidence-list"><h3>Match evidence</h3>{requirements.map((requirement) => <div className="evidence-card" key={requirement.skill}><strong>{requirement.skill}</strong><small>{requirement.matched ? 'Found in profile' : 'Not found in profile'} · weight {requirement.weight}</small><p>{requirement.candidateEvidence || requirement.jobEvidence}</p></div>)}</div> : null}
          </aside>
        </div>
      </div>
    </main>
  )
}
