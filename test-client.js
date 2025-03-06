#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Clean up test directories
const testCustomDir = './test-custom-memory';
if (fs.existsSync(testCustomDir)) {
  fs.rmSync(testCustomDir, { recursive: true, force: true });
  console.log(`Removed existing directory: ${testCustomDir}`);
}

// Function to send a request to the MCP server
function sendRequest(request) {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['./dist/index.js'], {
      env: { ...process.env, MEMORY_DIR: './test-memory' },
      stdio: ['pipe', 'pipe', 'inherit']
    });
    
    let responseData = '';
    
    server.stdout.on('data', (data) => {
      responseData += data.toString();
    });
    
    server.on('error', (error) => {
      reject(error);
    });
    
    server.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Server exited with code ${code}`));
      } else {
        try {
          const response = JSON.parse(responseData.trim());
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      }
    });
    
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();
  });
}

// Test the build_memory_store tool
async function testBuildMemoryStore() {
  try {
    console.log('Testing build_memory_store tool...');
    
    const response = await sendRequest({
      id: '1',
      type: 'call_tool',
      tool_name: 'build_memory_store',
      tool_input: {
        directory: testCustomDir,
        overwrite: true
      }
    });
    
    console.log('Response:', JSON.stringify(response, null, 2));
    
    // Verify the directory structure
    if (fs.existsSync(testCustomDir) && 
        fs.existsSync(`${testCustomDir}/entities`) && 
        fs.existsSync(`${testCustomDir}/concepts`) && 
        fs.existsSync(`${testCustomDir}/sessions`) && 
        fs.existsSync(`${testCustomDir}/metadata.json`) && 
        fs.existsSync(`${testCustomDir}/index.json`) && 
        fs.existsSync(`${testCustomDir}/README.md`)) {
      console.log('Directory structure verified successfully!');
    } else {
      console.error('Directory structure verification failed!');
      process.exit(1);
    }
    
    // Test creating a memory in the custom directory
    console.log('\nTesting create_memory in custom directory...');
    
    const createResponse = await sendRequest({
      id: '2',
      type: 'call_tool',
      tool_name: 'create_memory',
      tool_input: {
        title: 'Test Memory',
        type: 'concept',
        tags: ['test', 'example'],
        content: 'This is a test memory created by the test script.'
      }
    });
    
    console.log('Create Response:', JSON.stringify(createResponse, null, 2));
    
    // Extract memory ID
    const memoryId = createResponse.content[0].text.split('Memory created with ID: ')[1];
    console.log(`Created memory with ID: ${memoryId}`);
    
    // Verify the memory file was created
    const memoryFile = path.join('./test-memory/concepts', `${memoryId}.md`);
    if (fs.existsSync(memoryFile)) {
      console.log(`Memory file verified: ${memoryFile}`);
      console.log('Memory file contents:');
      console.log(fs.readFileSync(memoryFile, 'utf-8'));
    } else {
      console.error(`Memory file not found: ${memoryFile}`);
      process.exit(1);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testBuildMemoryStore(); 