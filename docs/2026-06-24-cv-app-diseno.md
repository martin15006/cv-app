# CV App "El Monarca" — Documento de diseño

- **Fecha:** 2026-06-24
- **Estado:** Diseño aprobado (pendiente revisión final del spec)
- **Autor:** Juan Sebastián Martín Moncada (con Claude)

---

## 1. Objetivo
Convertir la hoja de vida estática en una **aplicación web** donde Martín gestione su CV sin tocar código:
- **Vista pública:** su CV "El Monarca" (mismo diseño actual).
- **Panel privado (`/admin`):** entra con usuario/contraseña y **añade, edita y borra** su información.

**Meta clave:** editar la info → el CV y el **PDF quedan siempre actualizados**.

## 2. Alcance (v1)
- ✅ Vista pública leyendo datos de la base de datos.
- ✅ Login (solo Martín).
- ✅ CRUD de todas las secciones.
- ✅ Seguridad con RLS.
- ✅ PDF siempre al día.
- ✅ Deploy en línea.
- ❌ **Fuera de v1 (se añade después si hace falta):** foto, multiusuario, panel de temas claro/oscuro, métricas/analítica, varios idiomas de interfaz (i18n), versiones del CV.

## 3. Arquitectura
- **Frontend:** **React + Vite** (SPA) con **React Router**. Dos rutas: `/` (público) y `/admin` (privado).
- **Backend:** **Supabase** como "backend sin servidor" → Postgres + Auth + API automática + RLS.
- El **navegador habla directo con Supabase** usando `@supabase/supabase-js` (anon key + RLS). No hay servidor propio que mantener.
- **PDF:** generado en el navegador (Fase 3).
- **Deploy:** Vercel/Netlify (auto-build) o GitHub Pages con build (Fase 3).

## 4. Modelo de datos (tablas en Supabase)
| Tabla | Campos principales | Tipo |
|---|---|---|
| `perfil` | nombre, titulo, tagline, perfil_texto, ubicacion, telefono, email, github, portafolio, disponible (bool) | 1 fila |
| `habilidades` | id, categoria, items (lista), orden | lista |
| `proyectos` | id, titulo, subtitulo, stack (lista), bullets (lista), enlace, rango, orden | lista |
| `educacion` | id, titulo, institucion, detalle, orden | lista |
| `cursos` | id, nombre, entidad, detalle, orden | lista |
| `idiomas` | id, idioma, nivel, orden | lista |

- Las "listas" (items, stack, bullets) se editan en un cuadro de texto **una por línea** y se guardan como arreglo (`text[]`).
- `orden` (número) define el orden de aparición.

## 5. Seguridad (Auth + RLS)
- **Supabase Auth** (correo + contraseña). Un solo usuario: Martín.
- **RLS activado en TODAS las tablas:**
  - `SELECT` → público (anon): cualquiera puede **leer** el CV.
  - `INSERT`/`UPDATE`/`DELETE` → solo `authenticated`: solo Martín puede **escribir**.
- ⚠️ **Lección de flota-sena:** la anon key viaja al navegador; si RLS está mal, cualquiera podría editar el CV. Se blinda desde la Fase 1. La **service_role key NUNCA** va al frontend.

## 6. Vista pública (`/`)
- Reutiliza el diseño **"El Monarca"** (mismo CSS y animaciones), pero arma cada sección **leyendo de Supabase** en vez de texto fijo.
- Incluye el botón **"Descargar PDF"**.

## 7. Panel admin (`/admin`)
- Pantalla de **login**.
- Tras autenticar: panel con cada sección y botones **Añadir · Editar · Borrar**.
- Formularios sencillos por tipo de dato; listas ordenables. Botón **Cerrar sesión**.

## 8. PDF "siempre actualizado" (Fase 3)
- Se genera en el navegador con los datos actuales.
- **Recomendado:** `@react-pdf/renderer` → PDF vectorial limpio (texto seleccionable, ATS-friendly), de un clic y **sin la fecha/encabezado del navegador**.
- **Alternativa rápida:** `html2pdf.js` (menos trabajo, calidad algo menor).

## 9. Deploy (Fase 3)
- **Recomendado:** Vercel o Netlify (se conectan a GitHub y compilan en cada push; gratis; manejan el ruteo de la SPA).
- **Alternativa:** GitHub Pages con un GitHub Action de build + config de ruta base + fallback de SPA.

## 10. Fases de construcción
1. **Cimientos** — crear proyecto Vite+React, instalar `@supabase/supabase-js` y router, crear tablas + RLS en Supabase, sembrar los datos actuales del CV, y mostrar la **vista pública leyendo de la BD** con el diseño Monarca.
2. **Admin** — login + panel CRUD (añadir/editar/borrar cada sección).
3. **PDF al día + deploy.**

## 11. Stack y decisiones técnicas
- React 19 + Vite · React Router · `@supabase/supabase-js` · `@react-pdf/renderer` (Fase 3).
- Variables de entorno en `.env` (no se commitean): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Sin backend propio.

## 12. Riesgos / notas
- **RLS mal configurada** = CV editable por cualquiera → se valida desde la Fase 1.
- **Fidelidad del PDF en cliente** → mitigado con `@react-pdf/renderer`.
- **Portar el diseño "El Monarca" a React** → se reutiliza el CSS y se reimplementan canvas/animaciones con `useEffect`.

---

> Documento base. Cada fase tendrá su propio plan de implementación detallado.
