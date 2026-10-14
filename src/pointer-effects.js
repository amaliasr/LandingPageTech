// Decorative only: the native pointer and every control keep their usual behavior.
const pointerPreference = matchMedia(
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
);
const spotlightSelector =
  ".service-card, .voices-card, [data-pointer-spotlight]";
const interactiveSelector =
  'a[href], button:not(:disabled), summary, [role="button"]:not([aria-disabled="true"])';
const quietSelector =
  'input, textarea, select, [contenteditable="true"], dialog[open]';
let disposeEffects;

function configurePointerEffects() {
  disposeEffects?.();
  disposeEffects = undefined;
  if (!pointerPreference.matches) return;

  const controller = new AbortController();
  const listenerOptions = { passive: true, signal: controller.signal };
  const layer = document.createElement("div");
  layer.className = "pointer-effects";
  layer.setAttribute("aria-hidden", "true");
  const halo = document.createElement("span");
  halo.className = "pointer-halo";
  const ring = document.createElement("span");
  ring.className = "pointer-ring";
  layer.append(halo, ring);
  document.body.append(layer);

  const spotlights = new Map();
  let activeCard;
  let cardBounds;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let previousTime = 0;
  let frame = 0;
  let visible = false;
  let focused = document.hasFocus();
  let spotlightDirty = false;

  function clearCard() {
    if (activeCard) activeCard.classList.remove("pointer-spotlight-active");
    activeCard = undefined;
    cardBounds = undefined;
    spotlightDirty = false;
  }

  function hide() {
    visible = false;
    previousTime = 0;
    layer.classList.remove("is-visible", "is-interactive");
    clearCard();
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function render(time) {
    frame = 0;
    if (!visible) return;
    const elapsed = previousTime ? Math.min(time - previousTime, 48) : 16;
    const ease = 1 - Math.exp(-elapsed / 62);
    previousTime = time;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    halo.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    ring.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;

    // Bounds are cached by pointer events, never read in an animation frame.
    if (spotlightDirty && activeCard && cardBounds) {
      const spotlight = spotlights.get(activeCard);
      spotlight.style.setProperty(
        "--pointer-x",
        `${targetX - cardBounds.left}px`,
      );
      spotlight.style.setProperty(
        "--pointer-y",
        `${targetY - cardBounds.top}px`,
      );
      spotlightDirty = false;
    }

    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.15) {
      frame = requestAnimationFrame(render);
    } else {
      previousTime = 0;
    }
  }

  function track(event) {
    if (event.pointerType !== "mouse" || !focused || document.hidden) {
      hide();
      return;
    }
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest(quietSelector)) {
      hide();
      return;
    }
    targetX = event.clientX;
    targetY = event.clientY;
    const card = target.closest(spotlightSelector);
    if (card !== activeCard) {
      clearCard();
      if (card) {
        if (!spotlights.has(card)) {
          const spotlight = document.createElement("span");
          spotlight.className = "pointer-spotlight";
          spotlight.setAttribute("aria-hidden", "true");
          card.classList.add("pointer-spotlight-host");
          card.append(spotlight);
          spotlights.set(card, spotlight);
        }
        activeCard = card;
      }
    }
    if (activeCard) {
      cardBounds ??= activeCard.getBoundingClientRect();
      activeCard.classList.add("pointer-spotlight-active");
      spotlightDirty = true;
    }
    if (!visible) {
      currentX = targetX;
      currentY = targetY;
      visible = true;
      layer.classList.add("is-visible");
    }
    layer.classList.toggle(
      "is-interactive",
      Boolean(target.closest(interactiveSelector)),
    );
    if (!frame) frame = requestAnimationFrame(render);
  }

  document.addEventListener("pointermove", track, listenerOptions);
  document.addEventListener("pointerover", track, listenerOptions);
  document.documentElement.addEventListener(
    "pointerleave",
    hide,
    listenerOptions,
  );
  document.addEventListener("pointercancel", hide, listenerOptions);
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "mouse") hide();
    },
    listenerOptions,
  );
  document.addEventListener("keydown", hide, listenerOptions);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) hide();
    },
    listenerOptions,
  );
  window.addEventListener(
    "blur",
    () => {
      focused = false;
      hide();
    },
    listenerOptions,
  );
  window.addEventListener(
    "focus",
    () => {
      focused = true;
    },
    listenerOptions,
  );
  // Hide during scrolling so a stationary pointer cannot leave a spotlight
  // attached to a card that has moved away. Movement restores it immediately.
  window.addEventListener("scroll", hide, listenerOptions);
  window.addEventListener("resize", hide, listenerOptions);
  window.addEventListener("pagehide", hide, listenerOptions);

  disposeEffects = () => {
    hide();
    controller.abort();
    layer.remove();
    for (const [card, spotlight] of spotlights) {
      card.classList.remove(
        "pointer-spotlight-host",
        "pointer-spotlight-active",
      );
      spotlight.remove();
    }
  };
}

configurePointerEffects();
pointerPreference.addEventListener("change", configurePointerEffects);
