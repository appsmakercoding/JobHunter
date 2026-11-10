/* ===== CV photo crop + signature (draw / upload) ===== */
const CW = 264, CH = 320;               // crop frame (3:4-ish, same ratio as 330x400 export)
let crop = null;
function pickPhoto(inp) {
  const f = inp.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { const im = new Image(); im.onload = () => { cropStart(im) }; im.onerror = () => toast('ছবিটি পড়া যায়নি'); im.src = r.result }; r.readAsDataURL(f); inp.value = '';
}
function recrop() { if (!cv.photo) return; const im = new Image(); im.onload = () => cropStart(im); im.src = cv.photo }
function cropStart(im) { crop = { im, z: 1, ox: 0, oy: 0 }; sheet(`<h3>✂️ ছবি ক্রপ করুন</h3><p class="muted">ছবি আঙুলে সরিয়ে মুখ ফ্রেমের মাঝে আনুন, নিচের স্লাইডার দিয়ে বড়-ছোট করুন।</p><div class="c"><canvas id="cc" width="${CW}" height="${CH}" style="touch-action:none;border-radius:14px;border:2px solid var(--g2);max-width:100%;background:#fff"></canvas></div><label>জুম</label><input id="cz" type="range" min="1" max="3" step="0.02" value="1" oninput="cropZoom(this.value)" style="padding:0"><div class="row mt"><button class="btn" style="flex:1" onclick="cropSave()">✓ ব্যবহার করুন</button><button class="btn gh" onclick="closeSheet()">বাতিল</button></div>`); cropInit() }
function cropBase() { const c = crop; return Math.max(CW / c.im.width, CH / c.im.height) }
function cropClamp() { const c = crop, s = cropBase() * c.z, mx = Math.max(0, (c.im.width * s - CW) / 2), my = Math.max(0, (c.im.height * s - CH) / 2); c.ox = Math.max(-mx, Math.min(mx, c.ox)); c.oy = Math.max(-my, Math.min(my, c.oy)) }
function cropPaint(ctx, W, H) { const c = crop, k = W / CW, s = cropBase() * c.z * k, w = c.im.width * s, h = c.im.height * s; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(c.im, W / 2 + c.ox * k - w / 2, H / 2 + c.oy * k - h / 2, w, h) }
function cropDraw() { const cv_ = $('#cc'); if (cv_) cropPaint(cv_.getContext('2d'), CW, CH) }
function cropZoom(v) { crop.z = +v; cropClamp(); cropDraw() }
function cropInit() {
  const c = $('#cc'); let drag = null; cropDraw();
  c.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ox: crop.ox, oy: crop.oy }; c.setPointerCapture(e.pointerId) });
  c.addEventListener('pointermove', e => { if (!drag) return; const r = c.getBoundingClientRect(), k = CW / r.width; crop.ox = drag.ox + (e.clientX - drag.x) * k; crop.oy = drag.oy + (e.clientY - drag.y) * k; cropClamp(); cropDraw() });
  const end = () => { drag = null }; c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
}
function cropSave() { const o = document.createElement('canvas'); o.width = 330; o.height = 400; cropPaint(o.getContext('2d'), 330, 400); cv.photo = o.toDataURL('image/jpeg', .92); save(); closeSheet(); crop = null; render(); toast('✅ ছবি যোগ হয়েছে') }

/* ---------- signature ---------- */
function trimCanvas(c) {
  const x = c.getContext('2d'), w = c.width, h = c.height, d = x.getImageData(0, 0, w, h).data; let t = h, l = w, r = 0, b = 0;
  for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 20) { if (i < l) l = i; if (i > r) r = i; if (y < t) t = y; if (y > b) b = y }
  if (r <= l || b <= t) return null; const p = 4, o = document.createElement('canvas'); o.width = r - l + 2 * p; o.height = b - t + 2 * p; o.getContext('2d').drawImage(c, l, t, r - l, b - t, p, p, r - l, b - t); return o;
}
function signSheet() {
  sheet(`<h3>✍️ স্বাক্ষর আঁকুন</h3><p class="muted">নিচের সাদা জায়গায় আঙুল দিয়ে স্বাক্ষর করুন।</p><div class="c"><canvas id="sp" width="520" height="200" style="touch-action:none;width:100%;max-width:520px;background:#fff;border:2px dashed var(--g2);border-radius:14px"></canvas></div><div class="row mt"><button class="btn" style="flex:1" onclick="signSave()">✓ সংরক্ষণ</button><button class="btn gh" onclick="signClear()">মুছুন</button><button class="btn gh" onclick="closeSheet()">বাতিল</button></div>`);
  const c = $('#sp'), x = c.getContext('2d'); x.lineWidth = 4; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#10243a'; let on = false, px = 0, py = 0;
  const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height] };
  c.addEventListener('pointerdown', e => { on = true;[px, py] = pos(e); x.beginPath(); x.arc(px, py, 1.5, 0, 7); x.fillStyle = '#10243a'; x.fill(); c.setPointerCapture(e.pointerId) });
  c.addEventListener('pointermove', e => { if (!on) return; const [a, b] = pos(e); x.beginPath(); x.moveTo(px, py); x.lineTo(a, b); x.stroke(); px = a; py = b });
  const end = () => { on = false }; c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
}
function signClear() { const c = $('#sp'); c.getContext('2d').clearRect(0, 0, c.width, c.height) }
function signSave() { const t = trimCanvas($('#sp')); if (!t) { toast('আগে স্বাক্ষর করুন'); return } cv.sign = t.toDataURL('image/png'); cvo.sign = true; saveO(); save(); closeSheet(); render(); toast('✅ স্বাক্ষর যোগ হয়েছে') }
// photo of a signature on white paper -> transparent PNG with dark ink
function signUpload(inp) {
  const f = inp.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { const im = new Image(); im.onload = () => {
    const s = Math.min(1, 700 / im.width), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); const x = c.getContext('2d'); x.drawImage(im, 0, 0, c.width, c.height);
    const d = x.getImageData(0, 0, c.width, c.height), p = d.data; let sum = 0; for (let i = 0; i < p.length; i += 4) sum += .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; const avg = sum / (p.length / 4), th = Math.min(215, avg - 18);
    for (let i = 0; i < p.length; i += 4) { const l = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2], a = Math.max(0, Math.min(1, (th - l) / 55)); p[i] = 16; p[i + 1] = 36; p[i + 2] = 58; p[i + 3] = Math.round(a * 255) }
    x.putImageData(d, 0, 0); const t = trimCanvas(c); if (!t) { toast('স্বাক্ষর পাওয়া যায়নি — সাদা কাগজে গাঢ় কলমে করে আবার ছবি তুলুন'); return }
    cv.sign = t.toDataURL('image/png'); cvo.sign = true; saveO(); save(); render(); toast('✅ স্বাক্ষর যোগ হয়েছে') }; im.src = r.result }; r.readAsDataURL(f); inp.value = '';
}
function signDel() { cv.sign = ''; save(); render() }
