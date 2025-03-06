# MCP Memory Server

A Model Context Protocol (MCP) server for Claude Desktop that provides structured memory management across chat sessions.

## Features

- Store memories as structured markdown files
- Index memories using Lunr.js for efficient retrieval
- Tag and categorize memories
- Create relationships between memories
- Search memories by content, tags, or type
- Build memory stores in specified directories

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

You can also set a custom memory directory using an environment variable:

```json
{
  "mcpServers": {
    "memory": {
      "command": "node",
      "args": ["path/to/mcp-memory/dist/index.js"],
      "env": {
        "MEMORY_DIR": "/path/to/custom/memory/directory"
      }
    }
  }
}
```

## Claude Project Instructions

This repository includes an `instructions_template.md` file that provides a comprehensive template for Claude project instructions. You can customize this template for your specific projects to help Claude effectively use the memory system.

The template includes:

- Memory system setup instructions
- Memory retrieval process
- Memory creation guidelines
- Memory organization system
- Memory maintenance procedures
- Conversation workflow
- Best practices

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

## Implementation Details

This server is built using:

- The official Model Context Protocol (MCP) SDK
- TypeScript for type safety
- Lunr.js for memory indexing and search
- Zod for schema validation

## License

MIT 