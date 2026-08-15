import { WHATSAPP } from '../config.js';
import { formatearPrecio } from './formato.js';
import { total } from '../scripts/carrito.js';

/**
 * Identificador corto para poder referirse al pedido en la conversación.
 * No es un consecutivo real — sin servidor no hay dónde llevar la cuenta —
 * pero basta para distinguir dos pedidos en un chat.
 */
export function numeroPedido(fecha = new Date()) {
  return `MM-${String(fecha.getTime()).slice(-4)}`;
}

/**
 * Arma el texto del pedido. Los campos vacíos se omiten para que no lleguen
 * líneas huérfanas del tipo "Zona:" sin nada al lado.
 */
export function construirMensaje(lineas, datos = {}) {
  const partes = [];
  const referencia = datos.numeroPedido ?? numeroPedido();

  partes.push(`${WHATSAPP.saludo} (${referencia})`);
  partes.push('');

  for (const l of lineas) {
    const subtotal = formatearPrecio(l.precioUSD * l.cantidad);
    partes.push(
      `- ${l.nombre}, talla ${l.talla}, color ${l.color} x${l.cantidad} — ${subtotal}`
    );
  }

  partes.push('');
  partes.push(`Total: ${formatearPrecio(total(lineas))}`);

  const extras = [
    ['Nombre', datos.nombre],
    ['Zona', datos.zona],
    ['Pago', datos.pago],
    ['Entrega', datos.entrega],
    ['Nota', datos.nota],
  ].filter(([, valor]) => valor && String(valor).trim());

  if (extras.length) {
    partes.push('');
    for (const [etiqueta, valor] of extras) {
      partes.push(`${etiqueta}: ${String(valor).trim()}`);
    }
  }

  return partes.join('\n');
}

/**
 * Lleva el número a formato internacional, que es el único que acepta wa.me.
 *
 *   0414-031-7475  ->  584140317475
 *   4140317475     ->  584140317475
 *   584140317475   ->  584140317475
 */
export function normalizarNumero(crudo, codigoPais = WHATSAPP.codigoPais) {
  let digitos = String(crudo ?? '').replace(/\D/g, '');
  if (!digitos) return '';

  if (digitos.startsWith('0')) {
    // Formato local: el 0 inicial se sustituye por el código de país.
    digitos = codigoPais + digitos.slice(1);
  } else if (!digitos.startsWith(codigoPais)) {
    digitos = codigoPais + digitos;
  }

  return digitos;
}

/**
 * Devuelve null si todavía no hay número configurado, para que la interfaz
 * pueda avisar en vez de abrir un enlace roto.
 */
export function construirEnlace(mensaje) {
  const numero = normalizarNumero(WHATSAPP.numero);
  if (!numero) return null;

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
