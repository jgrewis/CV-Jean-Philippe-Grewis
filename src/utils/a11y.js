// Piege de focus pour les contenus modaux (panneau de detail).
// Garde le focus a l'interieur du conteneur tant qu'il est actif.

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

export function createFocusTrap(container) {
  let previouslyFocused = null;

  const onKeydown = (e) => {
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return {
    activate() {
      previouslyFocused = document.activeElement;
      container.addEventListener('keydown', onKeydown);
      const target = container.querySelector(FOCUSABLE) || container;
      requestAnimationFrame(() => target.focus());
    },
    deactivate() {
      container.removeEventListener('keydown', onKeydown);
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    },
  };
}
