/**
 * Form JS - Montadores Pereira
 * Validates the contact form and handles simulation of message delivery.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  const messageContainer = document.getElementById('form-message');

  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Reset validations and alert container
    resetErrors();
    if (messageContainer) {
      messageContainer.style.display = 'none';
      messageContainer.className = 'form-message-container';
      messageContainer.textContent = '';
    }

    // Get input values
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    // Perform validation
    let hasErrors = false;

    if (nombre === '') {
      showError('nombre', 'El nombre es obligatorio.');
      hasErrors = true;
    }

    if (email === '') {
      showError('email', 'El correo electrónico es obligatorio.');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      showError('email', 'Por favor, introduce un correo electrónico válido.');
      hasErrors = true;
    }

    if (telefono === '') {
      showError('telefono', 'El número de teléfono es obligatorio.');
      hasErrors = true;
    } else if (!validatePhone(telefono)) {
      showError('telefono', 'Introduce un número de teléfono de contacto válido (mínimo 9 dígitos).');
      hasErrors = true;
    }

    if (mensaje === '') {
      showError('mensaje', 'El mensaje detallando tu consulta es obligatorio.');
      hasErrors = true;
    }

    // Stop execution if form is invalid
    if (hasErrors) return;

    // Show loading state on button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite; margin-right: 8px;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg> Enviando...
    `;

    try {
      // Simulate form submission to server / email service (e.g. Formspree / EmailJS)
      await simulateServerSubmit({ nombre, email, telefono, mensaje });

      // Successful completion
      if (messageContainer) {
        messageContainer.classList.add('success');
        messageContainer.textContent = '¡Tu mensaje ha sido enviado con éxito! Nos pondremos en contacto contigo lo antes posible.';
      }
      form.reset();

    } catch (error) {
      console.error('Error submitting form:', error);
      if (messageContainer) {
        messageContainer.classList.add('error');
        messageContainer.textContent = 'Hubo un problema al enviar tu mensaje. Por favor, vuelve a intentarlo o contáctanos por WhatsApp.';
      }
    } finally {
      // Restore button status
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Validates email format using regex
 */
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validates phone format (numbers and length)
 */
function validatePhone(phone) {
  // Accepts spaces, dashes, + and digits. Checks if has at least 9 digits.
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9;
}

/**
 * Displays error feedback text on the specific form field
 */
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  if (!input) return;

  input.style.borderColor = '#d90429';
  
  // Find or create sibling element for feedback error message
  let feedback = input.nextElementSibling;
  if (!feedback || !feedback.classList.contains('form-feedback')) {
    feedback = document.createElement('span');
    feedback.className = 'form-feedback error';
    input.parentNode.insertBefore(feedback, input.nextSibling);
  }
  
  feedback.textContent = message;
  feedback.classList.add('error');
}

/**
 * Resets all borders and validation warnings
 */
function resetErrors() {
  const controls = document.querySelectorAll('.form-control');
  controls.forEach(control => {
    control.style.borderColor = '';
  });

  const feedbacks = document.querySelectorAll('.form-feedback');
  feedbacks.forEach(feedback => {
    feedback.remove();
  });
}

/**
 * Simulates a delay for an asynchronous API submission
 */
function simulateServerSubmit(data) {
  return new Promise((resolve, reject) => {
    // Simulate networking latency (1.5 seconds)
    setTimeout(() => {
      // 95% success rate simulation
      if (Math.random() > 0.05) {
        resolve({ success: true });
      } else {
        reject(new Error('Simulation failed'));
      }
    }, 1500);
  });
}

// Add simple CSS animation for the loading spin dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
