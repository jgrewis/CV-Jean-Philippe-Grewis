// Changement de teinte du fond au defilement : la section qui traverse le milieu
// de l'ecran impose sa teinte (data-tone="base" | "alt") a <html data-tone>. Le
// CSS (page.css) fait alors apparaitre ou disparaitre un calque de teinte fixe en
// opacite seulement : aucune propriete de mise en page ni de couleur n'est animee.
//
// Observateur distinct de reveal.js : il lui faut une marge differente (une ligne
// au milieu de l'ecran) et il reste actif tout le temps, la ou reveal est a un coup.

// Bande de hauteur nulle au milieu de la fenetre : une seule section la coupe a la fois.
const MIDDLE_LINE = '-50% 0px -50% 0px';
const DEFAULT_TONE = 'base';

export function watchTones(sections) {
  const root = document.documentElement;
  root.dataset.tone = DEFAULT_TONE;
  if (!('IntersectionObserver' in window)) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        root.dataset.tone = entry.target.dataset.tone || DEFAULT_TONE;
      });
    },
    { rootMargin: MIDDLE_LINE, threshold: 0 },
  );
  sections.forEach((section) => io.observe(section));
  return () => io.disconnect();
}
