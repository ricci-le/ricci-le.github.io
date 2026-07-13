import { useParams, Link } from 'react-router-dom'
import { useResources } from '../hooks/useResources'
import { ArrowLeft, ExternalLink, Book, FileText, Video, Wrench, GraduationCap, Tag, Calendar, User } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const categoryIcons = {
  book: Book,
  article: FileText,
  video: Video,
  tool: Wrench,
  course: GraduationCap,
}

const categoryColors = {
  book: 'text-amber-400 bg-amber-400/10',
  article: 'text-blue-400 bg-blue-400/10',
  video: 'text-purple-400 bg-purple-400/10',
  tool: 'text-cyan-400 bg-cyan-400/10',
  course: 'text-pink-400 bg-pink-400/10',
}

export function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { resources } = useResources()
  const { t, lang } = useLanguage()
  const resourceDetailT = t('resourceDetail')
  
  const resource = resources.find((r) => r.slug === slug)
  
  if (!resource) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">{resourceDetailT.resourceNotFound}</h1>
        <Link to="/resources" className="text-teal-400 hover:text-teal-300">
          {resourceDetailT.backToResources}
        </Link>
      </div>
    )
  }

  const Icon = categoryIcons[resource.category]

  const getCategoryLabel = () => {
    if (lang === 'zh') {
      const zhLabels: Record<string, string> = {
        book: '书籍',
        article: '文章',
        video: '视频',
        tool: '工具',
        course: '课程',
      }
      return zhLabels[resource.category]
    }
    return resource.category
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/resources"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {resourceDetailT.backToResources}
        </Link>
      </div>

      <article className="max-w-3xl">
        <header className="mb-8">
          <div className="flex items-start gap-6">
            <div className={`flex-shrink-0 w-16 h-16 rounded-xl ${categoryColors[resource.category]} flex items-center justify-center`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 uppercase">
                  {getCategoryLabel()}
                </span>
                {resource.year && (
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {resource.year}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">{resource.title}</h1>
              {resource.author && (
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <User className="w-4 h-4" />
                  {resource.author}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-8">
          <p className="text-lg text-slate-300 leading-relaxed">{resource.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg text-white font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/25"
          >
            <ExternalLink className="w-5 h-5" />
            {resourceDetailT.visitResource}
          </a>
          <span className="inline-flex items-center justify-center px-4 py-3 bg-slate-800 rounded-lg text-slate-400 text-sm">
            {resourceDetailT.topic} {resource.topic}
          </span>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            {resourceDetailT.tags}
          </h2>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-slate-800/50 rounded-lg text-sm text-slate-300 border border-slate-700/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
