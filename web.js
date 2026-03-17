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
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.innerHTML = "Enviando...";
      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          status.innerHTML = "✅ ¡Mensaje enviado con éxito!";
          form.reset();
        } else {
          status.innerHTML = "❌ Hubo un error al enviar. Intentá nuevamente.";
        }
      } catch (error) {
        status.innerHTML = "❌ Error de conexión.";
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

// Proyectos próximamente
function mostrarProximamente(e) {
  e.preventDefault();
  alert("🚀 ¡GOWS Perfumerie está en desarrollo!");
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
