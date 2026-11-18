# AI Resume Analyzer 🚀

An AI-powered resume analysis and interview preparation platform that helps candidates evaluate their resumes against job descriptions, identify skill gaps, generate personalized insights, and analyze interview experiences using Generative AI.

The project combines **MERN stack development, Generative AI, automated evaluation** to provide an end-to-end career preparation platform.

---

## 📌 Features

### 📄 Resume Analysis

* Upload and analyze resumes using AI.
* Extract relevant information such as:
  * Skills
  * Education
  * Projects
  * Experience
  * Certifications
  * Technologies
* Identify strengths and weaknesses in the resume.
* Generate structured resume feedback.

### 🎯 ATS & Job Description Matching

* Compare a resume against a given Job Description.
* Generate an AI-based match score.
* Identify:
  * Matching skills
  * Missing skills
  * Relevant keywords
  * Experience gaps
  * Job-specific recommendations

### 🤖 AI-Powered Interview Report

Generate structured interview reports using the **Gemini API**.

The system can analyze an interview experience and extract:

* Interview rounds
* Questions asked
* Technical topics
* Difficulty
* Skills being evaluated
* Candidate performance indicators
* Areas that require further preparation

### 🏷️ Interview Question Classification

The planned interview-analysis pipeline can automatically classify questions into rounds such as:

```text
OA
Communication
Technical
HR
Managerial
```

Questions can additionally receive topic tags such as:

```text
Array
String
SQL
Express.js
Docker
Python
Machine Learning
DBMS
Operating Systems
System Design
```

Example:

```json
{
  "round": "Technical",
  "question": "How does Express middleware work?",
  "tags": ["Node.js", "Express.js", "Backend"]
}
```

### 🔐 Authentication & Security

* JWT-based authentication
* HTTP-only cookies
* Protected routes
* Token blacklisting
* Secure authentication flow
* Input sanitization
* API rate limiting
* Security headers

### 📑 ATS-Friendly PDF Generation

The application can generate ATS-friendly resume PDFs using **Puppeteer**.

### 🧪 Automated Testing

Backend APIs are tested using:

* Jest
* Supertest

Test coverage includes important authentication and API workflows.

### 📊 AI Evaluation

The project includes an evaluation pipeline using **DeepEval** to measure the quality of AI-generated outputs.

Example evaluation:

```text
Match Score Evaluation
Score: 1.0
Generated Match Score: 85
```

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │   User Interface     │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │      Backend         │
                    └───────┬───────┬──────┘
                            │       │
              ┌─────────────┘       └──────────────┐
              ▼                                    ▼
     ┌──────────────────┐                 ┌──────────────────┐
     │    MongoDB       │                 │    Gemini API    │
     │    Database      │                 │   Generative AI  │
     └──────────────────┘                 └──────────────────┘
                                                   │
                                                   ▼
                                         ┌──────────────────┐
                                         │ AI Resume /      │
                                         │ Interview Report │
                                         └──────────────────┘

                         ┌──────────────────┐
                         │    Puppeteer     │
                         │   PDF Generator  │
                         └──────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* HTTP-only Cookies

## Database

* MongoDB
* Mongoose

## Generative AI

* Google Gemini API
* Google GenAI SDK

## AI Evaluation

* DeepEval
* Python
* NLP-based evaluation

## PDF Generation

* Puppeteer

## Testing

* Jest
* Supertest

## Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 📂 Project Structure

```text
AI-Resume-analyser/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
├── evaluation/
│   ├── dataset/
│   │   ├── test_case.json
│   │   └── test_resume.pdf
│   │
│   ├── metrics/
│   │   └── test_match_score.py
│   │
│   ├── test_resume_analyser.py
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/AI-Resume-analyser.git

cd AI-Resume-analyser
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_GENAI_API_KEY=your_gemini_api_key

FRONTEND_URL=http://localhost:5173
```

> Never commit your `.env` file or API keys to GitHub.

---

# ▶️ Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

## Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

### Resume Analysis

```text
Upload Resume
      ↓
Resume Parsing
      ↓
Information Extraction
      ↓
AI Analysis
      ↓
Skills & Experience Extraction
      ↓
Feedback Generation
      ↓
Structured Report
```

### Job Description Matching

```text
Resume
   +
Job Description
       ↓
Text / Skill Extraction
       ↓
AI Analysis
       ↓
Skill Comparison
       ↓
Missing Keyword Detection
       ↓
Match Score
       ↓
Personalized Recommendations
```

### Interview Experience Analysis

```text
Interview Experience
        ↓
Text Processing
        ↓
Round Classification
        ↓
Question Extraction
        ↓
Topic Classification
        ↓
Difficulty / Skill Analysis
        ↓
Structured Interview Report
```

---

# 🧠 AI Interview Analysis

One of the major components of the project is converting unstructured interview experiences into structured data.

For example, a candidate may provide:

```text
Round 1:
Tell me about yourself.
Explain your project.
Which technologies did you use?
Write a SQL query using LEFT JOIN.
Reverse a string in Python.

Round 2:
Tell me about your education.
What does your father do?
Why do you want to join our company?
```

The AI system can transform this into:

