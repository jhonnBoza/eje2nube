# eje2nube (CRUD + Render + PostgreSQL)

CRUD básico hecho con `Node.js + Express + EJS` usando PostgreSQL.

## Cómo ejecutarlo local

1. Crea una base de datos PostgreSQL (ejemplo: `eje2nube`)
2. Crea un usuario y ajusta `DATABASE_URL` en `.env` (usa `.env.example` como guía).
3. Ejecuta:

```bash
npm install
npm run dev
```

Luego abre: `http://localhost:10000`

## Deploy en Render

1. En Render crea un servicio **Web Service** (Node).
2. Agrega tu variable de entorno `DATABASE_URL` (la cadena de conexión que te da Render).
3. En el panel configura:
   - Build Command: `npm install`
   - Start Command: `npm start`

Render inyectará `PORT`; el servidor usa `process.env.PORT || 10000`.

## Sobre el modelo

La app crea automáticamente la tabla `tasks` con:
- `id`
- `title` (obligatorio)
- `description`
- `created_at`

Si tu profe pide otros campos/tabla, dime cuál entidad y qué columnas necesitas y lo ajusto.

