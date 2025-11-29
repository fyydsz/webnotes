import cn from 'clsx'
import type { ComponentProps, FC } from 'react'
import { LocaleSwitch } from 'nextra-theme-docs'
import { ThemeSwitch } from 'nextra-theme-docs'
import { Switchers } from './switcher'

export const Footer: FC<ComponentProps<'footer'>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className="x:bg-gray-100 x:pb-[env(safe-area-inset-bottom)] x:dark:bg-neutral-900 x:print:bg-transparent">
      <footer
        className={cn(
          // UBAH DISINI:
          // 1. 'x:py-12' -> 'x:py-4' (Agar tinggi footer berkurang drastis/lebih tipis)
          // 2. Tambah 'x:text-sm' (Agar ukuran huruf lebih kecil dan rapi)
          'x:mx-auto x:max-w-(--nextra-content-width) x:py-4 x:text-sm x:text-gray-600 x:dark:text-gray-400',
          'x:pl-[max(env(safe-area-inset-left),1.5rem)] x:pr-[max(env(safe-area-inset-right),1.5rem)]',
          className
        )}
        {...props}
      >
        <div className="x:flex x:w-full x:items-center x:justify-between">
          
          {/* Sisi Kiri: Switcher */}
          <div className="x:flex x:items-center x:gap-2">
            <Switchers>
              <LocaleSwitch />
              <ThemeSwitch />
            </Switchers>
          </div>

          {/* Sisi Kanan: Teks */}
          <div className="x:flex x:items-center x:justify-end x:text-right">
            {children}
          </div>
          
        </div>
      </footer>
    </div>
  )
}