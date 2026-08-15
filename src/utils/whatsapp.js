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

const SEPARADOR = '━━━━━━━━━━━';

/**
 * Arma el texto del pedido, un bloque por pieza.
 *
 * Usa el formato de WhatsApp — *negrita* e _cursiva_ — para dar jerarquía:
 * en pantalla chica, un bloque de texto plano es difícil de leer de un
 * vistazo. Los campos vacíos se omiten para que no lleguen líneas huérfanas.
 */
export function construirMensaje(lineas, datos = {}) {
  const partes = [];
  const referencia = datos.numeroPedido ?? numeroPedido();

  partes.push(WHATSAPP.saludo);
  partes.push('');

  for (const l of lineas) {
    const subtotal = formatearPrecio(l.precioUSD * l.cantidad);
    const codigo = l.codigo ? ` (${l.codigo})` : '';

    partes.push(`*${l.nombre}*${codigo}`);
    partes.push(`Talla ${l.talla} · Color ${l.color}`);

    // Con más de una pieza se muestra el unitario, para que quede claro de
    // dónde sale el subtotal.
    partes.push(
      l.cantidad === 1
        ? `1 pieza — ${subtotal}`
        : `${l.cantidad} piezas × ${formatearPrecio(l.precioUSD)} — ${subtotal}`
    );
    partes.push('');
  }

  const extras = [
    ['Nombre', datos.nombre],
    ['Ubicación', datos.zona],
    ['Método de pago', datos.pago],
    ['Método de entrega', datos.entrega],
    ['Nota', datos.nota],
  ].filter(([, valor]) => valor && String(valor).trim());

  if (extras.length) {
    partes.push('*Mis datos*');
    for (const [etiqueta, valor] of extras) {
      partes.push(`${etiqueta}: ${String(valor).trim()}`);
    }
    partes.push('');
  }

  // El total cierra el mensaje. Es el dato que se busca primero al recibir un
  // pedido, y al final queda a la vista sin tener que desplazarse hacia arriba
  // en el chat.
  partes.push(SEPARADOR);
  partes.push(`*TOTAL: ${formatearPrecio(total(lineas))}*`);
  partes.push('');
  partes.push(`_Ref. ${referencia}_`);

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
