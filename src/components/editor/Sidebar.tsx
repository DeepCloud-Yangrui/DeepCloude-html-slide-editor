import SlideList from './SlideList'

export default function Sidebar() {
  return (
    <div className="w-56 flex-shrink-0 bg-surface border-r border-stone-200/60 flex flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        <SlideList />
      </div>
    </div>
  )
}
