# TaskMaster

Task manager app con React + TypeScript y Firebase (Auth + Firestore).

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Auth:** Firebase Authentication
- **Database:** Firestore (NoSQL)

## Desarrollo

```bash
npm install
npm run dev
```

## Variables de entorno

Copiá `.env.example` a `.env` y completá las credenciales de Firebase.

## Firestore Security Rules

Las reglas de seguridad están en `firestore.rules`. Requieren autenticación para leer/escribir documentos propios.
