import { useEffect, useRef } from 'react'

/**
 * PUBLIC_INTERFACE
 * Banner displays a hero image with gradient overlay and text.
 */
export default function Banner({
  image = 'data:image/svg+xml;utf8,'
    + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="%231e3a8a"/><stop offset="1" stop-color="%230b1220"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="48" y="220" fill="%23ffffff" font-family="Arial" font-weight="900" font-size="64">MyTV Banner</text></svg>`),
  title = 'Featured',
  subtitle = '',
  onWatch
}) {
  const btnRef = useRef(null)

  useEffect(() => {
    // focus first CTA when page loads to give a starting point for remote navigation
    btnRef.current?.focus()
  }, [])

  return (
    <div className="banner-shadowed relative w-full h-[360px] lg:h-[420px] rounded-[18px] overflow-hidden border border-white/10 bg-[#0a0f1f]">
      <img
        src={image}
        alt="Banner"
        loading="lazy"
        onError={(e)=>{ e.currentTarget.style.visibility = 'hidden' }}
        className="w-full h-full object-cover [filter:saturate(1.05)_contrast(1.05)] will-change-transform"
        style={{ transform: 'translateY(-2%) scale(1.02)' }}
      />
      {/* Layered gradients for readability */}
      <div className="absolute inset-0 bg-banner-gradient" />
      <div className="absolute inset-0 bg-layered-radial pointer-events-none" />
      <div className="absolute left-6 lg:left-9 top-7 lg:top-10 flex flex-col gap-2.5 max-w-[92%] lg:max-w-[820px] pr-6">
        <div className="text-blue-300 font-bold tracking-wider">MYTV ORIGINAL</div>
        <div className="text-white font-black text-headline lg:text-[42px] [text-shadow:0_6px_18px_rgba(0,0,0,0.65)]">
          {title}
        </div>
        <div className="text-gray-300 text-subhead lg:text-[20px]">{subtitle}</div>
        <div className="flex gap-3 mt-2.5">
          <button
            ref={btnRef}
            className="focusable h-[52px] lg:h-[54px] min-w-[150px] lg:min-w-[160px] px-[16px] lg:px-[18px] py-[10px] rounded-[12px] border border-primary text-white text-base lg:text-lg font-extrabold cursor-pointer bg-gradient-to-b from-blue-600/30 to-blue-600/20 hover:shadow-glow transition-shadow"
            onClick={() => onWatch?.()}
            onKeyDown={(e)=>{ if(e.keyCode===13) onWatch?.() }}
          >
            Watch Now
          </button>
          <button
            className="focusable h-[52px] lg:h-[54px] min-w-[150px] lg:min-w-[160px] px-[16px] lg:px-[18px] py-[10px] rounded-[12px] border border-white/20 bg-white/10 text-white text-base lg:text-lg font-bold cursor-pointer hover:border-white/30 transition"
            onClick={() => {}}
          >
            Add to List
          </button>
        </div>
      </div>
    </div>
  )
}
