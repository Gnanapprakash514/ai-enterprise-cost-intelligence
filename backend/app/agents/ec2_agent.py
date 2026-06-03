from app.cloud.aws_manager import stop_ec2_instance


def execute_ec2_shutdown(instance_id: str):
    """
    Execute EC2 instance shutdown.
    """
    return stop_ec2_instance(instance_id, dry_run=False)
