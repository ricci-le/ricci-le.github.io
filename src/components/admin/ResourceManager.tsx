import { useState, useEffect } from 'react'
import { Save, Trash2, Plus, ExternalLink, Edit2 } from 'lucide-react'
import { Resource } from '../../types'
import { useLanguage } from '../../context/LanguageContext'

export function ResourceManager() {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useLanguage()
  const adminT = t('admin')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/resources')
      const data = await response.json()
      if (data.success) {
        setResources(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resources)
      })
      const data = await response.json()
      if (data.success) {
        setMessage(adminT.saveSuccess)
        setSelectedResource(null)
      } else {
        setMessage(data.error)
      }
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddResource = () => {
    const newResource: Resource = {
      id: String(Date.now()),
      slug: '',
      title: '',
      description: '',
      url: '',
      category: 'article',
      topic: '',
      tags: [],
    }
    setResources([...resources, newResource])
    setSelectedResource(newResource)
    setMessage('')
  }

  const handleDeleteResource = (index: number) => {
    if (!confirm(t('admin').confirmDelete)) return
    const newResources = resources.filter((_, i) => i !== index)
    setResources(newResources)
    if (selectedResource === resources[index]) {
      setSelectedResource(null)
    }
  }

  const handleUpdateResource = (index: number, updates: Partial<Resource>) => {
    const newResources = [...resources]
    newResources[index] = { ...newResources[index], ...updates }
    if (updates.title && !newResources[index].slug) {
      newResources[index].slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    setResources(newResources)
    if (selectedResource === resources[index]) {
      setSelectedResource(newResources[index])
    }
  }

  const categories: { value: Resource['category']; label: string }[] = [
    { value: 'book', label: t('resources').books },
    { value: 'article', label: t('resources').articles },
    { value: 'video', label: t('resources').videos },
    { value: 'tool', label: t('resources').tools },
    { value: 'course', label: t('resources').courses },
  ]

  return (
    <div className="flex h-full gap-6">
      <div className="w-80 flex-shrink-0 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            {adminT.resources} ({resources.length})
          </h3>
          <button
            onClick={handleAddResource}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            {adminT.add}
          </button>
        </div>

        <ul className="space-y-2">
          {resources.map((resource, index) => (
            <li key={resource.id}>
              <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                selectedResource?.id === resource.id
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'bg-slate-700/30 hover:bg-slate-700/50'
              }`}>
                <button
                  onClick={() => setSelectedResource(resource)}
                  className="flex-1 text-left"
                >
                  <h4 className={`text-sm font-medium truncate ${
                    selectedResource?.id === resource.id ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {resource.title || adminT.untitled}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {categories.find(c => c.value === resource.category)?.label || resource.category}
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteResource(index)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedResource ? (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-400" />
                {selectedResource.title || adminT.editResource}
              </h3>
              <div className="flex items-center gap-3">
                {message && (
                  <span className={`text-sm ${message.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message}
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? adminT.saving : adminT.save}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.fieldTitle} *
                </label>
                <input
                  type="text"
                  value={selectedResource.title}
                  onChange={(e) => handleUpdateResource(
                    resources.findIndex(r => r.id === selectedResource!.id),
                    { title: e.target.value }
                  )}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder={adminT.enterTitle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.category}
                </label>
                <select
                  value={selectedResource.category}
                  onChange={(e) => handleUpdateResource(
                    resources.findIndex(r => r.id === selectedResource!.id),
                    { category: e.target.value as Resource['category'] }
                  )}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.url} *
                </label>
                <input
                  type="url"
                  value={selectedResource.url}
                  onChange={(e) => handleUpdateResource(
                    resources.findIndex(r => r.id === selectedResource!.id),
                    { url: e.target.value }
                  )}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.topic}
                </label>
                <input
                  type="text"
                  value={selectedResource.topic}
                  onChange={(e) => handleUpdateResource(
                    resources.findIndex(r => r.id === selectedResource!.id),
                    { topic: e.target.value }
                  )}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder={adminT.enterTopic}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.fieldDescription}
                </label>
                <textarea
                  value={selectedResource.description}
                  onChange={(e) => handleUpdateResource(
                    resources.findIndex(r => r.id === selectedResource!.id),
                    { description: e.target.value }
                  )}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder={adminT.enterDescription}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.author}
                </label>
                <input
                  type="text"
                  value={selectedResource.author || ''}
                  onChange={(e) => handleUpdateResource(
                    resources.findIndex(r => r.id === selectedResource!.id),
                    { author: e.target.value }
                  )}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder={adminT.enterAuthor}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.year}
                </label>
                <input
                  type="text"
                  value={selectedResource.year || ''}
                  onChange={(e) => handleUpdateResource(
                    resources.findIndex(r => r.id === selectedResource!.id),
                    { year: e.target.value }
                  )}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="YYYY"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {adminT.tags} ({selectedResource.tags.length})
                </label>
                <input
                  type="text"
                  placeholder={adminT.addTags}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const tag = e.currentTarget.value.trim()
                      if (tag && !selectedResource.tags.includes(tag)) {
                        handleUpdateResource(
                          resources.findIndex(r => r.id === selectedResource!.id),
                          { tags: [...selectedResource.tags, tag] }
                        )
                      }
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedResource.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300"
                    >
                      {tag}
                      <button
                        onClick={() => handleUpdateResource(
                          resources.findIndex(r => r.id === selectedResource!.id),
                          { tags: selectedResource.tags.filter((_, i) => i !== idx) }
                        )}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-slate-400">{adminT.selectResource}</p>
          </div>
        )}
      </div>
    </div>
  )
}
