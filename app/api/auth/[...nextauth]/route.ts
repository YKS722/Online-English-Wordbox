import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// 验证 NEXTAUTH_SECRET
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
if (!NEXTAUTH_SECRET) {
  throw new Error(
    '❌ NEXTAUTH_SECRET 环境变量未定义。\n' +
    '请在 .env.local 文件中添加 NEXTAUTH_SECRET，或在 Vercel Dashboard 的 Environment Variables 中设置。\n' +
    '生成方式: openssl rand -base64 32'
  )
}

// 注意：NextAuth 会自动使用 process.env.NEXTAUTH_URL 环境变量
// 如果未设置 NEXTAUTH_URL，NextAuth 会尝试使用 VERCEL_URL（Vercel 自动设置）
// 在开发环境中，如果没有设置，NextAuth 会使用 http://localhost:3000

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('请提供邮箱和密码')
        }

        await connectDB()
        const user = await User.findOne({ email: credentials.email }).select('+password')

        if (!user || !user.password) {
          throw new Error('用户不存在或密码错误')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('密码错误')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: 'google',
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: NEXTAUTH_SECRET,
  // 使用环境变量中的 NEXTAUTH_URL
  // NextAuth 会自动使用 process.env.NEXTAUTH_URL 或 VERCEL_URL
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

