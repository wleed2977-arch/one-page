# OnePage — منشئ مواقع شخصية احترافية

<p align="center">
  <img src="client/public/logo/logo1.png" alt="OnePage Logo" width="120" />
</p>

<p align="center">
  <strong>ابنِ صفحة شخصية احترافية بدون كتابة HTML — محرّر مرئي، ثيمات جاهزة، ورابط عام لمشاركته فوراً.</strong>
</p>

<p align="center">
  <a href="https://onepage-jrrq.onrender.com/"><strong>🚀 جرّب التطبيق مباشرة</strong></a>
</p>

<p align="center">
  <a href="https://onepage-jrrq.onrender.com/">التجربة الحية</a> •
  <a href="#-الميزات">الميزات</a> •
  <a href="#-التقنيات-المستخدمة">التقنيات</a> •
  <a href="#-التشغيل-المحلي">التشغيل</a> •
  <a href="#-النشر">النشر</a> •
  <a href="docs/README.md">التوثيق التعليمي</a>
</p>

---

## ما هو OnePage؟

**جرّب التطبيق الآن:** [https://onepage-jrrq.onrender.com/](https://onepage-jrrq.onrender.com/) — سجّل حساباً، أكمل الإعداد، وابنِ صفحتك مباشرة من المتصفح دون تثبيت أي شيء.

**OnePage** تطبيق ويب متكامل (Full-Stack) يمكّن المطورين والمبدعين من إنشاء صفحة شخصية واحدة (Portfolio) عبر:

- **محرّر مرئي** لإضافة وتعديل أقسام المحتوى (Widgets)
- **6 ثيمات** جاهزة (فاتح، داكن، Linear، Glass، Forest، Ocean)
- **رابط عام** بصيغة `/p/اسمك` لمشاركة صفحتك مع أي شخص
- **تحليلات** لمتابعة عدد الزيارات
- **تصدير ZIP** لتحميل موقعك كاملاً

مناسب للمطورين الذين يريدون portfolio سريعاً، وللطلاب الذين يتعلمون بناء تطبيقات Full-Stack حقيقية.

---

## ✨ الميزات

| الميزة | الوصف |
|--------|--------|
| **تسجيل ودخول** | حسابات آمنة مع JWT في httpOnly cookies |
| **معالج الإعداد (Onboarding)** | 4 خطوات بعد التسجيل: الاسم، الرابط، الثيم، المعاينة |
| **محرّر الصفحة** | 9 أنواع Widgets: Hero، About، Projects، Skills، Gallery، Social، Contact، Resume، Divider |
| **صفحات عامة** | زوار بدون حساب يشاهدون `/p/your-slug` |
| **نموذج تواصل** | رسائل تُحفظ في قاعدة البيانات (مع دعم SMTP اختياري) |
| **تحليلات** | تتبع زيارات الصفحة خلال 7 أيام |
| **تغيير المظهر** | معاينة حية للثيمات |
| **تصدير الموقع** | تحميل ZIP من المحرّر |
| **لوحة إدارة** | للمستخدمين بدور `admin` |
| **تكاملات اختيارية** | Cloudinary (صور)، OpenAI (سيرة ذاتية)، SMTP (بريد) |

---

## 🛠 التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| **الواجهة** | Vanilla JavaScript، Vite، CSS Custom Properties |
| **الخادم** | Node.js 20+، Express |
| **قاعدة البيانات** | PostgreSQL + Prisma ORM |
| **المصادقة** | JWT (httpOnly cookies)، bcrypt |
| **الأمان** | Helmet، CORS، Rate limiting، Zod validation |
| **النشر** | Render (ملف `render.yaml` جاهز) |

---

## 📁 هيكل المشروع

```
onepage/
├── client/                 # الواجهة الأمامية (SPA)
│   ├── scripts/
│   │   ├── pages/          # صفحات التطبيق (landing، dashboard، builder...)
│   │   ├── widgets/        # مكوّنات المحتوى (hero، about، projects...)
│   │   ├── api/            # عميل HTTP للـ API
│   │   └── builder/        # محرّر الصفحة المرئي
│   └── styles/             # CSS (base، components، themes)
├── server/                 # الخادم (Express API)
│   ├── prisma/             # Schema + migrations
│   └── src/
│       ├── routes/         # مسارات API
│       ├── controllers/    # معالجة الطلبات
│       ├── services/       # منطق الأعمال
│       └── middlewares/    # auth، upload، errors
├── docs/                   # توثيق تعليمي كامل (16 فصل)
├── scripts/                # أدوات مساعدة
├── render.yaml             # إعداد النشر على Render
└── index.js                # نقطة دخول الإنتاج
```

---

## 🌐 التجربة الحية

| | |
|---|---|
| **رابط التجربة** | [https://onepage-jrrq.onrender.com/](https://onepage-jrrq.onrender.com/) |
| **ماذا تفعل** | سجّل حساباً → أكمل Onboarding → افتح Dashboard أو Builder → شارك رابط `/p/your-slug` |

> النسخة المنشورة على Render قد تستغرق بضع ثوانٍ عند أول زيارة (خطة مجانية).

---

## 🚀 التشغيل المحلي

إذا أردت تشغيل المشروع على جهازك بدلاً من النسخة الحية:

### المتطلبات

- **Node.js** 20 أو أحدث
- **PostgreSQL** محلي أو مستضاف
- **npm**

### 1. تثبيت الاعتماديات

```bash
git clone https://github.com/wleed2977-arch/one-page.git
cd one-page
npm install
```

### 2. إعداد المتغيرات البيئية

```bash
cp server/.env.example server/.env
```

عدّل `server/.env`:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=ضع-هنا-سلسلة-عشوائية-طويلة
DATABASE_URL="postgresql://onepage:onepagepassword@localhost:5432/onepagedb?schema=public"
```

### 3. إعداد قاعدة البيانات

```bash
cd server
npx prisma migrate dev
cd ..
```

### 4. تشغيل بيئة التطوير

```bash
npm run dev
```

| الخدمة | الرابط |
|--------|--------|
| الواجهة (Vite) | http://localhost:5173 |
| الـ API (Express) | http://localhost:3000 |

### 5. الإنتاج محلياً

```bash
npm run build
npm start
```

يعمل كل شيء من خادم Express واحد على المنفذ 3000.

---

## 🔐 متغيرات بيئية اختيارية

| المتغير | الغرض |
|---------|--------|
| `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` | رفع الصور إلى Cloudinary |
| `OPENAI_API_KEY` | توليد سيرة ذاتية بالذكاء الاصطناعي |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, ... | إرسال رسائل نموذج التواصل بالبريد |

---

## 🌐 مسار المستخدم

```
التسجيل → Onboarding (4 خطوات) → Dashboard → Builder → حفظ → مشاركة /p/your-slug
```

بعد إكمال Onboarding يُنشأ تلقائياً 6 widgets جاهزة (Hero، About، Skills، Projects، Social، Contact) مخصّصة بمعلوماتك.

---

## 📡 نظرة على الـ API

القاعدة: `/api/v1`

| Method | Endpoint | الوصف |
|--------|----------|--------|
| `POST` | `/auth/register` | إنشاء حساب |
| `POST` | `/auth/login` | تسجيل الدخول |
| `POST` | `/auth/logout` | تسجيل الخروج |
| `GET` | `/pages/my` | صفحتك + الـ widgets |
| `PUT` | `/pages/my/widgets` | حفظ الـ widgets |
| `GET` | `/pages/:slug` | الصفحة العامة |
| `POST` | `/contact/:slug` | إرسال رسالة تواصل |
| `GET` | `/analytics/my` | تحليلات صفحتك |
| `GET` | `/export/my` | تصدير ZIP |

للتفاصيل الكاملة: [docs/06_API_GUIDE.md](docs/06_API_GUIDE.md)

---

## 👤 إنشاء مستخدم Admin

بعد التسجيل، غيّر دور المستخدم في قاعدة البيانات:

```bash
cd server
npx prisma studio
```

افتح جدول `User` واضبط `role` إلى `admin`.

---

## ☁️ النشر

المشروع جاهز للنشر على **Render** عبر [`render.yaml`](render.yaml):

1. اربط المستودع بـ Render
2. أنشئ قاعدة PostgreSQL
3. اضبط `JWT_SECRET` و `DATABASE_URL`
4. Render يشغّل `npm run build` ثم `npm start`

دليل مفصّل: [docs/10_DEPLOYMENT_GUIDE.md](docs/10_DEPLOYMENT_GUIDE.md)

---

## 📚 التوثيق التعليمي

مجلد [`docs/`](docs/) يحتوي دورة تعليمية كاملة (16 فصل) للمبتدئين:

| الفصل | الموضوع |
|-------|---------|
| [00](docs/00_PROJECT_OVERVIEW.md) | نظرة عامة على المشروع |
| [01](docs/01_FULL_ARCHITECTURE_GUIDE.md) | الهندسة المعمارية |
| [03](docs/03_FRONTEND_GUIDE.md) | الواجهة الأمامية |
| [04](docs/04_BACKEND_GUIDE.md) | الخادم |
| [05](docs/05_DATABASE_GUIDE.md) | قاعدة البيانات |
| [07](docs/07_SECURITY_GUIDE.md) | الأمان |
| [13](docs/13_FAQ.md) | أسئلة شائعة (100+) |

ابدأ من: [docs/README.md](docs/README.md)

---

## 🧪 أوامر مفيدة

```bash
npm run dev          # تطوير (واجهة + خادم)
npm run build        # بناء الواجهة + Prisma generate
npm start            # تشغيل الإنتاج
npm run optimize-logo  # تحسين الشعار
```

---

## 📄 الترخيص

MIT — انظر ملف الترخيص للتفاصيل.

---

## 👨‍💻 المؤلف

**Muamel Tahsin**

---

<br>

---

# OnePage — Personal Website Builder (English)

<p align="center">
  <strong>Build a professional one-page portfolio without writing HTML — visual editor, ready themes, and a shareable public link.</strong>
</p>

<p align="center">
  <a href="https://onepage-jrrq.onrender.com/"><strong>🚀 Live Demo</strong></a>
</p>

## What is OnePage?

**Try it now:** [https://onepage-jrrq.onrender.com/](https://onepage-jrrq.onrender.com/)

OnePage is a full-stack web application that lets developers and creators build a single-page portfolio with a visual widget editor, six themes, public URLs at `/p/your-slug`, first-party analytics, and ZIP export.

## Quick Start

```bash
git clone https://github.com/wleed2977-arch/one-page.git
cd one-page
npm install
cp server/.env.example server/.env
# Edit JWT_SECRET and DATABASE_URL in server/.env
cd server && npx prisma migrate dev && cd ..
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:3000  

## Tech Stack

Vanilla JS (Vite) · Express · PostgreSQL · Prisma · JWT cookies · bcrypt

## Features

- Auth (register / login / logout)
- 4-step onboarding wizard with seeded starter page
- Visual builder with 9 widget types
- 6 themes (light, dark, linear, glass, forest, ocean)
- Public pages, contact form, analytics, ZIP export, admin panel
- Optional: Cloudinary, OpenAI, SMTP

## Documentation

Full educational course: [docs/README.md](docs/README.md)

## Deploy

Render-ready via [render.yaml](render.yaml) — see [docs/10_DEPLOYMENT_GUIDE.md](docs/10_DEPLOYMENT_GUIDE.md).

## License

MIT
