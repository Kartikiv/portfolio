#!/usr/bin/env node
/**
 * update-resume.js — Selectively update portfolio sections via the API.
 *
 * Only the sections present in the input JSON are updated; everything else
 * in the database is left untouched.
 *
 * Usage:
 *   node scripts/update-resume.js [file]           # default: resume-update.json
 *   node scripts/update-resume.js experience.json
 *
 * The input file must be a JSON object whose keys are section names:
 *   { "experience": { ... }, "skills": { ... } }
 *
 * Credentials are read from the root .env file (ADMIN_USERNAME, ADMIN_PASSWORD).
 * API base URL defaults to http://localhost:3001 or set API_URL in .env.
 */

const fs   = require('fs');
const http = require('http');
const path = require('path');

// ── Load .env from project root ──────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── Config ───────────────────────────────────────────────────────────────────
const API_BASE  = (process.env.API_URL || 'http://localhost:3001').replace(/\/$/, '');
const USERNAME  = process.env.ADMIN_USERNAME;
const PASSWORD  = process.env.ADMIN_PASSWORD;
const inputFile = path.resolve(process.argv[2] || 'resume-update.json');

// ── Helpers ──────────────────────────────────────────────────────────────────
function request(method, url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed   = new URL(url);
    const payload  = body ? JSON.stringify(body) : null;
    const opts = {
      hostname : parsed.hostname,
      port     : parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path     : parsed.pathname + parsed.search,
      method,
      headers  : {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...headers,
      },
    };

    const mod = parsed.protocol === 'https:' ? require('https') : http;
    const req = mod.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function green(s)  { return `\x1b[32m${s}\x1b[0m`; }
function red(s)    { return `\x1b[31m${s}\x1b[0m`; }
function yellow(s) { return `\x1b[33m${s}\x1b[0m`; }
function bold(s)   { return `\x1b[1m${s}\x1b[0m`; }

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Validate credentials in env
  if (!USERNAME || !PASSWORD) {
    console.error(red('✗ ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env'));
    process.exit(1);
  }

  // Read and parse the update file
  if (!fs.existsSync(inputFile)) {
    console.error(red(`✗ File not found: ${inputFile}`));
    console.error(yellow('  Create resume-update.json or pass a file path as an argument.'));
    process.exit(1);
  }

  let updates;
  try {
    updates = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  } catch (err) {
    console.error(red(`✗ Failed to parse JSON: ${err.message}`));
    process.exit(1);
  }

  const sections = Object.keys(updates);
  if (sections.length === 0) {
    console.error(yellow('⚠  No sections found in the input file. Nothing to update.'));
    process.exit(0);
  }

  console.log(bold(`\nResume updater — ${inputFile}`));
  console.log(`API  : ${API_BASE}`);
  console.log(`Sections to update: ${sections.join(', ')}\n`);

  // Login
  process.stdout.write('Logging in ... ');
  const loginRes = await request('POST', `${API_BASE}/api/auth/login`, { username: USERNAME, password: PASSWORD });
  if (loginRes.status !== 200 || !loginRes.body.token) {
    console.log(red('FAILED'));
    console.error(red(`✗ Login failed (${loginRes.status}): ${JSON.stringify(loginRes.body)}`));
    process.exit(1);
  }
  const token = loginRes.body.token;
  console.log(green('OK'));

  // Update each section
  let passed = 0;
  let failed = 0;
  for (const section of sections) {
    process.stdout.write(`  PUT /api/content/${section} ... `);
    const res = await request(
      'PUT',
      `${API_BASE}/api/content/${section}`,
      updates[section],
      { Authorization: `Bearer ${token}` }
    );
    if (res.status === 200) {
      console.log(green('✓ updated'));
      passed++;
    } else {
      console.log(red(`✗ failed (${res.status})`));
      console.error(red(`    ${JSON.stringify(res.body)}`));
      failed++;
    }
  }

  console.log('');
  if (failed === 0) {
    console.log(green(`✓ All ${passed} section(s) updated successfully.`));
  } else {
    console.log(yellow(`  ${passed} updated, ${red(`${failed} failed`)}.`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(red(`\n✗ Unexpected error: ${err.message}`));
  process.exit(1);
});
