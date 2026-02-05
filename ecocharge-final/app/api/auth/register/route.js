/**
 * Registration API Endpoint
 * Handles user registration with intentional vulnerabilities for CTF
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Simulated user database (in-memory for CTF)
const users = [];

// Weak MD5 hashing (intentionally vulnerable)
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Всі поля обов\'язкові'
      }, { status: 400 });
    }
    
    // Check if email already exists (information disclosure)
    const existingEmails = [
      'admin@ecocharge.local',
      'operator@ecocharge.local',
      'user@ecocharge.local'
    ];
    
    if (existingEmails.includes(email.toLowerCase())) {
      return NextResponse.json({
        success: false,
        error: 'Користувач з таким email вже існує',
        email: email // Information disclosure
      }, { status: 409 });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 100,
      name: name,
      email: email.toLowerCase(),
      phone: phone,
      passwordHash: hashPassword(password),
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    return NextResponse.json({
      success: true,
      message: 'Реєстрація успішна',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      // Debug info (information disclosure)
      _debug: process.env.DEBUG === 'true' ? {
        passwordHash: newUser.passwordHash,
        hashAlgorithm: 'md5'
      } : undefined
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
