import { MONEDA } from '../config.js';

/**
 * Formatea un precio para mostrarlo en pantalla.
 * Centralizado acá porque se usa en la grilla, la ficha, el carrito y el
 * mensaje de WhatsApp — y porque al activar bolívares (decisión 9) este es
 * el punto donde se agrega la conversión.
 */
export function formatearPrecio(valor) {
  const numero = valor.toLocaleString('es-VE', {
    minimumFractionDigits: MONEDA.decimales,
    maximumFractionDigits: MONEDA.decimales,
  });
  return `${MONEDA.simbolo}${numero}`;
}
