/**
 * User API Endpoint
 * Contains IDOR vulnerability - can access other users' data
 */

import { NextResponse } from 'next/server';

// Simulated user data
const users = [
  {
    id: 1,
    email: 'admin@ecocharge.local',
    name: 'System Administrator',
    role: 'admin',
    phone: '+380501234567',
    balance: 10000.00,
    rfidCards: ['RFID-ADMIN-001', 'RFID-ADMIN-002'],
    transactions: [
      { id: 101, date: '2025-01-15', station: 'EV-CH-001', amount: 150.00, kwh: 17.6 },
      { id: 102, date: '2025-01-20', station: 'EV-CH-003', amount: 200.00, kwh: 22.2 },
    ],
    // Sensitive internal notes
    _internal: {
      apiKey: 'admin_key_super_secret_123',
      accessLevel: 'full',
      notes: 'Has access to CSMS at 192.168.20.20'
    }
  },
  {
    id: 2,
    email: 'operator@ecocharge.local',
    name: 'Station Operator',
    role: 'operator',
    phone: '+380502345678',
    balance: 5000.00,
    rfidCards: ['RFID-OP-001'],
    transactions: [
      { id: 201, date: '2025-01-18', station: 'EV-CH-002', amount: 100.00, kwh: 14.3 },
    ],
    _internal: {
      apiKey: 'operator_key_456',
      accessLevel: 'stations',
      notes: 'Grafana access: admin:admin'
    }
  },
  {
    id: 3,
    email: 'user@ecocharge.local',
    name: 'Test User',
    role: 'user',
    phone: '+380503456789',
    balance: 500.00,
    rfidCards: ['RFID-USER-001'],
    transactions: [
      { id: 301, date: '2025-01-25', station: 'EV-CH-001', amount: 85.00, kwh: 10.0 },
      { id: 302, date: '2025-01-28', station: 'EV-CH-005', amount: 120.00, kwh: 12.0 },
    ],
    _internal: {
      apiKey: 'user_key_789',
      accessLevel: 'basic',
      notes: 'Regular user account'
    }
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // IDOR VULNERABILITY: No authorization check!
  // Any user can access any other user's data by changing the user_id parameter
  const userId = searchParams.get('user_id');
  
  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'user_id parameter is required',
      hint: 'Try /api/user?user_id=1'
    }, { status: 400 });
  }
  
  const user = users.find(u => u.id === parseInt(userId));
  
  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'User not found',
      requestedId: userId,
      availableIds: users.map(u => u.id) // Information disclosure
    }, { status: 404 });
  }
  
  // Return full user data including sensitive info (vulnerability)
  return NextResponse.json({
    success: true,
    data: user,
    _debug: process.env.DEBUG === 'true' ? {
      warning: 'Debug mode enabled - showing internal data',
      internalNotes: user._internal
    } : undefined
  });
}

// Get user transactions (also vulnerable to IDOR)
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, include_internal } = body;
    
    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'user_id is required'
      }, { status: 400 });
    }
    
    const user = users.find(u => u.id === parseInt(user_id));
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    const response = {
      success: true,
      userId: user.id,
      email: user.email,
      transactions: user.transactions,
      totalSpent: user.transactions.reduce((sum, t) => sum + t.amount, 0),
      totalKwh: user.transactions.reduce((sum, t) => sum + t.kwh, 0)
    };
    
    // If include_internal is true, also return sensitive data
    // No authorization check! (vulnerability)
    if (include_internal) {
      response._internal = user._internal;
      response.rfidCards = user.rfidCards;
      response.balance = user.balance;
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
