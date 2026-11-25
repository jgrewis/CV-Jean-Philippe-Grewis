// Genere public/CV-Jean-Philippe-Grewis.pdf (A4, 2 pages max) et public/og-image.png
// (1200 x 630, theme clair) a partir de src/data/cv.js et src/data/hero.js : le PDF
// reprend donc exactement le contenu (et les interdits) du site.
//
// Usage : node scripts/generer-pdf-og.mjs (lance automatiquement avant chaque
// `npm run build`, donc a chaque deploiement : le PDF ne peut plus diverger du site).
// Prerequis : playwright-core (installe par le script prebuild) et Google Chrome,
// trouve automatiquement (GitHub Actions, Mac, Linux) ou via CHROME_PATH.
// Sans navigateur, le script s'arrete en avertissant, sauf en integration
// continue (CI) ou il echoue pour ne jamais deployer un PDF perime.
import { createRequire } from 'node:module';
import { writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';
import { profile, contact, branches } from '../src/data/cv.js';
import { pitch } from '../src/data/hero.js';
import { etudeDeCas } from '../src/data/etude-de-cas.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const SITE_URL = 'https://jgrewis.github.io/CV-Jean-Philippe-Grewis/';

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const candidates = [process.env.PLAYWRIGHT_MODULE, 'playwright-core', 'playwright'];
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
  return null;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return candidates.filter(Boolean).find((p) => existsSync(p)) ?? null;
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
  // Liens « Sources » (Hyper U) dans le bloc parcours. Les communiques m2A restent
  // regroupes en pied de PDF pour eviter de les dupliquer ici.
  const sources = xp.links?.length && xp.linksLabel === 'Sources'
    ? `<p class="proofs">${esc(xp.linksLabel)} : ${xp.links
        .map((l) => `<a href="${esc(l.url)}">${esc(l.label)}</a>`)
        .join(' · ')}</p>`
    : '';
  return `<article class="xp">
    <header><h3>${esc(xp.title)}</h3><span class="period">${esc(xp.period)}</span></header>
    <p class="org">${esc(xp.org)}</p>${summary}${kpis}${results}${bullets}${sources}</article>`;
}

function cvHtml() {
  // Ordre lisible par les logiciels de tri (ATS) : identité, profil, expériences,
  // étude de cas, compétences, formations. Une seule colonne, titres sans
  // espacement de lettres ni capitales forcées (sinon l'extraction donne
  // « F O R M A T I O N S »).
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
  ].join(' · ');

  const skillRows = skills
    .map((s) => {
      const content = s.tags?.length ? s.tags.map(esc).join(', ') : (s.bullets ?? []).map(esc).join(' ');
      return `<p class="line"><b>${esc(s.title)} :</b> ${content}</p>`;
    })
    .join('');
  const formationRows = formations
    .map((f) =>
      f.tags?.length
        ? `<p class="line"><b>${esc(f.title)} :</b> ${f.tags.map(esc).join(', ')}</p>`
        : `<p class="line"><b>${esc(f.title)}</b>, ${esc(f.org)}, ${esc(f.period)}${f.summary ? `. ${esc(f.summary)}` : ''}</p>`,
    )
    .join('');
  const caseStudy = `<div class="case"><h3>${esc(etudeDeCas.title)}</h3>
${etudeDeCas.blocks.map((bl) => `<p><b>${esc(bl.label)} :</b> ${esc(bl.text)}</p>`).join('')}
<p class="small">Source : <a href="${esc(etudeDeCas.links[0].url)}">${esc(etudeDeCas.links[0].label)}</a></p></div>`;
  const proofs = proofLeaf
    ? `<p class="small">Sources des résultats m2A, communiqués officiels (© m2A) : ${proofLeaf.links
        .filter((l) => /\.pdf$/i.test(l.url))
        .map((l) => `<a href="${esc(l.url)}">${esc(l.label.replace(/\s*·\s*© m2A/, '').replace(/^CP /, ''))}</a>`)
        .join(', ')}.</p>`
    : '';

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>CV ${esc(profile.name)}</title><style>
${FONTS}
@page { size: A4; margin: 12mm 14mm 12mm; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter Tight Variable', Arial, sans-serif; color: ${INK}; font-size: 9.4pt; line-height: 1.4; }
a { color: inherit; text-decoration: none; }
h1 { font-size: 22pt; font-weight: 800; line-height: 1.1; }
.title { font-size: 12pt; font-weight: 600; margin-top: 1mm; }
.contact { font-size: 8.8pt; color: ${MUTED}; margin-top: 1.5mm; }
.summary-top { margin-top: 3mm; padding-top: 2.5mm; border-top: 2px solid ${INK}; }
h2 { font-size: 11pt; font-weight: 800; color: ${INK}; margin: 4.5mm 0 1.8mm; padding-bottom: 1mm; border-bottom: 1px solid ${LINE}; }
h3 { font-size: 10pt; font-weight: 800; }
.xp { margin-bottom: 3mm; break-inside: avoid; }
.xp header { display: flex; justify-content: space-between; gap: 4mm; align-items: baseline; }
.period { font-size: 8.8pt; color: ${MUTED}; white-space: nowrap; }
.org { font-weight: 600; color: ${ACCENT}; font-size: 9pt; }
.summary { margin-top: .8mm; }
.res-label { margin-top: 1.2mm; font-size: 8.8pt; font-weight: 700; color: ${MUTED}; }
.results, .bullets { margin: .6mm 0 0 4mm; }
.results li, .bullets li { margin-bottom: .4mm; }
.kpis { margin: 1mm 0 0 4mm; }
.case { padding: 2.5mm 3mm; background: ${BG}; display: grid; gap: .8mm; break-inside: avoid; }
.line { margin-bottom: 1mm; }
.small { margin-top: 2mm; font-size: 8pt; color: ${MUTED}; }
.small a, .case a { color: ${ACCENT}; }
.proofs { margin-top: .8mm; font-size: 8pt; color: ${MUTED}; }
</style></head><body>
<header>
  <h1>${esc(profile.name)}</h1>
  <p class="title">${esc(profile.title)} · Disponible · Mulhouse / Colmar</p>
  <p class="contact">${contactBits}</p>
</header>
<section class="summary-top"><h2 style="margin-top:0">Profil</h2><p>${esc(profile.summary)}</p></section>
<section><h2>Expériences professionnelles</h2>
${leaves('experiences').map(experienceHtml).join('')}</section>
<section><h2>Étude de cas</h2>${caseStudy}</section>
<section><h2>Compétences</h2>${skillRows}</section>
<section><h2>Formations et certifications</h2>${formationRows}</section>
<section><h2>Savoir-être et centres d'intérêt</h2>
  <p class="line"><b>Savoir-être :</b> ${(soft?.tags ?? []).map(esc).join(', ')}</p>
  <p class="line"><b>Centres d'intérêt :</b> ${(interests?.tags ?? []).map(esc).join(', ')}</p>
</section>
${proofs}
<p class="small">Réalisations et vidéos sur le CV en ligne : <a href="${SITE_URL}">${SITE_URL}</a></p>
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

const pw = loadPlaywright();
const chromePath = findChrome();
if (!pw || !chromePath) {
  const msg = `PDF non regenere : ${!pw ? 'playwright-core introuvable' : 'Google Chrome introuvable (CHROME_PATH)'}.`;
  if (process.env.CI) throw new Error(msg);
  console.warn(msg);
  process.exit(0);
}
const browser = await pw.chromium.launch({ executablePath: chromePath });
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
