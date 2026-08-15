# Decisiones de arquitectura

Registro de las decisiones tomadas, con el razonamiento que las sostiene. El
objetivo es no volver a discutirlas dentro de seis meses sin contexto.

---

## 1. Carrito con un solo mensaje final, no un botón por producto

**Decidido.** La clienta agrega varias piezas y al final envía un único mensaje
de WhatsApp con el pedido completo.

Es el patrón que usan las herramientas del rubro (RediRedi, atom.bio,
Tomapedidos) y los plugins de Shopify/WooCommerce. Quien quiere tres blusas
manda un mensaje ordenado en vez de tres sueltos.

---

## 2. Sin base de datos propia

**Decidido.** El catálogo no se apoya en una base de datos administrada por
nosotros.

### El argumento que lo cierra

Una base de datos se justifica cuando algo modifica los datos **sin que un
humano intervenga** — típicamente, el stock que baja solo al vender.

Aquí no hay checkout: la venta se cierra por WhatsApp, a mano. El stock se
actualiza manualmente en cualquier escenario. Con base de datos el trabajo sería
idéntico, pero además habría que mantener credenciales, reglas de acceso,
backups y un punto de falla adicional. Se paga el costo completo sin recibir la
ventaja que lo justifica.

### Comparación

| Criterio | Sin DB propia (Sanity + sitio estático) | Con DB propia (Supabase/Firebase + panel) |
|---|---|---|
| Tiempo de desarrollo | ~1 día | Varios días a semanas |
| Costo mensual | $0 con margen amplio para 40 productos | $0 al inicio, sube al escalar |
| Editar sin tocar código | Sí, panel incluido | Sí, pero hay que construir el panel |
| Velocidad de carga | Máxima — archivo estático en CDN | Depende de consultar el servidor |
| Si el servicio se cae | El catálogo sigue en pie; solo no se puede editar | El catálogo puede quedar en blanco |
| Seguridad | Nada que proteger | Autenticación, reglas de acceso, credenciales |
| Backups | Contenido versionado, historial en Sanity | Responsabilidad propia |
| Mantenimiento | Prácticamente nulo | Continuo |
| Optimización de fotos | Automática | Hay que montarla aparte |
| Cambios reflejados en vivo | ~1 minuto (reconstruye el sitio) | Instantáneo |
| Stock que baja solo al vender | No | Sí, pero requiere checkout |
| Historial de pedidos y reportes | No | Sí |
| Escala a miles de productos | Se degrada pasando ~150–200 | Sin problema |

### Qué se pierde realmente

De la lista anterior, solo tres son ventajas genuinas de tener base de datos
propia, y ninguna aplica hoy:

1. **Cambios instantáneos.** Se pierde ~1 minuto por reconstrucción. Irrelevante
   para un catálogo que se actualiza cada 1–2 semanas. Si algún día molesta, se
   puede pasar a lectura en vivo sin rehacer el sitio.
2. **Stock automático.** Requiere checkout en la página, que no existe.
3. **Historial y reportes.** Los pedidos viven en las conversaciones de
   WhatsApp. Construir esto sería levantar un CRM para un problema que hoy no
   se tiene.

### Cuándo se revisa esta decisión

- Si se incorporan pagos dentro de la página.
- Si el catálogo supera ~200 productos.
- Si se necesitan reportes de venta o historial de clientas dentro del sitio.

---

## 3. Sanity como panel de edición

**Decidido.** El catálogo se administra desde Sanity a partir de la fase 4.

> Matiz: Sanity *es* técnicamente una base de datos, alojada y operada por
> ellos. Lo que se descartó en la decisión 2 no fue "tener base de datos", sino
> **administrar una propia**.

### Por qué Sanity

1. **Optimiza las fotos automáticamente.** Se sube la imagen tal como sale del
   celular y el sitio sirve una versión ligera y en formato moderno, del tamaño
   que cada dispositivo necesita. Es el punto decisivo: el catálogo se abre
   desde Instagram, casi siempre en móvil y muchas veces con datos.
2. **No hay que montar autenticación.** Se entra con cuenta de Google.
3. **Funciona desde el teléfono.** Permite subir fotos desde la galería o
   tomarlas con la cámara. Sanity mejoró la experiencia móvil en junio de 2026.

### Alternativas descartadas

| Opción | Motivo del descarte |
|---|---|
| **Decap CMS** | Dejó de mantenerse activamente tras la cesión de Netlify a la comunidad |
| **Google Sheets** | No resuelve las fotos, que son el trabajo pesado real |
| **Sveltia CMS** | Alternativa válida y activa, pero exige montar optimización de imágenes aparte y configurar acceso por GitHub |

---

## 4. El sitio permanece estático

**Decidido.** El contenido se lee de Sanity al construir el sitio, no en cada
visita.

Consecuencias:

- La velocidad es la de un archivo estático en CDN.
- Si Sanity dejara de responder, el catálogo sigue funcionando con el último
  contenido publicado; solo se pierde la capacidad de editar.
