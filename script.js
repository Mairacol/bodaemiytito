// ⚠️ REEMPLAZAR con el ID real del Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJLD2SW9nusTjYvMLK5Wc1dJFudeVSY1b6Gwi_3A7cCvEi6v6n3kNHfBO0v5r1zsxv9w/exec";

const params = new URLSearchParams(window.location.search);
const family = params.get('familia') || '';
const slots = parseInt(params.get('slots')) || 1;

const familyName = document.getElementById('familyName');
const slotsText = document.getElementById('slots');
const guestsDiv = document.getElementById('guests');

// Elementos del selector lindo
const peopleOptions = document.getElementById('peopleOptions');
const hiddenPeopleInput = document.getElementById('peopleCount'); // Este es tu nuevo peopleSelect
const selectedDisplay = document.querySelector('#peopleCountCustom .selected-option');

familyName.innerText = `Familia ${family}`;
slotsText.innerText = `Hay ${slots} lugares reservados`;

/* =========================================
   1. POBLAR SELECTOR PRINCIPAL (CANTIDAD)
   ========================================= */
for (let i = 1; i <= slots; i++) {
    const divOption = document.createElement('div');
    divOption.classList.add('option');
    divOption.innerText = i + (i === 1 ? ' persona' : ' personas');
    
    divOption.onclick = function(e) {
        e.stopPropagation();
        
        // Actualizar visual y valor oculto
        selectedDisplay.innerText = this.innerText;
        hiddenPeopleInput.value = i;
        
        // Cerrar menú
        this.closest('.custom-select').classList.remove('open');
        
        // AQUÍ DISPARAMOS LA GENERACIÓN: ahora sí aparecerán los campos
        generarCamposInvitados(i);
    };
    
    peopleOptions.appendChild(divOption);
}

/* =========================================
   2. GENERAR CAMPOS DE INVITADOS
   ========================================= */
function generarCamposInvitados(cantidad) {
    // Si la cantidad es 0 o no hay selección, no hacemos nada
    if (!cantidad || cantidad < 1) {
        guestsDiv.innerHTML = '';
        return;
    }

    guestsDiv.innerHTML = ''; // Limpiar antes de crear

    for (let i = 1; i <= cantidad; i++) {
        const div = document.createElement('div');
        div.classList.add('guest');
        // Agregamos una clase de animación para que aparezcan suavemente
        div.classList.add('reveal', 'active'); 

        div.innerHTML = `
            <h4>Invitado ${i}</h4>
            <input class="nombre" placeholder="Nombre *" required>
            <input class="apellido" placeholder="Apellido *" required>

            <label class="mini-label">¿Asiste?</label>
            <div class="radio-group">
                <label><input type="radio" name="asiste${i}" value="Si"> Sí</label>
                <label><input type="radio" name="asiste${i}" value="No"> No</label>
            </div>

            <label class="mini-label">Preferencia de menú</label>
            <div class="custom-select-wrapper">
                <div class="custom-select" onclick="toggleSelect(this)">
                    <span class="selected-option">Menú estándar</span>
                    <div class="custom-options">
                        <div class="option" onclick="selectOption(this, 'Ninguno')">Menú estándar</div>
                        <div class="option" onclick="selectOption(this, 'Celiaco')">Celíaco / Sin TACC</div>
                        <div class="option" onclick="selectOption(this, 'Vegetariano')">Vegetariano</div>
                        <div class="option" onclick="selectOption(this, 'Vegano')">Vegano</div>
                    </div>
                </div>
                <input type="hidden" class="comida" value="Ninguno">
            </div>

            <textarea class="mensaje" placeholder="Mensaje (opcional)"></textarea>
        `;
        guestsDiv.appendChild(div);
    }
}

// IMPORTANTE: Borra la línea que decía generarCamposInvitados(1);
// Al no llamarla aquí, el div #guests empezará vacío.
/* =========================================
   3. FUNCIONES DE CONTROL (SELECTS LINDOS)
   ========================================= */
function toggleSelect(element) {
    document.querySelectorAll('.custom-select').forEach(s => {
        if (s !== element) s.classList.remove('open');
    });
    element.classList.toggle('open');
}

function selectOption(element, value) {
    const wrapper = element.closest('.custom-select-wrapper');
    const display = wrapper.querySelector('.selected-option');
    const hiddenInput = wrapper.querySelector('.comida');
    
    display.innerText = element.innerText;
    hiddenInput.value = value;
    
    element.closest('.custom-select').classList.remove('open');
    if (window.event) window.event.stopPropagation();
}

// Cerrar si clickean fuera (Unificado)
window.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
    }
});
// ... (Aquí sigue tu código de Música, Intro, Validación y Confirmación)
/* =========================================
   MÚSICA
   ========================================= */
const music = document.getElementById('music');
const btn = document.getElementById('musicBtn');

