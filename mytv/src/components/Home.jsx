import Rail from './Rail.jsx'
import { getAllRails, getBanner } from '../data/localContent'

/**
 PUBLIC_INTERFACE
 Home page rendering a banner and multiple horizontal rails with local assets.
 Prepared to later swap data source for remote API.
*/
export default function Home() {
  const rails = getAllRails()
  const banner = getBanner()
  return (
    <div className="max-w-7xl mx-auto">
      {/* Banner */}
      <div className="relative h-[40vw] max-h-[420px] min-h-[240px] rounded-xl overflow-hidden shadow-soft mb-6">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/0" />
        <div className="absolute left-6 bottom-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black drop-shadow">
            {banner.title}
          </h1>
          <p className="text-neutral-300 max-w-xl mt-2">{banner.subtitle}</p>
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 rounded-md bg-accent-red text-white font-bold hover:brightness-110 transition">
              Play
            </button>
            <button className="px-4 py-2 rounded-md bg-white/10 border border-white/20 hover:bg-white/15 transition">
              Add to List
            </button>
          </div>
        </div>
      </div>

      {/* Rails */}
      {rails.map((rail) => (
        <Rail key={rail.title} title={rail.title} items={rail.items} />
      ))}

      {/* Anchor sections */}
      <div id="settings" className="mt-10 pt-8 border-t border-white/10">
        <h3 className="text-2xl font-extrabold mb-2">Settings</h3>
        <p className="text-neutral-300">App preferences and device settings will appear here.</p>
      </div>

      <div id="plan" className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-2xl font-extrabold mb-2">My Plan</h3>
        <p className="text-neutral-300">Your subscription details will be displayed here.</p>
      </div>
    </div>
  )
}
