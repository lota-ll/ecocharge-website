/**
 * Stations API Endpoint
 * Returns list of charging stations with their status
 */

import { NextResponse } from 'next/server';

// Simulated station data (in production, this comes from API Gateway)
const stations = [
  {
    id: 'EV-CH-001',
    name: 'ТРЦ "Глобус" - Станція 1',
    address: 'вул. Хрещатик, 15',
    city: 'Київ',
    coordinates: { lat: 50.4501, lng: 30.5234 },
    status: 'available',
    connectors: [
      { id: 1, type: 'CCS2', power: 150, status: 'available' },
      { id: 2, type: 'CHAdeMO', power: 50, status: 'available' }
    ],
    pricePerKwh: 8.50,
    lastHeartbeat: new Date().toISOString()
  },
  {
    id: 'EV-CH-002',
    name: 'Паркінг "Центральний"',
    address: 'вул. Велика Васильківська, 100',
    city: 'Київ',
    coordinates: { lat: 50.4380, lng: 30.5170 },
    status: 'occupied',
    connectors: [
      { id: 1, type: 'Type2', power: 22, status: 'charging' },
      { id: 2, type: 'Type2', power: 22, status: 'available' }
    ],
    pricePerKwh: 7.00,
    lastHeartbeat: new Date().toISOString()
  },
  {
    id: 'EV-CH-003',
    name: 'АЗС "ЕКО" - Бориспіль',
    address: 'Бориспільське шосе, км 25',
    city: 'Бориспіль',
    coordinates: { lat: 50.3510, lng: 30.9512 },
    status: 'available',
    connectors: [
      { id: 1, type: 'CCS2', power: 150, status: 'available' },
      { id: 2, type: 'CCS2', power: 150, status: 'available' }
    ],
    pricePerKwh: 9.00,
    lastHeartbeat: new Date().toISOString()
  },
  {
    id: 'EV-CH-004',
    name: 'ТРЦ "Лавина" - Станція А',
    address: 'просп. Берестейський, 87',
    city: 'Київ',
    coordinates: { lat: 50.4642, lng: 30.4358 },
    status: 'maintenance',
    connectors: [
      { id: 1, type: 'CCS2', power: 100, status: 'offline' },
      { id: 2, type: 'Type2', power: 22, status: 'offline' }
    ],
    pricePerKwh: 8.00,
    lastHeartbeat: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'EV-CH-005',
    name: 'Готель "Hilton" - VIP Паркінг',
    address: 'вул. Шевченка, 30',
    city: 'Київ',
    coordinates: { lat: 50.4432, lng: 30.5110 },
    status: 'available',
    connectors: [
      { id: 1, type: 'Type2', power: 22, status: 'available' },
      { id: 2, type: 'Type2', power: 22, status: 'available' },
      { id: 3, type: 'CCS2', power: 50, status: 'available' }
    ],
    pricePerKwh: 10.00,
    lastHeartbeat: new Date().toISOString()
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const city = searchParams.get('city');
  
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
  
  // Add some API response metadata
  const response = {
    success: true,
    count: filteredStations.length,
    timestamp: new Date().toISOString(),
    data: filteredStations,
    // Information disclosure - internal API details
    _meta: {
      source: 'api-gateway',
      gateway_url: process.env.API_GATEWAY_URL || 'http://192.168.100.20:8080',
      cache_ttl: 30
    }
  };
  
  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=30',
      'X-Total-Count': String(filteredStations.length),
    }
  });
}

// Get single station by ID
export async function POST(request) {
  try {
    const body = await request.json();
    const { stationId } = body;
    
    if (!stationId) {
      return NextResponse.json({
        success: false,
        error: 'Station ID is required'
      }, { status: 400 });
    }
    
    const station = stations.find(s => s.id === stationId);
    
    if (!station) {
      return NextResponse.json({
        success: false,
        error: 'Station not found',
        requestedId: stationId
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: station
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
