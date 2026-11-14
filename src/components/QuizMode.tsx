import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { WordCard } from '../types';
import { CardIllustration } from './CardIllustration';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';

interface QuizModeProps {
  cards: WordCard[];
  onSwitchToCards?: () => void;
}

interface Question {
  card: WordCard;
  prompt: string;
  options: string[];
  correctAnswer: string;
  mode: 'en_to_ru' | 'ru_to_en';
}

// True Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  cards,
  onSwitchToCards,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [quizRound, setQuizRound] = useState(0); // Changes on restart to force question re-generation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakes, setMistakes] = useState<WordCard[]>([]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      speech.stop();
    };
  }, []);

  const categories = ['Все', ...Array.from(new Set(cards.map((c) => c.category)))];

  const poolCards = useMemo(() => {
    return selectedCategory === 'Все'
      ? cards
      : cards.filter((c) => c.category === selectedCategory);
  }, [cards, selectedCategory]);

  // Generate 10 randomized quiz questions safely with unique options
  const questions: Question[] = useMemo(() => {
    if (!poolCards || poolCards.length < 2) return [];

    const shuffled = shuffleArray(poolCards);
    const sliceCount = Math.min(10, shuffled.length);
    const selected = shuffled.slice(0, sliceCount);

    return selected.map((card, idx) => {
      // Alternate mode: 0, 2, 4 -> en_to_ru, 1, 3, 5 -> ru_to_en
      const mode: 'en_to_ru' | 'ru_to_en' = idx % 2 === 0 ? 'en_to_ru' : 'ru_to_en';

      if (mode === 'en_to_ru') {
        const otherCards = poolCards.filter((c) => c.id !== card.id && c.translation !== card.translation);
        // Ensure distinct translations
        const uniqueWrong = Array.from(new Set(otherCards.map((c) => c.translation)));
        const pickedWrong = shuffleArray(uniqueWrong).slice(0, 3);
        const options = shuffleArray([card.translation, ...pickedWrong]);

        return {
          card,
          prompt: card.word,
          options,
          correctAnswer: card.translation,
          mode,
        };
      } else {
        const otherCards = poolCards.filter((c) => c.id !== card.id && c.word !== card.word);
        // Ensure distinct English words
        const uniqueWrong = Array.from(new Set(otherCards.map((c) => c.word)));
        const pickedWrong = shuffleArray(uniqueWrong).slice(0, 3);
        const options = shuffleArray([card.word, ...pickedWrong]);

        return {
          card,
          prompt: card.translation,
          options,
          correctAnswer: card.word,
          mode,
        };
      }
    });
    // Include quizRound so restart creates a brand new quiz set!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolCards, quizRound]);

  const currentQ = questions[currentQuestionIndex];

  // Auto pronounce prompt if English
  useEffect(() => {
    if (currentQ && currentQ.mode === 'en_to_ru' && !isAnswered) {
      speech.speak(currentQ.prompt);
    }
  }, [currentQ, isAnswered]);

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      if (newStreak > 0 && newStreak % 5 === 0) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } else {
      setStreak(0);
      setMistakes((prev) => [...prev, currentQ.card]);
    }

    // Pronounce the English form
    const englishToSpeak = currentQ.mode === 'en_to_ru' ? currentQ.prompt : currentQ.correctAnswer;
    speech.speak(englishToSpeak);
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  }, [currentQuestionIndex, questions.length]);

  const handleRestart = () => {
    setQuizRound((r) => r + 1); // Triggers re-generation of questions!
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMistakes([]);
    setIsCompleted(false);
  };

  if (poolCards.length < 2) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <h3 className="text-xl font-bold text-slate-800">В этой категории недостаточно карточек для викторины</h3>
        <p className="text-sm text-slate-500 mt-2">Выберите категорию «Все» или добавьте новые карточки</p>
        <button
          onClick={() => setSelectedCategory('Все')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 cursor-pointer"
        >
          Переключить на все категории
        </button>
      </div>
    );
  }

  if (isCompleted) {
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            Викторина завершена!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Отличная тренировка спортивных команд и терминов
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {score} / {questions.length}
              </span>
              <span className="text-xs text-slate-500">Правильно</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold font-mono text-indigo-600 tabular-nums">
                {accuracy}%
              </span>
              <span className="text-xs text-slate-500">Точность</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-2xl font-bold font-mono text-amber-500 tabular-nums">
                {bestStreak}
              </span>
              <span className="text-xs text-slate-500">Лучшая серия</span>
            </div>
          </div>

          {/* Mistakes review if any */}
          {mistakes.length > 0 && (
            <div className="text-left mt-6 mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Слова для повторения ({mistakes.length}):
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {mistakes.map((card, idx) => (
                  <div
                    key={`${card.id}-${idx}`}
                    className="p-3 bg-red-50/60 border border-red-200 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{card.word}</span>
                      <span className="text-slate-500 ml-2">— {card.translation}</span>
                    </div>
                    <button
                      onClick={() => speech.speak(card.word)}
                      className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
                    >
                      Озвучить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              Пройти снова (новые вопросы)
            </button>
            {onSwitchToCards && (
              <button
                onClick={onSwitchToCards}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all cursor-pointer"
              >
                Вернуться к карточкам
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Category selector strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setQuizRound((r) => r + 1);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setScore(0);
              setStreak(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quiz Header: Progress + Streaks */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Вопрос</span>
          <span className="font-mono text-sm font-bold text-slate-800 tabular-nums">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-700 text-xs font-bold">
          <span>🔥 Серия:</span>
          <span className="font-mono tabular-nums">{streak}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-6">
        <div
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        {/* Category & Mode */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span className="font-semibold text-indigo-600">{currentQ.card.category}</span>
          <span>
            {currentQ.mode === 'en_to_ru' ? 'Выберите перевод на русский' : 'Выберите английскую команду'}
          </span>
        </div>

        {/* Illustration & Prompt Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
          <div className="md:col-span-1">
            <CardIllustration
              theme={currentQ.card.illustrationTheme}
              imageUrl={currentQ.card.imageUrl}
              word={currentQ.card.word}
              className="w-full h-36 object-cover rounded-xl"
            />
          </div>

          <div className="md:col-span-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
              {currentQ.prompt}
            </h3>
            {currentQ.mode === 'en_to_ru' && currentQ.card.transcription && (
              <p className="text-sm font-mono text-slate-400 mb-2">
                {currentQ.card.transcription}
              </p>
            )}
            <button
              onClick={() => speech.speak(currentQ.card.word)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>Послушать произношение</span>
            </button>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.correctAnswer;

            let buttonStyle = 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-50 text-emerald-900 border-emerald-500 font-bold ring-2 ring-emerald-400';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-rose-50 text-rose-900 border-rose-400 font-semibold';
              } else {
                buttonStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={`${option}-${idx}`}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`p-4 rounded-xl border text-left text-sm transition-all cursor-pointer flex items-center justify-between ${buttonStyle}`}
              >
                <span className="leading-snug">{option}</span>
                {isAnswered && isCorrect && (
                  <span className="text-emerald-600 font-bold ml-2">✓</span>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <span className="text-rose-500 font-bold ml-2">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Explanation */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              {currentQ.card.ruleOrNote && (
                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 mb-2">
                  <span className="font-semibold">💡 Совет: </span>
                  {currentQ.card.ruleOrNote}
                </p>
              )}
              {currentQ.card.exampleEn && (
                <p className="italic text-slate-500">
                  Пример: "{currentQ.card.exampleEn}"
                </p>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer whitespace-nowrap self-end sm:self-auto shrink-0"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос →' : 'Показать результаты →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
