from app.cloud.aws_manager import (
    stop_ec2_instance
)


def execute_ec2_shutdown(
    instance_id: str
):

    result = stop_ec2_instance(
        instance_id=instance_id,
        dry_run=False
    )

    return result