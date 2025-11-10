import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Splash page that shows centered "MyTV" and fades in, then navigates to /home after 3 seconds.
*/
export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/home', { replace: true }), 3000)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen grid place-items-center bg-bg-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(800px 540px at 50% 20%, rgba(37,99,235,0.25), rgba(0,0,0,0))'
        }}
      />
      <div className="text-center fade-in">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-wide">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-100">MyTV</span>
        </h1>
        <p className="mt-3 text-neutral-300">Your movies, shows, and more</p>
      </div>
    </div>
  )
}
