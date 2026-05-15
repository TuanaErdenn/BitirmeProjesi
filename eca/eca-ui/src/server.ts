import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'node:path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Types
interface UserSession {
  sessionId: string;
  accessToken?: string;
  refreshToken?: string;
  userInfo?: any;
  expiresAt?: number;
  state?: string;
  codeVerifier?: string;
}

interface KeycloakConfig {
  issuer: string;
  internalIssuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

// Keycloak Configuration
// issuer: browser-facing URL (tarayıcı bu URL'e yönlendirilir)
// internalIssuer: server-side URL (container arası iletişim - token exchange, userinfo, logout)
const keycloakConfig: KeycloakConfig = {
  issuer: process.env['KEYCLOAK_ISSUER'] || 'http://localhost:8080/realms/eca',
  internalIssuer: process.env['KEYCLOAK_INTERNAL_ISSUER'] || process.env['KEYCLOAK_ISSUER'] || 'http://localhost:8080/realms/eca',
  clientId: process.env['KEYCLOAK_CLIENT_ID'] || 'eca-bff',
  clientSecret: process.env['KEYCLOAK_CLIENT_SECRET'] || 'ctvkTeWJ6N65dcb71aZfqlddRUYwva6t',
  redirectUri: process.env['KEYCLOAK_REDIRECT_URI'] || 'http://localhost:4000/oauth/callback'
};

// In-memory session store
const sessionStore = new Map<string, UserSession>();

// Helper functions
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier: string): string {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
}

function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env['SESSION_SECRET'] || 'your-super-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true, // Changed to true to ensure session is created
  cookie: {
    secure: process.env['NODE_ENV'] === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'eca.session' // Add a custom session name
}));

// BFF API Routes

// Get user info
app.get('/api/user', (req, res) => {
  const sessionId = req.session?.id;
  if (!sessionId) {
    return res.json({ authenticated: false });
  }

  const userSession = sessionStore.get(sessionId);

  if (!userSession || !userSession.accessToken) {
    return res.json({ authenticated: false });
  }

  // Check if token is expired
  if (userSession.expiresAt && Date.now() > userSession.expiresAt) {
    sessionStore.delete(sessionId);
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: userSession.userInfo
  });
});

