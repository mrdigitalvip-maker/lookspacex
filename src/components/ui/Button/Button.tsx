import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import type { ButtonProps } from './Button.types'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn(className)} {...props} />
  )
)

Button.displayName = 'Button'

export { Button }
