import React, { useState, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import Header from './ui/Header';
import { fetchModels, generateResponse } from '../services/api';
import { formatNumber } from '../services/formatter';

const TestConsole = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await fetchModels();
        setModels(data.models || []);
        
        // Select first model by default
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0].id);
        }
      } catch (err) {
        setError("Failed to load models");
        console.error(err);
      }
    };
    
    loadModels();
  }, []);
  
  // Handle model selection
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };
  
  // Handle prompt input
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedModel || !prompt.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await generateResponse(selectedModel, prompt);
      setResponse(result);
    } catch (err) {
      setError("Failed to generate response");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto py-6 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Test Console</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                id="model"
                value={selectedModel}
                onChange={handleModelChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a model</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={handlePromptChange}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your prompt here..."
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading || !selectedModel || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          {/* Response */}
          {response && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Response</h3>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(response.metrics || {}).map(([key, value]) => (
                  <div key={key} className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-xs font-medium text-blue-700 mb-1 capitalize">{key.replace(/_/g, ' ')}</div>
                    <div className="text-xl font-bold text-gray-800">
                      {key.includes('cost') ? `$${formatNumber(value, 4)}` : formatNumber(value, 2)}
                      {key.includes('latency') || key.includes('time') ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Response text */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">{response.response}</pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TestConsole;