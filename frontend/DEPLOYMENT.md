# Deployment Guide

## Prerequisites

- Vercel account
- GitHub repository
- Environment variables configured

## Environment Variables

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
\`\`\`

## Vercel Deployment

### Option 1: Git Integration

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Option 2: CLI Deployment

\`\`\`bash
npm install -g vercel
vercel login
vercel deploy
\`\`\`

## Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] Rate limiting configured
- [ ] Error monitoring enabled
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Disaster recovery plan

## Performance Optimization

- Enable image optimization
- Configure caching headers
- Use CDN for static assets
- Implement database connection pooling
- Monitor Core Web Vitals

## Monitoring

- Set up error tracking (Sentry)
- Configure performance monitoring
- Enable audit logging
- Set up alerts for critical issues

## Rollback Procedure

1. Identify issue in production
2. Revert to previous deployment
3. Investigate root cause
4. Deploy fix after testing
