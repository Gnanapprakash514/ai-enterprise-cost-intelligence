from langchain.tools import Tool

from app.tools import (
    optimize_ec2,
    optimize_rds,
    optimize_storage,
)


optimization_tools = [

    Tool(
        name="EC2Optimizer",

        func=lambda _: optimize_ec2(),

        description=(
            "Use this tool for EC2 "
            "cost optimization."
        )
    ),

    Tool(
        name="RDSOptimizer",

        func=lambda _: optimize_rds(),

        description=(
            "Use this tool for RDS "
            "database optimization."
        )
    ),

    Tool(
        name="StorageOptimizer",

        func=lambda _: optimize_storage(),

        description=(
            "Use this tool for storage "
            "optimization."
        )
    ),
]