import boto3

from app.core.config import settings

# Try to use credentials from .env, fallback to AWS CLI/environment
if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
    ec2_client = boto3.client(
        "ec2",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )
else:
    # Use default credentials from AWS CLI or environment
    ec2_client = boto3.client("ec2", region_name=settings.AWS_REGION)

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
    dry_run: bool = False
):
    """
    Stop EC2 instance.
    """
    print(f"[DEBUG] Attempting to stop instance: {instance_id}")
    print(f"[DEBUG] Dry run mode: {dry_run}")
    print(f"[DEBUG] Region: {settings.AWS_REGION}")

    try:
        print(f"[DEBUG] Calling stop_instances API...")
        response = ec2_client.stop_instances(
            InstanceIds=[instance_id],
            DryRun=dry_run
        )
        print(f"[DEBUG] API Response: {response}")

        # Get current state after stop request
        current_state = "unknown"
        if response.get('StoppingInstances'):
            current_state = response['StoppingInstances'][0]['CurrentState']['Name']
            print(f"[DEBUG] Current state: {current_state}")

        return {
            "status": "success",
            "message": f"Stop request sent for {instance_id}. Current state: {current_state}",
            "current_state": current_state,
            "instance_id": instance_id,
            "full_response": response
        }

    except Exception as e:
        import traceback
        error_details = {
            "status": "error",
            "message": str(e),
            "error_type": type(e).__name__,
            "traceback": traceback.format_exc()
        }
        print(f"[ERROR] Stop failed: {error_details}")
        return error_details