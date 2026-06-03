import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { awsDirect } from '../services/awsDirect';

const USE_DIRECT_AWS = import.meta.env.VITE_USE_DIRECT_AWS === 'true';

export const useEC2InstancesQuery = () => {
  return useQuery({
    queryKey: ['ec2Instances'],
    queryFn: async () => {
      if (USE_DIRECT_AWS) {
        return await awsDirect.getEC2Instances();
      }
      return await api.getEC2Instances();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAuditLogsQuery = () => {
  return useQuery({
    queryKey: ['auditLogs'],
    queryFn: api.getAuditLogs,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useStopInstanceMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (instanceId: string) => {
      if (USE_DIRECT_AWS) {
        return await awsDirect.stopEC2Instance(instanceId);
      }
      return await api.stopInstance(instanceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ec2Instances'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    },
  });
};

export const useRequestStopMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (instanceId: string) => api.requestStop(instanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['allApprovals'] });
    },
  });
};

export const useAutoGenerateApprovalsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.autoGenerateApprovals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['allApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['totalSavings'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
    },
  });
};
