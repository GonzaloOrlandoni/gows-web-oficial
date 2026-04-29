// =========================================
//  LÓGICA PRINCIPAL (Consolidada)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Inicializar AOS (Animaciones de Scroll) ---
  AOS.init({ duration: 800, once: true });

  // --- 2. Elementos del DOM ---
  const navbar = document.getElementById("navbar");
  const scrollBtn = document.querySelector("#scrollToTopBtn");
  const progressBar = document.getElementById("progress-bar");

  // --- 3. Scroll Unificado con requestAnimationFrame (Optimización) ---
  let isScrolling = false;
  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Navbar
        if (navbar) {
          if (scrollY > 50) navbar.classList.add("scrolled");
          else navbar.classList.remove("scrolled");
        }

        // Scroll To Top
        if (scrollBtn) {
          if (scrollY > 400) scrollBtn.classList.add("show");
          else scrollBtn.classList.remove("show");
        }

        // Progress Bar
        if (progressBar) {
          let docHeight = document.body.scrollHeight - window.innerHeight;
          let scrollPercent = (scrollY / docHeight) * 100;
          progressBar.style.width = scrollPercent + "%";
        }

        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // --- 4. Menú Hamburguesa (Móvil) ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector("#nav-links");
  const navItems = document.querySelectorAll("#nav-links li a");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("show");
      const isExpanded = hamburger.classList.contains("active");
      hamburger.setAttribute("aria-expanded", isExpanded);
    });

    // Cerrar menú al hacer click en una opción
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("show");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- 5. Skeleton Screen (Portfolio) ---
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

  // --- 6. Efecto 3D en Tarjetas (VanillaTilt) ---
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".proyecto-card"), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });
  }

  // --- 7. Formulario Asíncrono ---
  const form = document.querySelector(".contacto-form");
  const status = document.querySelector("#form-status");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      }
      if (status) status.innerHTML = "";

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
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Enviar Mensaje";
        }
      }
    });
  }

  // --- 8. Efecto Máquina de Escribir (Hero) ---
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

  // --- 9. Cursor personalizado dinámico ---
  const cursor = document.querySelector(".custom-cursor");
  // Verificar si es un dispositivo touch para desactivarlo por completo
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (cursor && !isTouchDevice) {
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

  // --- 10. Modo Oscuro (Dark Mode) ---
  const themeBtn = document.getElementById("theme-toggle");
  const body = document.body;
  const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
    if (themeBtn) themeBtn.setAttribute("aria-label", "Cambiar a modo claro");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeIcon.classList.replace("fa-moon", "fa-sun");
        themeBtn.setAttribute("aria-label", "Cambiar a modo claro");
      } else {
        localStorage.setItem("theme", "light");
        themeIcon.classList.replace("fa-sun", "fa-moon");
        themeBtn.setAttribute("aria-label", "Cambiar a modo oscuro");
      }
    });
  }

  // --- 11. Easter Egg para Consola (Reclutadores) ---
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
    <div class="toast-message"></div>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;

  // Evitar XSS inyectando el texto como textContent
  toast.querySelector(".toast-message").textContent = message;

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
// Exponer globalmente para que sea accesible desde onclick en HTML
window.showToast = showToast;

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
window.mostrarProximamente = mostrarProximamente;

// =========================================
//  AUTOMATIZACIONES
// =========================================

// --- A1. Active Nav Link (Intersection Observer) ---
(function initActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("#nav-links a[href^='#']");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("nav-active");
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.classList.add("nav-active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
})();

// --- A2. Portfolio Filter ---
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".proyecto-card");

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Actualizar estado activo de botones
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const tech = card.dataset.tech || "";
        if (filter === "all" || tech === filter) {
          card.classList.remove("hidden-card");
        } else {
          card.classList.add("hidden-card");
        }
      });
    });
  });
})();

// --- A3. Contador de Visitas + Toast de Bienvenida personalizado ---
(function initVisitCounter() {
  const VISIT_KEY = "gows_visit_count";
  const visits = parseInt(localStorage.getItem(VISIT_KEY) || "0", 10) + 1;
  localStorage.setItem(VISIT_KEY, visits);

  // Delay para no solaparse con la animación de entrada
  setTimeout(() => {
    if (visits === 1) {
      showToast("¡Bienvenido a GO Web Solutions! 👋", "info");
    } else if (visits % 5 === 0) {
      showToast(`¡Qué bueno verte de vuelta! Ya son ${visits} visitas. 🚀`, "tech");
    }
  }, 2000);
})();

// --- A4. Honeypot Anti-Spam (Formulario) ---
(function initHoneypot() {
  const form = document.querySelector(".contacto-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== "") {
      // Es un bot: cancelar y simular éxito silenciosamente
      e.stopImmediatePropagation();
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        setTimeout(() => {
          showToast("¡Mensaje enviado con éxito! Te responderé a la brevedad.", "success");
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Enviar Mensaje";
        }, 1500);
      }
    }
  }, true); // Captura: se ejecuta ANTES del handler del formulario
})();

