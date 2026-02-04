#!/bin/bash
#
# EcoCharge CTF - Server Setup Script
# This script sets up the vulnerable web server environment
#
# Usage: sudo ./setup-server.sh
#

set -e

echo "=============================================="
echo "  EcoCharge CTF - Server Setup"
echo "=============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo ./setup-server.sh)"
    exit 1
fi

# Variables
APP_USER="www-data"
APP_DIR="/var/www/ecocharge"
MAINTENANCE_DIR="/opt/maintenance"
LOG_DIR="/var/log/ecocharge"
BACKUP_DIR="/var/backups/ecocharge"
NODE_VERSION="20"

echo ""
echo "[1/10] Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

echo ""
echo "[2/10] Installing dependencies..."
apt-get install -y -qq \
    curl \
    git \
    nginx \
    sqlite3 \
    build-essential \
    python3 \
    ufw

echo ""
echo "[3/10] Installing Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y -qq nodejs
fi
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

echo ""
echo "[4/10] Creating application directories..."
mkdir -p ${APP_DIR}
mkdir -p ${APP_DIR}/data
mkdir -p ${MAINTENANCE_DIR}
mkdir -p ${LOG_DIR}
mkdir -p ${BACKUP_DIR}

echo ""
echo "[5/10] Copying application files..."
# Assuming the app files are in current directory
cp -r ./* ${APP_DIR}/ 2>/dev/null || true
cp .env ${APP_DIR}/.env 2>/dev/null || true

# Copy backup script to maintenance directory
cp scripts/backup.js ${MAINTENANCE_DIR}/backup.js
chmod +x ${MAINTENANCE_DIR}/backup.js

echo ""
echo "[6/10] Installing npm packages..."
cd ${APP_DIR}
npm install --production

echo ""
echo "[7/10] Setting up permissions..."
chown -R ${APP_USER}:${APP_USER} ${APP_DIR}
chown -R ${APP_USER}:${APP_USER} ${LOG_DIR}
chown -R root:root ${MAINTENANCE_DIR}
chown -R root:root ${BACKUP_DIR}
chmod 755 ${MAINTENANCE_DIR}
chmod 755 ${BACKUP_DIR}

echo ""
echo "[8/10] Configuring sudo for privilege escalation vulnerability..."
cat > /etc/sudoers.d/ecocharge << 'EOF'
# EcoCharge maintenance script
# VULNERABLE: www-data can run backup.js as root without password
www-data ALL=(ALL) NOPASSWD: /usr/bin/node /opt/maintenance/backup.js
EOF
chmod 440 /etc/sudoers.d/ecocharge

echo ""
echo "[9/10] Creating CTF flags..."

# Flag 1 - Initial access (www-data readable)
echo "FLAG{r34ct_s3rv3r_c0mp0n3nts_d3s3r14l1z4t10n}" > ${APP_DIR}/.flag1.txt
chown ${APP_USER}:${APP_USER} ${APP_DIR}/.flag1.txt
chmod 644 ${APP_DIR}/.flag1.txt

# Flag 2 - Root access (root only)
echo "FLAG{pr1v3sc_v14_n0d3_c0mm4nd_1nj3ct10n}" > /root/.flag2.txt
chmod 600 /root/.flag2.txt

echo ""
echo "[10/10] Configuring nginx..."
cat > /etc/nginx/sites-available/ecocharge << 'EOF'
server {
    listen 80;
    listen 443 ssl;
    server_name ecocharge.local;

    # Self-signed certificate for CTF
    ssl_certificate /etc/nginx/ssl/ecocharge.crt;
    ssl_certificate_key /etc/nginx/ssl/ecocharge.key;

    # Information disclosure headers (intentional for CTF)
    add_header X-Powered-By "Next.js 15.0.3 / React 19.1.0";
    add_header X-Framework-Version "react-server-dom-webpack@19.1.0";
    add_header Server "EcoCharge Portal v1.0";

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Verbose error pages (information disclosure)
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
        internal;
    }
}
EOF

# Create SSL directory and generate self-signed cert
mkdir -p /etc/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/ecocharge.key \
    -out /etc/nginx/ssl/ecocharge.crt \
    -subj "/C=UA/ST=Kyiv/L=Kyiv/O=EcoCharge/CN=ecocharge.local" 2>/dev/null

# Enable site
ln -sf /etc/nginx/sites-available/ecocharge /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl reload nginx

echo ""
echo "[+] Creating systemd service..."
cat > /etc/systemd/system/ecocharge.service << 'EOF'
[Unit]
Description=EcoCharge Web Portal
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ecocharge
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ecocharge
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ecocharge
systemctl start ecocharge

echo ""
echo "=============================================="
echo "  Setup Complete!"
echo "=============================================="
echo ""
echo "Application URL: https://ecocharge.local"
echo "Application Dir: ${APP_DIR}"
echo "Logs: ${LOG_DIR}"
echo ""
echo "CTF Flags:"
echo "  - Flag 1: ${APP_DIR}/.flag1.txt (www-data)"
echo "  - Flag 2: /root/.flag2.txt (root)"
echo ""
echo "Vulnerabilities configured:"
echo "  1. CVE-2025-55182 (React Server Components RCE)"
echo "  2. Command injection in backup.js (PrivEsc)"
echo "  3. Weak authentication (MD5, no signature)"
echo "  4. Information disclosure in headers/errors"
echo ""
echo "To check status: systemctl status ecocharge"
echo "To view logs: journalctl -u ecocharge -f"
echo ""
