import type { PortfolioData, PortfolioProject } from './portfolio-model';
const tr = (uz: string, ru: string, en: string) => ({uz, ru, en});
const empty = () => tr('', '', '');
export const projectPrompts = {
  'computer-engineering': [tr('Texnik muammo', 'Техническая задача', 'Technical challenge'), tr('Arxitektura va texnologiyalar', 'Архитектура и технологии', 'Architecture & technologies'), tr('Sinovlar va ishonchlilik', 'Тестирование и надёжность', 'Testing & reliability')],
  'it-business': [tr('Biznes ehtiyoji', 'Бизнес-потребность', 'Business need'), tr('Talablar va jarayon', 'Требования и процесс', 'Requirements & workflow'), tr('Muvaffaqiyat mezonlari', 'Критерии успеха', 'Success criteria')],
  business: [tr('Bozor va auditoriya', 'Рынок и аудитория', 'Market & audience'), tr('Tahlil va strategiya', 'Анализ и стратегия', 'Analysis & strategy'), tr('Natijalar va dalillar', 'Результаты и доказательства', 'Results & evidence')],
  'english-philology': [tr('Matn turi va auditoriya', 'Тип текста и аудитория', 'Text type & audience'), tr('Til va uslub', 'Язык и стиль', 'Language & style'), tr('Tarjima yoki tahlil namunasi', 'Пример перевода или анализа', 'Translation or analysis sample')],
  'korean-philology': [tr('Til juftligi va matn', 'Языковая пара и текст', 'Language pair & text'), tr('Madaniy kontekst', 'Культурный контекст', 'Cultural context'), tr('Tarjima tanlovlari', 'Переводческие решения', 'Translation choices')],
  architecture: [tr('Joylashuv va maydon', 'Место и площадь', 'Location & area'), tr('Konsepsiya va vazifa', 'Концепция и задача', 'Concept & brief'), tr('Chizmalar va materiallar', 'Чертежи и материалы', 'Drawings & materials')],
  'civil-engineering': [tr('Konstruksiya va ko‘lam', 'Конструкция и масштаб', 'Structure & scope'), tr('Hisoblash usuli', 'Метод расчёта', 'Calculation method'), tr('Tekshiruv va cheklovlar', 'Проверки и ограничения', 'Verification & constraints')],
  'interior-design': [tr('Makon va mijoz vazifasi', 'Пространство и задача клиента', 'Space & client brief'), tr('Material va ranglar', 'Материалы и цвета', 'Materials & palette'), tr('Reja va yoritish', 'Планировка и освещение', 'Layout & lighting')],
};
export function createProject(field: PortfolioData['field'], id: string = crypto.randomUUID()): PortfolioProject {
  return {id,year:String(new Date().getFullYear()),image:'',url:'',tags:[],title:empty(),category:empty(),summary:empty(),contribution:empty(),result:empty(),visible:true,featured:false,details:projectPrompts[field].map(label => ({label:{...label},value:empty()})),gallery:[]};
}
export function duplicateProject(project: PortfolioProject, id: string = crypto.randomUUID()): PortfolioProject {
  return {...structuredClone(project),id,featured:false,visible:false};
}
