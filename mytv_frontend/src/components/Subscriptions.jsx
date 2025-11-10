import React from 'react'

/**
 * PUBLIC_INTERFACE
 * Shows available subscription plans.
 */
export default function Subscriptions() {
  const plans = [
    { id: 'basic', name: 'Basic', price: '$4.99/mo', features: ['720p', '1 device'], color: '#60A5FA', logo: '/images/thumbs/other2.jpg' },
    { id: 'standard', name: 'Standard', price: '$9.99/mo', features: ['1080p', '2 devices'], color: '#22D3EE', logo: '/images/thumbs/other3.jpg' },
    { id: 'premium', name: 'Premium', price: '$14.99/mo', features: ['4K + HDR', '4 devices'], color: '#F59E0B', logo: '/images/thumbs/other4.jpg' },
  ]
  return (
    <div id="subscriptions" style={{ marginTop: 28, marginBottom: 24 }}>
      <div className="section-title">Available Subscriptions</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {plans.map((p) => (
          <div
            key={p.id}
            className="card focusable"
            tabIndex={0}
            style={{
              width: 380,
              padding: 16,
              borderLeft: `5px solid ${p.color}`,
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: 12,
              alignItems: 'center',
            }}
            aria-label={`${p.name} plan`}
          >
            <div className="surface" style={{ borderRadius: 12, overflow: 'hidden' }}>
              <img src={p.logo} alt={`${p.name} logo`} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 18, color: '#D1D5DB', marginBottom: 8 }}>{p.price}</div>
              <ul style={{ listStyle: 'none', color: '#9CA3AF', fontSize: 16, lineHeight: '24px', paddingLeft: 0, margin: 0 }}>
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <button
          className="focusable"
          tabIndex={0}
          style={{
            height: 54,
            minWidth: 220,
            padding: '10px 18px',
            borderRadius: 12,
            border: '1px solid var(--secondary)',
            background: 'linear-gradient(180deg, rgba(245,158,11,0.25), rgba(245,158,11,0.12))',
            color: '#fff',
            fontSize: 18,
            fontWeight: 800,
            cursor: 'pointer',
          }}
          onClick={() => {}}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  )
}
