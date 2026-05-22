# FASE 3 — Testing & CI/CD

> **Duración:** 3–4 días | **Esfuerzo:** ~30–35 horas | **Prioridad:** Media

## Objetivo

Garantizar que el sistema es confiable mediante tests automatizados y un pipeline de CI/CD.

---

## 3.1 Backend Unit Tests (Jest)

**Esfuerzo:** 8–10 h

### Estructura

```
services/*/src/
├── services/
│   ├── __tests__/
│   │   ├── doctorService.test.js
│   │   ├── scheduleService.test.js
│   │   └── specialtyService.test.js
```

### Tests por Servicio

#### Patient Service (`services/patient-service`)
- [ ] `authService.register()` — crea paciente, hashea password, retorna token
- [ ] `authService.register()` — rechaza email duplicado (409)
- [ ] `authService.login()` — retorna token con credenciales válidas
- [ ] `authService.login()` — rechaza password incorrecto (401)
- [ ] `authService.login()` — rechaza email inexistente (401, mismo mensaje)
- [ ] `patientService.findAll()` — retorna lista paginada
- [ ] `patientService.findById()` — retorna paciente sin password hash
- [ ] `patientService.update()` — actualiza campos válidos

#### Doctor Service (`services/doctor-service`)
- [ ] `doctorService.create()` — crea doctor con specialtyId válido
- [ ] `doctorService.create()` — rechaza specialtyId inválido
- [ ] `doctorService.findAll()` — incluye specialty eager-loaded
- [ ] `doctorService.remove()` — hard delete
- [ ] `scheduleService.getSlotsByDoctorAndDate()` — genera slots correctos
- [ ] `scheduleService.getSlotsByDoctorAndDate()` — respeta slotDuration
- [ ] `scheduleService.getSlotsByDoctorAndDate()` — excluye horario no laboral
- [ ] `scheduleService.getSlotsByDoctorAndDate()` — maneja exceptions (día feriado)
- [ ] `specialtyService.create()` — crea especialidad
- [ ] `specialtyService.create()` — rechaza nombre duplicado

#### Appointment Service (`services/appointment-service`)
- [ ] `appointmentService.create()` — booking exitoso (slot disponible)
- [ ] `appointmentService.create()` — rechaza si slot ocupado (409)
- [ ] `appointmentService.create()` — rechaza si doctor no existe (404)
- [ ] `appointmentService.create()` — rechaza si paciente no existe (404)
- [ ] `appointmentService.create()` — rechaza si hora no está en slots (400)
- [ ] `appointmentService.cancel()` — cambia status a `cancelled`
- [ ] `appointmentService.cancel()` — rechaza si ya cancelado (400)
- [ ] `appointmentService.cancel()` — rechaza si completado (400)
- [ ] `appointmentService.confirm()` — cambia status a `confirmed`
- [ ] `appointmentService.findAll()` — filtra por doctorId, date, status
- [ ] `appointmentService.findByPatient()` — ordena por date DESC
- [ ] `appointmentService.findByDoctor()` — ordena por date DESC

#### Validators
- [ ] emailValidator — rechaza formatos inválidos
- [ ] uuidValidator — rechaza strings no UUID
- [ ] timeValidator — rechaza formato no HH:mm
- [ ] dayOfWeekValidator — rechaza valores fuera de 0–6

### Coverage Target: 70%+ en services críticos

```bash
npm test -- --coverage
```

---

## 3.2 Backend Integration Tests

**Esfuerzo:** 8–10 h

### Setup

Usar `supertest` para hacer requests HTTP reales a la app Express.

```
services/*/src/
├── __tests__/
│   └── integration/
│       ├── auth.test.js
│       ├── doctor.test.js
│       ├── appointment.test.js
│       └── workflows.test.js
```

### Test Suites

#### Auth Flow (`auth.test.js`)
- [ ] POST /auth/register → 201 + token
- [ ] POST /auth/login → 200 + token
- [ ] POST /auth/login con credenciales inválidas → 401
- [ ] GET /patients/:id sin token → 401
- [ ] GET /patients/:id con token válido → 200
- [ ] GET /patients/:id de otro paciente → 403

