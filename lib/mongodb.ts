import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    '请定义 MONGODB_URI 环境变量。' +
    '在 .env.local 文件中添加 MONGODB_URI，或在 Vercel Dashboard 中设置环境变量。'
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

/**
 * 连接到 MongoDB 数据库
 * 使用连接池缓存，避免在服务器less环境中重复创建连接
 */
async function connectDB() {
  // 如果已经有缓存的连接，直接返回
  if (cached.conn) {
    return cached.conn
  }

  // 如果没有正在进行的连接，创建一个新的连接
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // 最大连接池大小
      serverSelectionTimeoutMS: 5000, // 服务器选择超时
      socketTimeoutMS: 45000, // Socket 超时
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ MongoDB 连接成功')
      }
      return mongoose
    }).catch((error) => {
      console.error('❌ MongoDB 连接失败:', error)
      cached.promise = null
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ MongoDB 连接错误:', e)
    throw e
  }

  return cached.conn
}

export default connectDB

