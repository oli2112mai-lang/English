import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  totalCardsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  totalCardsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('cards')}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display group-hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Lingua<span className="text-indigo-600">Flash</span>
            </span>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('cards')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-1 border-b-2 ${
                activeTab === 'cards'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Карточки
            </button>
            <button
              onClick={() => onSelectTab('quiz')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-1 border-b-2 ${
                activeTab === 'quiz'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Викторина
            </button>
            <button
              onClick={() => onSelectTab('builder')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-1 border-b-2 ${
                activeTab === 'builder'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Конструктор фраз
            </button>
            <button
              onClick={() => onSelectTab('grammar')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-1 border-b-2 ${
                activeTab === 'grammar'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Грамматика
            </button>
            <button
              onClick={() => onSelectTab('verbs')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-1 border-b-2 ${
                activeTab === 'verbs'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Неправ. глаголы
            </button>
            <button
              onClick={() => onSelectTab('dictionary')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-1 border-b-2 ${
                activeTab === 'dictionary'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Мой словарь ({totalCardsCount})
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Добавить слова</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-medium text-slate-600 overflow-x-auto">
          <button
            onClick={() => onSelectTab('cards')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'cards' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Карточки
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'quiz' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Викторина
          </button>
          <button
            onClick={() => onSelectTab('builder')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'builder' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Конструктор
          </button>
          <button
            onClick={() => onSelectTab('grammar')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'grammar' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Грамматика
          </button>
          <button
            onClick={() => onSelectTab('verbs')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'verbs' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Глаголы
          </button>
          <button
            onClick={() => onSelectTab('dictionary')}
            className={`px-2 py-1 whitespace-nowrap ${activeTab === 'dictionary' ? 'text-indigo-600 font-bold' : ''}`}
          >
            Словарь ({totalCardsCount})
          </button>
        </div>
      </div>
    </header>
  );
};
