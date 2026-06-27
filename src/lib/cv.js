import { supabase } from './supabase.js'
import { ordenar, ordenarPorRango } from './util.js'

/** Trae todas las secciones del CV desde Supabase. */
export async function cargarCv() {
  const [perfil, habilidades, proyectos, educacion, cursos, idiomas] =
    await Promise.all([
      supabase.from('perfil').select('*').single(),
      supabase.from('habilidades').select('*'),
      supabase.from('proyectos').select('*'),
      supabase.from('educacion').select('*'),
      supabase.from('cursos').select('*'),
      supabase.from('idiomas').select('*'),
    ])

  return {
    perfil: perfil.data,
    habilidades: ordenar(habilidades.data),
    proyectos: ordenarPorRango(proyectos.data),
    educacion: ordenar(educacion.data),
    cursos: ordenar(cursos.data),
    idiomas: ordenar(idiomas.data),
  }
}
