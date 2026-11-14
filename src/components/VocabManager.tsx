import React, { useState } from 'react';
import { WordCard } from '../types';
import { CardIllustration } from './CardIllustration';
import { speech } from '../utils/speech';

interface VocabManagerProps {
  cards: WordCard[];
  onOpenAddModal: (mode?: 'single' | 'bulk') => void;
  onDeleteCard: (id: string) => void;
  onResetToDefaults: () => void;
}

export const VocabManager: React.FC<VocabManagerProps> = ({
  cards,
  onOpenAddModal,
  onDeleteCard,
  onResetToDefaults,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  // Categories list
  const categories = ['Все', ...Array.from(new Set(cards.map((c) => c.category || 'Без категории')))];

  // Filtered cards with defensive null checks
  const filteredCards = cards.filter((card) => {
    if (!card) return false;
    const cardCat = card.category || 'Без категории';
    const matchesCategory = selectedCategory === 'Все' || cardCat === selectedCategory;
    
    const wordStr = (card.word || '').toLowerCase();
    const transStr = (card.translation || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesQuery =
      !query ||
      wordStr.includes(query) ||
      transStr.includes(query) ||
      cardCat.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            Словарь фраз и команд
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Всего {cards.length} фраз с иллюстрациями, транскрипцией и озвучкой
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal('bulk')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            📋 Быстрая вставка списком
          </button>
          <button
            onClick={() => onOpenAddModal('single')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Добавить фразу</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по английскому слову или русскому значению..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-slate-600 font-medium">Ничего не найдено по запросу</p>
          <p className="text-xs text-slate-400 mt-1">Попробуйте изменить поисковый запрос или фильтр</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category & Action row */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-600 truncate max-w-[150px]">
                    {card.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-400 text-xs">{card.level}</span>
                    {card.isCustom && (
                      <button
                        onClick={() => onDeleteCard(card.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Удалить карточку"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Thumbnail Illustration */}
                <div className="mb-3">
                  <CardIllustration
                    theme={card.illustrationTheme}
                    imageUrl={card.imageUrl}
                    word={card.word}
                    className="w-full h-28 object-cover rounded-lg"
                  />
                </div>

                {/* Word & Audio */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display leading-snug">
                      {card.word}
                    </h3>
                    {card.transcription && (
                      <p className="text-xs font-mono text-slate-400">
                        {card.transcription}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => speech.speak(card.word)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Озвучить"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </div>

                {/* Translation */}
                <p className="text-xs font-medium text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {card.translation}
                </p>

                {/* Coaching Tip if present */}
                {card.ruleOrNote && (
                  <p className="text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50 mt-2">
                    💡 {card.ruleOrNote}
                  </p>
                )}
              </div>

              {/* Bottom info */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="italic">{card.partOfSpeech}</span>
                <div className="flex items-center gap-1">
                  <span>Прогресс:</span>
                  <span className="font-mono font-bold text-slate-700">{card.masteryScore}/5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Utility Strip */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs text-slate-500">
        <span>Показано: {filteredCards.length} из {cards.length}</span>
        <button
          onClick={onResetToDefaults}
          className="text-slate-400 hover:text-slate-700 cursor-pointer underline"
        >
          Восстановить базовый набор тренера
        </button>
      </div>
    </div>
  );
};
