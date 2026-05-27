from app.langchain.agent_executor import (
    agent_executor
)


def autonomous_optimization():

    try:

        query = """
        Analyze enterprise cloud costs
        and optimize EC2 infrastructure.
        """

        response = agent_executor.run(query)

        return {
            "status": "success",
            "result": response
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }