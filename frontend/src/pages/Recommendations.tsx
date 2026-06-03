import { useEffect, useState } from 'react';
import { getRecommendations } from '../api';

export default function Recommendations() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRecommendations();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Optimization Recommendations</h1>

      {data?.recommendations?.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">No optimization recommendations at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.recommendations?.map((rec: any, index: number) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority}
                    </span>
                    <span className="text-sm text-gray-500">{rec.department}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{rec.service_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{rec.vendor}</p>
                  <p className="text-sm text-gray-700">{rec.recommended_action}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-500">Current Cost</p>
                  <p className="text-xl font-bold text-gray-900">${rec.current_cost.toFixed(2)}</p>
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    Save ${rec.estimated_monthly_savings.toFixed(2)}/mo
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
