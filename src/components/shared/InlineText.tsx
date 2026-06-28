import { useState, useRef, useEffect, useCallback } from 'react'
import type { CSSProperties } from 'react'

interface InlineTextProps {
  value: string
  onChange: (value: string) => void
  mode: 'editor' | 'presentation'
  as?: 'input' | 'textarea'
  className?: string
  style?: CSSProperties
  placeholder?: string
  multiline?: boolean
}

export default function InlineText({
  value,
  onChange,
  mode,
  as = 'input',
  className = '',
  style,
  placeholder = '点击编辑...',
  multiline = false,
}: InlineTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync external value changes
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value)
    }
  }, [value, isEditing])

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.select()
      } else if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }
  }, [isEditing, multiline])

  const commit = useCallback(() => {
    setIsEditing(false)
    if (localValue !== value) {
      onChange(localValue)
    }
  }, [localValue, value, onChange])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault()
      commit()
    }
    if (e.key === 'Escape') {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  // Presentation mode: plain text
  if (mode === 'presentation') {
    return <span className={className} style={style}>{value}</span>
  }

  // Editor mode, not editing: clickable text
  if (!isEditing) {
    return (
      <span
        className={`${className} cursor-text hover:bg-brand-light/30 rounded px-0.5 transition-colors border border-transparent hover:border-brand/20`}
        style={style}
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(true)
        }}
        title="点击编辑"
      >
        {value || <span className="text-stone-300 italic">{placeholder}</span>}
      </span>
    )
  }

  // Editor mode, editing: input/textarea
  const inputClasses =
    'bg-white border border-brand rounded outline-none px-1 py-0.5 shadow-sm w-full min-w-[60px]'

  if (multiline || as === 'textarea') {
    return (
      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setLocalValue(value)
            setIsEditing(false)
          }
        }}
        className={`${className} ${inputClasses} resize-none`}
        style={{ ...style, minHeight: '60px' }}
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      className={`${className} ${inputClasses}`}
      style={style}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
