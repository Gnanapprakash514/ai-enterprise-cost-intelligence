import { useEffect, useState } from 'react';
import { getAIInsights } from '../api';

export default function AIInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAIInsights();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Insights</h1>

      <div className="bg-white shadow rounded-lg p-6">
        {data?.ai_insights ? (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{data.ai_insights}</pre>
          </div>
        ) : (
          <p className="text-gray-500">{data?.message || 'No AI insights available.'}</p>
        )}
      </div>
    </div>
  );
}
