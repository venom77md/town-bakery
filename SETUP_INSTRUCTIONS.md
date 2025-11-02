# 🚀 إرشادات الإعداد - Town Bakery مع Supabase و Paymob

## 📋 الخطوات المطلوبة

### 1. إنشاء مشروع Supabase

1. اذهب إلى https://app.supabase.com
2. سجّل حساب جديد أو سجّل الدخول
3. اضغط "New Project"
4. املأ البيانات:
   - **Project Name**: `town-bakery`
   - **Database Password**: (اختر كلمة مرور قوية واحفظها)
   - **Region**: اختر الأقرب لك
5. انتظر حتى يتم إنشاء المشروع (2-3 دقائق)

### 2. الحصول على بيانات الاتصال

1. في لوحة Supabase، اذهب إلى **Settings** → **API**
2. انسخ القيم التالية:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

3. اذهب إلى **Settings** → **Database**
4. في قسم **Connection String**، اختر **URI**
5. انسخ الـ connection string وأضف كلمة المرور:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   → هذا هو `DATABASE_URL`

### 3. إعداد Paymob (Sandbox)

1. اذهب إلى https://accept.paymob.com
2. سجّل حساب جديد أو سجّل الدخول
3. في **Settings** → **API Keys**، انسخ:
   - `API Key` → `PAYMOB_API_KEY`
4. في **Settings** → **Integrations**، أنشئ integration جديد:
   - اختر نوع الدفع (مثل: Card Payment)
   - انسخ `Integration ID` → `PAYMOB_INTEGRATION_ID`
   - انسخ `HMAC Secret` → `PAYMOB_HMAC_SECRET`
   - انسخ `Iframe ID` → `NEXT_PUBLIC_PAYMOB_IFRAME_ID`

### 4. إعداد ملف البيئة

1. انسخ `.env.example` إلى `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. فتح `.env.local` واملأ القيم:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

# Paymob
PAYMOB_API_KEY=your-api-key
PAYMOB_INTEGRATION_ID=your-integration-id
PAYMOB_HMAC_SECRET=your-hmac-secret
NEXT_PUBLIC_PAYMOB_IFRAME_ID=your-iframe-id

# Other
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
NEXT_PUBLIC_CONTACT_PHONE=+201234567890
NEXT_PUBLIC_PRIMARY_HEX=#C48A47
```

### 5. إعداد قاعدة البيانات

```bash
# توليد Prisma Client
npm run prisma:generate

# إنشاء Migration
npm run prisma:migrate

# إضافة البيانات الأولية (المنتجات)
npm run prisma:seed
```

### 6. تشغيل المشروع

```bash
npm run dev
```

افتح http://localhost:3000

---

## ✅ التحقق من العمل

### اختبار قاعدة البيانات:
```bash
npm run prisma:studio
```
يفتح Prisma Studio في المتصفح لعرض البيانات.

### اختبار API:
- `GET /api/products` - يجب أن يعيد المنتجات من Supabase
- `POST /api/contact` - اختبار نموذج الاتصال
- `POST /api/orders` - إنشاء طلب جديد

---

## 🐛 حل المشاكل

### خطأ: "Can't reach database server"
- تأكد من أن `DATABASE_URL` صحيح
- تأكد من إضافة كلمة المرور في الـ connection string

### خطأ: "Prisma Client not generated"
- شغّل: `npm run prisma:generate`

### خطأ في Paymob
- تأكد من استخدام بيانات Sandbox (ليس Production)
- تحقق من أن جميع المفاتيح صحيحة

---

## 📝 ملاحظات

- في وضع التطوير، يمكنك استخدام بيانات وهمية لـ Paymob
- Supabase يوفر 500MB مجاناً (كافٍ للتطوير)
- Paymob Sandbox مجاني للاختبار

