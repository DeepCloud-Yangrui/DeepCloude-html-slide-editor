import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'primary' | 'secondary'
  tooltip?: string
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const variantMap = {
  ghost: 'text-stone-500 hover:bg-stone-100 hover:text-stone-700',
  primary: 'bg-brand text-white hover:bg-brand-hover shadow-sm',
  secondary: 'bg-brand-light text-brand hover:bg-brand-subtle',
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = 'md', variant = 'ghost', tooltip, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-xl
          transition-all duration-200 cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-[0.95]
          ${sizeMap[size]}
          ${variantMap[variant]}
          ${className}
        `}
        title={tooltip}
        {...props}
      >
        {children}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'

export default IconButton
