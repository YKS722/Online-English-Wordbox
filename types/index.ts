export interface User {
  id: string
  email: string
  name: string
  image?: string
}

export interface Word {
  _id: string
  word: string
  pronunciation: string
  meaning: string
  partOfSpeech?: string
  difficulty?: number
}

export interface VocabularyBook {
  _id: string
  name: string
  description: string
  category: 'IELTS' | 'TOEFL' | 'GRE' | 'CET-4' | 'CET-6' | 'OTHER'
  level: number
  wordCount: number
  words?: Word[]
}

export interface LearningRecord {
  _id: string
  userId: string
  wordId: string
  vocabularyBookId: string
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate?: string
  reviewCount: number
  successCount: number
  failCount: number
  userSentences: Array<{
    sentence: string
    aiFeedback: string
    score: number
    createdAt: string
  }>
  isMastered: boolean
}

export interface ExampleSentence {
  sentence: string
  translation: string
}

export interface SentenceEvaluation {
  score: number
  feedback: string
  corrections: string[]
  suggestions: string[]
}

export interface DashboardStats {
  totalWords: number
  masteredWords: number
  wordsToReview: number
  totalReviews: number
  successRate: string
  knownWordsCount: number
}

export interface BookProgress {
  bookId: string
  bookName: string
  category: string
  mastered: number
  total: number
  progress: number
}

