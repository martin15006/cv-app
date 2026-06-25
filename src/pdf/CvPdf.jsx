import { Document, Page, View, Text, StyleSheet, Link, Font } from '@react-pdf/renderer'

// No partir palabras/URLs a la mitad: cada palabra se mantiene entera y salta
// completa a la línea de abajo si no cabe (evita "https://mar-\ntin15006...").
Font.registerHyphenationCallback((word) => [word])

// Helvetica (fuente integrada) soporta tildes/ñ; saneamos los pocos símbolos que no.
const clean = (t) => (t ?? '').toString().replace(/↔/g, '-').replace(/∞/g, 'inf')
// Para mostrar enlaces limpios (sin https://) en la línea de contacto.
const sinEsquema = (v) => (v ?? '').toString().replace(/^https?:\/\//, '')

const C = { ink: '#111', dim: '#333', faint: '#666', accent: '#5b3fb0' }

const s = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 36, paddingHorizontal: 40, fontSize: 9.5, color: C.dim, fontFamily: 'Helvetica', lineHeight: 1.4 },
  nombre: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.ink, lineHeight: 1.3, marginBottom: 5 },
  titulo: { fontSize: 11, color: C.accent, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  tagline: { fontSize: 9.5, color: C.dim, marginBottom: 2 },
  contacto: { fontSize: 8.5, color: C.faint, marginTop: 6 },
  cLink: { fontSize: 8.5, color: C.faint, textDecoration: 'none' },
  headBox: { alignSelf: 'flex-start', borderBottomWidth: 1.4, borderBottomColor: C.accent, marginTop: 15, marginBottom: 6, paddingBottom: 2, paddingRight: 14 },
  head: { fontSize: 12.5, fontFamily: 'Helvetica-Bold', color: C.ink },
  perfil: { fontSize: 9.5, color: C.dim },
  skill: { marginBottom: 2 },
  cat: { fontFamily: 'Helvetica-Bold', color: C.ink },
  proj: { marginBottom: 7 },
  projTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: C.ink },
  projMeta: { fontSize: 8.5, color: C.accent, marginBottom: 2 },
  stack: { fontSize: 8, color: '#234', marginBottom: 2 },
  bullet: { fontSize: 9, color: C.dim, marginLeft: 8, marginBottom: 1 },
  link: { color: '#1a3fb0', textDecoration: 'none', fontSize: 8.5, marginTop: 1 },
  eduTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.ink },
  eduP: { fontSize: 9 },
  lang: { fontSize: 9.5 },
  curso: { marginBottom: 3 },
  curN: { fontSize: 9.5, color: C.ink },
  curE: { fontSize: 8, color: C.accent },
})

function SecHead({ children }) {
  return (
    <View style={s.headBox}><Text style={s.head}>{children}</Text></View>
  )
}

export default function CvPdf({ cv }) {
  const p = cv.perfil || {}
  const hrefWeb = p.portafolio ? (/^https?:\/\//.test(p.portafolio) ? p.portafolio : `https://${p.portafolio}`) : null
  // Enlaces clickeables de verdad en el PDF (se muestran sin https://); ubicación y teléfono van como texto.
  const contacto = []
  if (p.ubicacion) contacto.push(clean(p.ubicacion))
  if (p.telefono) contacto.push(clean(p.telefono))
  if (p.email) contacto.push(<Link key="mail" src={`mailto:${p.email}`} style={s.cLink}>{clean(p.email)}</Link>)
  if (p.github) contacto.push(<Link key="gh" src={`https://${sinEsquema(p.github)}`} style={s.cLink}>{clean(sinEsquema(p.github))}</Link>)
  if (hrefWeb) contacto.push(<Link key="web" src={hrefWeb} style={s.cLink}>{clean(sinEsquema(p.portafolio))}</Link>)

  return (
    <Document author={clean(p.nombre)} title={`CV ${clean(p.nombre)}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.nombre}>{clean(p.nombre)}</Text>
        <Text style={s.titulo}>{clean(p.titulo)}</Text>
        <Text style={s.tagline}>{clean(p.tagline)}</Text>
        <Text style={s.contacto}>{contacto.flatMap((el, i) => (i === 0 ? [el] : ['   ·   ', el]))}</Text>

        <SecHead>Perfil profesional</SecHead>
        <Text style={s.perfil}>{clean(p.perfil_texto)}</Text>

        <SecHead>Stack técnico</SecHead>
        {cv.habilidades.map((h) => (
          <Text key={h.id} style={s.skill}>
            <Text style={s.cat}>{clean(h.categoria)}: </Text>
            {clean((h.items || []).join(' · '))}
          </Text>
        ))}

        <SecHead>Proyectos y logros</SecHead>
        {cv.proyectos.map((pr) => (
          <View key={pr.id} style={s.proj} wrap={false}>
            <Text style={s.projTitle}>{clean(pr.titulo)}</Text>
            {pr.subtitulo ? <Text style={s.projMeta}>{clean(pr.subtitulo)}</Text> : null}
            {pr.stack?.length ? <Text style={s.stack}>{clean(pr.stack.join(' · '))}</Text> : null}
            {(pr.bullets || []).map((b, i) => <Text key={i} style={s.bullet}>• {clean(b)}</Text>)}
            {pr.enlace ? <Link style={s.link} src={`https://${pr.enlace.replace(/^https?:\/\//, '')}`}>{clean(pr.enlace)}</Link> : null}
          </View>
        ))}

        <SecHead>Educación</SecHead>
        {cv.educacion.map((e) => (
          <View key={e.id} style={{ marginBottom: 4 }} wrap={false}>
            <Text style={s.eduTitle}>{clean(e.titulo)}</Text>
            <Text style={s.eduP}>{clean([e.institucion, e.detalle].filter(Boolean).join(' · '))}</Text>
          </View>
        ))}

        <SecHead>Idiomas</SecHead>
        {cv.idiomas.map((i) => (
          <Text key={i.id} style={s.lang}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: C.ink }}>{clean(i.idioma)}: </Text>{clean(i.nivel)}
          </Text>
        ))}

        <SecHead>Cursos y certificaciones</SecHead>
        {cv.cursos.map((c) => (
          <View key={c.id} style={s.curso} wrap={false}>
            <Text style={s.curN}>{clean(c.nombre)}</Text>
            <Text style={s.curE}>{clean([c.entidad, c.detalle].filter(Boolean).join(' · '))}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
