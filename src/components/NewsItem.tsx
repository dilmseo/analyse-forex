import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import type { NewsItem as NewsItemType } from '../types/news';

interface Props {
  item: NewsItemType;
  onAnalyze: (item: NewsItemType) => void;
  analysis: string | null;
}

export default function NewsItem({ item, onAnalyze, analysis }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                {new Date(item.pubDate).toLocaleString()}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                {item.creator}
              </span>
              <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                {item.category}
              </span>
            </div>
          </div>
          <button
            onClick={() => onAnalyze(item)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
          >
            <Zap className="w-4 h-4" />
            Analyze
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mt-2 group"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          )}
          {isExpanded ? 'Show less' : 'Show more'}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            {analysis && (
              <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-gray-900">Analysis</h4>
                <div className="whitespace-pre-wrap text-gray-700">{analysis}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}