import { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { Note } from '../types'
import { parseMarkdown, extractLinks } from '../utils/markdownParser'
import gettingStarted from '../../data/notes/getting-started.md?raw'
import knowledgeGraph from '../../data/notes/knowledge-graph.md?raw'
import tagSystem from '../../data/notes/tag-system.md?raw'

const NOTE_FILES = [
  { filename: 'getting-started.md', content: gettingStarted },
  { filename: 'knowledge-graph.md', content: knowledgeGraph },
  { filename: 'tag-system.md', content: tagSystem },
]

function parseNotesFromContent(notesData: { filename: string; content: string }[]): Note[] {
  const parsedNotes: Note[] = notesData.map(({ filename, content }) => {
    const { metadata, body } = parseMarkdown(content)
    const links = extractLinks(body)
    const slug = filename.replace('.md', '')
    
    return {
      id: slug,
      slug,
      title: metadata.title || 'Untitled',
      content: body,
      tags: metadata.tags || [],
      createdAt: metadata.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: metadata.updatedAt || new Date().toISOString().split('T')[0],
      links,
      backlinks: [],
    }
  })
  
  parsedNotes.forEach(note => {
    note.backlinks = parsedNotes
      .filter(other => other.links.includes(note.title))
      .map(other => other.slug)
  })
  
  return parsedNotes
}

export function useNotes() {
  const { notes, setNotes } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const fetchNotes = async () => {
      if (import.meta.env.DEV) {
        try {
          const response = await fetch('/api/admin/notes')
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            const parsed = parseNotesFromContent(data.data)
            setNotes(parsed)
            return
          }
        } catch {
        }
      }
      
      const parsedNotes = parseNotesFromContent(NOTE_FILES)
      setNotes(parsedNotes)
    }
    
    fetchNotes()
  }, [setNotes])

  const refreshNotes = async () => {
    if (!import.meta.env.DEV) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/notes')
      const data = await response.json()
      if (data.success) {
        const parsed = parseNotesFromContent(data.data)
        setNotes(parsed)
      }
    } catch {
    } finally {
      setIsLoading(false)
    }
  }
  
  return { notes, refreshNotes, isLoading }
}
