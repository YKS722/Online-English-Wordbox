import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import Link from 'next/link'
import { BookOpen, Sparkles, Target, TrendingUp } from 'lucide-react'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">英语单词学习助手</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                登录
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                注册
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            智能英语单词学习平台
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            AI驱动的个性化学习体验，助你轻松掌握英语单词
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              开始学习
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold"
            >
              已有账户
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI智能学习</h3>
            <p className="text-gray-600">
              AI自动生成例句和翻译，提供个性化学习反馈，帮助您更快掌握单词
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">间隔重复复习</h3>
            <p className="text-gray-600">
              基于科学的间隔重复算法，优化复习时间，提高记忆效率
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">丰富词汇书</h3>
            <p className="text-gray-600">
              支持IELTS、TOEFL、GRE、CET-4/6等多种词汇书，满足不同学习需求
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✓ 词汇书系统</h4>
              <p className="text-gray-600 text-sm">支持多种词汇书，管理员可导入词汇列表</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✓ AI例句生成</h4>
              <p className="text-gray-600 text-sm">自动生成3-5个实用例句，帮助理解单词用法</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✓ 翻译练习</h4>
              <p className="text-gray-600 text-sm">中英文互译练习，提供提示功能</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✓ 句子创作</h4>
              <p className="text-gray-600 text-sm">创作句子，AI评估并提供改进建议</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✓ 间隔重复</h4>
              <p className="text-gray-600 text-sm">基于遗忘曲线的智能复习系统</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✓ 进度跟踪</h4>
              <p className="text-gray-600 text-sm">详细的学习统计和进度可视化</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
