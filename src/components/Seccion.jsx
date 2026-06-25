export default function Seccion({ titulo, children }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2
        style={{
          borderBottom: '2px solid #5b3fb0',
          display: 'inline-block',
          paddingRight: 12,
          marginBottom: 10,
        }}
      >
        {titulo}
      </h2>
      <div>{children}</div>
    </section>
  )
}
