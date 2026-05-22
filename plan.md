# Plan de Desarrollo — Sistema de Reservas de Turnos Médicos

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (opcional)                   │
│                       nginx / traefik                        │
└────┬──────────────────────┬──────────────────────┬──────────┘
     │                      │                      │
     ▼                      ▼                      ▼
┌──────────────┐   ┌──────────────────┐   ┌────────────────────┐
│ appointment- │   │   doctor-        │   │    patient-        │
│ service      │◄──►   service        │◄──►    service         │
│ (turnos)     │   │ (médicos)        │   │ (pacientes)        │
├──────────────┤   ├──────────────────┤   ├────────────────────┤
│ PostgreSQL   │   │ PostgreSQL       │   │ PostgreSQL         │
│ turnos       │   │ médicos/horarios │   │ pacientes/auth     │
└──────────────┘   └──────────────────┘   └────────────────────┘
```

### Comunicación

- **Síncrona (REST):** `appointment-service` consulta a `doctor-service` y `patient-service` vía HTTP para validar datos al crear un turno.
- **Asíncrona (opcional):** RabbitMQ para eventos posteriores (turno confirmado, recordatorio, cancelación).

### Bases de datos

| Servicio | BD | Razón |
|----------|----|-------|
| `doctor-service` | PostgreSQL (Sequelize) | Datos relacionales: médicos, especialidades, horarios. Relaciones claras. |
| `patient-service` | PostgreSQL (Sequelize) | Pacientes, usuarios, auth. Relacional con joins frecuentes. |
| `appointment-service` | PostgreSQL (Sequelize) | Turnos con relaciones a médicos y pacientes. Integridad referencial. |

---

## 2. Definición de cada microservicio

### 2.1 `doctor-service`

**Responsabilidad:** CRUD de médicos, especialidades y horarios disponibles.

**Bounded context:** Gestión del personal médico y su disponibilidad.

#### Endpoints REST

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| GET | `/api/doctors` | — | `{ doctors: [] }` |
| GET | `/api/doctors/:id` | — | `{ doctor: {...} }` |
| POST | `/api/doctors` | `{ name, lastName, email, specialtyId }` | `{ doctor: {...} }` |
| PUT | `/api/doctors/:id` | `{ name?, lastName?, email?, specialtyId? }` | `{ doctor: {...} }` |
| DELETE | `/api/doctors/:id` | — | `204` |
| GET | `/api/doctors/:id/slots?date=YYYY-MM-DD` | — | `{ slots: [] }` |
| POST | `/api/specialties` | `{ name, description }` | `{ specialty: {...} }` |
| GET | `/api/specialties` | — | `{ specialties: [] }` |
| POST | `/api/schedules` | `{ doctorId, dayOfWeek, startTime, endTime }` | `{ schedule: {...} }` |
| GET | `/api/doctors/:id/schedules` | — | `{ schedules: [] }` |

#### Modelo de datos

```sql
-- especialidades
specialties: id (UUID PK), name, description, createdAt, updatedAt

-- médicos
doctors: id (UUID PK), name, lastName, email (UNIQUE), specialtyId (FK→specialties), isActive, createdAt, updatedAt

-- horarios base (semanal)
schedules: id (UUID PK), doctorId (FK→doctors), dayOfWeek (0-6), startTime (TIME), endTime (TIME), slotDuration (INT, min), createdAt, updatedAt

-- excepciones (días feriados o ausencias)
exceptions: id (UUID PK), doctorId (FK→doctors), date (DATE), isAvailable (BOOL), reason, createdAt, updatedAt
```

#### Stack técnico

- Express + Sequelize (pg)
- Dotenv, cors, express-validator
- Puerto: `4001`

---

### 2.2 `patient-service`

**Responsabilidad:** Registro, autenticación y gestión de pacientes.

**Bounded context:** Identidad del paciente y sus datos demográficos.

#### Endpoints REST

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/auth/register` | `{ email, password, name, lastName, phone }` | `{ token, patient: {...} }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, patient: {...} }` |
| GET | `/api/patients/:id` | — | `{ patient: {...} }` |
| PUT | `/api/patients/:id` | `{ name?, lastName?, phone? }` | `{ patient: {...} }` |
| GET | `/api/patients` | — | `{ patients: [] }` |

