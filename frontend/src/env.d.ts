/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

declare module '*.md?raw' {
  const content: string
  export default content
}
