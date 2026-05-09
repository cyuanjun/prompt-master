import { HamburgerMenu } from './HamburgerMenu'
import { Logo } from './Logo'

export function Header() {
  return (
    <header className="paper-header sticky top-0 z-30 -mx-4 px-4 py-2 sm:-mx-6 sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex-shrink-0">
          <HamburgerMenu />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Logo />
        </div>
        <div className="h-10 w-10 flex-shrink-0" aria-hidden="true" />
      </div>
    </header>
  )
}
