# FASE 2 — Frontend MVP (Vue 3)

> **Duración:** 5–7 días | **Esfuerzo:** ~40–50 horas | **Prioridad:** Alta  
> **Design Intelligence:** UI/UX Pro Max (161 paletas, 57 font pairings, 99 UX guidelines, 50+ styles)

## Objetivo

Crear interfaz web con Vue 3 que consume los 3 servicios backend. Soporta 3 roles: **Paciente**, **Doctor**, **Admin**.
Cada componente cubre **todos los estados**: loading, vacío, error, éxito, y edge cases.

---

## Stack Tecnológico

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| Vue 3 | 3.4+ | Composition API + `<script setup>` |
| Vite | 5+ | Bundler, HMR |
| Axios | 1.6+ | HTTP client con interceptors |
| Vue Router | 4+ | Route guards + lazy loading |
| Pinia | 2+ | State management |
| TailwindCSS | 3+ | Utility-first styling |
| Heroicons | 2+ | SVG icons (stroke-width consistente) |
| Vitest | 1+ | Unit tests |
| Playwright | latest | E2E tests |

---

## Design System

### Brand Colors (Healthcare)

```javascript
// tailwind.config.js — Semantic tokens
colors: {
  primary: {
    50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981',  // verde salud
    600: '#059669', 700: '#047857', 900: '#064e3b',
  },
  secondary: {
    50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6',  // azul confianza
    600: '#2563eb', 700: '#1d4ed8',
  },
  danger:   { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626' },
  warning:  { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706' },
  success:  { 50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a' },
  neutral:  { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb',
              300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280',
              600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
}
```

### Typography

- **Body:** Inter 16px, line-height 1.6, color neutral-800
- **Headings:** Inter 600–700, scale: 18/24/30/36/48px
- **Labels/UI:** Inter 14px, medium 500
- **Small/Help:** Inter 12px, color neutral-400
- **Line length:** 65–75 chars max (containers con `max-w-prose` o `max-w-2xl`)
- **Font loading:** `font-display: swap`, preload solo variantes críticas (400, 500, 600, 700)

### Spacing System (8px grid)

| Token | px | Uso |
|-------|----|-----|
| `space-1` | 4px | Icon gap |
| `space-2` | 8px | Inner padding compact |
| `space-3` | 12px | Button padding |
| `space-4` | 16px | Card padding, form gap |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Page section gap |
| `space-12` | 48px | Page padding |

### Shadows & Elevation

```javascript
// tailwind.config.js
boxShadow: {
  'card':   '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  'card-hover': '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
  'modal':  '0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.1)',
  'nav':    '0 1px 3px rgba(0,0,0,0.05)',
}
```

### Dark Mode

- Estrategia: `class`-based dark mode con `prefers-color-scheme` como default
- Paleta dark: neutral-900 surface, neutral-800 card, neutral-100 text
- Contrastes testeados independientemente (no inferir desde light mode)
- Bordes/separadores visibles en ambos temas

### Icons

- **Heroicons** (outline para navegación, solid para acciones)
- Stroke-width consistente (1.5px outline)
- Tamaños: 16px (inline), 20px (icon button), 24px (nav), 32px (hero)
- Touch targets: mínimo 44×44px (con `hitSlop`/padding extra si el icono es menor)
- Contraste 4.5:1 mínimo para iconos pequeños, 3:1 para grandes

---

## Estructura de Carpetas

