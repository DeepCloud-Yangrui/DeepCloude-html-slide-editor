import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ElementType } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  as?: ElementType
  to?: string
}

const variantClasses: Record<string, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary: 'bg-brand-light text-brand hover:bg-brand-subtle active:scale-[0.98]',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:scale-[0.98]',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:scale-[0.98]',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', as: Component, ...props }, ref) => {
    const classes = `
      inline-flex items-center justify-center font-medium rounded-xl
      transition-all duration-200 cursor-pointer select-none
      disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `

    if (Component) {
      return <Component className={classes} {...props} />
    }

    return <button ref={ref} className={classes} {...props} />
  },
)

Button.displayName = 'Button'

export default Button
