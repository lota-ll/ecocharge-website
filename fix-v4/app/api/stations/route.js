/**
 * Stations API Endpoint
 * Real stations (CP001, CP002) + simulated stations for realism
 * 
 * VULNERABILITY: Information disclosure - internal IPs and credentials exposed
 */

import { NextResponse } from 'next/server';

// Station data - REAL stations from CitrineOS + simulated ones
const stations = [
  // ============ REAL STATIONS (from CitrineOS) ============
  {
    id: 'CP001',
    name: 'Станція "Центральна"',
    address: 'вул. Хрещатик, 15',
    city: 'Київ',
    coordinates: { lat: 50.4501, lng: 30.5234 },
    status: 'available',  // Will show as online from CitrineOS
    connectors: [
      { id: 1, type: 'CCS2', power: 50, status: 'available' },
      { id: 2, type: 'CHAdeMO', power: 50, status: 'available' }
    ],
    pricePerKwh: 8.50,
    lastHeartbeat: new Date().toISOString(),
    // Internal info (information disclosure vulnerability)
    _internal: {
      ip: '172.16.0.40',
      ocppVersion: '1.6-J',
      ocppPort: 8092,
      wsEndpoint: 'ws://192.168.20.20:8092/CP001',
      firmware: '1.0',
      vendor: 'CyberRange',
      model: 'Everest Simulator',
      chargeBoxSerialNumber: 'CP001',
      csmsUrl: 'http://192.168.20.20:8080'
    }
  },
  {
    id: 'CP002',
    name: 'Станція "Паркінг ТРЦ"',
    address: 'просп. Берестейський, 87',
    city: 'Київ',
    coordinates: { lat: 50.4642, lng: 30.4358 },
    status: 'available',
    connectors: [
      { id: 1, type: 'CCS2', power: 150, status: 'available' },
      { id: 2, type: 'CCS2', power: 150, status: 'available' }
    ],
    pricePerKwh: 9.00,
    lastHeartbeat: new Date().toISOString(),
    _internal: {
      ip: '172.16.0.60',
      ocppVersion: '2.0.1',
      ocppPort: 8081,
      wsEndpoint: 'ws://192.168.20.20:8081/CP002',
      firmware: 'unknown',
      vendor: 'EVerest',
      model: 'OCPP 2.0.1 Simulator',
      securityProfile: 0,
      csmsUrl: 'http://192.168.20.20:8080'
    }
  },
  
  // ============ SIMULATED STATIONS (for realism) ============
  {
    id: 'CP003',
    name: 'АЗС "ОККО" - Бориспіль',
    address: 'Бориспільське шосе, км 25',
    city: 'Бориспіль',
    coordinates: { lat: 50.3510, lng: 30.9512 },
    status: 'occupied',
    connectors: [
      { id: 1, type: 'CCS2', power: 150, status: 'charging' },
      { id: 2, type: 'CCS2', power: 150, status: 'available' }
    ],
    pricePerKwh: 9.50,
    lastHeartbeat: new Date(Date.now() - 30000).toISOString(), // 30 sec ago
    currentSession: {
      startTime: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      energyDelivered: 25.5,
      userId: 4
    },
    _internal: {
      ip: '172.16.0.80',
      ocppVersion: '2.0.1',
      ocppPort: 8081,
      wsEndpoint: 'ws://192.168.20.20:8081/CP003',
      firmware: 'v2.5.0',
      vendor: 'ABB',
      model: 'Terra 184',
      csmsUrl: 'http://192.168.20.20:8080'
    }
  },
  {
    id: 'CP004',
    name: 'Готель "Hilton" - VIP Parking',
    address: 'вул. Шевченка, 30',
    city: 'Київ',
    coordinates: { lat: 50.4432, lng: 30.5110 },
    status: 'maintenance',
    connectors: [
      { id: 1, type: 'Type2', power: 22, status: 'unavailable' },
      { id: 2, type: 'Type2', power: 22, status: 'unavailable' }
    ],
    pricePerKwh: 10.00,
    lastHeartbeat: new Date(Date.now() - 86400000).toISOString(), // 1 day ago - offline
    _internal: {
      ip: '172.16.0.100',
      ocppVersion: '1.6-J',
      ocppPort: 8092,
      wsEndpoint: 'ws://192.168.20.20:8092/CP004',
      firmware: 'v1.8.2',
      vendor: 'Schneider Electric',
      model: 'EVlink City',
      lastError: 'Connection timeout - station offline',
      csmsUrl: 'http://192.168.20.20:8080'
    }
  },
  {
    id: 'CP005',
    name: 'Паркінг "Гулівер"',
    address: 'пл. Спортивна, 1А',
    city: 'Київ',
    coordinates: { lat: 50.4380, lng: 30.5170 },
    status: 'available',
    connectors: [
      { id: 1, type: 'Type2', power: 22, status: 'available' },
      { id: 2, type: 'Type2', power: 22, status: 'available' },
      { id: 3, type: 'CCS2', power: 50, status: 'available' }
    ],
    pricePerKwh: 7.50,
    lastHeartbeat: new Date().toISOString(),
    _internal: {
      ip: '172.16.0.120',
      ocppVersion: '1.6-J',
      ocppPort: 8092,
      wsEndpoint: 'ws://192.168.20.20:8092/CP005',
      firmware: 'v3.1.0',
      vendor: 'Tritium',
      model: 'PKM150',
      csmsUrl: 'http://192.168.20.20:8080'
    }
  }
];

