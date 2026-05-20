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
// ========================================================
    // MODIFICACIÓN ACÁ: FILTRO ANTI-BOT (HONEYPOT)
    // ========================================================
    const honeypotValue = validationCodeInput ? validationCodeInput.value : '';
    if (honeypotValue.trim() !== '') {
      console.warn("Bot detectado y bloqueado.");
      
      // Ejecutamos exactamente la misma lógica visual de éxito que tenías abajo
      // pero sin hacer el "fetch" a Google Apps Script. El bot cree que ganó, pero no te ensucia la planilla.
      submitBtn.style.display = 'none';
      if (familyName) familyName.style.display = 'none';
      if (slotsText) slotsText.style.display = 'none';
      
      const cardContainer = document.querySelector('.rsvp .card');
      const rsvpTitle = document.querySelector('.rsvp .title') || document.querySelector('.title');
      const rsvpLimit = document.querySelector('.rsvp .limit') || document.querySelector('.limit');
      const mainLabel = document.querySelector('.main-title-label');
      const mainSelector = document.querySelector('.main-selector');

      if (cardContainer) cardContainer.style.display = 'none';
      if (rsvpTitle) rsvpTitle.style.display = 'none';
      if (rsvpLimit) rsvpLimit.style.display = 'none';
      if (mainLabel) mainLabel.style.display = 'none';
      if (mainSelector) mainSelector.style.display = 'none';

      if (guestsDiv) {
        guestsDiv.innerHTML = '';
        guestsDiv.style.display = 'none';
      }

      const thanksDiv = document.getElementById('thanks');
      if (thanksDiv) {
        thanksDiv.classList.remove('hidden');
        thanksDiv.style.display = 'flex'; 
      }
      
      return; // ESTE RETURN ES CLAVE: Corta el código acá para no mandar el POST
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

      submitBtn.style.display = 'none';
      if (familyName) familyName.style.display = 'none';
      if (slotsText) slotsText.style.display = 'none';
      
      const cardContainer = document.querySelector('.rsvp .card');
      const rsvpTitle = document.querySelector('.rsvp .title') || document.querySelector('.title');
      const rsvpLimit = document.querySelector('.rsvp .limit') || document.querySelector('.limit');
      const mainLabel = document.querySelector('.main-title-label');
      const mainSelector = document.querySelector('.main-selector');

      if (cardContainer) cardContainer.style.display = 'none';
      if (rsvpTitle) rsvpTitle.style.display = 'none';
      if (rsvpLimit) rsvpLimit.style.display = 'none';
      if (mainLabel) mainLabel.style.display = 'none';
      if (mainSelector) mainSelector.style.display = 'none';

      if (guestsDiv) {
        guestsDiv.innerHTML = '';
        guestsDiv.style.display = 'none';
      }

      const thanksDiv = document.getElementById('thanks');
      if (thanksDiv) {
          thanksDiv.classList.remove('hidden');
          thanksDiv.style.display = 'flex'; 
      }

    } catch (error) {
      console.error(error);
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
      // Si la sección que cruza es la playlist, cargamos el iframe de Spotify de manera diferida (Lazy)
      if (entry.target.classList.contains('playlist')) {
        const iframe = document.getElementById('spotify-iframe');
        if (iframe && iframe.getAttribute('data-src')) {
          iframe.setAttribute('src', iframe.getAttribute('data-src'));
          iframe.removeAttribute('data-src'); // Evita re-procesamiento
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
   7. MODAL HOTELES & CONTROL INICIAL
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
  if (event.target === modal) modal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    const paramsUrl = new URLSearchParams(window.location.search);
    const familiaUrl = paramsUrl.get('familia');
    const slotsUrl = paramsUrl.get('slots');
    
    const rsvpSection = document.getElementById('rsvpSection');
    const thanksDiv = document.getElementById('thanks');

    if (thanksDiv) {
        thanksDiv.style.display = 'none';
        thanksDiv.classList.add('hidden');
    }

    if (familiaUrl && slotsUrl) {
        if (rsvpSection) rsvpSection.style.display = "block";
    } else {
        if (rsvpSection) rsvpSection.style.display = "none";
    }
});