- Publicar un cambio tarda cerca de un minuto, mientras el sitio se reconstruye.

---

## 5. Orden de construcción: datos locales antes que CMS

**Decidido.** Las fases 1 a 3 se construyen contra un archivo JSON local. La
migración a Sanity ocurre en la fase 4.

El JSON semilla tiene exactamente la forma que después entrega Sanity, así que
el sitio no percibe el cambio: solo cambia el origen de los datos.

La ventaja es tener un catálogo real, funcionando y compartible antes de
depender de ningún servicio externo. El orden inverso implicaría días de
configuración sin ver una sola blusa en pantalla.

---

## 6. Filosofía del panel: libertad curada

**Decidido.** El panel expone palancas concretas y acotadas, no un editor visual
libre.

La coherencia visual es lo que separa un catálogo con identidad de una plantilla
genérica: dos tipografías y no cinco, todas las etiquetas de precio iguales, los
mismos espacios. Un panel que permite tocar todo es un panel que permite romper
eso sin advertirlo. Además, cada palanca es código que hay que construir y
mantener.

**Pendiente de definir:** el alcance exacto de las palancas (solo curaduría, o
también paletas de temporada).

---

## 7. Astro como generador del sitio

**Decidido.** El sitio se construye con Astro (versión 7.2 al momento de
decidirlo).

Motivos:

- Genera HTML plano, sin peso de aplicación. Es lo que más importa para un
  catálogo que se abre desde Instagram, en móvil y muchas veces con mala
  conexión.
- Trae optimización de imágenes incorporada.
- Tiene integración oficial con Sanity, así que la fase 4 no requiere construir
  la conexión desde cero.
- El diseño de "una blusa" se escribe una sola vez y sirve para todo el
  catálogo.

**Contrapartida asumida:** existe un paso de construcción; el sitio se arma
antes de publicarse. Requiere Node, ya presente en el entorno.

---

## 8. El precio se guarda en dólares

**Decidido.** Cada producto almacena un único precio, en USD. El mercado es
Venezuela.

La razón es de mantenimiento, no de preferencia: fijando los precios en
bolívares, cada movimiento de la tasa obligaría a reeditar el catálogo
completo, producto por producto. Guardándolos en dólares, la tasa se mueve y
**no se toca ningún precio**.

---

## 9. Bolívares con tasa automática — APLAZADO

**Aplazado, no descartado.** El sitio arranca mostrando solo dólares. Esta
sección conserva el diseño de la solución para retomarla sin volver a
investigar.

### Qué se quiere

Mostrar cada precio en USD y su equivalente en bolívares, actualizado
automáticamente, sin edición manual.

### Decisión abierta: cuál tasa

Es una decisión de negocio, no técnica:

- **BCV** — oficial del Banco Central, la que corresponde para facturación
  formal.
- **Paralelo** — referencia de mercado, habitualmente más alta.

Conviene dejarla configurable desde el panel para poder cambiarla sin
intervención de desarrollo.

### Arquitectura prevista

La tasa se consulta **cuando la clienta carga el catálogo**, no en el momento
de publicar. Así el bolívar mostrado es el del día aunque el sitio lleve
semanas sin republicarse.

Si la consulta falla, se usa la última tasa conocida horneada en el build,
señalando su antigüedad. El catálogo nunca queda sin precios: en el peor caso
muestra dólares y un bolívar marcado como desactualizado.

Entre el sitio y la API se interpone una función en Vercel que cachea la tasa
**una hora**. El motivo es concreto: el plan gratuito de Cotizave da 1.500
consultas mensuales. Consultando directo desde cada visita, 1.500 visitas
agotarían el servicio. Con caché de una hora son ~720 consultas al mes en
total, sin importar el volumen de tráfico.

### APIs verificadas (agosto 2026)

| Servicio | Cobertura | Costo |
|---|---|---|
| [Cotizave](https://cotizave.com/) | BCV, paralelo, USDT/VES. Actualiza cada 25 min, incluye `updated_at` | Gratis, 1.500 consultas/mes |
| [PyDolarVenezuela](https://docs.pydolarve.org/) | BCV y varios monitores | Gratis |
| [BCV API](https://www.bcvapi.tech/) | Solo tasa oficial BCV | Gratis |

### Resguardos para el negocio

- El monto en bolívares se muestra como **referencial**, acompañado de la tasa
  usada y su hora: *"Bs. 24.500 — tasa BCV del 15/08, 9:00 a.m."* Si la tasa se
  mueve entre la consulta y el pago, queda registro de lo que la clienta vio.
- El mensaje de WhatsApp incluye ambos montos, la tasa aplicada y su hora, para
  que no haya ambigüedad entre las partes.

---

## Decisiones pendientes

- [ ] Cuál tasa de cambio se usa (BCV o paralela) — ver decisión 9
- [ ] Alcance de las palancas del panel
- [ ] Número de WhatsApp para recibir pedidos
- [ ] Si el carrito incluye un paso de revisión y si pide nombre y zona de entrega
- [ ] Nombre de marca y logotipo
