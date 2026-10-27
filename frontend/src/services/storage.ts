// Збереження прогресу в localStorage. Сховище може бути недоступне
// (приватний режим, заблоковані дані), тож усі виклики безпечні.
export function readSave<T>(key: string): Partial<T> | null {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') as Partial<T> | null
  } catch {
    return null
  }
}

export function writeSave(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* граємо без збереження */
  }
}

export function clearSave(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
