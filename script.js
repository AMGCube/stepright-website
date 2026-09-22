const header = document.querySelector("[data-header]");

const syncHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 18);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxTriggers = document.querySelectorAll("[data-lightbox]");
let lastFocused = null;

const openLightbox = (trigger) => {
  lastFocused = trigger;
  lightboxImage.src = trigger.getAttribute("data-lightbox-src") || "";
  lightboxImage.alt = trigger.getAttribute("data-lightbox-alt") || "";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
};

const closeLightbox = () => {
  if (lightbox.hidden) {
    return;
  }

  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";

  if (lastFocused) {
    lastFocused.focus();
  }
};

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openLightbox(trigger));
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
