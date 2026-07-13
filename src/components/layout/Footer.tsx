import { Heart, Github } from 'lucide-react'
import { useLanguage } from '../..//context/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  const footerT = t('footer')

  return (
    <footer className="border-t border-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <span>{footerT.madeWith}</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span>{footerT.by}</span>
          <a href="https://github.com/ricci-le" className="text-emerald-400 hover:text-emerald-300">
            Ricci Le
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm">{footerT.copyright}</span>
          <a
            href="https://github.com/ricci-le/ricci-le.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
