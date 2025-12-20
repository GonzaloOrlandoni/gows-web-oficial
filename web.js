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
