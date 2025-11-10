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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 60,
      }}
    >
      <div className="card" style={{ width: 720, padding: 28, color: '#E5E7EB' }}>
        <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 18, color: '#fff' }}>Login</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            ref={emailRef}
            className="focusable"
            placeholder="Email"
            style={{
              height: 56,
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              padding: '0 14px',
              fontSize: 18,
            }}
          />
          <input
            className="focusable"
            placeholder="Password"
            type="password"
            style={{
              height: 56,
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              padding: '0 14px',
              fontSize: 18,
            }}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <button
              className="focusable"
              style={{
                height: 54,
                minWidth: 160,
                padding: '10px 18px',
                borderRadius: 12,
                border: '1px solid var(--primary)',
                background: 'linear-gradient(180deg, rgba(37,99,235,0.28), rgba(37,99,235,0.16))',
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              className="focusable"
              style={{
                height: 54,
                minWidth: 160,
                padding: '10px 18px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
