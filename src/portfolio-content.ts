// UI translations and field themes. Owner data lives in public/portfolio.json.
// Every text has Uzbek (uz), Russian (ru), and English (en) versions.
export type Language = 'uz' | 'ru' | 'en';
export type Translation = Record<Language, string>;
const tr = (uz: string, ru: string, en: string): Translation => ({ uz, ru, en });
export const fieldNames = {
  'computer-engineering': tr('Kompyuter muhandisligi', 'Компьютерная инженерия', 'Computer Engineering'),
  'it-business': tr('IT biznes', 'ИТ-бизнес', 'IT Business'),
  business: tr('Biznes boshqaruvi', 'Управление бизнесом', 'Business Administration'),
  'english-philology': tr('Ingliz filologiyasi', 'Английская филология', 'English Philology'),
  'korean-philology': tr('Koreys filologiyasi', 'Корейская филология', 'Korean Philology'),
  architecture: tr('Arxitektura', 'Архитектура', 'Architecture'),
  'civil-engineering': tr('Qurilish muhandisligi', 'Строительство', 'Civil Engineering'),
  'interior-design': tr('Interyer dizayni', 'Дизайн интерьера', 'Interior Design'),
};
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
