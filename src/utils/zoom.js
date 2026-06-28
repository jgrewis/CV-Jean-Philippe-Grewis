// Controleur de "camera" pour la scene : centre un point de la scene a l'ecran
// avec un facteur de zoom, et gere le glisser-deplacer (pan) a la souris/au doigt.

export class Camera {
  constructor(stage) {
    this.stage = stage;
    this.focusX = 0;
    this.focusY = 0;
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this._drag = null;
    this._bindDrag();
  }

  apply() {
    const camX = -this.focusX * this.scale + this.panX;
    const camY = -this.focusY * this.scale + this.panY;
    this.stage.style.setProperty('--cam-x', `${camX}px`);
    this.stage.style.setProperty('--cam-y', `${camY}px`);
    this.stage.style.setProperty('--cam-s', this.scale.toFixed(3));
  }

  focusOn(x, y, scale) {
    this.focusX = x;
    this.focusY = y;
    this.scale = scale;
    this.panX = 0;
    this.panY = 0;
    this.apply();
  }

  reset() {
    this.focusOn(0, 0, 1);
  }

  _bindDrag() {
    const stage = this.stage;

    const onDown = (e) => {
      // On ne demarre pas le pan si on saisit un noeud interactif.
      if (e.target.closest('.node')) return;
      this._drag = {
        startX: e.clientX,
        startY: e.clientY,
        baseX: this.panX,
        baseY: this.panY,
        moved: false,
      };
      stage.classList.add('is-dragging');
      stage.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      if (!this._drag) return;
      const dx = e.clientX - this._drag.startX;
      const dy = e.clientY - this._drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) this._drag.moved = true;
      this.panX = this._drag.baseX + dx;
      this.panY = this._drag.baseY + dy;
      this.apply();
    };

    const onUp = () => {
      if (!this._drag) return;
      this._drag = null;
      stage.classList.remove('is-dragging');
    };

    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }
}
