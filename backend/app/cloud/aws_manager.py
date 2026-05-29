import boto3

from app.core.config import settings


ec2_client = boto3.client(
    "ec2",

    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,

    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,

    region_name=settings.AWS_REGION
)

def list_ec2_instances():
    """
    Fetch EC2 instance inventory.
    """

    try:

        response = ec2_client.describe_instances()

        instances = []

        for reservation in response["Reservations"]:

            for instance in reservation["Instances"]:

                instances.append({
                    "instance_id": instance.get("InstanceId"),

                    "instance_type": instance.get(
                        "InstanceType"
                    ),

                    "state": instance["State"]["Name"]
                })

        return {
            "status": "success",
            "instances": instances
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }
def stop_ec2_instance(
    instance_id: str,
    dry_run: bool = True
):
    """
    Safely stop EC2 instance.
    """

    try:

        response = ec2_client.stop_instances(
            InstanceIds=[instance_id],
            DryRun=dry_run
        )

        return {
            "status": "success",
            "message": (
                f"Stop request sent for "
                f"{instance_id}"
            ),
            "response": response
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }