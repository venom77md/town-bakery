import { execSync } from "child_process";
import dotenv from "dotenv";
import net from "net";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

const { hostname, port } = new URL(dbUrl);

console.log(`\n🔍 Checking database connection to ${hostname}:${port}...`);

const socket = new net.Socket();
socket.setTimeout(5000);

socket.on("connect", async () => {
  console.log("✅ Database host reachable.\n");
  
  try {
    console.log("🚀 Running Prisma migrate...");
    execSync("npx prisma migrate dev --name init --skip-seed", { stdio: "inherit" });
    
    console.log("\n🌱 Running Prisma seed...");
    execSync("npx prisma db seed", { stdio: "inherit" });
    
    console.log("\n🎉 All steps completed successfully!");
  } catch (err) {
    console.error("\n❌ Error during setup:");
    console.error(err.message);
  } finally {
    socket.destroy();
  }
});

socket.on("timeout", () => {
  console.error("⚠️ Connection timeout (database not reachable or too slow)");
  socket.destroy();
});

socket.on("error", (err) => {
  console.error(`❌ Network error: ${err.message}`);
});

socket.connect(port, hostname);

