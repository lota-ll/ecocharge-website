#!/usr/bin/env node
/**
 * EcoCharge Backup Script
 * 
 * VULNERABILITY: Command injection via BACKUP_TARGET environment variable
 * This script is run with sudo by www-data user (see /etc/sudoers.d/ecocharge)
 * 
 * CVE: N/A (Custom vulnerability for CTF)
 * 
 * Exploitation:
 *   export BACKUP_TARGET="; /bin/bash -p"
 *   sudo /usr/bin/node /opt/maintenance/backup.js
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  backupDir: '/var/backups/ecocharge',
  logFile: '/var/log/ecocharge/backup.log',
  maxBackups: 7,
  compress: true
};

// Get backup target from environment variable (VULNERABLE!)
const target = process.env.BACKUP_TARGET || '/var/www/ecocharge';

// Generate timestamp for backup file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(CONFIG.backupDir, `backup-${timestamp}.tar.gz`);

// Log function
function log(message) {
  const logLine = `[${new Date().toISOString()}] ${message}\n`;
  console.log(logLine.trim());
  
  try {
    fs.appendFileSync(CONFIG.logFile, logLine);
  } catch (e) {
    // Ignore log errors
  }
}

// Ensure backup directory exists
function ensureBackupDir() {
  try {
    if (!fs.existsSync(CONFIG.backupDir)) {
      fs.mkdirSync(CONFIG.backupDir, { recursive: true });
      log(`Created backup directory: ${CONFIG.backupDir}`);
    }
  } catch (e) {
    log(`Error creating backup directory: ${e.message}`);
  }
}

// Clean old backups
function cleanOldBackups() {
  try {
    const files = fs.readdirSync(CONFIG.backupDir)
      .filter(f => f.startsWith('backup-') && f.endsWith('.tar.gz'))
      .sort()
      .reverse();
    
    if (files.length > CONFIG.maxBackups) {
      const toDelete = files.slice(CONFIG.maxBackups);
      toDelete.forEach(file => {
        const filePath = path.join(CONFIG.backupDir, file);
        fs.unlinkSync(filePath);
        log(`Deleted old backup: ${file}`);
      });
    }
  } catch (e) {
    log(`Error cleaning old backups: ${e.message}`);
  }
}

// Main backup function
function performBackup() {
  log('='.repeat(50));
  log('EcoCharge Backup Script Started');
  log(`Target: ${target}`);
  log(`Backup file: ${backupFile}`);
  
  ensureBackupDir();
  
  // VULNERABLE COMMAND - target is not sanitized!
  // The target variable is directly concatenated into the command
  // This allows command injection via BACKUP_TARGET env var
  const command = `tar -czf ${backupFile} ${target}`;
  
  log(`Executing: ${command}`);
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      log(`Backup FAILED: ${error.message}`);
      if (stderr) {
        log(`stderr: ${stderr}`);
      }
      process.exit(1);
    }
    
    if (stdout) {
      log(`stdout: ${stdout}`);
    }
    
    // Get backup file size
    try {
      const stats = fs.statSync(backupFile);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      log(`Backup completed successfully`);
      log(`Backup size: ${sizeMB} MB`);
    } catch (e) {
      log(`Backup completed (could not get file size)`);
    }
    
    // Clean old backups
    cleanOldBackups();
    
    log('Backup script finished');
    log('='.repeat(50));
  });
}

// Run backup
performBackup();
