import { useState, useEffect } from 'react';
import { WordCard, ActiveTab } from './types';
import { INITIAL_VOCABULARY } from './data/initialVocab';
import { INITIAL_GRAMMAR } from './data/initialGrammar';
import { IRREGULAR_VERBS } from './data/irregularVerbs';
import { Header } from './components/Header';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizMode } from './components/QuizMode';
import { SentenceBuilder } from './components/SentenceBuilder';
import { GrammarDeck } from './components/GrammarDeck';
import { IrregularVerbsSection } from './components/IrregularVerbsSection';
import { VocabManager } from './components/VocabManager';
import { AddWordModal } from './components/AddWordModal';
import { speech } from './utils/speech';

const STORAGE_KEY = 'linguaflash_cards_v3';
const PREV_STORAGE_KEY = 'linguaflash_cards_v2';

function loadInitialCards(): WordCard[] {
  try {
    const savedV3 = localStorage.getItem(STORAGE_KEY);
    if (savedV3) {
      const parsed = JSON.parse(savedV3);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Migrate progress and custom cards from v2 if present
    const savedV2 = localStorage.getItem(PREV_STORAGE_KEY);
    if (savedV2) {
      const parsedV2: WordCard[] = JSON.parse(savedV2);
      if (Array.isArray(parsedV2)) {
        const progressByWord = new Map<string, number>();
        const customCards: WordCard[] = [];

        for (const item of parsedV2) {
          if (item?.word) {
            progressByWord.set(item.word.toLowerCase().trim(), item.masteryScore || 0);
          }
          if (item?.isCustom) {
            customCards.push(item);
          }
        }

        const mergedDefaults = INITIAL_VOCABULARY.map((card) => ({
          ...card,
          masteryScore: progressByWord.get(card.word.toLowerCase().trim()) ?? card.masteryScore,
        }));

        return [...customCards, ...mergedDefaults];
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_VOCABULARY;
}

export default function App() {
  const [cards, setCards] = useState<WordCard[]>(loadInitialCards);

  const [activeTab, setActiveTab] = useState<ActiveTab>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalInitialMode, setModalInitialMode] = useState<'single' | 'bulk'>('single');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save cards to localStorage', e);
    }
  }, [cards]);

  // Stop speech when switching main tabs
  useEffect(() => {
    speech.stop();
  }, [activeTab]);

  // Categories list
  const categories = ['Все', ...Array.from(new Set(cards.map((c) => c.category || 'Без категории')))];

  const handleUpdateScore = (cardId: string, newScore: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, masteryScore: newScore, lastReviewed: Date.now() } : c))
    );
  };

  const handleAddCard = (newCardData: Omit<WordCard, 'id' | 'masteryScore'>) => {
    const newCard: WordCard = {
      ...newCardData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      masteryScore: 0,
      createdAt: Date.now(),
    };
    setCards((prev) => [newCard, ...prev]);
  };

  const handleBulkAddCards = (newCardsData: Array<Omit<WordCard, 'id' | 'masteryScore'>>) => {
    const formatted: WordCard[] = newCardsData.map((c, i) => ({
      ...c,
      id: `bulk-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      masteryScore: 0,
      createdAt: Date.now(),
    }));
    setCards((prev) => [...formatted, ...prev]);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Восстановить базовый набор гимнастических команд и фраз? Ваши добавленные слова будут заменены.')) {
      setCards(INITIAL_VOCABULARY);
      setSelectedCategory('Все');
    }
  };

  const openAddModal = (mode: 'single' | 'bulk' = 'single') => {
    setModalInitialMode(mode);
    setIsAddModalOpen(true);
  };

  const masteredCount = cards.filter((c) => (c.masteryScore || 0) >= 3).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => openAddModal('single')}
        totalCardsCount={cards.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Subtle Overview Strip */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <div>
              <span className="text-slate-400 block">Фраз в тренировке:</span>
              <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                {cards.length} карточек
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block">Освоено (★ 3+):</span>
              <span className="text-sm font-bold font-mono text-emerald-600 tabular-nums">
                {masteredCount} из {cards.length}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-slate-400 block">Направление:</span>
              <span className="text-sm font-bold text-indigo-600">
                Gymnastics & Coaching
              </span>
            </div>
          </div>

          {/* Quick Mode Switches */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Карточки
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Тест
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'builder'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Конструктор
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'grammar'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Правила
            </button>
            <button
              onClick={() => setActiveTab('verbs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'verbs'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Глаголы
            </button>
          </div>
        </div>

        {/* View Routing */}
        {activeTab === 'cards' && (
          <FlashcardDeck
            cards={cards}
            onUpdateScore={handleUpdateScore}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenAddModal={() => openAddModal('single')}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizMode
            cards={cards}
            onSwitchToCards={() => setActiveTab('cards')}
          />
        )}

        {activeTab === 'builder' && (
          <SentenceBuilder
            grammarCards={INITIAL_GRAMMAR}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarDeck
            cards={INITIAL_GRAMMAR}
          />
        )}

        {activeTab === 'verbs' && (
          <IrregularVerbsSection
            verbs={IRREGULAR_VERBS}
          />
        )}

        {activeTab === 'dictionary' && (
          <VocabManager
            cards={cards}
            onOpenAddModal={openAddModal}
            onDeleteCard={handleDeleteCard}
            onResetToDefaults={handleResetToDefaults}
          />
        )}
      </main>

      {/* Global Add/Import Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={handleAddCard}
        onBulkAddCards={handleBulkAddCards}
        initialMode={modalInitialMode}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>LinguaFlash · Тренажер английской спортивной лексики и грамматики</p>
      </footer>
    </div>
  );
}
