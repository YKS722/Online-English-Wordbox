import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import VocabularyBook from '@/models/VocabularyBook'
import Word from '@/models/Word'

// 获取所有公开的词汇书
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    const books = await VocabularyBook.find({ isPublic: true })
      .populate('words', 'word pronunciation meaning')
      .sort({ category: 1, level: 1 })

    return NextResponse.json({ books })
  } catch (error) {
    console.error('获取词汇书失败:', error)
    return NextResponse.json(
      { error: '获取词汇书失败' },
      { status: 500 }
    )
  }
}

// 创建新词汇书（管理员功能）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, category, level, words } = body

    await connectDB()

    // 创建或查找单词
    const wordIds = []
    for (const wordData of words) {
      let word = await Word.findOne({ word: wordData.word.toLowerCase() })
      if (!word) {
        word = await Word.create({
          word: wordData.word.toLowerCase(),
          pronunciation: wordData.pronunciation || '',
          meaning: wordData.meaning,
          partOfSpeech: wordData.partOfSpeech || 'noun',
          difficulty: wordData.difficulty || 5,
        })
      }
      wordIds.push(word._id)
    }

    // 创建词汇书
    const vocabularyBook = await VocabularyBook.create({
      name,
      description,
      category,
      level,
      wordCount: wordIds.length,
      words: wordIds,
      createdBy: session.user.id,
      isPublic: true,
    })

    return NextResponse.json(
      { vocabularyBook },
      { status: 201 }
    )
  } catch (error) {
    console.error('创建词汇书失败:', error)
    return NextResponse.json(
      { error: '创建词汇书失败' },
      { status: 500 }
    )
  }
}

