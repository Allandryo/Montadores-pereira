# Plan de Landing Page — Montadores Pereira

Especialistas en parquet, tarima y revestimientos. Palma de Mallorca.
Instagram: https://www.instagram.com/montadorespereira/
TikTok: https://www.tiktok.com/@montadorespereira
Email: montadorespereira@gmail.com

Este documento es la fuente de verdad del proyecto. Toda decisión de diseño o contenido se valida contra este archivo antes de implementarse.

---

## 1. Objetivo de la página

Convertir visitas en leads (WhatsApp o llamada) mostrando la calidad del trabajo mediante imágenes reales de obra. La prioridad #1 es el aparato visual: galería de trabajos y comparador antes/después. Todo lo demás (texto, formularios) es secundario y de apoyo.

## 2. Estructura de secciones (single-page)

1. **Header/Nav** — logo, enlaces ancla (Trabajos, Antes/Después, Servicios, Sobre nosotros, Contacto), botón CTA "WhatsApp" fijo.
2. **Hero** — imagen/video de fondo de una instalación terminada, titular, subtítulo, CTA principal.
3. **Servicios** — tarjetas: parquet, tarima flotante/maciza, vinílicos/SPC, revestimientos exteriores, acuchillado y barnizado (ajustar según lo que realmente ofrezcan — pendiente confirmar listado exacto).
4. **Galería de trabajos** — grid filtrable por tipo de material/estancia, con lightbox.
5. **Antes y Después** — sección con sliders comparativos (ver sección 5 de este documento).
6. **Sobre nosotros** — texto pendiente (ver Pendientes).
7. **Reseñas/Redes** — embebido o enlace destacado a Instagram y TikTok, posibles testimonios.
8. **Zona de servicio / Mapa** — Google Maps con coordenadas (pendiente).
9. **Contacto** — formulario simple + WhatsApp + teléfono + email + métodos de pago (pendiente) + accesibilidad (pendiente).
10. **Footer** — redes sociales, aviso legal, copyright.

## 3. Estructura de archivos propuesta

```
montadores-pereira/
├── index.html
├── plan.md
├── README.md
├── assets/
│   ├── css/
│   │   ├── base.css          # reset, variables (colores, tipografías), utilidades
│   │   ├── layout.css        # grid general, header, footer
│   │   ├── components.css    # tarjetas, botones, slider antes/después, lightbox
│   │   └── responsive.css    # media queries
│   ├── js/
│   │   ├── main.js           # inicialización general, menú móvil
│   │   ├── gallery.js        # filtrado y lightbox de la galería
│   │   ├── before-after.js   # lógica del slider comparador
│   │   └── form.js           # validación/envío del formulario de contacto
│   ├── img/
│   │   ├── work/              # fotos de trabajos terminados, para la galería
│   │   │   ├── parquet/
│   │   │   ├── tarima/
│   │   │   └── revestimientos/
│   │   ├── before-after/      # pares antes/después (ver convención en sección 5)
│   │   │   ├── proyecto-01-antes.jpg
│   │   │   ├── proyecto-01-despues.jpg
│   │   │   ├── proyecto-02-antes.jpg
│   │   │   └── proyecto-02-despues.jpg
│   │   ├── hero/               # imagen(es) de cabecera
│   │   ├── icons/              # iconos SVG de servicios, redes sociales
│   │   └── logo/
│   └── fonts/                  # si se usan tipografías autoalojadas
└── data/
    └── gallery.json            # listado de imágenes con metadatos (ver sección 4)
```

### Qué va en cada carpeta

- **assets/css**: separado por responsabilidad para que sea mantenible. `base.css` define la paleta (tonos madera: marrones, beige, acentos oscuros) y tipografía. `components.css` es donde vive el estilo del slider antes/después y la galería.
- **assets/js**: cada archivo tiene una sola responsabilidad. `gallery.js` no debe tocar el DOM del formulario, y viceversa. Facilita depurar y mantener.
- **assets/img/work**: aquí van las fotos "normales" de trabajos terminados, organizadas en subcarpetas por tipo de material. Esto permite que el filtro de la galería funcione simplemente leyendo la carpeta/categoría.
- **assets/img/before-after**: pareja de imágenes por proyecto, incluyendo `-antes` y `-despues` en el nombre. Ver sección 5 para la convención completa.
- **data/gallery.json**: en vez de hardcodear las imágenes en el HTML, se listan aquí con título, categoría y rutas. Esto permite añadir trabajos nuevos editando solo un JSON, sin tocar el HTML ni el JS.

## 4. Formato de data/gallery.json

