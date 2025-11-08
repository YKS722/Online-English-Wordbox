import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import LearningRecord from '@/models/LearningRecord'

// 标记单词为已知
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { wordId } = await request.json()

    await connectDB()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 添加到已知单词列表
    if (!user.knownWords.includes(wordId)) {
      user.knownWords.push(wordId)
      await user.save()
    }

    // 更新所有相关的学习记录为已掌握
    await LearningRecord.updateMany(
      {
        userId: user._id,
        wordId,
      },
      {
        isMastered: true,
      }
    )

    return NextResponse.json({ message: '已标记为已知单词' })
  } catch (error) {
    console.error('标记已知单词失败:', error)
    return NextResponse.json(
      { error: '标记已知单词失败' },
      { status: 500 }
    )
  }
}

