const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const quoteForm = document.querySelector("[data-quote-form]");
const formNote = document.querySelector("[data-form-note]");
const year = document.querySelector("[data-year]");
const filterButtons = document.querySelectorAll("[data-filter]");
const collectionCards = document.querySelectorAll("[data-category]");
const galleryModal = document.querySelector("[data-gallery-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalIcon = document.querySelector("[data-modal-icon]");
const modalKicker = document.querySelector("[data-modal-kicker]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalCopy = document.querySelector("[data-modal-copy]");

if (window.lucide) {
  window.lucide.createIcons();
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    collectionCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const show = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !show);
    });
  });
});

function closeGallery() {
  if (!galleryModal) return;
  galleryModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function openGallery(card) {
  if (!galleryModal || !modalImage || !modalIcon || !modalKicker || !modalTitle || !modalCopy) return;

  const image = card.querySelector("img");
  const kicker = card.querySelector("span")?.textContent || "Collection";
  const title = card.querySelector("h3")?.textContent || "Product preview";
  const copy = card.querySelector("p")?.textContent || "";

  modalKicker.textContent = kicker;
  modalTitle.textContent = title;
  modalCopy.textContent = copy;

  if (image) {
    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt || title;
    modalImage.hidden = false;
    modalIcon.style.display = "none";
  } else {
    modalImage.hidden = true;
    modalIcon.style.display = "grid";
  }

  galleryModal.hidden = false;
  document.body.classList.add("modal-open");
  galleryModal.querySelector("[data-gallery-close]")?.focus();
}

document.querySelectorAll("[data-gallery-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-category]");
    if (card) openGallery(card);
  });
});

document.querySelectorAll("[data-gallery-close]").forEach((control) => {
  control.addEventListener("click", (event) => {
    closeGallery();
    if (control instanceof HTMLButtonElement) {
      event.preventDefault();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && galleryModal && !galleryModal.hidden) {
    closeGallery();
  }
});

if (quoteForm && formNote) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(quoteForm);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const project = String(data.get("project") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Quote request: ${project}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Project type: ${project}`,
        "",
        "Message:",
        message || "Please contact me about this project.",
      ].join("\n")
    );

    formNote.textContent = "Opening your email app with the quote request.";
    window.location.href = `mailto:LAOrnamental@aol.com?subject=${subject}&body=${body}`;
  });
}
