import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Check, Brain, RotateCcw } from 'lucide-react';
import { Deck, Flashcard } from '../App';

interface StudyModeProps {
  deck: Deck;
  onUpdateDeck: (deck: Deck) => void;
  onExit: () => void;
}

export function StudyMode({ deck, onUpdateDeck, onExit }: StudyModeProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  // Initialize study queue with due cards
  useEffect(() => {
    const dueCards = deck.cards.filter((card) => card.nextReview <= Date.now());
    if (dueCards.length > 0) {
      setStudyQueue(dueCards);
    } else {
      setStudyQueue(deck.cards);
    }
  }, [deck]);

  const currentCard = studyQueue[currentCardIndex];

  // Spaced repetition algorithm (SM-2)
  const calculateNextReview = (card: Flashcard, quality: number): Flashcard => {
    let { interval, easeFactor, reviews } = card;

    if (quality >= 3) {
      // Correct answer
      if (reviews === 0) {
        interval = 1; // 1 day
      } else if (reviews === 1) {
        interval = 6; // 6 days
      } else {
        interval = Math.round(interval * easeFactor);
      }

      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      easeFactor = Math.max(1.3, easeFactor);

      reviews += 1;
    } else {
      // Incorrect answer - reset
      interval = 1;
      reviews = 0;
    }

    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

    return {
      ...card,
      interval,
      easeFactor,
      reviews,
      nextReview,
    };
  };

  const handleAnswer = (quality: number) => {
    if (!currentCard) return;

    const updatedCard = calculateNextReview(currentCard, quality);

    // Update deck with new card data
    const updatedCards = deck.cards.map((c) => (c.id === currentCard.id ? updatedCard : c));

    onUpdateDeck({
      ...deck,
      cards: updatedCards,
    });

    // Update session stats
    if (quality >= 3) {
      setSessionStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setSessionStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    // Move to next card
    setIsFlipped(false);
    if (currentCardIndex < studyQueue.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Session complete
      alert(`Session complete!\n\nCorrect: ${sessionStats.correct + (quality >= 3 ? 1 : 0)}\nIncorrect: ${sessionStats.incorrect + (quality < 3 ? 1 : 0)}`);
      onExit();
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center py-20">
        <Brain className="w-24 h-24 text-gray-600 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-white mb-4">No cards to study</h2>
        <p className="text-gray-400 mb-6">All cards are up to date!</p>
        <button
          onClick={onExit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Decks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{deck.name}</h2>
          <p className="text-gray-400">
            Card {currentCardIndex + 1} of {studyQueue.length}
          </p>
        </div>

        <button
          onClick={onExit}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
          style={{ width: `${((currentCardIndex + 1) / studyQueue.length) * 100}%` }}
        />
      </div>

      {/* Session stats */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-green-900/20 border border-green-700 rounded-lg p-3 text-center">
          <p className="text-green-400 text-sm mb-1">Correct</p>
          <p className="text-2xl font-bold text-white">{sessionStats.correct}</p>
        </div>

        <div className="flex-1 bg-red-900/20 border border-red-700 rounded-lg p-3 text-center">
          <p className="text-red-400 text-sm mb-1">Incorrect</p>
          <p className="text-2xl font-bold text-white">{sessionStats.incorrect}</p>
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="perspective-1000 mb-6 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-80"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 flex items-center justify-center text-center shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div>
              <p className="text-sm text-blue-200 mb-4">QUESTION</p>
              <p className="text-2xl font-semibold text-white">{currentCard.front}</p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-8 flex items-center justify-center text-center shadow-xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div>
              <p className="text-sm text-green-200 mb-4">ANSWER</p>
              <p className="text-2xl font-semibold text-white">{currentCard.back}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Flip hint */}
      {!isFlipped && (
        <p className="text-center text-gray-400 mb-6 flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Click card to reveal answer
        </p>
      )}

      {/* Answer buttons */}
      {isFlipped && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(1)}
            className="px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Incorrect
          </button>

          <button
            onClick={() => handleAnswer(4)}
            className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Correct
          </button>
        </div>
      )}

      {/* Card info */}
      <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-400 text-sm">
          Reviews: <span className="text-white font-semibold">{currentCard.reviews}</span>
        </p>
        {currentCard.reviews > 0 && (
          <p className="text-gray-400 text-sm mt-1">
            Next review in:{' '}
            <span className="text-white font-semibold">
              {Math.round((currentCard.nextReview - Date.now()) / (24 * 60 * 60 * 1000))} days
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
