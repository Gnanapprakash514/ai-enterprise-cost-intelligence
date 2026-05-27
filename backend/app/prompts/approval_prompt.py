from langchain.prompts import PromptTemplate


approval_prompt = PromptTemplate(
    input_variables=[
        "service_name",
        "estimated_savings"
    ],

    template="""
You are an enterprise governance expert.

Analyze the following optimization request.

Service:
{service_name}

Estimated Savings:
{estimated_savings}

Provide:

1. Risk Level
2. Approval Requirement
3. Governance Concerns
4. Operational Impact
"""
)