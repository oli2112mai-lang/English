import React, { useState } from 'react';
import { WordCard, IllustrationTheme, PartOfSpeech } from '../types';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: Omit<WordCard, 'id' | 'masteryScore'>) => void;
  onBulkAddCards: (cards: Array<Omit<WordCard, 'id' | 'masteryScore'>>) => void;
  initialMode?: 'single' | 'bulk';
}

export function parseBulkLine(line: string): { en: string; ru: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // 1. Em-dash or En-dash (with or without surrounding spaces): e.g. "Line up — Построиться"
  let match = trimmed.match(/^(.+?)\s*[—–]\s*(.+)$/);
  if (match) {
    return { en: match[1].trim(), ru: match[2].trim() };
  }

  // 2. Hyphen surrounded by spaces: e.g. "Warm-up - Разминка"
  match = trimmed.match(/^(.+?)\s+-\s+(.+)$/);
  if (match) {
    return { en: match[1].trim(), ru: match[2].trim() };
  }

  // 3. Semicolon or colon: e.g. "Cartwheel: Колесо"
  match = trimmed.match(/^(.+?)\s*[:;]\s*(.+)$/);
  if (match) {
    return { en: match[1].trim(), ru: match[2].trim() };
  }

  // 4. Tab separated
  match = trimmed.match(/^(.+?)\t+(.+)$/);
  if (match) {
    return { en: match[1].trim(), ru: match[2].trim() };
  }

  return null;
}

export const AddWordModal: React.FC<AddWordModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  onBulkAddCards,
  initialMode = 'single',
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'single' | 'bulk'>(initialMode);

  // Single card form state
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newTranscription, setNewTranscription] = useState('');
  const [newCategory, setNewCategory] = useState('Трюки & Элементы');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState<PartOfSpeech>('phrase');
  const [newExampleEn, setNewExampleEn] = useState('');
  const [newExampleRu, setNewExampleRu] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newTheme, setNewTheme] = useState<IllustrationTheme>('sports');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Bulk import state
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('Мои слова');
  const [bulkTheme, setBulkTheme] = useState<IllustrationTheme>('sports');

  if (!isOpen) return null;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    onAddCard({
      word: newWord.trim(),
      translation: newTranslation.trim(),
      transcription: newTranscription.trim() || undefined,
      category: newCategory.trim() || 'Мои слова',
      partOfSpeech: newPartOfSpeech,
      level: 'A2',
      exampleEn: newExampleEn.trim(),
      exampleRu: newExampleRu.trim(),
      ruleOrNote: newNote.trim() || undefined,
      illustrationTheme: newTheme,
      imageUrl: newImageUrl.trim() || undefined,
      isCustom: true,
      createdAt: Date.now(),
    });

    // Reset fields
    setNewWord('');
    setNewTranslation('');
    setNewTranscription('');
    setNewExampleEn('');
    setNewExampleRu('');
    setNewNote('');
    setNewImageUrl('');
    onClose();
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split('\n');
    const parsed: Array<Omit<WordCard, 'id' | 'masteryScore'>> = [];

    for (const line of lines) {
      const res = parseBulkLine(line);
      if (res && res.en && res.ru) {
        parsed.push({
          word: res.en,
          translation: res.ru,
          category: bulkCategory.trim() || 'Мои слова',
          partOfSpeech: 'phrase',
          level: 'A2',
          exampleEn: '',
          exampleRu: '',
          illustrationTheme: bulkTheme,
          isCustom: true,
          createdAt: Date.now(),
        });
      }
    }

    if (parsed.length > 0) {
      onBulkAddCards(parsed);
      setBulkText('');
      onClose();
    }
  };

  const parsedBulkCount = bulkText
    .split('\n')
    .filter((line) => parseBulkLine(line) !== null).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTabMode('single')}
              className={`text-sm font-bold pb-1 border-b-2 cursor-pointer transition-colors ${
                activeTabMode === 'single'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Одна фраза
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMode('bulk')}
              className={`text-sm font-bold pb-1 border-b-2 cursor-pointer transition-colors ${
                activeTabMode === 'bulk'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              📋 Вставить списком
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mode 1: Single Card Form */}
        {activeTabMode === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Английская фраза / слово *
              </label>
              <input
                type="text"
                required
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="e.g. Backflip, Dismount, High five"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Перевод на русский *
              </label>
              <input
                type="text"
                required
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
                placeholder="e.g. Сальто назад, Соскок со снаряда"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Транскрипция (необязательно)
                </label>
                <input
                  type="text"
                  value={newTranscription}
                  onChange={(e) => setNewTranscription(e.target.value)}
                  placeholder="e.g. [bæk.flɪp]"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Категория
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Трюки, Разминка, Мой словарь"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Тема иллюстрации
                </label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value as IllustrationTheme)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="sports">Спорт & Гимнастика</option>
                  <option value="work">Администрирование & Клиенты</option>
                  <option value="study">Занятия & Развитие детей</option>
                  <option value="action">Глаголы & Действия</option>
                  <option value="emotion">Эмоции & Похвала</option>
                  <option value="travel">Путешествия</option>
                  <option value="tech">Технологии & Учеба</option>
                  <option value="nature">Природа</option>
                  <option value="food">Питание & Еда</option>
                  <option value="grammar">Грамматика</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ссылка на картинку (URL)
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Пример использования (English)
              </label>
              <input
                type="text"
                value={newExampleEn}
                onChange={(e) => setNewExampleEn(e.target.value)}
                placeholder="e.g. Try to land on both feet softly."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Подсказка тренера / Грамматическая заметка
              </label>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Устойчивое выражение, акцент на мягком приземлении"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 active:scale-95 cursor-pointer shadow-xs"
              >
                Создать карточку
              </button>
            </div>
          </form>
        ) : (
          /* Mode 2: Bulk Text Import */
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div className="p-3.5 bg-indigo-50 rounded-xl text-xs text-indigo-900 border border-indigo-100">
              <p className="font-bold mb-1">Вставьте список слов или фраз строками в формате:</p>
              <p className="font-mono text-slate-700">Line up, please! — Строимся, пожалуйста!</p>
              <p className="font-mono text-slate-700">Warm-up drill — Комплекс разминки</p>
              <p className="font-mono text-slate-700">Cartwheel: Колесо</p>
              <p className="mt-1 text-slate-500">
                Корректно распознаются тире (—), дефисы со пробелами ( - ), двоеточия (:) и дефисные слова (Warm-up, Push-ups).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Текст со списком фраз *
              </label>
              <textarea
                rows={8}
                required
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`Forward roll — Кувырок вперед\nBackward roll — Кувырок назад\nHandstand — Стойка на руках`}
                className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Категория для этих слов
                </label>
                <input
                  type="text"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  placeholder="e.g. Мои слова"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Иллюстрации
                </label>
                <select
                  value={bulkTheme}
                  onChange={(e) => setBulkTheme(e.target.value as IllustrationTheme)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="sports">Спорт & Гимнастика</option>
                  <option value="work">Администрирование & Клиенты</option>
                  <option value="study">Занятия & Развитие детей</option>
                  <option value="action">Глаголы & Действия</option>
                  <option value="emotion">Эмоции & Похвала</option>
                  <option value="travel">Путешествия</option>
                  <option value="tech">Технологии</option>
                  <option value="food">Еда</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Распознано строк: <span className="font-bold text-indigo-600">{parsedBulkCount}</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={parsedBulkCount === 0}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 active:scale-95 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  Импортировать {parsedBulkCount > 0 ? `(${parsedBulkCount})` : ''}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
