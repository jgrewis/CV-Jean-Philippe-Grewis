// Genere public/CV-Jean-Philippe-Grewis.pdf (A4, 2 pages max) et public/og-image.png
// (1200 x 630, theme clair) a partir de src/data/cv.js et src/data/hero.js : le PDF
// reprend donc exactement le contenu (et les interdits) du site.
//
// Usage : node scripts/generer-pdf-og.mjs
// Prerequis : Playwright + Chromium (hors dependances du site), par exemple
//   npm i -g playwright && npx playwright install chromium
// ou PLAYWRIGHT_MODULE=/chemin/vers/playwright et CHROME_PATH=/chemin/vers/chrome.
import { createRequire } from 'node:module';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';
import { profile, contact, branches } from '../src/data/cv.js';
import { pitch } from '../src/data/hero.js';
import { methode } from '../src/data/methode.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const SITE_URL = 'https://jgrewis.github.io/CV-Jean-Philippe-Grewis/';

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const candidates = [process.env.PLAYWRIGHT_MODULE, 'playwright'];
  try {
    candidates.push(join(execSync('npm root -g').toString().trim(), 'playwright'));
  } catch {
    /* npm absent : on s'en tient aux autres pistes */
  }
  for (const candidate of candidates.filter(Boolean)) {
    try {
      return require(candidate);
    } catch {
      /* piste suivante */
    }
  }
  throw new Error('Playwright introuvable (voir l\'en-tete du script).');
}

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const leaves = (id) => branches.find((b) => b.id === id)?.leaves ?? [];
const leaf = (branchId, leafId) => leaves(branchId).find((l) => l.id === leafId);
const fontUrl = (rel) => pathToFileURL(join(ROOT, 'node_modules', rel)).href;

const FONTS = `
@font-face { font-family: 'Inter Tight Variable'; font-weight: 100 900; font-style: normal;
  src: url('${fontUrl('@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Instrument Serif'; font-weight: 400; font-style: italic;
  src: url('${fontUrl('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}') format('woff2'); }`;

const INK = '#141414';
const MUTED = '#5a5752';
const ACCENT = '#5b3df5';
const BG = '#edebe6';
const LINE = 'rgba(20,20,20,.14)';

// ---------- PDF ----------

