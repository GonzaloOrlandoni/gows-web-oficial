// =========================================
//  LÓGICA PRINCIPAL (Consolidada)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Inicializar AOS (Animaciones de Scroll) ---
  AOS.init({ duration: 800, once: true });

  // --- 2. Navbar Inteligente (Glassmorphism al bajar) ---
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // --- 2.1 Menú Hamburguesa (Móvil) ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector("#nav-links");
  const navItems = document.querySelectorAll("#nav-links li a");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("show");
    });

    // Cerrar menú al hacer click en una opción
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("show");
      });
    });
  }

  // --- 3. Scroll to Top Botón ---
  const scrollBtn = document.querySelector("#scrollToTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) scrollBtn.classList.add("show");
    else scrollBtn.classList.remove("show");
  });

  // --- 4. Skeleton Screen (Portfolio) ---
  const portfolioCards = document.querySelectorAll(".proyecto-card");
  portfolioCards.forEach((card) => {
    const img = card.querySelector("img");
    const markLoaded = () => card.classList.add("loaded");

    if (img.complete) {
      markLoaded();
    } else {
      img.addEventListener("load", markLoaded);
      img.addEventListener("error", markLoaded);
      setTimeout(markLoaded, 3000);
    }
  });

  // --- 5. Efecto 3D en Tarjetas (VanillaTilt) ---
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".proyecto-card"), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });
  }

  // --- 6. Formulario Asíncrono (Preparado para n8n) ---
  const form = document.querySelector(".contacto-form");
  const status = document.querySelector("#form-status");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Estado de carga (Loading)
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      }
      status.innerHTML = "";

      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          showToast("¡Mensaje enviado con éxito! Te responderé a la brevedad.", "success");
          form.reset();
        } else {
          showToast("Hubo un error al enviar. Intentá nuevamente.", "error");
        }
      } catch (error) {
        showToast("Error de conexión. Verifica tu internet.", "error");
      } finally {
        // Restaurar estado del botón
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Enviar Mensaje";
        }
      }
    });
  }

  // --- 7. Efecto Máquina de Escribir (Hero) ---
  const sloganElement = document.querySelector(".hero-content .slogan");
  if (sloganElement) {
    const words = [
      "Soluciones web que convierten.",
      "Transformo ideas en negocios.",
      "E-commerce y Desarrollo a medida.",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    sloganElement.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor"></span>';
    const textSpan = sloganElement.querySelector(".typewriter-text");

    function typeWriter() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        textSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        textSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }
      setTimeout(typeWriter, typeSpeed);
    }
    setTimeout(typeWriter, 1000);
  }

  // --- 8. Easter Egg para Consola (Reclutadores) ---
  const easterEggStyle1 = "color: #5e3b7d; font-size: 24px; font-weight: bold; font-family: 'Montserrat', sans-serif;";
  const easterEggStyle2 = "color: #a0a0a0; font-size: 14px; font-family: monospace; line-height: 1.5;";
  const easterEggStyle3 =
    "color: #ffffff; background-color: #5e3b7d; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: bold;";

  console.log("%c🚀 ¡Hola, colega dev / reclutador!", easterEggStyle1);
  console.log(
    "%cVeo que te gusta inspeccionar el código (a mí también 👀). \nSi estás buscando un desarrollador frontend que cuide la performance, la estética y los detalles de UI/UX, estás en el lugar correcto.",
    easterEggStyle2,
  );
  console.log("%cEscribime a gowebsolutions4@gmail.com y hablemos de negocios. ☕", easterEggStyle3);
});

// =========================================
//  LÓGICA GLOBAL (Fuera del DOMContentLoaded)
// =========================================

// Sistema de Notificaciones Toast Personalizado
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  // Iconos basados en tipo
  let icon = '<i class="fas fa-info-circle"></i>';
  if (type === "success") icon = '<i class="fas fa-check-circle"></i>';
  if (type === "error") icon = '<i class="fas fa-exclamation-circle"></i>';
  if (type === "tech") icon = '<i class="fas fa-rocket"></i>';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;

  container.appendChild(toast);

  // Animación de entrada
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto-cerrar después de 4 segundos
  const timeout = setTimeout(() => closeToast(toast), 4000);

  // Botón cerrar
  toast.querySelector(".toast-close").addEventListener("click", () => {
    clearTimeout(timeout);
    closeToast(toast);
  });
}

function closeToast(toast) {
  toast.classList.remove("show");
  toast.classList.add("hide");
  toast.addEventListener("transitionend", () => {
    toast.remove();
  });
}

// Proyectos próximamente
function mostrarProximamente(e) {
  e.preventDefault();
  showToast("¡GOWS Perfumerie está actualmente en desarrollo! Estará disponible pronto.", "tech");
}

// Barra de progreso de lectura
const progressBar = document.getElementById("progress-bar");
window.addEventListener("scroll", () => {
  if (progressBar) {
    let scrollTop = window.scrollY;
    let docHeight = document.body.scrollHeight - window.innerHeight;
    let scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  }
});

// Cursor personalizado dinámico
const cursor = document.querySelector(".custom-cursor");
if (cursor) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
  const clickables = document.querySelectorAll("a, button, .proyecto-card, input, textarea");
  clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });
}

// Modo Oscuro (Dark Mode)
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;
const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      localStorage.setItem("theme", "light");
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }
  });
}
