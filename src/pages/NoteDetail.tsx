import { useParams, Link } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { ArrowLeft, Calendar, Tag, GitBranch } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useLanguage } from '../context/LanguageContext'

export function NoteDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { notes } = useNotes()
  const { t } = useLanguage()
  const noteDetailT = t('noteDetail')
  
  const note = notes.find((n) => n.slug === slug)
  
  if (!note) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">{noteDetailT.noteNotFound}</h1>
        <Link to="/garden" className="text-emerald-400 hover:text-emerald-300">
          {noteDetailT.backToGarden}
        </Link>
      </div>
    )
  }

  const backlinkNotes = notes.filter((n) => note.backlinks.includes(n.slug))

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/garden"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {noteDetailT.backToGarden}
        </Link>
      </div>

      <article className="max-w-3xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{note.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {noteDetailT.updated} {note.updatedAt}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-invert max-w-none text-slate-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </div>

        {backlinkNotes.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-400" />
              {noteDetailT.backlinks} ({backlinkNotes.length})
            </h2>
            <ul className="space-y-2">
              {backlinkNotes.map((backlinkNote) => (
                <li key={backlinkNote.slug}>
                  <Link
                    to={`/garden/note/${backlinkNote.slug}`}
                    className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {backlinkNote.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  )
}
