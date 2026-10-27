// Парсер курсу: перетворює pm-course.md на модулі (локації), уроки (квести),
// питання для рефлексії («Перевір себе») та глосарій (Кодекс).
import raw from '../../pm-course.md?raw'
import { MODULE_META } from '../data/world'
import type { CourseModule, GlossaryTerm, Lesson } from '../domain/types'

const chunks = raw.split(/^## /m).slice(1)

function readMinutes(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).length / 170))
}

function parseModule(id: number, title: string, body: string): CourseModule {
  const parts = body.replace(/\n---\s*$/m, '').split(/^### /m)
  const intro = (parts.shift() ?? '').trim()
  const lessons: Lesson[] = []
  let reflection: string[] = []
  for (const part of parts) {
    const nl = part.indexOf('\n')
    const heading = part.slice(0, nl).trim()
    const content = part.slice(nl + 1).replace(/\n---\s*$/, '').trim()
    if (/^Перевір себе/i.test(heading)) {
      reflection = content
        .split('\n')
        .map((l) => l.match(/^\d+\.\s+(.*)$/))
        .filter((m): m is RegExpMatchArray => m !== null)
        .map((m) => m[1].trim())
      continue
    }
    const num = heading.match(/^(\d+\.\d+)\.\s*/)
    lessons.push({
      id: `${id}-${lessons.length + 1}`,
      moduleId: id,
      number: num ? num[1] : '★',
      title: heading.replace(/^\d+\.\d+\.\s*/, ''),
      content,
      minutes: readMinutes(content),
    })
  }
  return { id, title, intro, lessons, reflection, ...MODULE_META[id] }
}

function parseGlossary(body: string): GlossaryTerm[] {
  return body
    .split('\n')
    .filter((l) => l.startsWith('|') && !/^\|\s*-/.test(l))
    .slice(1)
    .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()))
    .map(([abbr, full, meaning]) => ({ abbr, full, meaning }))
}

export const modules: CourseModule[] = []
export let glossary: GlossaryTerm[] = []

for (const chunk of chunks) {
  const nl = chunk.indexOf('\n')
  const heading = chunk.slice(0, nl).trim()
  const body = chunk.slice(nl + 1)
  const m = heading.match(/^Модуль\s+(\d+)\.\s*(.*)$/)
  if (m) modules.push(parseModule(Number(m[1]), m[2], body))
  else if (/^Глосарій/.test(heading)) glossary = parseGlossary(body)
}

export const moduleById = (id: number | string): CourseModule | undefined =>
  modules.find((m) => m.id === Number(id))
export const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)

// Практика: робочі ситуації (окремий модуль) і кейси з практики, розкидані по модулях
export type PracticeKind = 'situations' | 'cases'
export const PRACTICE_MODULE = 18
const CASE_PREFIX = /^Кейс з практики:\s*/

export const practice: Record<PracticeKind, Lesson[]> = {
  situations: moduleById(PRACTICE_MODULE)?.lessons ?? [],
  cases: modules.flatMap((m) => m.lessons.filter((l) => CASE_PREFIX.test(l.title))),
}

export const practiceTitle = (lesson: Lesson): string => lesson.title.replace(CASE_PREFIX, '')
