import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json()

    if (!word) {
      return NextResponse.json(
        { error: '请提供单词' },
        { status: 400 }
      )
    }

    // 如果没有配置API Key，返回模拟数据
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        word: word.toLowerCase(),
        pronunciation: '/wɜːrd/',
        meaning: '这是一个示例翻译（请配置OPENAI_API_KEY以使用AI功能）',
        example: `This is an example sentence with "${word}".`,
        exampleTranslation: `这是一个包含"${word}"的示例句子。`,
      })
    }

    // 使用AI生成单词信息
    const prompt = `请为一个英语单词提供详细信息，格式要求：
1. 单词：${word}
2. 音标（使用国际音标格式，如 /həˈloʊ/）
3. 中文意思（简洁明了，不超过20字）
4. 一个例句（英文）
5. 例句的中文翻译

请用JSON格式返回，字段名：word, pronunciation, meaning, example, exampleTranslation`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的英语教学助手，专门帮助中国学生学习英语单词。请用简洁明了的中文提供单词解释。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    // 尝试解析JSON响应
    let wordData
    try {
      // 尝试从响应中提取JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        wordData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('无法解析JSON')
      }
    } catch (error) {
      // 如果解析失败，手动构建数据
      wordData = {
        word: word.toLowerCase(),
        pronunciation: '/wɜːrd/',
        meaning: '未找到详细解释',
        example: `This is an example sentence with "${word}".`,
        exampleTranslation: `这是一个包含"${word}"的示例句子。`,
      }
    }

    return NextResponse.json({
      word: wordData.word || word.toLowerCase(),
      pronunciation: wordData.pronunciation || '/wɜːrd/',
      meaning: wordData.meaning || '未找到详细解释',
      example: wordData.example || '',
      exampleTranslation: wordData.exampleTranslation || '',
    })
  } catch (error) {
    console.error('AI API错误:', error)
    return NextResponse.json(
      { error: '获取单词信息失败，请稍后重试' },
      { status: 500 }
    )
  }
}

