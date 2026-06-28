import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type ClassName = string | undefined | null | boolean | Record<string, boolean>

export function cn(...classes: ClassName[]): string {
  return twMerge(clsx(classes))
}
