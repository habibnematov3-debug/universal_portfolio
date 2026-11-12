# Xaridorga portfolio tayyorlash

Bu mahsulot bir xaridorga bitta alohida portfolio sayt topshirish uchun. Sayt UZ/RU/ENG tillarida ishlaydi. Har bir xaridor o‘z repozitoriyasi, domeni va ma’lumot fayliga ega bo‘lishi mumkin.

## 1. Alohida nusxa yarating

Asosiy loyiha papkasida:

```powershell
npm run client -- aziza-portfolio
```

Bu yonidagi `clients/aziza-portfolio` papkasiga yangi, ixcham loyiha yaratadi. Oldingi Git tarixi, GitHub manzili, maxfiy fayllar va o‘rnatilgan kutubxonalar ko‘chmaydi. Mavjud papkaning ustiga yozmaydi. Hozirgi ommaviy matnlar va rasmlar ko‘chadi: ularni yangi mijoznikiga almashtiring.

Yangi papkada `npm install`, keyin `npm run dev` bajaring. `package-lock.json` yaratiladi; uni GitHub’ga ham qo‘shing. Yangi repository nomi yuqoridagi nom bilan mos bo‘lsin. Alohida domen uchun build vaqtida `PORTFOLIO_BASE=/` belgilang.

## 2. Ma’lumotlarni kiriting

Sayt manzilining oxiriga `?edit=1` qo‘shing. Masalan, joriy loyiha uchun:

`http://127.0.0.1:5173/universal_portfolio/?edit=1`

1. Tilni tanlab, ism, kasb, tanishtiruv va hikoyani kiriting. UZ, RU va ENG matnlari alohida yoziladi; avtomatik tarjima yo‘q.
2. O‘zingiz olgan yoki foydalanish huquqiga ega portret va loyiha rasmlarini yuklang. Rasm yuklash PNG/JPEG/WebP qabul qiladi, kattaligini kamaytiradi va fayl ichiga joylaydi. Rasm fayli 15 MB dan oshmasin.
3. Rezyume PDF’ini `public/` ichiga qo‘yib, maydonga `resume.pdf` yozing. Havola uchun HTTPS manzil ishlating.
4. Har bir loyiha uchun maqsad, shaxsiy hissa va haqiqiy natijani yozing. Namunaviy loyihalarni xaridorga tegishli deb taqdim etmang.
5. Mavzu bo‘limida yo‘nalish, ranglar, sarlavha shriftini tanlang. Yo‘nalish tanlash matnni avtomatik o‘zgartirmaydi.
6. Namuna rejimini o‘chiring. Aloqa emaili yoki ijtimoiy havola qo‘shing.
7. Ko‘rinish tugmasida natijani tekshiring. Qoralamani saqlang yoki nashr faylini yuklab oling.

`Qoralamani saqlash` faqat shu brauzerga saqlaydi. Har bir sayt manzilida bitta qoralama bor. Boshqa xaridorni tahrirlashdan oldin mavjud qoralamani faylga yuklab oling. Qurilma yoki brauzer ma’lumotlari o‘chsa, yuklab olingan fayl zaxira nusxa bo‘ladi.

Tahrirlash sahifasi server administrator paneli emas. Unda login yoki internetdagi ma’lumotga yozish huquqi yo‘q. Uni ochgan boshqa odam faqat o‘z qurilmasida nusxani tahrirlashi mumkin; haqiqiy nashr GitHub repozitoriyasiga kirish huquqini talab qiladi. Qoralama matnlari serverga yuborilmaydi. Tashqi rasm havolalari o‘sha rasm xizmatiga murojaat qiladi.

## 3. Nashr qiling

`Nashr faylini olish` orqali `portfolio.json` ni yuklab oling. Uni loyihadagi **public/portfolio.json** o‘rniga qo‘ying. Fayl nomiga brauzer `(1)` qo‘shgan bo‘lsa, uni olib tashlang.

```powershell
npm run test:portfolio
npx tsc --noEmit
npm run build:pages
```

Natija `pages-dist/` ichida. Build profil matnini tayyor HTML ichiga yozadi, sarlavha, description va Open Graph matnlarini yaratadi. Namuna rejimida qidiruv tizimlariga indekslamaslik belgisi qo‘shiladi. Asosiy til matni HTML’da mavjud; boshqa tillar tugma orqali ochiladi. Tillar uchun alohida indekslanadigan URL sahifalari hozir yo‘q.

Mijoz ma’lumotlari to‘ldirilmaganida nashrni to‘xtatish uchun:

```powershell
$env:REQUIRE_CLIENT_CONTENT='1'
npm run build:pages
Remove-Item Env:REQUIRE_CLIENT_CONTENT
```

Bu tekshiruv kontakt, portret, loyihalar, asosiy tarjimalar va demo belgisini tekshiradi. Matnning rostligi, tarjima sifati va havolalarning ishlashi qo‘lda tekshiriladi.

GitHub Desktop’da o‘zgarishlarni **Commit → Push origin** qiling. Repository **Settings → Pages → Source: GitHub Actions** bo‘lsin. **Actions** dagi build va deploy yashil bo‘lgach, ommaviy havolani oching. Actions xatosi bo‘lsa, muvaffaqiyatsiz bosqichning xabarini ko‘ring; qayta bosish kod xatosini tuzatmaydi.

## 4. Xaridorga topshirish

- Telefon va kompyuterda uchala tilni ko‘ring, email, ijtimoiy tarmoq va loyiha havolalarini oching.
- Portret va PDF’ni haqiqiy nashrdan oching. Uzun ism va matnlar ekran tashqarisiga chiqmasin.
- Hech qaysi joyda oldingi xaridorning matni, kontakti yoki rasmi qolmasin.
- Xaridorga ishlaydigan sayt havolasi, `portfolio.json`, rasmlar/PDF va loyiha nusxasini bering.
- Domen va hosting xarajatlari, kim yangilashi va xizmat muddati bo‘yicha kelishuvni alohida belgilang.
- Yangilashdan oldin faylni zaxiralang. Xato nashrni qaytarish uchun GitHub’da oldingi to‘g‘ri commitga qaytish mumkin.

## Tarkib va chegaralar

Asosiy funksiyalar: 3 til, 8 yo‘nalish mavzusi, mobil ko‘rinish, loyiha tafsilotlari, rezyume havolasi, rasmlarni kamaytirish, qoralama saqlash, JSON import/eksport, klaviatura fokusi, kamaytirilgan animatsiya, chop etish uslubi, 404 sahifa. Rangli tugma matni foniga qarab oq yoki qora bo‘ladi.

Login, bulutli saqlash, onlayn to‘lov, AI tarjima va bir tugma bilan internetga nashr qilish bu shablon tarkibiga kirmaydi. Bular uchun alohida xizmat kerak. Hozirgi sotiladigan xizmat: siz har bir xaridor uchun portfolioni tayyorlab, nashr qilib berasiz.
