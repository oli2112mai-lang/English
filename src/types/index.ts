export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrasal_verb' | 'idiom' | 'phrase';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type IllustrationTheme = 
  | 'travel'
  | 'nature'
  | 'tech'
  | 'food'
  | 'emotion'
  | 'work'
  | 'action'
  | 'study'
  | 'city'
  | 'music'
  | 'sports'
  | 'grammar';

export interface WordCard {
  id: string;
  word: string;
  translation: string;
  transcription?: string;
  partOfSpeech: PartOfSpeech;
  category: string;
  level: CEFRLevel;
  exampleEn: string;
  exampleRu: string;
  ruleOrNote?: string;
  illustrationTheme: IllustrationTheme;
  imageUrl?: string;
  masteryScore: number; // 0 to 5
  isCustom?: boolean;
  createdAt?: number;
}

export interface GrammarCard {
  id: string;
  title: string;
  level: CEFRLevel;
  category: string;
  formula: string;
  explanation: string;
  keyRule: string;
  examples: Array<{
    en: string;
    ru: string;
    highlight: string;
  }>;
  commonMistakes: Array<{
    wrong: string;
    correct: string;
    why: string;
  }>;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  builderTask: {
    targetRu: string;
    scrambledWords: string[];
    correctSentence: string;
    hint: string;
  };
}

export type VerbPatternGroup = 'AAA' | 'ABB' | 'ABA' | 'ABC';

export interface IrregularVerb {
  id: string;
  v1: string;
  v2: string;
  v3: string;
  transcriptionV1: string;
  transcriptionV2: string;
  transcriptionV3: string;
  translation: string;
  pattern: VerbPatternGroup;
  examplePast: string;
  examplePastRu: string;
  isCoachingRelevant?: boolean;
}

export type ActiveTab = 'cards' | 'quiz' | 'builder' | 'grammar' | 'verbs' | 'dictionary';
