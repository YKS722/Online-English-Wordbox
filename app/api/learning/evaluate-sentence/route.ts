import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import LearningRecord from '@/models/LearningRecord'
import Word from '@/models/Word'
import { evaluateUserSentence } from '@/lib/ai-service'

// 评估用户创建的句子
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { wordId, vocabularyBookId, sentence } = await request.json()

    if (!wordId || !vocabularyBookId || !sentence) {
      return NextResponse.json(
        { error: '请提供完整的参数' },
        { status: 400 }
      )
    }

    await connectDB()

    const word = await Word.findById(wordId)
    if (!word) {
      return NextResponse.json(
        { error: '单词不存在' },
        { status: 404 }
      )
    }

    // 评估句子
    const evaluation = await evaluateUserSentence(word.word, word.meaning, sentence)

    // 保存到学习记录
    const learningRecord = await LearningRecord.findOne({
      userId: session.user.id,
      wordId,
      vocabularyBookId,
    })

    if (learningRecord) {
      learningRecord.userSentences.push({
        sentence,
        aiFeedback: evaluation.feedback,
        score: evaluation.score,
        createdAt: new Date(),
      })
      await learningRecord.save()
    }

    return NextResponse.json({ evaluation })
  } catch (error) {
    console.error('评估句子失败:', error)
    return NextResponse.json(
      { error: '评估句子失败' },
      { status: 500 }
    )
  }
}

