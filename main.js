document.addEventListener("DOMContentLoaded", () => {
  /* --- Menu mobile --- */
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  /* --- Lightbox (phóng to ảnh) --- */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `<button class="lightbox-close" aria-label="Đóng">✕</button><img alt="">`;
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector("img");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // Gắn lightbox cho bất kỳ phần tử nào có [data-lightbox="url-anh-lon"]
  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", () => openLightbox(el.dataset.lightbox, el.dataset.label || ""));
  });
});
