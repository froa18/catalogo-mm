/**
 * Estado del pedido en curso.
 *
 * Vive en localStorage: no hay servidor y el pedido debe sobrevivir a que la
 * clienta cierre el navegador o le entre una llamada.
 *
 * Cada mutación emite `carrito:cambio` en document. El botón flotante y el
 * panel escuchan ese evento en lugar de consultar el almacenamiento.
 */

const CLAVE = 'catalogo-mm:pedido';
const CANTIDAD_MAXIMA = 99;

/** Identifica una línea. La misma blusa en otra talla es una línea distinta. */
export function claveDe(id, talla, color) {
  return `${id}|${talla}|${color}`;
}

/**
 * Un localStorage corrupto, lleno o bloqueado (modo privado en algunos
 * navegadores) nunca debe romper la página: se degrada a pedido vacío.
 */
export function leer() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return [];
    const datos = JSON.parse(crudo);
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardar(lineas) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lineas));
  } catch {
    // Sin persistencia el pedido sigue en memoria hasta recargar.
  }
  document.dispatchEvent(
    new CustomEvent('carrito:cambio', { detail: { lineas } })
  );
  return lineas;
}

export function agregar({ id, codigo, nombre, precioUSD, talla, color, cantidad = 1 }) {
  const lineas = leer();
  const clave = claveDe(id, talla, color);
  const existente = lineas.find((l) => l.clave === clave);

  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + cantidad, CANTIDAD_MAXIMA);
  } else {
    lineas.push({
      clave,
      id,
      codigo,
      nombre,
      precioUSD,
      talla,
      color,
      cantidad: Math.min(cantidad, CANTIDAD_MAXIMA),
    });
  }

  return guardar(lineas);
}

export function quitar(clave) {
  return guardar(leer().filter((l) => l.clave !== clave));
}

export function cambiarCantidad(clave, cantidad) {
  if (cantidad < 1) return quitar(clave);

  const lineas = leer();
  const linea = lineas.find((l) => l.clave === clave);
  if (linea) linea.cantidad = Math.min(cantidad, CANTIDAD_MAXIMA);

  return guardar(lineas);
}

export function vaciar() {
  return guardar([]);
}

export function total(lineas = leer()) {
  return lineas.reduce((suma, l) => suma + l.precioUSD * l.cantidad, 0);
}

export function contarPiezas(lineas = leer()) {
  return lineas.reduce((suma, l) => suma + l.cantidad, 0);
}