```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js          # Design tokens: colores, shadows, spacing
├── package.json
├── public/
│   ├── favicon.ico
│   └── images/
│       ├── empty-state.svg
│       ├── error-state.svg
│       └── logo.svg
└── src/
    ├── main.js
    ├── App.vue
    ├── assets/
    │   └── styles/
    │       ├── main.css         # Tailwind directives + base
    │       └── transitions.css  # Transiciones Vue <Transition>
    ├── api/
    │   ├── client.js            # Axios + interceptors (token, 401, error)
    │   ├── auth.js
    │   ├── doctors.js
    │   ├── appointments.js
    │   └── patients.js
    ├── stores/
    │   ├── auth.js              # user, token, role, login/logout/register
    │   ├── doctors.js           # list, specialties, current doctor
    │   └── appointments.js      # list, create, cancel, confirm
    ├── composables/
    │   ├── useAsyncData.js      # Loading/error/data pattern genérico
    │   └── useFormValidation.js # Validación reactiva
    ├── router/
    │   └── index.js             # Routes + guards + scrollBehavior
    ├── layouts/
    │   ├── AuthLayout.vue       # Centered card, logo
    │   ├── PatientLayout.vue    # Top nav + sidebar mobile
    │   ├── DoctorLayout.vue     # Top nav + sidebar mobile
    │   └── AdminLayout.vue      # Top nav + sidebar
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
        │   ├── SkeletonLoader.vue    # Shimmer placeholder
        │   ├── EmptyState.vue        # Icono + mensaje + CTA
        │   ├── ErrorMessage.vue      # Error + retry button
        │   ├── ToastNotification.vue # Auto-dismiss 4s
        │   ├── ConfirmDialog.vue     # Modal de confirmación
        │   ├── Pagination.vue
        │   ├── StatusBadge.vue       # pending/confirmed/cancelled
        │   └── ThemeToggle.vue       # Light/dark switcher
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

## Componentes Esenciales — Especificaciones

### `SkeletonLoader.vue`

**Propósito:** Placeholder shimmer mientras carga data.

- Shape variants: `text` (barra), `card` (rectángulo con bordes redondeados), `avatar` (círculo), `table-row`
- Animación: shimmer gradient con Tailwind `animate-pulse`
- Mapa 1:1 con el layout real (mismas dimensiones que el contenido final)
- No usar spinners genéricos para contenido >300ms

```vue
<template>
  <div class="animate-pulse space-y-4 p-4">
    <div class="h-4 bg-neutral-200 rounded w-3/4" />
    <div class="h-4 bg-neutral-200 rounded w-1/2" />
    <div class="h-32 bg-neutral-200 rounded" />
  </div>
</template>
```

### `EmptyState.vue`

**Propósito:** Estado vacío cuando no hay datos.

```
┌─────────────────────────────────┐
│          📋 (SVG icon)          │
│    No hay turnos agendados      │
│  Agenda tu primer turno médico  │
│     [ Buscar Especialistas ]    │  ← CTA primary
└─────────────────────────────────┘
```

- Props: `icon` (Heroicon name), `title`, `description`, `actionLabel`, `actionLink`
- Icono SVG (no emoji) de Heroicons, 64×64px, color neutral-300
- CTA button solo si hay acción disponible
- Responsive: padding 16px/24px, texto centrado

### `ErrorMessage.vue`

**Propósito:** Mostrar errores recuperables.

```
┌─ ⚠️ ───────────────────────────┐
│  No pudimos cargar los turnos  │
│  Verificá tu conexión e        │
│  intentá de nuevo.             │
│         [ Reintentar ]         │
└────────────────────────────────┘
```

- Props: `message`, `onRetry` (callback), `retryLabel` (default "Reintentar")
- Icono Heroicons `exclamation-triangle` 20px, color danger-500
- Sin CTA si no hay `onRetry` (error no recuperable)
- El mensaje debe explicar **qué pasó** + **qué hacer** (no "Error 500")

### `ToastNotification.vue`

**Propósito:** Feedback transitorio de acciones.

- Variants: `success` (verde, check), `error` (rojo, x), `warning` (amarillo), `info` (azul)
- Posición: top-right en desktop, top-center en mobile
- Auto-dismiss en 4s (3s para success, 5s para error)
- Botón de cerrar manual (X icon, 20px)
- No roba foco: `aria-live="polite"`
- Animación: slide-in right 200ms ease-out, fade-out 200ms

### `ConfirmDialog.vue`

**Propósito:** Confirmar acciones destructivas (cancelar turno, eliminar doctor).

```vue
<ConfirmDialog
  :show="showCancelModal"
  title="Cancelar turno"
  message="¿Estás seguro de cancelar el turno con el Dr. Pérez el 25/05 a las 09:00?"
  confirm-label="Sí, cancelar turno"
  cancel-label="Volver"
  variant="danger"
  @confirm="handleCancel"
  @close="showCancelModal = false"
