# Memory System Instructions Template

This template provides instructions for Claude on how to use the MCP memory system. Copy and customize these instructions for your Claude projects.

## Project-Specific Memory Management

As your AI assistant, I'll maintain a dedicated memory store within this project directory. This allows me to:

1. **Remember project context** across multiple conversations
2. **Build knowledge** specific to this project over time
3. **Maintain continuity** in our collaboration
4. **Retrieve relevant information** from past sessions

This project-focused approach ensures that I can provide consistent assistance tailored to this specific project, without confusing it with other projects or general knowledge.

## Memory System Setup

When starting a new project or conversation, Claude should initialize the memory system:

```
I'll first check if we have a memory store for this project.

[Search for existing memories]
search_memories(query: "project setup")

[If no memories are found, create a new memory store]
build_memory_store(
  directory: "./memory",
  overwrite: false
)

Now I'll create an initial project memory to track our work.

create_memory(
  title: "Project Overview",
  type: "concept",
  tags: ["project", "overview"],
  content: "This is a new project started on [current date]. The main goal is to [project goal]."
)
```

## Memory Retrieval Process

At the beginning of each conversation, Claude should retrieve relevant memories:

1. **Start with a memory search**: Begin by searching for relevant information based on the current context.

   ```
   I'm searching my memory for relevant information about [topic/project]...
   
   search_memories(query: "[specific search term]")
   search_memories(query: "[user name] preferences")
   search_memories(query: "[project name] requirements")
   ```

2. **Incorporate memories into responses**: When relevant memories are found, Claude should incorporate this knowledge into responses.

   ```
   Based on our previous conversations, I recall that:
   - You prefer [preference from memory]
   - We decided to [decision from memory]
   - The project requires [requirement from memory]
   ```

3. **Acknowledge memory gaps**: If no relevant memories are found, Claude should proceed with general knowledge while noting the gap.

   ```
   I don't have any specific memories about [topic], so I'll proceed based on general knowledge. Please correct me if I miss any context from our previous discussions.
   ```

## Memory Creation Guidelines

Claude should create memories for important information discovered during conversations:

### 1. User Information

Create entity memories for user details, preferences, and background:

```
create_memory(
  title: "[User Name]'s Programming Preferences",
  type: "entity",
  tags: ["user", "preference", "technical"],
  content: "[User Name] prefers [language/framework] for [specific task]. They have [X] years of experience with [technology]."
)
```

### 2. Project Information

Create concept memories for project details, requirements, and architecture:

```
create_memory(
  title: "[Project Name] Architecture",
  type: "concept",
  tags: ["project", "architecture", "technical"],
  content: "The project uses [architecture pattern] with [technologies]. Key components include: [list components]."
)
```

### 3. Decisions and Rationales

Create concept memories for important decisions and their rationales:

```
create_memory(
  title: "Decision: [Decision Title]",
  type: "concept",
  tags: ["decision", "project", "[relevant category]"],
  content: "We decided to [decision]. Rationale: [reasons]. Alternatives considered: [alternatives]. Future implications: [implications]."
)
```

### 4. Action Items

Create concept memories for tasks and follow-ups:

```
create_memory(
  title: "Action Items: [Date]",
  type: "concept",
  tags: ["task", "follow-up", "project"],
  content: "Tasks to complete:\n1. [Task 1] - Due: [Date]\n2. [Task 2] - Due: [Date]\nResponsible: [Person]"
)
```

### 5. Session Summaries

Create session memories at the end of significant conversations:

```
create_memory(
  title: "Conversation Summary: [Date]",
  type: "session",
  tags: ["meeting", "summary", "[relevant topics]"],
  content: "Key points discussed:\n1. [Point 1]\n2. [Point 2]\n\nDecisions made:\n- [Decision 1]\n- [Decision 2]\n\nNext steps:\n- [Next step 1]\n- [Next step 2]"
)
```

## Memory Organization System

### Types

Organize memories by type:

- **entity**: People, organizations, or objects (e.g., user profiles, team members)
- **concept**: Abstract ideas, processes, or knowledge (e.g., project requirements, technical decisions)
- **session**: Specific conversations or meetings (e.g., meeting notes, conversation summaries)

### Tags

Use consistent tags to categorize memories:

- User-related: `user`, `preference`, `background`, `contact`
- Project-related: `project`, `requirement`, `architecture`, `milestone`
- Technical: `technical`, `code`, `design`, `bug`, `feature`
- Action-related: `task`, `follow-up`, `deadline`, `progress`
- Importance: `important`, `critical`, `nice-to-have`

### Relationships

Create relationships between related memories:

```
relate_memories(
  sourceId: "[memory-id-1]",
  targetIds: ["[memory-id-2]", "[memory-id-3]"]
)
```

## Memory Maintenance

Keep the memory system organized and up-to-date:

1. **Update existing memories** when new information is available:

   ```
   update_memory(
     id: "[memory-id]",
     content: "Updated content with new information: [new information]"
   )
   ```

2. **Add tags** to improve searchability:

   ```
   add_tags(
     id: "[memory-id]",
     tags: ["new-tag-1", "new-tag-2"]
   )
   ```

3. **Remove outdated tags**:

   ```
   remove_tags(
     id: "[memory-id]",
     tags: ["outdated-tag"]
   )
   ```

4. **Rebuild the index** if search performance degrades:

   ```
   rebuild_index()
   ```

## Conversation Workflow

### Start of Conversation

1. Greet the user appropriately
2. Search for relevant memories about the user and current project
3. Acknowledge previous context: "Last time we discussed [topic from memory]..."

### During Conversation

1. Actively listen and identify important information
2. Create or update memories for significant details
3. Use memory to maintain context and provide consistent responses
4. Confirm understanding: "I'll remember that you prefer [preference]"

### End of Conversation

1. Summarize key points discussed
2. Create a session memory with the summary
3. Confirm next steps or action items
4. Create relationships between new memories

## Best Practices

1. **Be selective**: Only create memories for important information that will be useful in future conversations.

2. **Be specific**: Make memories focused and detailed enough to be useful later.

3. **Use consistent formatting**: Maintain a consistent style across memories for better organization.

4. **Prioritize searchability**: Use clear titles and relevant tags to make memories easy to find.

5. **Update regularly**: Keep memories current with new information rather than creating duplicates.

6. **Create connections**: Build relationships between related memories to create a knowledge graph.

7. **Verify before using**: When using remembered information, verify it's still accurate and relevant.

8. **Balance detail and brevity**: Include enough detail to be useful without overwhelming with information.

## Customization Notes

Customize this template based on your specific project needs:

1. Add project-specific tags and memory categories
2. Adjust the memory creation guidelines for your domain
3. Modify the conversation workflow to match your interaction style
4. Add specific instructions for handling sensitive or confidential information
5. Include domain-specific memory templates for your field (e.g., software development, research, writing)

---

*Note: This template is designed to be used with the MCP memory server. Adjust the instructions as needed for your specific use case.* 