import { Note } from '../types'

const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

export function parseMarkdown(content: string): { metadata: Partial<Note>; body: string } {
  const match = content.match(FRONTMATTER_REGEX)
  
  if (!match) {
    return {
      metadata: {
        title: 'Untitled',
        tags: [],
      },
      body: content,
    }
  }
  
  const frontmatter = match[1]
  const body = match[2]
  
  const metadata: Partial<Note> = {
    title: 'Untitled',
    tags: [],
  }
  
  const lines = frontmatter.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('title:')) {
      metadata.title = trimmed.replace('title:', '').trim().replace(/^["']|["']$/g, '')
    } else if (trimmed.startsWith('tags:')) {
      const tagsStr = trimmed.replace('tags:', '').trim()
      try {
        metadata.tags = JSON.parse(tagsStr)
      } catch {
        metadata.tags = tagsStr.split(',').map(t => t.trim().replace(/[\[\]'" ]/g, '')).filter(Boolean)
      }
    } else if (trimmed.startsWith('createdAt:')) {
      metadata.createdAt = trimmed.replace('createdAt:', '').trim().replace(/^["']|["']$/g, '')
    } else if (trimmed.startsWith('updatedAt:')) {
      metadata.updatedAt = trimmed.replace('updatedAt:', '').trim().replace(/^["']|["']$/g, '')
    }
  }
  
  return { metadata, body }
}

export function extractLinks(content: string): string[] {
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g
  const links: string[] = []
  let match
  
  while ((match = wikilinkRegex.exec(content)) !== null) {
    links.push(match[1])
  }
  
  return links
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
