from app.cloud.cost_analyzer import intelligent_cost_scan
from app.services.approval_service import create_approval_request


def run_intelligent_optimization(db):
    """
    Automatically scan infrastructure, detect waste, and create approval requests.
    This is the autonomous AI workflow.
    """
    
    # Step 1: Scan all EC2 instances and analyze utilization
    scan_result = intelligent_cost_scan()
    
    if scan_result['status'] != 'success':
        return {
            'status': 'error',
            'message': scan_result.get('message', 'Scan failed')
        }
    
    recommendations = scan_result['recommendations']
    
    if not recommendations:
        return {
            'status': 'success',
            'message': 'No optimization opportunities detected. All resources are well-utilized.',
            'total_scanned': scan_result['total_instances_scanned'],
            'recommendations': []
        }
    
    # Step 2: Auto-generate approval requests for each recommendation
    approval_requests = []
    
    for rec in recommendations:
        action = 'STOP_INSTANCE' if rec['recommendation'] == 'STOP' else 'DOWNSIZE_INSTANCE'
        
        approval = create_approval_request(
            db=db,
            instance_id=rec['instance_id'],
            action=action,
            estimated_savings=rec['estimated_monthly_savings']
        )
        
        approval_requests.append({
            'approval_id': approval.id,
            'instance_id': rec['instance_id'],
            'instance_type': rec['instance_type'],
            'action': action,
            'reason': rec['reason'],
            'avg_cpu': rec['avg_cpu'],
            'max_cpu': rec['max_cpu'],
            'estimated_savings': rec['estimated_monthly_savings'],
            'priority': rec['priority'],
            'status': 'PENDING_APPROVAL'
        })
    
    return {
        'status': 'success',
        'message': f'Intelligent scan completed. Found {len(recommendations)} optimization opportunities.',
        'total_scanned': scan_result['total_instances_scanned'],
        'recommendations': approval_requests,
        'total_potential_savings': sum(r['estimated_monthly_savings'] for r in recommendations)
    }
