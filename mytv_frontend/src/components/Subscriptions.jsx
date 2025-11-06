import React from 'react'

/**
 * PUBLIC_INTERFACE
 * Shows available subscription plans.
 */
export default function Subscriptions() {
  const plans = [
    { id: 'basic', name: 'Basic', price: '$4.99/mo', features: ['720p', '1 device'], color: '#60A5FA' },
    { id: 'standard', name: 'Standard', price: '$9.99/mo', features: ['1080p', '2 devices'], color: '#22D3EE' },
    { id: 'premium', name: 'Premium', price: '$14.99/mo', features: ['4K + HDR', '4 devices'], color: '#F59E0B' },
  ]
  return (
    <div style={{ marginTop: 28, marginBottom: 16 }}>
      <div className="section-title">Available Subscriptions</div>
      <div style={{ display: 'flex', gap: 16 }}>
        {plans.map((p) => (
          <div
            key={p.id}
            className="card focusable"
            tabIndex={0}
            style={{
              width: 380,
              padding: 16,
              borderLeft: `5px solid ${p.color}`,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{p.name}</div>
            <div style={{ fontSize: 18, color: '#D1D5DB', marginBottom: 10 }}>{p.price}</div>
            <ul style={{ listStyle: 'none', color: '#9CA3AF', fontSize: 16, lineHeight: '26px' }}>
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
