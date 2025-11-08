import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IVocabularyBook extends Document {
  name: string
  description: string
  category: 'IELTS' | 'TOEFL' | 'GRE' | 'CET-4' | 'CET-6' | 'OTHER'
  level: number // 1-10
  wordCount: number
  isPublic: boolean
  createdBy?: mongoose.Types.ObjectId
  words: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const VocabularyBookSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['IELTS', 'TOEFL', 'GRE', 'CET-4', 'CET-6', 'OTHER'],
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    words: [
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

const VocabularyBook: Model<IVocabularyBook> =
  mongoose.models.VocabularyBook || mongoose.model<IVocabularyBook>('VocabularyBook', VocabularyBookSchema)

export default VocabularyBook

