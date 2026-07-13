import { useState } from 'react'
import { FileText, ExternalLink, Settings } from 'lucide-react'
import { NoteEditor } from '../components/admin/NoteEditor'
import { ResourceManager } from '../components/admin/ResourceManager'
import { useLanguage } from '../context/LanguageContext'

type TabType = 'notes' | 'resources'

export function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('notes')
  const { t } = useLanguage()
  const adminT = t('admin')

  const tabs = [
    { id: 'notes' as TabType, label: adminT.notes, icon: FileText },
    { id: 'resources' as TabType, label: adminT.resources, icon: ExternalLink },
  ]

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{adminT.pageTitle}</h1>
            <p className="text-slate-400 text-sm">{adminT.pageDescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === 'notes' ? <NoteEditor /> : <ResourceManager />}
    </div>
  )
}
