import { useResources } from '../hooks/useResources'
import { useAppStore } from '../store/appStore'
import { ResourceGrid } from '../components/resources/ResourceGrid'
import { Book, FileText, Video, Wrench, GraduationCap } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const categories = [
  { id: 'all', label: 'all', icon: FileText },
  { id: 'book', label: 'books', icon: Book },
  { id: 'article', label: 'articles', icon: FileText },
  { id: 'video', label: 'videos', icon: Video },
  { id: 'tool', label: 'tools', icon: Wrench },
  { id: 'course', label: 'courses', icon: GraduationCap },
]

export function Resources() {
  const { resources } = useResources()
  const { selectedCategory, setSelectedCategory } = useAppStore()
  const { t, lang } = useLanguage()
  const resourcesT = t('resources')

  const categoryCounts = resources.reduce((acc, resource) => {
    acc[resource.category] = (acc[resource.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getCategoryLabel = (id: string) => {
    if (lang === 'zh') {
      const zhLabels: Record<string, string> = {
        all: resourcesT.all,
        book: resourcesT.books,
        article: resourcesT.articles,
        video: resourcesT.videos,
        tool: resourcesT.tools,
        course: resourcesT.courses,
      }
      return zhLabels[id] || id
    }
    return resourcesT[id as keyof typeof resourcesT] || id
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{resourcesT.title}</h1>
        <p className="text-slate-400">{resourcesT.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon
          const count = category.id === 'all' ? resources.length : categoryCounts[category.id] || 0
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === category.id || (selectedCategory === null && category.id === 'all')
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {getCategoryLabel(category.id)}
              <span className="opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      <ResourceGrid />
    </div>
  )
}
