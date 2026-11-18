import json
import os
import requests

from deepeval.test_case import LLMTestCase, SingleTurnParams
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


print("Status:", response.status_code)

response.raise_for_status()

result = response.json()

llm_test_case = LLMTestCase(
    input=f"""
Job Description:
{test_case["jobDescription"]}

Self Description:
{test_case["selfDescription"]}
""",
    actual_output=json.dumps(result),
)



relevance_metric = GEval(
    name="Report Relevance",
    criteria="""
    Evaluate whether the generated interview report is relevant to the
    candidate's resume, self-description, and job description.

    The report should:
    - Base its questions and skill gaps on information actually present
      in the resume and job description.
    - Avoid inventing candidate experience, technologies, projects,
      achievements, or qualifications.
    - Generate technical questions relevant to the required skills.
    - Generate behavioral questions relevant to the candidate's background.
    - Provide a preparation plan that addresses relevant job requirements
      and skill gaps.
    """,
    evaluation_params=[
        SingleTurnParams.INPUT,
        SingleTurnParams.ACTUAL_OUTPUT,
    ],
    threshold=0.7,
)

relevance_metric.measure(llm_test_case)

print("\n=== DeepEval Result ===")
print("Score:", relevance_metric.score)
print("Reason:", relevance_metric.reason)
print("Passed:", relevance_metric.is_successful())

print("\nDeepEval Test Case created successfully!")
print("\nInput:")
print(llm_test_case.input)

print("\nActual Output:")
print(llm_test_case.actual_output)