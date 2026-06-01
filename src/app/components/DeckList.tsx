import { Trash2, Play, Calendar } from 'lucide-react';
import { Deck } from '../App';

interface DeckListProps {
  decks: Deck[];
  onStartStudying: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
}

export function DeckList({ decks, onStartStudying, onDeleteDeck }: DeckListProps) {
  if (decks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">No decks yet</p>
        <p className="text-gray-500">Create your first deck to start learning!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => {
        const dueCards = deck.cards.filter((card) => card.nextReview <= Date.now()).length;
        const masteredCards = deck.cards.filter((card) => card.reviews >= 5).length;

        return (
          <div
            key={deck.id}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all"
          >
            {/* Color header */}
            <div className={`h-3 bg-gradient-to-r ${deck.color}`} />

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{deck.name}</h3>
              <p className="text-gray-400 mb-4">{deck.description}</p>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Cards:</span>
                  <span className="text-white font-semibold">{deck.cards.length}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Due Today:</span>
                  <span className="text-orange-400 font-semibold">{dueCards}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Mastered:</span>
                  <span className="text-green-400 font-semibold">{masteredCards}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{
                      width: `${deck.cards.length > 0 ? (masteredCards / deck.cards.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onStartStudying(deck)}
                  disabled={deck.cards.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Study
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete deck "${deck.name}"?`)) {
                      onDeleteDeck(deck.id);
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
