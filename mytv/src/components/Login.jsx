import { Link } from 'react-router-dom'

/**
 PUBLIC_INTERFACE
 Login page with email/password fields, login button, and a link back to Home.
*/
export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-10 bg-surface-800/70 border border-white/10 rounded-xl p-6 shadow-soft">
      <h1 className="text-3xl font-extrabold mb-4">Login</h1>
      <div className="flex flex-col gap-3">
        <label className="text-sm text-neutral-300">Email</label>
        <input
          type="email"
          className="px-3 py-2 rounded-md bg-black/30 border border-white/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          placeholder="you@example.com"
        />
        <label className="text-sm text-neutral-300">Password</label>
        <input
          type="password"
          className="px-3 py-2 rounded-md bg-black/30 border border-white/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          placeholder="••••••••"
        />
        <button className="mt-2 px-4 py-2 rounded-md bg-accent-red font-bold hover:brightness-110 transition">
          Sign in
        </button>
        <div className="text-sm text-neutral-300 mt-2">
          or <Link to="/home" className="text-brand-secondary hover:underline">Go back Home</Link>
        </div>
      </div>
    </div>
  )
}
