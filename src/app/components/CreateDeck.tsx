import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Deck, Flashcard } from '../App';

interface CreateDeckProps {
  onCreateDeck: (deck: Omit<Deck, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const colors = [
  { name: 'Blue', value: 'from-blue-500 to-cyan-500' },
  { name: 'Purple', value: 'from-purple-500 to-pink-500' },
  { name: 'Green', value: 'from-green-500 to-emerald-500' },
  { name: 'Orange', value: 'from-orange-500 to-red-500' },
  { name: 'Yellow', value: 'from-yellow-500 to-orange-500' },
  { name: 'Teal', value: 'from-teal-500 to-blue-500' },
];

export function CreateDeck({ onCreateDeck, onCancel }: CreateDeckProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [cards, setCards] = useState<{ front: string; back: string }[]>([
    { front: '', back: '' },
  ]);

  const addCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const updateCard = (index: number, field: 'front' | 'back', value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validCards = cards.filter((card) => card.front.trim() && card.back.trim());

    if (!name.trim() || validCards.length === 0) {
      alert('Please provide a deck name and at least one card');
      return;
    }

    const flashcards: Flashcard[] = validCards.map((card, index) => ({
      id: `${Date.now()}-${index}`,
      front: card.front.trim(),
      back: card.back.trim(),
      nextReview: Date.now(),
      interval: 0,
      easeFactor: 2.5,
      reviews: 0,
    }));

    onCreateDeck({
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
      cards: flashcards,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Deck</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deck name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deck Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Spanish Vocabulary"
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this deck"
              className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
            <div className="grid grid-cols-6 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-12 rounded-lg bg-gradient-to-r ${color.value} ${
                    selectedColor === color.value ? 'ring-4 ring-white' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">Cards</label>
              <button
                type="button"
                onClick={addCard}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cards.map((card, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4 relative">
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-400 mb-1">Front (Question)</label>
                    <input
                      type="text"
                      value={card.front}
                      onChange={(e) => updateCard(index, 'front', e.target.value)}
                      placeholder="Enter question..."
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Back (Answer)</label>
                    <textarea
                      value={card.back}
                      onChange={(e) => updateCard(index, 'back', e.target.value)}
                      placeholder="Enter answer..."
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
