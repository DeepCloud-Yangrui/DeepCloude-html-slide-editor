const OLD_STORE_KEY = 'narration-presentation-state'
export const STORE_KEY = 'html-slide-editor-state'

export function migrateFromOldKey(): void {
  try {
    const hasNew = !!localStorage.getItem(STORE_KEY)
    if (hasNew) return // already migrated or fresh start

    const oldData = localStorage.getItem(OLD_STORE_KEY)
    if (oldData) {
      localStorage.setItem(STORE_KEY, oldData)
      // Keep old key as backup — don't delete
      console.log('Migrated from old localStorage key:', OLD_STORE_KEY, '→', STORE_KEY)
    }
  } catch (err) {
    console.error('localStorage migration failed:', err)
  }
}

export function hasSavedProject(): boolean {
  try {
    return !!localStorage.getItem(STORE_KEY) || !!localStorage.getItem(OLD_STORE_KEY)
  } catch {
    return false
  }
}

export function getSavedProjectInfo(): { title: string; slideCount: number } | null {
  try {
    const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(OLD_STORE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return {
      title: data?.state?.title || '未命名幻灯片',
      slideCount: data?.state?.slides?.length || 0,
    }
  } catch {
    return null
  }
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('Failed to remove from localStorage:', err)
  }
}
