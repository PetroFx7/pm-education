export const isoDay = (d: Date = new Date()): string => d.toISOString().slice(0, 10)
export const today = (): string => isoDay()