// CSMS Configuration (information disclosure)
const csmsConfig = {
  host: '192.168.20.20',
  restApi: 'http://192.168.20.20:8080',
  graphqlApi: 'http://192.168.20.20:8090/v1/graphql',
  graphqlWs: 'ws://192.168.20.20:8090/v1/graphql',
  hasuraSecret: 'CitrineOS!',
  ocpp16Port: 8092,
  ocpp201Port: 8081,
  ocpp201TlsPort: 8443,
  database: {
    host: '192.168.20.20',
    port: 5432,
    name: 'citrine',
    user: 'citrine',
    // password intentionally exposed for CTF
    password: 'citrine'
  },
  minio: {
    endpoint: 'http://192.168.20.20:9000',
    console: 'http://192.168.20.20:9001',
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
  },
  rabbitmq: {
    host: '192.168.20.20',
    port: 5672,
    managementPort: 15672,
    user: 'guest',
    password: 'guest'
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const city = searchParams.get('city');
  const includeInternal = searchParams.get('internal') === 'true';
  const debug = searchParams.get('debug') === 'true';
  
  let filteredStations = [...stations];
  
  // Filter by status
  if (status) {
    filteredStations = filteredStations.filter(s => s.status === status);
  }
  
  // Filter by city
  if (city) {
    filteredStations = filteredStations.filter(s => 
      s.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  // Prepare response data
  const responseData = filteredStations.map(station => {
    const data = { ...station };
    // VULNERABILITY: Internal data exposed if ?internal=true
    if (!includeInternal) {
      delete data._internal;
      delete data.currentSession;
    }
    return data;
  });
  
  const response = {
    success: true,
    count: responseData.length,
    timestamp: new Date().toISOString(),
    data: responseData,
  };
  
  // VULNERABILITY: Debug mode exposes CSMS configuration
  if (debug || includeInternal) {
    response._debug = {
      csms: csmsConfig,
      apiVersion: '1.0.0',
      nodeEnv: process.env.NODE_ENV || 'development',
      serverTime: new Date().toISOString()
    };
  }
  
  // VULNERABILITY: Internal metadata always exposed
  response._meta = {
    source: 'ecocharge-api-gateway',
    cacheHit: false,
    backendLatency: Math.floor(Math.random() * 50) + 10,
    csmsEndpoint: csmsConfig.restApi
  };
  
  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=30',
      'X-Total-Count': String(responseData.length),
      'X-API-Version': '1.0.0',
      // VULNERABILITY: Server info in headers
      'X-Powered-By': 'CitrineOS/1.0',
      'X-Backend-Server': '192.168.20.20:8080'
    }
  });
}

// Get single station by ID
export async function POST(request) {
  try {
    const body = await request.json();
    const { stationId, includeInternal, action } = body;
    
    // VULNERABILITY: Action parameter allows enumeration
    if (action === 'list-all') {
      return NextResponse.json({
        success: true,
        stations: stations.map(s => ({
          id: s.id,
          name: s.name,
          status: s.status,
          protocol: s._internal?.ocppVersion
        })),
        csmsInfo: csmsConfig
      });
    }
    
    if (!stationId) {
      return NextResponse.json({
        success: false,
        error: 'Station ID is required',
        hint: 'Use action: "list-all" to get all station IDs'
      }, { status: 400 });
    }
    
    const station = stations.find(s => s.id === stationId);
    
    if (!station) {
      return NextResponse.json({
        success: false,
        error: 'Station not found',
        requestedId: stationId,
        // VULNERABILITY: Enumerate valid IDs
        availableIds: stations.map(s => s.id),
        hint: 'Valid station IDs are listed above'
      }, { status: 404 });
    }
    
    const data = { ...station };
    if (!includeInternal) {
      delete data._internal;
      delete data.currentSession;
    }
    
    return NextResponse.json({
      success: true,
      data: data,
      _meta: {
        csmsEndpoint: csmsConfig.restApi,
        graphqlEndpoint: csmsConfig.graphqlApi
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      // VULNERABILITY: Stack trace in error
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    }, { status: 500 });
  }
}
