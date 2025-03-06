# Changelog

## v0.1.0 - Initial Release

### Features
- Created a Model Context Protocol (MCP) server for Claude memory management
- Implemented memory storage using markdown files
- Added Lunr.js for memory indexing and search
- Implemented memory types: entity, concept, and session
- Added tagging and relationship capabilities
- Created a build_memory_store tool for initializing memory stores in specified directories
- Added comprehensive instructions template for Claude projects

### Technical Improvements
- Used the official MCP SDK for compatibility with Claude Desktop
- Implemented proper type safety with TypeScript and Zod
- Added error handling for all operations
- Created test scripts to verify functionality

### Documentation
- Added README.md with usage instructions
- Created USAGE.md with detailed tool documentation
- Added instructions_template.md for Claude project instructions
- Created example configuration files for Claude Desktop

### Next Steps
- Add more comprehensive tests
- Implement vector embeddings for semantic search
- Add memory prioritization based on importance and recency
- Create a web interface for memory visualization
- Add automatic tagging based on content analysis 