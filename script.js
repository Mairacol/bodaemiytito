// ⚠️ REEMPLAZAR con el ID real del Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVfRzCLT80DuFsj12BS25jtEfveVoNNz5tFpKh65GHDu-a0SWrgb9Cx612WEOK-HBcyQ/exec";

const params = new URLSearchParams(window.location.search);
const family = params.get('familia') || '';
const slots = parseInt(params.get('slots')) || 1;

const familyName = document.getElementById('familyName');
const slotsText = document.getElementById('slots');
const guestsDiv = document.getElementById('guests');

// Elementos del selector lindo
const peopleOptions = document.getElementById('peopleOptions');
const hiddenPeopleInput = document.getElementById('peopleCount'); 
const selectedDisplay = document.querySelector('#peopleCountCustom .selected-option');
const submitBtn = document.getElementById('submitBtn');

if (familyName) familyName.innerText = `Familia ${family}`;
if (slotsText) slotsText.innerText = `Hay ${slots} lugares reservados`;

/* =========================================
   1. POBLAR SELECTOR PRINCIPAL (CANTIDAD)
   ========================================= */
if (peopleOptions) {
    for (let i = 1; i <= slots; i++) {
        const divOption = document.createElement('div');
        divOption.classList.add('option');
        divOption.innerText = i + (i === 1 ? ' persona' : ' personas');
        
        divOption.onclick = function(e) {
            e.stopPropagation();
            
            // Actualizar visual y valor oculto
            if (selectedDisplay) selectedDisplay.innerText = this.innerText;
            if (hiddenPeopleInput) hiddenPeopleInput.value = i;
            
            // Cerrar menú
            this.closest('.custom-select').classList.remove('open');
            
            // Disparar la generación de campos de invitados
            generarCamposInvitados(i);
        };
        
        peopleOptions.appendChild(divOption);
    }
}

/* =========================================
   2. GENERAR CAMPOS DE INVITADOS
   ========================================= */
function generarCamposInvitados(cantidad) {
    if (!guestsDiv) return;
    
    // Si la cantidad es 0 o no hay selección, vaciamos y salimos
    if (!cantidad || cantidad < 1) {
        guestsDiv.innerHTML = '';
        return;
    }

    guestsDiv.innerHTML = ''; // Limpiar antes de crear

    for (let i = 1; i <= cantidad; i++) {
        const div = document.createElement('div');
        div.classList.add('guest');
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
            <div class="custom-select-wrapper" style="margin-bottom: 25px;">
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
    
    if (display) display.innerText = element.innerText;
    if (hiddenInput) hiddenInput.value = value;
    
    element.closest('.custom-select').classList.remove('open');
    if (window.event) window.event.stopPropagation();
}

// Cerrar si clickean fuera (Unificado)
window.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
    }
});

/* =========================================
   4. LÓGICA DE MÚSICA
   ========================================= */
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
const svgPath = document.getElementById('svgPath');

const actualizarIcono = () => {
  if (!music || !svgPath) return;
  if (music.paused) {
    svgPath.setAttribute('d', 'M8 5v14l11-7z'); // Icono Play
  } else {
    svgPath.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'); // Icono Pausa
  }
};

const arrancarMusica = () => {
  if (!music) return;
  music.play().then(() => {
    actualizarIcono();
    document.removeEventListener('click', arrancarMusica);
    document.removeEventListener('touchstart', arrancarMusica);
  }).catch(err => console.log("Esperando interacción del usuario..."));
};

document.addEventListener('click', arrancarMusica);
document.addEventListener('touchstart', arrancarMusica);

if (musicBtn) {
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (!music) return;
    if (music.paused) {
      music.play().then(actualizarIcono);
    } else {
      music.pause();
      actualizarIcono();
    }
  });
}

if (music) {
  music.onplay = actualizarIcono;
  music.onpause = actualizarIcono;
}

/* =========================================
   5. INTRO SOBRE
   ========================================= */
window.addEventListener('load', () => {
  const intro = document.getElementById('intro-overlay');
  if (intro) {
    intro.addEventListener('click', () => {
      intro.classList.add('is-open');
      setTimeout(() => {
        intro.classList.add('fade-out');
        document.body.style.overflow = 'auto'; 
        setTimeout(() => {
          intro.style.display = 'none';
        }, 1000);
      }, 2000); 
    });
  }
});

/* =========================================
   6. VALIDACIÓN DEL FORMULARIO
   ========================================= */