/>
```

- Props: `show`, `title`, `message`, `confirmLabel`, `cancelLabel`, `variant` (`danger`|`warning`|`info`)
- CTA danger con color danger-600, botón cancelar neutral
- Esc key cierra, click fuera del modal cierra (scrim opacity 50%)
- Foco atrapado dentro del modal
- No cierra si hay cambios sin guardar (en formularios)

### `StatusBadge.vue`

**Propósito:** Mostrar estado del turno visualmente.

| Estado | Color | Icono |
|--------|-------|-------|
| `pending` | warning (amarillo) | `clock` |
| `confirmed` | success (verde) | `check-circle` |
| `cancelled` | danger (rojo) | `x-circle` |
| `completed` | primary (azul) | `check-badge` |

- Uso: `background` tint 100 + text 600 + dot/icon
- No usar solo color para significado — incluir texto + icono
- Touch target mínimo si es clickeable

### `Pagination.vue`

**Propósito:** Navegar páginas de resultados.

```
◀ 1  2  3  ...  12  ▶
```

- Props: `currentPage`, `totalPages`, `totalItems`, `@page-change`
- Mostrar: prev, next, primeras 3, últimas 3, elipsis, página actual centrada
- Botones disabled en extremos (opacidad 50%, no pointer-events)
- Touch targets ≥44px
- En mobile: solo prev/next + "Página X de Y"

---

## Manejo de Estados (Cada Vista/Componente)

Toda vista que carga datos debe manejar estos 4 estados:

```
┌──────────────┐
│   LOADING    │  → SkeletonLoader (o spinner si <500ms)
├──────────────┤
│    DATA      │  → Renderizado normal
├──────────────┤
│   EMPTY      │  → EmptyState con CTA relevante
├──────────────┤
│   ERROR      │  → ErrorMessage con retry
└──────────────┘
```

### Composable `useAsyncData`

```javascript
// composables/useAsyncData.js
import { ref } from 'vue'

export function useAsyncData(fetchFn) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function load(...args) {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchFn(...args)
    } catch (e) {
      error.value = e.response?.data?.error || e.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, load }
}
```

### Patrón en cada vista

```vue
<script setup>
const { data: appointments, loading, error, load } = useAsyncData(api.getAppointments)
await load()

function handleRetry() { load() }
</script>

<template>
  <SkeletonLoader v-if="loading && !appointments" type="table" />
  <ErrorMessage v-else-if="error" :message="error" @retry="handleRetry" />
  <EmptyState v-else-if="appointments?.length === 0"
    title="No hay turnos" description="..." action-label="Agendar" action-link="/booking" />
  <div v-else>
    <!-- contenido real -->
  </div>
</template>
```

---

## Formularios — Patrón UX

### Reglas generales

- **Labels visibles** siempre (no placeholder como label — violación WCAG)
- **Helper text** persistente debajo del input (e.g., "Mínimo 6 caracteres")
- **Inline validation** on blur (no en cada keystroke)
- **Error** debajo del campo correspondiente, no solo en summary
- **Submit button** muestra loading spinner y se desactiva durante async
- **Success feedback** con toast (no redirigir abruptamente)

### Input types semánticos

```html
<input type="email"  autocomplete="email" />
<input type="tel"    autocomplete="tel" />
<input type="password" autocomplete="new-password" />
<input type="date" />
```

- Mobile keyboard correcto gracias a `type` semántico
- `autocomplete` para autofill del browser

### Password toggle

```vue
<div class="relative">
  <input :type="showPassword ? 'text' : 'password'" />
  <button @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2">
    <EyeIcon v-if="!showPassword" class="w-5 h-5" />
    <EyeOffIcon v-else class="w-5 h-5" />
  </button>
