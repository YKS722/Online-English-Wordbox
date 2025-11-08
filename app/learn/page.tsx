'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Volume2, Lightbulb, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Word, LearningRecord, ExampleSentence } from '@/types'

type LearningStep = 'select-sentence' | 'translate' | 'create-sentence'

export default function LearnPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookId = searchParams.get('bookId')

  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [learningRecord, setLearningRecord] = useState<LearningRecord | null>(null)
  const [examples, setExamples] = useState<ExampleSentence[]>([])
  const [selectedExample, setSelectedExample] = useState<ExampleSentence | null>(null)
  const [step, setStep] = useState<LearningStep>('select-sentence')
  const [translation, setTranslation] = useState('')
  const [showTranslation, setShowTranslation] = useState(false)
  const [hint, setHint] = useState('')
  const [userSentence, setUserSentence] = useState('')
  const [evaluation, setEvaluation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [reviewQuality, setReviewQuality] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && bookId) {
      startLearning()
    } else if (status === 'authenticated' && !bookId) {
      router.push('/books')
    }
  }, [status, bookId, router])

  const startLearning = async () => {
    if (!bookId) return

    setLoading(true)
    try {
      const response = await fetch('/api/learning/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabularyBookId: bookId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || '获取单词失败')
        return
      }

      if (!data.word) {
        toast.success(data.message || '恭喜！你已经学完了所有单词')
        router.push('/dashboard')
        return
      }

      setCurrentWord(data.word)
      setLearningRecord(data.learningRecord)
      loadExamples(data.word._id)
    } catch (error) {
      toast.error('开始学习失败')
    } finally {
      setLoading(false)
    }
  }

  const loadExamples = async (wordId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/learning/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId }),
      })

      const data = await response.json()
      if (response.ok) {
        setExamples(data.examples)
      }
    } catch (error) {
      toast.error('加载例句失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectExample = (example: ExampleSentence) => {
    setSelectedExample(example)
    setStep('translate')
    setTranslation('')
    setShowTranslation(false)
    setHint('')
  }

  const handleShowTranslation = () => {
    setShowTranslation(true)
  }

  const handleGetHint = async () => {
    if (!selectedExample || !currentWord) return

    setLoading(true)
    try {
      const response = await fetch('/api/learning/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: selectedExample.sentence,
          word: currentWord.word,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setHint(data.hint)
      }
    } catch (error) {
      toast.error('获取提示失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTranslation = () => {
    if (!translation.trim()) {
      toast.error('请输入翻译')
      return
    }
    setShowTranslation(true)
    // 可以添加翻译验证逻辑
  }

  const handleNextToCreate = () => {
    setStep('create-sentence')
    setUserSentence('')
    setEvaluation(null)
  }

  const handleEvaluateSentence = async () => {
    if (!userSentence.trim() || !currentWord || !bookId) {
      toast.error('请输入句子')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/learning/evaluate-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: currentWord._id,
          vocabularyBookId: bookId,
          sentence: userSentence,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setEvaluation(data.evaluation)
      }
    } catch (error) {
      toast.error('评估句子失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (quality: number) => {
    if (!learningRecord) return

    setLoading(true)
    try {
      const response = await fetch('/api/learning/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learningRecordId: learningRecord._id,
          quality,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setReviewQuality(quality)
        toast.success(data.message)
        setTimeout(() => {
          startLearning() // 加载下一个单词
          resetState()
        }, 2000)
      }
    } catch (error) {
      toast.error('提交复习结果失败')
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setStep('select-sentence')
    setSelectedExample(null)
    setTranslation('')
    setShowTranslation(false)
    setHint('')
    setUserSentence('')
    setEvaluation(null)
    setReviewQuality(null)
  }

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || !currentWord) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">学习单词</h1>
            <div className="w-6" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 单词卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h2 className="text-4xl font-bold text-gray-900">{currentWord.word}</h2>
                <button
                  onClick={() => handlePronounce(currentWord.word)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <Volume2 className="h-5 w-5 text-blue-600" />
                </button>
              </div>
              <p className="text-lg text-gray-600 mb-2">{currentWord.pronunciation}</p>
              <p className="text-2xl text-gray-800 font-semibold">{currentWord.meaning}</p>
            </div>
          </div>
        </div>

        {/* 步骤1: 选择例句 */}
        {step === 'select-sentence' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">选择一句例句</h3>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectExample(example)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-lg text-gray-800">{example.sentence}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 步骤2: 翻译练习 */}
        {step === 'translate' && selectedExample && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">翻译练习</h3>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-800 mb-2">{selectedExample.sentence}</p>
              <button
                onClick={() => handlePronounce(selectedExample.sentence)}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Volume2 className="h-4 w-4" />
                <span>发音</span>
              </button>
            </div>

            {!showTranslation ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    请将上面的英文句子翻译成中文：
                  </label>
                  <textarea
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="输入你的翻译..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleGetHint}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>获取提示</span>
                  </button>
                  <button
                    onClick={handleSubmitTranslation}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    提交翻译
                  </button>
                </div>

                {hint && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">{hint}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-lg text-green-800 font-semibold mb-2">参考翻译：</p>
                  <p className="text-gray-800">{selectedExample.translation}</p>
                </div>
                <button
                  onClick={handleNextToCreate}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  下一步：创作句子
                </button>
              </div>
            )}
          </div>
        )}

        {/* 步骤3: 创作句子 */}
        {step === 'create-sentence' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">创作句子</h3>
            <p className="text-gray-600 mb-6">
              请使用单词 <span className="font-bold text-blue-600">{currentWord.word}</span> 创建一个新句子
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  你的句子：
                </label>
                <textarea
                  value={userSentence}
                  onChange={(e) => setUserSentence(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="输入你的句子..."
                />
              </div>

              <button
                onClick={handleEvaluateSentence}
                disabled={!userSentence.trim() || loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'AI评估'}
              </button>

              {evaluation && (
                <div className="p-6 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">评分</span>
                    <span className="text-2xl font-bold text-blue-600">{evaluation.score}/100</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">AI反馈：</p>
                    <p className="text-gray-800">{evaluation.feedback}</p>
                  </div>

                  {evaluation.corrections.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-2">需要修正：</p>
                      <ul className="list-disc list-inside text-red-600 space-y-1">
                        {evaluation.corrections.map((correction: string, index: number) => (
                          <li key={index}>{correction}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.suggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">改进建议：</p>
                      <ul className="list-disc list-inside text-green-600 space-y-1">
                        {evaluation.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {evaluation && (
                <div className="border-t pt-6">
                  <p className="text-sm font-medium text-gray-700 mb-4">本次学习表现如何？</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((quality) => (
                      <button
                        key={quality}
                        onClick={() => handleSubmitReview(quality)}
                        disabled={reviewQuality !== null}
                        className={`p-4 rounded-lg font-semibold transition-colors ${
                          reviewQuality === quality
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        } disabled:opacity-50`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    0=完全忘记, 5=完全记住
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

