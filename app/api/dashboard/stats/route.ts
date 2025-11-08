import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import LearningRecord from '@/models/LearningRecord'
import VocabularyBook from '@/models/VocabularyBook'
import { getWordsToReview } from '@/lib/spaced-repetition'

// 获取用户学习统计
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 获取学习记录统计
    const learningRecords = await LearningRecord.find({ userId: user._id })
    
    const totalWords = learningRecords.length
    const masteredWords = learningRecords.filter((r) => r.isMastered).length
    const totalReviews = learningRecords.reduce((sum, r) => sum + r.reviewCount, 0)
    const totalSuccess = learningRecords.reduce((sum, r) => sum + r.successCount, 0)
    const successRate = totalReviews > 0 ? (totalSuccess / totalReviews) * 100 : 0

    // 获取需要复习的单词
    const wordsToReview = learningRecords.filter((r) => 
      getWordsToReview(r.nextReviewDate) && !r.isMastered
    ).length

    // 获取各词汇书的学习进度
    const vocabularyBooks = await VocabularyBook.find({ isPublic: true })
    const bookProgress = await Promise.all(
      vocabularyBooks.map(async (book) => {
        const records = await LearningRecord.find({
          userId: user._id,
          vocabularyBookId: book._id,
        })
        const mastered = records.filter((r) => r.isMastered).length
        const total = book.wordCount
        const progress = total > 0 ? (mastered / total) * 100 : 0

        return {
          bookId: book._id,
          bookName: book.name,
          category: book.category,
          mastered,
          total,
          progress,
        }
      })
    )

    return NextResponse.json({
      stats: {
        totalWords,
        masteredWords,
        wordsToReview,
        totalReviews,
        successRate: successRate.toFixed(1),
        knownWordsCount: user.knownWords.length,
      },
      bookProgress,
    })
  } catch (error) {
    console.error('获取统计失败:', error)
    return NextResponse.json(
      { error: '获取统计失败' },
      { status: 500 }
    )
  }
}

