import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
let rootDir = path.dirname(__filename);

// THE CLIMBER: Search for the root directory containing config.json
while (rootDir !== path.parse(rootDir).root) {
    if (fs.existsSync(path.join(rootDir, 'config.json'))) break;
    rootDir = path.dirname(rootDir);
}

// 1. Load configuration for directory names
const configPath = path.join(rootDir, 'config.json');
const CONFIG = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// 2. Define and ensure the log directory exists
const LOG_DIR = path.join(rootDir, CONFIG.errorlogs);

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Logs an error to a file named by the current date (YYYY-MM-DD.log).
 */
export const logError = (error, context = "GENERAL") => {
    const now = new Date();
    const timestamp = now.toISOString();
    const dateString = timestamp.split('T')[0]; // Extract YYYY-MM-DD
    
    const logFileName = `${dateString}.log`;
    const logPath = path.join(LOG_DIR, logFileName);

    const message = `[${timestamp}] [${context}] ${error.stack || error}\n`;
    
    // Append to the date-specific log file
    fs.appendFileSync(logPath, message, 'utf8');
};

/**
 * Fetches the most recent logs from the latest available log file.
 */
export const getLogs = (limit = 20) => {
    if (!fs.existsSync(LOG_DIR)) return ["No log directory found."];

    // Get all files, sort by date descending (newest first)
    const files = fs.readdirSync(LOG_DIR).sort().reverse();
    
    if (files.length === 0) return ["No log files found."];

    const latestLogPath = path.join(LOG_DIR, files[0]);
    const logs = fs.readFileSync(latestLogPath, 'utf8').split('\n').filter(Boolean);
    
    // Return the last entries from the latest file
    return logs.slice(-limit).reverse();
};