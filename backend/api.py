from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import logging
import time
from datetime import datetime
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("logs/api.log"),
        logging.StreamHandler()
    ]
)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# API routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get available models"""
    try:
        with open("configs/models/models_config.json", 'r') as f:
            models_config = json.load(f)
        
        models = []
        for model_id, config in models_config.items():
            models.append({
                "id": model_id,
                "name": config.get("description", model_id),
                "type": config.get("type"),
                "cost_info": {
                    "prompt_price_per_1k": config.get("prompt_price_per_1k", 0),
                    "completion_price_per_1k": config.get("completion_price_per_1k", 0),
                    "input_price_per_1k": config.get("input_price_per_1k", 0),
                    "output_price_per_1k": config.get("output_price_per_1k", 0),
                }
            })
        
        return jsonify({"models": models})
    except Exception as e:
        logging.error(f"Error getting models: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    """Get available datasets"""
    try:
        datasets_dir = "configs/datasets"
        datasets = []
        
        if os.path.exists(datasets_dir):
            for filename in os.listdir(datasets_dir):
                if filename.endswith(".json"):
                    try:
                        with open(os.path.join(datasets_dir, filename), 'r') as f:
                            data = json.load(f)
                            
                        datasets.append({
                            "id": filename.replace(".json", ""),
                            "name": data.get("name", filename),
                            "task_count": len(data.get("tasks", [])),
                            "path": os.path.join(datasets_dir, filename)
                        })
                    except:
                        # Skip files that can't be parsed
                        pass
        
        return jsonify({"datasets": datasets})
    except Exception as e:
        logging.error(f"Error getting datasets: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Mock endpoint for available metrics"""
    metrics = {
        "f1": {
            "name": "F1 Score",
            "description": "Harmonic mean of precision and recall"
        },
        "context_relevance": {
            "name": "Context Relevance",
            "description": "Measures relevance of response to provided context"
        },
        "hallucination": {
            "name": "Hallucination",
            "description": "Detects information not present in the context (lower is better)"
        },
        "faithfulness": {
            "name": "Faithfulness",
            "description": "Measures faithfulness to the provided context"
        },
        "answer_relevance": {
            "name": "Answer Relevance",
            "description": "Measures how well the answer addresses the question"
        },
        "conciseness": {
            "name": "Conciseness",
            "description": "Measures brevity and clarity of response"
        },
        "coherence": {
            "name": "Coherence",
            "description": "Measures logical flow and coherence of text"
        },
        "creativity": {
            "name": "Creativity",
            "description": "Measures originality and creativity"
        },
        "length": {
            "name": "Response Length",
            "description": "Measures length of response"
        }
    }
    
    # Group metrics by task type
    task_metrics = {
        "rag": ["f1", "context_relevance", "hallucination", "faithfulness", "answer_relevance", "conciseness"],
        "generation": ["coherence", "creativity", "conciseness"],
        "qa": ["f1", "answer_relevance", "conciseness"]
    }
    
    return jsonify({
        "metrics": metrics,
        "task_metrics": task_metrics
    })

@app.route('/api/experiments', methods=['GET'])
def get_experiments():
    """Mock endpoint for experiments"""
    # In a real implementation, this would read from the results directory
    experiments = [
        {
            "name": "rag_comparison_2025_02_25",
            "date": "2025-02-25T14:30:00",
            "dataset": "Sample RAG Dataset",
            "models": ["gpt4o", "claude-3-opus", "claude-3-sonnet", "deepseek-r1"],
            "metrics": ["f1", "context_relevance", "hallucination", "faithfulness", "answer_relevance", "conciseness"],
            "task_count": 5
        },
        {
            "name": "generation_test_2025_02_24",
            "date": "2025-02-24T10:15:00",
            "dataset": "Creative Writing Dataset",
            "models": ["gpt4o", "claude-3-opus", "llama2-70b"],
            "metrics": ["coherence", "creativity", "conciseness"],
            "task_count": 3
        },
        {
            "name": "qa_benchmark_2025_02_23",
            "date": "2025-02-23T16:45:00",
            "dataset": "General QA Dataset",
            "models": ["gpt4o", "mistral-7b", "claude-3-sonnet"],
            "metrics": ["f1", "answer_relevance", "conciseness"],
            "task_count": 10
        }
    ]
    
    return jsonify({"experiments": experiments})

@app.route('/api/experiments/<experiment_name>', methods=['GET'])
def get_experiment_details(experiment_name):
    """Mock endpoint for experiment details"""
    # This would normally read from stored results
    if experiment_name == "rag_comparison_2025_02_25":
        # Return mock data for the RAG comparison experiment
        summary = {
            "dataset": "Sample RAG Dataset",
            "models": ["gpt4o", "claude-3-opus", "claude-3-sonnet", "deepseek-r1"],
            "metrics": ["f1", "context_relevance", "hallucination", "faithfulness", "answer_relevance", "conciseness"],
            "timestamp": "2025-02-25T14:30:00",
            "task_count": 5,
            "model_summaries": {
                "gpt4o": {
                    "avg_latency": 2.34,
                    "avg_time_to_first_token": 0.82,
                    "avg_tokens_per_second": 21.3,
                    "avg_tokens": 248.6,
                    "total_cost": 0.03125,
                    "avg_cost": 0.00625,
                    "total_api_cost": 0.03125,
                    "total_infrastructure_cost": 0.0,
                    "metric_scores": {
                        "f1": 0.86,
                        "context_relevance": 0.92,
                        "hallucination": 0.12,
                        "faithfulness": 0.89,
                        "answer_relevance": 0.94,
                        "conciseness": 0.85
                    }
                },
                "claude-3-opus": {
                    "avg_latency": 3.12,
                    "avg_time_to_first_token": 1.08,
                    "avg_tokens_per_second": 18.7,
                    "avg_tokens": 276.4,
                    "total_cost": 0.05625,
                    "avg_cost": 0.01125,
                    "total_api_cost": 0.05625,
                    "total_infrastructure_cost": 0.0,
                    "metric_scores": {
                        "f1": 0.89,
                        "context_relevance": 0.95,
                        "hallucination": 0.08,
                        "faithfulness": 0.94,
                        "answer_relevance": 0.96,
                        "conciseness": 0.88
                    }
                },
                "claude-3-sonnet": {
                    "avg_latency": 2.58,
                    "avg_time_to_first_token": 0.78,
                    "avg_tokens_per_second": 22.4,
                    "avg_tokens": 254.8,
                    "total_cost": 0.02175,
                    "avg_cost": 0.00435,
                    "total_api_cost": 0.02175,
                    "total_infrastructure_cost": 0.0,
                    "metric_scores": {
                        "f1": 0.87,
                        "context_relevance": 0.91,
                        "hallucination": 0.14,
                        "faithfulness": 0.90,
                        "answer_relevance": 0.93,
                        "conciseness": 0.86
                    }
                },
                "deepseek-r1": {
                    "avg_latency": 4.25,
                    "avg_time_to_first_token": 1.82,
                    "avg_tokens_per_second": 14.8,
                    "avg_tokens": 232.6,
                    "total_cost": 3.21,
                    "avg_cost": 0.642,
                    "total_api_cost": 0.0,
                    "total_infrastructure_cost": 3.21,
                    "metric_scores": {
                        "f1": 0.83,
                        "context_relevance": 0.87,
                        "hallucination": 0.18,
                        "faithfulness": 0.85,
                        "answer_relevance": 0.90,
                        "conciseness": 0.84
                    }
                }
            },
            "metric_summaries": {
                "f1": {
                    "gpt4o": 0.86,
                    "claude-3-opus": 0.89,
                    "claude-3-sonnet": 0.87,
                    "deepseek-r1": 0.83
                },
                "context_relevance": {
                    "gpt4o": 0.92,
                    "claude-3-opus": 0.95,
                    "claude-3-sonnet": 0.91,
                    "deepseek-r1": 0.87
                },
                "hallucination": {
                    "gpt4o": 0.12,
                    "claude-3-opus": 0.08,
                    "claude-3-sonnet": 0.14,
                    "deepseek-r1": 0.18
                },
                "faithfulness": {
                    "gpt4o": 0.89,
                    "claude-3-opus": 0.94,
                    "claude-3-sonnet": 0.90,
                    "deepseek-r1": 0.85
                },
                "answer_relevance": {
                    "gpt4o": 0.94,
                    "claude-3-opus": 0.96,
                    "claude-3-sonnet": 0.93,
                    "deepseek-r1": 0.90
                },
                "conciseness": {
                    "gpt4o": 0.85,
                    "claude-3-opus": 0.88,
                    "claude-3-sonnet": 0.86,
                    "deepseek-r1": 0.84
                }
            }
        }
        
        # Mock results
        results = []
        
        # Add a mock response for each model and task
        for task_id in ["rag-1", "rag-2", "rag-3", "rag-4", "rag-5"]:
            for model in ["gpt4o", "claude-3-opus", "claude-3-sonnet", "deepseek-r1"]:
                results.append({
                    "model_id": model,
                    "task_id": task_id,
                    "response": f"Mock response from {model} for task {task_id}",
                    "latency": round(float(summary["model_summaries"][model]["avg_latency"]) * (0.9 + 0.2 * (hash(task_id + model) % 100) / 100), 2),
                    "token_count": round(float(summary["model_summaries"][model]["avg_tokens"]) * (0.9 + 0.2 * (hash(task_id + model) % 100) / 100), 0),
                    "cost": round(float(summary["model_summaries"][model]["avg_cost"]) * (0.9 + 0.2 * (hash(task_id + model) % 100) / 100), 5),
                    "metric_scores": {
                        metric: round(float(summary["metric_summaries"][metric][model]) * (0.9 + 0.2 * (hash(task_id + model + metric) % 100) / 100), 2)
                        for metric in summary["metrics"]
                    }
                })
        
        return jsonify({
            "experiment_name": experiment_name,
            "run_id": "mock-run-id",
            "summary": summary,
            "results": results,
            "report_url": f"/api/reports/{experiment_name}/mock-run-id"
        })
    else:
        # Return a simplified response for other experiments
        return jsonify({
            "experiment_name": experiment_name,
            "run_id": "mock-run-id",
            "summary": {
                "dataset": "Sample Dataset",
                "models": ["gpt4o", "claude-3-opus"],
                "metrics": ["f1", "conciseness"],
                "timestamp": "2025-02-25T14:30:00",
                "task_count": 3,
                "model_summaries": {
                    "gpt4o": {
                        "avg_latency":
                        2.34,
                        "avg_tokens": 248.6,
                        "total_cost": 0.03125,
                        "avg_cost": 0.00625,
                        "metric_scores": {
                            "f1": 0.86,
                            "conciseness": 0.85
                        }
                    },
                    "claude-3-opus": {
                        "avg_latency": 3.12,
                        "avg_tokens": 276.4,
                        "total_cost": 0.05625,
                        "avg_cost": 0.01125,
                        "metric_scores": {
                            "f1": 0.89,
                            "conciseness": 0.88
                        }
                    }
                }
            },
            "results": [],
            "report_url": f"/api/reports/{experiment_name}/mock-run-id"
        })

@app.route('/api/evaluate', methods=['POST'])
def run_evaluation():
    """Mock endpoint for running evaluations"""
    # In a real implementation, this would:
    # 1. Load the dataset
    # 2. Run evaluations on each model
    # 3. Calculate metrics
    # 4. Save results
    # 5. Return a summary
    
    data = request.json
    
    # Log what was received
    logging.info(f"Received evaluation request: {data}")
    
    # Return a mock response
    return jsonify({
        "experiment_name": data.get("experiment_name", "unknown_experiment"),
        "run_id": str(uuid.uuid4()),
        "status": "success",
        "message": "Evaluation completed successfully (mock)",
    })

@app.route('/api/generate', methods=['POST'])
def generate_response():
    """Mock endpoint for generating responses"""
    # In a real implementation, this would use the ModelFactory to generate responses
    
    data = request.json
    model_id = data.get("model_id")
    prompt = data.get("prompt")
    
    if not model_id or not prompt:
        return jsonify({"error": "Missing model_id or prompt"}), 400
    
    # Log what was received
    logging.info(f"Generating response with model {model_id} for prompt: {prompt[:50]}...")
    
    # Simulate response generation
    time.sleep(1)  # Simulate processing time
    
    # Create mock response data
    mock_metrics = {
        "latency": 2.34,
        "time_to_first_token": 0.82,
        "tokens_per_second": 21.3,
        "token_count": 248,
        "total_cost": 0.00625,
        "api_cost": 0.00625 if model_id != "deepseek-r1" else 0,
        "infrastructure_cost": 0 if model_id != "deepseek-r1" else 0.642
    }
    
    return jsonify({
        "response_id": str(uuid.uuid4()),
        "model_id": model_id,
        "response": f"This is a mock response from {model_id} for the prompt: {prompt[:50]}...",
        "metrics": mock_metrics
    })

if __name__ == '__main__':
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