// Login endpoint
app.get('/api/login', (req, res) => {
  const sessionId = req.session?.id;

  if (!sessionId) {
    return res.status(500).json({ error: 'Session not available' });
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store PKCE parameters in session
  sessionStore.set(sessionId, {
    sessionId,
    state,
    codeVerifier
  });

  const authUrl = new URL(`${keycloakConfig.issuer}/protocol/openid-connect/auth`);
  authUrl.searchParams.set('client_id', keycloakConfig.clientId);
  authUrl.searchParams.set('redirect_uri', keycloakConfig.redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  return res.json({ authUrl: authUrl.toString() });
});

// OAuth callback
app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;
  const sessionId = req.session?.id;

  if (!sessionId) {
    return res.redirect('/?error=session_not_available');
  }

  const userSession = sessionStore.get(sessionId);

  if (!userSession || !state || userSession.state !== state) {
    return res.redirect('/?error=invalid_state');
  }

  if (!code) {
    return res.redirect('/?error=authorization_failed');
  }

  try {
    // Exchange authorization code for tokens (server-side, use internal URL)
    const tokenUrl = `${keycloakConfig.internalIssuer}/protocol/openid-connect/token`;
    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: keycloakConfig.clientId,
      client_secret: keycloakConfig.clientSecret,
      code: code as string,
      redirect_uri: keycloakConfig.redirectUri,
      code_verifier: userSession.codeVerifier!
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Get user info (server-side, use internal URL)
    const userInfoResponse = await axios.get(`${keycloakConfig.internalIssuer}/protocol/openid-connect/userinfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    // Update session
    sessionStore.set(sessionId, {
      sessionId,
      accessToken: access_token,
      refreshToken: refresh_token,
      userInfo: userInfoResponse.data,
      expiresAt: Date.now() + (expires_in * 1000)
    });

    res.redirect('/?login=success');
  } catch (error: any) {
    console.error('Token exchange error:', error?.response?.data || error?.message || error);
    console.error('Token exchange URL:', `${keycloakConfig.internalIssuer}/protocol/openid-connect/token`);
    res.redirect('/?error=token_exchange_failed');
  }
});

// Logout endpoint
app.post('/api/logout', async (req, res) => {
  const sessionId = req.session?.id;
  if (!sessionId) {
    return res.json({ success: true });
  }

  const userSession = sessionStore.get(sessionId);

  if (userSession && userSession.refreshToken) {
    try {
      // Revoke tokens at Keycloak (server-side, use internal URL)
      await axios.post(`${keycloakConfig.internalIssuer}/protocol/openid-connect/logout`, new URLSearchParams({
        client_id: keycloakConfig.clientId,
        client_secret: keycloakConfig.clientSecret,
        refresh_token: userSession.refreshToken
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Clear session
  sessionStore.delete(sessionId);
  req.session?.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
  });

  return res.json({ success: true });
});

// Get Keycloak account URL
app.get('/api/account-url', (req, res) => {
  const sessionId = req.session?.id;
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userSession = sessionStore.get(sessionId);

  if (!userSession || !userSession.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if token is expired
  if (userSession.expiresAt && Date.now() > userSession.expiresAt) {
    sessionStore.delete(sessionId);
    return res.status(401).json({ error: 'Token expired' });
  }

  // Generate Keycloak account URL with access token
  const accountUrl = `${keycloakConfig.issuer}/account?access_token=${userSession.accessToken}&referrer=eca-bff&referrer_uri=${encodeURIComponent('http://localhost:4000')}`;

  return res.json({
    accountUrl
  });
});

// Protected API example
app.get('/api/protected', (req, res) => {
  const sessionId = req.session?.id;
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userSession = sessionStore.get(sessionId);

  if (!userSession || !userSession.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check if token is expired
  if (userSession.expiresAt && Date.now() > userSession.expiresAt) {
    sessionStore.delete(sessionId);
    return res.status(401).json({ error: 'Token expired' });
  }

  return res.json({
    message: 'This is a protected endpoint',
    user: userSession.userInfo
  });
});

// Backend API Configuration
const apiConfig = {
  productApi: process.env['PRODUCT_API_URL'] || 'http://localhost:5001',
  orderApi: process.env['ORDER_API_URL'] || 'http://localhost:5002'
};

// Helper function to get auth headers
function getAuthHeaders(sessionId: string | undefined): Record<string, string> {
  if (!sessionId) return {};
  const userSession = sessionStore.get(sessionId);
  if (!userSession?.accessToken) return {};
  return { Authorization: `Bearer ${userSession.accessToken}` };
}

// Product API Proxy
app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get(`${apiConfig.productApi}/api/v1/products`, {
      headers: getAuthHeaders(req.session?.id)
    });
    return res.json(response.data);
  } catch (error: any) {
    console.error('Product API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/by', async (req, res) => {
  try {
    const skuParams = req.query['sku'];
    const queryString = Array.isArray(skuParams)
      ? skuParams.map(s => `sku=${encodeURIComponent(s as string)}`).join('&')
      : `sku=${encodeURIComponent(skuParams as string)}`;

    const response = await axios.get(`${apiConfig.productApi}/api/v1/products/by?${queryString}`, {
      headers: getAuthHeaders(req.session?.id)
    });
    return res.json(response.data);
  } catch (error: any) {
    console.error('Product API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to fetch products by SKU' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`${apiConfig.productApi}/api/v1/products/${req.params.id}`, {
      headers: getAuthHeaders(req.session?.id)
    });
    return res.json(response.data);
  } catch (error: any) {
    console.error('Product API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to fetch product' });
  }
});

// Category API Proxy
app.get('/api/categories', async (req, res) => {
  try {
    const response = await axios.get(`${apiConfig.productApi}/api/v1/categories`, {
      headers: getAuthHeaders(req.session?.id)
    });
    return res.json(response.data);
  } catch (error: any) {
    console.error('Category API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to fetch categories' });
  }
});

// Order API Proxy
app.get('/api/orders', async (req, res) => {
  const sessionId = req.session?.id;
  const userSession = sessionId ? sessionStore.get(sessionId) : null;

  if (!userSession?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.get(`${apiConfig.orderApi}/api/v1/orders`, {
      headers: { Authorization: `Bearer ${userSession.accessToken}` }
    });
    return res.json(response.data);
  } catch (error: any) {
    console.error('Order API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  const sessionId = req.session?.id;
  const userSession = sessionId ? sessionStore.get(sessionId) : null;

  if (!userSession?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.get(`${apiConfig.orderApi}/api/v1/orders/${req.params.id}`, {
      headers: { Authorization: `Bearer ${userSession.accessToken}` }
    });
    return res.json(response.data);
  } catch (error: any) {
    console.error('Order API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to fetch order' });
  }
});

app.post('/api/orders', async (req, res) => {
  const sessionId = req.session?.id;
  const userSession = sessionId ? sessionStore.get(sessionId) : null;

  if (!userSession?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.post(`${apiConfig.orderApi}/api/v1/orders`, req.body, {
      headers: {
        Authorization: `Bearer ${userSession.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return res.json(response.data);
  } catch (error: any) {
    console.error('Order API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to create order' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const sessionId = req.session?.id;
  const userSession = sessionId ? sessionStore.get(sessionId) : null;

  if (!userSession?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await axios.delete(`${apiConfig.orderApi}/api/v1/orders/${req.params.id}`, {
      headers: { Authorization: `Bearer ${userSession.accessToken}` }
    });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Order API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to delete order' });
  }
});

// Payment API Proxy
app.get('/api/v1/payments/:orderId', async (req, res) => {
  const sessionId = req.session?.id;
  const userSession = sessionId ? sessionStore.get(sessionId) : null;

  if (!userSession?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await axios.get(`${apiConfig.orderApi}/api/v1/payments/${req.params.orderId}`, {
      headers: { Authorization: `Bearer ${userSession.accessToken}` }
    });
    return res.status(204).send();
  } catch (error: any) {
    console.error('Payment API error:', error.message);
    return res.status(error.response?.status || 500).json({ error: 'Failed to process payment' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  // Cleanup expired sessions periodically
  setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of sessionStore.entries()) {
      if (session.expiresAt && now > session.expiresAt) {
        sessionStore.delete(sessionId);
      }
    }
  }, 5 * 60 * 1000); // Every 5 minutes

  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
    console.log(`Keycloak issuer: ${keycloakConfig.issuer}`);
    console.log(`Keycloak internal issuer: ${keycloakConfig.internalIssuer}`);
    console.log(`Keycloak client ID: ${keycloakConfig.clientId}`);
    console.log(`OAuth redirect URI: ${keycloakConfig.redirectUri}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
