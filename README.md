# 1er Encuentro Agroecológico Tomasino — Registro

Sitio de registro público para el **1er Encuentro Agroecológico Tomasino**. Los datos se guardan en Supabase y el proyecto está listo para desplegar en Vercel.

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) y [Vercel](https://vercel.com)

## Configuración local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://app.supabase.com).
2. En el **SQL Editor**, ejecuta el script `supabase/schema.sql` para crear la tabla `event_registrations` y las políticas RLS.
3. En **Settings → API** copia la **Project URL** y la **anon public** key.

### 3. Variables de entorno

Copia el ejemplo y crea tu archivo local:

```bash
cp .env.example .env.local
```

Edita `.env.local` y rellena con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y verás el formulario de registro.

## Despliegue en Vercel

1. Sube el repositorio a GitHub (o conéctalo desde Vercel).
2. En [Vercel](https://vercel.com), crea un **New Project** e importa este repo.
3. En **Environment Variables** añade:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu Project URL de Supabase  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key de Supabase  
4. Despliega. Tras el build, el formulario quedará disponible en la URL de Vercel.

Solo necesitas tener la tabla creada en Supabase y estas dos variables; no hace falta más configuración.

## Estructura del proyecto

```
/app
  page.tsx        # Página principal con el formulario de registro
  layout.tsx
  globals.css
/components
  FormSection.tsx # Sección del formulario con título y descripción
  CheckboxField.tsx
/lib
  supabaseClient.ts # Cliente Supabase y tipo EventRegistration
/supabase
  schema.sql      # Script para crear la tabla en Supabase
```

## CRM / ver registros

Puedes usar Supabase como CRM:

- **Table Editor**: en el dashboard de Supabase, abre **Table Editor** y la tabla `event_registrations` para ver, filtrar y exportar registros.
- **SQL**: ejecuta consultas en el **SQL Editor** para reportes o filtros personalizados.

## Licencia

Uso interno para el 1er Encuentro Agroecológico Tomasino.
