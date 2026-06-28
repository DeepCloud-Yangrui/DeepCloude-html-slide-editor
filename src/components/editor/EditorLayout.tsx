import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import Canvas from './Canvas'
import PropertiesPanel from './PropertiesPanel'
import TemplatePicker from './TemplatePicker'

export default function EditorLayout() {
  return (
    <div className="h-screen flex flex-col bg-surface">
      {/* Top toolbar */}
      <Toolbar />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - slide list */}
        <Sidebar />

        {/* Center canvas */}
        <Canvas />

        {/* Right panel - properties */}
        <PropertiesPanel />
      </div>

      {/* Template picker modal */}
      <TemplatePicker />
    </div>
  )
}
