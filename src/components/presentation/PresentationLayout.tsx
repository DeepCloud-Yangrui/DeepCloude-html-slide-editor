import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useEditorStore } from '@/store/useEditorStore'
import { usePresentationStore } from '@/store/usePresentationStore'
import PresentationView from './PresentationView'

export default function PresentationLayout() {
  const navigate = useNavigate()
  const { isFullscreen, enter } = useFullscreen()
  const editorSlides = useEditorStore((s) => s.slides)
  const setSlides = usePresentationStore((s) => s.setSlides)

  // Load slides into presentation store on mount
  useEffect(() => {
    setSlides(editorSlides)
  }, [editorSlides, setSlides])

  // Enter fullscreen on mount
  useEffect(() => {
    if (!isFullscreen) {
      enter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle Escape to exit
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const id = useEditorStore.getState().presentationId
        navigate(`/editor/${id}`)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [navigate])

  return <PresentationView />
}
