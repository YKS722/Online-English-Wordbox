import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import LearningRecord from '@/models/LearningRecord'
import Word from '@/models/Word'
import User from '@/models/User'
import VocabularyBook from '@/models/VocabularyBook'

// 开始学习：获取下一个要学习的单词
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { vocabularyBookId } = await request.json()

    await connectDB()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 获取词汇书
    const vocabularyBook = await VocabularyBook.findById(vocabularyBookId).populate('words')
    if (!vocabularyBook) {
      return NextResponse.json(
        { error: '词汇书不存在' },
        { status: 404 }
      )
    }

    // 获取用户的学习记录
    const learningRecords = await LearningRecord.find({
      userId: user._id,
      vocabularyBookId: vocabularyBook._id,
    })

    // 排除已掌握的单词和用户已知的单词
    const masteredWordIds = new Set(
      learningRecords
        .filter((record) => record.isMastered)
        .map((record) => record.wordId.toString())
    )
    const knownWordIds = new Set(user.knownWords.map((id) => id.toString()))

    // 找到需要学习的单词（排除已掌握的、已知的、以及未到复习时间的）
    const now = new Date()
    const availableWords = vocabularyBook.words.filter((word: any) => {
      const wordId = word._id.toString()
      if (masteredWordIds.has(wordId) || knownWordIds.has(wordId)) {
        return false
      }

      // 检查是否有学习记录
      const record = learningRecords.find(
        (r) => r.wordId.toString() === wordId
      )
      if (record) {
        // 如果未到复习时间，跳过
        return new Date(record.nextReviewDate) <= now
      }

      return true
    })

    if (availableWords.length === 0) {
      return NextResponse.json({
        word: null,
        message: '恭喜！你已经学完了所有单词，或者所有单词都还未到复习时间。',
      })
    }

    // 随机选择一个单词（可以改进为基于难度和复习时间的优先级）
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)]

    // 获取或创建学习记录
    let learningRecord = await LearningRecord.findOne({
      userId: user._id,
      wordId: randomWord._id,
      vocabularyBookId: vocabularyBook._id,
    })

    if (!learningRecord) {
      learningRecord = await LearningRecord.create({
        userId: user._id,
        wordId: randomWord._id,
        vocabularyBookId: vocabularyBook._id,
        nextReviewDate: new Date(),
      })
    }

    const word = await Word.findById(randomWord._id)

    return NextResponse.json({
      word,
      learningRecord,
    })
  } catch (error) {
    console.error('获取学习单词失败:', error)
    return NextResponse.json(
      { error: '获取学习单词失败' },
      { status: 500 }
    )
  }
}

