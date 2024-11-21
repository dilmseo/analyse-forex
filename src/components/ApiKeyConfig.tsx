import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import type { ApiKeyConfig } from '../types/news';

interface Props {
  onSave: (key: string) => void;
  config: ApiKeyConfig | null;
}

const ApiKeyConfig = ({ onSave, config }: Props) => {
  const [key, setKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
      setIsEditing(false);
      setKey('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">API Configuration</h2>
        </div>
        {config && (
          <span className="text-sm text-gray-500">
            Last updated: {new Date(config.lastUpdated).toLocaleString()}
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your OpenAI API key"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {config ? 'Update API Key' : 'Add API Key'}
        </button>
      )}
    </div>
  );
};

export default ApiKeyConfig;