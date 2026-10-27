import { Marked } from 'marked'

const md = new Marked({ gfm: true })

// Таблиці загортаємо, щоб вони прокручувались горизонтально на вузьких екранах
export function renderMarkdown(src: string): string {
  return (md.parse(src) as string)
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
}
