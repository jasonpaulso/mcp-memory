export class Server {
    constructor() {
        this.tools = new Map();
    }
    /**
     * Register a tool with the server
     */
    registerTool(tool) {
        this.tools.set(tool.name, tool);
    }
    /**
     * List all registered tools
     */
    listTools() {
        return Array.from(this.tools.values());
    }
    /**
     * Call a tool by name
     */
    async callTool(name, input) {
        const tool = this.tools.get(name);
        if (!tool) {
            return {
                content: [{ type: 'text', text: `Tool '${name}' not found` }],
                isError: true
            };
        }
        try {
            return await tool.handler(input);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text', text: `Error: ${errorMessage}` }],
                isError: true
            };
        }
    }
    /**
     * Connect to a transport
     */
    async connect(transport) {
        await transport.connect(this);
    }
}
/**
 * Simple stdio transport for MCP server
 */
export class StdioServerTransport {
    async connect(server) {
        // Handle stdin/stdout communication
        process.stdin.setEncoding('utf8');
        let buffer = '';
        process.stdin.on('data', async (chunk) => {
            buffer += chunk;
            try {
                // Try to parse complete JSON objects
                const messages = this.extractJsonObjects(buffer);
                if (messages.length > 0) {
                    // Update buffer to contain only unprocessed data
                    const lastJsonEnd = buffer.lastIndexOf('}') + 1;
                    buffer = buffer.slice(lastJsonEnd);
                    // Process each complete message
                    for (const message of messages) {
                        await this.handleMessage(message, server);
                    }
                }
            }
            catch (error) {
                console.error('Error processing message:', error);
            }
        });
        process.stdin.on('end', () => {
            console.error('stdin stream ended');
            process.exit(0);
        });
    }
    /**
     * Extract complete JSON objects from a string
     */
    extractJsonObjects(str) {
        const objects = [];
        let startIndex = str.indexOf('{');
        while (startIndex !== -1) {
            try {
                // Find a valid JSON object
                const substr = str.slice(startIndex);
                const parsed = JSON.parse(substr);
                objects.push(parsed);
                // Move past this object
                startIndex = str.indexOf('{', startIndex + 1);
            }
            catch (error) {
                // If parsing fails, try the next opening brace
                startIndex = str.indexOf('{', startIndex + 1);
            }
        }
        return objects;
    }
    /**
     * Handle an MCP message
     */
    async handleMessage(message, server) {
        try {
            if (message.type === 'list_tools') {
                // Handle list_tools request
                const tools = server.listTools().map(tool => ({
                    name: tool.name,
                    description: tool.description,
                    input_schema: tool.inputSchema
                }));
                this.sendResponse({
                    id: message.id,
                    type: 'list_tools_response',
                    tools
                });
            }
            else if (message.type === 'call_tool') {
                // Handle call_tool request
                const { tool_name, tool_input } = message;
                const response = await server.callTool(tool_name, tool_input);
                this.sendResponse({
                    id: message.id,
                    type: 'call_tool_response',
                    content: response.content,
                    is_error: response.isError || false
                });
            }
        }
        catch (error) {
            console.error('Error handling message:', error);
            this.sendResponse({
                id: message.id,
                type: message.type === 'list_tools' ? 'list_tools_response' : 'call_tool_response',
                is_error: true,
                content: [{
                        type: 'text',
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }]
            });
        }
    }
    /**
     * Send a response to stdout
     */
    sendResponse(response) {
        process.stdout.write(JSON.stringify(response) + '\n');
    }
}
