/* ===== Job Hunter 3.4 — CV PDF engine =====
   Why: html2pdf cuts one tall screenshot into equal slices, so sections split across pages,
   the first page gets extra margin and images sometimes disappear.
   This engine measures the CV, cuts ONLY between items/sections, draws every page separately
   (browser-native SVG rendering) and writes the PDF itself. */
const PGW = 794, PGH = 1123;

function cvMount() {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff;pointer-events:none';
  wrap.innerHTML = cvHTML(cv, tpl);
  document.body.appendChild(wrap);
  if (tpl === 't7' || cvo.fit) fitCV(wrap);
  return { wrap, root: wrap.firstElementChild };
}

/* cut [top,end) into pages, only between whole items (never inside one) */
function cutRegion(top, end, full, atoms, mt0, MT, MB) {
  const cands = []; atoms.forEach(a => cands.push(a[0], a[1])); cands.sort((a, b) => b - a);
  const pages = []; let y0 = top;
  while (y0 < end - 2) {
    const mt = pages.length ? MT : mt0, avail = PGH - mt - MB, limit = y0 + avail;
    if (end <= limit + 1) { pages.push({ y0, h: Math.min(full - y0, avail), mt }); break }
    let best = -1;
    for (const y of cands) { if (y > limit || y <= y0 + avail * .35) continue; if (!atoms.some(a => a[0] < y - .5 && y + .5 < a[1])) { best = y; break } }
    const cut = best > 0 ? best : limit; pages.push({ y0, h: cut - y0, mt }); y0 = cut;
  }
  return pages;
}
function computeCuts(root) {
  const rb = root.getBoundingClientRect(), rel = e => { const r = e.getBoundingClientRect(); return [r.top - rb.top, r.bottom - rb.top] };
  if (root.classList.contains('t7')) {
    const out = [];
    [...root.children].filter(c => c.classList.contains('pg')).forEach(p => {
      const top = rel(p)[0], H = p.offsetHeight;
      if (H <= PGH - 1) { out.push({ y0: top, h: H, mt: 0 }); return }
      /* a page that does not fit even after shrinking: continue on extra pages instead of losing content */
      const at = [...p.querySelectorAll('.ti,li,.sm,.sb7,.pr,.sgn,.lg>div,.kv,.sh,.bd7,.sub')].map(e => {
        const r = rel(e); let b = r[1];
        if (/\b(sh|bd7)\b/.test(e.className) && e.nextElementSibling) { const n = e.nextElementSibling, f = n.firstElementChild || n; b = Math.max(b, rel(f)[1]) }
        return [r[0], b]
      }).filter(x => x[1] - x[0] > 1);
      out.push(...cutRegion(top, top + H, top + H, at, 0, 34, 30));
    });
    return out;
  }
  const total = root.offsetHeight;
  const atoms = [...root.querySelectorAll('.it,.kp,li,p,.ch,.pt tr,.hd,.sg')].filter(e => !e.closest('aside')).map(rel).filter(a => a[1] - a[0] > 1);
  /* sidebar: every block (heading + its list) stays together */
  root.querySelectorAll('aside').forEach(a => { let g = null; [...a.children].forEach(c => { const r = rel(c); if (c.tagName === 'H3') { g = [r[0], r[1]]; atoms.push(g) } else if (g) g[1] = Math.max(g[1], r[1]); else atoms.push(r) }) });
  const lastB = atoms.reduce((m, a) => Math.max(m, a[1]), 0);
  const pages = cutRegion(0, lastB, total, atoms, 0, 34, 30);
  return pages.length ? pages : [{ y0: 0, h: total, mt: 0 }];
}

let _css = null;
function cvCss() {
  if (_css) return _css; let t = '';
  for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) t += r.cssText + '\n' } catch (e) { } }
  const st = document.createElementNS('http://www.w3.org/1999/xhtml', 'style'); st.textContent = t;
  return _css = new XMLSerializer().serializeToString(st);
}

