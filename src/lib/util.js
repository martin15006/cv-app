// Funciones puras (sin dependencias de Supabase) — fáciles de probar.

/** Ordena una lista por su campo `orden` ascendente. Tolera null. */
export function ordenar(lista) {
  if (!lista) return []
  return [...lista].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
}
