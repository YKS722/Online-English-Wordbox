'use client'

import { useState } from 'react'
import { Volume2, Star, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import { Word } from '@/app/page'
import { motion } from 'framer-motion'

interface WordCardProps {
  word: Word
  onUpdate: (word: Word) => void
}

export default function WordCard({ word, onUpdate }: WordCardProps) {
  const [isGeneratingExample, setIsGeneratingExample] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const handlePronounce = () => {
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true)
      const utterance = new SpeechSynthesisUtterance(word.word)
      utterance.lang = 'en-US'
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleToggleMastered = () => {
    onUpdate({
      ...word,
      mastered: !word.mastered,
      reviewCount: word.reviewCount + 1,
      lastReviewed: new Date(),
    })
  }

  const handleGenerateExample = async () => {
    setIsGeneratingExample(true)
    try {
      const response = await fetch('/api/word/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.word, meaning: word.meaning }),
      })

      if (response.ok) {
        const data = await response.json()
        onUpdate({
          ...word,
          example: data.example,
          exampleTranslation: data.exampleTranslation,
        })
      }
    } catch (error) {
      console.error('生成例句失败:', error)
    } finally {
      setIsGeneratingExample(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h2 className="text-4xl font-bold text-gray-900">{word.word}</h2>
            <button
              onClick={handlePronounce}
              disabled={isPlayingAudio}
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors disabled:opacity-50"
              title="发音"
            >
              <Volume2 className={`h-5 w-5 text-blue-600 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          <p className="text-lg text-gray-600 mb-4">{word.pronunciation}</p>
          <p className="text-2xl text-gray-800 font-semibold">{word.meaning}</p>
        </div>
        <button
          onClick={handleToggleMastered}
          className={`p-3 rounded-full transition-colors ${
            word.mastered
              ? 'bg-green-100 text-green-600 hover:bg-green-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
          title={word.mastered ? '已掌握' : '标记为已掌握'}
        >
          {word.mastered ? (
            <CheckCircle className="h-6 w-6" />
          ) : (
            <Star className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">例句</h3>
          {!word.example && (
            <button
              onClick={handleGenerateExample}
              disabled={isGeneratingExample}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGeneratingExample ? 'animate-spin' : ''}`} />
              <span>{isGeneratingExample ? '生成中...' : 'AI生成例句'}</span>
            </button>
          )}
        </div>
        {word.example ? (
          <div className="space-y-2">
            <p className="text-lg text-gray-800 italic">"{word.example}"</p>
            {word.exampleTranslation && (
              <p className="text-gray-600">"{word.exampleTranslation}"</p>
            )}
          </div>
        ) : (
          <p className="text-gray-400">点击"AI生成例句"按钮生成例句</p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">复习次数</p>
            <p className="text-xl font-semibold text-gray-900">{word.reviewCount}</p>
          </div>
          <div>
            <p className="text-gray-500">学习状态</p>
            <p className={`text-xl font-semibold ${word.mastered ? 'text-green-600' : 'text-yellow-600'}`}>
              {word.mastered ? '已掌握' : '学习中'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

