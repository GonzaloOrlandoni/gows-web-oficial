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
    VanillaTilt.init(document.querySelectorAll(".servicio-item, .proceso-paso, .porquemi-card"), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      scale: 1.03
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

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
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
  const sloganElement = document.querySelector(".hero-content .hero-sub");
  if (sloganElement) {
    const originalText = "Si tu web no te genera clientes, no es un problema de suerte. Es un problema de sistema — y lo resolvemos.";
    sloganElement.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
    const textSpan = sloganElement.querySelector(".typewriter-text");
    
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
      if (isDeleting) {
        textSpan.textContent = originalText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        textSpan.textContent = originalText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 20 : 40;

      if (!isDeleting && charIndex === originalText.length) {
        typeSpeed = 4000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typeSpeed = 1000;
      }
      setTimeout(typeWriter, typeSpeed);
    }
    setTimeout(typeWriter, 1000);
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

  // --- 12. Lógica del Carrusel de Portfolio ---
  const carouselContainer = document.querySelector(".carousel-container");
  const track = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");

  if (track && prevBtn && nextBtn && carouselContainer) {
    let currentIndex = 0;
    let autoPlayInterval;

    const updateCarousel = () => {
      const items = track.querySelectorAll(".carousel-item");
      if (items.length === 0) return;

      const itemWidth = items[0].offsetWidth + 24;
      const containerWidth = track.parentElement.offsetWidth;
      const visibleItems = Math.floor(containerWidth / itemWidth) || 1;
      const maxIndex = Math.max(0, items.length - visibleItems);

      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

      prevBtn.classList.toggle("disabled", currentIndex === 0);
      nextBtn.classList.toggle("disabled", currentIndex >= maxIndex);
    };

    const goNext = () => {
      const items = track.querySelectorAll(".carousel-item");
      const itemWidth = items[0].offsetWidth + 24;
      const containerWidth = track.parentElement.offsetWidth;
      const visibleItems = Math.floor(containerWidth / itemWidth) || 1;
      const maxIndex = Math.max(0, items.length - visibleItems);

      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // Loop al inicio para que el autoplay sea continuo
      }
      updateCarousel();
    };

    nextBtn.addEventListener("click", () => {
      goNext();
      // Resetea el temporizador si el usuario interactúa manualmente
      stopAutoPlay();
      startAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
      stopAutoPlay();
      startAutoPlay();
    });

    window.addEventListener("resize", updateCarousel);
    setTimeout(updateCarousel, 500);

    // Auto-Play Híbrido: Gira solo pero se pausa al pasar el mouse
    const startAutoPlay = () => {
      stopAutoPlay(); // Evita múltiples intervalos
      autoPlayInterval = setInterval(goNext, 4000);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };

    carouselContainer.addEventListener("mouseenter", stopAutoPlay);
    carouselContainer.addEventListener("mouseleave", startAutoPlay);
    carouselContainer.addEventListener("touchstart", stopAutoPlay, { passive: true });
    carouselContainer.addEventListener("touchend", startAutoPlay, { passive: true });

    startAutoPlay();
  }
});

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

// --- A4. Honeypot Anti-Spam (Formulario) ---
(function initHoneypot() {
  const form = document.querySelector(".contacto-form");
  if (!form) return;

  form.addEventListener(
    "submit",
    (e) => {
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
    },
    true,
  ); // Captura: se ejecuta ANTES del handler del formulario
})();

// --- SISTEMA DE NOTIFICACIONES PREMIUM (TOAST) ---
window.showToast = function (message, type = "success") {
  const toast = document.createElement("div");
  toast.textContent = message;

  // Estilos premium
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.right = "30px";
  toast.style.padding = "16px 28px";
  toast.style.borderRadius = "12px";
  toast.style.color = "white";
  toast.style.fontFamily = "Outfit, sans-serif";
  toast.style.fontWeight = "500";
  toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
  toast.style.zIndex = "99999";
  toast.style.transition = "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
  toast.style.transform = "translateY(100px)";
  toast.style.opacity = "0";

  // Colores según el tipo
  if (type === "success") {
    toast.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    toast.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px;"></i> ${message}`;
  } else {
    toast.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
    toast.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i> ${message}`;
  }

  document.body.appendChild(toast);

  // Animación de entrada
  setTimeout(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  }, 100);

  // Animación de salida y destrucción
  setTimeout(() => {
    toast.style.transform = "translateY(100px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};
