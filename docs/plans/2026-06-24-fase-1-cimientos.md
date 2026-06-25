# Fase 1 — Cimientos · Plan de implementación

> **Para quien implementa:** ejecutar tarea por tarea. Los pasos usan checkbox `- [ ]`. Pasos marcados con 🧑 **los hace Martín** (acciones en el panel de Supabase o en su terminal); el resto los escribe/guía Claude.

**Goal:** La página pública (`/`) trae los datos del CV desde Supabase y los muestra, corriendo en local (`npm run dev`).

**Architecture:** App React + Vite (SPA). El navegador lee de Supabase (Postgres) con `@supabase/supabase-js` usando la anon key + RLS. Sin servidor propio.

**Tech Stack:** React 19, Vite, React Router, @supabase/supabase-js, Vitest (pruebas).

> El **diseño "El Monarca"** se aplica en un paso posterior (Fase 1.5). Aquí primero hacemos que los **datos fluyan** con un render limpio y simple.

---

## Estructura de archivos (Fase 1)
- `src/lib/supabase.js` — crea el cliente de Supabase (1 responsabilidad: conexión).
- `src/lib/cv.js` — funciones para traer y normalizar los datos del CV.
- `src/lib/cv.test.js` — prueba de la normalización.
- `src/pages/CvPublico.jsx` — vista pública que muestra el CV.
- `src/components/Seccion.jsx` — componente reutilizable para listar una sección.
- `src/App.jsx` — rutas (`/` y `/admin` placeholder).
- `.env` — credenciales de Supabase (NO se sube a git).
- `sql/01_esquema_y_rls.sql` — tablas + RLS.
- `sql/02_datos_iniciales.sql` — datos de arranque.

---

### Task 1: Crear el proyecto Vite + React

**Files:** crea la base del proyecto en `Escritorio\cv-app` (ya existe la carpeta con `docs/`).

- [ ] 🧑 **Step 1: Scaffold de Vite** (en PowerShell)

```powershell
cd "$env:USERPROFILE\Desktop"
npm create vite@latest cv-app -- --template react
```
Cuando avise que la carpeta no está vacía, elige **"Ignore files and continue"** (así conserva `docs/`).

- [ ] 🧑 **Step 2: Instalar dependencias base**

```powershell
cd "$env:USERPROFILE\Desktop\cv-app"
npm install
```

- [ ] 🧑 **Step 3: Verificar que arranca**

Run: `npm run dev` → abre http://localhost:5173 → debe verse la plantilla de Vite. Luego Ctrl+C para parar.
Expected: la página demo de Vite carga sin errores.

- [ ] **Step 4: Commit**

```powershell
git init
git add -A
git commit -m "chore: scaffold inicial Vite + React"
```

---

### Task 2: Instalar librerías del proyecto

- [ ] 🧑 **Step 1: Instalar runtime y dev deps**

```powershell
npm install @supabase/supabase-js react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Configurar Vitest** — `Modify: vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 3: Añadir script de test** — `Modify: package.json` (en "scripts")

```json
"test": "vitest run"
```

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "chore: agregar supabase, router y vitest"
```

---

### Task 3: Crear el proyecto Supabase, tablas y RLS

- [ ] 🧑 **Step 1: Crear proyecto en Supabase**

En https://supabase.com → New project (nombre: `cv-monarca`). Guarda la contraseña de la BD. Espera a que aparezca "Project is ready".

- [ ] **Step 2: Escribir el esquema + RLS** — `Create: sql/01_esquema_y_rls.sql`

```sql
-- ===== TABLAS =====
create table perfil (
  id int primary key default 1,
  nombre text, titulo text, tagline text, perfil_texto text,
  ubicacion text, telefono text, email text, github text, portafolio text,
  disponible boolean default true,
  constraint solo_una_fila check (id = 1)
);
create table habilidades ( id bigint generated always as identity primary key,
  categoria text not null, items text[] not null default '{}', orden int default 0 );
create table proyectos ( id bigint generated always as identity primary key,
  titulo text not null, subtitulo text, stack text[] default '{}',
  bullets text[] default '{}', enlace text, rango text, orden int default 0 );
create table educacion ( id bigint generated always as identity primary key,
  titulo text not null, institucion text, detalle text, orden int default 0 );
create table cursos ( id bigint generated always as identity primary key,
  nombre text not null, entidad text, detalle text, orden int default 0 );
create table idiomas ( id bigint generated always as identity primary key,
  idioma text not null, nivel text, orden int default 0 );

