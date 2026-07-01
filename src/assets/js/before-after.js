/**
 * Before/After Slider JS - Montadores Pereira
 * Renders and handles interaction for the drag-to-reveal image slider comparison
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSliders();
});

async function initBeforeAfterSliders() {
  const container = document.getElementById('before-after-container');
  if (!container) return;

  try {
    const response = await fetch('data/gallery.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const list = data.antesDespues || [];

    if (list.length === 0) {
      container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No hay proyectos de Antes y Después cargados.</p>';
      return;
    }

    renderSliders(list, container);
    bindSliderEvents(container);

  } catch (error) {
    console.error('Error loading before/after sliders:', error);
    container.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--color-primary-dark);">Error al cargar la comparación de Antes y Después.</p>';
  }
}

/**
 * Renders HTML templates for each comparison project inside the container
 */
function renderSliders(projects, container) {
  container.innerHTML = '';
  
  projects.forEach(project => {
    const projectHTML = `
      <div class="ba-slider-wrapper" data-id="${project.id}">
        <h3 class="ba-slider-title">${project.titulo}</h3>
        <div class="ba-slider">
          <!-- Before image (underneath) -->
          <img class="ba-image ba-image-before" src="${project.antes}" alt="Antes - ${project.titulo}">
          <span class="ba-label ba-label-before">Antes</span>
          
          <!-- After image (clipped overlay) -->
          <img class="ba-image ba-image-after" src="${project.despues}" alt="Después - ${project.titulo}">
          <span class="ba-label ba-label-after">Después</span>
          
          <!-- Sliding handle bar -->
          <div class="ba-handle">
            <div class="ba-handle-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18-6-6 6-6M15 6l6 6-6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', projectHTML);
  });
}

/**
 * Attaches drag and interaction events to all initialized sliders
 */
function bindSliderEvents(container) {
  const sliders = container.querySelectorAll('.ba-slider');

  sliders.forEach(slider => {
    const afterImage = slider.querySelector('.ba-image-after');
    const handle = slider.querySelector('.ba-handle');
    
    if (!afterImage || !handle) return;

    let isDragging = false;

    // Helper function to update clipping mask and handle position
    const updatePosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let x = clientX - rect.left;

      // Bound within the slider boundaries
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      
      // Update handle position
      handle.style.left = `${percentage}%`;
      // Update clip-path of afterImage (showing left side)
      afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    // --- Mouse Events ---
    const onMouseDown = (e) => {
      isDragging = true;
      slider.classList.add('dragging');
      updatePosition(e.clientX);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const onMouseUp = () => {
      isDragging = false;
      slider.classList.remove('dragging');
    };

    // --- Touch Events (Mobile) ---
    const onTouchStart = (e) => {
      isDragging = true;
      updatePosition(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    // Bind slider container events (clicks and drag over the container)
    slider.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    slider.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
  });
}