```json
{
  "trabajos": [
    {
      "id": "parquet-roble-01",
      "categoria": "parquet",
      "titulo": "Parquet de roble - salón Palma",
      "imagen": "assets/img/work/parquet/parquet-roble-01.jpg"
    }
  ],
  "antesDepues": [
    {
      "id": "proyecto-01",
      "titulo": "Renovación tarima salón",
      "antes": "assets/img/before-after/proyecto-01-antes.jpg",
      "despues": "assets/img/before-after/proyecto-01-despues.jpg"
    }
  ]
}
```

`gallery.js` hace `fetch('data/gallery.json')` y genera el HTML de las tarjetas dinámicamente. Añadir un trabajo nuevo = subir la foto a la carpeta correcta + añadir una línea al JSON. No se toca el HTML.

## 5. Cómo implementar las fotos de antes/después

Recomendación: un **slider de comparación con control deslizante (drag)**, el formato que mejor comunica una reforma y el que más interacción genera (la gente lo arrastra de un lado a otro).

### Convención de nombres de archivo
Cada proyecto es un par de imágenes con el mismo prefijo:
```
proyecto-01-antes.jpg
proyecto-01-despues.jpg
```
Esto evita errores al emparejar fotos y hace que el JSON sea fácil de generar.

### Requisitos técnicos de las fotos
- Misma resolución y misma relación de aspecto entre el "antes" y el "despues" de un mismo par (idealmente tomadas desde el mismo ángulo/altura).
- Recomendado: redimensionar a un ancho fijo (p. ej. 1200px) y comprimir (WebP o JPG calidad ~80) para no penalizar el rendimiento — la página vivirá de imágenes, así que el peso importa mucho.
- Nombrado consistente como se indicó arriba.

### Mecánica del componente (assets/js/before-after.js)
- Estructura: dos imágenes superpuestas en un contenedor con `overflow: hidden`. La imagen "después" se recorta con `clip-path` según la posición de un control deslizante.
- El usuario arrastra (mouse o touch) una barra vertical para revelar más o menos del "antes" / "después".
- Cada bloque antes/después se genera dinámicamente desde `gallery.json`, así que añadir un proyecto nuevo no requiere escribir HTML ni JS adicional — solo añadir las dos imágenes y la entrada en el JSON.
- Alternativa más simple si se prefiere evitar JS de arrastre: mostrar las dos fotos lado a lado con una etiqueta "Antes" / "Después" superpuesta. Es menos vistoso pero cero riesgo de bugs. Se puede usar como fallback en móviles muy antiguos.

## 6. Stack técnico recomendado

HTML + CSS + JavaScript vanilla (sin framework). Justificación: es una landing de una sola página, no necesita el peso de un framework, carga más rápido (importante con tantas imágenes) y es más fácil de entregar/mantener para un cliente sin equipo técnico. Si en el futuro se quiere un panel para que el propio cliente suba fotos sin tocar el JSON a mano, se podría evaluar un CMS headless (p. ej. Decap CMS) más adelante — no es necesario para el lanzamiento inicial.

## 7. Optimización de imágenes (crítico en este proyecto)

- Usar formato WebP con fallback JPG si se quiere máxima compatibilidad.
- `loading="lazy"` en todas las imágenes fuera del viewport inicial.
- Generar miniaturas para el grid de galería (p. ej. 400px de ancho) y cargar la imagen grande solo al abrir el lightbox.
- Comprimir todo antes de subir (herramientas como Squoosh).

## 8. Integración de redes sociales

- Sección dedicada con enlaces directos a Instagram y TikTok (iconos + handle).
- Opcional: embeber los últimos posts de Instagram (requiere o bien el widget oficial de Meta, o un servicio de terceros tipo SnapWidget/EmbedSocial si se quiere automático). Como fallback simple y sin dependencias: una fila de capturas de los posts más recientes, enlazando cada una al post real, actualizada manualmente.

## 9. Pendientes (bloquean contenido, no estructura)

- [ ] Texto de "Sobre nosotros".
- [ ] Confirmar número de WhatsApp.
- [ ] Coordenadas / zona de Google Maps.
- [ ] Métodos de pago aceptados.
- [ ] Detalles de accesibilidad del local/servicio.
- [ ] Listado exacto de servicios/materiales que trabajan (para la sección 3).

## 10. Siguiente paso

Con este plan.md aprobado, el siguiente paso es generar el `index.html` y los archivos base de `assets/`, dejando la galería y el antes/después conectados a `data/gallery.json` para que subir fotos nuevas sea trivial.
