# FASE 4 — Pulido & Producción

> **Duración:** 2–3 días | **Esfuerzo:** ~15–20 horas | **Prioridad:** Media

## Objetivo

Optimizaciones finales de performance, seguridad, documentación y preparación para deploy.

---

## 4.1 Performance & Security

**Esfuerzo:** 3–4 h

### Backend

- [ ] **Rate limiting** en endpoints públicos (login, register)
  - Librería: `express-rate-limit`
  - Límite: 20 requests/min para auth, 100/min para otros
- [ ] **CORS configurado** con lista blanca de orígenes
  - No `*` en producción
  - Origen del frontend explicitado
- [ ] **Helmet.js** para security headers
  ```javascript
  const helmet = require('helmet')
  app.use(helmet())
  ```
- [ ] **Compression** (gzip)
  ```javascript
  const compression = require('compression')
  app.use(compression())
  ```
- [ ] **Connection pooling** optimizado
  - Sequelize pool: max 10, min 2, acquire 30000ms, idle 10000ms

### Frontend

- [ ] **Lazy loading** de rutas (code splitting con `defineAsyncComponent`)
- [ ] **Bundle size** < 500KB gzipped
- [ ] **Imágenes** optimizadas (WebP, lazy loading)

---

## 4.2 Observability & Logging

**Esfuerzo:** 2 h

### Structured Logging (Winston)

```javascript
// config/logger.js
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'doctor-service' },
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
      : []),
  ],
})

module.exports = logger
```

- [ ] Reemplazar `console.log`/`console.error` por logger
- [ ] Log levels: `error`, `warn`, `info`, `debug`
- [ ] Request ID para tracing
  ```javascript
  const uuid = require('uuid')
  app.use((req, res, next) => {
    req.requestId = uuid.v4()
    res.setHeader('X-Request-Id', req.requestId)
    next()
  })
  ```
- [ ] Mask sensitive data (passwords, tokens en logs)

### Health Check

- [ ] `GET /health` en cada servicio
  ```json
  {
    "status": "ok",
    "service": "doctor-service",
    "uptime": 12345,
    "db": "connected",
    "timestamp": "2026-05-22T12:00:00.000Z"
  }
  ```

---

## 4.3 API Documentation

**Esfuerzo:** 2–3 h

### OpenAPI / Swagger

```javascript
// Usando swagger-jsdoc + swagger-ui-express
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Healify API',
      version: '1.0.0',
      description: 'Medical appointment booking system',
    },
    servers: [
      { url: 'http://localhost:4001/api', description: 'doctor-service' },
      { url: 'http://localhost:4002/api', description: 'patient-service' },
      { url: 'http://localhost:4003/api', description: 'appointment-service' },
    ],
  },
  apis: ['./src/routes/*.js'],
}

const specs = swaggerJsdoc(options)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))
```

- [ ] Anotaciones OpenAPI en rutas
- [ ] Documentación accesible en `/api/docs`

---

## 4.4 UI Polish

**Esfuerzo:** 6–8 h

### UX/UI

- [ ] **Loading states** en todas las páginas (skeleton loaders)
- [ ] **Error boundaries** con mensajes amigables (no technical errors)
- [ ] **Validación en tiempo real** en formularios (antes de submit)
- [ ] **Toast/snackbar notifications** (éxito, error, warning)
- [ ] **Transiciones** suaves entre rutas (Vue `<Transition>`)
- [ ] **Responsive design** probado en mobile (375px+)
- [ ] **Touch-friendly** botones y inputs (min 44px)
- [ ] **Mobile navigation** (hamburger menu)

### Componentes a mejorar

| Componente | Mejora |
|------------|--------|
| BookingView | Calendar picker con indicación visual de slots disponibles |
| SlotPicker | Color coding (verde=disponible, gris=ocupado) |
| AppointmentCard | Badge con color según estado (pending=amarillo, confirmed=verde, cancelled=rojo) |
| Pagination | Page numbers + prev/next + total count |
| All tables | Sort columns, search/filter input |

---

## 4.5 Deployment

**Esfuerzo:** 2–3 h

### Docker Production

```dockerfile
# Dockerfile.production — multi-stage build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 4001
USER node
CMD ["node", "src/app.js"]
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.9'
services:
  doctor-service:
    build:
      context: ./services/doctor-service
      dockerfile: Dockerfile.production
    environment:
      NODE_ENV: production
      # ... resto de envs
    restart: always
```

### Deploy Targets (recomendados)

| Servicio | Plataforma |
|----------|-----------|
| PostgreSQL | Neon (serverless) o AWS RDS |
| Backend APIs | Railway, Fly.io, o DigitalOcean App Platform |
| Frontend | Vercel o Netlify |
| Docker host | Railway (soporta docker-compose nativo) |

### Pasos para Deploy

1. Configurar variables de entorno en la plataforma
2. Setear `NODE_ENV=production`
3. Generar JWT_SECRET fuerte: `openssl rand -hex 64`
4. Apuntar DB_HOST a la base de datos cloud
5. Configurar CORS con el dominio del frontend
6. Build y deploy del frontend a Vercel/Netlify
7. Health check cada endpoint para verificar
8. Configurar SSL/TLS (la plataforma lo maneja automáticamente)

---

## Criterios de Aceptación

### Performance
- [ ] API response time <200ms (p95)
- [ ] Frontend load time <2s
- [ ] Bundle size <500KB gzipped
- [ ] Zero broken images/assets

### Security
- [ ] HTTPS configurado
- [ ] No credentials en logs
- [ ] Rate limiting activo
- [ ] CORS permite solo orígenes esperados
- [ ] Helmet headers presentes en responses

### Observability
- [ ] Logs estructurados (formato JSON)
- [ ] Health check endpoint responde en cada servicio
- [ ] Request ID presente en cada request

### Documentation
- [ ] OpenAPI spec completa (todos los endpoints)
- [ ] Swagger UI funciona en `/api/docs`
- [ ] README principal actualizado con setup instructions

### UX
- [ ] Loading states visibles
- [ ] Errores mostrados en lenguaje de usuario (no técnico)
- [ ] Mobile responsive (< 768px funciona)
- [ ] Sin lag en interacciones (< 100ms feedback visual)

### Deploy
- [ ] Docker Compose build exitoso
- [ ] Frontend sirve correctamente desde URL
- [ ] Backend responde desde URL
- [ ] End-to-end workflow funciona en producción

---

## Dependencias

- Fases 0–3 completadas
- Cuenta en plataforma de deploy (Railway, Vercel, etc.)
- Dominio configurado (opcional)
