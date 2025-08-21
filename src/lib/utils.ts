import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate)
  const today = new Date()
  
  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()
  
  if (months < 0) {
    years--
    months += 12
  }
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`
  }
  
  return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? `, ${months} month${months !== 1 ? 's' : ''}` : ''}`
}

export function calculateAgeInMonths(birthDate: string, referenceDate?: string): number {
  const birth = new Date(birthDate)
  const reference = referenceDate ? new Date(referenceDate) : new Date()
  
  const yearsDiff = reference.getFullYear() - birth.getFullYear()
  const monthsDiff = reference.getMonth() - birth.getMonth()
  
  return yearsDiff * 12 + monthsDiff
}

export function getMoodEmoji(mood: string): string {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    excited: '🤩',
    calm: '😌',
    neutral: '😐',
    fussy: '😤'
  }
  return moodEmojis[mood] || '😐'
}

export function getCategoryIcon(category: string): string {
  const categoryIcons: Record<string, string> = {
    physical: '🏃‍♀️',
    cognitive: '🧠',
    social: '👥',
    emotional: '❤️',
    sleep: '😴',
    meal: '🍽️',
    feeding: '🍼',
    diaper: '👶',
    play: '🎮',
    learning: '📚',
    outdoor: '🌳'
  }
  return categoryIcons[category] || '📝'
}