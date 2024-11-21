import React, { useState, useEffect } from 'react';
import { parseNewsXML } from './utils/parser';
import { analyzeNewsItem } from './utils/openai';
import { NewsItem as NewsItemType, ApiKeyConfig as ApiKeyConfigType, Language } from './types/news';
import ApiKeyConfigComponent from './components/ApiKeyConfig';
import LanguageSelector from './components/LanguageSelector';
import NewsItem from './components/NewsItem';
import ProgressBar from './components/ProgressBar';
import { AlertTriangle, Scan, RefreshCcw } from 'lucide-react';

const DEMO_XML = `<item>
    <title><![CDATA[US existing home sales for October 3.96M versus 3.93M]]></title>
    <comments>https://www.forexlive.com/news/us-existing-home-sales-for-october-396m-versus-393m-20241121/#respond</comments>
    <pubDate>Thu, 21 Nov 2024 15:00:21 GMT</pubDate>
    <dc:creator><![CDATA[Greg Michalowski]]></dc:creator>
    <category><![CDATA[News]]></category>
    <guid isPermaLink="true">https://www.forexlive.com/news/us-existing-home-sales-for-october-396m-versus-393m-20241121/</guid>
    <link>https://www.forexlive.com/news/us-existing-home-sales-for-october-396m-versus-393m-20241121/</link>
    <description><![CDATA[<ul><li>Prior month 3.84M revised to 3.83M</li><li>October sales 3.96M vs 3.93M estimate</li><li>Median price $407,200, up 4% YoY</li><li>Inventory 4.2 months</li></ul>]]></description>
</item>`;

function App() {
  const [newsItems, setNewsItems] = useState<NewsItemType[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, string>>({});
  const [apiConfig, setApiConfig] = useState<ApiKeyConfigType | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDemo();
  }, []);

  const loadDemo = async () => {
    setIsRefreshing(true);
    try {
      const items = await parseNewsXML(`<?xml version="1.0" encoding="UTF-8"?><rss><channel>${DEMO_XML}</channel></rss>`);
      setNewsItems(items);
    } catch (err) {
      setError('Failed to load demo data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiConfig({
      key,
      lastUpdated: new Date().toISOString()
    });
    setError(null);
  };

  const handleAnalyze = async (item: NewsItemType) => {
    if (!apiConfig?.key) {
      setError('Please configure your OpenAI API key first');
      return;
    }

    try {
      const analysis = await analyzeNewsItem(
        apiConfig.key,
        item,
        language
      );
      setAnalyses(prev => ({
        ...prev,
        [item.link]: analysis
      }));
    } catch (err) {
      setError('Failed to analyze news item. Please check your API key.');
    }
  };

  const handleScanAll = async () => {
    if (!apiConfig?.key) {
      setError('Please configure your OpenAI API key first');
      return;
    }

    setIsScanning(true);
    setError(null);
    setProgress(0);

    try {
      const highImpactNews = newsItems.filter(item => {
        const content = `${item.title} ${item.description}`.toLowerCase();
        return content.includes('fed') || 
               content.includes('gdp') || 
               content.includes('inflation') ||
               content.includes('employment') ||
               content.includes('interest rate') ||
               content.includes('fomc') ||
               content.includes('cpi') ||
               content.includes('nfp') ||
               content.includes('pmi') ||
               content.includes('retail sales') ||
               content.includes('trade balance');
      });

      if (highImpactNews.length === 0) {
        setError('No high-impact news found in the current feed.');
        setIsScanning(false);
        return;
      }

      for (let i = 0; i < highImpactNews.length; i++) {
        const item = highImpactNews[i];
        const analysis = await analyzeNewsItem(
          apiConfig.key,
          item,
          language
        );
        setAnalyses(prev => ({
          ...prev,
          [item.link]: analysis
        }));
        setProgress(((i + 1) / highImpactNews.length) * 100);
      }
    } catch (err) {
      setError('Failed to scan news items. Please check your API key.');
    } finally {
      setIsScanning(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Trading News Analyzer
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSelector selected={language} onSelect={setLanguage} />
            <button
              onClick={loadDemo}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Feed
            </button>
          </div>
        </div>

        <ApiKeyConfigComponent onSave={handleSaveApiKey} config={apiConfig} />

        <div className="relative mb-6">
          <button
            onClick={handleScanAll}
            disabled={isScanning || !apiConfig?.key}
            className={`w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg transition-all transform hover:scale-[1.02] ${
              isScanning || !apiConfig?.key 
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning ? 'Analyzing High-Impact News...' : 'Scan High-Impact News'}
          </button>
          {isScanning && <ProgressBar progress={progress} />}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 text-red-700 rounded-lg animate-fadeIn">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {newsItems.map(item => (
            <NewsItem
              key={item.link}
              item={item}
              onAnalyze={handleAnalyze}
              analysis={analyses[item.link]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;