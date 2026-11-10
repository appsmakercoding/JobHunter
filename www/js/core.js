/* ===== Job Hunter 3.0 — core: helpers, state, native bridge ===== */
const $ = s => document.querySelector(s);
const LS = {
  get: (k, d) => { try { const v = JSON.parse(localStorage.getItem('jh_' + k) ?? localStorage.getItem(k)); return v ?? d } catch (e) { return d } },
  set: (k, v) => { try { localStorage.setItem('jh_' + k, JSON.stringify(v)) } catch (e) { } },
  del: k => { try { localStorage.removeItem('jh_' + k); localStorage.removeItem(k) } catch (e) { } },
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const attr = s => esc(s).replace(/`/g, '&#96;');
let _tt; const toast = m => { const t = $('#toast'); t.textContent = m; t.className = 'on'; clearTimeout(_tt); _tt = setTimeout(() => t.className = '', 2600) };
const BN = '০১২৩৪৫৬৭৮৯'; const bn = n => String(n).replace(/\d/g, d => BN[d]);
const isNative = () => { const C = window.Capacitor; return !!(C && C.isNativePlatform && C.isNativePlatform()) };
const plug = n => (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n]) || null;
const ld = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const daysLeft = d => Math.ceil((new Date(d + 'T00:00:00') - new Date(new Date().toDateString())) / 864e5);
const clone = o => JSON.parse(JSON.stringify(o));
const SH = (t, u, x) => { const S = plug('Share'); if (isNative() && S) return S.share({ title: t, text: x, url: u, dialogTitle: t }); if (navigator.share) return navigator.share({ title: t, text: x, url: u }); return Promise.reject() };

function openUrl(u) {
  if (!/^https?:\/\//i.test(u)) return;
  const B = plug('Browser');
  if (isNative() && B) { B.open({ url: u }).catch(() => { location.href = u }); return }
  window.open(u, '_blank') || (location.href = u);
}
document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[data-ext]'); if (a) { e.preventDefault(); openUrl(a.getAttribute('href')) } });
const ext = (u, t, cls = '') => `<a data-ext href="${attr(u)}" class="${cls}" rel="noopener">${t}</a>`;

async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true } catch (e) {
    try { const a = document.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(a); a.select(); const ok = document.execCommand('copy'); a.remove(); return ok } catch (x) { return false }
  }
}
// save/share a Blob or text file on web + Android
async function saveFile(name, data, mime, isB64) {
  if (isNative() && plug('Filesystem')) {
    const F = plug('Filesystem');
    const b64 = isB64 ? data : btoa(unescape(encodeURIComponent(data)));
    const r = await F.writeFile({ path: name, data: b64, directory: 'CACHE' });
    await SH(name, r.uri, '').catch(() => { });
    return;
  }
  const blob = isB64 ? new Blob([Uint8Array.from(atob(data), c => c.charCodeAt(0))], { type: mime }) : new Blob([data], { type: mime });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/* ---------- global state ---------- */
const PROFILE = LS.get('me', { name: '', goal: '', onb: 0 });
let route = 'home';
const saveMe = () => LS.set('me', PROFILE);

/* ---------- router ---------- */
function go(r, noPush) { if (!noPush) history.pushState({ r }, ''); route = r; render(); scrollTo(0, 0) }
onpopstate = e => { route = (e.state && e.state.r) || 'home'; render() };
const back = () => `<div class="row" style="margin:10px 0 0"><button class="btn gh s" onclick="history.back()">← ফিরে যান</button></div>`;

/* ---------- theme / font ---------- */
function applyTheme() {
  const t = LS.get('theme', matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
  document.body.className = 'fs-' + LS.get('fs', 'm');
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#0d1512' : '#00704f';
}
function toggleTheme() { LS.set('theme', document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); applyTheme() }
function setFS(v) { LS.set('fs', v); applyTheme(); render() }

/* ---------- Android back button ---------- */
function initNative() {
  const A = plug('App');
  if (isNative() && A) {
    A.addListener('backButton', () => {
      const sh = $('.sheet'); if (sh) { sh.remove(); return }
      if (route !== 'home' && history.length > 1) history.back();
      else if (route !== 'home') go('home', true);
      else A.exitApp();
    });
  }
}

/* ---------- bottom sheet ---------- */
function sheet(html) { closeSheet(); const d = document.createElement('div'); d.className = 'sheet'; d.innerHTML = `<div>${html}</div>`; d.addEventListener('click', e => { if (e.target === d) d.remove() }); document.body.appendChild(d) }
function closeSheet() { const s = $('.sheet'); if (s) s.remove() }

/* ---------- generic PDF (image based, supports Bangla) ---------- */
async function elementToPDF(el, name, opt = {}) {
  if (!window.html2pdf) { toast('PDF লাইব্রেরি পাওয়া যায়নি — অ্যাপ আপডেট করুন'); return false }
  const w = html2pdf().set({
    margin: opt.margin || [10, 0, 10, 0], filename: name,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: opt.scale || 2.5, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: 794 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
    pagebreak: { mode: ['css', 'legacy'], avoid: opt.avoid || ['.kp', '.it', 'tr', 'li'] },
  }).from(el);
  if (isNative() && plug('Filesystem')) {
    const uri = await w.outputPdf('datauristring');
    const r = await plug('Filesystem').writeFile({ path: name, data: uri.split(',')[1], directory: 'CACHE' });
    await SH(name, r.uri, '').catch(() => { });
  } else await w.save();
  return true;
}
