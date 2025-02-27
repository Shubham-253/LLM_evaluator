# LLM Evaluation Platform

A comprehensive platform for evaluating and comparing Large Language Models (LLMs) across various metrics and tasks.

## Features

- Evaluate multiple LLMs on standardized datasets
- Compare performance across a wide range of metrics
- Track and visualize evaluation results
- Test models with custom prompts
- Support for various LLM providers:
  - OpenAI API (GPT models)
  - AWS Bedrock (Claude and other models)
  - Local models via Ollama

## Architecture

- **Backend**: Python/Flask API
- **Frontend**: React with Tailwind CSS

## Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- pip
- npm

### API Keys

You'll need to set up the following API keys:

- OpenAI API key (for OpenAI models)
- AWS credentials (for Bedrock models)
- Local Ollama installation (for open-source models)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/llm-evaluation-platform.git
   cd llm-evaluation-platform
   ```

2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

4. Set up your environment variables:
   ```
   export OPENAI_API_KEY="your-openai-key"
   export AWS_ACCESS_KEY_ID="your-aws-access-key"
   export AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   export AWS_REGION="us-east-1"
   ```
   
   Alternatively, create a `.env` file in the backend directory with these variables.

5. Run the setup script to create the necessary directories and copy files:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```

### Running the Platform

1. Start the backend server:
   ```
   cd backend
   python api.py
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Access the platform at `http://localhost:3000`

## Usage

### Creating a New Evaluation

1. Navigate to "New Evaluation" in the UI
2. Name your experiment
3. Select a dataset from the available options or upload your own
4. Choose the models you want to evaluate
5. Select the metrics you want to measure
6. Run the evaluation

### Viewing Results

Results are displayed in a dashboard with:
- Overall performance metrics
- Model-by-model comparison
- Task-by-task breakdown
- Visualization of response quality, latency, and cost

### Testing Models

The Test Console allows you to:
1. Select a model
2. Enter a custom prompt
3. See the response along with performance metrics

## Creating Custom Datasets

Create a JSON file in the `configs/datasets` directory with the following structure:

```
{
  "name": "My Custom Dataset",
  "tasks": [
    {
      "task_id": "task-1",
      "task_type": "rag",  // Options: "rag", "qa", "generation"
      "prompt": "What are the main benefits of X?",
      "expected_output": "The main benefits are A, B, and C.",
      "context": [
        "X provides several benefits including A, B, and C."
      ],
      "metadata": {
        "source": "document1.txt"
      }
    }
  ]
}
```

## Adding New Models

To add a new model, edit the `configs/models/models_config.json` file:

```
{
  "my-new-model": {
    "type": "openai",  // Options: "openai", "bedrock", "ollama"
    "model_name": "gpt-4",
    "temperature": 0.7,
    "max_tokens": 1500,
    "prompt_price_per_1k": 0.005,
    "completion_price_per_1k": 0.015,
    "description": "My new model"
  }
}
```

## Extending the Platform

### Adding New Metrics

To add a new metric:

1. Add a calculation method in `backend/src/evaluation/metrics/metric_calculator.py`
2. Register the metric in the `metric_functions` dictionary
3. Add the metric to the API's metrics endpoint in `api.py`

### Adding New Model Providers

To support a new LLM provider:

1. Add a new model type in `backend/src/models/model_factory.py`
2. Implement the provider-specific methods for model invocation
3. Update the config format in `models_config.json`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for GPT models
- Anthropic for Claude models
- AWS for Bedrock service
- Ollama for local model support