```json
{
  "rounds": [
    {
      "round": "Technical",
      "questions": [
        {
          "question": "Explain your project.",
          "tags": ["Projects", "System Understanding"]
        },
        {
          "question": "Write a SQL query using LEFT JOIN.",
          "tags": ["SQL", "DBMS"]
        },
        {
          "question": "Reverse a string in Python.",
          "tags": ["Python", "Strings"]
        }
      ]
    },
    {
      "round": "HR",
      "questions": [
        {
          "question": "Tell me about your education.",
          "tags": ["Background"]
        },
        {
          "question": "Why do you want to join our company?",
          "tags": ["Motivation", "HR"]
        }
      ]
    }
  ]
}
```

This structured information can then be used to build interview preparation features.

---

# 📊 Interview Intelligence

The extracted interview data can enable additional features such as:

### Topic Frequency

```text
SQL              ██████████
Python           ████████
DSA              ███████
React            █████
DBMS             ████
Docker           ███
```

### Company-Specific Interview Patterns

The system can identify frequently asked topics from previous interview experiences.

For example:

```text
Company
   ↓
Interview Experiences
   ↓
Round Classification
   ↓
Question Extraction
   ↓
Topic Extraction
   ↓
Frequency Analysis
   ↓
Interview Preparation Roadmap
```

---

# 🧪 Testing

Run backend tests using Jest:

```bash
npm test
```

Example test structure:

```text
test/
├── basic.test.js
├── app.test.js
└── auth/
    ├── register.test.js
    └── login.test.js
```

API testing can also be performed using Postman.

---

# 📈 AI Evaluation with DeepEval

The project includes a separate evaluation pipeline for measuring the quality of AI-generated responses.

Install the evaluation dependencies:

```bash
cd evaluation

python -m venv .venv
```

Activate the environment on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run evaluation:

```bash
python metrics/test_match_score.py
```

The evaluation pipeline can be extended to evaluate:

* Match Score
* Answer Relevance
* Faithfulness
* Contextual Relevance
* Output Consistency
* Structured Output Accuracy

---

# 🔒 Security

The application implements several security mechanisms:

* JWT authentication
* HTTP-only cookies
* Protected API routes
* Token invalidation / blacklisting
* Input sanitization
* API rate limiting
* Security headers
* Environment-based secret management

Sensitive credentials should always be stored in environment variables.

---

# 🚀 Future Enhancements

The project can be extended into a complete AI-powered career assistant.

### 1. Interview Question Bank

Automatically build a question bank from interview experiences.

```text
Company → Role → Round → Topic → Questions
```

### 2. Personalized Interview Preparation

Generate a preparation plan based on:

```text
Resume
+
Job Description
+
Previous Interview Experiences
+
Skill Gaps
```

### 3. AI Mock Interview

Conduct an interactive interview where AI acts as the interviewer.

Possible flow:

```text
Select Role
     ↓
Select Difficulty
     ↓
AI Interview
     ↓
Candidate Answers
     ↓
AI Evaluation
     ↓
Final Performance Report
```

### 4. Adaptive Question Difficulty

The AI can dynamically adjust question difficulty based on previous answers.

```text
Correct Answer
     ↓
Increase Difficulty

Weak Answer
     ↓
Ask Conceptual / Easier Question
```

### 5. Resume Version Management

Allow users to maintain multiple resumes:

```text
SDE Resume
ML Resume
Backend Resume
Frontend Resume
Data Analyst Resume
```

The system can recommend the most suitable version for a given job description.

### 6. Job Recommendation

Recommend relevant job opportunities based on:

* Skills
* Experience
* Projects
* Resume
* Preferred role

### 7. Skill Gap Roadmap

Generate a personalized learning roadmap:

```text
Job Description
      ↓
Required Skills
      ↓
Current Skills
      ↓
Skill Gap
      ↓
Learning Resources
      ↓
Practice Questions
      ↓
Mock Interview
```

### 8. Interview Analytics Dashboard

Provide analytics such as:

* Most frequently asked topics
* Most common interview rounds
* Difficulty distribution
* Company-specific trends
* Skill coverage
* Frequently repeated questions

---

# 🎯 Project Goals

The long-term goal of the project is to build an **AI-powered career preparation platform** that connects:

```text
             ┌─────────────┐
             │   Resume    │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │ Job         │
             │ Description │
             └──────┬──────┘
                    │
                    ▼
          ┌─────────────────────┐
          │   AI Analysis       │
          └──────────┬──────────┘
                     │
          ┌──────────┴───────────┐
          ▼                      ▼
    Resume Feedback       Skill Gap Analysis
          │                      │
          └──────────┬───────────┘
                     ▼
              Interview Prep
                     │
                     ▼
              Mock Interview
                     │
                     ▼
             Performance Report
```

The objective is to move beyond simple resume scoring and provide an **end-to-end personalized interview preparation experience**.

---

# 👩‍💻 Author

**Anushka**

Master of Computer Applications (MCA)
National Institute of Technology, Jamshedpur

---

# 📄 License

This project is intended for educational and portfolio purposes.

Add an appropriate open-source license such as MIT if you plan to distribute the project publicly.
