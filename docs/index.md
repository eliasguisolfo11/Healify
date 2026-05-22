# Healify — Roadmap de Desarrollo

> **Timeline Total:** ~15–20 días | **Esfuerzo Total:** ~110–130 horas  
> **Stack Final:** Node.js 18 + Express + PostgreSQL + Vue 3 + Pinia + TailwindCSS  
> **Roles:** Paciente, Doctor, Administrador

---

## Resumen de Fases

| Fase | Nombre | Duración | Esfuerzo | Estado |
|------|--------|----------|----------|--------|
| **0** | [Estabilización Backend](00-backend-stabilization.md) | 1–2 días | ~7.5 h | Pendiente |
| **1** | [Mejoras Backend](01-backend-enhancements.md) | 1–2 días | ~16 h | Pendiente |
| **2** | [Frontend MVP (Vue 3)](02-frontend-vue3.md) | 5–7 días | ~40–50 h | Pendiente |
| **3** | [Testing & CI/CD](03-testing-cicd.md) | 3–4 días | ~30–35 h | Pendiente |
| **4** | [Pulido & Deploy](04-polish-deploy.md) | 2–3 días | ~15–20 h | Pendiente |

**Total:** ~110–130 horas (~3 semanas para 1 dev, ~10 días para 2 devs)

---

## Estado Actual (Pre-Fase 0)

- **Backend:** ~30% production-ready. CRUD básico funciona pero el flujo principal de agendar turnos está roto.
- **Frontend:** No existe.
- **Testing:** No existe.
- **CI/CD:** No existe.
- **Documentación:** No existe.

[Ver análisis completo](../plan.md)

---

## Dependencias entre Fases

```
Fase 0 ────► Fase 1 ────► Fase 2 ────► Fase 3 ────► Fase 4
  (bugs)      (mejoras)    (frontend)    (testing)    (deploy)
```

- **Fase 0** debe completarse antes de cualquier otra (el sistema core no funciona).
- **Fase 1** es recomendada antes de Fase 2 (mejora la API que consume el frontend).
- **Fase 2** debe completarse antes de Fase 3 (los E2E tests necesitan frontend).
- **Fase 4** es la última (todo debe estar estable antes de deploy).

---

## Principios de Diseño

1. **Microservicios reales** — cada servicio es independiente, con su propia DB y ciclo de vida.
2. **API-first** — el frontend consume APIs REST bien definidas.
3. **Security by design** — autenticación JWT, autorización por rol, validación en capa de entrada.
4. **Testability** — cada capa debe ser testeable de forma aislada.
5. **Progressive enhancement** — primero funciona, luego se mejora.

---

## Documentos Relacionados

- [`AGENTS.md`](../AGENTS.md) — Guía para agentes OpenCode
- [`plan.md`](../plan.md) — Análisis y plan original de arquitectura
- [`docker-compose.yml`](../docker-compose.yml) — Orquestación Docker
