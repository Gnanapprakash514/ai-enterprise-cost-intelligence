import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CostRecords from './pages/CostRecords';
import Anomalies from './pages/Anomalies';
import Recommendations from './pages/Recommendations';
import AIInsights from './pages/AIInsights';
import CloudResources from './pages/CloudResources';
import Approvals from './pages/Approvals';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                  Dashboard
                </Link>
                <Link to="/cost-records" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Cost Records
                </Link>
                <Link to="/anomalies" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Anomalies
                </Link>
                <Link to="/recommendations" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Recommendations
                </Link>
                <Link to="/ai-insights" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  AI Insights
                </Link>
                <Link to="/cloud" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Cloud Resources
                </Link>
                <Link to="/approvals" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Approvals
                </Link>
                <Link to="/reports" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Reports
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cost-records" element={<CostRecords />} />
            <Route path="/anomalies" element={<Anomalies />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/cloud" element={<CloudResources />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
