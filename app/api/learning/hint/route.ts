import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { generateTranslationHint } from '@/lib/ai-service'

// 获取翻译提示
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { sentence, word } = await request.json()

    if (!sentence || !word) {
      return NextResponse.json(
        { error: '请提供句子和单词' },
        { status: 400 }
      )
    }

    const hint = await generateTranslationHint(sentence, word)

    return NextResponse.json({ hint })
  } catch (error) {
    console.error('获取提示失败:', error)
    return NextResponse.json(
      { error: '获取提示失败' },
      { status: 500 }
    )
  }
}

