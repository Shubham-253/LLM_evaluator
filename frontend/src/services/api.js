// API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch experiments list
 * @returns {Promise<Object>} List of experiments
 */
export const fetchExperiments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/experiments`);
    if (!response.ok) {
      throw new Error('Failed to fetch experiments');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching experiments:", error);
    throw error;
  }
};

/**
 * Fetch experiment details
 * @param {string} experimentId - ID of the experiment
 * @param {string} [runId] - Optional run ID
 * @returns {Promise<Object>} Experiment details
 */
export const fetchExperimentDetails = async (experimentId, runId = null) => {
  try {
    let url = `${API_BASE_URL}/experiments/${experimentId}`;
    if (runId) {
      url += `/runs/${runId}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch experiment details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching experiment details for ${experimentId}:`, error);
    throw error;
  }
};

/**
 * Fetch available models
 * @returns {Promise<Object>} List of available models
 */
export const fetchModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

/**
 * Fetch available metrics
 * @returns {Promise<Object>} List of available metrics
 */
export const fetchMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics`);
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};

/**
 * Fetch available datasets
 * @returns {Promise<Object>} List of available datasets
 */
export const fetchDatasets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/datasets`);
    if (!response.ok) {
      throw new Error('Failed to fetch datasets');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching datasets:", error);
    throw error;
  }
};

/**
 * Run an evaluation
 * @param {Object} evaluationData - Evaluation configuration
 * @returns {Promise<Object>} Evaluation results
 */
export const runEvaluation = async (evaluationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluationData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to run evaluation');
    }
    return await response.json();
  } catch (error) {
    console.error("Error running evaluation:", error);
    throw error;
  }
};

/**
 * Generate a response from a model
 * @param {string} modelId - ID of the model
 * @param {string} prompt - Text prompt
 * @returns {Promise<Object>} Model response
 */
export const generateResponse = async (modelId, prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: modelId,
        prompt: prompt
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate response');
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};