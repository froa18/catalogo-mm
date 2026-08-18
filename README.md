# Catálogo MM

**En vivo:** https://catalogo-mm-xi.vercel.app

Catálogo de blusas en una página, pensado para linkearse desde la bio de Instagram.
La clienta navega, elige talla y color, arma su pedido y lo envía por WhatsApp en
un solo mensaje ya formateado.

Sin checkout, sin pasarela de pago. El cierre de venta sigue siendo conversacional.

> El nombre `catalogo-mm` es provisional hasta que se defina la marca definitiva.

---

## Estado

Fase 3 — el sitio está en vivo y el flujo de compra funciona de punta a punta
como **borrador**: catálogo, ficha, carrito y armado del pedido. Pendiente de
pulido, de sumar las fotos reales que faltan y de configurar el número de
WhatsApp del negocio.

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Repositorio y estructura base | ✅ |
| 1 | Esquema de producto y datos semilla | ✅ |
| 2 | Sitio funcional: catálogo, ficha, carrito, WhatsApp | ✅ borrador |
| 3 | Deploy en Vercel | ✅ — cada push a `main` republica el sitio solo |
| 4 | Panel de edición con Sanity | Pendiente |
| 5 | Fotos reales y lanzamiento | En progreso — 2 de 7 piezas con foto real |

## Qué falta

- [ ] **Fotos reales** de las 5 piezas que aún muestran el ícono de línea
      (Aurora, Vela, Mar, Sol, Duna) — ver `src/data/productos.json`.
- [ ] **Número de WhatsApp real del negocio.** El que está configurado hoy es
      de prueba (ver más abajo).
- [ ] **Panel de edición (Sanity, fase 4).** Hoy el catálogo se edita a mano en
      `src/data/productos.json` — funciona, pero cada cambio pasa por acá.
- [ ] **Bolívares con tasa automática** — diseño completo y APIs verificadas en
      `docs/decisiones.md` (punto 9), falta decidir BCV vs. paralelo y
      construirlo.
- [ ] Revisar el catálogo completo en el teléfono real antes de anunciarlo
      (hasta ahora se validó con capturas y el simulador de Playwright).

## Retomar el trabajo en otra computadora

```bash
git clone https://github.com/froa18/catalogo-mm.git
cd catalogo-mm
npm install
cp .env.example .env    # completar PUBLIC_WHATSAPP_NUMERO (ver abajo)
npm run dev
```

`.env` no se sube al repositorio (está en `.gitignore`), así que en una
computadora nueva el sitio arranca **sin** número de WhatsApp configurado: no
se rompe, pero deshabilita el envío del pedido hasta completarlo. El número de
producción vive en las variables de entorno de Vercel, no acá — si hace falta
recuperarlo, está en el panel de Vercel del proyecto. Es **provisional, para
pruebas** — hay que reemplazarlo por el del negocio antes de publicar.

## Configurar el número de WhatsApp

El número **no se escribe en el código**. Este repositorio es público, y todo lo
que entra en un commit queda en el historial de forma permanente — cambiarlo
después no lo borra.

En local:

```bash
cp .env.example .env    # y completar PUBLIC_WHATSAPP_NUMERO
```

Formato: código de país + número, solo dígitos. En Venezuela el `0` inicial se
reemplaza por `58` (`0414-031-7475` → `584140317475`). De todas formas
`normalizarNumero()` en `src/utils/whatsapp.js` corrige las variantes comunes.

En producción se define como variable de entorno en Vercel, no en el repo.

Sin número configurado el sitio no se rompe: la pantalla de pedido arma el
mensaje, avisa que falta configurarlo y deshabilita el envío.

## Cómo correrlo

```bash
npm install      # solo la primera vez
npm run dev      # abre el sitio en http://localhost:4321
npm run build    # genera el sitio listo para publicar
```

## Estructura

```
public/
└─ imagenes/           → fotos de producto, referenciadas desde productos.json
src/
├─ config.js           → marca, WhatsApp, moneda, categorías
├─ data/
│  └─ productos.json   → el catálogo (se migra a Sanity en la fase 4)
└─ pages/
   └─ index.astro      → la página del catálogo
```

### Esquema de un producto

```json
{
  "id": "blazer-ceniza",
  "codigo": "MM-007",
  "nombre": "Blazer Ceniza",
  "descripcion": "Entallado en la cintura, con bolsillos de solapa y botones tono madera.",
  "categoria": "manga-larga",
  "precioUSD": 15,
  "tallas": ["S", "M", "L"],
  "colores": [
    { "nombre": "Gris", "hex": "#6E7580", "imagen": "/imagenes/blazer-gris.jpg" },
    { "nombre": "Negro", "hex": "#1B1B1D", "imagen": "/imagenes/blazer-negro.jpg" }
  ],
  "imagen": "/imagenes/blazer-gris.jpg",
  "disponible": true,
  "etiqueta": "Nuevo",
  "orden": 7
}
```

| Campo | Para qué sirve |
|---|---|
| `codigo` | Referencia corta (`MM-001`, secuencial) para identificar la pieza fuera del sitio — en el pedido de WhatsApp y al llevar el inventario a mano |
| `precioUSD` | Precio en dólares. Ver decisión 8 en `docs/decisiones.md` |
| `tallas` | Se elimina una talla del arreglo cuando se agota |
| `colores` | El `hex` pinta la muestra del selector. El `imagen` es opcional: si el color lo trae, elegirlo en la ficha cambia la foto principal por esa (estilo Shein). Si un color no tiene `imagen`, queda con la foto general del producto |
| `imagen` (raíz) | Foto por defecto de la tarjeta y de la ficha — normalmente la del primer color |
| `disponible` | En `false` oculta el producto completo |
| `etiqueta` | Distintivo opcional: `"Nuevo"`, `"Últimas piezas"` |
| `orden` | Posición en la grilla |

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
