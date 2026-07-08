/**
 * Gallery JS - Montadores Pereira
 * Dynamic gallery loading, filtering, pagination, and lightbox zoom
 */

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

const ITEMS_PER_PAGE = 12;

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

    // Create pagination container after the grid
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'gallery-pagination';
    paginationContainer.id = 'gallery-pagination';
    galleryGrid.parentNode.insertBefore(paginationContainer, galleryGrid.nextSibling);

    // State object
    const state = {
      allItems: trabajos,
      filteredItems: trabajos,
      currentPage: 1,
      currentFilter: 'all'
    };

    // Initial render
    renderPage(state, galleryGrid, paginationContainer);
    
    // Set up filter buttons event listeners
    setupFilters(state, galleryGrid, filterContainer, paginationContainer);
    
    // Set up lightbox for image zoom
    setupLightbox();

  } catch (error) {
    console.error('Error loading gallery data:', error);
    galleryGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--color-primary-dark);">Error al cargar los trabajos de la galería. Por favor, recarga la página.</p>';
  }
}

/**
 * Renders the current page of items and the pagination controls
 */
function renderPage(state, grid, paginationContainer) {
  const totalPages = Math.ceil(state.filteredItems.length / ITEMS_PER_PAGE);
  const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = state.filteredItems.slice(start, end);

  renderGalleryItems(pageItems, grid);
  renderPagination(state, totalPages, grid, paginationContainer);
}

/**
 * Generates and inserts the HTML for each gallery item
 */
function renderGalleryItems(items, container) {
  container.innerHTML = '';
  
  const categoryLabels = {
    'parquet': 'Parquet',
    'suelo-laminado': 'Suelo Laminado',
    'suelo-vinilico': 'Suelo Vinílico',
    'tarima': 'Tarima',
    'revestimiento': 'Revestimiento de Pared / Fachada',
    'otros': 'Otros'
  };
  
  items.forEach((item, index) => {
    const displayCategory = categoryLabels[item.categoria] || item.categoria;
    const itemEl = document.createElement('div');
    itemEl.className = 'gallery-item';
    itemEl.setAttribute('data-category', item.categoria);
    itemEl.setAttribute('data-src', item.imagen);
    itemEl.setAttribute('data-title', item.titulo);
    itemEl.style.opacity = '0';
    itemEl.style.transform = 'translateY(12px)';

    itemEl.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" loading="lazy">
      <div class="gallery-item-overlay">
        <span class="gallery-item-category">${displayCategory}</span>
        <h4 class="gallery-item-title">${item.titulo}</h4>
      </div>
    `;

    container.appendChild(itemEl);

    // Staggered fade-in animation
    setTimeout(() => {
      itemEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      itemEl.style.opacity = '1';
      itemEl.style.transform = 'translateY(0)';
    }, 40 * index);
  });
}

/**
 * Renders pagination controls
 */
function renderPagination(state, totalPages, grid, container) {
  container.innerHTML = '';

  // Don't show pagination if only 1 page
  if (totalPages <= 1) return;

  // Info text
  const infoText = document.createElement('span');
  infoText.className = 'pagination-info';
  const start = (state.currentPage - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(state.currentPage * ITEMS_PER_PAGE, state.filteredItems.length);
  infoText.textContent = `${start}–${end} de ${state.filteredItems.length}`;

  // Buttons wrapper
  const buttonsWrap = document.createElement('div');
  buttonsWrap.className = 'pagination-buttons';

  // Prev button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-btn pagination-prev';
  prevBtn.innerHTML = '&larr; Anterior';
  prevBtn.disabled = state.currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderPage(state, grid, container);
      scrollToGallery();
    }
  });

  // Number buttons
  const numbersWrap = document.createElement('div');
  numbersWrap.className = 'pagination-numbers';

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'pagination-num' + (i === state.currentPage ? ' active' : '');
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      if (state.currentPage !== i) {
        state.currentPage = i;
        renderPage(state, grid, container);
        scrollToGallery();
      }
    });
    numbersWrap.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn pagination-next';
  nextBtn.innerHTML = 'Siguiente &rarr;';
  nextBtn.disabled = state.currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderPage(state, grid, container);
      scrollToGallery();
    }
  });

  buttonsWrap.appendChild(prevBtn);
  buttonsWrap.appendChild(numbersWrap);
  buttonsWrap.appendChild(nextBtn);

  container.appendChild(infoText);
  container.appendChild(buttonsWrap);
}

/**
 * Scrolls smoothly to the gallery section top
 */
function scrollToGallery() {
  const section = document.getElementById('trabajos');
  if (section) {
    const headerOffset = 100;
    const top = section.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Adds logic for filtering gallery items based on selected category button
 */
function setupFilters(state, grid, filterContainer, paginationContainer) {
  if (!filterContainer) return;

  const buttons = filterContainer.querySelectorAll('.filter-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      // Set active button style
      buttons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');
      state.currentFilter = filterValue;
      state.currentPage = 1;

      if (filterValue === 'all') {
        state.filteredItems = state.allItems;
      } else {
        state.filteredItems = state.allItems.filter(item => item.categoria === filterValue);
      }

      renderPage(state, grid, paginationContainer);
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
