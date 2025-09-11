# Mobile App Debugging Guide

## Common Issues

### API Connection Errors in Mobile App

**Symptom**: Mobile app shows `SyntaxError: Unexpected token '<', "<!DOCTYPE"... is not valid JSON`

**Cause**: The mobile app is trying to make API calls to a relative URL (like `/api/chat`) which doesn't exist on the mobile device. Instead, it receives an HTML error page.

**Solution**: Update the `PRODUCTION_API_URL` in `app/config/api.ts` with your actual Vercel deployment URL.

```typescript
// In app/config/api.ts
const PRODUCTION_API_URL = 'https://your-actual-vercel-url.vercel.app';
```

**Steps to fix**:
1. Ensure your Vercel deployment URL is correct in `app/config/api.ts`
2. **IMPORTANT**: Rebuild the mobile app: `npm run build:mobile`
3. Open Android Studio: `npm run android`
4. Run the app and check console logs
5. Look for debug messages starting with "getApiUrl Debug"

### Development vs Production URLs

- **Web version**: Uses relative URLs (`/api/chat`) - works fine
- **Mobile version**: Must use absolute URLs to your deployed API
- **Local development**: Can use your computer's IP address for testing

### Testing API Connectivity

To test if your API URL is correct:
1. Open your Vercel URL + `/api/chat` in a browser
2. You should see an error about POST method required (not HTML)
3. If you see HTML, the URL is wrong

### Local Development Setup

For local development, uncomment and update the DEV_SERVER_URL:
```typescript
const DEV_SERVER_URL = 'http://YOUR_COMPUTER_IP:3000';
return `${DEV_SERVER_URL}${endpoint}`;
```

Find your IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
