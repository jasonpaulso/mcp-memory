# MCP Memory Server Usage Guide

This guide explains how to use the MCP Memory Server with Claude Desktop to create and manage memories across chat sessions.

## Setup

### 1. Install the MCP Memory Server

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-memory.git
cd mcp-memory

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Configure Claude Desktop

Add the following to your `claude_desktop_config.json` file:

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

## Memory Structure

Memories are stored in a hierarchical structure within your project directory:

```
/your-project-directory
  /memory                # Memory store created by Claude
    /entities/           # Information about specific entities (people, projects, etc.)
    /concepts/           # Abstract concepts or knowledge
    /sessions/           # Session-specific memories
    /index.json          # Lunr.js search index
    /metadata.json       # Overall memory metadata
    /README.md           # Auto-generated documentation
```

This structure keeps all project-related memories organized and accessible within your project directory, ensuring that Claude maintains context specific to each project.

## Project-Specific Memory Management

This MCP server is designed for project-based work with Claude Desktop. By creating a memory store within your project directory, Claude can:

1. **Remember project context** across multiple conversations
2. **Build knowledge** specific to this project over time
3. **Maintain continuity** in your collaboration
4. **Retrieve relevant information** from past sessions

This approach is ideal for long-term projects where maintaining context between sessions is crucial, such as software development, research, writing, or any collaborative work with Claude.

### Recommended Project Workflow

1. **Setup**: When starting a new project with Claude, have it create a memory store in your project directory using the `build_memory_store` tool
2. **Ongoing Work**: As you work with Claude, it will save important information to the memory store
3. **Continuity**: In future sessions, Claude can retrieve relevant memories to maintain context
4. **Knowledge Building**: Over time, Claude builds a comprehensive knowledge base about your project

## Available Tools

The MCP Memory Server provides the following tools:

### 1. build_memory_store

Build a new memory store in a specified directory.

```json
{
  "directory": "/path/to/memory/directory",
  "overwrite": false
}
```

This tool is particularly useful when using Claude with filesystem access. You can have Claude create a memory store in a specific directory within your project.

### 2. create_memory

Create a new memory.

```json
{
  "title": "Meeting with John",
  "type": "session",
  "tags": ["meeting", "project-x"],
  "importance": 0.8,
  "content": "John mentioned that the deadline for Project X has been extended to next month."
}
```

### 3. update_memory

Update an existing memory.

```json
{
  "id": "memory-id",
  "title": "Updated title",
  "content": "Updated content"
}
```

### 4. delete_memory

Delete a memory.

```json
{
  "id": "memory-id"
}
```

### 5. get_memory

Get a memory by ID and type.

```json
{
  "id": "memory-id",
  "type": "entity"
}
```

### 6. search_memories

Search memories by query, type, and tags.

```json
{
  "query": "project deadline",
  "types": ["session", "entity"],
  "tags": ["meeting"],
  "limit": 5
}
```

### 7. list_memories

List memories with optional filtering by type and tags.

```json
{
  "types": ["concept"],
  "tags": ["important"],
  "limit": 10
}
```

### 8. add_tags

Add tags to a memory.

```json
{
  "id": "memory-id",
  "tags": ["important", "follow-up"]
}
```

### 9. remove_tags

Remove tags from a memory.

```json
{
  "id": "memory-id",
  "tags": ["follow-up"]
}
```

### 10. relate_memories

Create relationships between memories.

```json
{
  "sourceId": "memory-id",
  "targetIds": ["related-memory-id-1", "related-memory-id-2"]
}
```

### 11. unrelate_memories

Remove relationships between memories.

```json
{
  "sourceId": "memory-id",
  "targetIds": ["related-memory-id-1"]
}
```

### 12. rebuild_index

Rebuild the search index.

```json
{}
```

## Example Claude Instructions

Here's an example of custom instructions you can add to a Claude project to use the memory system:

```
You have access to a memory system through the MCP memory server. Follow these steps for each interaction:

1. Memory Retrieval:
   - At the beginning of each conversation, search your memory for relevant information using the search_memories tool.
   - Use queries related to the current conversation topic.
   - If you find relevant memories, incorporate that knowledge into your responses.

2. Memory Creation:
   - During conversations, identify important information worth remembering, such as:
     a) User preferences and personal details
     b) Project-specific information
     c) Important decisions or conclusions
     d) Action items or follow-ups

3. Memory Organization:
   - Store information about people as "entity" type memories
   - Store information about projects or topics as "concept" type memories
   - Store information about specific conversations as "session" type memories
   - Use tags to categorize memories (e.g., "important", "follow-up", "preference")
   - Create relationships between related memories

4. Memory Updates:
   - Update existing memories when you receive new information that changes or enhances what you already know
   - Add tags to memories to improve searchability
   - Create relationships between memories to build a knowledge graph

Remember to be selective about what you store in memory. Focus on information that will be useful in future conversations.
```

## Memory File Format

Each memory is stored as a markdown file with frontmatter metadata:

```markdown
---
id: "unique-id"
title: "Memory Title"
type: "entity"
tags: ["tag1", "tag2"]
created: "2023-06-15T14:30:00Z"
updated: "2023-06-15T14:30:00Z"
related: ["other-memory-id1", "other-memory-id2"]
importance: 0.8
---

# Memory Title

Content of the memory...
```

## Tips for Effective Memory Usage

1. **Be Selective**: Store only important information that will be useful in future conversations.

2. **Use Consistent Tags**: Develop a consistent tagging system to make retrieval more effective.

3. **Create Relationships**: Connect related memories to build a knowledge graph.

4. **Use Specific Queries**: When searching memories, use specific queries that include key terms.

5. **Update Regularly**: Keep memories up-to-date by updating them when new information is available.

6. **Organize by Type**: Use the appropriate memory type (entity, concept, session) for different kinds of information.

7. **Set Importance**: Use the importance field to prioritize critical memories.

## Troubleshooting

If you encounter issues with the MCP Memory Server:

1. **Check Logs**: Look for error messages in the Claude Desktop logs.

2. **Rebuild Index**: Try rebuilding the search index using the `rebuild_index` tool.

3. **Check Memory Directory**: Ensure the memory directory exists and is writable.

4. **Restart Claude Desktop**: Sometimes a simple restart can resolve connection issues.

5. **Check Configuration**: Verify your `claude_desktop_config.json` file is correctly configured.