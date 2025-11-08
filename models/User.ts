import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  password?: string
  name: string
  image?: string
  provider: 'credentials' | 'google'
  knownWords: string[] // 已掌握的单词ID数组
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // 默认不返回密码字段
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    knownWords: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Word',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User

