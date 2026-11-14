# Portfolio

Bitta sodda shablondagi ko‘p foydalanuvchili portfolio. Next.js App Router, TypeScript, Tailwind CSS va Supabase. Har bir foydalanuvchi o‘z ma’lumotini `/edit` orqali tahrirlaydi, ish beruvchi esa `/username` havolasini akkauntsiz ochadi.

## 1. Supabase

1. [Supabase](https://supabase.com/dashboard) da yangi loyiha oching.
2. **SQL Editor → New query** orqali `supabase/migrations/001_profiles.sql` faylining **hammasini bir marta** ishga tushiring. Bu yangi baza uchun migratsiya; avval yaratilgan `profiles` jadvaliga ustidan ishlatmang.
3. SQL `profiles` jadvali, RLS va `avatars`, `project-images` ommaviy bucketlarini yaratadi. **Storage** bo‘limida ikkalasi ham borligini tekshiring. Alohida qo‘lda yaratish shart emas. Ruxsat berilgan rasmlar: JPEG, PNG, WebP; ko‘pi bilan 5 MB. Fayl yo‘li: `USER_ID/random-uuid.ext`.
4. **Project Settings → API** (yoki Connect) dan project URL va `anon` kalitini oling. `service_role` kalitini bu ilovaga kiritmang. Brauzerda anon kalit ishlatiladi, yozish huquqi RLS bilan cheklanadi.
5. **Authentication → URL Configuration**:
   - Hozircha Site URL: `http://localhost:3000`.
   - Redirect URLs: `http://localhost:3000/auth/callback` va `http://localhost:3000/auth/confirm`.
   - Vercelga chiqqach haqiqiy HTTPS domeningiz uchun shu ikki manzilni ham qo‘shing va Site URL ni production domeniga o‘zgartiring.
6. **Authentication → Sign In / Providers → Email** ni yoqing. Yangi foydalanuvchilarni ro‘yxatdan o‘tkazishga ruxsat bering. Parol kerak emas, kirish email havolasi orqali.

### Email havolasi

**Dastlabki sinov uchun shablonlarni o‘zgartirish shart emas.** Ilova Supabase standart email havolasidan qaytgan `code` ni ham qabul qiladi. Kirish havolasini aynan so‘ragan brauzer va qurilmada oching: standart havola uchun PKCE tekshiruv ma’lumoti shu brauzer cookie sida saqlanadi.

Supabase standart email xizmati faqat loyiha tashkilotining jamoa a’zolari email manzillariga yuboradi va past yuborish limitiga ega. Sinovda Supabase akkauntingiz emailidan foydalaning. Barcha mijozlarga email yuborish uchun **Authentication → Emails → SMTP Settings** da o‘z SMTP xizmatingizni ulang. [Supabase SMTP cheklovlari](https://supabase.com/docs/guides/auth/auth-smtp).

**SMTP ulangandan keyin**, xohlasangiz **Authentication → Emails → Templates** dagi **Magic link or OTP** va **Confirm sign up** shablonlarining kirish havolasini shunga almashtiring:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Portfolioga kirish</a>
```

Ilova email uchun `/auth/confirm` manzilini yuboradi. Server kod yoki token hashni Supabase orqali tekshirib, cookie yaratadi va `/edit` ga yo‘naltiradi. Yuqoridagi maxsus `token_hash` havolasi boshqa brauzerda ochilganda ham ishlaydi. Havolalar bir martalik; muddati o‘tgan bo‘lsa `/login` dan yangisini so‘rang. Email yetib kelishi va spam papkasini haqiqiy manzil bilan sinang.

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) da OAuth consent screen va **Web application** OAuth Client ID yarating.
2. Google dagi **Authorized redirect URIs** ga Supabase Google provider sozlamasida ko‘rsatilgan callbackni kiriting: `https://PROJECT_REF.supabase.co/auth/v1/callback`. Bu manzil ilovaning `/auth/callback` manzilidan boshqa.
3. Client ID va Client Secret ni **Supabase → Authentication → Providers → Google** ga kiriting va providerni yoqing. Secretni `.env.local` yoki brauzer kodiga qo‘ymang.
4. Google ilovasi Testing holatida bo‘lsa test foydalanuvchilarni qo‘shing; hammaga ochishdan oldin OAuth consent sozlamalarini production uchun yakunlang.

Rasmiy qo‘llanmalar: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs), [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [email havolalari](https://supabase.com/docs/guides/auth/auth-email-passwordless).

## 2. Lokal ishga tushirish

Node.js 22 LTS va npm kerak. PowerShell:

```powershell
cd D:\Projects\universal_portfolio\folio
npm install
Copy-Item .env.example .env.local
```

`.env.local` ichiga o‘z qiymatlaringizni kiriting:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```powershell
npm run dev
```

[Lokal sayt](http://localhost:3000) ni oching. Muhit qiymatini o‘zgartirsangiz serverni qayta ishga tushiring. Supabase sozlanmaguncha landing ochiladi, login sahifasi sozlash kerakligini bildiradi. Soxta ma’lumotlar yoki soxta kirish rejimi yo‘q.

## 3. Foydalanish

1. **Boshlash** → Google yoki email orqali kiring.
2. Birinchi kirishda bo‘sh username tanlang: 3–30 ta kichik lotin harfi, raqam yoki chiziqcha. Bandlik yozayotganda tekshiriladi; bazadagi UNIQUE cheklovi bir vaqtdagi tanlovlardan ham himoya qiladi. `edit`, `login`, `api`, `admin`, `auth` va boshqa tizim nomlari band qilingan. Username keyinchalik o‘zgarmaydi.
3. `/edit` da ism va boshqa ma’lumotlarni kiriting. **Qo‘shish** bilan ko‘nikma, loyiha, tajriba va ta’lim qatorlarini qo‘shing. Keraksiz qatorni **O‘chirish** bilan olib tashlang.
4. Rasm yuklang, so‘ng **Saqlash** ni bosing. Rasm yuklashning o‘zi profilni e’lon qilmaydi. Yangi loyiha qo‘shganingizda ham shu sahifaga qaytib saqlaysiz.
5. **Havolani nusxalash** bilan to‘liq manzilni oling yoki **Portfolioni ko‘rish** ni bosing.

Saqlangan ma’lumotlar, aloqa ma’lumotlari va rasmlar ommaviy. Bo‘sh bo‘limlar ko‘rsatilmaydi. Profil egasi o‘z sahifasida **Tahrirlash** tugmasini ko‘radi; boshqa odamlar ko‘rmaydi. Rasmni formadan olib tashlash eski faylni Storage dan avtomatik o‘chirmaydi (hali e’lon qilingan rasmni buzmaslik uchun); ishlatilmagan rasmlarni loyiha egasi Supabase Storage orqali tozalashi mumkin.

## 4. Vercel

1. Shu `folio` papkasi `habibnematov3-debug/universal_portfolio` GitHub repositorysiga ulangan. `.env.local` va `node_modules` ni yubormang (`.gitignore` bor).
2. [Vercel](https://vercel.com/new) da repositoryni import qiling. Framework: **Next.js**. Bu repositoryda ilova ildizda turadi: **Root Directory bo‘sh yoki `.`** bo‘lsin. `folio` deb yozmang — bu kompyuterdagi papka nomi. Mavjud Vercel loyiha eski Vite sozlamalarini ishlatsa, Framework ni Next.js ga o‘zgartiring, Output Directory override ni o‘chiring va qayta deploy qiling.
3. Node.js **22.x** ni tanlang. Build command: `npm run build`. Output Directory: Next.js standarti, qo‘lda `out` yoki `dist` bermang.
4. Environment Variables ga `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` va `NEXT_PUBLIC_SITE_URL` ni kiriting. Oxirgisi haqiqiy production manzili: `https://YOUR-APP.vercel.app`. Dastlab domen noma’lum bo‘lsa deploydan keyin uni belgilang va qayta deploy qiling.
5. Supabase Site URL va redirect ro‘yxatini yuqorida ko‘rsatilganidek Vercel domeniga moslang. Production domeni orqali Google va email kirishini sinang.
6. Preview deployda ham login kerak bo‘lsa uning aniq callback/confirm manzillarini Supabase allowlistiga qo‘shing. `.env.local` Vercelga avtomatik uzatilmaydi; dashboarddagi muhit qiymatlari alohida. `NEXT_PUBLIC_*` o‘zgarganda qayta deploy qiling.

Bu ilova serverda render qilinadi; **GitHub Pages uchun static export emas**. Public profil SSR ishlatadi. OG/Twitter sarlavhasi ism + headline, tavsifi bio, rasmi avatar. Canonical URL `NEXT_PUBLIC_SITE_URL` dan olinadi. Telegram/LinkedIn eski previewni vaqtincha keshlashi mumkin.

GitHub Actions endi test va buildni tekshiradi. Vercel repository bilan ulangandan keyin `main` ga push yangi deployni boshlaydi. GitHub Pages dagi eski sayt alohida deployment bo‘lib qoladi; yangi ilovaning manzili Vercel loyihasida ko‘rsatiladi.

## 5. Tekshirish

```powershell
npm test
npm run typecheck
npm run build
```

Avtomatik testlar username, xavfli havolalar, noto‘g‘ri forma ma’lumotlari va bo‘sh qiymatlarni tekshiradi. Haqiqiy Supabase loyihasida quyidagi qabul tekshiruvlarini ham bajaring:

- Google va email orqali yangi kirish → username → edit; refreshdan so‘ng sessiya saqlanadi.
- Ikki akkaunt bir xil username tanlasa faqat bittasi saqlanadi.
- Barcha ro‘yxatlarga qator qo‘shing/o‘chiring; rasm yuklang, saqlang va yangi brauzerda ommaviy havolani oching.
- Chiqib ketgandan keyin `/edit` login ga yo‘naltiradi. Mavjud bo‘lmagan username 404 beradi.
- Anon SELECT ishlaydi; A akkaunt sessiyasi bilan B profilini UPDATE/DELETE qilish va B user_id si bilan INSERT qilish rad etiladi. A o‘z user_id yoki username sini almashtira olmaydi.
- A sessiyasi B papkasiga rasm yuklay olmaydi; o‘z papkasiga yuklay oladi. 5 MB dan katta fayl va SVG rad etiladi.
- Ommaviy havoladagi **Tahrirlash** faqat egasiga ko‘rinadi; inkognito rejimida yo‘q. Sahifa manbasida profil ma’lumotlari, `og:title`, `og:description`, avatar bo‘lsa `og:image` mavjud.
- Telefon va kompyuterda uzun matn, bo‘sh bo‘limlar va kontakt havolalarini sinang.

`tests/rls.sql` alohida **sinov bazasi** uchun ruxsat testlarini ham beradi. Migratsiyadan keyin `postgres` sifatida bajariladi, ikkita vaqtinchalik auth foydalanuvchisini yaratadi va oxirida barcha test ma’lumotlarini `ROLLBACK` qiladi. Lokal tekshiruvda migratsiya va bu testlar PostgreSQL 18 da Supabase `auth.uid()`/Storage jadval tuzilmasining minimal nusxalari bilan bajarildi. Bu haqiqiy OAuth, SMTP va Supabase Storage xizmatini tekshirish o‘rnini bosmaydi. Brauzer oqimi ham vaqtinchalik lokal API javoblari bilan sinovdan o‘tdi; ushbu sinov serveri ilova tarkibiga kiritilmagan.

## Tuzilishi

- `supabase/migrations/001_profiles.sql` — jadval, cheklovlar, RLS, bucketlar va storage siyosatlari.
- `lib/supabase/` va `proxy.ts` — Supabase SSR cookie sessiyasi; serverda `getUser()` bilan tekshirish.
- `app/actions.ts` — username va profilni serverda tekshirib saqlash. `user_id` formadan olinmaydi.
- `components/EditForm.tsx` — forma, dinamik qatorlar va yuklashlar.
- `app/[username]/page.tsx` — yagona ommaviy shablon va metadata.
- `lib/text.ts` — o‘zbekcha UI matnlari; keyingi til lug‘atlari uchun asos.
- `lib/validation.ts` — brauzer/server uchun bir xil Zod qoidalari.

RLS barcha public profil ma’lumotlarini o‘qishga ruxsat beradi, faqat egasining o‘z qatoriga yozishini qabul qiladi. Ommaviy sahifa foydalanuvchi cookie sini hisobga olgani uchun umumiy HTML keshga qo‘yilmaydi. Server service-role kalitidan foydalanmaydi.
