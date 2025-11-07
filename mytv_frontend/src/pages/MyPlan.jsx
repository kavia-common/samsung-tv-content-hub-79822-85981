import React from 'react'

/**
 PUBLIC_INTERFACE
 My Plan page stub showing "Hello World" as requested.
*/
export default function MyPlan() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: 40,
      }}
    >
      <div className="card" style={{ padding: 28, minWidth: 360, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, color: '#fff' }}>My Plan</div>
        <div style={{ color: '#D1D5DB', fontSize: 18 }}>Hello World</div>
      </div>
    </div>
  )
}
