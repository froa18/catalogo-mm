# Catálogo MM

Catálogo de blusas en una página, pensado para linkearse desde la bio de Instagram.
La clienta navega, elige talla y color, arma su pedido y lo envía por WhatsApp en
un solo mensaje ya formateado.

Sin checkout, sin pasarela de pago. El cierre de venta sigue siendo conversacional.

> El nombre `catalogo-mm` es provisional hasta que se defina la marca definitiva.

---

## Estado

Fase 2 — el flujo de compra funciona de punta a punta como **borrador**:
catálogo, ficha, carrito y armado del pedido. Pendiente de pulido y de
configurar el número de WhatsApp.

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Repositorio y estructura base | ✅ |
| 1 | Esquema de producto y datos semilla | ✅ |
| 2 | Sitio funcional: catálogo, ficha, carrito, WhatsApp | ✅ borrador |
| 3 | Deploy en Vercel | Pendiente |
| 4 | Panel de edición con Sanity | Pendiente |
| 5 | Fotos reales y lanzamiento | Pendiente |

### Bloqueante para publicar

`WHATSAPP.numero` en `src/config.js` está vacío. Hasta definirlo, la pantalla
de pedido arma el mensaje pero no puede enviarlo, y lo advierte en la interfaz.

## Cómo correrlo

```bash
npm install      # solo la primera vez
npm run dev      # abre el sitio en http://localhost:4321
npm run build    # genera el sitio listo para publicar
```

## Estructura

```
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
  "id": "blusa-aurora",
  "nombre": "Blusa Aurora",
  "descripcion": "Manga larga con caída suave y puño abierto.",
  "categoria": "manga-larga",
  "precioUSD": 22,
  "tallas": ["S", "M", "L"],
  "colores": [{ "nombre": "Negro", "hex": "#1F1D1B" }],
  "imagen": null,
  "disponible": true,
  "etiqueta": "Nuevo",
  "orden": 1
}
```

| Campo | Para qué sirve |
|---|---|
| `precioUSD` | Precio en dólares. Ver decisión 8 en `docs/decisiones.md` |
| `tallas` | Se elimina una talla del arreglo cuando se agota |
| `colores` | El `hex` permite mostrar el color real en el selector |
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
