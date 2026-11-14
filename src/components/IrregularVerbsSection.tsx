import React, { useState, useMemo } from 'react';
import { IrregularVerb, VerbPatternGroup } from '../types';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';

interface IrregularVerbsSectionProps {
  verbs: IrregularVerb[];
}

type VerbSubMode = 'reference' | 'trainer';
type TrainerInputMode = 'choice' | 'typing';

const PATTERN_INFO: Record<VerbPatternGroup, { label: string; desc: string; badgeClass: string }> = {
  AAA: {
    label: 'AAA · Все 3 равны',
    desc: 'V1 = V2 = V3 (let — let — let)',
    badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  ABB: {
    label: 'ABB · V2 = V3',
    desc: '2-я и 3-я формы совпадают (keep — kept — kept)',
    badgeClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  ABA: {
    label: 'ABA · V1 = V3',
    desc: '1-я и 3-я формы совпадают (run — ran — run)',
    badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  ABC: {
    label: 'ABC · Все разные',
    desc: 'Все 3 формы уникальны (do — did — done)',
    badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
  },
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const IrregularVerbsSection: React.FC<IrregularVerbsSectionProps> = ({ verbs }) => {
  const [subMode, setSubMode] = useState<VerbSubMode>('reference');
  const [selectedPattern, setSelectedPattern] = useState<'ALL' | VerbPatternGroup>('ALL');
  const [onlyCoaching, setOnlyCoaching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Trainer state
  const [trainerInputMode, setTrainerInputMode] = useState<TrainerInputMode>('choice');
  const [trainerOrder, setTrainerOrder] = useState<IrregularVerb[]>(() => shuffleArray(verbs));
  const [trainerIndex, setTrainerIndex] = useState(0);
  const [typedV2, setTypedV2] = useState('');
  const [typedV3, setTypedV3] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);

  const filteredVerbs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return verbs.filter((v) => {
      if (selectedPattern !== 'ALL' && v.pattern !== selectedPattern) return false;
      if (onlyCoaching && !v.isCoachingRelevant) return false;
      if (!q) return true;
      return (
        v.v1.toLowerCase().includes(q) ||
        v.v2.toLowerCase().includes(q) ||
        v.v3.toLowerCase().includes(q) ||
        v.translation.toLowerCase().includes(q)
      );
    });
  }, [verbs, selectedPattern, onlyCoaching, searchQuery]);

  const handleSpeak = async (id: string, text: string) => {
    setSpeakingId(id);
    try {
      await speech.speak(text);
    } finally {
      setSpeakingId(null);
    }
  };

  // Trainer current verb & distractors
  const currentVerb = trainerOrder[trainerIndex] || verbs[0];

  const choiceOptions = useMemo(() => {
    if (!currentVerb) return [];
    const correctPair = `${currentVerb.v2} — ${currentVerb.v3}`;
    const others = verbs.filter((v) => v.id !== currentVerb.id);
    const samePattern = others.filter((v) => v.pattern === currentVerb.pattern);
    const pool = samePattern.length >= 3 ? samePattern : others;
    const picked = shuffleArray(pool)
      .slice(0, 3)
      .map((v) => `${v.v2} — ${v.v3}`);

    // Also include a classic trap option (e.g. V1 + -ed) if possible
    const uniqueOptions = Array.from(new Set([correctPair, ...picked]));
    return shuffleArray(uniqueOptions);
  }, [currentVerb, verbs]);

  const handleCheckTyping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVerb || isChecked) return;

    const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ');
    const v2Ok = currentVerb.v2
      .split('/')
      .map((s) => norm(s))
      .includes(norm(typedV2)) || norm(typedV2) === norm(currentVerb.v2);
    const v3Ok = norm(typedV3) === norm(currentVerb.v3);

    const passed = v2Ok && v3Ok;
    setIsChecked(true);
    setIsCorrect(passed);

    if (passed) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak % 5 === 0) {
        confetti({ particleCount: 45, spread: 65, origin: { y: 0.65 } });
      }
    } else {
      setStreak(0);
    }

    handleSpeak(currentVerb.id, `${currentVerb.v1}, ${currentVerb.v2}, ${currentVerb.v3}`);
  };

  const handleSelectChoice = (option: string) => {
    if (!currentVerb || isChecked) return;
    const correctPair = `${currentVerb.v2} — ${currentVerb.v3}`;
    const passed = option === correctPair;

    setSelectedChoice(option);
    setIsChecked(true);
    setIsCorrect(passed);

    if (passed) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak % 5 === 0) {
        confetti({ particleCount: 45, spread: 65, origin: { y: 0.65 } });
      }
    } else {
      setStreak(0);
    }

    handleSpeak(currentVerb.id, `${currentVerb.v1}, ${currentVerb.v2}, ${currentVerb.v3}`);
  };

  const handleNextTrainer = () => {
    if (trainerIndex < trainerOrder.length - 1) {
      setTrainerIndex((prev) => prev + 1);
    } else {
      setTrainerOrder(shuffleArray(verbs));
      setTrainerIndex(0);
    }
    setTypedV2('');
    setTypedV3('');
    setSelectedChoice(null);
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Неправильные глаголы (V1 — V2 — V3)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Сгруппированы по моделям запоминания ({verbs.length} глаголов с озвучкой и примерами для зала и работы)
          </p>
        </div>

        {/* Sub-mode segmented switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSubMode('reference')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              subMode === 'reference'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Таблица и карточки
          </button>
          <button
            onClick={() => setSubMode('trainer')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              subMode === 'trainer'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Тренажер форм
          </button>
        </div>
      </div>

      {subMode === 'reference' ? (
        <>
          {/* Filter & Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 space-y-4 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск глагола (например: keep, held, сделать, держать)..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filter toggle for coaching/club verbs */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={onlyCoaching}
                  onChange={(e) => setOnlyCoaching(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Только ключевые для клуба и тренировок</span>
              </label>
            </div>

            {/* Pattern Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedPattern('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedPattern === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Все модели ({verbs.length})
              </button>
              {(['AAA', 'ABB', 'ABA', 'ABC'] as VerbPatternGroup[]).map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    selectedPattern === pattern
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={PATTERN_INFO[pattern].desc}
                >
                  {PATTERN_INFO[pattern].label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Pattern Explanation Banner */}
          {selectedPattern !== 'ALL' && (
            <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs sm:text-sm text-indigo-900 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold">Схема запоминания {selectedPattern}: </span>
                <span>{PATTERN_INFO[selectedPattern].desc}</span>
              </div>
            </div>
          )}

          {/* Verbs Grid */}
          {filteredVerbs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-600 font-semibold">Глаголы не найдены</p>
              <p className="text-xs text-slate-400 mt-1">Попробуйте сбросить поиск или фильтр модели</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVerbs.map((verb) => {
                const isSpeakingAll = speakingId === `all-${verb.id}`;

                return (
                  <div
                    key={verb.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Metadata Row (No pill clutter, clean separator) */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-bold text-slate-900 text-sm">{verb.translation}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-xs text-indigo-600 font-semibold">{verb.pattern}</span>
                        </div>

                        <button
                          onClick={() => handleSpeak(`all-${verb.id}`, `${verb.v1}, ${verb.v2}, ${verb.v3}`)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                            isSpeakingAll
                              ? 'bg-indigo-600 text-white animate-pulse'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                          title="Озвучить все три формы"
                        >
                          <span>🔊</span>
                          <span>3 формы</span>
                        </button>
                      </div>

                      {/* V1 - V2 - V3 Interactive Columns */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => handleSpeak(`v1-${verb.id}`, verb.v1)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            speakingId === `v1-${verb.id}`
                              ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300'
                              : 'bg-slate-50 border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/40'
                          }`}
                          title="Нажмите, чтобы прослушать V1"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            V1 · Наст.
                          </span>
                          <span className="text-base font-extrabold text-slate-900 font-display block mt-0.5">
                            {verb.v1}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 block truncate">
                            {verb.transcriptionV1}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSpeak(`v2-${verb.id}`, verb.v2)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            speakingId === `v2-${verb.id}`
                              ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300'
                              : 'bg-indigo-50/40 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}
                          title="Нажмите, чтобы прослушать V2"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
                            V2 · Прош.
                          </span>
                          <span className="text-base font-extrabold text-indigo-700 font-display block mt-0.5">
                            {verb.v2}
                          </span>
                          <span className="text-[11px] font-mono text-indigo-400 block truncate">
                            {verb.transcriptionV2}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSpeak(`v3-${verb.id}`, verb.v3)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            speakingId === `v3-${verb.id}`
                              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                              : 'bg-emerald-50/40 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50'
                          }`}
                          title="Нажмите, чтобы прослушать V3"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                            V3 · Прич.
                          </span>
                          <span className="text-base font-extrabold text-emerald-700 font-display block mt-0.5">
                            {verb.v3}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-500 block truncate">
                            {verb.transcriptionV3}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Past Simple Example Sentence */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                          {verb.examplePast}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">
                          {verb.examplePastRu}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(`ex-${verb.id}`, verb.examplePast)}
                        className={`p-1.5 rounded-lg shrink-0 cursor-pointer transition-colors ${
                          speakingId === `ex-${verb.id}`
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'text-indigo-600 hover:bg-indigo-100/70'
                        }`}
                        title="Озвучить пример"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* INTERACTIVE TRAINER MODE */
        <div className="max-w-2xl mx-auto">
          {/* Trainer Top Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                onClick={() => {
                  setTrainerInputMode('choice');
                  setIsChecked(false);
                  setSelectedChoice(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                  trainerInputMode === 'choice'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Выбор вариантов
              </button>
              <button
                onClick={() => {
                  setTrainerInputMode('typing');
                  setIsChecked(false);
                  setTypedV2('');
                  setTypedV3('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                  trainerInputMode === 'typing'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ввод с клавиатуры
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg font-bold text-amber-700 font-mono tabular-nums">
                🔥 Серия: {streak}
              </span>
              <span className="font-mono font-semibold text-slate-500 tabular-nums">
                {trainerIndex + 1} / {trainerOrder.length}
              </span>
            </div>
          </div>

          {/* Trainer Card */}
          {currentVerb && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>Назовите формы V2 (Past Simple) и V3</span>
                <span className="font-mono font-semibold text-indigo-600">
                  Модель {currentVerb.pattern}
                </span>
              </div>

              {/* Prompt V1 */}
              <div className="text-center py-4 mb-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                    {currentVerb.v1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSpeak(`tr-${currentVerb.id}`, currentVerb.v1)}
                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full cursor-pointer transition-colors"
                    title="Прослушать V1"
                  >
                    🔊
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  {currentVerb.transcriptionV1}
                </p>
                <p className="text-base font-bold text-indigo-600 mt-2">
                  {currentVerb.translation}
                </p>
              </div>

              {trainerInputMode === 'choice' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {choiceOptions.map((option, idx) => {
                    const correctPair = `${currentVerb.v2} — ${currentVerb.v3}`;
                    const isThisSelected = selectedChoice === option;
                    const isThisCorrect = option === correctPair;

                    let btnClass =
                      'bg-white text-slate-800 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30';
                    if (isChecked) {
                      if (isThisCorrect) {
                        btnClass =
                          'bg-emerald-50 text-emerald-900 border-emerald-500 font-bold ring-2 ring-emerald-400';
                      } else if (isThisSelected) {
                        btnClass = 'bg-rose-50 text-rose-900 border-rose-400';
                      } else {
                        btnClass = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isChecked}
                        onClick={() => handleSelectChoice(option)}
                        className={`p-4 rounded-xl border text-center text-sm sm:text-base font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${btnClass}`}
                      >
                        <span>{option}</span>
                        {isChecked && isThisCorrect && <span className="text-emerald-600">✓</span>}
                        {isChecked && isThisSelected && !isThisCorrect && (
                          <span className="text-rose-500">✕</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <form onSubmit={handleCheckTyping} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        V2 (Past Simple)
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isChecked}
                        value={typedV2}
                        onChange={(e) => setTypedV2(e.target.value)}
                        placeholder="например: kept"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        V3 (Past Participle)
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isChecked}
                        value={typedV3}
                        onChange={(e) => setTypedV3(e.target.value)}
                        placeholder="например: kept"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                  {!isChecked && (
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
                    >
                      Проверить ответ
                    </button>
                  )}
                </form>
              )}

              {/* Feedback & Example */}
              {isChecked && (
                <div
                  className={`p-4 rounded-xl border mb-4 text-xs sm:text-sm ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold">
                      {isCorrect
                        ? '✓ Отлично! Верные формы!'
                        : `✕ Правильно: ${currentVerb.v1} — ${currentVerb.v2} — ${currentVerb.v3}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSpeak(
                          `res-${currentVerb.id}`,
                          `${currentVerb.v1}, ${currentVerb.v2}, ${currentVerb.v3}`
                        )
                      }
                      className="px-2.5 py-1 bg-white/80 rounded-lg text-xs font-semibold hover:bg-white cursor-pointer shrink-0"
                    >
                      🔊 Повторить
                    </button>
                  </div>
                  <p className="text-xs opacity-90 mt-2">
                    Пример: <span className="font-semibold">{currentVerb.examplePast}</span> ({currentVerb.examplePastRu})
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeak(
                      `hint-${currentVerb.id}`,
                      `${currentVerb.v1}, ${currentVerb.v2}, ${currentVerb.v3}`
                    )
                  }
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  🔊 Озвучить правильные 3 формы
                </button>
                <button
                  type="button"
                  onClick={handleNextTrainer}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                >
                  Следующий глагол →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
