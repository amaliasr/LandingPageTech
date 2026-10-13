import { products, createWhatsAppUrl } from "./content.js";
import Lenis from "../vendor/lenis.mjs";

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
let smoothScroll;
function configureSmoothScroll() {
  smoothScroll?.destroy();
  smoothScroll = undefined;
  if (!reduceMotion.matches) {
    smoothScroll = new Lenis({
      autoRaf: true,
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: false,
      anchors: { duration: 1.25, offset: -28 },
      prevent: (node) => Boolean(node.closest?.("dialog")),
    });
    if (document.querySelector("dialog[open]")) smoothScroll.stop();
  }
}
configureSmoothScroll();
reduceMotion.addEventListener("change", configureSmoothScroll);

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  mobileMenu.hidden = true;
}
menuToggle.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute(
    "aria-label",
    opening ? "Close navigation" : "Open navigation",
  );
  mobileMenu.hidden = !opening;
});
mobileMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileMenu.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia("(min-width: 621px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const contactDialog = document.querySelector("#contact-dialog");
const productDialog = document.querySelector("#product-dialog");
let lastTrigger;
function openDialog(dialog, trigger) {
  lastTrigger = mobileMenu.contains(trigger) ? menuToggle : trigger;
  closeMenu();
  dialog.showModal();
  document.body.classList.add("modal-open");
  smoothScroll?.stop();
}
for (const trigger of document.querySelectorAll("[data-contact]")) {
  trigger.addEventListener("click", (event) => {
    if (typeof contactDialog.showModal !== "function") return;
    event.preventDefault();
    openDialog(contactDialog, trigger);
  });
}
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.setAttribute("data-lenis-prevent", "");
  dialog
    .querySelector("[data-close]")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    smoothScroll?.start();
    lastTrigger?.focus();
  });
}

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const messageField = form.elements.message;
  if (!String(data.get("message")).trim()) {
    messageField.setCustomValidity("Tell us a little about your idea first.");
    messageField.reportValidity();
    return;
  }
  messageField.setCustomValidity("");
  window.open(
    createWhatsAppUrl(Object.fromEntries(data)),
    "_blank",
    "noopener,noreferrer",
  );
});
document
  .querySelector("#project-message")
  .addEventListener("input", (event) => event.target.setCustomValidity(""));

for (const trigger of document.querySelectorAll("[data-product]")) {
  trigger.addEventListener("click", () => {
    const product = products[trigger.dataset.product];
    if (!product) return;
    document.querySelector("#product-category").textContent =
      product.category.toUpperCase();
    document.querySelector("#product-dialog-title").textContent = product.name;
    document.querySelector("#product-description").textContent =
      product.description;
    const features = product.features.map((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      return item;
    });
    document.querySelector("#product-features").replaceChildren(...features);
    document.querySelector("#product-contact").href = createWhatsAppUrl({
      message: `I saw ${product.name} on your website. I’d like to talk about something similar for my business.`,
    });
    openDialog(productDialog, trigger);
  });
}

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  document.documentElement.classList.add("js-reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));
}

document.querySelector("#year").textContent = String(new Date().getFullYear());
