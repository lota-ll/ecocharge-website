/**
 * Authentication API Endpoint
 * Handles login, with intentional vulnerabilities for CTF
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Simulated user database
const users = [
  {
    id: 1,
    email: 'admin@ecocharge.local',
    // Password: EcoCharge2024! (crackable with themed wordlist + rules)
    passwordHash: '89fa0a47d42523ccf0dd5f16c5995e57',
    role: 'admin',
    name: 'System Administrator'
  },
  {
    id: 2,
    email: 'operator@ecocharge.local',
    // Password: Operator123!
    passwordHash: '4a7d29465a3f19a76f1f1c72add4aa0f',
    role: 'operator',
    name: 'Station Operator'
  },
  {
    id: 3,
    email: 'user@ecocharge.local',
    // Password: 12345678 (weak for demo purposes)
    passwordHash: '25d55ad283aa400af464c76d713c07ad',
    role: 'user',
    name: 'Test User'
  }
];

// Weak MD5 hashing (intentionally vulnerable)
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// Generate simple JWT-like token (intentionally weak)
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 86400000 // 24 hours
  };
  
  // Base64 encode (no real signature - vulnerable!)
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  return token;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }
    
    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Information disclosure - reveals if user exists
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email: email
      }, { status: 401 });
    }
    
    // Check password
    const hash = hashPassword(password);
    
    if (hash !== user.passwordHash) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: token,
      // Debug info (information disclosure)
      _debug: process.env.DEBUG === 'true' ? {
        hash_algorithm: 'md5',
        token_type: 'base64_payload',
        internal_api: process.env.API_GATEWAY_URL
      } : undefined
    });
    
    // Set cookie (HttpOnly flag missing - vulnerable to XSS)
    response.cookies.set('auth_token', token, {
      maxAge: 86400,
      path: '/',
      // Missing: httpOnly: true, secure: true
    });
    
    return response;
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.DEBUG === 'true' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Get current user (verify token)
export async function GET(request) {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: 'No authentication token'
    }, { status: 401 });
  }
  
  try {
    // Decode token (no signature verification - vulnerable!)
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return NextResponse.json({
        success: false,
        error: 'Token expired'
      }, { status: 401 });
    }
    
    const user = users.find(u => u.id === payload.id);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid token'
    }, { status: 401 });
  }
}