-- ===== RLS: leer todos, escribir solo autenticado =====
do $$
declare t text;
begin
  foreach t in array array['perfil','habilidades','proyectos','educacion','cursos','idiomas']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy "lectura publica" on %I for select using (true);', t);
    execute format('create policy "escritura autenticada" on %I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;
```

- [ ] 🧑 **Step 3: Ejecutar el SQL**

En Supabase → **SQL Editor** → pega el contenido de `sql/01_esquema_y_rls.sql` → **Run**.
Expected: "Success. No rows returned". En **Table editor** aparecen las 6 tablas con el candado de RLS.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "feat(db): esquema de tablas + RLS"
```

---

### Task 4: Cargar los datos iniciales del CV

- [ ] **Step 1: Escribir el seed** — `Create: sql/02_datos_iniciales.sql`

```sql
insert into perfil (id, nombre, titulo, tagline, perfil_texto, ubicacion, telefono, email, github, portafolio, disponible)
values (1,
 'Juan Sebastián Martín Moncada',
 'Desarrollador de Software Full-Stack',
 'Aprendiz SENA. Construyo aplicaciones web y móviles con React, React Native y Node.js sobre PostgreSQL.',
 'Desarrollador full-stack, Aprendiz SENA. Desarrollo aplicaciones web y móviles con JavaScript/TypeScript, React, React Native y Node.js (Express/NestJS) sobre PostgreSQL. He trabajado en proyectos reales —un sistema de gestión de flota para el SENA (SENNOVA) y un proyecto en equipo donde desarrollé la parte móvil—, con autenticación por roles, APIs REST y Git. Resolución de problemas, aprendizaje autónomo y trabajo en equipo. Inglés básico-intermedio.',
 'Ibagué, Tolima', '313 647 2081 · 315 788 1826', 'juanitomartin15006@gmail.com',
 'github.com/martin15006', 'https://martin15006.github.io', true);

insert into idiomas (idioma, nivel, orden) values
 ('Español','nativo',1), ('Inglés','básico-intermedio',2);

insert into educacion (titulo, institucion, detalle, orden) values
 ('Tecnólogo en Análisis y Desarrollo de Software (ADSO)','SENA','Centro de Industria y Construcción, Regional Tolima · En curso.',1),
 ('Bachiller Académico','I.E. INEM Manuel Murillo Toro, Ibagué','2023.',2);

insert into habilidades (categoria, items, orden) values
 ('Lenguajes', array['JavaScript (ES6+)','TypeScript','Python','SQL','HTML5','CSS3'], 1),
 ('Front-end', array['React','Vite','React Router','Tailwind CSS','Diseño responsive'], 2),
 ('Móvil', array['React Native','Expo'], 3),
 ('Back-end', array['Node.js','Express','NestJS','APIs REST','TypeORM'], 4);
```

> Esto carga el perfil completo + idiomas + educación + algunas habilidades, suficiente para **ver todas las secciones funcionando**. El resto de cursos/proyectos/habilidades los cargarás desde el panel `/admin` en la Fase 2 (que es justo el propósito de la app).

- [ ] 🧑 **Step 2: Ejecutar el seed**

Supabase → SQL Editor → pega `sql/02_datos_iniciales.sql` → **Run**.
Expected: filas insertadas; en Table editor ves los datos.

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "feat(db): datos iniciales del CV"
```

---

### Task 5: Configurar credenciales (.env) y el cliente

- [ ] 🧑 **Step 1: Copiar credenciales** — Supabase → Settings → **API**: copia **Project URL** y la **anon public key**.

- [ ] **Step 2: Crear `.env`** — `Create: .env` (raíz del proyecto)

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```
(Martín pega sus valores reales.)

- [ ] **Step 3: Ignorar `.env` en git** — `Modify: .gitignore` (añadir una línea)

```
.env
```

- [ ] **Step 4: Crear el cliente** — `Create: src/lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, anonKey)
```

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: cliente de Supabase + variables de entorno"
```

---

### Task 6: Traer y normalizar los datos (con prueba)

**Files:** Create `src/lib/cv.js`, Test `src/lib/cv.test.js`

- [ ] **Step 1: Escribir la prueba que falla** — `Create: src/lib/cv.test.js`

```js
import { describe, it, expect } from 'vitest'
import { ordenar } from './cv.js'

describe('ordenar', () => {
  it('ordena por el campo orden ascendente', () => {
    const entrada = [{ orden: 2, x: 'b' }, { orden: 1, x: 'a' }]
    expect(ordenar(entrada).map(i => i.x)).toEqual(['a', 'b'])
  })
  it('no falla si la lista es null', () => {
    expect(ordenar(null)).toEqual([])
  })
})
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npm test`
Expected: FAIL ("ordenar is not a function" / no existe `cv.js`).

- [ ] **Step 3: Implementar** — `Create: src/lib/cv.js`

```js
import { supabase } from './supabase.js'

export function ordenar(lista) {
  if (!lista) return []
  return [...lista].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
}

export async function cargarCv() {
  const [perfil, habilidades, proyectos, educacion, cursos, idiomas] = await Promise.all([
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
    proyectos: ordenar(proyectos.data),
    educacion: ordenar(educacion.data),
    cursos: ordenar(cursos.data),
    idiomas: ordenar(idiomas.data),
  }
}
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npm test`
Expected: PASS (2 pruebas verdes).

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: cargar y ordenar datos del CV (con prueba)"
```

---

### Task 7: Componente de sección reutilizable

**Files:** Create `src/components/Seccion.jsx`

- [ ] **Step 1: Implementar** — `Create: src/components/Seccion.jsx`

```jsx
export default function Seccion({ titulo, children }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ borderBottom: '2px solid #5b3fb0', display: 'inline-block', paddingRight: 12 }}>
        {titulo}
      </h2>
      <div>{children}</div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add -A
git commit -m "feat: componente Seccion reutilizable"
```

---

### Task 8: Vista pública que muestra el CV

**Files:** Create `src/pages/CvPublico.jsx`

- [ ] **Step 1: Implementar** — `Create: src/pages/CvPublico.jsx`

```jsx
import { useEffect, useState } from 'react'
import { cargarCv } from '../lib/cv.js'
import Seccion from '../components/Seccion.jsx'

export default function CvPublico() {
  const [cv, setCv] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarCv().then(setCv).catch(e => setError(e.message))
  }, [])

  if (error) return <p style={{ padding: 24, color: 'crimson' }}>Error: {error}</p>
  if (!cv) return <p style={{ padding: 24 }}>Cargando…</p>

  const p = cv.perfil
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1>{p?.nombre}</h1>
      <p><strong>{p?.titulo}</strong></p>
      <p>{p?.tagline}</p>
      <p>{p?.ubicacion} · {p?.telefono} · {p?.email} · {p?.github} · {p?.portafolio}</p>

      <Seccion titulo="Perfil profesional"><p>{p?.perfil_texto}</p></Seccion>

      <Seccion titulo="Habilidades">
        {cv.habilidades.map(h => (
          <p key={h.id}><strong>{h.categoria}:</strong> {h.items.join(' · ')}</p>
        ))}
      </Seccion>

      <Seccion titulo="Proyectos">
        {cv.proyectos.map(pr => (
          <div key={pr.id}><strong>{pr.titulo}</strong> — {pr.subtitulo}</div>
        ))}
      </Seccion>

      <Seccion titulo="Educación">
        {cv.educacion.map(e => (
          <div key={e.id}><strong>{e.titulo}</strong> — {e.institucion} · {e.detalle}</div>
        ))}
      </Seccion>

      <Seccion titulo="Cursos">
        {cv.cursos.map(c => (
          <div key={c.id}>{c.nombre} — {c.entidad} {c.detalle}</div>
        ))}
      </Seccion>

      <Seccion titulo="Idiomas">
        {cv.idiomas.map(i => (
          <div key={i.id}><strong>{i.idioma}:</strong> {i.nivel}</div>
        ))}
      </Seccion>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add -A
git commit -m "feat: vista publica del CV leyendo de Supabase"
```

---

### Task 9: Rutas (`/` y `/admin` placeholder)

**Files:** Modify `src/App.jsx`, Modify `src/main.jsx`

- [ ] **Step 1: Rutas** — `Modify: src/App.jsx` (reemplazar todo el contenido)

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CvPublico from './pages/CvPublico.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CvPublico />} />
        <Route path="/admin" element={<p style={{ padding: 24 }}>Panel admin — Fase 2 🚧</p>} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Asegurar que main.jsx use App** — `Modify: src/main.jsx` (debe renderizar `<App />`; quitar el CSS demo si estorba)

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
```

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "feat: rutas publica y admin (placeholder)"
```

---

### Task 10: Verificación final (local)

- [ ] 🧑 **Step 1: Correr la app**

Run: `npm run dev` → http://localhost:5173
Expected: se ve tu CV con **tus datos reales traídos de Supabase** (nombre, perfil, habilidades, educación, idiomas). `/admin` muestra el placeholder.

- [ ] 🧑 **Step 2: Probar RLS (seguridad)**

En Supabase → Table editor → intenta ver que la lectura pública funciona (la app ya lo prueba). La escritura sin login debe estar bloqueada (se valida a fondo en la Fase 2 con el login).

- [ ] **Step 3: Correr pruebas**

Run: `npm test`
Expected: PASS.

---

## Resultado de la Fase 1
La app corre en local y la página pública muestra el CV **leyendo de Supabase**, con RLS protegiendo la escritura. Quedan listas para las siguientes fases:
- **Fase 1.5:** aplicar el diseño "El Monarca" (reusar el CSS y animaciones del CV actual).
- **Fase 2:** login + panel `/admin` con CRUD.
- **Fase 3:** PDF al día + deploy.
</content>