#### Modelo de datos

```sql
patients: id (UUID PK), email (UNIQUE), passwordHash, name, lastName, phone, createdAt, updatedAt
```

#### Stack técnico

- Express + Sequelize (pg)
- bcrypt, jsonwebtoken, dotenv, cors, express-validator
- Puerto: `4002`

---

### 2.3 `appointment-service` (core)

**Responsabilidad:** Creación, consulta, cancelación de turnos. Orquesta la reserva.

**Bounded context:** Agenda de turnos y ciclo de vida de la reserva.

#### Endpoints REST

| Método | Ruta | Body | Response |
|--------|------|------|----------|
| POST | `/api/appointments` | `{ doctorId, patientId, date, time }` | `{ appointment: {...} }` |
| GET | `/api/appointments?doctorId=&date=&status=` | — | `{ appointments: [] }` |
| GET | `/api/appointments/:id` | — | `{ appointment: {...} }` |
| PUT | `/api/appointments/:id/cancel` | `{ reason? }` | `{ appointment: {...} }` |
| PUT | `/api/appointments/:id/confirm` | — | `{ appointment: {...} }` |
| GET | `/api/appointments/patient/:patientId` | — | `{ appointments: [] }` |
| GET | `/api/appointments/doctor/:doctorId` | — | `{ appointments: [] }` |

#### Modelo de datos

```sql
appointments: id (UUID PK), doctorId (UUID), patientId (UUID), date (DATE), time (TIME), status (ENUM: pending, confirmed, cancelled, completed), reason, createdAt, updatedAt
```

#### Stack técnico

- Express + Sequelize (pg)
- dotenv, cors, express-validator
- Puerto: `4003`
- HTTP client interno: `axios` o `node-fetch` para llamar a `doctor-service` y `patient-service`

---

## 3. Estructura de carpetas MVC (por servicio)

Cada microservicio sigue exactamente esta misma estructura:

```
services/doctor-service/
├── src/
│   ├── config/
│   │   └── database.js          # Conexión Sequelize
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Doctor.js
│   │   │   ├── Specialty.js
│   │   │   ├── Schedule.js
│   │   │   └── Exception.js
│   │   └── index.js             # Asociaciones
│   ├── controllers/
│   │   ├── doctorController.js
│   │   ├── specialtyController.js
│   │   └── scheduleController.js
│   ├── routes/
│   │   ├── index.js             # Agrupa todas las rutas
│   │   ├── doctorRoutes.js
│   │   ├── specialtyRoutes.js
│   │   └── scheduleRoutes.js
│   ├── services/
│   │   ├── doctorService.js
│   │   ├── specialtyService.js
│   │   └── scheduleService.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validate.js          # Wrapper para express-validator
│   ├── validators/
│   │   ├── doctorValidators.js
│   │   └── scheduleValidators.js
│   └── app.js                   # Configura Express
├── migrations/                  # Sequelize migrations
├── seeders/                     # Datos de prueba
├── Dockerfile
├── .env.example
├── .sequelizerc
└── package.json
```

---

## 4. Docker y orquestación

### 4.1 Dockerfile (genérico, uno por servicio)

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4001

CMD ["node", "src/app.js"]
```

### 4.2 docker-compose.yml

```yaml
version: '3.9'

