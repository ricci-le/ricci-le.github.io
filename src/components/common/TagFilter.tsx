import { useAppStore } from '../../store/appStore'
import { Tag } from 'lucide-react'

interface TagFilterProps {
  tags: { name: string; count: number }[]
}

export function TagFilter({ tags }: TagFilterProps) {
  const { selectedTag, setSelectedTag } = useAppStore()

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSelectedTag(null)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
          !selectedTag
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        <Tag className="w-3 h-3" />
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.name}
          onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            selectedTag === tag.name
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <Tag className="w-3 h-3" />
          {tag.name}
          <span className="opacity-70">({tag.count})</span>
        </button>
      ))}
    </div>
  )
}
