from langchain.prompts import PromptTemplate


optimization_prompt = PromptTemplate(
    input_variables=["service_name"],

    template="""
You are an enterprise cloud optimization expert.

Analyze the following service:

{service_name}

Provide:

1. Optimization Strategy
2. Estimated Savings
3. Risk Analysis
4. Execution Priority
"""
)