/**
 * Configuración del catálogo.
 *
 * Todo lo que puede cambiar sin tocar el diseño vive aquí. El repositorio es
 * público, así que este archivo no debe contener claves ni tokens: solo datos
 * que de todas formas serán visibles en la página.
 */

export const MARCA = {
  // Pendiente: nombre y logotipo definitivos.
  nombre: 'MM',
  descripcion: 'Blusas',
};

export const WHATSAPP = {
  // Pendiente: número real de destino, en formato internacional sin signos.
  // Ejemplo Venezuela: '584121234567'
  numero: '',

  // Encabezado del mensaje que se genera al enviar el pedido.
  saludo: 'Hola! Quiero pedir:',
};

export const MONEDA = {
  codigo: 'USD',
  simbolo: '$',
  // Cantidad de decimales al mostrar precios.
  decimales: 0,
};

/**
 * Bolívares — aplazado.
 *
 * El diseño completo de esta funcionalidad está en docs/decisiones.md (punto 9):
 * qué tasa usar, cómo se consulta, el caché de una hora y las APIs verificadas.
 * Se activa cambiando `habilitado` a true una vez definida la tasa.
 */
export const BOLIVARES = {
  habilitado: false,
  tasa: null, // 'bcv' | 'paralelo'
};

/**
 * Categorías del catálogo. El orden define cómo aparecen los filtros.
 */
export const CATEGORIAS = [
  { id: 'todas', nombre: 'Todas' },
  { id: 'manga-larga', nombre: 'Manga larga' },
  { id: 'manga-corta', nombre: 'Manga corta' },
  { id: 'sin-mangas', nombre: 'Sin mangas' },
];
