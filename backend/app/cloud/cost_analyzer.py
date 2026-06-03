import boto3
from datetime import datetime, timedelta, timezone
from app.core.config import settings

# CloudWatch client for metrics
if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
    cloudwatch = boto3.client(
        'cloudwatch',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )
    ec2_client = boto3.client(
        'ec2',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )
else:
    cloudwatch = boto3.client('cloudwatch', region_name=settings.AWS_REGION)
    ec2_client = boto3.client('ec2', region_name=settings.AWS_REGION)


def analyze_instance_utilization(instance_id: str, days: int = 7):
    """
    Analyze CPU utilization over the last N days to detect waste.
    """
    try:
        end_time = datetime.now(timezone.utc)
        start_time = end_time - timedelta(days=days)

        response = cloudwatch.get_metric_statistics(
            Namespace='AWS/EC2',
            MetricName='CPUUtilization',
            Dimensions=[{'Name': 'InstanceId', 'Value': instance_id}],
            StartTime=start_time,
            EndTime=end_time,
            Period=3600,  # 1 hour periods
            Statistics=['Average', 'Maximum']
        )

        if not response['Datapoints']:
            return {
                'instance_id': instance_id,
                'avg_cpu': 0,
                'max_cpu': 0,
                'recommendation': 'NO_DATA',
                'reason': 'No metrics available'
            }

        datapoints = response['Datapoints']
        avg_cpu = sum(dp['Average'] for dp in datapoints) / len(datapoints)
        max_cpu = max(dp['Maximum'] for dp in datapoints)

        # Intelligent rules
        if avg_cpu < 5 and max_cpu < 20:
            recommendation = 'STOP'
            reason = f'Severely underutilized: avg CPU {avg_cpu:.1f}%, max {max_cpu:.1f}%'
            estimated_savings = 100.0  # Estimate based on instance type
        elif avg_cpu < 15 and max_cpu < 40:
            recommendation = 'DOWNSIZE'
            reason = f'Underutilized: avg CPU {avg_cpu:.1f}%, max {max_cpu:.1f}%. Consider smaller instance type'
            estimated_savings = 50.0
        elif avg_cpu < 30:
            recommendation = 'MONITOR'
            reason = f'Low utilization: avg CPU {avg_cpu:.1f}%. Monitor for optimization opportunities'
            estimated_savings = 0.0
        else:
            recommendation = 'OPTIMAL'
            reason = f'Well utilized: avg CPU {avg_cpu:.1f}%'
            estimated_savings = 0.0

        return {
            'instance_id': instance_id,
            'avg_cpu': round(avg_cpu, 2),
            'max_cpu': round(max_cpu, 2),
            'recommendation': recommendation,
            'reason': reason,
            'estimated_monthly_savings': estimated_savings
        }

    except Exception as e:
        return {
            'instance_id': instance_id,
            'error': str(e),
            'recommendation': 'ERROR'
        }


def intelligent_cost_scan():
    """
    Scan all running EC2 instances and generate intelligent recommendations.
    """
    try:
        response = ec2_client.describe_instances(
            Filters=[{'Name': 'instance-state-name', 'Values': ['running']}]
        )

        recommendations = []
        
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                instance_id = instance['InstanceId']
                instance_type = instance['InstanceType']
                launch_time = instance['LaunchTime']
                
                # Analyze utilization
                analysis = analyze_instance_utilization(instance_id)
                
                if analysis['recommendation'] in ['STOP', 'DOWNSIZE']:
                    recommendations.append({
                        'instance_id': instance_id,
                        'instance_type': instance_type,
                        'launch_time': str(launch_time),
                        'avg_cpu': analysis['avg_cpu'],
                        'max_cpu': analysis['max_cpu'],
                        'recommendation': analysis['recommendation'],
                        'reason': analysis['reason'],
                        'estimated_monthly_savings': analysis['estimated_monthly_savings'],
                        'priority': 'High' if analysis['recommendation'] == 'STOP' else 'Medium'
                    })

        return {
            'status': 'success',
            'total_instances_scanned': sum(
                len(r['Instances']) 
                for r in response['Reservations']
            ),
            'recommendations_count': len(recommendations),
            'recommendations': recommendations
        }

    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }
