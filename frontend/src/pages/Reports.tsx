import { useEffect, useState } from 'react';
import { getReports } from '../api';

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReports();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Executive Reports</h1>

      {data?.report ? (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
            <p className="text-gray-700">{data.report.executive_summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-sm text-gray-500">Total Operations</p>
              <p className="text-3xl font-bold text-gray-900">{data.report.total_operations}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">{data.report.success_rate}%</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-sm text-gray-500">Successful</p>
              <p className="text-3xl font-bold text-gray-900">{data.report.successful_optimizations}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-sm text-gray-500">Total Savings</p>
              <p className="text-3xl font-bold text-green-600">${data.report.total_actual_savings?.toFixed(2)}</p>
            </div>
          </div>

          {data.report.details && data.report.details.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Results</h3>
              <div className="space-y-3">
                {data.report.details.map((detail: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-medium text-gray-900">{detail.department} - {detail.service_name}</p>
                    <p className="text-sm text-gray-600">Status: {detail.status}</p>
                    {detail.actual_savings && (
                      <p className="text-sm text-green-600">Savings: ${detail.actual_savings.toFixed(2)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600">No report data available.</p>
        </div>
      )}
    </div>
  );
}
