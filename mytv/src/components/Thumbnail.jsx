import { useState } from 'react'

/**
 PUBLIC_INTERFACE
 Thumbnail shows an image and title overlay with hover/focus transitions.
*/
export default function Thumbnail({ item }) {
  const [err, setErr] = useState(false)
  const src = err ? '/images/placeholder1.jpg' : item.image

  return (
    <div className="relative w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] aspect-[16/9] rounded-lg overflow-hidden bg-surface-800 shadow-soft hover:shadow-lg transition-transform duration-150 ease-soft hover:scale-[1.03] focus-within:scale-[1.03]">
      <img
        src={src}
        alt={item.title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setErr(true)}
      />
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-black/0">
        <div className="text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {item.title}
        </div>
      </div>
    </div>
  )
}
