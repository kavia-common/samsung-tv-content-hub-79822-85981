import Thumbnail from './Thumbnail.jsx'

/**
 PUBLIC_INTERFACE
 Rail renders a horizontally scrollable row of thumbnails with a title.
*/
export default function Rail({ title, items = [] }) {
  return (
    <section className="mt-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 px-1">{title}</h2>
      <div className="group flex gap-3 overflow-x-auto overflow-y-hidden pr-2 pb-2 snap-x snap-mandatory"
           style={{ scrollbarWidth: 'thin' }}>
        {items.map((item) => (
          <div key={item.id} className="snap-start shrink-0">
            <Thumbnail item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
