import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Store state in user's home directory when installed as npm package
// Fall back to local directory for development
const isNpmPackage = !process.cwd().includes('ai-engineering-bootcamp');
const STATE_DIR = isNpmPackage
  ? path.join(os.homedir(), '.ai-terminal-course')
  : path.join(process.cwd(), '.state');
const STATE_FILE = path.join(STATE_DIR, 'progress.json');

async function ensureStateDir() {
  try {
    await fs.access(STATE_DIR);
  } catch {
    await fs.mkdir(STATE_DIR, { recursive: true });
  }
}

export async function loadState() {
  await ensureStateDir();

  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Return default state
    return {
      currentModule: 0,
      completedModules: [],
      startedAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      totalTime: 0,
      totalCost: 0,
      streak: 0,
      stats: {}
    };
  }
}

export async function saveState(state) {
  await ensureStateDir();

  state.lastAccess = new Date().toISOString();

  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

export async function completeModule(moduleNumber, stats = {}) {
  const state = await loadState();

  if (!state.completedModules.includes(moduleNumber)) {
    state.completedModules.push(moduleNumber);
  }

  state.currentModule = Math.max(state.currentModule, moduleNumber + 1);

  // Update stats
  if (stats.cost) {
    state.totalCost += stats.cost;
  }
  if (stats.time) {
    state.totalTime += stats.time;
  }

  // Update streak
  const lastAccess = new Date(state.lastAccess);
  const now = new Date();
  const daysDiff = Math.floor((now - lastAccess) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, keep streak
  } else if (daysDiff === 1) {
    // Next day, increment streak
    state.streak += 1;
  } else {
    // Broken streak
    state.streak = 1;
  }

  await saveState(state);

  return state;
}

// Track when a module is started (local only)
export async function startModule(moduleNumber) {
  // No-op for now — progress is tracked on completion
}

export async function getProgress() {
  const state = await loadState();
  const totalModules = 14;

  return {
    current: state.currentModule,
    total: totalModules,
    percentage: Math.floor((state.completedModules.length / totalModules) * 100),
    completed: state.completedModules,
    streak: state.streak,
    totalTime: state.totalTime,
    totalCost: state.totalCost
  };
}

export async function resetProgress() {
  await ensureStateDir();

  const freshState = {
    currentModule: 0,
    completedModules: [],
    startedAt: new Date().toISOString(),
    lastAccess: new Date().toISOString(),
    totalTime: 0,
    totalCost: 0,
    streak: 0,
    stats: {}
  };

  await saveState(freshState);
  return freshState;
}
