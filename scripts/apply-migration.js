import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const migrationSQL = readFileSync(join(process.cwd(), 'prisma/migrations/20250104000000_init/migration.sql'), 'utf-8');

try {
  // Try to use sqlite3 if available
  const dbPath = join(process.cwd(), 'dev.db');
  console.log('Creating database at:', dbPath);
  
  // Write SQL to a temp file and execute
  const { writeFileSync, unlinkSync } = require('fs');
  const tempFile = join(process.cwd(), 'temp.sql');
  writeFileSync(tempFile, migrationSQL);
  
  try {
    execSync(`sqlite3 "${dbPath}" < "${tempFile}"`, { stdio: 'inherit' });
    console.log('✅ Migration applied successfully!');
  } catch (e) {
    console.log('sqlite3 not available, trying alternative method...');
    // Alternative: use better-sqlite3 if available
    try {
      const Database = require('better-sqlite3');
      const db = new Database(dbPath);
      const statements = migrationSQL.split(';').filter(s => s.trim());
      statements.forEach(stmt => {
        if (stmt.trim()) {
          db.exec(stmt);
        }
      });
      db.close();
      console.log('✅ Migration applied successfully using better-sqlite3!');
    } catch (e2) {
      console.log('⚠️  Could not apply migration automatically. Please run: npx prisma migrate deploy');
      console.log('Or install sqlite3: npm install -g sqlite3');
    }
  }
  
  unlinkSync(tempFile);
} catch (error) {
  console.error('Error applying migration:', error.message);
  console.log('Please run: npx prisma migrate deploy');
}

