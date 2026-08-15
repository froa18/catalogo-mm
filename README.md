# Catálogo MM

Catálogo de blusas en una página, pensado para linkearse desde la bio de Instagram.
La clienta navega, elige talla y color, arma su pedido y lo envía por WhatsApp en
un solo mensaje ya formateado.

Sin checkout, sin pasarela de pago. El cierre de venta sigue siendo conversacional.

> El nombre `catalogo-mm` es provisional hasta que se defina la marca definitiva.

---

## Estado

Fase 0 — repositorio inicializado. El sitio todavía no está construido.

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Repositorio y estructura base | En curso |
| 1 | Esquema de producto y datos semilla | Pendiente |
| 2 | Sitio funcional: catálogo, ficha, carrito, WhatsApp | Pendiente |
| 3 | Deploy en Vercel | Pendiente |
| 4 | Panel de edición con Sanity | Pendiente |
| 5 | Fotos reales y lanzamiento | Pendiente |

## Cómo está pensado

- **Sitio estático.** Se sirve desde CDN, carga instantáneo y no depende de que
  ningún servicio externo esté vivo.
- **Los datos viven aparte del diseño.** Actualizar el catálogo nunca implica
  tocar el maquetado.
- **Sin base de datos propia.** El razonamiento completo está en
  [`docs/decisiones.md`](docs/decisiones.md).
- **Edición sin código.** A partir de la fase 4, el catálogo se administra desde
  un panel web (Sanity), también accesible desde el teléfono.

## Documentación

| Archivo | Qué contiene |
|---|---|
| [`docs/brief-original.md`](docs/brief-original.md) | El brief de partida, tal como se recibió |
| [`docs/decisiones.md`](docs/decisiones.md) | Decisiones de arquitectura y su razonamiento |

## Seguridad

Este repositorio es público. Por lo tanto:

- Ningún token, clave de API ni credencial se escribe en el código. Van en
  variables de entorno de Vercel.
- El archivo `.env` está excluido del repo por `.gitignore`.
- El número de WhatsApp se mantiene en un archivo de configuración aislado, para
  poder moverlo a variable de entorno sin tocar el resto del código.
