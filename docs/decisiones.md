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

## Decisiones pendientes

- [ ] Alcance de las palancas del panel
- [ ] Número de WhatsApp para recibir pedidos
- [ ] Moneda y formato de precio
- [ ] Si el carrito incluye un paso de revisión y si pide nombre y zona de entrega
- [ ] Stack del sitio (generador estático)
- [ ] Nombre de marca y logotipo
