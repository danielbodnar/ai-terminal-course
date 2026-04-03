import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import ora from 'ora';
import { githubConfig } from './config.js';

const AUTH_DIR = path.join(os.homedir(), '.ai-terminal-course');
const AUTH_FILE = path.join(AUTH_DIR, 'auth.json');

// Ensure auth directory exists
async function ensureAuthDir() {
  try {
    await fs.access(AUTH_DIR);
  } catch {
    await fs.mkdir(AUTH_DIR, { recursive: true });
  }
}

// Load saved authentication
export async function loadAuth() {
  try {
    const data = await fs.readFile(AUTH_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Save authentication
async function saveAuth(authData) {
  await ensureAuthDir();
  await fs.writeFile(AUTH_FILE, JSON.stringify(authData, null, 2));

  // Set file permissions to 600 (owner read/write only)
  await fs.chmod(AUTH_FILE, 0o600);
}

// Clear authentication
export async function clearAuth() {
  try {
    await fs.unlink(AUTH_FILE);
  } catch {
    // File doesn't exist, that's fine
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const auth = await loadAuth();
  return auth !== null && auth.access_token;
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Request device code from GitHub
async function requestDeviceCode() {
  const response = await fetch(githubConfig.deviceCodeUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: githubConfig.clientId,
      scope: githubConfig.scopes
    })
  });

  if (!response.ok) {
    throw new Error('Failed to request device code from GitHub');
  }

  return await response.json();
}

// Poll for access token
async function pollForAccessToken(deviceCode, interval, expiresIn) {
  const maxAttempts = Math.floor(expiresIn / interval);

  for (let i = 0; i < maxAttempts; i++) {
    await sleep(interval * 1000);

    const response = await fetch(githubConfig.accessTokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: githubConfig.clientId,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
      })
    });

    const data = await response.json();

    if (data.access_token) {
      return data.access_token;
    }

    if (data.error === 'expired_token') {
      throw new Error('Authorization expired. Please try again.');
    }

    if (data.error === 'access_denied') {
      throw new Error('Authorization was denied.');
    }

    // If authorization_pending or slow_down, continue polling
  }

  throw new Error('Authorization timed out');
}

// Fetch GitHub user info
async function fetchGitHubUser(accessToken) {
  const response = await fetch(githubConfig.userApiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info from GitHub');
  }

  return await response.json();
}

// Main login function with GitHub Device Flow
export async function loginWithGitHub() {
  try {
    console.log('');
    console.log(chalk.bold('🔐 Login with GitHub'));
    console.log('');

    // Step 1: Request device code
    const deviceData = await requestDeviceCode();

    // Step 2: Show code to user
    console.log(chalk.yellow('Please complete the following steps:'));
    console.log('');
    console.log(`  1. Visit: ${chalk.cyan.bold(deviceData.verification_uri)}`);
    console.log(`  2. Enter code: ${chalk.green.bold(deviceData.user_code)}`);
    console.log('');

    // Step 3: Start polling
    const spinner = ora('Waiting for authorization...').start();

    const accessToken = await pollForAccessToken(
      deviceData.device_code,
      deviceData.interval || 5,
      deviceData.expires_in
    );

    // Step 4: Fetch user info
    const user = await fetchGitHubUser(accessToken);

    spinner.succeed(chalk.green('Authorized!'));

    // Step 5: Save auth data
    const authData = {
      access_token: accessToken,
      github_id: user.id.toString(),
      username: user.login,
      email: user.email,
      avatar_url: user.avatar_url,
      created_at: new Date().toISOString()
    };

    await saveAuth(authData);

    console.log('');
    console.log(chalk.green(`✓ Logged in as ${chalk.bold(user.login)}`));
    console.log('');

    return authData;

  } catch (error) {
    console.log('');
    console.log(chalk.red(`✗ Login failed: ${error.message}`));
    console.log(chalk.gray('  You can continue without tracking, or try again later'));
    console.log('');
    return null;
  }
}

// Get current user info
export async function getCurrentUser() {
  const auth = await loadAuth();
  if (!auth) return null;

  return {
    github_id: auth.github_id,
    username: auth.username,
    email: auth.email,
    avatar_url: auth.avatar_url
  };
}
