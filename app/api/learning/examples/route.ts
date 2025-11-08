import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Word from '@/models/Word'
import { generateExampleSentences } from '@/lib/ai-service'

// 获取单词的例句
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

    const word = await Word.findById(wordId)
    if (!word) {
      return NextResponse.json(
        { error: '单词不存在' },
        { status: 404 }
      )
    }

    // 生成例句
    const examples = await generateExampleSentences(word.word, word.meaning, 5)

    return NextResponse.json({ examples })
  } catch (error) {
    console.error('获取例句失败:', error)
    return NextResponse.json(
      { error: '获取例句失败' },
      { status: 500 }
    )
  }
}

