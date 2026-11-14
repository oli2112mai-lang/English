import React, { useState } from 'react';
import { GrammarCard } from '../types';
import { speech } from '../utils/speech';

interface GrammarDeckProps {
  cards: GrammarCard[];
}

export const GrammarDeck: React.FC<GrammarDeckProps> = ({ cards }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(cards[0]?.id || '');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const activeTopic = cards.find((c) => c.id === selectedTopicId) || cards[0];

  const handleSelectQuizAnswer = (cardId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [cardId]: optionIndex,
    }));
  };

  if (!activeTopic) return null;

  const currentQuizAnswer = quizAnswers[activeTopic.id];
  const isAnswered = currentQuizAnswer !== undefined;
  const isCorrect = isAnswered && currentQuizAnswer === activeTopic.quiz.correctIndex;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Topic selection buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => setSelectedTopicId(card.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap cursor-pointer transition-all ${
              selectedTopicId === card.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{idx + 1}. </span>
            <span>{card.title.split('(')[0].split('—')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* Main Grammar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-indigo-600">{activeTopic.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-500">{activeTopic.level}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {activeTopic.title}
            </h2>
          </div>
        </div>

        {/* Formula Box */}
        <div className="p-4 bg-slate-900 text-white rounded-xl mb-6">
          <span className="text-xs uppercase font-mono text-indigo-300 tracking-wider block mb-1">
            Грамматическая формула:
          </span>
          <p className="text-base sm:text-lg font-mono font-bold text-amber-300">
            {activeTopic.formula}
          </p>
        </div>

        {/* Explanation */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Объяснение правила:
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {activeTopic.explanation}
          </p>
          <div className="mt-3 p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-medium">
            <span className="font-bold">Ключевое правило: </span>
            {activeTopic.keyRule}
          </div>
        </div>

        {/* Examples Section with Audio */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Живые примеры с озвучкой:
          </h4>
          <div className="space-y-2.5">
            {activeTopic.examples.map((ex, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 flex items-center justify-between gap-3 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {ex.en}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ex.ru}
                  </p>
                </div>
                <button
                  onClick={() => speech.speak(ex.en)}
                  className="p-2 text-indigo-600 hover:bg-indigo-100/60 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Озвучить пример"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Common Pitfalls / Mistakes Table */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Частые ошибки (Как говорят и как НАДО):
          </h4>
          <div className="space-y-3">
            {activeTopic.commonMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <div className="text-xs">
                  <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded mb-1">
                    ✕ Ошибка:
                  </span>
                  <p className="line-through text-slate-500 font-medium">{mistake.wrong}</p>
                </div>
                <div className="text-xs">
                  <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded mb-1">
                    ✓ Верно:
                  </span>
                  <p className="text-slate-900 font-bold">{mistake.correct}</p>
                  <p className="text-slate-400 mt-1 italic">{mistake.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Mini-Test */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Мини-тест по правилу
          </span>
          <h4 className="text-base font-bold text-slate-900 mb-4">
            {activeTopic.quiz.question}
          </h4>

          <div className="space-y-2 mb-4">
            {activeTopic.quiz.options.map((option, idx) => {
              const isSelected = currentQuizAnswer === idx;
              let btnClass = 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400';

              if (isAnswered) {
                if (idx === activeTopic.quiz.correctIndex) {
                  btnClass = 'bg-emerald-50 text-emerald-900 border-emerald-500 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-rose-50 text-rose-900 border-rose-400';
                } else {
                  btnClass = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizAnswer(activeTopic.id, idx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {isAnswered && idx === activeTopic.quiz.correctIndex && (
                    <span className="text-emerald-600 font-bold ml-2">✓</span>
                  )}
                  {isAnswered && isSelected && idx !== activeTopic.quiz.correctIndex && (
                    <span className="text-rose-500 font-bold ml-2">✕</span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200">
              <div
                className={`p-3 rounded-xl text-xs flex-1 ${
                  isCorrect ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'
                }`}
              >
                <span className="font-bold">{isCorrect ? 'Правильно! ' : 'Не совсем! '}</span>
                {activeTopic.quiz.explanation}
              </div>
              <button
                onClick={() => {
                  setQuizAnswers((prev) => {
                    const copy = { ...prev };
                    delete copy[activeTopic.id];
                    return copy;
                  });
                }}
                className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer shrink-0 font-medium self-end sm:self-center"
              >
                Попробовать снова
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
