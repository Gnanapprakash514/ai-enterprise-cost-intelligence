import { useEffect, useState } from 'react';
import { getAnomalies } from '../api';

export default function Anomalies() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnomalies();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching anomalies:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cost Anomalies</h1>

      {data?.anomalies_found === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">No anomalies detected. All costs are within normal range.</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{data?.total_records || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Anomalies Found</p>
                <p className="text-2xl font-bold text-red-600">{data?.anomalies_found || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mean Cost</p>
                <p className="text-2xl font-bold text-gray-900">${data?.mean_cost?.toFixed(2) || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Z-Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.anomalies?.map((anomaly: any, index: number) => (
                  <tr key={index} className="bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anomaly.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anomaly.service_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anomaly.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">${anomaly.cost_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{anomaly.z_score?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{anomaly.record_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
