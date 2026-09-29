/** 404 genérico, sin marca ni navegación: lo que se ve con SITE_OFFLINE activo. */
import { Helmet } from 'react-helmet-async'

export default function Offline404() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#000',
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <Helmet>
        <title>404: NOT_FOUND</title>
      </Helmet>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1
          style={{
            margin: '0 20px 0 0',
            paddingRight: 23,
            fontSize: 24,
            fontWeight: 500,
            lineHeight: '49px',
            borderRight: '1px solid rgba(0,0,0,.3)',
          }}
        >
          404
        </h1>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 400, lineHeight: '49px' }}>
          This page could not be found.
        </h2>
      </div>
    </main>
  )
}
