import { Link } from 'react-router-dom'
import { Book, FileText, Video, Wrench, GraduationCap, Tag, ExternalLink } from 'lucide-react'
import { Resource } from '../../types'

interface ResourceCardProps {
  resource: Resource
}

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

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = categoryIcons[resource.category]

  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="group block bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${categoryColors[resource.category]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 uppercase">
              {resource.category}
            </span>
            {resource.year && (
              <span className="text-xs text-slate-500">{resource.year}</span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-teal-400 transition-colors mb-2 truncate">
            {resource.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ExternalLink className="flex-shrink-0 w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors" />
      </div>
    </Link>
  )
}
