#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Function to send a request to the MCP server
async function sendRequest(request) {
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
          reject(new Error(`Failed to parse response: ${error.message}\nRaw response: ${responseData}`));
        }
      }
    });
    
    server.stdin.write(JSON.stringify(request) + '\n');
    server.stdin.end();
  });
}

// Test the server
async function testServer() {
  try {
    console.log('Testing MCP server...');
    
    // First, list the available tools
    console.log('Listing tools...');
    const listToolsRequest = {
      id: '1',
      jsonrpc: '2.0',
      method: 'tools/list',
      params: {}
    };
    
    const listToolsResponse = await sendRequest(listToolsRequest);
    console.log('Tools list response:', JSON.stringify(listToolsResponse, null, 2));
    
    // Check if we got a valid response with tools
    if (listToolsResponse.result && listToolsResponse.result.tools && listToolsResponse.result.tools.length > 0) {
      console.log(`Found ${listToolsResponse.result.tools.length} tools`);
      console.log('Server is working correctly with tools capability!');
    } else {
      console.error('Failed to get tools list');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testServer(); 