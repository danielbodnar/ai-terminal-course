import OpenAI from 'openai';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

let openaiClient = null;

export function initTools(apiKey) {
  openaiClient = new OpenAI({ apiKey });
}

/**
 * Define a tool (function) schema
 */
export function defineTool(name, description, parameters) {
  return {
    type: 'function',
    function: {
      name,
      description,
      parameters
    }
  };
}

/**
 * Call LLM with tools available
 */
export async function callWithTools(messages, tools, temperature = 0.7) {
  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    tools,
    temperature,
    tool_choice: 'auto'
  });

  return {
    message: response.choices[0].message,
    usage: response.usage,
    finishReason: response.choices[0].finish_reason
  };
}

/**
 * Execute tool call and get result
 */
export async function executeTool(toolCall, availableFunctions) {
  const functionName = toolCall.function.name;
  const functionArgs = JSON.parse(toolCall.function.arguments);

  const functionToCall = availableFunctions[functionName];

  if (!functionToCall) {
    throw new Error(`Function ${functionName} not found`);
  }

  const result = await functionToCall(functionArgs);

  return {
    tool_call_id: toolCall.id,
    role: 'tool',
    name: functionName,
    content: JSON.stringify(result)
  };
}

/**
 * Handle full tool calling loop
 */
export async function handleToolLoop(messages, tools, availableFunctions, maxIterations = 5) {
  const history = [...messages];
  let iteration = 0;

  while (iteration < maxIterations) {
    iteration++;

    const response = await callWithTools(history, tools);

    // Add assistant message to history
    history.push(response.message);

    // If no tool calls, we're done
    if (!response.message.tool_calls || response.message.tool_calls.length === 0) {
      return {
        finalMessage: response.message.content,
        history,
        iterations: iteration,
        usage: response.usage
      };
    }

    // Execute all tool calls
    const toolResults = [];
    for (const toolCall of response.message.tool_calls) {
      const result = await executeTool(toolCall, availableFunctions);
      toolResults.push(result);
    }

    // Add tool results to history
    history.push(...toolResults);
  }

  throw new Error(`Max iterations (${maxIterations}) reached`);
}

/**
 * Built-in tool: Get current weather
 */
export async function getWeather(args) {
  const { location } = args;

  // Simulate weather API call
  const weatherData = {
    'San Francisco': { temp: 72, condition: 'Sunny', humidity: 65 },
    'New York': { temp: 68, condition: 'Cloudy', humidity: 70 },
    'London': { temp: 55, condition: 'Rainy', humidity: 85 },
    'Tokyo': { temp: 75, condition: 'Clear', humidity: 60 }
  };

  const data = weatherData[location] || {
    temp: 70,
    condition: 'Partly Cloudy',
    humidity: 60
  };

  return {
    location,
    temperature: data.temp,
    condition: data.condition,
    humidity: data.humidity,
    unit: 'fahrenheit'
  };
}

/**
 * Built-in tool: Execute shell command (DANGEROUS - sandbox in production!)
 */
export async function executeCommand(args) {
  const { command } = args;

  // Whitelist safe commands
  const safeCommands = ['ls', 'pwd', 'date', 'whoami', 'echo'];
  const commandName = command.split(' ')[0];

  if (!safeCommands.includes(commandName)) {
    return {
      success: false,
      error: `Command '${commandName}' not allowed. Safe commands: ${safeCommands.join(', ')}`
    };
  }

  try {
    const { stdout, stderr } = await execAsync(command);
    return {
      success: true,
      stdout: stdout.trim(),
      stderr: stderr.trim()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Built-in tool: Search (simulated)
 */
export async function searchWeb(args) {
  const { query } = args;

  // Simulate search results
  const results = [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
      snippet: `Information about ${query}...`
    },
    {
      title: `Understanding ${query}`,
      url: `https://example.com/${query}`,
      snippet: `Learn more about ${query} and related concepts...`
    },
    {
      title: `${query} Guide`,
      url: `https://guide.example.com/${query}`,
      snippet: `Complete guide to ${query} for beginners...`
    }
  ];

  return { query, results };
}

/**
 * Built-in tool: Calculator
 */
export async function calculate(args) {
  const { expression } = args;

  try {
    // Safe eval (only allow numbers and basic operators)
    const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');

    if (sanitized !== expression) {
      return {
        success: false,
        error: 'Invalid expression. Only numbers and +, -, *, /, () allowed.'
      };
    }

    // eslint-disable-next-line no-eval
    const result = eval(sanitized);

    return {
      success: true,
      expression,
      result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get tool definitions for common use cases
 */
export function getCommonTools() {
  return {
    weather: defineTool(
      'get_weather',
      'Get current weather for a location',
      {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name, e.g. San Francisco'
          }
        },
        required: ['location']
      }
    ),
    command: defineTool(
      'execute_command',
      'Execute a shell command (limited to safe commands)',
      {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'Shell command to execute (only: ls, pwd, date, whoami, echo)'
          }
        },
        required: ['command']
      }
    ),
    search: defineTool(
      'search_web',
      'Search the web for information',
      {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query'
          }
        },
        required: ['query']
      }
    ),
    calculator: defineTool(
      'calculate',
      'Perform mathematical calculations',
      {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Mathematical expression to evaluate, e.g. "2 + 2" or "(10 * 5) / 2"'
          }
        },
        required: ['expression']
      }
    )
  };
}

/**
 * Get implementations for common tools
 */
export function getCommonFunctions() {
  return {
    get_weather: getWeather,
    execute_command: executeCommand,
    search_web: searchWeb,
    calculate
  };
}
