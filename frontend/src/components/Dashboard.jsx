import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import Header from './ui/Header';
import { fetchExperiments, fetchExperimentDetails } from '../services/api';

const Dashboard = () => {
  const { experimentId } = useParams();
  const navigate = useNavigate();
  
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch list of experiments on mount
  useEffect(() => {
    const loadExperiments = async () => {
      try {
        const data = await fetchExperiments();
        setExperiments(data.experiments || []);
        setLoading(false);
        
        // If no experimentId in URL, use the first experiment
        if (!experimentId && data.experiments && data.experiments.length > 0) {
          navigate();
        }
      } catch (err) {
        setError("Failed to load experiments");
        setLoading(false);
        console.error(err);
      }
    };
    
    loadExperiments();
  }, []);
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-col w-full">
          <Header />
          <div className="flex items-center justify-center w-full flex-grow">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Loading experiment data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-col w-full">
          <Header />
          <div className="flex items-center justify-center w-full flex-grow">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Simple dashboard when no experiments exist yet
  if (experiments.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-col w-full">
          <Header />
          <div className="container mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">No Experiments Found</h2>
              <p className="text-gray-600 mb-6">Get started by creating your first model evaluation.</p>
              <button
                onClick={() => navigate('/new-evaluation')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create New Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col w-full">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Model Evaluations</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Models</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {experiments.map((experiment) => (
                    <tr key={experiment.name} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{experiment.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(experiment.date).toLocaleString()}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{experiment.dataset || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{experiment.models ? experiment.models.join(', ') : 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{experiment.task_count || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => navigate()}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
