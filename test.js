#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

// Create test memory directories if they don't exist
const testMemoryDir = './test-memory';
const testCustomDir = './test-custom-memory';

// Remove test-custom-memory directory if it exists
if (fs.existsSync(testCustomDir)) {
  fs.rmSync(testCustomDir, { recursive: true, force: true });
  console.log(`Removed existing directory: ${testCustomDir}`);
}

// Create test memory directories
const dirs = [
  testMemoryDir,
  `${testMemoryDir}/entities`,
  `${testMemoryDir}/concepts`,
  `${testMemoryDir}/sessions`
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Start the MCP server
const server = spawn('node', ['./dist/index.js'], {
  env: { ...process.env, MEMORY_DIR: testMemoryDir },
  stdio: ['pipe', 'pipe', process.stderr]
});

// Track the current memory directory
let currentMemoryDir = testMemoryDir;

// Handle server output
server.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString().trim());
    console.log('Server response:', JSON.stringify(response, null, 2));
    
    // Process the response
    if (response.type === 'list_tools_response') {
      console.log(`\nFound ${response.tools.length} tools\n`);
      
      // Test building a memory store
      sendRequest({
        id: '2',
        type: 'call_tool',
        tool_name: 'build_memory_store',
        tool_input: {
          directory: testCustomDir,
          overwrite: true
        }
      });
    } else if (response.type === 'call_tool_response') {
      if (response.content[0].text && response.content[0].text.includes('Memory store successfully built')) {
        console.log(`\nMemory store built successfully\n`);
        
        // Verify the directory structure
        if (fs.existsSync(testCustomDir) && 
            fs.existsSync(`${testCustomDir}/entities`) && 
            fs.existsSync(`${testCustomDir}/concepts`) && 
            fs.existsSync(`${testCustomDir}/sessions`) && 
            fs.existsSync(`${testCustomDir}/metadata.json`) && 
            fs.existsSync(`${testCustomDir}/index.json`) && 
            fs.existsSync(`${testCustomDir}/README.md`)) {
          console.log('Directory structure verified successfully!');
          
          // Update the memory directory for the server
          currentMemoryDir = testCustomDir;
          
          // Restart the server with the new memory directory
          server.kill();
          
          // Wait for the server to exit before restarting
          server.on('close', () => {
            console.log('Restarting server with new memory directory...');
            
            // Start a new server with the custom memory directory
            const newServer = spawn('node', ['./dist/index.js'], {
              env: { ...process.env, MEMORY_DIR: currentMemoryDir },
              stdio: ['pipe', 'pipe', process.stderr]
            });
            
            // Replace the old server with the new one
            Object.assign(server, newServer);
            
            // Wait for the new server to initialize
            setTimeout(() => {
              // Test creating a memory
              sendRequest({
                id: '3',
                type: 'call_tool',
                tool_name: 'create_memory',
                tool_input: {
                  title: 'Test Memory',
                  type: 'concept',
                  tags: ['test', 'example'],
                  content: 'This is a test memory created by the test script.'
                }
              });
            }, 2000);
          });
        } else {
          console.error('Directory structure verification failed!');
          server.kill();
          process.exit(1);
        }
      } else if (response.content[0].text && response.content[0].text.includes('Memory created with ID:')) {
        // Extract memory ID
        const memoryId = response.content[0].text.split('Memory created with ID: ')[1];
        console.log(`\nCreated memory with ID: ${memoryId}\n`);
        
        // Verify the memory file was created in the custom directory
        setTimeout(() => {
          const memoryFile = `${currentMemoryDir}/concepts/${memoryId}.md`;
          if (fs.existsSync(memoryFile)) {
            console.log(`Memory file verified: ${memoryFile}`);
            
            // Test searching memories
            sendRequest({
              id: '4',
              type: 'call_tool',
              tool_name: 'search_memories',
              tool_input: {
                query: 'test'
              }
            });
          } else {
            console.error(`Memory file not found: ${memoryFile}`);
            server.kill();
            process.exit(1);
          }
        }, 500);
      } else if (response.content[0].json) {
        console.log('\nSearch results found. Test completed successfully!\n');
        
        // Clean up and exit
        server.kill();
        process.exit(0);
      }
    }
  } catch (error) {
    console.error('Error processing server output:', error);
    console.error('Raw output:', data.toString());
  }
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle server exit
server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

// Send a request to the server
function sendRequest(request) {
  console.log('Sending request:', JSON.stringify(request, null, 2));
  server.stdin.write(JSON.stringify(request) + '\n');
}

// Start by listing tools after a delay to allow server initialization
setTimeout(() => {
  sendRequest({
    id: '1',
    type: 'list_tools'
  });
}, 2000); 