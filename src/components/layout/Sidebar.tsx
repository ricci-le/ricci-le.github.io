import { useAppStore } from '../../store/appStore'
import { Tag, BookOpen, ExternalLink, Sparkles } from 'lucide-react'
import { useNotes } from '../../hooks/useNotes'
import { useResources } from '../../hooks/useResources'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export function Sidebar() {
  const { notes } = useNotes()
  const { resources } = useResources()
  const { selectedTag, setSelectedTag } = useAppStore()
  const { t } = useLanguage()
  const sidebarT = t('sidebar')

  const allTags = [
    ...notes.flatMap((note) => note.tags.map((tag) => ({ name: tag, type: 'note' as const }))),
    ...resources.flatMap((res) => res.tags.map((tag) => ({ name: tag, type: 'resource' as const }))),
  ]

  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag.name] = (acc[tag.name] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const sortedTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {sidebarT.quickStats}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">{t('home').notes}</span>
              <span className="text-emerald-400 font-bold">{notes.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">{t('home').resources}</span>
              <span className="text-teal-400 font-bold">{resources.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">{t('home').tags}</span>
              <span className="text-amber-400 font-bold">{sortedTags.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            {sidebarT.recentNotes}
          </h3>
          <ul className="space-y-2">
            {notes.slice(0, 5).map((note) => (
              <li key={note.slug}>
                <Link
                  to={`/garden/note/${note.slug}`}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors truncate"
                  title={note.title}
                >
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
            <ExternalLink className="w-4 h-4 text-teal-400" />
            {sidebarT.popularResources}
          </h3>
          <ul className="space-y-2">
            {resources.slice(0, 5).map((resource) => (
              <li key={resource.slug}>
                <Link
                  to={`/resources/${resource.slug}`}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors truncate"
                  title={resource.title}
                >
                  {resource.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
            <Tag className="w-4 h-4 text-amber-400" />
            {sidebarT.tags}
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortedTags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTag === tag.name
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tag.name}
                <span className="ml-1 opacity-70">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
