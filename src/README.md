# Montadores Pereira — Landing Page

Landing page para **Montadores Pereira**, especialistas en instalación de parquet, tarimas y revestimientos en Palma de Mallorca.

## Estructura del Proyecto

El proyecto está construido con HTML5, CSS3 y JavaScript vanilla para garantizar un rendimiento óptimo y una carga ultrarrápida.

- `index.html`: Estructura principal de la landing page.
- `assets/css/`: Hojas de estilo divididas por responsabilidad (`base.css`, `layout.css`, `components.css`, `responsive.css`).
- `assets/js/`: Lógica del lado del cliente dividida en módulos (`main.js`, `gallery.js`, `before-after.js`, `form.js`).
- `assets/img/`: Recursos gráficos y fotografías del proyecto (organizados en carpetas por categoría).
- `data/gallery.json`: Base de datos local en formato JSON para administrar dinámicamente las fotos de la galería y la sección de antes y después.

## Ejecución en Local

Al no requerir compilación ni frameworks pesados, la landing page se puede ejecutar directamente abriendo el archivo `index.html` en un navegador web. 

No obstante, debido a las peticiones `fetch()` locales para cargar el archivo `data/gallery.json`, **se recomienda encarecidamente utilizar un servidor local** para evitar problemas de políticas de CORS en algunos navegadores.

### Opciones de Servidor Local:

1. **Extensión Live Server** para Visual Studio Code.
2. **Node.js (npx)**:
   ```bash
   npx live-server
   # o bien
   npx http-server
   ```
3. **Python**:
   ```bash
   python -m http.server 8000
   ```

## Actualización de Trabajos

Para añadir nuevos trabajos a la galería o nuevos bloques de "Antes y Después":
1. Sube las imágenes a sus carpetas correspondientes en `assets/img/`.
2. Registra las imágenes y su categoría en el archivo `data/gallery.json`.
