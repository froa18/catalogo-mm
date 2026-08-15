# Catálogo de Blusas — Brief de Desarrollo

Página de catálogo para linkear desde la bio de Instagram. El cliente navega los
productos, arma un pedido y lo envía por WhatsApp ya formateado. Sin checkout,
sin pasarela de pago, sin base de datos — el cierre de venta sigue siendo
conversacional por WhatsApp.

---

## 1. Objetivo

- Un link único en la bio de Instagram que lleve a una página de catálogo.
- El cliente elige producto, talla y color.
- Puede agregar varias piezas antes de pedir (no un mensaje por prenda).
- Al final, un solo botón manda **un mensaje de WhatsApp con todo el pedido ya armado.**

---

## 2. Por qué este enfoque (validado con investigación, no inventado)

Esta idea ya es una categoría establecida de herramientas para pequeños negocios
en Latinoamérica. Referencias reales encontradas:

- **RediRedi, atom.bio, Tomapedidos** — SaaS ya existentes que ofrecen
  exactamente esto: catálogo en una página + pedido por WhatsApp.
- **Plugins de Shopify/WooCommerce** ("QuickChat Buy", "WooCommerce WhatsApp
  Checkout Pro") — confirman que el estándar de la industria es un botón de
  WhatsApp que arma el mensaje con producto, variante y cantidad, a veces con
  un paso de confirmación antes de abrir WhatsApp.
- **Proyecto open source real** (`catalogo-digital-whatsapp`, usado por una
  tienda en producción) — confirma el flujo completo: catálogo → ficha de
  producto con variantes → carrito → un solo pedido final por WhatsApp.

**Conclusión clave que ajustó nuestro plan inicial:** el patrón que funciona
en la práctica es **carrito + un solo mensaje final**, no un botón de
WhatsApp por cada producto. Así el cliente que quiere 3 blusas manda un
mensaje ordenado, no tres sueltos.

### Sobre WhatsApp Business (catálogo nativo)

Existe y es gratis: hasta 500 productos con foto, precio y descripción dentro
del perfil de WhatsApp Business. **Es complementario, no reemplaza esta
página** — no tiene selector de talla/color ni carrito. Vale la pena
activarlo en paralelo más adelante, pero no resuelve lo que estamos
construyendo aquí.

---

## 3. Decisiones ya tomadas

| Pregunta | Decisión |
|---|---|
| ¿Cada cuánto se actualiza el catálogo? | Cada 1–2 semanas |
| ¿Cuántos productos aprox.? | Entre 15 y 40 |
| ¿Selección de talla y color antes de pedir? | Sí, ambas |
| ¿Necesita base de datos / panel de admin? | No — a esta escala y frecuencia de cambio, es innecesario |

---

## 4. Arquitectura técnica recomendada

### Separar datos del diseño
Con actualizaciones cada 1–2 semanas, el catálogo **no debe vivir escrito a
mano dentro del HTML**. Debe leerse desde un archivo de datos aparte (JSON),
para que actualizar el catálogo sea editar una lista, no tocar el diseño.

Estructura sugerida por producto:

```json
{
  "id": "blusa-aurora",
  "nombre": "Blusa Aurora",
  "categoria": "manga-larga",
  "precio": 650,
  "tallas": ["S", "M", "L"],
  "colores": ["Negro", "Blanco"],
  "imagen": "aurora.jpg",
  "disponible": true
}
```

Para marcar algo agotado: se quita la talla/color del arreglo, o se pone
`"disponible": false` para ocultar el producto completo. Manual, pero rápido
de mantener a este volumen.

### Flujo de usuario
1. **Catálogo (home):** grilla de productos con filtro por categoría
   (manga larga / corta / sin mangas). Ya prototipado y funcionando.
2. **Ficha rápida de producto:** al tocar una blusa, se abre una vista con
   la foto, chips de talla y color, y botón "Agregar al pedido".
3. **Carrito simple:** lista de lo que el cliente fue agregando (producto +
   talla + color + cantidad), con opción de quitar algo.
4. **Botón final "Enviar pedido por WhatsApp":** arma un link `wa.me` con
   el texto del pedido completo ya codificado y lo abre.

### Ejemplo de mensaje final generado
```
Hola! Quiero pedir:
- Blusa Aurora, talla M, color Negro
- Blusa Vela, talla S, color Lino

Total aprox: $1,100
```

---

## 5. Diseño (ya prototipado y aprobado)

- Estética minimalista/limpia: fondo hueso cálido, tinta casi negra, acento
  sage.
- Tipografía: Fraunces (serif, títulos) + Inter (texto).
- Detalle de marca: cada producto lleva una "etiqueta colgante" (swing tag)
  con el precio, inspirada en las etiquetas reales de ropa.
- Ícono placeholder: bocetos técnicos de moda (flats) en línea, mientras no
  haya fotos reales del producto — se reemplazan por `<img>` cuando estén listas.
- Ya existe un primer prototipo funcional (`catalogo-blusas.html`) que
  implementa esta parte visual. **Pendiente:** actualizarlo para que use el
  patrón de carrito de la sección 4, en vez de un botón de WhatsApp por
  producto.

---

## 6. Hosting y flujo de actualización

1. Repo en GitHub.
2. Deploy automático en Vercel o Netlify (cada push actualiza el sitio en vivo).
3. Ese link de Vercel/Netlify es el que va en la bio de Instagram.
4. Para actualizar el catálogo: pedirle a Claude Code el cambio puntual sobre
   el archivo de datos ("agrega esta blusa", "quita la talla S de Blusa Mar",
   "sube el precio de Blusa Sol a $550") — no se toca el diseño.

---

## 7. Pendientes / próximas decisiones

- [ ] Definir número real de WhatsApp para recibir pedidos.
- [ ] Definir moneda (el prototipo usa `$` genérico).
- [ ] Decidir si el carrito lleva un paso de "revisar pedido" antes de abrir
      WhatsApp (reduce errores, lo usan varias herramientas del mercado).
- [ ] Fotos reales de cada blusa (reemplazan los flats placeholder).
- [ ] Confirmar nombre de marca y logotipo definitivos.
- [ ] Evaluar activar también el catálogo nativo de WhatsApp Business como
      complemento (opcional, no bloqueante).
