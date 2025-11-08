/**
 * 环境变量检查工具
 * 在应用启动时验证必需的环境变量是否存在
 */

/**
 * 检查必需的环境变量
 * 如果缺少必需的环境变量，会抛出错误
 */
export function checkEnvVars() {
  const requiredVars = [
    {
      name: 'MONGODB_URI',
      message: 'MONGODB_URI 环境变量未定义。请在 .env.local 文件中添加，或在 Vercel Dashboard 的 Environment Variables 中设置。',
    },
    {
      name: 'NEXTAUTH_SECRET',
      message: 'NEXTAUTH_SECRET 环境变量未定义。请生成一个随机字符串（使用 openssl rand -base64 32）并设置。',
    },
  ]

  const missingVars: string[] = []

  for (const { name, message } of requiredVars) {
    if (!process.env[name]) {
      missingVars.push(name)
      console.error(`❌ ${message}`)
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `缺少必需的环境变量: ${missingVars.join(', ')}\n` +
      '请检查 .env.local 文件或 Vercel Dashboard 的环境变量设置。'
    )
  }

  // 检查 NEXTAUTH_URL（在开发环境中给出警告，在生产环境中检查）
  if (!process.env.NEXTAUTH_URL) {
    if (process.env.NODE_ENV === 'production') {
      // 在生产环境中，如果 VERCEL_URL 存在，可以使用它
      if (!process.env.VERCEL_URL) {
        console.warn(
          '⚠️  NEXTAUTH_URL 环境变量未定义。' +
          '在生产环境中，建议手动设置 NEXTAUTH_URL，否则 NextAuth 可能无法正常工作。'
        )
      } else {
        console.log('ℹ️  使用 VERCEL_URL 作为 NEXTAUTH_URL')
      }
    } else {
      console.warn(
        '⚠️  NEXTAUTH_URL 环境变量未定义。' +
        '开发环境默认使用 http://localhost:3000，但建议在 .env.local 中显式设置。'
      )
    }
  }

  console.log('✅ 环境变量检查通过')
}

