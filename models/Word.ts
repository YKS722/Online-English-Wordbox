import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWord extends Document {
  word: string
  pronunciation: string
  meaning: string
  partOfSpeech: string // 词性
  frequency: number // 词频
  difficulty: number // 难度 1-10
  createdAt: Date
  updatedAt: Date
}

const WordSchema: Schema = new Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pronunciation: {
      type: String,
      required: true,
    },
    meaning: {
      type: String,
      required: true,
    },
    partOfSpeech: {
      type: String,
      default: 'noun',
    },
    frequency: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
)

WordSchema.index({ word: 1 })
WordSchema.index({ difficulty: 1 })
WordSchema.index({ frequency: -1 })

const Word: Model<IWord> = mongoose.models.Word || mongoose.model<IWord>('Word', WordSchema)

export default Word

