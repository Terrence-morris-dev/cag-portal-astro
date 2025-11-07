# Security Guidelines for CAG Portal

## Overview
This document outlines security best practices for the CAG (Cleared Advisory Group) Portal project.

## Sensitive Data - What NOT to Commit

### ❌ Never Commit:
- API keys, tokens, or secrets
- AWS credentials or configuration files
- Database passwords or connection strings
- Private keys (.key, .pem files)
- Environment variables with sensitive data
- Personal email addresses or phone numbers
- Internal documentation or business plans
- Customer data or PII (Personally Identifiable Information)
- Third-party API credentials

### ✅ Safe to Commit:
- Source code (frontend components)
- Public configuration (package.json, tsconfig.json)
- Documentation and README files
- Public assets (logos, images)
- Example/placeholder data
- Test files (without real credentials)

## Current Project Status

### 🎨 Frontend Only (No Backend)
This project is currently a **static frontend** with:
- No real authentication system
- No database connections
- No API endpoints
- Placeholder alerts for form submissions

### 🔐 Sanitized Elements
- Email: `contact@example.com` (placeholder)
- Phone: "Contact: Coming Soon" (placeholder)
- All sensitive business information removed

## Before Sharing This Project

1. **Review git history** for any accidentally committed secrets
2. **Check all files** for hardcoded credentials
3. **Verify .gitignore** is properly configured
4. **Test build** to ensure no secrets in dist/
5. **Review README** for any internal references

## AWS Integration (Future)

When adding backend functionality:

### Use Environment Variables
```bash
# .env.local (never commit this file)
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxx
COGNITO_CLIENT_ID=xxx
API_GATEWAY_URL=https://xxx.execute-api.us-east-1.amazonaws.com
```

### Use AWS Secrets Manager
```typescript
import { SecretsManager } from 'aws-sdk';

const secretsManager = new SecretsManager({ region: 'us-east-1' });
const secret = await secretsManager.getSecretValue({ SecretId: 'cag/api/key' }).promise();
```

### Use IAM Roles (Not Access Keys)
- Deploy using IAM roles with least-privilege permissions
- Never hardcode AWS access keys
- Use AWS SSO or temporary credentials

## CI/CD Security

### GitHub Actions
```yaml
# Use GitHub Secrets for sensitive values
env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  API_KEY: ${{ secrets.API_KEY }}
```

### Vercel Environment Variables
Add secrets through Vercel dashboard, not in code

## Reporting Security Issues

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Contact the maintainer directly
3. Provide detailed information about the vulnerability
4. Wait for confirmation before disclosing publicly

## Compliance

### Clearance Requirements
- This platform is for cleared professionals
- Users self-report clearance levels
- **CAG does NOT verify clearances**
- Employers are responsible for verification
- No sensitive documents should be stored

### Data Privacy
- Follow GDPR/CCPA guidelines when handling user data
- Implement proper data retention policies
- Ensure data encryption in transit and at rest
- Regular security audits recommended

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Security Best Practices](https://docs.aws.amazon.com/security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

Last Updated: November 7, 2025
