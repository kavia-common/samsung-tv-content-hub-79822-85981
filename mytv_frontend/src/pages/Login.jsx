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
    <div className="w-full h-full flex items-start justify-center pt-15">
      <div className="card w-[720px] p-7 text-gray-200">
        <div className="text-white text-[32px] font-black mb-[18px]">Login</div>
        <div className="flex flex-col gap-4">
          <input
            ref={emailRef}
            className="focusable h-14 rounded-[10px] border border-white/20 bg-white/5 text-white px-[14px] text-lg placeholder-white/60"
            placeholder="Email"
          />
          <input
            className="focusable h-14 rounded-[10px] border border-white/20 bg-white/5 text-white px-[14px] text-lg placeholder-white/60"
            placeholder="Password"
            type="password"
          />
          <div className="flex gap-3 mt-1.5">
            <button
              className="focusable h-[54px] min-w-[160px] px-[18px] py-[10px] rounded-[12px] border border-primary bg-gradient-to-b from-blue-600/30 to-blue-600/20 text-white text-lg font-extrabold cursor-pointer"
            >
              Sign In
            </button>
            <button
              className="focusable h-[54px] min-w-[160px] px-[18px] py-[10px] rounded-[12px] border border-white/20 bg-white/10 text-white text-lg font-bold cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
