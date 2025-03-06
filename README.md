# MCP Memory Server

A Model Context Protocol (MCP) server for Claude Desktop that provides structured memory management across chat sessions.

## Features

- Store memories as structured markdown files
- Index memories using Lunr.js for efficient retrieval
- Tag and categorize memories
- Create relationships between memories
- Search memories by content, tags, or type

## Memory Structure

Memories are stored in a hierarchical structure:

```
/memory
  /entities/            # Information about specific entities (people, projects, etc.)
  /concepts/            # Abstract concepts or knowledge
  /sessions/            # Session-specific memories
  /index.json           # Lunr.js search index
  /metadata.json        # Overall memory metadata
```

## Usage with Claude Desktop

Add this to your claude_desktop_config.json:

```json
{
  "mcpServers": {
    "memory": {
      "command": "node",
      "args": ["path/to/mcp-memory/dist/index.js"]
    }
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start

# Development mode (watch for changes)
npm run dev
```

## License

MIT 