</div>
```

### Formulario multi-step (opcional para booking complejo)

- Step indicator: números con estado (completed/current/pending)
- Back navigation permitido
- No perder datos al volver atrás
- Confirm antes de cerrar con cambios sin guardar

---

## Navegación — Patrones

### Mobile (<768px)

- Bottom Tab Bar con max 5 items: icono + label
- Items: Inicio, Buscar, Turnos, Perfil
- Badge en Turnos si hay pendientes
- Drawer lateral para opciones secundarias (configuración, ayuda)

### Desktop (≥768px)

- Sidebar izquierdo (collapsible) con iconos + texto
- Top bar con logo, búsqueda (opcional), avatar + dropdown
- Breadcrumbs en páginas con 3+ niveles de profundidad

### Estados de navegación

- Active state: color primary-600 + font-semibold + left border indicator
- Hover state: bg-neutral-100
- Transiciones suaves entre rutas: `<Transition name="page-slide">`

---

## Animaciones

| Elemento | Duración | Easing | Propiedad |
|----------|----------|--------|-----------|
| Page transition | 200ms | ease-out | `opacity`, `transform: translateY(8px)` |
| Modal enter/exit | 200ms / 150ms | ease-out / ease-in | `opacity`, `transform: scale(0.95)` |
| Toast enter | 200ms | ease-out | `transform: translateX(100%) → 0` |
| Button hover | 100ms | ease | `background-color` |
| Card hover | 150ms | ease-out | `box-shadow`, `transform: translateY(-2px)` |
| List stagger | 30ms delay per item | ease-out | `opacity` |

- Respetar `prefers-reduced-motion`: desactivar animaciones automáticamente
- Usar `transform` y `opacity` solamente (no animar `width`/`height`/`top`/`left`)

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
1. User ingresa email + password
2. POST /api/auth/login → retorna JWT token + patient data
3. Token + user persistidos en localStorage (encrypted)
4. Pinia store: user, token, role
5. Axios interceptor: añade Authorization: Bearer <token>
6. Router guard: verifica isAuthenticated + role
7. 401 response → logout automático + redirect a /login
8. Logout: limpia store + localStorage + redirect
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
    async login(email, password) {
      const res = await api.post('/api/auth/login', { email, password })
      this.token = res.token
      this.user = { ...res.patient, role: 'patient' }
      this.role = 'patient'
      localStorage.setItem('auth', JSON.stringify({ token: this.token, user: this.user }))
    },
    async register(data) { /* similar */ },
    logout() {
      this.$reset()
      localStorage.removeItem('auth')
    },
    loadFromStorage() {
      const saved = localStorage.getItem('auth')
      if (saved) {
        const { token, user } = JSON.parse(saved)
        this.token = token
        this.user = user
        this.role = user?.role
      }
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
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore().logout()
      window.location.href = '/login'
    }
    // Normalizar error para el consumidor
    const message = error.response?.data?.error
      || error.response?.data?.errors?.[0]?.msg
      || 'Error de conexión. Intentá de nuevo.'
    return Promise.reject(new Error(message))
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

// Scroll restoration por ruta
router.scrollBehavior = (to) => {
  if (to.hash) return { el: to.hash, behavior: 'smooth' }
  return { top: 0 }
}
```

---

## UI/UX Mockups

### Flujo Paciente

```
Login/Register
  → Especialidades (grid de cards con icono + nombre)
    → Doctores de esa especialidad (cards con foto, nombre, email)
      → Detalle Doctor + Calendario (date picker)
        → Slots disponibles (botones horarios, verde=available)
          → Confirmar turno (modal resumen: doctor, fecha, hora)
            → Success toast "Turno agendado exitosamente"
              → Mis Turnos (lista con StatusBadge + acciones)
```

### Flujo Doctor

```
Login
  → Dashboard (turnos de HOY, resumen semanal, próximos)
    → Agenda Semanal (grid día/hora con turnos solapados)
    → Turnos Asignados (tabla con filtros: fecha, estado)
      → Confirmar turno (botón en fila, ConfirmDialog)
      → Completar turno
```

### Flujo Admin

```
Login Admin
  → Dashboard (cards: doctores activos, turnos hoy, ocupación %)
    → Gestión Doctores (tabla CRUD con modal de edición)
    → Gestión Especialidades (tabla CRUD simple)
    → Todos los Turnos (tabla con filtros: doctor, fecha, estado)
```

---

## Especificaciones de Vistas Clave

### `BookingView.vue`

**Estados:**
- **Loading:** SkeletonLoader con forma de calendario + lista de slots
- **Data:** Date picker nativo (`<input type="date">`), slots como grid de botones 3-4 columnas
- **Slots no disponibles:** Botón gris, disabled, con tooltip "Ocupado"
- **Slots disponibles:** Botón primary outline, al seleccionar → primary solid
- **Seleccionado:** Muestra resumen arriba del botón "Confirmar turno"
- **Submit:** Botón con spinner, se desactiva, toast success, redirect a /appointments
- **Error:** ErrorMessage con retry, no perder selección de slot
- **Conflicto (409):** Toast "El turno ya fue reservado. Elegí otro horario."

**Validaciones:**
- Fecha no puede ser pasado (min = hoy)
- Fecha solo días laborales del doctor (según schedule)
- Time requerido después de seleccionar fecha
- ConfirmDialog antes de enviar

### `MyAppointmentsView.vue`

**Estados:**
- **Loading:** SkeletonLoader tabla (3 filas)
- **Empty:** EmptyState + "Agendá tu primer turno" CTA
- **Error:** ErrorMessage + retry
- **Data:** Tabla responsive (card en mobile, filas en desktop)

