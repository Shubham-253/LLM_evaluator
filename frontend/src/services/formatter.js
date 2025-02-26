/**
 * Format a number with specified decimal places
 * @param {number} value - The value to format
 * @param {number} [decimalPlaces=2] - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimalPlaces = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  
  // Ensure value is a number
  const num = Number(value);
  
  // Format with fixed decimal places
  return num.toFixed(decimalPlaces);
};

/**
 * Calculate average score across all metrics
 * @param {Object} metricScores - Object with metric names as keys and scores as values
 * @param {Array} metrics - List of all metrics (to handle hallucination correctly)
 * @returns {number} Average score
 */
export const calculateAvgScore = (metricScores, metrics = []) => {
  if (!metricScores || Object.keys(metricScores).length === 0) {
    return 0;
  }
  
  const scores = [];
  
  // Process each metric score
  Object.entries(metricScores).forEach(([metricName, score]) => {
    if (score === null || score === undefined || isNaN(score)) {
      return; // Skip invalid scores
    }
    
    // For hallucination metric, lower is better, so invert it
    if (metricName === 'hallucination') {
      scores.push(1 - score);
    } else {
      scores.push(score);
    }
  });
  
  // Return average
  if (scores.length === 0) {
    return 0;
  }
  
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};
