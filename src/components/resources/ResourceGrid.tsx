import { useResources } from '../../hooks/useResources'
import { useAppStore } from '../../store/appStore'
import { ResourceCard } from './ResourceCard'
import Empty from '../Empty'

export function ResourceGrid() {
  const { resources } = useResources()
  const { searchQuery, selectedTag, selectedCategory } = useAppStore()

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || resource.tags.includes(selectedTag)
    const matchesCategory = !selectedCategory || resource.category === selectedCategory
    return matchesSearch && matchesTag && matchesCategory
  })

  if (filteredResources.length === 0) {
    return (
      <Empty
        title="No resources found"
        description="Try adjusting your search, tag filter, or category"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredResources.map((resource) => (
        <ResourceCard key={resource.slug} resource={resource} />
      ))}
    </div>
  )
}
