'use client'

import { Word } from '@/app/page'
import { CheckCircle, Circle } from 'lucide-react'

interface WordListProps {
  words: Word[]
  selectedWord: Word | null
  onWordSelect: (word: Word) => void
}

export default function WordList({ words, selectedWord, onWordSelect }: WordListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">单词列表</h2>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {words.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无单词</p>
        ) : (
          words.map((word) => (
            <button
              key={word.id}
              onClick={() => onWordSelect(word)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedWord?.id === word.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{word.word}</h3>
                    {word.mastered && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{word.meaning}</p>
                </div>
                {!word.mastered && (
                  <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

