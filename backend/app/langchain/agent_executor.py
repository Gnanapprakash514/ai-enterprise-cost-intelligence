from langchain.agents import (
    initialize_agent,
    AgentType
)

from app.langchain.llm import llm

from app.langchain.tools import (
    optimization_tools
)


agent_executor = initialize_agent(

    tools=optimization_tools,

    llm=llm,

    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,

    verbose=True
)