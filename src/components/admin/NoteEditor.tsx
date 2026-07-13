import { useState, useEffect } from 'react'
import { Save, Trash2, Plus, FileText } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

interface NoteItem {
  filename: string
  content: string
}

export function NoteEditor() {
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null)
  const [content, setContent] = useState('')
  const [newFilename, setNewFilename] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useLanguage()
  const adminT = t('admin')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/admin/notes')
      const data = await response.json()
      if (data.success) {
        setNotes(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    }
  }

  const handleSelectNote = (note: NoteItem) => {
    setSelectedNote(note)
    setContent(note.content)
    setMessage('')
  }

  const handleSave = async () => {
    if (!selectedNote) return
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: selectedNote.filename, content })
      })
      const data = await response.json()
      if (data.success) {
        setMessage(adminT.saveSuccess)
        fetchNotes()
      } else {
        setMessage(data.error)
      }
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateNote = async () => {
    if (!newFilename.trim()) {
      setMessage(adminT.enterFilename)
      return
    }
    
    const filename = newFilename.endsWith('.md') ? newFilename : newFilename + '.md'
    const defaultContent = `---
title: "${newFilename.replace('.md', '')}"
tags: []
createdAt: ${new Date().toISOString().split('T')[0]}
updatedAt: ${new Date().toISOString().split('T')[0]}
---

${adminT.startWriting}`

    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content: defaultContent })
      })
      const data = await response.json()
      if (data.success) {
        setMessage(adminT.createSuccess)
        setNewFilename('')
        fetchNotes()
      } else {
        setMessage(data.error)
      }
    } catch (err) {
      setMessage((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!selectedNote) return
    if (!confirm(t('admin').confirmDelete)) return

    try {
      const response = await fetch(`/api/admin/notes/${selectedNote.filename}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setMessage(adminT.deleteSuccess)
        setSelectedNote(null)
        setContent('')
        fetchNotes()
      } else {
        setMessage(data.error)
      }
    } catch (err) {
      setMessage((err as Error).message)
    }
  }

  return (
    <div className="flex h-full gap-6">
      <div className="w-72 flex-shrink-0 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {adminT.notes}
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={adminT.newFilename}
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleCreateNote}
              disabled={isSaving}
              className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ul className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {notes.map((note) => (
            <li key={note.filename}>
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedNote?.filename === note.filename
                  ? 'bg-emerald-500/10'
                  : 'hover:bg-slate-700/50'
              }`}>
                <button
                  onClick={() => handleSelectNote(note)}
                  className={`flex-1 text-left transition-colors ${
                    selectedNote?.filename === note.filename
                      ? 'text-emerald-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {note.filename}
                </button>
                {selectedNote?.filename === note.filename && (
                  <button
                    onClick={() => handleDeleteNote()}
                    className="text-red-400 hover:text-red-300 ml-2 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{selectedNote.filename}</h3>
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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 resize-none"
              placeholder={adminT.editContent}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-slate-400">{adminT.selectNote}</p>
          </div>
        )}
      </div>
    </div>
  )
}
