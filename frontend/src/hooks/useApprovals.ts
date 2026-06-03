import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const usePendingApprovalsQuery = () => {
  return useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: api.getPendingApprovals,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAllApprovalsQuery = () => {
  return useQuery({
    queryKey: ['allApprovals'],
    queryFn: api.getAllApprovals,
    staleTime: 1 * 60 * 1000,
  });
};

export const useTotalSavingsQuery = () => {
  return useQuery({
    queryKey: ['totalSavings'],
    queryFn: api.getTotalSavings,
    staleTime: 2 * 60 * 1000,
  });
};

export const useApproveMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (requestId: number) => api.approveRequest(requestId),
    onSuccess: () => {
      // Invalidate all related cost, inventory and approval states for dynamic updates
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['allApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['totalSavings'] });
      queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['ec2Instances'] });
    },
  });
};

export const useRejectMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (requestId: number) => api.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['allApprovals'] });
    },
  });
};