const actualizarIcono = () => {
  btn.textContent = music.paused ? '♫' : '⏸';
};

// Intentar reproducir al primer toque del usuario
const intentarReproducir = () => {
  music.play()
    .then(() => {
      actualizarIcono();
      document.removeEventListener('click', intentarReproducir);
      document.removeEventListener('touchstart', intentarReproducir);
    })
    .catch(() => {
      console.log("El navegador bloqueó el inicio automático.");
    });
};

btn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (music.paused) {
    music.play().then(actualizarIcono);
  } else {
    music.pause();
    actualizarIcono();
  }
});

document.addEventListener('click', intentarReproducir);
document.addEventListener('touchstart', intentarReproducir);

music.onplay  = actualizarIcono;
music.onpause = actualizarIcono;

/* =========================================
   INTRO SOBRE
   ========================================= */
window.addEventListener('load', () => {
  const intro = document.getElementById('intro-overlay');

  setTimeout(() => {
    intro.classList.add('is-open');
  }, 800);

  setTimeout(() => {
    intro.classList.add('fade-out');
    document.body.style.overflow = 'auto';
  }, 3500);
});

/* =========================================
   VALIDACIÓN DEL FORMULARIO
   ========================================= */
function validarFormulario() {
  let valido = true;

  // Limpiar errores previos
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

  document.querySelectorAll('.guest').forEach((g, i) => {
    const nombre = g.querySelector('.nombre');
    const apellido = g.querySelector('.apellido');
    const asistenteChecked = g.querySelector(`input[name="asiste${i+1}"]:checked`);

    if (!nombre.value.trim()) {
      nombre.classList.add('field-error');
      valido = false;
    }

    if (!apellido.value.trim()) {
      apellido.classList.add('field-error');
      valido = false;
    }

    if (!asistenteChecked) {
      valido = false;
    }
  });

  return valido;
}

/* =========================================
   SUBMIT CON VALIDACIÓN Y MANEJO DE ERRORES
   ========================================= */
document.getElementById('submitBtn').addEventListener('click', async () => {
  const errorMsg = document.getElementById('formError');

  // Validar antes de enviar
  if (!validarFormulario()) {
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = 'Por favor completá todos los campos obligatorios y seleccioná si asiste cada persona.';
    return;
  }

  errorMsg.classList.add('hidden');

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const guests = [];

  document.querySelectorAll('.guest').forEach((g, i) => {
    guests.push({
      nombre:   g.querySelector('.nombre').value.trim(),
      apellido: g.querySelector('.apellido').value.trim(),
      asiste:   g.querySelector(`input[name="asiste${i+1}"]:checked`)?.value || '',
      comida:   g.querySelector('.comida').value,
      mensaje:  g.querySelector('.mensaje').value.trim()
    });
  });

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ familia: family, guests: guests })
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    // Éxito: mostrar mensaje de gracias
    submitBtn.style.display = 'none';
    document.getElementById('thanks').classList.remove('hidden');

    // Limpiar el formulario sin regenerarlo (no llamar dispatchEvent aquí)
    guestsDiv.innerHTML = '';
    peopleSelect.value = '1';

  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirmar';
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = 'Hubo un problema al enviar. Por favor intentá de nuevo.';
  }
});

/* =========================================
   INTERSECTION OBSERVER (REVEAL)
   ========================================= */
const revealOptions = {
  threshold: 0.1, // Se activa cuando asoma el 10%
  rootMargin: "0px 0px -50px 0px" // Evita que se dispare muy al borde del scroll
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Usamos requestAnimationFrame para que la animación entre 
      // en el siguiente ciclo de dibujo del navegador y no se trabe
      requestAnimationFrame(() => {
        entry.target.classList.add('active');
      });
      // Dejamos de observar para que no se repita y no consuma recursos
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOptions);

// Aplicar a todos los elementos con la clase reveal
document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* =========================================
   MODAL HOTELES
   ========================================= */
function openModal() {
  document.getElementById("hotelModal").style.display = "block";
}

function closeModal() {
  document.getElementById("hotelModal").style.display = "none";
}

window.addEventListener('click', function(event) {
  const modal = document.getElementById("hotelModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Cerrar modal con tecla Escape
window.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});
function toggleSelect(element) {
    document.querySelectorAll('.custom-select').forEach(s => {
        if (s !== element) s.classList.remove('open');
    });
    element.classList.toggle('open');
}

function selectOption(element, value) {
    const wrapper = element.closest('.custom-select-wrapper');
    wrapper.querySelector('.selected-option').innerText = element.innerText;
    wrapper.querySelector('.comida').value = value;
    element.closest('.custom-select').classList.remove('open');
    if (window.event) window.event.stopPropagation();
}

// Cerrar si clickean fuera
window.onclick = function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
    }
}

