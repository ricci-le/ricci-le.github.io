import { Github, Mail, Twitter, User } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export function About() {
  const { t } = useLanguage()
  const aboutT = t('about')

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{aboutT.title}</h1>
        <p className="text-slate-400">{aboutT.description}</p>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{aboutT.authorName}</h2>
            <p className="text-slate-400">{aboutT.authorTitle}</p>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed">{aboutT.authorBio}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">{aboutT.projectPurpose}</h3>
          <p className="text-slate-400">{aboutT.projectDescription}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">{aboutT.techStack}</h3>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              React 18 + TypeScript
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Vite 6
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              TailwindCSS 3
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              React Router DOM 7
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">{aboutT.connect}</h3>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ricci-le"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="mailto:ricci.le@example.com"
            className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
