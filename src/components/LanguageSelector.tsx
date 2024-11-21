import React from 'react';
import { Globe2 } from 'lucide-react';
import { Language, LanguageConfig } from '../types/news';
import { languages } from '../utils/languages';

interface Props {
  selected: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSelector = ({ selected, onSelect }: Props) => {
  const selectedLang = languages.find(l => l.value === selected) as LanguageConfig;

  return (
    <div className="flex items-center gap-2">
      <Globe2 className="w-4 h-4 text-gray-600" />
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value as Language)}
        className="bg-transparent text-sm text-gray-600 border-none focus:ring-0 cursor-pointer hover:text-gray-900 transition-colors"
      >
        {languages.map(lang => (
          <option key={lang.value} value={lang.value}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;