# El MVP en producción: de la brecha funcional al switch

**Fecha:** 2026-06-20 / 2026-08-04
**Iteración:** Cierre del MVP — backend de contacto, arquitectura de contenido, SEO
técnico, infraestructura multi-stage, CI/CD por ambientes y el switch de producción
(PRs #15 a #29)
**Rol de Oliver Castelblanco:** Solutions Architect — definición del objetivo,
autorización explícita de cada operación irreversible sobre infraestructura en vivo,
decisiones de arquitectura entre alternativas presentadas, revisión y aprobación de PRs.
**Rol de los agentes IA:** auditoría del estado real de la infraestructura, descomposición
del objetivo en secuencia ejecutable, implementación, verificación en AWS real, diagnóstico
del incidente de producción.

---

## 1. Resumen ejecutivo

Esta iteración cierra el ciclo del MVP: `https://ocastelblanco.com` dejó de servir el sitio
anterior y pasó a servir el rediseño 2026 completo.

El trabajo se dio en dos bloques con ritmos muy distintos:

- **Junio–julio (PRs #15 a #20)**: se cerró el último gap funcional visible (el endpoint
  del formulario de contacto), se agregó SEO técnico (JSON-LD, meta tags, sitemap) y se
  separó el contenido de la interfaz — casos de estudio como JSON tipado en el repo, The
  Lab alimentado desde Google Sheets vía API (ADR-011).

- **4 de agosto (PRs #21 a #29)**: una sola sesión de trabajo continuo que llevó el sitio
  a producción. Empezó con una auditoría del estado real en AWS que encontró **tres bugs
  latentes que la documentación del proyecto no reflejaba**, reordenó el plan en
  consecuencia, y ejecutó una secuencia de 8 pasos hasta el switch.

La lección transversal de esta iteración: **la documentación de un proyecto describe lo que
se decidió, no necesariamente lo que quedó desplegado.** Auditar la realidad antes de actuar
sobre ella evitó al menos tres incidentes de producción — y el único incidente que sí
ocurrió fue en el punto exacto donde la verificación previa se quedó corta.

---

## 2. El punto de partida: una auditoría incómoda

El objetivo del día se definió en una frase: reemplazar el sitio en vivo por el rediseño,
montando todo lo posible antes del corte de DNS para que el switch fuera rápido y
reversible.

El plan que existía en `TODO.md` para lograrlo era una sola tarea monolítica ("Deploy de
producción"). Antes de ejecutarla, se auditó el estado real de la cuenta AWS y del código
contra lo que la documentación afirmaba. Aparecieron cuatro hallazgos:

### 2.1 El dominio de la API estaba fijo para todos los ambientes

`serverless.yml` declaraba `domainName: api.ocastelblanco.com` sin distinguir stage — y ese
dominio lo tenía tomado el stage `preview`. Desplegar `production` habría hecho que ambos
stages se pelearan el mismo dominio en API Gateway. **Prerequisito bloqueante**: nada del
switch podía empezar antes de resolverlo.

### 2.2 `environment.prod.ts` era código muerto

`angular.json` no tenía `fileReplacements`. Consecuencia: **todos** los builds, incluido el
de producción, resolvían `@env/environment` al archivo de desarrollo. En producción, The Lab
habría leído el fixture de dev (`content/lab.dev.json`) en vez del contenido real.

Este bug llevaba semanas latente sin manifestarse, porque el sitio nunca había estado en
producción. `MEMORY.md` §6 y el `README.md` documentaban el comportamiento *intencionado*
(dos archivos de entorno, uno por ambiente), que nunca existió. Se habría manifestado
justo después del switch, como contenido incorrecto en una sección pública.

### 2.3 El formulario de contacto nunca entregó un mensaje

`contact-handler.mjs` validaba el payload, ejecutaba el honeypot anti-spam y escribía un
`console.log` a CloudWatch. Nada más. No había integración de correo: cada mensaje enviado
desde el sitio se perdía silenciosamente después de responder `200 {"ok": true}` al
visitante.

El endpoint estaba documentado como completo desde el PR #15. Y lo estaba, en el sentido
de que validaba correctamente — pero la entrega nunca se implementó.

### 2.4 Un alias de CloudFront solo puede vivir en una distribución

Los cuatro hostnames del sitio (`ocastelblanco.com`, `www.`, `olivercastelblanco.com`,
`www.`) eran alias de una única distribución CloudFront que servía el sitio anterior desde
un bucket S3. Un alias (CNAME) de CloudFront no puede existir en dos distribuciones
simultáneamente, a nivel global.

Esto **invalidó la estrategia obvia**: no se podía pre-construir una distribución nueva con
esos alias y probarla contra el dominio real antes del corte. Cualquier plan de
"distribución nueva" implicaba quitar los alias de la vieja y agregarlos a la nueva, con
una ventana en la que ningún hostname respondería.

---

## 3. La secuencia de 8 pasos

La tarea monolítica se descompuso en una secuencia ordenada por dependencias reales, donde
cada paso quedaba verificado en AWS antes de pasar al siguiente:

| # | Paso | Por qué en esa posición |
|---|---|---|
| 1 | Base multi-stage (dominio de API por stage, buckets, `fileReplacements`, CORS por stage) | Prerequisito bloqueante de todo lo demás |
| 2 | Terminal de contacto funcional (SES + rate limiting) | Gap OWASP A07 que bloqueaba producción |
| 3 | The Lab → S3 real | El bucket recién existía tras el paso 1 |
| 4 | CloudFront sirve `/content/*` | Necesitaba contenido real que servir |
| 5 | CloudFront Function de 301 | Independiente, consolida SEO antes del switch |
| 6 | Nuevo flujo CI/CD (PR → preview, merge → production) | Debe existir antes de que `main` exista |
| 7 | Renombrar `master` → `main` | Activa el job de producción por primera vez |
| 8 | **EL SWITCH** | Todo lo demás debía estar verificado |

El principio de ordenamiento: **cada paso debía dejar el sitio en vivo funcionando
exactamente igual que antes**, hasta el paso 8. Eso permitió avanzar 7 pasos sobre
infraestructura de producción sin riesgo para el sitio con tráfico real.

---

## 4. Decisiones de arquitectura

### ADR-012 — Reusar la distribución CloudFront existente

Dada la restricción de alias (§2.4), se decidió **no crear una distribución nueva** sino
cambiarle el origen a la existente. El switch se convirtió así en una operación atómica: un
solo `update-distribution`, sin tocar Route 53, sin propagación de DNS que esperar, y con
un rollback que es literalmente restaurar el origen anterior.

La misma ADR decidió una topología de **una distribución con dos orígenes** en vez del
subdominio `cdn.ocastelblanco.com` que planteaba ADR-011: `/content/*` y los assets
estáticos van al bucket S3, el resto va al Lambda SSR. El beneficio secundario resultó
relevante: el fetch de `lab.json` queda *same-origin*, lo que elimina el preflight CORS, un
segundo certificado y un registro DNS.

**Costo aceptado:** la distribución queda gestionada manualmente (CLI/consola), no por
`serverless.yml` — CloudFormation no adopta recursos preexistentes sin un import explícito.
Cada cambio sobre ella queda registrado en la ADR.

### ADR-013 — Flujo CI/CD por ambientes

Se formalizó el ciclo que el arquitecto quería para todo cambio futuro:

```
feature branch → abrir PR → deploy automático a `preview`
                                    ↓
                    revisión humana en la URL de preview
                                    ↓
                    aprobar y fusionar el PR a `main`
                                    ↓
                      deploy automático a `production`
```

La aprobación humana del PR es la única puerta a producción. Serverless Framework ya aísla
recursos por stage, así que no hizo falta infraestructura adicional — solo volver
*stage-aware* lo que estaba hardcodeado.

Una consecuencia contraintuitiva: `preview` pasó a ser un **ambiente permanente**. El plan
anterior mandaba eliminar la allowlist de CORS que permite la Lambda Function URL de preview
"al entrar a producción". Con este flujo, esa instrucción quedó anulada — preview necesita
seguir funcionando indefinidamente.

### ADR-014 — Entrega del formulario vía Amazon SES

La cuenta ya tenía el dominio `ocastelblanco.com` verificado en SES con DKIM configurado en
Route 53. El detalle que desbloqueó la implementación sin trámites: **el sandbox de SES
restringe destinatarios, no remitentes.** Enviar notificaciones a un buzón ya verificado
funciona sin pedir production access. Lo que no funciona en sandbox es la auto-respuesta al
visitante (destinatario arbitrario), que quedó como pendiente explícito.

---

## 5. El switch: ejecución e incidente

### 5.1 La preparación que evitó romper el sitio

El plan original del paso 4 pedía agregar behaviors de CloudFront para assets estáticos
(`*.js`, `*.css`) apuntando al bucket nuevo. Antes de aplicarlo, se inspeccionó el HTML del
sitio en vivo con `curl`:

```
href="styles.44e19bcec9581e94.css"
src="main.6ed785dce3960283.js"
```

El sitio anterior servía sus assets **en la raíz, con el mismo esquema de nombres con hash
que usa Angular**. Un behavior `*.js` apuntando al bucket nuevo habría interceptado esos
requests y roto el sitio en vivo de inmediato.

La tarea se acotó: solo `/content/*` (una ruta que el sitio anterior no usaba en absoluto)
se agregó en ese momento; los behaviors de assets estáticos se pospusieron al paso 8, donde
se aplican atómicamente junto con el cambio de origen — momento en el que la colisión deja
de ser posible porque el sitio anterior ya no se sirve.

### 5.2 El incidente: 403 en todas las rutas

El switch se aplicó con autorización explícita. El `update-distribution` fue aceptado, la
distribución desplegó, y la verificación inmediata devolvió **`403` en todas las rutas** —
incluida la URL cruda de CloudFront, lo que descartó un problema de alias.

El diagnóstico fue confuso por dos razones:

1. **CloudWatch mostraba las invocaciones Lambda como exitosas.** No había excepción, no
   había stack trace. La función respondía normalmente… con un 403.
2. El `403` con `x-amzn-errortype: AccessDeniedException` sugería un problema de permisos
   IAM o de la Function URL — pistas falsas, porque la Function URL respondía `200`
   perfectamente cuando se la llamaba directo.

La pista que resolvió el caso fue comparar el `x-amzn-requestid` de la respuesta que recibía
el cliente contra el `RequestId` más reciente en los logs de CloudWatch: **no coincidían.**
Eso reveló que la respuesta 403 no venía de la invocación "exitosa" que se estaba mirando.

**Causa raíz:** al configurar el behavior por defecto se le asignó el *origin request policy*
gestionado `AllViewer`, con la intención de garantizar que headers, cookies y querystrings
llegaran completos a la Lambda. Pero `AllViewer` reenvía también el header `Host` **original
del visitante** — sobrescribiendo el comportamiento por defecto de CloudFront, que es
sustituirlo por el dominio del origen.

Angular valida ese header (`getAllowedHostsFromEnv()` en `@angular/ssr/node`) contra
`NG_ALLOWED_HOSTS`, configurado como `*.lambda-url.us-east-1.on.aws`. Al recibir
`ocastelblanco.com` en vez del dominio de la Function URL, **la propia aplicación devolvía
el 403** — no CloudFront, no IAM.

Lo notable del error: el checklist previo al switch *sí* había verificado que
`NG_ALLOWED_HOSTS` era compatible con cómo CloudFront reenvía el `Host` a un origen custom.
La verificación fue correcta para el comportamiento por defecto. Lo que no se contempló fue
que agregar `AllViewer` invalidaría precisamente esa suposición. **Se verificó la premisa,
pero no se re-verificó tras cambiar la configuración que la sostenía.**

**Fix:** reemplazar `AllViewer` por el gestionado `AllViewerExceptHostHeader`, que reenvía
todo lo demás pero deja que CloudFront sustituya `Host` por el dominio del origen. Aplicado,
desplegado, e invalidado `/*` para limpiar los 403 que habían quedado cacheados por el
`ErrorCachingMinTTL` de la distribución.

### 5.3 Verificación final

Tras el fix: los cuatro hostnames respondiendo como se esperaba, las rutas dinámicas en
`200`, los assets estáticos servidos desde S3, el dominio secundario redirigiendo con `301`,
`api.ocastelblanco.com` sin cambios, y 15 requests consecutivos a distintas rutas sin una
sola repetición del error.

---

## 6. Orquestación y flujo de trabajo IA

### El patrón que definió la sesión: auditar antes de ejecutar

Los tres bugs latentes de §2 no se encontraron leyendo la documentación del proyecto — se
encontraron contrastándola con la realidad:

| Hallazgo | Cómo se encontró |
|---|---|
| Conflicto de dominio de API | Leyendo `serverless.yml` con la pregunta "¿qué pasa si despliego un segundo stage?" |
| `environment.prod.ts` muerto | `grep` de `fileReplacements` en `angular.json` — no existía |
| Contacto sin entrega | Leyendo el handler completo en vez de confiar en el historial de tareas |
| Restricción de alias CloudFront | Consultando el estado real de la distribución vía AWS CLI |

Ninguno era detectable desde `MEMORY.md` o `TODO.md`, que describían el estado *intencionado*.

### Puntos de decisión humana

La sesión tuvo cuatro momentos donde la IA se detuvo a pedir una decisión que no le
correspondía tomar:

1. **Estrategia del switch** (reusar distribución vs. crear una nueva) — decisión
   arquitectónica con trade-offs reales entre velocidad de corte y pureza de IaC.
2. **Topología del CDN** (una distribución con dos orígenes vs. subdominio dedicado).
3. **Alcance del paso 4**, al descubrir el riesgo de colisión de assets — se presentó el
   hallazgo y la propuesta de acotar antes de tocar la distribución en vivo.
4. **Autorización del switch** y de cada operación irreversible sobre infraestructura viva
   (borrado del `ApiMapping`, deploy manual a producción, borrado de la rama `master`).

El patrón general: la IA ejecuta con autonomía sobre lo reversible, y se detiene a pedir
autorización explícita sobre lo que no lo es.

### Verificación honesta como disciplina

Un ejemplo concreto: al implementar el nuevo flujo CI/CD (paso 6), el job `deploy-preview`
se verificó en vivo abriendo un PR real. El job `deploy-production` **no se pudo verificar**
— su trigger es un push a `main`, y `main` todavía no existía.

Se documentó exactamente así, sin redondear: *"queda verificado solo por revisión de código
hasta la siguiente tarea"*. La verificación real llegó un paso después, cuando el push que
creó `main` disparó ese job por primera vez.

---

## 7. Gotchas y aprendizajes

### `AllViewer` rompe cualquier origen que valide el header `Host`

Sin un *origin request policy* que incluya `Host`, CloudFront sustituye automáticamente el
`Host` del visitante por el dominio del origen. Ese comportamiento por defecto es lo que
hace funcionar `NG_ALLOWED_HOSTS` con un patrón fijo. `AllViewer` lo invalida.

Aplica igual a ALBs y APIs con routing basado en `Host`. Cuando se necesita reenviar
headers/cookies/querystrings a un origen así, la policy correcta es
`AllViewerExceptHostHeader`.

### Un 403 con `AccessDeniedException` puede venir de la aplicación, no de AWS

Si CloudWatch muestra invocaciones normales pero el cliente recibe 403, comparar el
`x-amzn-requestid` de la respuesta contra el `RequestId` de los logs. Si no coinciden, se
está mirando la invocación equivocada.

### `CustomErrorResponses` se resuelve con su propio lookup de behavior

La distribución heredaba `403/404 → /index.html (200)` del sitio anterior (fallback típico
de SPA). Como `/index.html` no matchea el `PathPattern` de `/content/*`, CloudFront lo sirve
desde el behavior por defecto — **desde otro origen**. Un objeto faltante en `/content/*`
devuelve `200` con HTML en vez de un `404` limpio.

### Agregar un behavior no invalida lo que ya estaba cacheado para ese path

Si un path se pidió antes de que existiera su behavior específico, un edge POP puede seguir
sirviendo la respuesta vieja durante su TTL. Hay que invalidar explícitamente.

### El sandbox de SES restringe destinatarios, no remitentes

Enviar a una identidad verificada funciona sin pedir production access. Esto convierte el
caso "notificarme a mí mismo" en algo desplegable de inmediato.

### `serverless-domain-manager` no crea el dominio en el primer deploy

Hay que correr `npx sls create_domain --stage <stage>` explícitamente antes. Si el dominio
ya existe pero pertenece a otro stage, el deploy falla con `ApiMapping key already exists`;
la forma de reasignarlo sin downtime de DNS es cirugía manual sobre el `ApiMapping` (el
recurso `DomainName` no se toca, así que Route 53 no cambia).

### Un bucket S3 con puntos en el nombre rompe el TLS del SDK

`mi.bucket.s3.amazonaws.com` no matchea el wildcard `*.s3.amazonaws.com` del certificado.
Los buckets que se accedan con `@aws-sdk/client-s3` deben ir sin puntos — por eso el bucket
de contenido se llama `ocastelblanco-cdn-production` y no `cdn.ocastelblanco.com`.

### `aws lambda get-function-configuration` no expone la concurrencia reservada

Es una API separada: `get-function-concurrency`. Un campo vacío en la primera no significa
que no esté configurada.

---

## 8. Métricas de la iteración

| Métrica | Valor |
|---|---|
| PRs fusionados en esta iteración | 15 (#15 a #29) |
| PRs fusionados en el proyecto (total) | 29 |
| ADRs documentados (total) | 14 |
| Commits en `main` | 102 |
| Pasos de la secuencia hacia el switch | 8, todos verificados en AWS real |
| Bugs latentes encontrados antes de producción | 3 |
| Incidentes de producción | 1 (403 por header `Host`), resuelto en la misma sesión |
| Ventana de indisponibilidad por el switch | Ninguna atribuible al corte en sí — el sitio anterior siguió sirviendo hasta el `update-distribution` |

La sesión completa del 4 de agosto (PRs #21 a #29: auditoría, 8 pasos, incidente y
documentación) ocurrió en un solo bloque de trabajo continuo.

---

## 9. Qué sigue

Según el motor JIT (`TODO.md`), la siguiente tarea activa es:

**Fetch SSR de The Lab** — `ContentService.loadLabEntries()` solo hace fetch cuando
`isPlatformBrowser` es verdadero, así que el HTML pre-renderizado que reciben los buscadores
no incluye las entradas de Lab. Es un gap de SEO conocido y documentado desde ADR-011,
independiente del switch.

Pendientes registrados que no bloquean nada:

- Auto-respuesta al visitante en el formulario de contacto (requiere sacar SES del sandbox).
- Migrar la distribución CloudFront a infraestructura como código vía import de
  CloudFormation.
- Limpiar el glob de assets de `angular.json` para que el fixture de desarrollo
  (`content/lab.dev.json`) no llegue a los builds de producción.
- Revisar en Search Console el efecto del 301 de `olivercastelblanco.com` sobre el indexado
  existente.

---

## 10. Entradas relacionadas

- [`2026-06-fundacion-arquitectura-y-orquestacion-ia.md`](./2026-06-fundacion-arquitectura-y-orquestacion-ia.md)
  — decisiones fundacionales, boilerplate Angular 22, design tokens.
- [`2026-06-shell-identidad-visual-i18n.md`](./2026-06-shell-identidad-visual-i18n.md) —
  shell de navegación, identidad visual, i18n ES/EN, CI.
- [`2026-06-the-lab-y-deploy-ci-cd-lambda.md`](./2026-06-the-lab-y-deploy-ci-cd-lambda.md)
  — primer despliegue a Lambda (stage `preview`) y The Lab con contenido estático.
