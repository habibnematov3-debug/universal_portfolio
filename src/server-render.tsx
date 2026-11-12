import { renderToString } from 'react-dom/server';
import PersonalPortfolio from './components/PersonalPortfolio';
import { publishedPortfolio } from './published-portfolio';
import { readiness } from './lib/portfolio-model';
export const data = publishedPortfolio;
export const issues = readiness(data);
export function render() { return renderToString(<PersonalPortfolio data={data} />); }
