-- ============================================================
-- CV App — Datos iniciales (CV real de Juan Sebastián Martín)
-- Ejecutar DESPUÉS de 01_esquema_y_rls.sql
-- ============================================================

insert into perfil (id, nombre, titulo, tagline, perfil_texto, ubicacion, telefono, email, github, portafolio, disponible)
values (1,
 'Juan Sebastián Martín Moncada',
 'Desarrollador de Software Full-Stack',
 'Aprendiz SENA. Construyo aplicaciones web y móviles con React, React Native y Node.js sobre PostgreSQL.',
 'Desarrollador full-stack, Aprendiz SENA. Desarrollo aplicaciones web y móviles con JavaScript/TypeScript, React, React Native y Node.js (Express/NestJS) sobre PostgreSQL. He trabajado en proyectos reales —un sistema de gestión de flota para el SENA (SENNOVA) y un proyecto en equipo donde desarrollé la parte móvil—, con autenticación por roles, APIs REST y Git. Resolución de problemas, aprendizaje autónomo y trabajo en equipo. Inglés básico-intermedio.',
 'Ibagué, Tolima', '313 647 2081 · 315 788 1826', 'juanitomartin15006@gmail.com',
 'github.com/martin15006', 'https://martin15006.github.io', true);

insert into idiomas (idioma, nivel, orden) values
 ('Español', 'nativo', 1),
 ('Inglés', 'básico-intermedio', 2);

insert into educacion (titulo, institucion, detalle, orden) values
 ('Tecnólogo en Análisis y Desarrollo de Software (ADSO)', 'SENA', 'Centro de Industria y Construcción, Regional Tolima · En curso.', 1),
 ('Bachiller Académico', 'I.E. INEM Manuel Murillo Toro, Ibagué', '2023.', 2);

insert into habilidades (categoria, items, orden) values
 ('Lenguajes', array['JavaScript (ES6+)','TypeScript','Python','SQL','HTML5','CSS3'], 1),
 ('Front-end', array['React','Vite','React Router','Tailwind CSS','Diseño responsive'], 2),
 ('Móvil', array['React Native','Expo'], 3),
 ('Back-end', array['Node.js','Express','NestJS','APIs REST','TypeORM'], 4),
 ('Bases de datos', array['PostgreSQL (Supabase)','Diseño de esquemas SQL'], 5),
 ('Auth y seguridad', array['JWT','bcrypt','Acceso por roles','Fundamentos hacking ético'], 6),
 ('Inteligencia artificial', array['Modelos locales (Ollama)','RAG (embeddings)','Búsqueda vectorial','Voz (transcripción/lectura)'], 7),
 ('Herramientas y prácticas', array['Git y GitHub (ramas)','Vitest','Despliegue en la nube','Supabase','Cloudinary'], 8),
 ('Datos y ofimática', array['Análisis de datos','Excel intermedio'], 9);

insert into proyectos (titulo, subtitulo, stack, bullets, enlace, rango, orden) values
 ('Sistema de Gestión de Flota Vehicular — SENA',
  'SENNOVA / ID+I, Regional Tolima · Desarrollador full-stack (individual)',
  array['React 19','Vite','Node + Express','PostgreSQL (Supabase)','JWT','bcrypt','Cloudinary'],
  array['Login con roles multinivel y control de acceso.','Gestión de vehículos y chequeo preoperacional de 39 ítems.','Dashboard, auditoría y exportación a PDF/Word.'],
  'github.com/martin15006/flota-sena', 'S', 1),
 ('App de Gestión de Parqueadero',
  'Proyecto en equipo · Rol: desarrollo de la app móvil',
  array['React Native','Expo','TypeScript','NestJS','React + Tailwind','SQL'],
  array['Desarrollé la aplicación móvil (React Native + Expo + TypeScript).','Stack del equipo: backend NestJS, frontend React + Tailwind, BD SQL.'],
  null, 'A', 2),
 ('JARVIS — Asistente de IA 100% local',
  'Sin internet · Privacidad por diseño',
  array['Python','Ollama','RAG','Voz'],
  array['RAG: preguntar directamente a documentos propios.','Control por voz: transcripción y lectura.','Enrutado multi-modelo según la tarea.'],
  null, 'A', 3),
 ('Refugio ↔ Torre — Videojuego 2D',
  'Motor Phaser · Arquitectura testeada',
  array['Phaser','JavaScript','Vitest'],
  array['+140 pruebas automatizadas con Vitest.','Arquitectura que separa la lógica del render.'],
  'github.com/martin15006/refugio-torre', 'B', 4);

insert into cursos (nombre, entidad, detalle, orden) values
 ('Variables y Estructuras de Control en Python', 'SENA', '48 h · 2025', 1),
 ('Maquetación de Sitios Web con HTML5 y CSS3', 'SENA', '48 h · 2025', 2),
 ('Diseño y Desarrollo de Sistemas de Información', 'SENA', '144 h', 3),
 ('Análisis de Datos — Nivel Explorador', 'MinTIC · CUN (Talento Tech)', '164 h', 4),
 ('Generative AI: Prompt Engineering Basics', 'IBM · Coursera', '2025', 5),
 ('Excel Intermedio (Hojas de Cálculo)', 'SENA', '60 h', 6),
 ('Herramientas Metodológicas en Investigación Aplicada', 'SENA', '40 h', 7),
 ('Cómo Resolver Problemas y Tomar Decisiones con Eficacia', 'UC Irvine · Coursera', null, 8),
 ('Competencias Ciudadanas (Saber Pro)', 'SENA', '40 h', 9),
 ('Inglés — Básico (Niveles 1 a 4) y Pre-Intermedio (Nivel 2)', 'SENA', null, 10);
