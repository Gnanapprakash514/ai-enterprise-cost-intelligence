import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const useCostRecordsQuery = () => {
  return useQuery({
    queryKey: ['costRecords'],
    queryFn: api.getCostRecords,
    staleTime: 5 * 60 * 1000, // 5 minutes cache validity
  });
};

export const useAnomaliesQuery = () => {
  return useQuery({
    queryKey: ['anomalies'],
    queryFn: api.getAnomalies,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAIInsightsQuery = () => {
  return useQuery({
    queryKey: ['aiInsights'],
    queryFn: api.getAIInsights,
    staleTime: 10 * 60 * 1000, // 10 minutes (computationally intensive on backend)
  });
};

export const useRecommendationsQuery = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: api.getRecommendations,
    staleTime: 5 * 60 * 1000,
  });
};
