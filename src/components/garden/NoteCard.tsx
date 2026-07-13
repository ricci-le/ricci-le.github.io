import { Link } from 'react-router-dom'
import { Calendar, Tag, GitBranch } from 'lucide-react'
import { Note } from '../../types'

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const truncateContent = (content: string, maxLength: number) => {
    const plainText = content.replace(/[#*`[\]]/g, ' ').replace(/\s+/g, ' ')
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText
  }

  return (
    <Link
      to={`/garden/note/${note.slug}`}
      className="group block bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors mb-2">
        {note.title}
      </h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
        {truncateContent(note.content, 120)}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {note.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
        {note.tags.length > 3 && (
          <span className="text-xs text-slate-500">+{note.tags.length - 3}</span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {note.updatedAt}
        </span>
        {note.backlinks.length > 0 && (
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            {note.backlinks.length} backlinks
          </span>
        )}
      </div>
    </Link>
  )
}