#### Doctor Flow (`doctor.test.js`)
- [ ] POST /doctors → 201
- [ ] GET /doctors → 200 array
- [ ] GET /doctors/:id → 200
- [ ] PUT /doctors/:id → 200
- [ ] DELETE /doctors/:id → 204
- [ ] POST /schedules → 201
- [ ] GET /schedules/:doctorId/slots?date=... → 200 con slots

#### Appointment Flow (`appointment.test.js`)
- [ ] POST /appointments con token → 201
- [ ] POST /appointments sin token → 401
- [ ] POST /appointments slot ocupado → 409
- [ ] PUT /appointments/:id/confirm → 200
- [ ] PUT /appointments/:id/cancel → 200
- [ ] GET /appointments/patient/:id → 200
- [ ] GET /appointments/doctor/:id → 200

#### Full Workflow (`workflows.test.js`)
- [ ] Happy path: register → create specialty → create doctor → create schedule → book appointment → confirm → list
- [ ] Cancel path: book → cancel → list confirms cancelled
- [ ] Error path: book same slot twice → 409

---

## 3.3 Frontend Tests (Vitest)

**Esfuerzo:** 6–8 h

### Component Tests

- [ ] `LoginForm.vue` — renderiza inputs, valida campos vacíos, llama submit
- [ ] `RegisterForm.vue` — valida password match, email format
- [ ] `DoctorCard.vue` — renderiza datos del doctor, click propaga evento
- [ ] `SlotPicker.vue` — muestra slots, selecciona hora, deshabilita slots ocupados
- [ ] `AppointmentCard.vue` — muestra estado, botón cancelar si está pendiente
- [ ] `Pagination.vue` — calcula páginas correctamente, emite eventos
- [ ] `ErrorMessage.vue` — renderiza mensaje de error

### Store Tests

- [ ] `authStore.login()` — actualiza estado con datos mock
- [ ] `authStore.logout()` — limpia todo
- [ ] `doctorsStore.fetchDoctors()` — carga datos desde API mock

### Tooling

```bash
# frontend/package.json
npm install -D vitest @vue/test-utils happy-dom
```

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

---

## 3.4 E2E Tests (Playwright)

**Esfuerzo:** 6–8 h

### Escenarios

- [ ] **Paciente:** register → login → browse specialties → select doctor → book → view appointments → cancel
- [ ] **Doctor:** login → view schedule → view appointments → confirm
- [ ] **Admin:** login → create specialty → create doctor → view dashboard
- [ ] **Error:** login with wrong password → see error

### Setup

```bash
npm install -D @playwright/test
npx playwright install
```

---

## 3.5 CI/CD Pipeline (GitHub Actions)

**Esfuerzo:** 3–4 h

### Workflow: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: healify
          POSTGRES_PASSWORD: healify123
          POSTGRES_DB: healify_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    strategy:
      matrix:
        service: [doctor-service, patient-service, appointment-service]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: services/${{ matrix.service }}/package-lock.json

      - run: npm ci
        working-directory: services/${{ matrix.service }}

      - run: npm test -- --coverage
        working-directory: services/${{ matrix.service }}
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USER: healify
          DB_PASSWORD: healify123
          DB_NAME: healify_test
          JWT_SECRET: test-secret

      - uses: codecov/codecov-action@v3
        with:
          directory: services/${{ matrix.service }}/coverage
          flags: ${{ matrix.service }}

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - run: npm ci
        working-directory: frontend

      - run: npm run test:unit
        working-directory: frontend

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm install -g eslint
      - run: eslint services/*/src frontend/src

  docker-build:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    steps:
      - uses: actions/checkout@v4
      - run: docker-compose build
```

---

## Criterios de Aceptación

### Unit Tests
- [ ] 70%+ coverage en services críticos
- [ ] Todos los validadores testeados (casos válidos e inválidos)
- [ ] Tests pasan en CI

### Integration Tests
- [ ] Workflow completo funciona end-to-end
- [ ] Errores HTTP manejados correctamente
- [ ] Conflict detection funciona (mismo slot)

### Frontend Tests
- [ ] Componentes principales testeados
- [ ] Stores testeados con mocks
- [ ] Errores renderizan correctamente

### CI/CD
- [ ] Tests corren automáticamente en PR
- [ ] Build falla si tests fallan
- [ ] Coverage report generado
- [ ] Docker build exitoso

---

## Dependencias

- Fase 2 completada (frontend existe para E2E tests)
- Backend de Fase 0 funcionando (para integration tests)
