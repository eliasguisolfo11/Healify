# Healify — Sistema de Reservas de Turnos Médicos

Arquitectura de microservicios en Node.js para gestionar médicos, pacientes y turnos. Cada servicio tiene su propia base de datos PostgreSQL y se comunican vía REST.

## Microservicios

| Servicio | Puerto | Responsabilidad |
|----------|--------|----------------|
| `doctor-service` | `4001` | CRUD de médicos, especialidades, horarios y slots disponibles |
| `patient-service` | `4002` | Registro, autenticación JWT y datos de pacientes |
| `appointment-service` | `4003` | Creación, confirmación y cancelación de turnos (orquestador) |

## Stack

- Node.js 18 + Express
- PostgreSQL 15 + Sequelize ORM
- Autenticación JWT (bcrypt + jsonwebtoken)
- Docker + docker-compose

## Requisitos

- Docker y Docker Compose (recomendado)
- O bien Node.js 18+ y PostgreSQL local

## Cómo correrlo

### Con Docker (recomendado)

```bash
# Clonar y entrar
git clone git@github.com:eliasguisolfo11/Healify.git
cd Healify

# Levantar todo (3 DBs + 3 servicios)
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

### Sin Docker (desarrollo local)

Cada servicio necesita su propia base de datos PostgreSQL y un archivo `.env`.

```bash
# 1. Crear las 3 bases de datos en PostgreSQL
createdb doctors
createdb patients
createdb appointments

# 2. Configurar y arrancar doctor-service
cd services/doctor-service
cp .env.example .env   # editar DB_HOST, DB_USER, DB_PASSWORD
npm install
npm start

# 3. Configurar y arrancar patient-service (nueva terminal)
cd services/patient-service
cp .env.example .env
npm install
npm start

# 4. Configurar y arrancar appointment-service (nueva terminal)
cd services/appointment-service
cp .env.example .env
# Asegurarse de que DOCTOR_SERVICE_URL y PATIENT_SERVICE_URL apunten a localhost
npm install
npm start
```

## Cómo probar — flujo completo

```bash
# 1. Crear especialidad
curl -s -X POST http://localhost:4001/api/specialties \
  -H "Content-Type: application/json" \
  -d '{"name":"Cardiología","description":"Especialidad en cardiología"}'

# 2. Crear médico (reemplazar <specialty-id> con el UUID devuelto)
curl -s -X POST http://localhost:4001/api/doctors \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","lastName":"Pérez","email":"juan@test.com","specialtyId":"<specialty-id>"}'

# 3. Crear horario (reemplazar <doctor-id>)
curl -s -X POST http://localhost:4001/api/schedules \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"<doctor-id>","dayOfWeek":1,"startTime":"09:00","endTime":"17:00","slotDuration":30}'

# 4. Registrar paciente
curl -s -X POST http://localhost:4002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"123456","name":"Ana","lastName":"García"}'

# 5. Ver slots disponibles del médico
curl -s "http://localhost:4001/api/doctors/<doctor-id>/slots?date=2026-05-25"

# 6. Crear turno (reemplazar <patient-id> con el UUID del paso 4)
curl -s -X POST http://localhost:4003/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"doctorId":"<doctor-id>","patientId":"<patient-id>","date":"2026-05-25","time":"09:00"}'

# 7. Confirmar turno
curl -s -X PUT http://localhost:4003/api/appointments/<appointment-id>/confirm

# 8. Cancelar turno
curl -s -X PUT http://localhost:4003/api/appointments/<appointment-id>/cancel \
  -H "Content-Type: application/json" \
  -d '{"reason":"El paciente canceló"}'

# 9. Listar turnos por médico
curl -s "http://localhost:4003/api/appointments/doctor/<doctor-id>"

# 10. Listar turnos por paciente
curl -s "http://localhost:4003/api/appointments/patient/<patient-id>"
```

## API — resumen de endpoints

### doctor-service (`:4001`)

| Método | Ruta |
|--------|------|
| GET | `/api/doctors` |
| GET | `/api/doctors/:id` |
| POST | `/api/doctors` |
| PUT | `/api/doctors/:id` |
| DELETE | `/api/doctors/:id` |
| GET | `/api/doctors/:id/slots?date=YYYY-MM-DD` |
| GET | `/api/specialties` |
| POST | `/api/specialties` |
| GET | `/api/doctors/:id/schedules` |
| POST | `/api/schedules` |

### patient-service (`:4002`)

| Método | Ruta |
|--------|------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/patients` |
| GET | `/api/patients/:id` |
| PUT | `/api/patients/:id` |

### appointment-service (`:4003`)

| Método | Ruta |
|--------|------|
| GET | `/api/appointments` |
| GET | `/api/appointments/:id` |
| POST | `/api/appointments` |
| PUT | `/api/appointments/:id/cancel` |
| PUT | `/api/appointments/:id/confirm` |
| GET | `/api/appointments/patient/:patientId` |
| GET | `/api/appointments/doctor/:doctorId` |

## Detener servicios

```bash
docker-compose down -v   # -v elimina los volúmenes (datos de BD)
```

## Estructura del proyecto

```
healify-microservices/
├── services/
│   ├── doctor-service/       # Médicos, especialidades, horarios
│   ├── patient-service/      # Pacientes, autenticación
│   └── appointment-service/  # Turnos (orquestador)
├── docs/
├── docker-compose.yml
├── AGENTS.md
├── package.json
├── plan.md
└── README.md
```

Cada servicio sigue la misma arquitectura: `domain/entities/` → `services/` → `controllers/` → `routes/`, con `middleware/` y `validators/`.

El archivo `AGENTS.md` contiene instrucciones detalladas para asistentes de IA que trabajen sobre el proyecto.
