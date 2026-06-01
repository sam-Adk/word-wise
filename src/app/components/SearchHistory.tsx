import { Clock, Trash2 } from 'lucide-react';

interface SearchHistoryProps {
  history: string[];
  onSelectWord: (word: string) => void;
  onClearHistory: () => void;
}

export function SearchHistory({ history, onSelectWord, onClearHistory }: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Search History</h3>
        </div>
        <p className="text-gray-400 text-sm">Your recent searches will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Search History</h3>
        </div>

        <button
          onClick={onClearHistory}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {history.map((word, index) => (
          <button
            key={index}
            onClick={() => onSelectWord(word)}
            className="w-full text-left px-4 py-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-white capitalize">{word}</span>
              <span className="text-gray-500 text-xs group-hover:text-gray-400">
                Click to search
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
