/**
 * 初始化词汇书数据脚本
 * 运行方式: npx tsx scripts/init-books.ts
 */

// 必须在所有导入之前加载环境变量
import dotenv from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

// 检查环境变量文件（支持 .env.local 和 .env）
const envLocalPath = resolve(process.cwd(), '.env.local')
const envPath = resolve(process.cwd(), '.env')
const envFile = existsSync(envLocalPath) ? envLocalPath : (existsSync(envPath) ? envPath : null)

if (!envFile) {
  console.error('错误: 未找到环境变量文件！')
  console.error('')
  console.error('请创建 .env.local 文件（本地开发）或 .env 文件，并设置以下环境变量:')
  console.error('  MONGODB_URI=mongodb://localhost:27017/english-learning')
  console.error('  NEXTAUTH_URL=http://localhost:3000')
  console.error('  NEXTAUTH_SECRET=your-random-secret-key-here')
  console.error('  OPENAI_API_KEY=your_openai_api_key_here (可选)')
  console.error('')
  console.error('或参考 DEPLOYMENT.md 文件了解详细配置说明。')
  process.exit(1)
}

// 加载环境变量
const result = dotenv.config({ path: envFile })

if (result.error) {
  console.error(`错误: 无法加载环境变量文件 (${envFile}):`, result.error)
  process.exit(1)
}

// 验证 MONGODB_URI 是否已加载
if (!process.env.MONGODB_URI) {
  console.error('错误: MONGODB_URI 环境变量未设置！')
  console.error(`请在 ${envFile} 文件中设置 MONGODB_URI`)
  process.exit(1)
}

// 使用动态导入延迟加载依赖，确保环境变量已加载
const initBooks = async () => {
  const mongoose = (await import('mongoose')).default
  const connectDB = (await import('../lib/mongodb.js')).default
  const VocabularyBook = (await import('../models/VocabularyBook.js')).default
  const Word = (await import('../models/Word.js')).default

  const sampleWords = [
    { word: 'abandon', pronunciation: '/əˈbændən/', meaning: '放弃，抛弃', partOfSpeech: 'verb', difficulty: 3 },
    { word: 'ability', pronunciation: '/əˈbɪlɪti/', meaning: '能力，才能', partOfSpeech: 'noun', difficulty: 2 },
    { word: 'abnormal', pronunciation: '/æbˈnɔːrml/', meaning: '异常的，反常的', partOfSpeech: 'adjective', difficulty: 4 },
    { word: 'abolish', pronunciation: '/əˈbɒlɪʃ/', meaning: '废除，取消', partOfSpeech: 'verb', difficulty: 5 },
    { word: 'absorb', pronunciation: '/əbˈsɔːrb/', meaning: '吸收，吸引', partOfSpeech: 'verb', difficulty: 3 },
  ]

  try {
    await connectDB()
    console.log('数据库连接成功')

    // 创建示例单词
    const wordIds = []
    for (const wordData of sampleWords) {
      let word = await Word.findOne({ word: wordData.word.toLowerCase() })
      if (!word) {
        word = await Word.create(wordData)
        console.log(`创建单词: ${word.word}`)
      }
      wordIds.push(word._id)
    }

    // 创建示例词汇书
    const books = [
      {
        name: 'IELTS核心词汇',
        description: '雅思考试核心词汇，涵盖高频词汇',
        category: 'IELTS' as const,
        level: 5,
        wordCount: wordIds.length,
        words: wordIds,
        isPublic: true,
      },
      {
        name: 'TOEFL必备词汇',
        description: '托福考试必备词汇',
        category: 'TOEFL' as const,
        level: 6,
        wordCount: wordIds.length,
        words: wordIds,
        isPublic: true,
      },
      {
        name: '大学英语四级词汇',
        description: 'CET-4核心词汇',
        category: 'CET-4' as const,
        level: 3,
        wordCount: wordIds.length,
        words: wordIds,
        isPublic: true,
      },
    ]

    for (const bookData of books) {
      const existingBook = await VocabularyBook.findOne({ name: bookData.name })
      if (!existingBook) {
        await VocabularyBook.create(bookData)
        console.log(`创建词汇书: ${bookData.name}`)
      } else {
        console.log(`词汇书已存在: ${bookData.name}`)
      }
    }

    console.log('初始化完成！')
    process.exit(0)
  } catch (error) {
    console.error('初始化失败:', error)
    process.exit(1)
  }
}

initBooks()

