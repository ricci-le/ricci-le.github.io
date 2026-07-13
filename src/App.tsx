import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Garden } from './pages/Garden'
import { NoteDetail } from './pages/NoteDetail'
import { Resources } from './pages/Resources'
import { ResourceDetail } from './pages/ResourceDetail'
import { About } from './pages/About'
import { Admin } from './pages/Admin'
import { LanguageProvider, useLanguage } from './context/LanguageContext'

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <Sidebar />
              <div className="flex-1 min-w-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/garden" element={<Garden />} />
                  <Route path="/garden/note/:slug" element={<NoteDetail />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/:slug" element={<ResourceDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-slate-400 mb-6">
        {t('home').title === '培育想法，分享知识' ? '页面未找到' : 'Page not found'}
      </p>
      <a href="/" className="text-emerald-400 hover:text-emerald-300">
        {t('home').title === '培育想法，分享知识' ? '返回首页' : 'Back to home'}
      </a>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
