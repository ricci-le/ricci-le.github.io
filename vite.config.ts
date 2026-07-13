import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'

function adminPlugin() {
  return {
    name: 'admin-plugin',
    configureServer(server) {
      server.middlewares.use('/api/admin', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        
        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
          return
        }

        if (req.method === 'GET' && req.url === '/notes') {
          try {
            const notesDir = join(process.cwd(), 'data/notes')
            const files = readdirSync(notesDir).filter((f: string) => f.endsWith('.md'))
            const notes = files.map((file: string) => {
              const content = readFileSync(join(notesDir, file), 'utf-8')
              return { filename: file, content }
            })
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, data: notes }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: (err as Error).message }))
          }
          return
        }

        if (req.method === 'GET' && req.url?.startsWith('/notes/')) {
          try {
            const filename = req.url.replace('/notes/', '')
            const filePath = join(process.cwd(), 'data/notes', filename)
            if (!existsSync(filePath)) {
              res.statusCode = 404
              res.end(JSON.stringify({ success: false, error: 'File not found' }))
              return
            }
            const content = readFileSync(filePath, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, data: { filename, content } }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: (err as Error).message }))
          }
          return
        }

        if (req.method === 'POST' && req.url === '/notes') {
          let body = ''
          req.on('data', (chunk: Buffer) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const { filename, content } = JSON.parse(body)
              const notesDir = join(process.cwd(), 'data/notes')
              if (!existsSync(notesDir)) mkdirSync(notesDir, { recursive: true })
              writeFileSync(join(notesDir, filename), content, 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'Note saved' }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: (err as Error).message }))
            }
          })
          return
        }

        if (req.method === 'DELETE' && req.url?.startsWith('/notes/')) {
          try {
            const filename = req.url.replace('/notes/', '')
            const filePath = join(process.cwd(), 'data/notes', filename)
            if (!existsSync(filePath)) {
              res.statusCode = 404
              res.end(JSON.stringify({ success: false, error: 'File not found' }))
              return
            }
            unlinkSync(filePath)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, message: 'Note deleted' }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: (err as Error).message }))
          }
          return
        }

        if (req.method === 'GET' && req.url === '/resources') {
          try {
            const filePath = join(process.cwd(), 'data/resources.json')
            if (!existsSync(filePath)) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, data: [] }))
              return
            }
            const content = readFileSync(filePath, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, data: JSON.parse(content) }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: (err as Error).message }))
          }
          return
        }

        if (req.method === 'POST' && req.url === '/resources') {
          let body = ''
          req.on('data', (chunk: Buffer) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const resources = JSON.parse(body)
              const filePath = join(process.cwd(), 'data/resources.json')
              const resourcesDir = dirname(filePath)
              if (!existsSync(resourcesDir)) mkdirSync(resourcesDir, { recursive: true })
              writeFileSync(filePath, JSON.stringify(resources, null, 2), 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'Resources saved' }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: (err as Error).message }))
            }
          })
          return
        }

        res.statusCode = 404
        res.end(JSON.stringify({ success: false, error: 'Not found' }))
      })
    }
  }
}

export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths(),
    adminPlugin(),
  ],
})
