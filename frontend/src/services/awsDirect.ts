import { EC2Client, DescribeInstancesCommand, StopInstancesCommand } from '@aws-sdk/client-ec2';
import { CostExplorerClient, GetCostAndUsageCommand } from '@aws-sdk/client-cost-explorer';

const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';

const ec2Client = new EC2Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const costExplorerClient = new CostExplorerClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export const awsDirect = {
  getEC2Instances: async () => {
    try {
      const command = new DescribeInstancesCommand({});
      const response = await ec2Client.send(command);
      
      const instances = [];
      for (const reservation of response.Reservations || []) {
        for (const instance of reservation.Instances || []) {
          instances.push({
            instance_id: instance.InstanceId,
            instance_type: instance.InstanceType,
            state: instance.State?.Name || 'unknown',
            region: AWS_REGION,
            launch_time: instance.LaunchTime?.toISOString(),
          });
        }
      }
      
      return { status: 'success', instances };
    } catch (error: any) {
      console.error('AWS Direct EC2 fetch failed:', error);
      return { status: 'error', message: error.message, instances: [] };
    }
  },

  stopEC2Instance: async (instanceId: string) => {
    try {
      const command = new StopInstancesCommand({
        InstanceIds: [instanceId],
      });
      const response = await ec2Client.send(command);
      
      return {
        status: 'success',
        message: `Stop request sent for ${instanceId}`,
        response,
      };
    } catch (error: any) {
      console.error('AWS Direct EC2 stop failed:', error);
      return { status: 'error', message: error.message };
    }
  },

  getCostAndUsage: async (startDate: string, endDate: string) => {
    try {
      const command = new GetCostAndUsageCommand({
        TimePeriod: {
          Start: startDate,
          End: endDate,
        },
        Granularity: 'DAILY',
        Metrics: ['UnblendedCost'],
        GroupBy: [
          {
            Type: 'DIMENSION',
            Key: 'SERVICE',
          },
        ],
      });
      
      const response = await costExplorerClient.send(command);
      
      return {
        status: 'success',
        data: response.ResultsByTime || [],
      };
    } catch (error: any) {
      console.error('AWS Direct Cost Explorer fetch failed:', error);
      return { status: 'error', message: error.message, data: [] };
    }
  },
};
