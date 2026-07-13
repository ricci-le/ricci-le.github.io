import { useRef, useEffect, useState, useCallback } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { Link } from 'react-router-dom'
import { GraphNode, GraphEdge } from '../../types'

export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { notes } = useNotes()
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const nodes: GraphNode[] = notes.map((note, index) => {
    const angle = (index / notes.length) * 2 * Math.PI
    const radius = 120 + (index % 3) * 60
    return {
      id: note.slug,
      label: note.title,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  })

  const edges: GraphEdge[] = notes.flatMap((note) =>
    note.links.map((linkTitle) => {
      const targetNote = notes.find((n) => n.title === linkTitle)
      if (targetNote) {
        return { source: note.slug, target: targetNote.slug }
      }
      return null
    }).filter(Boolean) as GraphEdge[]
  )

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2 + offset.x
    const centerY = height / 2 + offset.y

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.scale(scale, scale)

    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)
      if (!sourceNode || !targetNode) return

      ctx.beginPath()
      ctx.moveTo(sourceNode.x, sourceNode.y)
      ctx.lineTo(targetNode.x, targetNode.y)
      ctx.strokeStyle = selectedNode === edge.source || selectedNode === edge.target
        ? 'rgba(16, 185, 129, 0.8)'
        : 'rgba(100, 116, 139, 0.4)'
      ctx.lineWidth = selectedNode === edge.source || selectedNode === edge.target ? 2 : 1
      ctx.stroke()
    })

    nodes.forEach((node) => {
      const isHovered = hoveredNode === node.id
      const isSelected = selectedNode === node.id

      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, isHovered || isSelected ? 28 : 24)
      gradient.addColorStop(0, isSelected ? '#10b981' : isHovered ? '#059669' : '#1e293b')
      gradient.addColorStop(1, isSelected ? '#047857' : isHovered ? '#047857' : '#0f172a')

      ctx.beginPath()
      ctx.arc(node.x, node.y, isHovered || isSelected ? 28 : 24, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(node.x, node.y, isHovered || isSelected ? 28 : 24, 0, Math.PI * 2)
      ctx.strokeStyle = isSelected ? '#10b981' : isHovered ? '#34d399' : '#475569'
      ctx.lineWidth = isHovered || isSelected ? 2 : 1
      ctx.stroke()

      ctx.fillStyle = '#e2e8f0'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const maxLabelLength = 12
      const label = node.label.length > maxLabelLength
        ? node.label.substring(0, maxLabelLength) + '...'
        : node.label
      ctx.fillText(label, node.x, node.y)
    })

    ctx.restore()
  }, [nodes, edges, hoveredNode, selectedNode, scale, offset])

  useEffect(() => {
    draw()
  }, [draw])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 2))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - canvas.width / 2
      const y = e.clientY - rect.top - canvas.height / 2

      const foundNode = nodes.find(
        (node) => Math.sqrt((node.x * scale - x + offset.x) ** 2 + (node.y * scale - y + offset.y) ** 2) < 30
      )

      setHoveredNode(foundNode?.id || null)
      return
    }

    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (hoveredNode) {
      setSelectedNode(hoveredNode)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode)
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-slate-300 mb-4">Knowledge Graph</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="w-full h-auto rounded-lg cursor-pointer"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
        />
        <div className="absolute bottom-2 right-2 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
          Scroll to zoom | Drag to pan
        </div>
      </div>
      {selectedNode && (
        <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-400">Selected: </p>
          <Link
            to={`/garden/note/${selectedNode}`}
            className="text-emerald-400 hover:underline"
          >
            {nodes.find((n) => n.id === selectedNode)?.label}
          </Link>
          <button
            onClick={() => setSelectedNode(null)}
            className="ml-3 text-slate-500 hover:text-white text-sm"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
