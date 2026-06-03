import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cost Records
export const getCostRecords = () => api.get('/cost-records/');
export const createCostRecord = (data: any) => api.post('/cost-records/', data);
export const uploadCostData = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/uploads/cost-data', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Analysis
export const getAnomalies = () => api.get('/analysis/anomalies');

// AI Agents
export const getRecommendations = () => api.get('/agents/recommendations');
export const getAIInsights = () => api.get('/agents/ai-insights');
export const getSpendIntelligence = () => api.get('/agents/spend-intelligence');
export const getApprovals = () => api.get('/agents/approvals');
export const executeActions = () => api.get('/agents/execute');
export const monitorActions = () => api.get('/agents/monitor');
export const getReports = () => api.get('/agents/reports');
export const autonomousExecution = () => api.get('/agents/autonomous-execution');

// Cloud (if routes exist)
export const getEC2Instances = () => api.get('/cloud/ec2-instances');
export const stopInstance = (instanceId: string) => api.post(`/cloud/stop-instance/${instanceId}`);
export const requestStop = (instanceId: string) => api.post(`/cloud/request-stop/${instanceId}`);
export const getPendingApprovals = () => api.get('/cloud/pending-approvals');
export const approveRequest = (requestId: number) => api.post(`/cloud/approve/${requestId}`);
export const rejectRequest = (requestId: number) => api.post(`/cloud/reject/${requestId}`);
export const getTotalSavings = () => api.get('/cloud/total-savings');
export const getAuditLogs = () => api.get('/cloud/audit-logs');

export default api;
