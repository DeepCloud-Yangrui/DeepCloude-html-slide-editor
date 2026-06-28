import { getTemplateComponent } from './registry'
import type { TemplateComponentProps } from './registry'

export default function TemplateRenderer(props: TemplateComponentProps) {
  const Component = getTemplateComponent(props.slide.templateId)
  return <Component {...props} />
}
