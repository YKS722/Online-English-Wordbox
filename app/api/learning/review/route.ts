import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import LearningRecord from '@/models/LearningRecord'
import { calculateNextReview } from '@/lib/spaced-repetition'

// 提交复习结果
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { learningRecordId, quality } = await request.json()

    if (quality === undefined || quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: '请提供有效的复习质量评分 (0-5)' },
        { status: 400 }
      )
    }

    await connectDB()

    const learningRecord = await LearningRecord.findById(learningRecordId)
    if (!learningRecord) {
      return NextResponse.json(
        { error: '学习记录不存在' },
        { status: 404 }
      )
    }

    if (learningRecord.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: '无权限' },
        { status: 403 }
      )
    }

    // 更新复习记录
    learningRecord.reviewCount += 1
    learningRecord.lastReviewDate = new Date()

    if (quality >= 3) {
      learningRecord.successCount += 1
    } else {
      learningRecord.failCount += 1
    }

    // 计算下次复习时间（使用间隔重复算法）
    const result = calculateNextReview(
      learningRecord.easeFactor,
      learningRecord.interval,
      learningRecord.repetitions,
      quality
    )

    learningRecord.easeFactor = result.easeFactor
    learningRecord.interval = result.interval
    learningRecord.repetitions = result.repetitions
    learningRecord.nextReviewDate = result.nextReviewDate

    // 如果重复次数达到一定值，标记为已掌握
    if (learningRecord.repetitions >= 5 && learningRecord.successCount >= learningRecord.reviewCount * 0.8) {
      learningRecord.isMastered = true
    }

    await learningRecord.save()

    return NextResponse.json({
      learningRecord,
      nextReviewDate: result.nextReviewDate,
      message: quality >= 3 ? '回答正确！' : '继续努力！',
    })
  } catch (error) {
    console.error('提交复习结果失败:', error)
    return NextResponse.json(
      { error: '提交复习结果失败' },
      { status: 500 }
    )
  }
}

