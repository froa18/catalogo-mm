/**
 * Configuración del catálogo.
 *
 * Todo lo que puede cambiar sin tocar el diseño vive aquí. El repositorio es
 * público, así que este archivo no debe contener claves ni tokens: solo datos
 * que de todas formas serán visibles en la página.
 */

export const MARCA = {
  nombre: 'Modas Marfreidy',
  // Monograma del logotipo: las dos emes superpuestas.
  iniciales: 'MM',
  descripcion: 'Blusas',
};

/**
 * Tira de aviso sobre la barra de navegación. Se va con el scroll.
 * Poner `activo: false` la quita sin tocar el diseño.
 */
export const ANUNCIO = {
  activo: true,
  texto: 'Pedidos por WhatsApp · Envíos a todo el país',
};

/**
 * Carrusel de la portada: una selección curada, no todo el catálogo.
 * El orden de `ids` es el orden en que se muestran; los que no existan o
 * estén ocultos se ignoran solos.
 */
export const DESTACADOS = {
  titulo: 'Básicos para todos los días',
  // Vacía: la sección se queda solo con el título. Al escribir algo acá,
  // aparece el párrafo debajo.
  descripcion: '',
  ids: ['blusa-aurora', 'blusa-mar', 'blusa-sol', 'blusa-duna'],
};

export const WHATSAPP = {
  // Código de país del negocio. Venezuela: 58.
  codigoPais: '58',

  /**
   * El número NO se escribe acá: este archivo se sube al repositorio público
   * y todo lo que entra a un commit queda en el historial para siempre.
   *
   * Se define en `.env` (ver `.env.example`), que está excluido del repo, y
   * en las variables de entorno de Vercel al desplegar.
   */
  numero: import.meta.env?.PUBLIC_WHATSAPP_NUMERO ?? '',

  // Encabezado del mensaje que se genera al enviar el pedido.
  saludo: 'Hola! Quiero hacer este pedido 🌸',
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
 * Formas de pago ofrecidas al revisar el pedido.
 * Editar esta lista según lo que acepte el negocio.
 */
export const FORMAS_PAGO = [
  'Pago móvil',
  'Transferencia (Bs)',
  'Efectivo (divisas)',
  'Zelle',
  'Binance / USDT',
];

/**
 * Formas de entrega ofrecidas al revisar el pedido.
 */
export const FORMAS_ENTREGA = [
  'Delivery a domicilio',
  'Retiro en punto acordado',
  'Envío nacional (MRW / Zoom)',
];

/**
 * Categorías del catálogo. El orden define cómo aparecen los filtros.
 */
export const CATEGORIAS = [
  { id: 'todas', nombre: 'Todas' },
  { id: 'manga-larga', nombre: 'Manga larga' },
  { id: 'manga-corta', nombre: 'Manga corta' },
  { id: 'sin-mangas', nombre: 'Sin mangas' },
];