**Cada turno muestra:**
- Doctor name + specialty
- Fecha + hora
- StatusBadge (pending/confirmed/cancelled)
- Botón "Cancelar" si está pending/confirmed (con ConfirmDialog)
- Botón "Ver detalle" (opcional)

**Filtros (opcional MVP):**
- Tabs: Todos | Pendientes | Confirmados | Cancelados
- Orden: Más recientes primero (por defecto)

### `DashboardView.vue` (Admin)

**Cards de stats:**
- Doctores activos (total)
- Turnos hoy
- Tasa de ocupación (confirmed / total * 100)
- Turnos cancelados (últimos 7 días)

**Cada card:**
- Icono Heroicons, color semántico
- Número grande (font-bold 2xl)
- Label descriptivo
- SkeletonLoader mientras carga

---

## Accesibilidad (CRITICAL)

- [ ] Contraste color texto/fondo ≥ 4.5:1 (AA)
- [ ] Focus rings visibles en todos los interactive elements (2px, primary-500)
- [ ] Alt text descriptivo en imágenes significativas
- [ ] `aria-label` en icon-only buttons
- [ ] Form labels con `<label for="id">` o `aria-labelledby`
- [ ] Skip link "Saltar al contenido" al inicio de cada página
- [ ] Heading hierarchy secuencial (h1 → h2 → h3, sin saltos)
- [ ] No informar solo con color — siempre incluir icono + texto
- [ ] Respetar `prefers-reduced-motion` (desactivar animaciones)
- [ ] Keyboard nav: Tab order = visual order, Enter/Space activan botones
- [ ] Touch targets ≥ 44×44px (mínimo, ideal 48×48)
- [ ] Spacing entre touch targets ≥ 8px

---

## Responsive Breakpoints

| Breakpoint | Target | Layout |
|------------|--------|--------|
| 375px | iPhone SE | Single column, bottom nav |
| 768px | iPad | 2 column, sidebar |
| 1024px | Desktop small | Sidebar + content |
| 1440px | Desktop wide | Max-width container 1280px |

- Mobile-first: diseñar para 375px primero, luego escalar
- No scroll horizontal en ningún breakpoint
- Min body font 16px en mobile (evita iOS auto-zoom)
- Safe areas: padding para notch y gesture bar en mobile

---

## Criterios de Aceptación

### Paciente
- [ ] Registro funciona (valida email, password ≥6)
- [ ] Login funciona (retorna token, redirige)
- [ ] Ver especialidades y doctores (loading → data)
- [ ] Ver slots disponibles (date picker + horarios)
- [ ] Agendar turno (confirm dialog → success toast → redirect)
- [ ] Ver mis turnos con estado y StatusBadge
- [ ] Cancelar turno con motivo (confirm dialog)
- [ ] Editar perfil (form validation, success toast)
- [ ] Estados: loading, empty, error OK en cada vista

### Doctor
- [ ] Login funciona
- [ ] Ver horario semanal
- [ ] Ver turnos asignados con filtros
- [ ] Confirmar turno
- [ ] Estados: loading, empty, error OK

### Admin
- [ ] Crear doctor con validación
- [ ] Crear especialidad
- [ ] Editar/eliminar doctores
- [ ] Dashboard con stats básicos
- [ ] Ver todos los turnos con filtros
- [ ] Estados: loading, empty, error OK

### Técnico
- [ ] Token se persiste en localStorage y se recupera al refrescar
- [ ] Interceptor añade Bearer token automáticamente
- [ ] 401 response → logout + redirect
- [ ] Route guards: no auth → login, wrong role → home
- [ ] Errores del server se muestran legibles (no "Error 500")
- [ ] Mobile responsive (375px, 768px, 1024px testeados)
- [ ] Loading states en todas las vistas
- [ ] Dark mode toggle funcional
- [ ] Touch targets ≥ 44px
- [ ] Sin scroll horizontal

### Design System
- [ ] Colores semánticos (primary, secondary, danger, warning, success)
- [ ] Tipografía consistente (Inter, scale 14/16/18/24/30/36)
- [ ] Spacing 8px grid (space-2/4/6/8/12)
- [ ] Sombras consistentes (card, modal, nav)
- [ ] Iconos Heroicons, stroke-width consistente
- [ ] Dark mode con contrastes testeados

---

## Dependencias

- Fase 0 completada (backend funcional sin bugs críticos)
- Fase 1 completada (opcional para vistas de admin, recomendada)
- UI/UX Pro Max skill instalado para diseño system
