/**
 * 间隔重复算法 (SuperMemo 2 算法)
 * 基于用户的答题表现更新复习间隔
 */

export interface SpacedRepetitionResult {
  easeFactor: number
  interval: number // 天数
  repetitions: number
  nextReviewDate: Date
}

export interface ReviewQuality {
  quality: number // 0-5: 0=完全忘记, 5=完全记住
}

/**
 * 计算下次复习时间
 * @param currentEaseFactor 当前易度因子
 * @param currentInterval 当前间隔（天数）
 * @param currentRepetitions 当前重复次数
 * @param quality 本次复习质量 (0-5)
 */
export function calculateNextReview(
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetitions: number,
  quality: number
): SpacedRepetitionResult {
  let newEaseFactor = currentEaseFactor
  let newInterval = currentInterval
  let newRepetitions = currentRepetitions

  // 更新易度因子
  newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEaseFactor = Math.max(1.3, newEaseFactor) // 最小值为1.3

  // 根据质量更新间隔和重复次数
  if (quality < 3) {
    // 回答错误，重置
    newRepetitions = 0
    newInterval = 1
  } else {
    // 回答正确
    if (newRepetitions === 0) {
      newInterval = 1
    } else if (newRepetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(currentInterval * newEaseFactor)
    }
    newRepetitions = newRepetitions + 1
  }

  // 计算下次复习日期
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
  }
}

/**
 * 获取需要复习的单词数量
 */
export function getWordsToReview(nextReviewDate: Date): boolean {
  return nextReviewDate <= new Date()
}

