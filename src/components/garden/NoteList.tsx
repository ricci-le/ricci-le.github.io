import { useNotes } from '../../hooks/useNotes'
import { useAppStore } from '../../store/appStore'
import { NoteCard } from './NoteCard'
import Empty from '../Empty'

export function NoteList() {
  const { notes } = useNotes()
  const { searchQuery, selectedTag } = useAppStore()

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || note.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  if (filteredNotes.length === 0) {
    return (
      <Empty
        title="No notes found"
        description="Try adjusting your search or tag filter"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredNotes.map((note) => (
        <NoteCard key={note.slug} note={note} />
      ))}
    </div>
  )
}
