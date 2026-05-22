# FASE 0 — Estabilización Backend

> **Duración:** 1–2 días | **Esfuerzo:** ~7.5 horas | **Prioridad:** Crítica

## Objetivo

Corregir los 9 bugs encontrados en el análisis para que el sistema core sea funcional y se pueda agendar un turno de principio a fin.

## Bugs a corregir

| # | Bug | Archivo | Línea | Esfuerzo |
|---|-----|---------|-------|----------|
| 1 | Lógica de slot invertida (rechaza slots disponibles) | `services/appointment-service/src/services/appointmentService.js` | 41 | 15 min |
| 2 | Falta Bearer token en llamada a patient-service | `services/appointment-service/src/services/serviceClients.js` | 14 | 15 min |
| 3 | Ruta `/schedules/:id/slots` inalcanzable por orden de rutas | `services/doctor-service/src/routes/scheduleRoutes.js` | 8–9 | 5 min |
| 4 | Rutas `/appointments/patient/:id` y `/doctor/:id` inalcanzables | `services/appointment-service/src/routes/appointmentRoutes.js` | 8–14 | 5 min |
| 5 | JWT_SECRET hardcodeado con fallback público | `services/patient-service/src/services/authService.js`, `middleware/auth.js` | 20, 44, 12 | 30 min |
| 6 | Falta validación en POST /api/specialties (acepta nombres vacíos) | `services/doctor-service/src/routes/specialtyRoutes.js` | 7 | 1 h |
| 7 | Falta validación en PUT /api/patients/:id | `services/patient-service/src/routes/patientRoutes.js` | 9 | 1 h |
| 8 | Appointment service sin autenticación | `services/appointment-service/src/routes/appointmentRoutes.js` | — | 2 h |
| 9 | Doctor service sin autenticación en endpoints mutantes | `services/doctor-service/src/routes/*.js` | — | 2 h |

## Criterios de aceptación

### Backend funcional
- [ ] `POST /api/appointments` funciona end-to-end
- [ ] `GET /api/schedules/:id/slots?date=...` retorna slots disponibles (no 400)
- [ ] `GET /api/appointments/patient/:id` funciona
- [ ] `GET /api/appointments/doctor/:id` funciona

### Data integrity
- [ ] Si hay slot disponible, permite agendar
- [ ] No se pueden agendar dos turnos en el mismo slot
- [ ] Slots se generan correctamente según el schedule

### Security
- [ ] `JWT_SECRET` es obligatorio (falla startup sin él)
- [ ] `GET/PUT /api/patients/:id` solo autoriza al propietario del token
- [ ] `POST /api/specialties` valida nombre no vacío
- [ ] `PUT /api/patients/:id` valida campos

### Authorization
- [ ] `POST /api/appointments` requiere Bearer token
- [ ] Todos los endpoints de appointment protegidos
- [ ] Todos los endpoints mutantes de doctor protegidos

## Verificación

```bash
# Workflow completo post-fix
curl -s -X POST http://localhost:4002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"123456","name":"Ana","lastName":"García"}'

curl -s -X POST http://localhost:4001/api/specialties \
  -H "Content-Type: application/json" \
  -d '{"name":"Cardiología","description":"Especialidad en cardiología"}'

curl -s -X POST http://localhost:4001/api/doctors \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","lastName":"Pérez","email":"juan@test.com","specialtyId":"<specialty-id>"}'

curl -s -X POST http://localhost:4001/api/schedules \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"<doctor-id>","dayOfWeek":1,"startTime":"09:00","endTime":"17:00","slotDuration":30}'

curl -s "http://localhost:4001/api/schedules/<doctor-id>/slots?date=2026-05-25"

curl -s -X POST http://localhost:4003/api/appointments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"<doctor-id>","patientId":"<patient-id>","date":"2026-05-25","time":"09:00"}'
```

## Dependencias

- Docker corriendo con `docker-compose up -d --build`
- Ninguna. Esta fase es independiente.
