/**
 * Capturas del catálogo para revisar el diseño.
 *
 * El sitio se abre desde Instagram, casi siempre en teléfono: el ancho de
 * referencia es ese, y el de escritorio va como control.
 *
 *   npm run capturas                    # contra http://localhost:4321
 *   npm run capturas -- https://…       # contra cualquier otra dirección
 *
 * Requiere que el sitio esté servido (`npm run preview`).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = (process.argv[2] ?? 'http://localhost:4321').replace(/\/$/, '');
const destino = 'capturas';

const PANTALLAS = [
  { nombre: 'movil', ancho: 390, alto: 844, escala: 3 },
  { nombre: 'escritorio', ancho: 1280, alto: 900, escala: 1 },
];

const RUTAS = [
  { nombre: 'portada', ruta: '/' },
  { nombre: 'producto', ruta: '/producto/blusa-aurora/' },
  { nombre: 'pedido', ruta: '/pedido/' },
];

await mkdir(destino, { recursive: true });

const navegador = await chromium.launch();

for (const pantalla of PANTALLAS) {
  const contexto = await navegador.newContext({
    viewport: { width: pantalla.ancho, height: pantalla.alto },
    deviceScaleFactor: pantalla.escala,
    isMobile: pantalla.nombre === 'movil',
    hasTouch: pantalla.nombre === 'movil',
  });

  const pagina = await contexto.newPage();

  for (const { nombre, ruta } of RUTAS) {
    const respuesta = await pagina.goto(base + ruta, {
      waitUntil: 'networkidle',
    });

    if (!respuesta?.ok()) {
      console.error(`✗ ${ruta} respondió ${respuesta?.status() ?? 'sin nada'}`);
      continue;
    }

    // Las tipografías llegan de Google Fonts; sin esto la captura sale
    // con la fuente de reserva y el logotipo engaña.
    await pagina.evaluate(() => document.fonts.ready);

    const archivo = `${destino}/${pantalla.nombre}-${nombre}.png`;
    await pagina.screenshot({ path: archivo, fullPage: true });
    console.log(`✓ ${archivo}`);
  }

  await contexto.close();
}

await navegador.close();
