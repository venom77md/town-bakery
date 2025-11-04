import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Required environment variables
const REQUIRED_VARS = {
  DATABASE_URL: {
    required: true,
    description: 'PostgreSQL connection string for Prisma',
    validate: (value) => {
      if (!value) return { valid: false, error: 'DATABASE_URL is required' };
      if (!value.startsWith('postgresql://')) {
        return { valid: false, error: 'DATABASE_URL must start with postgresql://' };
      }
      try {
        const url = new URL(value);
        if (!url.hostname || !url.pathname) {
          return { valid: false, error: 'Invalid DATABASE_URL format' };
        }
        return { valid: true };
      } catch {
        return { valid: false, error: 'Invalid DATABASE_URL URL format' };
      }
    },
  },
  PAYMOB_API_KEY: {
    required: true,
    description: 'Paymob API key for payment processing',
    validate: (value) => ({ valid: !!value, error: value ? null : 'PAYMOB_API_KEY is required' }),
  },
  PAYMOB_INTEGRATION_ID: {
    required: true,
    description: 'Paymob integration ID',
    validate: (value) => ({ valid: !!value, error: value ? null : 'PAYMOB_INTEGRATION_ID is required' }),
  },
  NEXT_PUBLIC_ADMIN_PASSWORD: {
    required: true,
    description: 'Admin password (exposed to client - security concern)',
    validate: (value) => {
      if (!value) return { valid: false, error: 'NEXT_PUBLIC_ADMIN_PASSWORD is required' };
      if (value === 'admin123') {
        return { valid: true, warning: 'Using default password - change in production!' };
      }
      return { valid: true };
    },
  },
  NEXT_PUBLIC_CONTACT_PHONE: {
    required: true,
    description: 'Contact phone number displayed in UI',
    validate: (value) => ({ valid: !!value, error: value ? null : 'NEXT_PUBLIC_CONTACT_PHONE is required' }),
  },
};

// Optional but recommended
const OPTIONAL_VARS = {
  SUPABASE_URL: {
    description: 'Supabase project URL',
    validate: (value) => ({ valid: true, warning: value ? null : 'SUPABASE_URL not set (may not be needed)' }),
  },
  SUPABASE_ANON_KEY: {
    description: 'Supabase anonymous key',
    validate: (value) => ({ valid: true, warning: value ? null : 'SUPABASE_ANON_KEY not set (may not be needed)' }),
  },
  PAYMOB_HMAC_SECRET: {
    description: 'Paymob HMAC secret for webhook verification',
    validate: (value) => ({ 
      valid: true, 
      warning: value ? null : 'PAYMOB_HMAC_SECRET not set (webhook verification will be skipped)' 
    }),
  },
  NEXT_PUBLIC_PRIMARY_HEX: {
    description: 'Primary theme color hex code',
    validate: (value) => ({ valid: true }),
  },
  NEXT_PUBLIC_GA_ID: {
    description: 'Google Analytics ID',
    validate: (value) => ({ valid: true }),
  },
  NEXT_PUBLIC_META_PIXEL_ID: {
    description: 'Meta Pixel ID',
    validate: (value) => ({ valid: true }),
  },
  SITE_URL: {
    description: 'Site URL for sitemap generation',
    validate: (value) => ({ valid: true }),
  },
};

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const env = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        env[key] = value;
      }
    }
    
    return env;
  } catch (error) {
    return null;
  }
}

function validateEnvironment() {
  console.log('🔍 Environment Variables Validation\n');
  console.log('='.repeat(60));
  
  // Try to load .env.local first, then .env
  let env = loadEnvFile(join(projectRoot, '.env.local'));
  if (!env) {
    env = loadEnvFile(join(projectRoot, '.env'));
  }
  
  if (!env) {
    console.error('❌ No .env.local or .env file found!');
    process.exit(1);
  }
  
  console.log(`✅ Environment file loaded: ${env === loadEnvFile(join(projectRoot, '.env.local')) ? '.env.local' : '.env'}\n`);
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Validate required variables
  console.log('📋 Required Variables:\n');
  for (const [key, config] of Object.entries(REQUIRED_VARS)) {
    const value = env[key];
    const result = config.validate(value);
    
    if (!result.valid) {
      console.error(`❌ ${key}: ${result.error}`);
      hasErrors = true;
    } else if (result.warning) {
      console.warn(`⚠️  ${key}: ${result.warning}`);
      hasWarnings = true;
    } else {
      const displayValue = key.includes('PASSWORD') || key.includes('KEY') || key.includes('SECRET')
        ? '•'.repeat(Math.min(value?.length || 0, 20))
        : value;
      console.log(`✅ ${key}: ${displayValue}`);
    }
    console.log(`   ${config.description}`);
    console.log('');
  }
  
  // Check optional variables
  console.log('\n📋 Optional Variables:\n');
  for (const [key, config] of Object.entries(OPTIONAL_VARS)) {
    const value = env[key];
    const result = config.validate(value);
    
    if (result.warning) {
      console.warn(`⚠️  ${key}: ${result.warning}`);
      hasWarnings = true;
    } else if (value) {
      const displayValue = key.includes('PASSWORD') || key.includes('KEY') || key.includes('SECRET')
        ? '•'.repeat(Math.min(value.length, 20))
        : value;
      console.log(`✅ ${key}: ${displayValue}`);
      console.log(`   ${config.description}`);
    } else {
      console.log(`○  ${key}: (not set)`);
      console.log(`   ${config.description}`);
    }
    console.log('');
  }
  
  // Summary
  console.log('='.repeat(60));
  if (hasErrors) {
    console.error('\n❌ Validation failed: Missing required variables');
    process.exit(1);
  } else if (hasWarnings) {
    console.warn('\n⚠️  Validation passed with warnings');
    process.exit(0);
  } else {
    console.log('\n✅ All environment variables validated successfully!');
    process.exit(0);
  }
}

validateEnvironment();

