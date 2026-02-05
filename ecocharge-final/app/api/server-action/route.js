/**
 * VULNERABLE SERVER ACTION ENDPOINT
 * 
 * This file simulates CVE-2025-55182 - React Server Components RCE
 * The vulnerability exists in unsafe deserialization of incoming payloads
 * 
 * FOR EDUCATIONAL/CTF PURPOSES ONLY
 */

import { NextResponse } from 'next/server';

// Simulated vulnerable deserialization function
function unsafeDeserialize(data) {
  /**
   * CVE-2025-55182 SIMULATION
   * 
   * In the real vulnerability, react-server-dom-webpack unsafely
   * deserializes Server Function payloads, allowing code execution
   * through specially crafted $$bound arrays with Function types.
   * 
   * This simulation demonstrates the vulnerability pattern.
   */
  
  if (typeof data === 'object' && data !== null) {
    // Check for malicious payload structure
    if (data.payload && data.payload.$type === 'ServerReference') {
      const bound = data.payload.$$bound;
      
      if (Array.isArray(bound)) {
        for (const item of bound) {
          // VULNERABLE: Executing code from deserialized payload
          if (item.$type === 'Function' && item.body) {
            try {
              // This simulates the unsafe eval/Function execution
              console.log('[VULN] Attempting to execute payload:', item.body);
              
              // In real exploitation, this would execute arbitrary code
              // For CTF, we simulate the behavior
              const result = eval(item.body);
              return { executed: true, result: String(result) };
            } catch (error) {
              console.error('[VULN] Execution error:', error.message);
              return { executed: true, error: error.message };
            }
          }
        }
      }
    }
    
    // Check for alternative payload format
    if (data.$$id === '__webpack_require__' && data.$$bound) {
      for (const item of data.$$bound) {
        if (item.body) {
          try {
            console.log('[VULN] Alternative payload execution:', item.body);
            const result = eval(item.body);
            return { executed: true, result: String(result) };
          } catch (error) {
            return { executed: true, error: error.message };
          }
        }
      }
    }
  }
  
  return { executed: false };
}

// Process different content types
function parseRequestBody(body, contentType) {
  if (contentType?.includes('application/json') || contentType?.includes('text/x-component')) {
    try {
      return typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      return body;
    }
  }
  return body;
}

export async function POST(request) {
  const contentType = request.headers.get('content-type') || '';
  const nextAction = request.headers.get('next-action');
  const serverRef = request.headers.get('x-react-server-reference');
  
  console.log('[SERVER-ACTION] Received request');
  console.log('[SERVER-ACTION] Content-Type:', contentType);
  console.log('[SERVER-ACTION] Next-Action:', nextAction);
  
  try {
    let body;
    
    // Parse body based on content type
    if (contentType.includes('json') || contentType.includes('x-component')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = parseRequestBody(text, contentType);
    }
    
    console.log('[SERVER-ACTION] Body:', JSON.stringify(body, null, 2));
    
    // VULNERABLE DESERIALIZATION
    const result = unsafeDeserialize(body);
    
    if (result.executed) {
      console.log('[SERVER-ACTION] Payload executed!');
      
      return NextResponse.json({
        status: 'processed',
        action: nextAction || 'server_action',
        result: result
      }, {
        status: 200,
        headers: {
          'X-Server-Action': 'executed',
          'Content-Type': 'application/json',
        }
      });
    }
    
    // Normal server action response
    return NextResponse.json({
      status: 'ok',
      action: nextAction || 'unknown',
      timestamp: new Date().toISOString(),
      message: 'Server action processed'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('[SERVER-ACTION] Error:', error);
    
    // Verbose error for information disclosure
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.DEBUG === 'true' ? error.stack : undefined,
      hint: 'Check server logs for details'
    }, {
      status: 500
    });
  }
}

export async function GET(request) {
  // Information disclosure - reveals endpoint existence
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/server-action',
    methods: ['POST'],
    contentTypes: ['application/json', 'text/x-component'],
    version: 'react-server-dom-webpack@19.1.0',
    message: 'React Server Actions endpoint'
  }, {
    headers: {
      'X-Powered-By': 'React Server Components',
    }
  });
}