services:
  doctor-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: doctors
      POSTGRES_USER: healify
      POSTGRES_PASSWORD: healify123
    ports:
      - "5432:5432"
    volumes:
      - doctor-data:/var/lib/postgresql/data

  patient-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: patients
      POSTGRES_USER: healify
      POSTGRES_PASSWORD: healify123
    ports:
      - "5433:5432"
    volumes:
      - patient-data:/var/lib/postgresql/data

  appointment-db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: appointments
      POSTGRES_USER: healify
      POSTGRES_PASSWORD: healify123
    ports:
      - "5434:5432"
    volumes:
      - appointment-data:/var/lib/postgresql/data

  doctor-service:
    build: ./services/doctor-service
    ports:
      - "4001:4001"
    environment:
      PORT: 4001
      DB_HOST: doctor-db
      DB_PORT: 5432
      DB_NAME: doctors
      DB_USER: healify
      DB_PASSWORD: healify123
    depends_on:
      - doctor-db

  patient-service:
    build: ./services/patient-service
    ports:
      - "4002:4002"
    environment:
      PORT: 4002
      DB_HOST: patient-db
      DB_PORT: 5432
      DB_NAME: patients
      DB_USER: healify
      DB_PASSWORD: healify123
      JWT_SECRET: supersecretkey
    depends_on:
      - patient-db

  appointment-service:
    build: ./services/appointment-service
    ports:
      - "4003:4003"
    environment:
      PORT: 4003
      DB_HOST: appointment-db
      DB_PORT: 5432
      DB_NAME: appointments
      DB_USER: healify
      DB_PASSWORD: healify123
      DOCTOR_SERVICE_URL: http://doctor-service:4001
      PATIENT_SERVICE_URL: http://patient-service:4002
    depends_on:
      - appointment-db
      - doctor-service
      - patient-service

volumes:
  doctor-data:
  patient-data:
  appointment-data:
```

### 4.3 Variables de entorno (.env.example)

```
# Servicio
PORT=4001
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healify
DB_USER=healify
DB_PASSWORD=healify123

# JWT (solo patient-service)
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=24h

# URLs de servicios internos (solo appointment-service)
DOCTOR_SERVICE_URL=http://doctor-service:4001
PATIENT_SERVICE_URL=http://patient-service:4002
```

---

## 5. Flujo principal de negocio

### Creación de un turno (POST /api/appointments)

```
Paciente                        appointment-service          doctor-service           patient-service
   │                                  │                          │                        │
   │  POST /api/appointments          │                          │                        │
   │  { doctorId, patientId,          │                          │                        │
   │    date, time }                  │                          │                        │
   │─────────────────────────────────►│                          │                        │
   │                                  │                          │                        │
   │                                  │  GET /api/doctors/:id    │                        │
   │                                  │─────────────────────────►│                        │
   │                                  │    { doctor }            │                        │
   │                                  │◄─────────────────────────│                        │
   │                                  │                          │                        │
   │                                  │  GET /api/patients/:id   │                        │
   │                                  │──────────────────────────────────────────────────►│
   │                                  │    { patient }           │                        │
   │                                  │◄──────────────────────────────────────────────────│
   │                                  │                          │                        │
   │                                  │  ┌─ Validar que el       │                        │
   │                                  │  │  horario esté         │                        │
   │                                  │  │  disponible (slots)   │                        │
   │                                  │  │  y no haya conflicto  │                        │
   │                                  │  └──────────────────────│                        │
   │                                  │                          │                        │
   │                                  │  ┌─ INSERT appointment   │                        │
   │                                  │  │  status: pending      │                        │
   │                                  │  └──────────────────────│                        │
   │                                  │                          │                        │
   │  { appointment: {...} }          │                          │                        │
   │◄─────────────────────────────────│                          │                        │
