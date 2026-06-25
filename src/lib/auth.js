import { supabase } from './supabase.js'

export const iniciarSesion = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const cerrarSesion = () => supabase.auth.signOut()

export const obtenerSesion = () => supabase.auth.getSession()

export const alCambiarSesion = (cb) =>
  supabase.auth.onAuthStateChange((_evento, sesion) => cb(sesion))
