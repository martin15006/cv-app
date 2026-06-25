import { supabase } from './supabase.js'

// ----- Tablas de lista (habilidades, proyectos, educacion, cursos, idiomas) -----
export async function listar(tabla) {
  const { data, error } = await supabase
    .from(tabla)
    .select('*')
    .order('orden', { ascending: true })
  if (error) throw error
  return data
}

export async function crear(tabla, fila) {
  const { error } = await supabase.from(tabla).insert(fila)
  if (error) throw error
}

export async function actualizar(tabla, id, fila) {
  const { error } = await supabase.from(tabla).update(fila).eq('id', id)
  if (error) throw error
}

export async function borrar(tabla, id) {
  const { error } = await supabase.from(tabla).delete().eq('id', id)
  if (error) throw error
}

// ----- Perfil (fila única, id = 1) -----
export async function obtenerPerfil() {
  const { data, error } = await supabase.from('perfil').select('*').eq('id', 1).single()
  if (error) throw error
  return data
}

export async function guardarPerfil(fila) {
  const { error } = await supabase.from('perfil').update(fila).eq('id', 1)
  if (error) throw error
}
