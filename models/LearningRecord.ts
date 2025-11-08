import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILearningRecord extends Document {
  userId: mongoose.Types.ObjectId
  wordId: mongoose.Types.ObjectId
  vocabularyBookId: mongoose.Types.ObjectId
  // 间隔重复相关
  easeFactor: number // 易度因子 (默认2.5)
  interval: number // 复习间隔（天数）
  repetitions: number // 重复次数
  nextReviewDate: Date // 下次复习日期
  lastReviewDate?: Date // 上次复习日期
  // 学习统计
  reviewCount: number // 复习总次数
  successCount: number // 成功次数
  failCount: number // 失败次数
  // 句子创作
  userSentences: Array<{
    sentence: string
    aiFeedback: string
    score: number
    createdAt: Date
  }>
  // 状态
  isMastered: boolean
  createdAt: Date
  updatedAt: Date
}

const LearningRecordSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wordId: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: true,
    },
    vocabularyBookId: {
      type: Schema.Types.ObjectId,
      ref: 'VocabularyBook',
      required: true,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
      min: 1.3,
    },
    interval: {
      type: Number,
      default: 1, // 天数
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    nextReviewDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastReviewDate: {
      type: Date,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failCount: {
      type: Number,
      default: 0,
    },
    userSentences: [
      {
        sentence: String,
        aiFeedback: String,
        score: Number,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isMastered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// 复合索引
LearningRecordSchema.index({ userId: 1, wordId: 1, vocabularyBookId: 1 }, { unique: true })
LearningRecordSchema.index({ userId: 1, nextReviewDate: 1 })
LearningRecordSchema.index({ userId: 1, vocabularyBookId: 1, isMastered: 1 })

const LearningRecord: Model<ILearningRecord> =
  mongoose.models.LearningRecord || mongoose.model<ILearningRecord>('LearningRecord', LearningRecordSchema)

export default LearningRecord

