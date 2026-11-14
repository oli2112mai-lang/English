import React, { useState, useEffect, useCallback } from 'react';
import { WordCard } from '../types';
import { CardIllustration } from './CardIllustration';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';

interface FlashcardDeckProps {
  cards: WordCard[];
  onUpdateScore: (cardId: string, newScore: number) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenAddModal: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  onUpdateScore,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenAddModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [autoPronounce, setAutoPronounce] = useState(false);
  const [audioMode, setAudioMode] = useState<string>(speech.getMode());

  // Filter cards by selected category
  const filteredCards = selectedCategory === 'Все'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleAudioModeChange = (newMode: 'auto' | 'native' | 'server') => {
    setAudioMode(newMode);
    speech.setMode(newMode);
    handlePronounce('Voice switched');
  };

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory]);

  const handlePronounce = useCallback(async (text: string) => {
    if (!text) return;
    try {
      setSpeakingText(text);
      await speech.speak(text);
    } catch (err) {
      console.warn('Speech playback error:', err);
    } finally {
      setSpeakingText(null);
    }
  }, []);

  // Auto pronounce only if user explicitly turned it on
  useEffect(() => {
    if (autoPronounce && currentCard && !isFlipped) {
      handlePronounce(currentCard.word);
    }
  }, [currentIndex, autoPronounce, currentCard, handlePronounce, isFlipped]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      // Loop or celebrate
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleReview = useCallback(() => {
    if (!currentCard) return;
    const newScore = Math.max(0, currentCard.masteryScore - 1);
    onUpdateScore(currentCard.id, newScore);
    handleNext();
  }, [currentCard, onUpdateScore, handleNext]);

  const handleMastered = useCallback(() => {
    if (!currentCard) return;
    const newScore = Math.min(5, currentCard.masteryScore + 1);
    onUpdateScore(currentCard.id, newScore);
    if (newScore === 5) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
    handleNext();
  }, [currentCard, onUpdateScore, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'Digit1') {
        e.preventDefault();
        handleReview();
      } else if (e.code === 'Digit2') {
        e.preventDefault();
        handleMastered();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleReview, handleMastered]);

  if (!currentCard || filteredCards.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="text-lg font-bold text-slate-800">В этой категории пока нет карточек</h3>
        <p className="text-sm text-slate-500 mt-2">Выберите другую категорию или добавьте свои фразы</p>
        <button
          onClick={onOpenAddModal}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 cursor-pointer"
        >
          + Добавить новые карточки
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / filteredCards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Category selector & settings bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Category Pills / Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Audio Toggle & Counter */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 shrink-0 self-end sm:self-auto">
          {/* Audio Engine Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => handleAudioModeChange('native')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                audioMode === 'native'
                  ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Системный встроенный голос (рекомендуется для iPhone и Android)"
            >
              📱 Телефон (iOS/Android)
            </button>
            <button
              type="button"
              onClick={() => handleAudioModeChange('server')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                audioMode === 'server'
                  ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Серверный MP3-звук"
            >
              🌐 MP3
            </button>
          </div>

          <button
            type="button"
            onClick={() => handlePronounce('Audio test, sound is working!')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              speakingText?.includes('Audio test')
                ? 'bg-indigo-600 text-white animate-pulse'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300'
            }`}
            title="Проверить вывод звука"
          >
            <span>🔊</span>
            <span>Тест звука</span>
          </button>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoPronounce}
              onChange={(e) => setAutoPronounce(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Авто</span>
          </label>

          <span className="font-mono tabular-nums font-semibold text-slate-700">
            {currentIndex + 1} / {filteredCards.length}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Flashcard 3D Perspective Box */}
      <div className="perspective-1000 w-full mb-6 min-h-[460px] cursor-pointer" onClick={handleFlip}>
        <div
          className={`relative w-full h-full min-h-[460px] rounded-2xl transition-transform duration-500 transform-style-3d shadow-md hover:shadow-lg border border-slate-200/80 bg-white ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE (English Word + Visual Picture + Audio + Metadata) */}
          <div className="absolute inset-0 backface-hidden p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-white">
            {/* Top row: Category tag & Mastery level */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-indigo-600">{currentCard.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">{currentCard.level}</span>
                {currentCard.partOfSpeech && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="italic text-slate-400">{currentCard.partOfSpeech}</span>
                  </>
                )}
              </div>

              {/* Mastery Stars */}
              <div className="flex items-center gap-1" title={`Уровень освоения: ${currentCard.masteryScore}/5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-2 h-2 rounded-full ${
                      star <= currentCard.masteryScore
                        ? 'bg-amber-400'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Middle: Visual Thematic Illustration */}
            <div className="my-3">
              <CardIllustration
                theme={currentCard.illustrationTheme}
                imageUrl={currentCard.imageUrl}
                word={currentCard.word}
                className="w-full h-44 sm:h-52 object-cover rounded-xl"
              />
            </div>

            {/* Bottom Section: Big English Word & Audio */}
            <div className="text-center py-2">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                  {currentCard.word}
                </h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePronounce(currentCard.word);
                  }}
                  className={`p-2.5 rounded-full text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer ${
                    speakingText === currentCard.word
                      ? 'ring-2 ring-indigo-500 bg-indigo-50 animate-pulse text-indigo-700'
                      : 'bg-slate-100/80 hover:bg-indigo-50'
                  }`}
                  title="Прослушать произношение"
                  aria-label="Прослушать произношение"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>
              </div>

              {currentCard.transcription && (
                <p className="text-sm font-mono text-slate-400 mt-1">
                  {currentCard.transcription}
                </p>
              )}

              <p className="text-xs text-indigo-500 font-medium mt-3 flex items-center justify-center gap-1">
                <span>Нажмите или нажмите [Пробел], чтобы увидеть перевод</span>
                <span>↻</span>
              </p>
            </div>
          </div>

          {/* BACK SIDE (Russian Translation + Example Sentence + Grammar Note) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 sm:p-8 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white">
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-indigo-300">Перевод и контекст</span>
              <span className="text-slate-400 font-mono text-xs">{currentCard.category}</span>
            </div>

            {/* Main Russian Translation */}
            <div className="my-auto text-center py-4">
              <span className="text-xs text-indigo-300 uppercase tracking-widest font-semibold block mb-1">
                Значение
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentCard.translation}
              </h3>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-xs text-indigo-200/90 font-medium">{currentCard.word}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePronounce(currentCard.word);
                  }}
                  className={`p-1 rounded-md text-indigo-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
                    speakingText === currentCard.word ? 'ring-2 ring-indigo-400 animate-pulse text-white' : ''
                  }`}
                  title="Озвучить оригинал"
                  aria-label="Озвучить оригинал"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                </button>
              </div>

              {/* Contextual Examples */}
              {currentCard.exampleEn && (
                <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-left max-w-xl mx-auto">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-emerald-300 leading-relaxed">
                      "{currentCard.exampleEn}"
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePronounce(currentCard.exampleEn);
                      }}
                      className={`p-1.5 rounded-lg shrink-0 cursor-pointer transition-all ${
                        speakingText === currentCard.exampleEn
                          ? 'bg-emerald-400/30 text-emerald-200 ring-2 ring-emerald-400 animate-pulse'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                      title="Озвучить пример"
                      aria-label="Озвучить пример"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                      </svg>
                    </button>
                  </div>
                  {currentCard.exampleRu && (
                    <p className="text-xs text-slate-300 mt-1 italic">
                      {currentCard.exampleRu}
                    </p>
                  )}
                </div>
              )}

              {/* Rule / Coaching note */}
              {currentCard.ruleOrNote && (
                <div className="mt-3 text-xs text-amber-200/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg max-w-xl mx-auto text-left">
                  <span className="font-semibold text-amber-300">💡 Подсказка тренера: </span>
                  {currentCard.ruleOrNote}
                </div>
              )}
            </div>

            {/* Flip back hint */}
            <div className="text-center text-xs text-slate-400">
              Нажмите для возврата к английскому слову ↻
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls Deck */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Previous Card */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`py-3 px-4 rounded-xl border border-slate-200 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            currentIndex === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              : 'bg-white text-slate-700 hover:bg-slate-50 active:scale-95'
          }`}
        >
          <span>←</span>
          <span>Назад</span>
        </button>

        {/* Needs Review / Repeat (1) */}
        <button
          onClick={handleReview}
          className="py-3 px-4 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Повторить</span>
          <span className="text-xs opacity-75 font-mono">[1]</span>
        </button>

        {/* Mastered / Know it (2) */}
        <button
          onClick={handleMastered}
          className="py-3 px-4 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Знаю!</span>
          <span className="text-xs opacity-75 font-mono">[2]</span>
        </button>

        {/* Next Card */}
        <button
          onClick={handleNext}
          className="py-3 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Дальше</span>
          <span>→</span>
        </button>
      </div>

      {/* Keyboard hints strip */}
      <div className="hidden sm:flex items-center justify-center gap-6 mt-6 text-xs text-slate-400">
        <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">Пробел</kbd> перевернуть</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">← / →</kbd> переход</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">1</kbd> повторить</span>
        <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">2</kbd> знаю</span>
      </div>
    </div>
  );
};
