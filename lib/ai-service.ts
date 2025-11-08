import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

/**
 * 为单词生成多个例句
 */
export async function generateExampleSentences(
  word: string,
  meaning: string,
  count: number = 5
): Promise<Array<{ sentence: string; translation: string }>> {
  if (!process.env.OPENAI_API_KEY) {
    // 返回模拟数据
    return Array.from({ length: count }, (_, i) => ({
      sentence: `This is example sentence ${i + 1} with the word "${word}".`,
      translation: `这是包含单词"${word}"的示例句子 ${i + 1}。`,
    }))
  }

  try {
    const prompt = `请为英语单词"${word}"（中文意思：${meaning}）生成${count}个实用、自然的例句。
要求：
1. 每个例句要自然、实用，适合日常使用
2. 例句长度适中（10-25个单词）
3. 每个例句提供准确的中文翻译
4. 例句应该展示单词的不同用法和语境

请用JSON数组格式返回，每个对象包含：sentence（英文句子）和translation（中文翻译）`

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
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content || '[]'
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('无法解析AI响应')
  } catch (error) {
    console.error('生成例句失败:', error)
    // 返回默认例句
    return [
      {
        sentence: `This is an example sentence with "${word}".`,
        translation: `这是一个包含"${word}"的示例句子。`,
      },
    ]
  }
}

/**
 * 评估用户创建的句子
 */
export async function evaluateUserSentence(
  word: string,
  meaning: string,
  userSentence: string
): Promise<{
  score: number // 0-100
  feedback: string
  corrections: string[]
  suggestions: string[]
}> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      score: 75,
      feedback: '这是一个不错的句子。',
      corrections: [],
      suggestions: ['可以尝试使用更复杂的句式。'],
    }
  }

  try {
    const prompt = `请评估用户使用单词"${word}"（中文意思：${meaning}）创建的句子。

用户句子：${userSentence}

请从以下方面评估：
1. 语法正确性
2. 单词使用准确性
3. 句子自然度
4. 语境 appropriateness

请用JSON格式返回：
{
  "score": 0-100的分数,
  "feedback": "总体反馈（中文）",
  "corrections": ["需要修正的地方（如果有）"],
  "suggestions": ["改进建议"]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的英语教学助手，请准确评估学生的句子并提供建设性反馈。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('无法解析AI响应')
  } catch (error) {
    console.error('评估句子失败:', error)
    return {
      score: 70,
      feedback: '评估过程中出现错误，请稍后重试。',
      corrections: [],
      suggestions: [],
    }
  }
}

/**
 * 生成翻译提示（部分提示）
 */
export async function generateTranslationHint(
  sentence: string,
  word: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return '提示：注意句子的时态和语序。'
  }

  try {
    const prompt = `请为以下英文句子提供翻译提示（不要直接给出完整翻译，只给部分提示如关键词、句式结构等）：

句子：${sentence}
目标单词：${word}

请用中文提供提示，帮助学生学习翻译。`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的英语教学助手，请提供适度的提示帮助学生，不要直接给出答案。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    })

    return completion.choices[0]?.message?.content || '提示：注意句子的时态和语序。'
  } catch (error) {
    console.error('生成提示失败:', error)
    return '提示：注意句子的时态和语序。'
  }
}