function experienceHtml(xp) {
  const kpis = xp.kpis?.length
    ? `<ul class="kpis">${xp.kpis.map((k) => `<li><b>${esc(k.value)}</b> ${esc(k.label)}</li>`).join('')}</ul>`
    : '';
  const results = xp.results?.length
    ? `<p class="res-label">${esc(xp.resultsLabel ?? 'Résultats')}</p><ul class="results">${xp.results
        .map((r) => `<li><b>${esc(r.title)}</b> : ${esc(r.text)}</li>`)
        .join('')}</ul>`
    : '';
  const bullets = xp.bullets?.length ? `<ul class="bullets">${xp.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '';
  const summary = xp.summary ? `<p class="summary">${esc(xp.summary)}</p>` : '';
  return `<article class="xp">
    <header><h3>${esc(xp.title)}</h3><span class="period">${esc(xp.period)}</span></header>
    <p class="org">${esc(xp.org)}</p>${summary}${kpis}${results}${bullets}</article>`;
}

function cvHtml() {
  const about = leaf('profil', 'apropos');
  const soft = leaf('profil', 'soft-skills');
  const interests = leaf('profil', 'interets');
  const skills = leaves('competences');
  const formations = leaves('formation');
  const proofLeaf = leaves('experiences').find((l) => l.links?.length);
  const contactBits = [
    `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`,
    esc(contact.phone),
    esc(contact.location),
    esc(contact.driving),
    `<a href="${esc(profile.linkedin)}">linkedin.com/in/grewis</a>`,
    `<a href="${SITE_URL}">CV en ligne</a>`,
  ].join('<span class="sep">·</span>');

  const skillRows = skills
    .map((s) => {
      const content = s.tags?.length ? s.tags.map(esc).join(' · ') : (s.bullets ?? []).map(esc).join(' ');
      return `<div class="skill"><h4>${esc(s.title)}</h4><p>${content}</p></div>`;
    })
    .join('');
  const formationRows = formations
    .map((f) =>
      f.tags?.length
        ? `<div class="formation"><h4>${esc(f.title)}</h4><p>${f.tags.map(esc).join(' · ')}</p></div>`
        : `<div class="formation"><h4>${esc(f.title)}</h4><p>${esc(f.org)} · ${esc(f.period)}${f.summary ? ` · ${esc(f.summary)}` : ''}</p></div>`,
    )
    .join('');
  const proofs = proofLeaf
    ? `<p class="proofs"><b>Preuves</b> : communiqués de presse officiels de m2A (© m2A), liens cliquables sur le CV en ligne : ${proofLeaf.links
        .filter((l) => /\.pdf$/i.test(l.url))
        .map((l) => `<a href="${esc(l.url)}">${esc(l.label.replace(/\s*·\s*© m2A/, ''))}</a>`)
        .join(', ')}.</p>`
    : '';

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>CV — ${esc(profile.name)}</title><style>
${FONTS}
@page { size: A4; margin: 12mm 13mm 12mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter Tight Variable', Arial, sans-serif; color: ${INK}; font-size: 8.9pt; line-height: 1.38; }
a { color: inherit; text-decoration: none; }
.top { display: grid; grid-template-columns: 1fr auto; gap: 4mm; align-items: end; border-bottom: 2px solid ${INK}; padding-bottom: 3mm; }
h1 { font-size: 25pt; font-weight: 800; letter-spacing: -.03em; text-transform: uppercase; line-height: 1; }
.tagline { font-size: 11.5pt; font-weight: 500; margin-top: 1.5mm; }
.tagline em { font-family: 'Instrument Serif', serif; color: ${ACCENT}; font-size: 13pt; }
.contact { font-size: 8.2pt; color: ${MUTED}; margin-top: 2mm; }
.sep { margin: 0 1.6mm; color: ${ACCENT}; }
.about { margin-top: 2.5mm; font-size: 9pt; color: ${MUTED}; }
.statement { margin-top: 3mm; font-size: 11pt; font-weight: 500; line-height: 1.35; border-left: 2px solid ${ACCENT}; padding-left: 3mm; }
.steps { list-style: none; display: grid; gap: .9mm; }
.steps b { color: ${ACCENT}; font-weight: 700; margin-right: 1mm; }
.case { margin-top: 2.5mm; padding: 2.5mm 3mm; background: ${BG}; display: grid; gap: .9mm; break-inside: avoid; }
.case-title { font-weight: 800; text-transform: uppercase; letter-spacing: .04em; font-size: 8.6pt; }
.case-link a { color: ${ACCENT}; }
.res-label { margin-top: 1.4mm; font-size: 7.8pt; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: ${MUTED}; }
.results { margin: .8mm 0 0 3.6mm; }
.results li { margin-bottom: .5mm; }
h2 { font-size: 8pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${MUTED}; margin: 4.5mm 0 2mm; padding-bottom: 1mm; border-bottom: 1px solid ${LINE}; }
.xp { margin-bottom: 3.2mm; break-inside: avoid; }
.xp header { display: flex; justify-content: space-between; gap: 4mm; align-items: baseline; }
h3 { font-size: 10.6pt; font-weight: 800; letter-spacing: -.01em; }
.period { font-size: 8pt; color: ${MUTED}; white-space: nowrap; text-transform: uppercase; letter-spacing: .06em; }
.org { font-weight: 600; color: ${ACCENT}; font-size: 8.8pt; }
.summary { margin-top: .8mm; }
.kpis { list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: .6mm 4mm; margin: 1.4mm 0; }
.kpis li { font-size: 8.3pt; }
.kpis b { font-weight: 800; }
.bullets { margin: .8mm 0 0 3.6mm; }
.bullets li { margin-bottom: .5mm; }
.cols { display: grid; grid-template-columns: 1.25fr 1fr; gap: 7mm; }
h4 { font-size: 8.8pt; font-weight: 700; }
.skill, .formation { margin-bottom: 2mm; break-inside: avoid; }
.skill p, .formation p { color: ${INK}; }
.proofs { margin-top: 4mm; font-size: 7.6pt; color: ${MUTED}; }
.proofs a { color: ${ACCENT}; }
.foot { margin-top: 2mm; font-size: 7.6pt; color: ${MUTED}; }
</style></head><body>
<header class="top"><div>
  <h1>${esc(profile.name)}</h1>
  <p class="tagline">${esc(pitch.text)}</p>
  <p class="contact">${contactBits}</p>
</div></header>
<p class="statement">${esc(pitch.statement)}</p>
<h2>${esc(methode.title)}</h2>
<ol class="steps">${methode.steps.map((st, i) => `<li><b>${String(i + 1).padStart(2, '0')} · ${esc(st.title)}</b> ${esc(st.role)}</li>`).join('')}</ol>
<div class="case"><p class="case-title">${esc(methode.caseStudy.eyebrow)} · ${esc(methode.caseStudy.title)}</p>
${methode.caseStudy.blocks.map((b) => `<p><b>${esc(b.label)} :</b> ${esc(b.text)}</p>`).join('')}
<p class="case-link">Preuve : <a href="${esc(methode.caseStudy.links[0].url)}">${esc(methode.caseStudy.links[0].label)}</a></p></div>
<p class="about">${esc(about?.summary)}</p>
<h2>Expériences professionnelles</h2>
${leaves('experiences').map(experienceHtml).join('')}
<div class="cols">
  <section><h2>Compétences</h2>${skillRows}</section>
  <section><h2>Formations</h2>${formationRows}
    <h2>Savoir-être</h2><p>${(soft?.tags ?? []).map(esc).join(' · ')}</p>
    <h2>Centres d'intérêt</h2><p>${(interests?.tags ?? []).map(esc).join(' · ')}</p>
  </section>
</div>
${proofs}
<p class="foot">Réalisations visibles sur le CV en ligne : ${SITE_URL}</p>
</body></html>`;
}