/* draw one page: the real browser renders the HTML inside an SVG image (crisp, fonts + Bangla shaping work) */
async function cvRaster(root, pg, S) {
  const html = new XMLSerializer().serializeToString(root), bg = getComputedStyle(root).backgroundImage;
  const bgCss = bg && bg !== 'none' ? `background-image:${bg};background-repeat:no-repeat;` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PGW * S}" height="${PGH * S}" viewBox="0 0 ${PGW} ${PGH}"><foreignObject x="0" y="0" width="${PGW}" height="${PGH}"><div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:${PGW}px;height:${PGH}px;overflow:hidden;background-color:#fff;${bgCss}">${cvCss()}<div style="position:absolute;left:0;top:${pg.mt}px;width:${PGW}px;height:${Math.ceil(pg.h)}px;overflow:hidden"><div style="position:absolute;left:0;top:${-pg.y0}px;width:${PGW}px">${html}</div></div></div></foreignObject></svg>`;
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('svg render failed')); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) });
  const c = document.createElement('canvas'); c.width = PGW * S; c.height = PGH * S; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

/* minimal PDF writer: one JPEG per A4 page */
function pdfFromCanvases(cs) {
  const te = new TextEncoder(), parts = [], offs = []; let pos = 0;
  const add = b => { if (typeof b === 'string') b = te.encode(b); parts.push(b); pos += b.length };
  const obj = (n, f) => { offs[n] = pos; add(n + ' 0 obj\n'); f(); add('\nendobj\n') };
  const N = cs.length; add('%PDF-1.4\n');
  obj(1, () => add('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => add(`<< /Type /Pages /Kids [${cs.map((_, i) => (5 + 3 * i) + ' 0 R').join(' ')}] /Count ${N} >>`));
  cs.forEach((c, i) => {
    const bin = atob(c.toDataURL('image/jpeg', .93).split(',')[1]), u = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) u[k] = bin.charCodeAt(k);
    obj(3 + 3 * i, () => { add(`<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${u.length} >>\nstream\n`); add(u); add('\nendstream') });
    const cn = 'q 595.28 0 0 841.89 0 0 cm /Im0 Do Q';
    obj(4 + 3 * i, () => add(`<< /Length ${cn.length} >>\nstream\n${cn}\nendstream`));
    obj(5 + 3 * i, () => add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ${3 + 3 * i} 0 R >> >> /Contents ${4 + 3 * i} 0 R >>`));
  });
  const total = 3 + 3 * N, xr = pos; add(`xref\n0 ${total}\n0000000000 65535 f \n`);
  for (let n = 1; n < total; n++) add(String(offs[n]).padStart(10, '0') + ' 00000 n \n');
  add(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`);
  return new Blob(parts, { type: 'application/pdf' });
}
function blobB64(b) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(b) }) }
async function savePdfBlob(name, blob) {
  if (isNative() && plug('Filesystem')) { await saveFile(name, await blobB64(blob), 'application/pdf', true); return }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

const _exportPDFOld = exportPDF;
exportPDF = async function () {
  if (!cv.name.trim()) { toast('আগে নাম লিখুন'); return }
  toast('PDF তৈরি হচ্ছে... একটু অপেক্ষা করুন');
  const name = (cv.name.trim().replace(/[^\w\u0980-\u09FF]+/g, '_') || 'My') + '_CV.pdf', m = cvMount();
  try {
    const cuts = computeCuts(m.root), S = cuts.length > 2 ? 2.1 : 2.5, cs = [];
    for (const pg of cuts) cs.push(await cvRaster(m.root, pg, S));
    await savePdfBlob(name, pdfFromCanvases(cs)); toast('✅ PDF তৈরি হয়েছে (' + bn(cs.length) + ' পাতা)');
  } catch (e) {
    console.error(e); m.wrap.remove();
    try { await _exportPDFOld() } catch (x) { toast('PDF তৈরি করা যায়নি — আবার চেষ্টা করুন') } return;
  }
  m.wrap.remove();
};

/* preview shows the very same page breaks the PDF will use */
const _fitPreview2 = fitPreview;
fitPreview = function () {
  _fitPreview2(); const i = $('#pwi'); if (!i) return;
  if (tpl === 't7') { const m = cvMount(); let n = 0, want = 0; try { n = computeCuts(m.root).length; want = m.root.querySelectorAll('.pg').length } catch (e) { } m.wrap.remove(); const pn = $('#pgn'); if (pn && n > want) pn.textContent = `⚠️ তথ্য বেশি হওয়ায় PDF ${bn(n)} পাতার হবে (বেছেছেন ${bn(want)} পাতা)। কম পাতা চাইলে কিছু তথ্য কমান, বা "ছোট" সাইজ/"কম্প্যাক্ট" বেছে নিন।`; return }
  i.querySelectorAll('.pgmark').forEach(x => x.remove());
  const m = cvMount(); let cuts = []; try { cuts = computeCuts(m.root) } catch (e) { } m.wrap.remove();
  cuts.slice(1).forEach((c, k) => { const d = document.createElement('div'); d.className = 'pgmark'; d.style.top = c.y0 + 'px'; d.innerHTML = `<span>পেজ ${bn(k + 2)} শুরু</span>`; i.appendChild(d) });
  const pn = $('#pgn'); if (pn) pn.textContent = `📄 মোট পেজ: ${bn(Math.max(1, cuts.length))}${cuts.length > 2 ? ' — সিভি ২ পেজের মধ্যে রাখা ভালো। কম্প্যাক্ট/ছোট সাইজ বা "প্রো" টেমপ্লেটের ১ পাতা বেছে দেখুন।' : cuts.length === 2 ? ' — অভিজ্ঞদের জন্য ঠিক আছে; ফ্রেশার হলে ১ পেজে আনার চেষ্টা করুন।' : ' — আদর্শ ✅'}`;
};
