/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 注意：Vercel 会自动处理构建输出，不需要设置 output: 'standalone'
  // 环境变量会自动从 process.env 中读取，无需在 next.config.js 中显式声明
  // 但为了文档目的，这里列出所有使用的环境变量：
  // - MONGODB_URI: MongoDB 连接字符串
  // - NEXTAUTH_URL: NextAuth 回调 URL (Vercel 会自动使用 VERCEL_URL)
  // - NEXTAUTH_SECRET: NextAuth 密钥
  // - OPENAI_API_KEY: OpenAI API 密钥（可选）
  // - GOOGLE_CLIENT_ID: Google OAuth Client ID（可选）
  // - GOOGLE_CLIENT_SECRET: Google OAuth Client Secret（可选）
}

module.exports = nextConfig

