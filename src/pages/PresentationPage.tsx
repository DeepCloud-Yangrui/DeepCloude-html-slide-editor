import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditorStore } from '@/store/useEditorStore'
import PresentationLayout from '@/components/presentation/PresentationLayout'

export default function PresentationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const presentationId = useEditorStore((s) => s.presentationId)
  const slides = useEditorStore((s) => s.slides)

  useEffect(() => {
    // If no slides or wrong presentation, redirect to editor
    if (!id) {
      navigate('/')
      return
    }

    if (slides.length === 0) {
      navigate(`/editor/${id}`)
      return
    }
  }, [id, slides.length, navigate])

  return <PresentationLayout />
}
