import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Brain, Target, TrendingUp, Award } from 'lucide-react';
import { Deck } from '../App';

interface StatisticsProps {
  decks: Deck[];
}

export function Statistics({ decks }: StatisticsProps) {
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const totalReviews = decks.reduce(
    (sum, deck) => sum + deck.cards.reduce((s, card) => s + card.reviews, 0),
    0
  );

  const masteredCards = decks.reduce(
    (sum, deck) => sum + deck.cards.filter((card) => card.reviews >= 5).length,
    0
  );

  const dueCards = decks.reduce(
    (sum, deck) => sum + deck.cards.filter((card) => card.nextReview <= Date.now()).length,
    0
  );

  // Chart data - cards per deck
  const chartData = decks.map((deck) => ({
    name: deck.name.length > 15 ? deck.name.substring(0, 15) + '...' : deck.name,
    cards: deck.cards.length,
    color: deck.color,
  }));

  const stats = [
    {
      icon: Brain,
      label: 'Total Cards',
      value: totalCards,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      label: 'Cards Due',
      value: dueCards,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Award,
      label: 'Mastered',
      value: masteredCards,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      label: 'Total Reviews',
      value: totalReviews,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const masteryPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mastery progress */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Overall Mastery</h3>

        <div className="mb-2">
          <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 flex items-center justify-center transition-all duration-300"
              style={{ width: `${masteryPercentage}%` }}
            >
              {masteryPercentage > 10 && (
                <span className="text-white font-semibold text-sm">
                  {masteryPercentage.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          {masteredCards} of {totalCards} cards mastered (5+ reviews)
        </p>
      </div>

      {/* Cards per deck chart */}
      {decks.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Cards per Deck</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="cards" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#3b82f6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Deck details */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Deck Details</h3>

        {decks.length === 0 ? (
          <p className="text-gray-400">No decks created yet</p>
        ) : (
          <div className="space-y-3">
            {decks.map((deck) => {
              const deckDue = deck.cards.filter((card) => card.nextReview <= Date.now()).length;
              const deckMastered = deck.cards.filter((card) => card.reviews >= 5).length;
              const deckMastery =
                deck.cards.length > 0 ? (deckMastered / deck.cards.length) * 100 : 0;

              return (
                <div key={deck.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{deck.name}</h4>
                    <span className="text-sm text-gray-400">{deck.cards.length} cards</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-400">Due</p>
                      <p className="text-orange-400 font-semibold">{deckDue}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Mastered</p>
                      <p className="text-green-400 font-semibold">{deckMastered}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Progress</p>
                      <p className="text-blue-400 font-semibold">{deckMastery.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${deck.color}`}
                      style={{ width: `${deckMastery}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
