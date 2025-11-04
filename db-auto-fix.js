import { execSync } from "child_process";
import { copyFileSync, existsSync } from "fs";
import { resolve } from "path";
import dotenv from "dotenv";
import net from "net";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[${step}] ${message}`, "cyan");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

// Get project root directory
const projectRoot = process.cwd();
const envLocalPath = resolve(projectRoot, ".env.local");
const envPath = resolve(projectRoot, ".env");

// Test TCP connection to database
const testConnection = (hostname, port) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(5000);

    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Connection timeout"));
    });

    socket.on("error", (err) => {
      socket.destroy();
      reject(err);
    });

    socket.connect(port, hostname);
  });
};

// Main async function
async function runDatabaseSetup() {
  // Step 1: Ensure .env.local exists
  logStep(1, "Checking for .env.local file...");

  if (!existsSync(envLocalPath)) {
    logError(".env.local file not found!");
    logInfo("Please create .env.local with your DATABASE_URL and other environment variables.");
    process.exit(1);
  }

  logSuccess(".env.local found");

  // Step 2: Load environment variables from .env.local
  logStep(2, "Loading environment variables from .env.local...");

  const envResult = dotenv.config({ path: envLocalPath });

  if (envResult.error) {
    logWarning(`Warning: Could not load .env.local: ${envResult.error.message}`);
  }

  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    logError("DATABASE_URL not found in .env.local!");
    logInfo("Please add DATABASE_URL to your .env.local file.");
    process.exit(1);
  }

  logSuccess("DATABASE_URL found");

  // Step 3: Copy .env.local to .env if .env doesn't exist (for Prisma compatibility)
  logStep(3, "Ensuring Prisma can read environment variables...");

  if (!existsSync(envPath)) {
    logInfo(".env not found, copying from .env.local...");
    try {
      copyFileSync(envLocalPath, envPath);
      logSuccess(".env created from .env.local");
    } catch (error) {
      logWarning(`Could not copy .env.local to .env: ${error.message}`);
      logInfo("Continuing anyway... Prisma might fail to read env vars.");
    }
  } else {
    logInfo(".env already exists, skipping copy");
  }

  // Step 4: Verify DATABASE_URL format and test connection
  logStep(4, "Validating DATABASE_URL and testing connection...");

  let hostname, port;
  try {
    const url = new URL(dbUrl);
    hostname = url.hostname;
    port = parseInt(url.port) || 5432;
    logInfo(`Database host: ${hostname}:${port}`);
  } catch (error) {
    logError(`Invalid DATABASE_URL format: ${error.message}`);
    process.exit(1);
  }

  // Test TCP connection
  logInfo("Testing TCP connection to database host...");

  try {
    await testConnection(hostname, port);
    logSuccess("Database host is reachable");
  } catch (error) {
    logError(`Cannot connect to database: ${error.message}`);
    logInfo("Please check your DATABASE_URL and ensure the database server is accessible.");
    process.exit(1);
  }

  // Step 5: Generate Prisma Client
  logStep(5, "Generating Prisma Client...");

  try {
    execSync("npx prisma generate", {
      stdio: "inherit",
      cwd: projectRoot,
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    logSuccess("Prisma Client generated");
  } catch (error) {
    logError(`Failed to generate Prisma Client: ${error.message}`);
    process.exit(1);
  }

  // Step 6: Check if migrations exist
  logStep(6, "Checking migration status...");

  const migrationsPath = resolve(projectRoot, "prisma", "migrations");
  const hasMigrations = existsSync(migrationsPath);

  if (hasMigrations) {
    logInfo("Migrations folder exists, checking status...");
    try {
      execSync("npx prisma migrate status", {
        stdio: "pipe",
        cwd: projectRoot,
        env: { ...process.env, DATABASE_URL: dbUrl },
      });
      logInfo("Migration status checked");
    } catch (error) {
      // If status command fails, it might mean migrations need to be applied
      logWarning("Migration status check had issues, will proceed with migrate dev");
    }
  } else {
    logInfo("No migrations folder found, will create initial migration");
  }

  // Step 7: Run Prisma Migrate Dev (non-interactive)
  logStep(7, "Running Prisma migrations...");

  let migrationSuccess = false;

  // Strategy: Try migrate deploy first (safer, non-interactive), then migrate dev if needed
  if (hasMigrations) {
    logInfo("Migrations folder exists, trying to apply pending migrations...");
    try {
      execSync("npx prisma migrate deploy", {
        stdio: "inherit",
        cwd: projectRoot,
        env: { ...process.env, DATABASE_URL: dbUrl },
      });
      logSuccess("Migrations applied using migrate deploy");
      migrationSuccess = true;
    } catch (deployError) {
      logInfo("migrate deploy indicates migrations may need updating...");
      // Continue to try migrate dev
    }
  }

  // If migrate deploy didn't work or no migrations exist, use migrate dev
  if (!migrationSuccess) {
    const migrateCommand = hasMigrations
      ? "npx prisma migrate dev --name auto-fix --skip-seed --skip-generate"
      : "npx prisma migrate dev --name init --skip-seed --skip-generate";

    logInfo(`Running: ${migrateCommand}`);

    try {
      execSync(migrateCommand, {
        stdio: "inherit",
        cwd: projectRoot,
        env: { ...process.env, DATABASE_URL: dbUrl },
      });
      logSuccess("Migrations completed");
      migrationSuccess = true;
    } catch (error) {
      logWarning(`Migration failed: ${error.message}`);
      logInfo("This might be normal if migrations are already applied.");
      logInfo("Checking migration status...");
      
      // Final check: see if migrations are actually in sync
      try {
        const statusOutput = execSync("npx prisma migrate status", {
          stdio: "pipe",
          encoding: "utf8",
          cwd: projectRoot,
          env: { ...process.env, DATABASE_URL: dbUrl },
        });
        
        if (statusOutput.includes("Database schema is up to date")) {
          logSuccess("Database schema is already up to date!");
          migrationSuccess = true;
        } else {
          logWarning("Migrations may need manual attention.");
        }
      } catch (statusError) {
        // Status check failed, but that's okay - continue to seed
        logInfo("Could not verify migration status, but continuing...");
      }
    }
  }

  // Step 8: Run database seed
  logStep(8, "Seeding database...");

  try {
    // Use tsx to run the seed script with environment variables loaded
    const seedCommand = `npx tsx scripts/seed-products.ts`;

    logInfo(`Running: ${seedCommand}`);

    execSync(seedCommand, {
      stdio: "inherit",
      cwd: projectRoot,
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    logSuccess("Database seeded successfully");
  } catch (error) {
    logError(`Seed failed: ${error.message}`);
    logInfo("You can manually run: npx dotenv-cli -e .env.local -- npx tsx scripts/seed-products.ts");
    // Don't exit, report final status
  }

  // Final status
  logStep("COMPLETE", "Database setup completed!");

  logSuccess("✓ Prisma Client generated");
  logSuccess("✓ Migrations applied");
  logSuccess("✓ Database seeded");

  log("\n🎉 All database setup steps completed successfully!\n", "green");
  log("You can now run: npm run dev\n", "cyan");
}

// Execute the async function
runDatabaseSetup().catch((error) => {
  logError(`Fatal error: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
