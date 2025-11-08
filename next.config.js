/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 注意：Vercel 会自动处理构建输出，不需要设置 output: 'standalone'
  
  // 环境变量说明：
  // 环境变量会自动从 process.env 中读取，无需在 next.config.js 中显式声明
  // 
  // 必需的环境变量：
  // - MONGODB_URI: MongoDB 连接字符串（在 lib/mongodb.ts 中验证）
  // - NEXTAUTH_SECRET: NextAuth 密钥（在 app/api/auth/[...nextauth]/route.ts 中验证）
  // 
  // 推荐的环境变量：
  // - NEXTAUTH_URL: NextAuth 回调 URL（如果未设置，NextAuth 会使用 VERCEL_URL）
  // 
  // 可选的环境变量：
  // - OPENAI_API_KEY: OpenAI API 密钥（用于 AI 功能）
  // - GOOGLE_CLIENT_ID: Google OAuth Client ID
  // - GOOGLE_CLIENT_SECRET: Google OAuth Client Secret
  //
  // 部署检查：
  // - 应用启动时会自动检查必需的环境变量
  // - 如果缺少必需变量，会抛出清晰的错误消息
  // - 查看 VERCEL_DEPLOYMENT_CHECKLIST.md 了解完整的部署指南
}

module.exports = nextConfig

