import { useEffect, useState } from 'react';
import { getEC2Instances, stopInstance } from '../api';

export default function CloudResources() {
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstances = async () => {
    try {
      const response = await getEC2Instances();
      setInstances(response.data.instances || []);
    } catch (error) {
      console.error('Error fetching EC2 instances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
    const interval = setInterval(fetchInstances, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStop = async (instanceId: string) => {
    if (!confirm(`Stop instance ${instanceId}?`)) return;
    
    try {
      await stopInstance(instanceId);
      alert('Instance stop initiated!');
      fetchInstances();
    } catch (error: any) {
      alert(`Failed: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cloud Resources (EC2)</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instance ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instances.map((instance) => (
              <tr key={instance.instance_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{instance.instance_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{instance.instance_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    instance.state === 'running' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {instance.state}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {instance.state === 'running' && (
                    <button
                      onClick={() => handleStop(instance.instance_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Stop
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
