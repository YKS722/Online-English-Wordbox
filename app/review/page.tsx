'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Word, LearningRecord } from '@/types'

export default function ReviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [learningRecord, setLearningRecord] = useState<LearningRecord | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewQuality, setReviewQuality] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      loadNextReviewWord()
    }
  }, [status, router])

  const loadNextReviewWord = async () => {
    setLoading(true)
    try {
      // 这里应该有一个专门获取复习单词的API
      // 暂时使用学习API
      const response = await fetch('/api/learning/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocabularyBookId: null }), // 需要修改API支持跨词汇书复习
      })

      const data = await response.json()

      if (!response.ok || !data.word) {
        toast.success('没有需要复习的单词了！')
        router.push('/dashboard')
        return
      }

      setCurrentWord(data.word)
      setLearningRecord(data.learningRecord)
      setShowAnswer(false)
      setReviewQuality(null)
    } catch (error) {
      toast.error('加载复习单词失败')
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
          loadNextReviewWord()
        }, 1500)
      }
    } catch (error) {
      toast.error('提交复习结果失败')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || (loading && !currentWord)) {
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
            <h1 className="text-xl font-bold text-gray-900">复习单词</h1>
            <div className="w-6" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{currentWord.word}</h2>
            <p className="text-lg text-gray-600 mb-4">{currentWord.pronunciation}</p>
          </div>

          {!showAnswer ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">你还记得这个单词的意思吗？</p>
              <button
                onClick={() => setShowAnswer(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                显示答案
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-2xl font-semibold text-gray-900">{currentWord.meaning}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-4 text-center">
                  你回答得如何？
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    { quality: 0, label: '完全忘记', icon: XCircle, color: 'red' },
                    { quality: 1, label: '困难', icon: XCircle, color: 'orange' },
                    { quality: 2, label: '困难', icon: XCircle, color: 'yellow' },
                    { quality: 3, label: '一般', icon: CheckCircle, color: 'blue' },
                    { quality: 4, label: '容易', icon: CheckCircle, color: 'green' },
                    { quality: 5, label: '完全记住', icon: CheckCircle, color: 'green' },
                  ].map(({ quality, label, icon: Icon, color }) => (
                    <button
                      key={quality}
                      onClick={() => handleSubmitReview(quality)}
                      disabled={reviewQuality !== null || loading}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        reviewQuality === quality
                          ? `bg-${color}-500 border-${color}-500 text-white`
                          : `bg-white border-gray-200 hover:border-${color}-500 text-gray-700`
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-2 text-${color}-600`} />
                      <p className="font-semibold text-sm">{quality}</p>
                      <p className="text-xs mt-1">{label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

