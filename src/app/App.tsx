import { useState, useEffect } from 'react';
import { BookOpen, Search, Clock, Loader2 } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { WordDefinition } from './components/WordDefinition';
import { SearchHistory } from './components/SearchHistory';

// Free Dictionary API - No API key required!
const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export interface Phonetic {
  text: string;
  audio: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordData {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls: string[];
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dictionary-history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('dictionary-history', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const searchWord = async (word: string) => {
    if (!word.trim()) return;

    setLoading(true);
    setError(null);
    setWordData(null);

    try {
      const response = await fetch(`${API_BASE}/${word.toLowerCase()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError(`No definition found for "${word}"`);
        } else {
          setError('Something went wrong. Please try again.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setWordData(data[0]);

      // Add to search history (avoid duplicates)
      setSearchHistory((prev) => {
        const filtered = prev.filter((w) => w.toLowerCase() !== word.toLowerCase());
        return [word.toLowerCase(), ...filtered].slice(0, 10); // Keep last 10
      });
    } catch (err) {
      setError('Failed to fetch word definition');
      console.error('Dictionary API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (word: string) => {
    setSearchQuery(word);
    searchWord(word);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('dictionary-history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">WordWise</h1>
              <p className="text-gray-400 text-sm">Your English dictionary companion</p>
            </div>
          </div>

          {/* Search bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Word definition (2 columns) */}
          <div className="lg:col-span-2">
            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-16 h-16 text-blue-400 animate-spin mb-4" />
                <p className="text-white text-lg">Looking up "{searchQuery}"...</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
                <p className="text-red-400 text-lg mb-2">{error}</p>
                <p className="text-gray-400 text-sm">
                  Try checking the spelling or search for a different word
                </p>
              </div>
            )}

            {/* Word definition */}
            {wordData && !loading && <WordDefinition wordData={wordData} />}

            {/* Initial state */}
            {!wordData && !loading && !error && (
              <div className="text-center py-20">
                <Search className="w-24 h-24 text-blue-400 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Search for a word
                </h2>
                <p className="text-gray-400 mb-8">
                  Enter any English word to see its definition, pronunciation, synonyms, and
                  more
                </p>

                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-white font-semibold mb-3">Try searching for:</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['eloquent', 'serendipity', 'ephemeral', 'resilience', 'paradigm'].map(
                      (word) => (
                        <button
                          key={word}
                          onClick={() => handleSearch(word)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {word}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search history (1 column) */}
          <div>
            <SearchHistory
              history={searchHistory}
              onSelectWord={handleSearch}
              onClearHistory={clearHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}