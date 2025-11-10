import { Link, useLocation } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 NavBar renders top navigation with links to Home, Login, Settings (anchor), and My Plan (anchor).
*/
export default function NavBar() {
  const { pathname } = useLocation()
  const linkBase =
    'px-4 py-2 rounded-md border transition-transform duration-150 ease-soft font-semibold'
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-black/70 to-transparent backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="text-2xl font-extrabold">MyTV</div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/home"
            className={`${linkBase} ${pathname === '/home' ? 'border-brand-secondary bg-brand-secondary/15' : 'border-white/20 bg-white/5 hover:bg-white/10'} `}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={`${linkBase} ${pathname === '/login' ? 'border-brand-secondary bg-brand-secondary/15' : 'border-white/20 bg-white/5 hover:bg-white/10'} `}
          >
            Login
          </Link>
          <a
            href="/home#settings"
            className={`${linkBase} border-white/20 bg-white/5 hover:bg-white/10`}
          >
            Settings
          </a>
          <a
            href="/home#plan"
            className={`${linkBase} border-white/20 bg-white/5 hover:bg-white/10`}
          >
            My Plan
          </a>
        </nav>
      </div>
    </header>
  )
}
