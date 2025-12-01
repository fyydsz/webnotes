import cn from "clsx";
import type { ComponentProps, FC } from "react";

export const Footer: FC<ComponentProps<"footer">> = ({
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
          "x:mx-auto x:max-w-(--nextra-content-width) x:py-12 x:text-gray-600 x:dark:text-gray-400",
          "x:pl-[max(env(safe-area-inset-left),1.5rem)] x:pr-[max(env(safe-area-inset-right),1.5rem)]",
          className,
        )}
        {...props}
      >
        <div className="x:flex x:w-full x:items-center x:justify-between">
          {/* Sisi Kanan: Teks dan Kontak */}
          <div className="x:flex x:items-center x:justify-end x:text-right x:gap-3">
            {/* Kontak: Instagram, Github, Learn */}
            <div className="x:flex x:items-center x:gap-0 x:mr-3">
              <a
                href="https://www.instagram.com/fyydsz_/"
                target="_blank"
                rel="noopener noreferrer"
                className="x:text-gray-600 x:dark:text-gray-400 x:text-sm x:hover:underline"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <span
                className="x:px-2 x:text-gray-400 x:dark:text-gray-500"
                aria-hidden="true"
              >
                |
              </span>
              <a
                href="https://github.com/fyydsz"
                target="_blank"
                rel="noopener noreferrer"
                className="x:text-gray-600 x:dark:text-gray-400 x:text-sm x:hover:underline"
                aria-label="GitHub"
              >
                GitHub
              </a>
              <span
                className="x:px-2 x:text-gray-400 x:dark:text-gray-500"
                aria-hidden="true"
              >
                |
              </span>
              <a
                href="/docs"
                className="x:text-gray-600 x:dark:text-gray-300 x:text-sm x:hover:underline"
                aria-label="Learn"
              >
                Learn
              </a>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
