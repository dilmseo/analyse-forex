export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  category: string;
  description: string;
}

export interface ApiKeyConfig {
  key: string;
  lastUpdated: string;
}

export type Language = 'en' | 'fr';

export interface LanguageConfig {
  value: Language;
  label: string;
  flag: string;
}