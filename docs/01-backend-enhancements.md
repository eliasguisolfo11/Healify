# FASE 1 — Mejoras Backend (Production-Ready)

> **Duración:** 1–2 días | **Esfuerzo:** ~16 horas | **Prioridad:** Alta

## Objetivo

Llevar el backend a calidad production-ready con mejoras arquitectónicas, seguridad y rendimiento.

---

## 1.1 Code Quality

**Esfuerzo:** 4 h

- [ ] Extraer magic strings a constantes (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`)
- [ ] Remover código muerto (`exceptionOverride`, imports sin uso)
- [ ] Estandarizar formato de respuesta de errores
- [ ] Añadir middleware de request logging

**Archivos:** Todos los servicios (`services/*/src/{controllers,services,validators}/*.js`)

---

## 1.2 Pagination & Performance

**Esfuerzo:** 3 h

- [ ] `GET /api/doctors` — paginado (`limit`, `offset` params)
- [ ] `GET /api/patients` — paginado
- [ ] `GET /api/appointments` — paginado con filtros
- [ ] Default: 20 items/página, max 100

**Archivos:**
- `services/doctor-service/src/controllers/doctorController.js`
- `services/patient-service/src/controllers/patientController.js`
- `services/appointment-service/src/controllers/appointmentController.js`

---

## 1.3 Enhanced Validation

**Esfuerzo:** 2.5 h

- [ ] Doctor update: validar email si se cambia
- [ ] Schedule: validar `endTime > startTime`
- [ ] Appointment create: validar `date >= hoy`
- [ ] Mensajes de error claros y consistentes en todos los validadores

**Archivos:** `validators/*.js` en los 3 servicios

---

## 1.4 Error Handling Estandarizado

**Esfuerzo:** 1.5 h

- [ ] Formato único: `{ error: string, code: string, statusCode: number }`
- [ ] Error codes: `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `CONFLICT`, `INTERNAL_ERROR`
- [ ] Códigos HTTP consistentes (201, 200, 204, 400, 401, 403, 404, 409, 500)

**Archivos:** `middleware/errorHandler.js` en los 3 servicios

---

## 1.5 Database Optimization

**Esfuerzo:** 2 h

- [ ] Índice en `doctorId` (appointments)
- [ ] Índice en `patientId` (appointments)
- [ ] Índice en `email` (patients, doctors)
- [ ] Índice en `status` (appointments)

**Nota:** Como no hay migrations reales, crear scripts SQL en `migrations/` o agregar `indexes` en las definiciones de Sequelize.

---

## 1.6 Inter-Service Resilience

**Esfuerzo:** 3 h

- [ ] Retry logic: 3 reintentos con backoff exponencial (100ms, 200ms, 400ms)
- [ ] Timeout handling mejorado (5s default, mensaje claro)
- [ ] Circuit breaker simple: si 3 fallos seguidos, no llamar por 30s
- [ ] Logging de todas las llamadas inter-service con timing

**Archivos:**
- `services/appointment-service/src/services/serviceClients.js`
- `services/appointment-service/src/services/appointmentService.js`

---

## Criterios de Aceptación

### Code Quality
- [ ] Cero magic strings en controllers/services
- [ ] Cero warnings en linting (si se agrega ESLint)
- [ ] Sin código muerto

### Performance
- [ ] Endpoints de lista soportan paginación
- [ ] Queries usan índices
- [ ] Response time <200ms en query simple

### Security
- [ ] CORS configurado correctamente (lista blanca de orígenes)
- [ ] Secrets no expuestos en logs
- [ ] SQL injection prevention (Sequelize parametrizado)

### Resilience
- [ ] Retry logic funciona ante fallos transitorios
- [ ] Timeouts manejados con error legible (no crash)
- [ ] Errores de servicio externo retornan 503, no 500

---

## Dependencias

- Fase 0 completada (bugs críticos corregidos)
