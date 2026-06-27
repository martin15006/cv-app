// Configuración de las secciones editables.
// tipo: 'texto' (input) · 'area' (textarea de 1 párrafo) · 'lista' (textarea, uno por línea -> array) · 'numero'

export const SECCIONES = [
  {
    tabla: 'habilidades', titulo: 'Habilidades', singular: 'habilidad',
    campos: [
      { n: 'categoria', label: 'Categoría', tipo: 'texto' },
      { n: 'items', label: 'Ítems (uno por línea)', tipo: 'lista' },
      { n: 'orden', label: 'Orden', tipo: 'numero' },
    ],
  },
  {
    tabla: 'proyectos', titulo: 'Proyectos', singular: 'proyecto',
    campos: [
      { n: 'titulo', label: 'Título', tipo: 'texto' },
      { n: 'subtitulo', label: 'Subtítulo', tipo: 'texto' },
      { n: 'stack', label: 'Stack (uno por línea)', tipo: 'lista' },
      { n: 'bullets', label: 'Logros (uno por línea)', tipo: 'lista' },
      { n: 'enlace', label: 'Enlace', tipo: 'texto' },
      { n: 'rango', label: 'Rango (S/A/B)', tipo: 'texto', upper: true },
      { n: 'orden', label: 'Orden', tipo: 'numero' },
    ],
  },
  {
    tabla: 'educacion', titulo: 'Educación', singular: 'estudio',
    campos: [
      { n: 'titulo', label: 'Título', tipo: 'texto' },
      { n: 'institucion', label: 'Institución', tipo: 'texto' },
      { n: 'detalle', label: 'Detalle', tipo: 'texto' },
      { n: 'orden', label: 'Orden', tipo: 'numero' },
    ],
  },
  {
    tabla: 'cursos', titulo: 'Cursos', singular: 'curso',
    campos: [
      { n: 'nombre', label: 'Nombre', tipo: 'texto' },
      { n: 'entidad', label: 'Entidad', tipo: 'texto' },
      { n: 'detalle', label: 'Detalle', tipo: 'texto' },
      { n: 'orden', label: 'Orden', tipo: 'numero' },
    ],
  },
  {
    tabla: 'idiomas', titulo: 'Idiomas', singular: 'idioma',
    campos: [
      { n: 'idioma', label: 'Idioma', tipo: 'texto' },
      { n: 'nivel', label: 'Nivel', tipo: 'texto' },
      { n: 'orden', label: 'Orden', tipo: 'numero' },
    ],
  },
]

export const CAMPOS_PERFIL = [
  { n: 'nombre', label: 'Nombre', tipo: 'texto' },
  { n: 'titulo', label: 'Título', tipo: 'texto' },
  { n: 'tagline', label: 'Tagline', tipo: 'texto' },
  { n: 'perfil_texto', label: 'Perfil (párrafo)', tipo: 'area' },
  { n: 'ubicacion', label: 'Ubicación', tipo: 'texto' },
  { n: 'telefono', label: 'Teléfono', tipo: 'texto' },
  { n: 'email', label: 'Email', tipo: 'texto' },
  { n: 'github', label: 'GitHub', tipo: 'texto' },
  { n: 'portafolio', label: 'Portafolio', tipo: 'texto' },
]
