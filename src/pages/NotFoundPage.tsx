import { useNavigate } from 'react-router-dom'
import { FileQuestion, Home, FolderOpen } from 'lucide-react'
import { hasSavedProject, getSavedProjectInfo } from '@/utils/storage'
import Button from '@/components/shared/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const savedProject = hasSavedProject() ? getSavedProjectInfo() : null

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
          <FileQuestion size={32} className="text-brand" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">404</h1>
        <p className="text-stone-500 mb-8">页面未找到</p>

        <div className="flex items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={() => navigate('/')} className="gap-2">
            <Home size={18} />
            返回首页
          </Button>
          {savedProject && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const id =
                  JSON.parse(localStorage.getItem('html-slide-editor-state') || '{}')?.state
                    ?.presentationId || ''
                if (id) navigate(`/editor/${id}`)
              }}
              className="gap-2"
            >
              <FolderOpen size={18} />
              继续编辑
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
