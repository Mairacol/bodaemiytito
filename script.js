const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVfRzCLT80DuFsj12BS25jtEfveVoNNz5tFpKh65GHDu-a0SWrgb9Cx612WEOK-HBcyQ/exec";

const params = new URLSearchParams(window.location.search);
const family = params.get('familia') || '';
const slots = parseInt(params.get('slots')) || 1;

const familyName = document.getElementById('familyName');
const slotsText = document.getElementById('slots');
const guestsDiv = document.getElementById('guests');

const peopleOptions = document.getElementById('peopleOptions');
const hiddenPeopleInput = document.getElementById('peopleCount'); 
const selectedDisplay = document.querySelector('#peopleCountCustom .selected-option');
const submitBtn = document.getElementById('submitBtn');
const validationCodeInput = document.getElementById('validationCode');
if (familyName) familyName.innerText = `Familia ${family}`;
if (slotsText) slotsText.innerText = `Hay ${slots} lugares reservados`;

/* =========================================
   1. POBLAR SELECTOR PRINCIPAL 
   ========================================= */
if (peopleOptions) {
    for (let i = 1; i <= slots; i++) {
        const divOption = document.createElement('div');
        divOption.classList.add('option');
        divOption.innerText = i + (i === 1 ? ' persona' : ' personas');
        
        divOption.onclick = function(e) {
            e.stopPropagation();
            if (selectedDisplay) selectedDisplay.innerText = this.innerText;
            if (hiddenPeopleInput) hiddenPeopleInput.value = i;
            this.closest('.custom-select').classList.remove('open');
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
    if (!cantidad || cantidad < 1) {
        guestsDiv.innerHTML = '';
        return;
    }
    guestsDiv.innerHTML = ''; 

    for (let i = 1; i <= cantidad; i++) {
        const div = document.createElement('div');
        div.classList.add('guest', 'reveal', 'active'); 

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

window.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
    }
});

/* =========================================
   3. LÓGICA DE MÚSICA
   ========================================= */
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
const svgPath = document.getElementById('svgPath');

const actualizarIcono = () => {
  if (!music || !svgPath) return;
  if (music.paused) {
    svgPath.setAttribute('d', 'M8 5v14l11-7z'); 
  } else {
    svgPath.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'); 
  }
};

const arrancarMusica = () => {
  if (!music) return;
  music.play().then(() => {
    actualizarIcono();
    document.removeEventListener('click', arrancarMusica);
    document.removeEventListener('touchstart', arrancarMusica);
  }).catch(() => {});
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

/* =========================================
   4. INTRO SOBRE
   ========================================= */
window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro-overlay');
  if (intro) {
    intro.addEventListener('click', () => {
      intro.classList.add('is-open');
      setTimeout(() => {
        intro.classList.add('fade-out');
        document.body.style.overflow = 'auto'; 
        setTimeout(() => {
          intro.style.display = 'none';
        }, 800);
      }, 1800); 
    });
  }
});

/* =========================================
   5. VALIDACIÓN & SUBMIT
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
    if (!asistenteChecked) valido = false;
  });
  return valido;
}

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

    // Lógica para limpiar la pantalla de fondo de manera unificada
    const limpiarInterfazRsvp = () => {
      const rsvpInner = document.querySelector('.rsvp-inner');
      if (rsvpInner) {
        rsvpInner.innerHTML = `
          <div style="text-align: center; padding: 50px 20px; animation: fadeIn 0.5s ease-in-out;">
            <h3 style="font-family: 'Old Bridges', sans-serif; color: #b23b57; font-size: 34px; margin-bottom: 10px;">
              Asistencia Confirmada
            </h3>
            <p style="color: #666; font-size: 14px;">¡Tu respuesta fue guardada con éxito!</p>
          </div>
        `;
      }
    };

    // ========================================================
    // FILTRO ANTI-BOT (HONEYPOT) - ACCIÓN DE ÉXITO FALSA
    // ========================================================
    const honeypotValue = validationCodeInput ? validationCodeInput.value : '';
    if (honeypotValue.trim() !== '') {
      console.warn("Bot detectado y bloqueado.");
      
      limpiarInterfazRsvp();
      openThanksModal();
      return; 
    }
    // ========================================================

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

      // Eliminamos el formulario e "Enviando..." y abrimos el Modal de Gracias encima
      limpiarInterfazRsvp();
      openThanksModal();

    } catch (error) {
      console.error(error);
      alert('Hubo un error de red. Por favor, intentalo de nuevo.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirmar';
    }
  });
}

/* =========================================
   6. INTERSECTION OBSERVER OPTIMIZADO
   ========================================= */
const revealOptions = {
  threshold: 0.05, 
  rootMargin: "0px 0px -20px 0px" 
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('playlist')) {
        const iframe = document.getElementById('spotify-iframe');
        if (iframe && iframe.getAttribute('data-src')) {
          iframe.setAttribute('src', iframe.getAttribute('data-src'));
          iframe.removeAttribute('data-src'); 
        }
      }
      
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
   7. MODAL HOTELES & MODAL GRACIAS (CORREGIDO)
   ========================================= */
function openModal() {
  const modal = document.getElementById("hotelModal");
  if (modal) modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("hotelModal");
  if (modal) modal.style.display = "none";
}

// Funciones exclusivas para el nuevo Modal de Gracias (Evita conflictos)
function openThanksModal() {
  const thanksModal = document.getElementById('thanksModal');
  if (thanksModal) thanksModal.classList.remove('hidden');
}

function closeThanksModal() {
  const thanksModal = document.getElementById('thanksModal');
  if (thanksModal) thanksModal.classList.add('hidden');
}

// Escuchador global de clicks modificado para ambos modales
window.addEventListener('click', function(event) {
  const hotelModal = document.getElementById("hotelModal");
  const thanksModal = document.getElementById("thanksModal");
  
  if (event.target === hotelModal) {
    hotelModal.style.display = "none";
  }
  if (event.target === thanksModal) {
    thanksModal.classList.add('hidden');
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const paramsUrl = new URLSearchParams(window.location.search);
    const familiaUrl = paramsUrl.get('familia');
    const slotsUrl = paramsUrl.get('slots');
    
    const rsvpSection = document.getElementById('rsvpSection');

    if (familiaUrl && slotsUrl) {
        if (rsvpSection) rsvpSection.style.display = "block";
    } else {
        if (rsvpSection) rsvpSection.style.display = "none";
    }
});