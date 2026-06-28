import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditorStore } from '@/store/useEditorStore'
import EditorLayout from '@/components/editor/EditorLayout'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const presentationId = useEditorStore((s) => s.presentationId)
  const slides = useEditorStore((s) => s.slides)
  const currentSlideId = useEditorStore((s) => s.currentSlideId)
  const setPresentation = useEditorStore((s) => s.setPresentation)
  const setCurrentSlide = useEditorStore((s) => s.setCurrentSlide)

  useEffect(() => {
    if (!id) {
      navigate('/')
      return
    }

    // If the store has a different presentation or none, initialize
    if (presentationId !== id) {
      setPresentation(id, '未命名演示文稿')
    }
  }, [id])

  // Ensure a slide is always selected
  useEffect(() => {
    if (slides.length > 0 && !currentSlideId) {
      setCurrentSlide(slides[0].id)
    }
  }, [slides, currentSlideId, setCurrentSlide])

  return <EditorLayout />
}
