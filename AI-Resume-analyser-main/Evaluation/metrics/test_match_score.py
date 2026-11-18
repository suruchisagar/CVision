import json
import os
import requests

from deepeval.test_case import LLMTestCase , SingleTurnParams
from deepeval.metrics import GEval

API_URL = "http://localhost:3000/api/interview"


with open("dataset/test_case.json", "r", encoding="utf-8") as f:
    test_case = json.load(f)


data = {
    "jobDescription": test_case["jobDescription"],
    "selfDescription": test_case["selfDescription"],
}


with open("dataset/test_resume.pdf", "rb") as resume_file:
    files = {
        "resume": (
            "test_resume.pdf",
            resume_file,
            "application/pdf",
        )
    }

    response = requests.post(
        API_URL,
        data=data,
        files=files,
        cookies={
            "token": os.environ["AUTH_TOKEN"]
        },
    )


print("API Status:", response.status_code)

response.raise_for_status()

result = response.json()

interview_report = result["interviewReport"]


llm_test_case = LLMTestCase(
    input=f"""
Job Description:
{test_case["jobDescription"]}

Resume:
{interview_report["resume"]}
""",
    actual_output=json.dumps({
        "matchScore": interview_report["matchScore"]
    }),
)

match_score_metric = GEval(
    name="Match Score Justification",
    criteria="""
    Evaluate whether the generated matchScore is justified by the
    candidate's resume and the job description.

    Consider:
    - How many required skills from the job description are supported
      by the resume.
    - Whether the candidate has relevant projects or practical experience.
    - Whether the candidate's technical background aligns with the role.
    - Whether the numerical match score is reasonable given the evidence.

    Penalize scores that appear overly optimistic when important job
    requirements are missing from the resume.

    Do not judge the writing quality of the report. Focus specifically
    on whether the numerical matchScore is appropriately justified.
    """,
    evaluation_params=[
        SingleTurnParams.INPUT,
        SingleTurnParams.ACTUAL_OUTPUT,
    ],
    threshold=0.7,
)


match_score_metric.measure(llm_test_case)

print("\n=== Match Score Evaluation ===")
print("Score:", match_score_metric.score)
print("Reason:", match_score_metric.reason)
print("Passed:", match_score_metric.is_successful())
