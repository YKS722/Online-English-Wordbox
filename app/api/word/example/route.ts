import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { word, meaning } = await request.json()

    if (!word) {
      return NextResponse.json(
        { error: '请提供单词' },
        { status: 400 }
      )
    }

    // 如果没有配置API Key，返回模拟数据
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        example: `This is an example sentence with "${word}".`,
        exampleTranslation: `这是一个包含"${word}"的示例句子。`,
      })
    }

    // 使用AI生成例句
    const prompt = `请为英语单词"${word}"（中文意思：${meaning || '未知'}）生成一个实用的例句。
要求：
1. 例句要自然、实用，适合日常使用
2. 例句长度适中（10-20个单词）
3. 提供中文翻译

请用JSON格式返回，字段名：example, exampleTranslation`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的英语教学助手，专门帮助中国学生学习英语单词。请生成自然实用的例句。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    // 尝试解析JSON响应
    let exampleData
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        exampleData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('无法解析JSON')
      }
    } catch (error) {
      // 如果解析失败，返回默认例句
      exampleData = {
        example: `This is an example sentence with "${word}".`,
        exampleTranslation: `这是一个包含"${word}"的示例句子。`,
      }
    }

    return NextResponse.json({
      example: exampleData.example || `This is an example sentence with "${word}".`,
      exampleTranslation: exampleData.exampleTranslation || `这是一个包含"${word}"的示例句子。`,
    })
  } catch (error) {
    console.error('AI API错误:', error)
    return NextResponse.json(
      { error: '生成例句失败，请稍后重试' },
      { status: 500 }
    )
  }
}

