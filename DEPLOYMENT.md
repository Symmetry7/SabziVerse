# SabziVerse Deployment Guide

## Quick Fix for "Page Not Found" Error

If you're getting 404/Not Found errors on your deployed site, follow these steps:

### 1. Build the Project

```bash
npm run build
```

### 2. Deployment Options

#### Option A: Netlify

1. Upload the `dist` folder to Netlify
2. The `netlify.toml` file will handle routing automatically
3. Or drag and drop the `dist` folder to netlify.com

#### Option B: Vercel

1. Upload the `dist` folder to Vercel
2. The `vercel.json` file will handle routing automatically
3. Or use Vercel CLI: `vercel --prod`

#### Option C: GitHub Pages

1. Upload the `dist` folder contents to your GitHub Pages repository
2. The `404.html` file will handle client-side routing
3. Make sure to include both `index.html` and `404.html`

#### Option D: Apache Server

1. Upload the `dist` folder to your web server
2. The `.htaccess` file will handle routing automatically
3. Make sure your server supports `.htaccess` files

#### Option E: Any Static Host

1. Upload the `dist` folder
2. Configure your server to serve `index.html` for all routes
3. Or use the `_redirects` file if supported (Netlify format)

### 3. Important Files for Deployment

- `dist/index.html` - Main app file with SPA routing script
- `dist/404.html` - GitHub Pages fallback
- `netlify.toml` - Netlify configuration
- `vercel.json` - Vercel configuration
- `public/_redirects` - Universal redirect file
- `public/.htaccess` - Apache server configuration

### 4. Troubleshooting

If you still get 404 errors:

1. **Check your hosting service documentation** for SPA support
2. **Ensure index.html is in the root** of your deployed folder
3. **Verify redirects are working** by testing routes like `/seller/dashboard`
4. **Clear browser cache** and try again
5. **Check browser console** for any JavaScript errors

### 5. Test Deployment Locally

```bash
npm run build
npm run preview
```

Then test routes like `http://localhost:8080/seller/dashboard` to ensure they work.

## Support

If you continue having issues, the problem is likely with your hosting service configuration. Contact your hosting provider for SPA (Single Page Application) support.
