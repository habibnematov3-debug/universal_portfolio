import content from '../public/portfolio.json';
import { portfolioSchema } from './lib/portfolio-model';
export const publishedPortfolio = portfolioSchema.parse(content);
