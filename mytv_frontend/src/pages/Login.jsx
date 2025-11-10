import { useRef, useEffect } from 'react'

/**
 PUBLIC_INTERFACE
 Login page placeholder with focusable inputs and primary/secondary themed buttons.
*/
export default function Login() {
  const emailRef = useRef(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  return (
    <div className="w-full h-full flex items-start justify-center pt-12 lg:pt-16">
      <div className="w-[90%] max-w-[760px] p-6 lg:p-7 text-gray-200 rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.55)] backdrop-blur-md shadow-ocean">
        <div className="text-white text-[28px] lg:text-[32px] font-black mb-[18px]">Login</div>
        <div className="flex flex-col gap-4">
          <input
            ref={emailRef}
            className="focusable h-12 lg:h-14 rounded-[10px] border border-white/15 bg-white/5 text-white px-[14px] text-base lg:text-lg placeholder-white/60 focus-visible:ring-2 focus-visible:ring-blue-500/50"
            placeholder="Email"
          />
          <input
            className="focusable h-12 lg:h-14 rounded-[10px] border border-white/15 bg-white/5 text-white px-[14px] text-base lg:text-lg placeholder-white/60 focus-visible:ring-2 focus-visible:ring-blue-500/50"
            placeholder="Password"
            type="password"
          />
          <div className="flex gap-3 mt-1.5">
            <button
              className="focusable h-[48px] lg:h-[54px] min-w-[150px] lg:min-w-[160px] px-[16px] lg:px-[18px] py-[10px] rounded-[12px] border border-primary bg-gradient-to-b from-blue-600/40 to-blue-600/20 text-white text-base lg:text-lg font-extrabold cursor-pointer hover:shadow-glow transition-shadow"
            >
              Sign In
            </button>
            <button
              className="focusable h-[48px] lg:h-[54px] min-w-[150px] lg:min-w-[160px] px-[16px] lg:px-[18px] py-[10px] rounded-[12px] border border-white/20 bg-white/10 text-white text-base lg:text-lg font-bold cursor-pointer hover:border-white/30 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
