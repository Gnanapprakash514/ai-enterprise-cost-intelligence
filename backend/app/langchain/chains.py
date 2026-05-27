from langchain.chains import LLMChain
from app.langchain.llm import llm

from app.prompts.cost_analysis_prompt import cost_analysis_prompt

cost_analysis_chain =LLMChain(llm=llm,prompt=cost_analysis_prompt)


