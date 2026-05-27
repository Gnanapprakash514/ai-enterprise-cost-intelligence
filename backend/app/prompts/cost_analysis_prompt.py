from langchain.prompts import PromptTemplate


cost_analysis_prompt = PromptTemplate(
    input_variables=["anomalies"],

    template="""
You are a senior enterprise FinOps consultant.

Analyze the following enterprise cloud
cost anomalies carefully.

Provide:

1. Executive Summary
2. Root Cause Analysis
3. Optimization Recommendations
4. Risk Assessment
5. Estimated Business Impact

Use professional enterprise language.

Anomalies:
{anomalies}
"""
)