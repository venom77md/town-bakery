# 🔐 Environment Variables Setup Guide

## ✅ `.env.local` File Created

The `.env.local` file has been created in the project root with the following structure:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_public_key_here
DATABASE_URL=postgres://postgres:your_password@db.your-project-id.supabase.co:5432/postgres

PAYMOB_API_KEY=your_paymob_api_key_here
PAYMOB_INTEGRATION_ID=your_integration_id_here

NEXT_PUBLIC_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_CONTACT_PHONE=+201234567890
NEXT_PUBLIC_PRIMARY_HEX=#C48A47
```

---

## 📋 How to Get Real Values

### Supabase Credentials:

1. **Go to**: https://app.supabase.com
2. **Select your project** (or create a new one)
3. **Get SUPABASE_URL**:
   - Go to **Settings** → **API**
   - Copy **Project URL** → Replace `your-project-id.supabase.co`

4. **Get SUPABASE_ANON_KEY**:
   - Same page: **Settings** → **API**
   - Copy **anon public** key → Replace `your_anon_public_key_here`

5. **Get DATABASE_URL**:
   - Go to **Settings** → **Database**
   - Scroll to **Connection String** → Select **URI**
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
   - Replace `your-project-id` with your project reference ID

**Example**:
```env
DATABASE_URL=postgres://postgres:MySecurePassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

### Paymob Credentials:

1. **Go to**: https://accept.paymob.com
2. **Sign up** or **Login**
3. **Get PAYMOB_API_KEY**:
   - Go to **Settings** → **API Keys**
   - Copy your **API Key** → Replace `your_paymob_api_key_here`

4. **Get PAYMOB_INTEGRATION_ID**:
   - Go to **Settings** → **Integrations**
   - Create or select an integration (e.g., Card Payment)
   - Copy **Integration ID** → Replace `your_integration_id_here`

**Note**: For testing, use **Sandbox** credentials. For production, use **Live** credentials.

---

## ✅ Verification Steps

After updating `.env.local` with real values:

1. **Verify file location**:
   ```bash
   # Should be in project root (same level as package.json)
   ls .env.local
   ```

2. **Check environment variables load**:
   ```bash
   node -e "require('dotenv').config({path:'.env.local'}); console.log('SUPABASE_URL:', process.env.SUPABASE_URL)"
   ```

3. **Run database setup**:
   ```bash
   npm run db:setup
   ```

---

## ⚠️ Important Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use `.env.example`** for team members (without real values)
3. **Replace ALL placeholders** before running `npm run db:setup`
4. **Keep credentials secure** - Don't share them publicly

---

## 🚀 Next Steps

1. ✅ `.env.local` file created
2. ⏳ Replace placeholder values with real credentials
3. ⏳ Run `npm run db:setup`
4. ⏳ Run `npm run deploy`

---

**File Location**: `./.env.local` (project root)

