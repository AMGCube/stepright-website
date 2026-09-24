const HERO_SCENES = [
  { code: "802", name: "Spotted Gum", img: "./assets/scene-802.jpg" },
  { code: "805", name: "Blackbutt", img: "./assets/scene-805.jpg" },
  { code: "806", name: "Taupe Oak", img: "./assets/scene-806.jpg" },
  { code: "807", name: "Honey Oak", img: "./assets/scene-807.jpg" },
  { code: "808", name: "Sandy Oak", img: "./assets/scene-808.jpg" },
  { code: "809", name: "Linen Oak", img: "./assets/scene-809.jpg" },
];

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

const heroImage = document.querySelector("[data-hero-image]");
const heroProduct = document.querySelector(".hero-product-block");

if (HERO_SCENES.length && heroImage && heroProduct) {
  let scenes = [...HERO_SCENES];
  let currentIndex = 0;
  let autoplayTimer = null;
  let autoplayActive = true;
  let touchStartX = null;

  const controls = document.createElement("div");
  controls.className = "hero-scene-controls";
  controls.innerHTML = `
    <div class="scene-bar">
      <span class="scene-name" data-scene-name></span>
      <span class="scene-code" data-scene-code></span>
      <span class="scene-rendered">Rendered view</span>
    </div>
    <button class="hero-scene-arrow previous" type="button" data-scene-previous aria-label="Previous scene">‹</button>
    <button class="hero-scene-arrow next" type="button" data-scene-next aria-label="Next scene">›</button>
  `;
  heroProduct.append(controls);

  const sceneName = controls.querySelector("[data-scene-name]");
  const sceneCode = controls.querySelector("[data-scene-code]");
  const previous = controls.querySelector("[data-scene-previous]");
  const next = controls.querySelector("[data-scene-next]");

  const stopAutoplay = () => {
    autoplayActive = false;
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  const startAutoplay = () => {
    if (!autoplayActive || scenes.length < 2) {
      return;
    }

    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => show(currentIndex + 1), 5000);
  };

  const show = (requestedIndex) => {
    if (!scenes.length) {
      return;
    }

    currentIndex = (requestedIndex + scenes.length) % scenes.length;
    const scene = scenes[currentIndex];
    heroImage.classList.add("is-fading");
    heroImage.onload = () => heroImage.classList.remove("is-fading");
    heroImage.onerror = () => {
      scenes = scenes.filter((item) => item !== scene);
      if (!scenes.length) {
        controls.remove();
        heroImage.src = "./assets/hero-spc-flooring.jpg";
        heroImage.alt = "Timber-look hybrid flooring in a living and dining room";
        return;
      }
      show(currentIndex);
    };
    heroImage.src = scene.img;
    heroImage.alt = `${scene.name} hybrid flooring in a room (rendered)`;
    sceneName.textContent = scene.name;
    sceneCode.textContent = `SR${scene.code}`;
    startAutoplay();
  };

  const activateScene = (code) => {
    const index = scenes.findIndex((scene) => scene.code === code);
    if (index < 0) {
      return;
    }
    stopAutoplay();
    show(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  previous.addEventListener("click", () => {
    stopAutoplay();
    show(currentIndex - 1);
  });

  next.addEventListener("click", () => {
    stopAutoplay();
    show(currentIndex + 1);
  });

  heroProduct.addEventListener("mouseenter", () => window.clearInterval(autoplayTimer));
  heroProduct.addEventListener("mouseleave", startAutoplay);
  heroProduct.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  heroProduct.addEventListener("touchend", (event) => {
    if (touchStartX === null) {
      return;
    }
    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) <= 40) {
      return;
    }
    stopAutoplay();
    show(currentIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  document.querySelectorAll(".colour-card").forEach((card) => {
    const code = card.id.replace("sr-", "");
    if (!scenes.some((scene) => scene.code === code)) {
      return;
    }
    const footer = card.querySelector(".card-foot");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "view-room";
    button.textContent = "View in room →";
    button.addEventListener("click", () => activateScene(code));
    footer.append(button);
  });

  show(0);
}
