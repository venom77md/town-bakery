#!/usr/bin/env node
/**
 * Local SQLite Database Setup Script
 * 
 * This script initializes a local SQLite database using schema.sql and seed.sql
 * Usage: node scripts/setup-local-db.js [database_path]
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Default database path
const defaultDbPath = join(projectRoot, 'prisma', 'dev.db');
const dbPath = process.argv[2] || defaultDbPath;
const dbDir = dirname(dbPath);

// SQL files
const schemaFile = join(projectRoot, 'schema.sql');
const seedFile = join(projectRoot, 'seed.sql');

console.log('🗄️  Setting up local SQLite database...\n');

// Check if SQLite3 is available
try {
  execSync('sqlite3 --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Error: sqlite3 command not found.');
  console.error('   Please install SQLite3:');
  console.error('   - Windows: Download from https://www.sqlite.org/download.html');
  console.error('   - macOS: brew install sqlite3');
  console.error('   - Linux: sudo apt-get install sqlite3');
  process.exit(1);
}

// Create database directory if it doesn't exist
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
  console.log(`✅ Created database directory: ${dbDir}`);
}

// Check if database already exists
if (existsSync(dbPath)) {
  console.log(`⚠️  Database already exists at: ${dbPath}`);
  console.log('   Delete it first if you want a fresh setup.\n');
}

// Check if schema.sql exists
if (!existsSync(schemaFile)) {
  console.error(`❌ Error: schema.sql not found at ${schemaFile}`);
  process.exit(1);
}

// Check if seed.sql exists
if (!existsSync(seedFile)) {
  console.error(`❌ Error: seed.sql not found at ${seedFile}`);
  process.exit(1);
}

try {
  // Create schema
  console.log('📋 Creating database schema...');
  execSync(`sqlite3 "${dbPath}" < "${schemaFile}"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✅ Schema created successfully\n');

  // Seed data
  console.log('🌱 Seeding database with sample data...');
  execSync(`sqlite3 "${dbPath}" < "${seedFile}"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✅ Database seeded successfully\n');

  console.log(`✨ Database setup complete!`);
  console.log(`   Database location: ${dbPath}`);
  console.log(`\n   You can verify with: sqlite3 "${dbPath}" "SELECT COUNT(*) FROM Product;"`);
  console.log(`   Or use Prisma Studio: npx prisma studio`);
} catch (error) {
  console.error('❌ Error setting up database:', error.message);
  process.exit(1);
}

