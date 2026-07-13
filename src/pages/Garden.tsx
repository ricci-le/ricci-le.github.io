import { useState } from 'react'
import { KnowledgeGraph } from '../components/garden/KnowledgeGraph'
import { NoteList } from '../components/garden/NoteList'
import { LayoutGrid, List } from 'lucide-react'
import { useNotes } from '../hooks/useNotes'
import { useLanguage } from '../context/LanguageContext'

export function Garden() {
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('list')
  const { notes } = useNotes()
  const { t } = useLanguage()
  const gardenT = t('garden')

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{gardenT.title}</h1>
          <p className="text-slate-400">{gardenT.description}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'graph'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            {gardenT.graph}
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'list'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <List className="w-4 h-4" />
            {gardenT.list}
          </button>
        </div>
      </div>

      {notes.length > 0 ? (
        viewMode === 'graph' ? (
          <KnowledgeGraph />
        ) : (
          <NoteList />
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">{gardenT.noNotes}</p>
        </div>
      )}
    </div>
  )
}
