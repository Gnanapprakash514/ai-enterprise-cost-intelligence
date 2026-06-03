import { useEffect, useState } from 'react';
import { getPendingApprovals, approveRequest, rejectRequest } from '../api';

export default function Approvals() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const response = await getPendingApprovals();
      setApprovals(response.data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveRequest(id);
      alert('Request approved!');
      fetchApprovals();
    } catch (error: any) {
      alert(`Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectRequest(id);
      alert('Request rejected!');
      fetchApprovals();
    } catch (error: any) {
      alert(`Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pending Approvals</h1>

      {approvals.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600">No pending approvals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{approval.instance_id}</h3>
                  <p className="text-sm text-gray-600 mt-1">{approval.action}</p>
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    Estimated Savings: ${approval.estimated_savings?.toFixed(2)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(approval.id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(approval.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
