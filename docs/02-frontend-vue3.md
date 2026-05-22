# FASE 2 — Frontend MVP (Vue 3)

> **Duración:** 5–7 días | **Esfuerzo:** ~40–50 horas | **Prioridad:** Alta

## Objetivo

Crear interfaz web con Vue 3 que consume los 3 servicios backend. Soporta 3 roles: Paciente, Doctor, Admin.

---

## Stack Tecnológico

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| Vue 3 | 3.4+ | Framework (Composition API) |
| Vite | 5+ | Bundler |
| Axios | 1.6+ | HTTP client |
| Vue Router | 4+ | Routing |
| Pinia | 2+ | State management |
| TailwindCSS | 3+ | Styling utilitario |
| Vitest | 1+ | Testing unitario |

---

## Estructura de Carpetas

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── public/
│   └── favicon.ico
└── src/
    ├── main.js                        # Entry point
    ├── App.vue                        # Root component
    ├── api/
    │   ├── client.js                  # Axios instance con interceptors
    │   ├── auth.js                    # Auth API calls
    │   ├── doctors.js                 # Doctor/specialty calls
    │   ├── appointments.js            # Appointment calls
    │   └── patients.js                # Patient profile calls
    ├── stores/
    │   ├── auth.js                    # Auth store (Pinia)
    │   ├── doctors.js                 # Doctor/specialty store
    │   └── appointments.js            # Appointment store
    ├── router/
    │   └── index.js                   # Routes + guards
    ├── layouts/
    │   ├── AuthLayout.vue             # Login/register layout
    │   ├── PatientLayout.vue          # Patient dashboard layout
    │   ├── DoctorLayout.vue           # Doctor dashboard layout
    │   └── AdminLayout.vue            # Admin dashboard layout
    ├── views/
    │   ├── auth/
    │   │   ├── LoginView.vue
    │   │   └── RegisterView.vue
    │   ├── patient/
    │   │   ├── SpecialtiesView.vue
    │   │   ├── DoctorsView.vue
    │   │   ├── BookingView.vue
    │   │   ├── MyAppointmentsView.vue
    │   │   └── ProfileView.vue
    │   ├── doctor/
    │   │   ├── DashboardView.vue
    │   │   ├── AppointmentsView.vue
    │   │   ├── ScheduleView.vue
    │   │   └── ProfileView.vue
    │   └── admin/
    │       ├── DashboardView.vue
    │       ├── DoctorsManageView.vue
    │       ├── SpecialtiesManageView.vue
    │       └── AppointmentsView.vue
    └── components/
        ├── common/
        │   ├── AppHeader.vue
        │   ├── AppFooter.vue
        │   ├── Sidebar.vue
        │   ├── LoadingSpinner.vue
        │   ├── ErrorMessage.vue
        │   ├── ToastNotification.vue
        │   └── Pagination.vue
        ├── auth/
        │   ├── LoginForm.vue
        │   └── RegisterForm.vue
        ├── patient/
        │   ├── SpecialtyCard.vue
        │   ├── DoctorCard.vue
        │   ├── SlotPicker.vue
        │   └── AppointmentCard.vue
        ├── doctor/
        │   ├── AppointmentTable.vue
        │   └── WeekSchedule.vue
        └── admin/
            ├── DoctorForm.vue
            ├── DoctorTable.vue
            ├── SpecialtyForm.vue
            └── AppointmentFilters.vue
