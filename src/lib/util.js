// Funciones puras (sin dependencias de Supabase) — fáciles de probar.

/** Ordena una lista por su campo `orden` ascendente. Tolera null. */
export function ordenar(lista) {
  if (!lista) return []
  return [...lista].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
}

// Peso de cada rango para ordenar: S es el más alto.
const RANGO_PESO = { S: 0, A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 }

/** Peso numérico de un rango (S<A<B...). Sin rango o desconocido va al final. */
export function pesoRango(rango) {
  const w = RANGO_PESO[(rango ?? '').toString().trim().toUpperCase()]
  return w === undefined ? 99 : w
}

/** Ordena proyectos por rango (S, A, B, ...); desempata por `orden` y luego `id`. */
export function ordenarPorRango(lista) {
  if (!lista) return []
  return [...lista].sort(
    (a, b) =>
      pesoRango(a.rango) - pesoRango(b.rango) ||
      (a.orden ?? 0) - (b.orden ?? 0) ||
      (a.id ?? 0) - (b.id ?? 0),
  )
}
