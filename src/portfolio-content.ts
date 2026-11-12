// Edit this file to change the owner. Publish your changes to update the public link.
// Every text has Uzbek (uz), Russian (ru), and English (en) versions.
export type Language = 'uz' | 'ru' | 'en';
export type Translation = Record<Language, string>;
const tr = (uz: string, ru: string, en: string): Translation => ({ uz, ru, en });
export const themes = {
  'computer-engineering': { accent: '#315d4d', paper: '#f2f3ed', style: 'technical' },
  'it-business': { accent: '#405ba0', paper: '#f2f4fa', style: 'technical' },
  business: { accent: '#7e4a2f', paper: '#f6f2ea', style: 'classic' },
  'english-philology': { accent: '#704b71', paper: '#f8f2f4', style: 'editorial' },
  'korean-philology': { accent: '#924d4b', paper: '#faf3ee', style: 'editorial' },
  architecture: { accent: '#805740', paper: '#f5f2eb', style: 'editorial' },
  'civil-engineering': { accent: '#335d83', paper: '#eef3f6', style: 'technical' },
  'interior-design': { accent: '#777044', paper: '#f5f3e9', style: 'editorial' },
} as const;
export const portfolio = {
  defaultLanguage: 'uz' as Language,
  field: 'computer-engineering' as keyof typeof themes,
  // Optional overrides, e.g. accent: '#6854a3', paper: '#faf8f4'.
  appearance: { accent: '', paper: '', font: '' },
  demo: true, // Set false after replacing the illustrative content below.
  name: tr('Ismingiz Familiyangiz', 'Ваше имя', 'Your name'),
  initials: 'YN',
  photo: '', // Public image URL or a path relative to public/, e.g. 'portrait.jpg'.
  email: '',
  resume: '', // e.g. 'resume.pdf', placed in public/.
  links: [] as { label: string; url: string }[],
  available: true,
  role: tr('Kompyuter muhandisligi talabasi', 'Студент компьютерной инженерии', 'Computer engineering student'),
  headline: tr('G‘oyalarni foydali mahsulotlarga aylantiraman.', 'Превращаю идеи в полезные продукты.', 'Turning ideas into useful things.'),
  intro: tr('Dizayn, dasturlash va kundalik muammolar uchun sodda yechimlar. Bu yerda mening ishlarim bilan tanishing.', 'Дизайн, разработка и простые решения повседневных задач. Здесь можно познакомиться с моими работами.', 'Design, development, and simple solutions to everyday problems. A collection of the things I build and learn.'),
  location: tr('Toshkent, O‘zbekiston', 'Ташкент, Узбекистан', 'Tashkent, Uzbekistan'),
  about: tr('Men texnologiya yordamida odamlarning hayotini yengillashtirishni istayman. Muammoni tushunishdan boshlayman, g‘oyalarni sinab ko‘raman va tafsilotlarga e’tibor beraman. Bu namunaviy matnni o‘z hikoyangiz bilan almashtiring.', 'Мне интересно, как технологии могут облегчить жизнь людей. Я начинаю с понимания задачи, проверяю идеи и уделяю внимание деталям. Замените этот пример своей историей.', 'I am interested in how technology can make life a little easier. I start by understanding the problem, test ideas, and pay attention to the details. Replace this example with your own story.'),
  skills: ['React', 'TypeScript', 'Figma', 'Python'],
  experience: [{
    period: '2023 — 2027',
    title: tr('Bakalavriat · namunaviy yozuv', 'Бакалавриат · пример', 'Bachelor’s degree · example'),
    organization: tr('Universitetingiz nomi', 'Название вашего университета', 'Your university'),
    description: tr('Ta’lim yo‘nalishingiz, amaliyot yoki ish tajribangiz haqida yozing.', 'Расскажите о своей специальности, стажировке или опыте работы.', 'Describe your studies, internship, or work experience.'),
  }],
  projects: [
    {
      id: '01', year: '2026', image: '', url: '', tags: ['React', 'TypeScript'],
      title: tr('Kampus uchun yangi qarash', 'Новый взгляд на кампус', 'A fresh take on campus'),
      category: tr('Veb-ilova · namuna', 'Веб-приложение · пример', 'Web application · example'),
      summary: tr('Talabalar uchun tadbirlarni topish va rejalashtirish g‘oyasi.', 'Концепция поиска и планирования мероприятий для студентов.', 'A concept for helping students discover and plan campus events.'),
      contribution: tr('O‘z vazifangizni yozing: tadqiqot, interfeys yoki dasturlash.', 'Опишите свою роль: исследование, интерфейс или разработка.', 'Describe your contribution: research, interface design, or development.'),
      result: tr('Natijalar, o‘rganganlaringiz va haqiqiy loyiha havolasini qo‘shing.', 'Добавьте результаты, выводы и ссылку на реальный проект.', 'Add the outcome, what you learned, and a link to the real project.'),
    },
    {
      id: '02', year: '2026', image: '', url: '', tags: ['Figma', 'UX'],
      title: tr('Kundalik hayot, soddaroq', 'Повседневность проще', 'Everyday life, simplified'),
      category: tr('Mahsulot dizayni · namuna', 'Дизайн продукта · пример', 'Product design · example'),
      summary: tr('Kundalik vazifalarni tartibga solish uchun sokin va qulay interfeys.', 'Спокойный и удобный интерфейс для повседневных задач.', 'A calm, considered interface for organizing everyday tasks.'),
      contribution: tr('Jarayoningiz va aynan siz bajargan ishni tushuntiring.', 'Расскажите о процессе и о том, что сделали лично вы.', 'Explain your process and the work you personally completed.'),
      result: tr('Sinovlar va foydalanuvchilardan olingan haqiqiy fikrlarni yozing.', 'Опишите тестирование и реальные отзывы пользователей.', 'Describe your testing and actual user feedback.'),
    },
  ],
};
export const ui = {
  work: tr('Loyihalar', 'Проекты', 'Work'), about: tr('Men haqimda', 'Обо мне', 'About'), contact: tr('Aloqa', 'Контакты', 'Contact'),
  available: tr('Yangi imkoniyatlarga ochiqman', 'Открыт к предложениям', 'Open to opportunities'),
  viewWork: tr('Ishlarimni ko‘rish', 'Смотреть работы', 'Explore my work'), resume: tr('Rezyume', 'Резюме', 'Résumé'),
  selected: tr('Tanlangan ishlar', 'Избранные работы', 'Selected work'),
  workIntro: tr('G‘oyadan amaliy yechimgacha.', 'От идеи к работающему решению.', 'From a first idea to something real.'),
  details: tr('Loyiha tafsilotlari', 'Подробнее о проекте', 'Inside the project'),
  contribution: tr('Mening hissam', 'Мой вклад', 'My contribution'), result: tr('Natija va xulosalar', 'Результат и выводы', 'Outcome & learning'),
  visit: tr('Loyihani ochish', 'Открыть проект', 'Visit project'),
  skills: tr('Ko‘nikmalar', 'Навыки', 'Skills & tools'), journey: tr('Ta’lim va tajriba', 'Образование и опыт', 'Education & experience'),
  together: tr('Birga yaxshi ishlar qilamiz.', 'Давайте создадим что-то вместе.', 'Let’s make something worthwhile.'),
  hello: tr('Bog‘lanish', 'Написать мне', 'Say hello'),
  noContact: tr('Aloqa ma’lumotlari tez orada qo‘shiladi.', 'Контактные данные скоро появятся.', 'Contact details coming soon.'),
  demo: tr('Namunaviy portfolio · matn va loyihalarni o‘zingiznikiga almashtiring', 'Пример портфолио · замените тексты и проекты своими', 'Sample portfolio · replace the content with your own'),
  skip: tr('Asosiy mazmunga o‘tish', 'Перейти к содержимому', 'Skip to content'),
  language: tr('Til', 'Язык', 'Language'), top: tr('Yuqoriga', 'Наверх', 'Back to top'),
};