```

---

## Funcionalidad por Rol

### Paciente

| Funcionalidad | Endpoint | Método | Vista |
|---------------|----------|--------|-------|
| Registrarse | `/api/auth/register` | POST | `RegisterView` |
| Iniciar sesión | `/api/auth/login` | POST | `LoginView` |
| Ver especialidades | `/api/specialties` | GET | `SpecialtiesView` |
| Ver doctores por especialidad | `/api/doctors?specialtyId=` | GET | `DoctorsView` |
| Ver slots disponibles | `/api/schedules/:id/slots?date=` | GET | `BookingView` |
| Agendar turno | `/api/appointments` | POST | `BookingView` |
| Ver mis turnos | `/api/appointments/patient/:id` | GET | `MyAppointmentsView` |
| Cancelar turno | `/api/appointments/:id/cancel` | PUT | `MyAppointmentsView` |
| Editar perfil | `/api/patients/:id` | PUT | `ProfileView` |

### Doctor

| Funcionalidad | Endpoint | Método | Vista |
|---------------|----------|--------|-------|
| Iniciar sesión | `/api/auth/login` | POST | `LoginView` |
| Ver mi horario | `/api/schedules/:doctorId` | GET | `ScheduleView` |
| Editar horario | `/api/schedules` | POST | `ScheduleView` |
| Ver turnos asignados | `/api/appointments/doctor/:id` | GET | `AppointmentsView` |
| Confirmar turno | `/api/appointments/:id/confirm` | PUT | `AppointmentsView` |
| Ver perfil | `/api/doctors/:id` | GET | `ProfileView` |

### Admin

| Funcionalidad | Endpoint | Método | Vista |
|---------------|----------|--------|-------|
| Crear doctor | `/api/doctors` | POST | `DoctorsManageView` |
| Listar doctores | `/api/doctors` | GET | `DoctorsManageView` |
| Editar doctor | `/api/doctors/:id` | PUT | `DoctorsManageView` |
| Eliminar doctor | `/api/doctors/:id` | DELETE | `DoctorsManageView` |
| Crear especialidad | `/api/specialties` | POST | `SpecialtiesManageView` |
| Ver todos los turnos | `/api/appointments` | GET | `AppointmentsView` |
| Dashboard stats | múltiples GETs | GET | `DashboardView` |

---

## Flujo de Autenticación

```
1. User ingresa email + password + role
2. POST /api/auth/login → retorna JWT token
3. Token guardado en localStorage
4. Pinia store: user data + token
5. Axios interceptor: añade Authorization: Bearer <token>
6. Router guard: verifica isAuthenticated + role
7. Logout: limpia store + localStorage + redirect a /login
```

### Pinia Auth Store

```javascript
// stores/auth.js
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,       // { id, email, name, role }
    token: null,
    role: null,
  }),
  actions: {
    async login(email, password, role) { ... },
    async register(data) { ... },
    logout() {
      this.user = null
      this.token = null
      this.role = null
      localStorage.removeItem('token')
    },
    loadFromStorage() {
      const saved = localStorage.getItem('auth')
      if (saved) Object.assign(this, JSON.parse(saved))
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.role,
  },
})
```

### Axios Client con Interceptor

```javascript
// api/client.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost',
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Router Guards

```javascript
// router/index.js
const routes = [
  {
    path: '/login',
    component: LoginView,
    meta: { guest: true },
  },
  {
    path: '/appointments',
    component: MyAppointmentsView,
    meta: { requiresAuth: true, role: 'patient' },
  },
  {
    path: '/admin/doctors',
    component: DoctorsManageView,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/doctor/appointments',
    component: DoctorAppointmentsView,
    meta: { requiresAuth: true, role: 'doctor' },
  },
]

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/login')
  if (to.meta.role && auth.userRole !== to.meta.role) return next('/')
  if (to.meta.guest && auth.isAuthenticated) return next('/')
  next()
})
```

---

## UI/UX Mockups

### Flujo Paciente

```
Home → Login/Register
  → Especialidades (lista de cards)
    → Doctores de esa especialidad (grid de cards)
      → Detalle Doctor + Calendario + Slots disponibles
        → Confirmar turno (modal)
          → Mis Turnos (lista con estado)
            → Cancelar (confirm dialog)
```

### Flujo Doctor

```
Home → Login
  → Dashboard (turnos de hoy)
    → Agenda Semanal (grid día/hora)
      → Editar horario (modal drag & drop)
    → Turnos Asignados (tabla filtrable)
      → Confirmar turno (botón)
```

### Flujo Admin

```
Home → Login Admin
  → Dashboard (stats: doctores activos, turnos hoy, ocupación)
    → Gestión Doctores (tabla CRUD + modal)
    → Gestión Especialidades (tabla CRUD + modal)
    → Todos los Turnos (tabla con filtros: doctor, fecha, estado)
```

---

## Criterios de Aceptación

### Paciente
- [ ] Registro funciona (valida email, password ≥6)
- [ ] Login funciona (retorna token)
- [ ] Ver especialidades y doctores desde la API
- [ ] Ver slots disponibles (selector de fecha y hora)
- [ ] Agendar turno exitosamente
- [ ] Ver mis turnos con estado
- [ ] Cancelar turno con motivo
- [ ] Editar perfil

### Doctor
- [ ] Login funciona
- [ ] Ver horario semanal
- [ ] Ver turnos asignados
- [ ] Confirmar turno
- [ ] Completar turno

### Admin
- [ ] Crear doctor
- [ ] Crear especialidad
- [ ] Editar/eliminar doctores
- [ ] Dashboard con stats básicos
- [ ] Ver todos los turnos con filtros

### Técnico
- [ ] Token se persiste en localStorage
- [ ] Interceptor añade Bearer token automáticamente
- [ ] Logout limpia todo
- [ ] Route guards funcionan (redirección si no auth)
- [ ] Errores del server se muestran al usuario
- [ ] Mobile responsive (TailwindCSS)
- [ ] Loading states mientras se cargan datos

---

## Dependencias

- Fase 0 completada (backend funcional sin bugs críticos)
- Fase 1 completada (opcional para vistas de admin, recomendada)