// ---------- Image de partage ----------

function ogHtml() {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
${FONTS}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 630px; }
body { background: ${BG}; color: ${INK}; font-family: 'Inter Tight Variable', Arial, sans-serif; position: relative; overflow: hidden; padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between; }
svg.topo { position: absolute; inset: 0; z-index: 0; }
.z { position: relative; z-index: 1; }
.eyebrow { font-size: 20px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: ${MUTED}; }
h1 { font-size: 92px; font-weight: 800; letter-spacing: -.035em; line-height: .98; text-transform: uppercase; }
.tag { margin-top: 22px; font-size: 34px; font-weight: 500; letter-spacing: -.01em; }
.tag em { font-family: 'Instrument Serif', serif; color: ${ACCENT}; font-size: 40px; }
.statement { border-top: 2px solid ${INK}; padding-top: 22px; font-size: 27px; line-height: 1.3; font-weight: 500; max-width: 1000px; }
.kpis b { display: block; font-size: 40px; font-weight: 800; color: ${ACCENT}; letter-spacing: -.02em; line-height: 1.05; }
.kpis span { font-size: 16px; letter-spacing: .08em; text-transform: uppercase; color: ${MUTED}; }
</style></head><body>
<svg class="topo" viewBox="0 0 1200 630" fill="none" stroke="rgba(20,20,20,.08)" stroke-width="1.5">
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<ellipse cx="1060" cy="120" rx="${90 + i * 55}" ry="${60 + i * 40}"/>`).join('')}
</svg>
<p class="eyebrow z">CV en ligne · Communication</p>
<div class="z"><h1>Jean-Philippe<br>Grewis</h1>
<p class="tag">Chef de projet communication · <em>Disponible</em> · Mulhouse / Colmar</p></div>
<p class="statement z">${esc(pitch.statement)}</p>
</body></html>`;
}

const { chromium } = loadPlaywright();
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const dir = mkdtempSync(join(tmpdir(), 'cv-pdf-'));
try {
  const page = await browser.newPage();
  const cvFile = join(dir, 'cv.html');
  writeFileSync(cvFile, cvHtml());
  await page.goto(pathToFileURL(cvFile).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(PUBLIC, 'CV-Jean-Philippe-Grewis.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const ogFile = join(dir, 'og.html');
  writeFileSync(ogFile, ogHtml());
  await og.goto(pathToFileURL(ogFile).href, { waitUntil: 'load' });
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: join(PUBLIC, 'og-image.png') });
  console.log('OK : public/CV-Jean-Philippe-Grewis.pdf et public/og-image.png');
} finally {
  await browser.close();
}
