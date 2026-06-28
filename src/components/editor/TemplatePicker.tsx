import Modal from '@/components/shared/Modal'
import { TEMPLATES } from '@/data/templates'
import { useEditorStore, useCurrentSlide } from '@/store/useEditorStore'
import TemplateCard from './TemplateCard'

export default function TemplatePicker() {
  const showTemplatePicker = useEditorStore((s) => s.showTemplatePicker)
  const toggleTemplatePicker = useEditorStore((s) => s.toggleTemplatePicker)
  const changeSlideTemplate = useEditorStore((s) => s.changeSlideTemplate)
  const currentSlide = useCurrentSlide()

  function handleSelect(templateId: string) {
    if (currentSlide) {
      changeSlideTemplate(currentSlide.id, templateId)
      toggleTemplatePicker()
    }
  }

  return (
    <Modal
      isOpen={showTemplatePicker}
      onClose={toggleTemplatePicker}
      title="选择模板"
      size="xl"
    >
      <div className="grid grid-cols-4 gap-4">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={currentSlide?.templateId === template.id}
            onSelect={() => handleSelect(template.id)}
          />
        ))}
      </div>
    </Modal>
  )
}
