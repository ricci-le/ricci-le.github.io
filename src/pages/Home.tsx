import { Link } from 'react-router-dom'
import { BookOpen, FolderOpen, Sparkles, ArrowRight, TrendingUp, Clock, Award } from 'lucide-react'
import { useNotes } from '../hooks/useNotes'
import { useResources } from '../hooks/useResources'
import { useLanguage } from '../context/LanguageContext'

export function Home() {
  const { notes } = useNotes()
  const { resources } = useResources()
  const { t, lang } = useLanguage()
  const homeT = t('home')
  
  const recentNotes = notes.slice(0, 3)
  const recentResources = resources.slice(0, 3)

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {homeT.welcome}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {homeT.title.split(',')[0]},
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {homeT.title.split(',')[1]?.trim()}
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-8 max-w-xl">
            {homeT.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/garden"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg text-white font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/25"
            >
              <BookOpen className="w-5 h-5" />
              {homeT.exploreGarden}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 rounded-lg text-white font-semibold hover:bg-slate-600 transition-all"
            >
              <FolderOpen className="w-5 h-5" />
              {homeT.resourceHub}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">{homeT.notes}</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{notes.length}</p>
          <p className="text-sm text-slate-400">{homeT.growingCollection}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">{homeT.resources}</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{resources.length}</p>
          <p className="text-sm text-slate-400">{homeT.curatedMaterials}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">{homeT.tags}</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {[...new Set([...notes.flatMap(n => n.tags), ...resources.flatMap(r => r.tags)])].length}
          </p>
          <p className="text-sm text-slate-400">{homeT.organizedTopics}</p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{homeT.recentNotes}</h2>
          <Link to="/garden" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1">
            {homeT.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentNotes.map((note) => (
            <Link
              key={note.slug}
              to={`/garden/note/${note.slug}`}
              className="block bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-emerald-500/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-slate-200 hover:text-emerald-400 mb-2">{lang === 'zh' ? note.title : note.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {note.updatedAt}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {note.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-700/50 rounded-full text-xs text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{homeT.popularResources}</h2>
          <Link to="/resources" className="text-teal-400 hover:text-teal-300 text-sm font-medium flex items-center gap-1">
            {homeT.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentResources.map((resource) => (
            <Link
              key={resource.slug}
              to={`/resources/${resource.slug}`}
              className="block bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-teal-500/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 uppercase">
                  {lang === 'zh' 
                    ? { book: '书籍', article: '文章', video: '视频', tool: '工具', course: '课程' }[resource.category]
                    : resource.category
                  }
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-200 hover:text-teal-400 mb-2">{resource.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{resource.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
