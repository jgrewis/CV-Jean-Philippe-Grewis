// Panneau de detail ouvert au clic sur une feuille (effet de zoom).
// Rend le contenu enrichi d'une feuille, ou le bloc contact.
import { icon } from '../utils/icons.js';
import { contact } from '../data/cv.js';
import { createFocusTrap } from '../utils/a11y.js';
import { escapeHtml } from '../utils/escapeHtml.js';

function renderKpis(kpis) {
  if (!kpis || !kpis.length) return '';
  const items = kpis
    .map(
      (k) => `<div class="kpi glass glass--accent">
        <div class="kpi__value">${escapeHtml(k.value)}</div>
        <div class="kpi__label">${escapeHtml(k.label)}</div>
      </div>`
    )
    .join('');
  return `<div class="kpi-grid">${items}</div>`;
}

function renderBullets(bullets) {
  if (!bullets || !bullets.length) return '';
  const items = bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('');
  return `<ul class="detail-list">${items}</ul>`;
}

function renderTags(tags) {
  if (!tags || !tags.length) return '';
  const items = tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  return `<div class="tag-row">${items}</div>`;
}

function renderMedia(media) {
  if (!media || !media.length) return '';
  const items = media
    .map((m) => {
      if (m.src) {
        return `<div class="media-item"><img src="${escapeHtml(m.src)}" alt="${escapeHtml(m.caption || '')}" loading="lazy" /></div>`;
      }
      return `<div class="media-item">${icon('photo')}<span>${escapeHtml(m.caption || 'Visuel à venir')}</span></div>`;
    })
    .join('');
  return `<div class="media-grid">${items}</div>`;
}

function renderLinks(links) {
  if (!links || !links.length) return '';
  const items = links
    .map(
      (l) =>
        `<a class="link-chip" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${icon(l.icon || 'external')}<span>${escapeHtml(l.label)}</span></a>`
    )
    .join('');
  return `<div class="link-row">${items}</div>`;
}

function renderLeaf(branchLabel, leaf) {
  const meta = [leaf.org, leaf.period].filter(Boolean).map(escapeHtml).join(' · ');
  return `
    <p class="detail-panel__eyebrow">${escapeHtml(branchLabel)}</p>
    <h2 class="detail-panel__title">${escapeHtml(leaf.title)}</h2>
    ${meta ? `<p class="detail-panel__meta">${meta}</p>` : ''}
    ${leaf.summary ? `<p class="detail-panel__summary">${escapeHtml(leaf.summary)}</p>` : ''}
    ${renderKpis(leaf.kpis)}
    ${renderBullets(leaf.bullets)}
    ${renderTags(leaf.tags)}
    ${renderMedia(leaf.media)}
    ${renderLinks(leaf.links)}
  `;
}

function renderContact() {
  const phoneDigits = contact.phone.replace(/\s+/g, '');
  return `
    <p class="detail-panel__eyebrow">Contact</p>
    <h2 class="detail-panel__title">Me contacter</h2>
    <div class="contact-grid">
      <div class="contact-row">${icon('mail')}<a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></div>
      <div class="contact-row">${icon('phone')}<a href="tel:${escapeHtml(phoneDigits)}">${escapeHtml(contact.phone)}</a></div>
      <div class="contact-row">${icon('pin')}<span>${escapeHtml(contact.location)}</span></div>
      <div class="contact-row">${icon('car')}<span>${escapeHtml(contact.driving)}</span></div>
    </div>
    ${renderLinks(contact.links)}
  `;
}

export class DetailPanel {
  constructor(root) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'detail-overlay';

    this.panel = document.createElement('div');
    this.panel.className = 'detail-panel glass glass--strong';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.tabIndex = -1;

    this.body = document.createElement('div');

    this.closeBtn = document.createElement('button');
    this.closeBtn.type = 'button';
    this.closeBtn.className = 'detail-panel__close';
    this.closeBtn.setAttribute('aria-label', 'Fermer');
    this.closeBtn.innerHTML = icon('x');

    this.panel.append(this.closeBtn, this.body);
    this.overlay.appendChild(this.panel);
    root.appendChild(this.overlay);

    this.trap = createFocusTrap(this.panel);
    this.isOpen = false;

    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  _open(html, labelledTitle) {
    this.body.innerHTML = html;
    this.panel.setAttribute('aria-label', labelledTitle);
    this.panel.scrollTop = 0;
    this.overlay.classList.add('is-open');
    this.isOpen = true;
    this.trap.activate();
  }

  openLeaf(branchLabel, leaf) {
    this._open(renderLeaf(branchLabel, leaf), leaf.title);
    this._applyTheme(leaf.theme);
  }

  _applyTheme(theme) {
    this.panel.classList.toggle('detail-panel--themed', Boolean(theme));
    if (theme) {
      this.panel.style.setProperty('--theme-bg', `url('${theme.background}')`);
      this.panel.style.setProperty('--theme-accent', theme.accentColor);
    } else {
      this.panel.style.removeProperty('--theme-bg');
      this.panel.style.removeProperty('--theme-accent');
    }
  }

  openContact() {
    this._open(renderContact(), 'Me contacter');
    this._applyTheme(null);
  }

  close() {
    if (!this.isOpen) return;
    this.overlay.classList.remove('is-open');
    this.isOpen = false;
    this.trap.deactivate();
  }
}
