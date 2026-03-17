document.addEventListener("DOMContentLoaded", () => {
  // 1. Animaciones AOS
  AOS.init({ duration: 800, once: true });

  // 2. Scroll to Top
  const scrollBtn = document.querySelector("#scrollToTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) scrollBtn.classList.add("show");
    else scrollBtn.classList.remove("show");
  });

  // 3. Manejo de Skeleton Screen (Portfolio)
  const portfolioCards = document.querySelectorAll(".proyecto-card");
  portfolioCards.forEach((card) => {
    const img = card.querySelector("img");

    const markLoaded = () => card.classList.add("loaded");

    if (img.complete) {
      markLoaded();
    } else {
      img.addEventListener("load", markLoaded);
      img.addEventListener("error", markLoaded); // Mostrar aunque falle
      setTimeout(markLoaded, 3000); // Forzar carga tras 3s
    }
  });

  // 4. Formulario Asíncrono
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
          status.innerHTML = "✅ ¡Mensaje enviado!";
          form.reset();
        } else {
          status.innerHTML = "❌ Error al enviar.";
        }
      } catch (error) {
        status.innerHTML = "❌ Error de conexión.";
      }
    });
  }
});

function mostrarProximamente(e) {
  e.preventDefault();
  alert("🚀 ¡GOWS Perfumerie está en desarrollo!");
}

// =========================================
//   RETOQUES INTERACTIVOS (AGREGADOS)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. NAVBAR INTELIGENTE (Transparente arriba, Glassmorphism al bajar)
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 2. EFECTO 3D EN TARJETAS DE PORTFOLIO (Tilt)
  // Verificamos que la librería se haya cargado desde el HTML
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".proyecto-card"), {
      max: 8, // Grados de inclinación máxima
      speed: 400, // Velocidad del efecto
      glare: true, // Activa el efecto de reflejo/brillo
      "max-glare": 0.2, // Opacidad máxima del brillo
    });
  }

  // 3. EFECTO TYPEWRITER (Máquina de escribir en el Hero)
  const sloganElement = document.querySelector(".hero-content .slogan");
  if (sloganElement) {
    // Frases que se van a escribir y borrar
    const words = [
      "Soluciones web que convierten.",
      "Transformo ideas en negocios.",
      "E-commerce y Desarrollo a medida.",
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Limpiamos el texto original estático y añadimos el cursor
    sloganElement.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor"></span>';
    const textSpan = sloganElement.querySelector(".typewriter-text");

    function typeWriter() {
      const currentWord = words[wordIndex];

      // Lógica de borrar o escribir
      if (isDeleting) {
        textSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        textSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      // Velocidad: Escribe a 100ms, borra más rápido a 50ms
      let typeSpeed = isDeleting ? 40 : 80;

      // Si terminó de escribir la palabra entera
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2500; // Pausa larga para que el usuario lea
        isDeleting = true;
      }
      // Si terminó de borrar toda la palabra
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // Pasa a la siguiente palabra
        typeSpeed = 500; // Pausa cortita antes de escribir la nueva
      }

      setTimeout(typeWriter, typeSpeed);
    }

    // Iniciar el efecto un segundo después de cargar la página
    setTimeout(typeWriter, 1000);
  }
});
