import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Database, Settings, ArrowRight, Loader } from 'lucide-react';
import Header from './ui/Header';
import { fetchModels, fetchMetrics, fetchDatasets, runEvaluation } from '../services/api';

const EvaluationForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    experiment_name: '',
    dataset_path: '',
    models: [],
    metrics: []
  });
  
  // Options for selects
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [metrics, setMetrics] = useState({});
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  
  // Load data on mount
  useEffect(() => {
    const loadFormData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Note: These API calls might fail if the backend is not ready
        // In a real implementation, add better error handling
        let modelsData = [], metricsData = {}, datasetsData = [];
        
        try {
          const response = await fetchModels();
          modelsData = response.models || [];
        } catch (e) {
          console.warn('Could not load models:', e);
        }
        
        try {
          const response = await fetchMetrics();
          metricsData = response.metrics || {};
        } catch (e) {
          console.warn('Could not load metrics:', e);
        }
        
        try {
          const response = await fetchDatasets();
          datasetsData = response.datasets || [];
        } catch (e) {
          console.warn('Could not load datasets:', e);
        }
        
        setModels(modelsData);
        setMetrics(metricsData);
        setDatasets(datasetsData);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to load form data. Please try again.");
        setLoading(false);
        console.error(err);
      }
    };
    
    loadFormData();
  }, []);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e, list) => {
    const { name, checked } = e.target;
    let updatedList;
    
    if (checked) {
      updatedList = [...formData[list], name];
    } else {
      updatedList = formData[list].filter(item => item !== name);
    }
    
    setFormData({
      ...formData,
      [list]: updatedList
    });
  };
  
  // Handle dataset selection
  const handleDatasetChange = (e) => {
    const datasetId = e.target.value;
    const dataset = datasets.find(d => d.id === datasetId);
    
    setFormData({
      ...formData,
      dataset_path: dataset ? dataset.path : ''
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation, you'd submit to the backend
      // For now, just navigate back to the dashboard
      navigate('/experiments');
    } catch (err) {
      setError(err.message || "Failed to run evaluation. Please try again.");
      setSubmitting(false);
      console.error(err);
    }
  };
  
  // Handle steps
  const nextStep = () => setActiveStep(activeStep + 1);
  const prevStep = () => setActiveStep(activeStep - 1);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-700">Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto py-6 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">New Evaluation</h2>
          
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${activeStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <Layers size={20} />
              </div>
              <div className={`flex-grow h-1 mx-2 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${activeStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <Database size={20} />
              </div>
              <div className={`flex-grow h-1 mx-2 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${activeStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <Settings size={20} />
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-sm font-medium text-gray-500">Basic Info</div>
              <div className="text-sm font-medium text-gray-500">Dataset</div>
              <div className="text-sm font-medium text-gray-500">Models & Metrics</div>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {activeStep === 1 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
                
                <div className="mb-4">
                  <label htmlFor="experiment_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Experiment Name
                  </label>
                  <input
                    type="text"
                    id="experiment_name"
                    name="experiment_name"
                    value={formData.experiment_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., rag_evaluation_feb_2025"
                    required
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Dataset */}
            {activeStep === 2 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Select Dataset</h3>
                
                <div className="mb-4">
                  <label htmlFor="dataset" className="block text-sm font-medium text-gray-700 mb-1">
                    Dataset
                  </label>
                  <select
                    id="dataset"
                    name="dataset"
                    onChange={handleDatasetChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a dataset</option>
                    {datasets.map(dataset => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.name} ({dataset.task_count} tasks)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={!formData.dataset_path}
                  >
                    Next <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Models & Metrics */}
            {activeStep === 3 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Select Models & Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Models */}
                  <div>
                    <h4 className="text-base font-medium text-gray-600 mb-2">Models</h4>
                    
                    <div className="bg-gray-50 p-4 rounded-md h-80 overflow-y-auto">
                      {models.map(model => (
                        <div key={model.id} className="mb-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name={model.id}
                              checked={formData.models.includes(model.id)}
                              onChange={(e) => handleCheckboxChange(e, 'models')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{model.name}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div>
                    <h4 className="text-base font-medium text-gray-600 mb-2">Metrics</h4>
                    
                    <div className="bg-gray-50 p-4 rounded-md h-80 overflow-y-auto">
                      {Object.entries(metrics).map(([metricId, metric]) => (
                        <div key={metricId} className="mb-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name={metricId}
                              checked={formData.metrics.includes(metricId)}
                              onChange={(e) => handleCheckboxChange(e, 'metrics')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{metric.name}</span>
                          </label>
                          <p className="ml-6 text-xs text-gray-500">{metric.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={submitting || formData.models.length === 0 || formData.metrics.length === 0}
                  >
                    {submitting ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Running Evaluation...
                      </>
                    ) : (
                      "Run Evaluation"
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default EvaluationForm;