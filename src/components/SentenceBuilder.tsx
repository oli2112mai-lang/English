import React, { useState } from 'react';
import { GrammarCard } from '../types';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';

interface SentenceBuilderProps {
  grammarCards: GrammarCard[];
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ grammarCards }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const currentCard = grammarCards[currentTaskIndex];
  const task = currentCard?.builderTask;

  // Selected words by user in order
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  // Remaining available words
  const [availableWords, setAvailableWords] = useState<string[]>(() => {
    return task ? shuffleArray(task.scrambledWords) : [];
  });

  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Switch task safely
  const selectTask = (index: number) => {
    const nextCard = grammarCards[index];
    if (nextCard && nextCard.builderTask) {
      setCurrentTaskIndex(index);
      setSelectedWords([]);
      setAvailableWords(shuffleArray(nextCard.builderTask.scrambledWords));
      setIsEvaluated(false);
      setIsCorrect(false);
      setShowHint(false);
    }
  };

  const handleWordClick = (word: string, fromSlot: boolean, indexInSlot: number) => {
    if (isEvaluated && isCorrect) return;

    if (fromSlot) {
      // Remove from selected, return to available
      const nextSelected = [...selectedWords];
      nextSelected.splice(indexInSlot, 1);
      setSelectedWords(nextSelected);
      setAvailableWords([...availableWords, word]);
    } else {
      // Add from available to selected
      const nextAvailable = [...availableWords];
      nextAvailable.splice(indexInSlot, 1);
      setAvailableWords(nextAvailable);
      setSelectedWords([...selectedWords, word]);
    }
    setIsEvaluated(false);
  };

  const handleResetCurrent = () => {
    if (!task) return;
    setSelectedWords([]);
    setAvailableWords(shuffleArray(task.scrambledWords));
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    if (!task) return;
    // Normalize punctuation except apostrophes in contractions (don't)
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[.,!?:;"]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const constructed = normalize(selectedWords.join(' '));
    const target = normalize(task.correctSentence);

    const correct = constructed === target;
    setIsEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      speech.speak(task.correctSentence);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTaskIndex + 1) % grammarCards.length;
    selectTask(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentTaskIndex - 1 + grammarCards.length) % grammarCards.length;
    selectTask(prevIndex);
  };

  if (!task) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Task Tabs Selector (Allows freely picking any sentence) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {grammarCards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => selectTask(idx)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              currentTaskIndex === idx
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Фраза {idx + 1}
          </button>
        ))}
      </div>

      {/* Task Navigator Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Грамматический тренажер
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            {currentCard.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-600 tabular-nums">
            {currentTaskIndex + 1} / {grammarCards.length}
          </span>
        </div>
      </div>

      {/* Main Assembly Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        {/* Target Russian Sentence */}
        <div className="mb-6 pb-4 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            Соберите английское предложение по переводу:
          </span>
          <p className="text-xl font-bold text-slate-900">
            «{task.targetRu}»
          </p>
        </div>

        {/* Selected Words Dropzone Slot */}
        <div className="min-h-[84px] p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-wrap items-center gap-2 mb-6">
          {selectedWords.length === 0 ? (
            <span className="text-sm text-slate-400 italic">
              Нажимайте на слова ниже, чтобы собрать предложение по порядку...
            </span>
          ) : (
            selectedWords.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                onClick={() => handleWordClick(word, true, idx)}
                className="px-3.5 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-sm shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>{word}</span>
                <span className="text-xs text-indigo-200">×</span>
              </button>
            ))
          )}
        </div>

        {/* Available Scrambled Words Pool */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">
              Доступные слова (нажмите, чтобы добавить в фразу):
            </span>
            <button
              onClick={handleResetCurrent}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Перемешать заново
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[48px]">
            {availableWords.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                onClick={() => handleWordClick(word, false, idx)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg text-sm hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation Banner */}
        {isEvaluated && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm flex items-start justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-rose-50 text-rose-900 border border-rose-300'
            }`}
          >
            <div>
              <p className="font-bold">
                {isCorrect ? '✓ Верно! Отличная сборка!' : '✕ Есть неточность в порядке слов'}
              </p>
              <p className="text-xs mt-1">
                Правильный вариант: <span className="font-semibold">{task.correctSentence}</span>
              </p>
            </div>
            {isCorrect && (
              <button
                onClick={() => speech.speak(task.correctSentence)}
                className="p-1.5 bg-emerald-200/60 rounded-lg hover:bg-emerald-300 transition-colors cursor-pointer shrink-0 text-emerald-900 font-medium text-xs flex items-center gap-1"
                title="Озвучить"
              >
                <span>🔊</span>
                <span>Слушать</span>
              </button>
            )}
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs mb-6">
            <span className="font-bold">💡 Подсказка: </span>
            {task.hint}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint((prev) => !prev)}
              className="px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-lg border border-amber-200 font-semibold cursor-pointer transition-colors"
            >
              {showHint ? 'Скрыть подсказку' : '💡 Подсказка'}
            </button>
            <button
              onClick={handleResetCurrent}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 font-semibold cursor-pointer transition-colors"
            >
              Сбросить
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              ← Предыдущая
            </button>
            {!isCorrect ? (
              <button
                onClick={handleCheck}
                disabled={selectedWords.length === 0}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-xs ${
                  selectedWords.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 cursor-pointer'
                }`}
              >
                Проверить
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                Следующее предложение →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