function validarFormulario() {
  let valido = true;

  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

  document.querySelectorAll('.guest').forEach((g, i) => {
    const nombre = g.querySelector('.nombre');
    const apellido = g.querySelector('.apellido');
    const asistenteChecked = g.querySelector(`input[name="asiste${i+1}"]:checked`);

    if (nombre && !nombre.value.trim()) {
      nombre.classList.add('field-error');
      valido = false;
    }

    if (apellido && !apellido.value.trim()) {
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
   7. SUBMIT CON COBERTURA TOTAL DE LIMPIEZA
   ========================================= */
if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    const errorMsg = document.getElementById('formError');

    if (!validarFormulario()) {
      if (errorMsg) {
        errorMsg.classList.remove('hidden');
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Por favor completá todos los campos obligatorios y seleccioná si asiste cada persona.';
      }
      return;
    }

    if (errorMsg) {
      errorMsg.classList.add('hidden');
      errorMsg.style.display = 'none';
    }

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
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familia: family, guests: guests })
      });

      // --------------------------------------------------------------------
      // ¡APAGÓN TOTAL DEL FORMULARIO DE CARGA VIEJO!
      // --------------------------------------------------------------------
      submitBtn.style.display = 'none';
      if (familyName) familyName.style.display = 'none';
      if (slotsText) slotsText.style.display = 'none';
      
      const cardContainer = document.querySelector('.rsvp .card');
      const rsvpTitle = document.querySelector('.rsvp .title') || document.querySelector('.title');
      const rsvpLimit = document.querySelector('.rsvp .limit') || document.querySelector('.limit');
      const mainLabel = document.querySelector('.main-title-label') || document.querySelector('.mini-label');
      const mainSelector = document.querySelector('.main-selector');

      if (cardContainer) cardContainer.style.display = 'none';
      if (rsvpTitle) rsvpTitle.style.display = 'none';
      if (rsvpLimit) rsvpLimit.style.display = 'none';
      if (mainLabel) mainLabel.style.display = 'none';
      if (mainSelector) mainSelector.style.display = 'none';

      // Vaciamos y dormimos las tarjetas dinámicas de invitados
      if (guestsDiv) {
        guestsDiv.innerHTML = '';
        guestsDiv.style.display = 'none';
      }

      // REVELAMOS LA PANTALLA DE AGRADECIMIENTO EDITORIAL
      const thanksDiv = document.getElementById('thanks');
      if (thanksDiv) {
          thanksDiv.classList.remove('hidden');
          thanksDiv.style.display = 'flex'; 
          thanksDiv.style.flexDirection = 'column';
          thanksDiv.style.alignItems = 'center';
          thanksDiv.style.justifyContent = 'center';
          thanksDiv.style.minHeight = '420px'; 
      }

      // Estados de reseteo lógico por seguridad
      if (hiddenPeopleInput) hiddenPeopleInput.value = '';
      if (selectedDisplay) selectedDisplay.innerText = 'Seleccionar cantidad...';

    } catch (error) {
      console.error(error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirmar';
      
      if (errorMsg) {
        errorMsg.classList.remove('hidden');
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Hubo un problema al enviar.';
      }
    }
  });
}

/* =========================================
   8. INTERSECTION OBSERVER (REVEAL)
   ========================================= */
const revealOptions = {
  threshold: 0.1, 
  rootMargin: "0px 0px -50px 0px" 
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      requestAnimationFrame(() => {
        entry.target.classList.add('active');
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, revealOptions);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* =========================================
   9. MODAL HOTELES
   ========================================= */
function openModal() {
  const modal = document.getElementById("hotelModal");
  if (modal) modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("hotelModal");
  if (modal) modal.style.display = "none";
}

window.addEventListener('click', function(event) {
  const modal = document.getElementById("hotelModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

window.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

/* ==========================================================================
   10. CONTROL DE VISIBILIDAD RSVP INICIAL (DOMContentLoaded)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const paramsUrl = new URLSearchParams(window.location.search);
    const familiaUrl = paramsUrl.get('familia');
    const slotsUrl = paramsUrl.get('slots');
    
    const rsvpSection = document.getElementById('rsvpSection');
    const thanksDiv = document.getElementById('thanks');

    // 1. Nos aseguramos de entrada que el thanks arranque invisible
    if (thanksDiv) {
        thanksDiv.style.display = 'none';
        thanksDiv.classList.add('hidden');
    }

    // 2. Si la URL tiene los parámetros, hacemos visible la sección del formulario
    if (familiaUrl && slotsUrl) {
        if (rsvpSection) rsvpSection.style.display = "block";
    } else {
        if (rsvpSection) rsvpSection.style.display = "none";
        console.log("Acceso no válido: Falta familia o slots en la URL.");
    }
});