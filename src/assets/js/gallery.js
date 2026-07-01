/**
 * Gallery JS - Montadores Pereira
 * Dynamic gallery loading, filtering, and lightbox zoom
 */

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

async function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  const filterContainer = document.getElementById('gallery-filters');
  
  if (!galleryGrid) return;

  try {
    const response = await fetch('data/gallery.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const trabajos = data.trabajos || [];

    if (trabajos.length === 0) {
      galleryGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No hay imágenes cargadas en la galería.</p>';
      return;
    }

    // Render all gallery items
    renderGalleryItems(trabajos, galleryGrid);
    
    // Set up filter buttons event listeners
    setupFilters(trabajos, galleryGrid, filterContainer);
    
    // Set up lightbox for image zoom
    setupLightbox();

  } catch (error) {
    console.error('Error loading gallery data:', error);
    galleryGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--color-primary-dark);">Error al cargar los trabajos de la galería. Por favor, recarga la página.</p>';
  }
}

/**
 * Generates and inserts the HTML for each gallery item
 */
function renderGalleryItems(items, container) {
  container.innerHTML = '';
  
  items.forEach(item => {
    const itemHTML = `
      <div class="gallery-item" data-category="${item.categoria}" data-src="${item.imagen}" data-title="${item.titulo}">
        <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
        <div class="gallery-item-overlay">
          <span class="gallery-item-category">${item.categoria}</span>
          <h4 class="gallery-item-title">${item.titulo}</h4>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', itemHTML);
  });
}

/**
 * Adds logic for filtering gallery items based on selected category button
 */
function setupFilters(items, grid, filterContainer) {
  if (!filterContainer) return;

  const buttons = filterContainer.querySelectorAll('.filter-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      // Set active button style
      buttons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');
      const galleryItems = grid.querySelectorAll('.gallery-item');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Force a tiny reflow for opacity transition if needed
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300); // Matches base.css transition speed
        }
      });
    });
  });
}

/**
 * Sets up the Lightbox modal triggers and logic
 */
function setupLightbox() {
  // Create lightbox markup dynamically if it doesn't exist
  let lightbox = document.getElementById('lightbox');
  
  if (!lightbox) {
    const lightboxMarkup = `
      <div id="lightbox" class="lightbox" role="dialog" aria-modal="true">
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Cerrar">&times;</button>
          <img id="lightbox-img" class="lightbox-img" src="" alt="">
          <p id="lightbox-caption" class="lightbox-caption"></p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxMarkup);
    lightbox = document.getElementById('lightbox');
  }

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // Event delegation for gallery items
  document.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item');
    if (galleryItem) {
      const src = galleryItem.getAttribute('data-src');
      const title = galleryItem.getAttribute('data-title');
      
      if (src && lightboxImg && lightboxCaption) {
        lightboxImg.src = src;
        lightboxImg.alt = title || '';
        lightboxCaption.textContent = title || '';
        lightbox.classList.add('open');
        document.body.classList.add('no-scroll');
      }
    }
  });

  // Close actions
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
    }, 300);
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}