```

**Pasos detallados:**

1. El paciente (o un admin) envía `POST /api/appointments` con `doctorId`, `patientId`, `date` y `time`.
2. `appointment-service` valida el body (formato de fecha, hora, UUIDs).
3. `appointment-service` llama a `GET /api/doctors/:id` en `doctor-service` para verificar que el médico existe y está activo.
4. `appointment-service` llama a `GET /api/patients/:id` en `patient-service` para verificar que el paciente existe.
5. `appointment-service` consulta `GET /api/doctors/:id/slots?date=...` en `doctor-service` para obtener los slots disponibles y verifica que la hora solicitada está dentro de un slot libre.
6. `appointment-service` chequea en su propia BD que no exista otro turno para ese médico en la misma fecha/hora.
7. Se inserta el turno con `status: pending`.
8. Se retorna el turno creado.

### Cancelación (PUT /api/appointments/:id/cancel)

1. Validar que el turno existe y está en estado `pending` o `confirmed`.
2. Cambiar `status` a `cancelled`.
3. Retornar el turno actualizado.

---

## 6. Orden de implementación recomendado

| Orden | Servicio | Razón |
|-------|----------|-------|
| 1 | `doctor-service` | No depende de ningún otro servicio. Es la fuente de verdad de médicos y horarios, necesaria para que appointment-service pueda validar. |
| 2 | `patient-service` | Independiente. Necesario para tener pacientes antes de crear turnos. |
| 3 | `appointment-service` | Depende de doctor-service y patient-service. Es el orquestador. |
| 4 | `docker-compose.yml` + Dockerfiles | Una vez que los 3 servicios funcionan individualmente, se containeriza todo. |

### Orden interno por servicio (ej: doctor-service)

```
1. npm init, instalar dependencias (express, sequelize, pg, dotenv, cors)
2. src/config/database.js
3. src/domain/ (cada modelo + index.js con asociaciones)
4. src/middleware/errorHandler.js
5. src/validators/
6. src/services/ (lógica de negocio)
7. src/controllers/
8. src/routes/
9. src/app.js (montar rutas, middleware, sync DB)
10. migrations/ + seeders/
11. .env.example
12. Dockerfile
```

---

## 7. Diagrama de carpetas general del proyecto

```
healify-microservices/
├── services/
│   ├── doctor-service/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── database.js
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── Doctor.js
│   │   │   │   │   ├── Specialty.js
│   │   │   │   │   ├── Schedule.js
│   │   │   │   │   └── Exception.js
│   │   │   │   └── index.js
│   │   │   ├── controllers/
│   │   │   │   ├── doctorController.js
│   │   │   │   ├── specialtyController.js
│   │   │   │   └── scheduleController.js
│   │   │   ├── routes/
│   │   │   │   ├── index.js
│   │   │   │   ├── doctorRoutes.js
│   │   │   │   ├── specialtyRoutes.js
│   │   │   │   └── scheduleRoutes.js
│   │   │   ├── services/
│   │   │   │   ├── doctorService.js
│   │   │   │   ├── specialtyService.js
│   │   │   │   └── scheduleService.js
│   │   │   ├── middleware/
│   │   │   │   ├── errorHandler.js
│   │   │   │   └── validate.js
│   │   │   ├── validators/
│   │   │   │   ├── doctorValidators.js
│   │   │   │   └── scheduleValidators.js
│   │   │   └── app.js
│   │   ├── migrations/
│   │   ├── seeders/
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   ├── .sequelizerc
│   │   └── package.json
│   │
│   ├── patient-service/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── database.js
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── Patient.js
│   │   │   │   └── index.js
│   │   │   ├── controllers/
│   │   │   │   ├── authController.js
│   │   │   │   └── patientController.js
│   │   │   ├── routes/
│   │   │   │   ├── index.js
│   │   │   │   ├── authRoutes.js
│   │   │   │   └── patientRoutes.js
│   │   │   ├── services/
│   │   │   │   ├── authService.js
│   │   │   │   └── patientService.js
│   │   │   ├── middleware/
│   │   │   │   ├── auth.js
│   │   │   │   ├── errorHandler.js
│   │   │   │   └── validate.js
│   │   │   ├── validators/
│   │   │   │   └── authValidators.js
│   │   │   └── app.js
│   │   ├── migrations/
│   │   ├── seeders/
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   ├── .sequelizerc
│   │   └── package.json
│   │
│   └── appointment-service/
│       ├── src/
│       │   ├── config/
│       │   │   └── database.js
│       │   ├── domain/
│       │   │   ├── entities/
│       │   │   │   └── Appointment.js
│       │   │   └── index.js
│       │   ├── controllers/
│       │   │   └── appointmentController.js
│       │   ├── routes/
│       │   │   ├── index.js
│       │   │   └── appointmentRoutes.js
│       │   ├── services/
│       │   │   ├── appointmentService.js
│       │   │   └── serviceClients.js   # Clientes HTTP para doctor y patient
│       │   ├── middleware/
│       │   │   ├── errorHandler.js
│       │   │   └── validate.js
│       │   ├── validators/
│       │   │   └── appointmentValidators.js
│       │   └── app.js
│       ├── migrations/
│       ├── Dockerfile
│       ├── .env.example
│       ├── .sequelizerc
│       └── package.json
│
├── docker-compose.yml
├── .gitignore
└── plan.md
```
