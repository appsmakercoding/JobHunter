/* ===== Job Hunter 3.0 — exam prep: quiz, daily challenge, mistakes, viva, guides ===== */
let quiz = null, qcat = 'সব';
let stats = Object.assign({ days: [], tests: 0, best: 0, correct: 0, total: 0, daily: '' }, LS.get('stats', {}));
let wrongSet = new Set(LS.get('wrong', []));
const dailyDone = () => stats.daily === ld(new Date());
const streak = () => { let n = 0, d = new Date(); if (!stats.days.includes(ld(d))) d.setDate(d.getDate() - 1); while (stats.days.includes(ld(d))) { n++; d.setDate(d.getDate() - 1) } return n };
const rnd = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
function seeded(seed) { let h = 2166136261; for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) } return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
function prepQ(q) { const o = q[2].map((t, i) => ({ t, ok: i === q[3] })); rnd(o); return { c: q[0], q: q[1], o: o.map(x => x.t), a: o.findIndex(x => x.ok) } }
function startQuiz(c, mins) {
  qcat = c; let src = QUIZ.filter(inExam);
  if (c === 'ভুল') src = QUIZ.filter(q => wrongSet.has(q[1]));
  let l;
  if (c === 'daily') { const r = seeded(ld(new Date())); l = QUIZ.map(q => [r(), q]).sort((a, b) => a[0] - b[0]).slice(0, 5).map(x => x[1]) }
  else { l = rnd(src.filter(q => c === 'সব' || c === 'ভুল' || q[0] === c).slice()); if (mins) l = l.slice(0, mins) }
  if (!l.length) { toast(c === 'ভুল' ? 'ভুলের খাতা খালি — দারুণ! 🎉' : 'প্রশ্ন নেই'); return }
  quiz = { l: l.map(prepQ), raw: l, i: 0, s: 0, sel: null, done: 0, end: mins ? Date.now() + mins * 6e4 : 0, mode: c, wrong: [] }; render(); scrollTo(0, 0);
}
function setExam(k) { qexam = qexam === k ? '' : k; qcat = 'সব'; quiz = null; render() }
function retryQuiz() { if (quiz.mode === 'vocab') vocabQuiz(); else if (quiz.mode === 'daily') startQuiz('সব'); else startQuiz(qcat, quiz.end ? quiz.l.length : 0) }
function ans(i) { if (quiz.sel !== null) return; quiz.sel = i; const q = quiz.l[quiz.i], k = quiz.raw[quiz.i][1]; if (i === q.a) { quiz.s++; if (quiz.mode === 'ভুল') wrongSet.delete(k) } else { quiz.wrong.push({ q, pick: i }); wrongSet.add(k) } LS.set('wrong', [...wrongSet]); render() }
function nextQ() { quiz.i++; quiz.sel = null; if (quiz.i >= quiz.l.length) fin(); render(); scrollTo(0, 0) }
function fin() {
  if (quiz.done) return; quiz.done = 1; const n = quiz.l.length, p = Math.round(quiz.s / n * 100);
  stats.tests++; stats.best = Math.max(stats.best, p); stats.correct += quiz.s; stats.total += quiz.i >= n ? n : quiz.i;
  const t = ld(new Date()); if (!stats.days.includes(t)) stats.days.push(t); if (quiz.mode === 'daily') stats.daily = t; stats.days = stats.days.slice(-400); LS.set('stats', stats);
}
setInterval(() => { if (quiz && quiz.end && !quiz.done) { const t = Math.max(0, Math.round((quiz.end - Date.now()) / 1000)), e = $('#tm'); if (e) e.textContent = '⏱ ' + bn(Math.floor(t / 60)) + ':' + bn(String(t % 60).padStart(2, '0')); if (!t) { quiz.i = quiz.l.length; fin(); render() } } }, 1000);
const acc = a => a.map(x => `<details><summary>${esc(x[0])}</summary><p>${esc(x[1])}</p></details>`).join('');
function pQuiz() {
  const pool = QUIZ.filter(inExam), cats = ['সব', ...new Set(pool.map(q => q[0]))], wn = wrongSet.size;
  let h = `${back()}<h2>🧠 মডেল টেস্ট</h2>`;
  if (!quiz || (quiz.done && quiz.i >= quiz.l.length && false)) { }
  const menu = `${dailyDone() ? '' : `<div class="card hl row sb"><div><b>🔥 আজকের চ্যালেঞ্জ</b><div class="muted">৫টি প্রশ্ন — স্ট্রিক ধরে রাখুন</div></div><button class="btn s" onclick="startQuiz('daily')">শুরু</button></div>`}
<div class="xp"><div class="card"><b>${bn(streak())}</b><span class="muted sm">🔥 স্ট্রিক</span></div><div class="card"><b>${bn(stats.best)}%</b><span class="muted sm">🏆 সেরা</span></div><div class="card"><b>${bn(stats.tests)}</b><span class="muted sm">📝 টেস্ট</span></div><div class="card"><b>${stats.total ? bn(Math.round(stats.correct / stats.total * 100)) : '০'}%</b><span class="muted sm">🎯 নির্ভুলতা</span></div></div>
<h3>পরীক্ষা বেছে নিন</h3><div class="chips"><button class="chip ${!qexam ? 'on' : ''}" onclick="setExam('')">সব</button>${Object.keys(EXAMS).map(k => `<button class="chip ${qexam === k ? 'on' : ''}" onclick="setExam('${k}')">${EXAMS[k][1]} ${EXAMS[k][0]}</button>`).join('')}</div><h3>বিষয় বেছে অনুশীলন (${bn(pool.length)}টি প্রশ্ন${qexam ? ' — ' + EXAMS[qexam][0] : ''})</h3><div class="chips" style="flex-wrap:wrap;overflow:visible">${cats.map(c => `<button class="chip ${qcat === c && quiz ? 'on' : ''}" onclick="startQuiz('${c}')">${c}</button>`).join('')}</div>
<h3>⏱ মক পরীক্ষা (সময় বাঁধা)</h3><div class="row"><button class="btn o s" onclick="startQuiz('সব',10)">১০টি · ১০ মিনিট</button><button class="btn o s" onclick="startQuiz('সব',20)">২০টি · ২০ মিনিট</button><button class="btn o s" onclick="startQuiz('সব',30)">৩০টি · ৩০ মিনিট</button></div>
<button class="btn gh w" onclick="startQuiz('ভুল')">📕 ভুলের খাতা থেকে অনুশীলন (${bn(wn)}টি)</button>`;
  if (!quiz) return h + menu;
  if (quiz.i >= quiz.l.length) {
    const n = quiz.l.length, p = Math.round(quiz.s / n * 100);
    return h + `<div class="card c"><div style="font-size:40px">${p >= 80 ? '🎉' : p >= 50 ? '💪' : '📚'}</div><h3>ফলাফল</h3><b style="font-size:30px">${bn(quiz.s)} / ${bn(n)} (${bn(p)}%)</b><p>${p >= 80 ? 'চমৎকার! এভাবেই চালিয়ে যান।' : p >= 50 ? 'ভালো হয়েছে — ভুলগুলো ঝালিয়ে নিন।' : 'নিয়মিত অনুশীলনে উন্নতি হবেই।'}</p><div class="row" style="justify-content:center"><button class="btn" onclick="retryQuiz()">আবার চেষ্টা</button><button class="btn o" onclick="quiz=null;render()">মেনু</button></div></div>
${quiz.wrong.length ? `<h3>❌ ভুল উত্তরগুলো (${bn(quiz.wrong.length)})</h3>${quiz.wrong.map(w => `<div class="card"><b>${esc(w.q.q)}</b><div class="muted" style="color:var(--r)">আপনার উত্তর: ${esc(w.q.o[w.pick])}</div><div style="color:#1a9d62;font-weight:600">সঠিক: ${esc(w.q.o[w.q.a])}</div></div>`).join('')}<p class="muted">ভুল প্রশ্নগুলো "ভুলের খাতা"-য় জমা হয়েছে।</p>` : ''}`;
  }
  const q = quiz.l[quiz.i], last = quiz.i === quiz.l.length - 1;
  return h + `<div class="bar"><i style="width:${Math.round(quiz.i / quiz.l.length * 100)}%"></i></div><div class="card"><span class="pill">${esc(q.c)}</span> <span class="muted">${bn(quiz.i + 1)}/${bn(quiz.l.length)}</span> ${quiz.end ? '<span class="pill red" id="tm"></span>' : ''}<h3>${esc(q.q)}</h3>${q.o.map((o, i) => `<button class="opt ${quiz.sel !== null ? (i === q.a ? 'ok' : i === quiz.sel ? 'no' : '') : ''}" onclick="ans(${i})">${esc(o)}</button>`).join('')}${quiz.sel !== null ? `<button class="btn w" onclick="nextQ()">${last ? 'ফলাফল দেখুন ✓' : 'পরের প্রশ্ন →'}</button>` : ''}</div><button class="btn gh s" onclick="if(confirm('টেস্ট শেষ করবেন?')){quiz=null;render()}">✕ বাতিল</button>`;
}
let vt = null;
function vivaNext() {
  if (!$('#vt')) return; const q = INTERVIEW[Math.floor(Math.random() * INTERVIEW.length)];
  $('#vq').textContent = q[0]; $('#va').textContent = q[1]; $('#va').style.display = 'none'; let n = 90; clearInterval(vt); $('#vt').textContent = '৯০s';
  vt = setInterval(() => { if (!$('#vt')) { clearInterval(vt); return } n--; $('#vt').textContent = bn(n) + 's'; if (n <= 0) clearInterval(vt) }, 1000);
}
const pInterview = () => `${back()}<h2>🎤 ইন্টারভিউ প্রস্তুতি</h2><div class="card hl"><b>🎲 মক ভাইভা</b> <span class="pill red" id="vt">৯০s</span><h3 id="vq">বাটন চাপুন, ৯০ সেকেন্ডে জোরে উত্তর দিন</h3><p id="va" class="muted" style="display:none"></p><div class="row"><button class="btn s" onclick="vivaNext()">নতুন প্রশ্ন</button><button class="btn o s" onclick="$('#va').style.display='block'">💡 কৌশল দেখুন</button></div></div>
<div class="card"><b>⭐ STAR পদ্ধতিতে উত্তর দিন</b><div class="tip">S — Situation: কী পরিস্থিতি ছিল?</div><div class="tip">T — Task: আপনার দায়িত্ব কী ছিল?</div><div class="tip">A — Action: আপনি কী করলেন?</div><div class="tip">R — Result: ফল কী হলো (সংখ্যাসহ)?</div></div>
<div class="card"><b>✅ ইন্টারভিউয়ের দিনের চেকলিস্ট</b><div class="tip">📎 সিভির ৩ কপি, সনদের মূল ও ফটোকপি, ছবি</div><div class="tip">👔 ফরমাল পোশাক, পরিষ্কার জুতা</div><div class="tip">⏰ ১৫–২০ মিনিট আগে পৌঁছান; ফোন সাইলেন্ট রাখুন</div><div class="tip">🙂 হাসিমুখে সালাম/শুভেচ্ছা, চোখে চোখ রেখে কথা</div><div class="tip">🙏 শেষে ধন্যবাদ জানান; পরে ছোট একটি Thank-you মেইল পাঠান</div></div>
<h3>সাধারণ প্রশ্ন ও উত্তরের কৌশল</h3>${acc(INTERVIEW)}`;
const pBcs = () => `${back()}<h2>🏛️ সরকারি চাকরি গাইড</h2>${acc(GUIDE)}<div class="row"><a data-ext class="btn" href="https://alljobs.teletalk.com.bd">টেলিটক পোর্টাল ↗</a><button class="btn o" onclick="go('age')">🎂 বয়স ক্যালকুলেটর</button></div>`;
const pTips = () => `${back()}<h2>💡 ক্যারিয়ার টিপস</h2>${acc(TIPS)}`;
function pPrep() {
  return `<h2>🎯 পরীক্ষার প্রস্তুতি</h2>${dailyDone() ? '' : `<div class="card hl row sb"><div><b>🔥 আজকের চ্যালেঞ্জ</b><div class="muted">৫টি প্রশ্ন · স্ট্রিক ${bn(streak())} দিন</div></div><button class="btn s" onclick="go('quiz');startQuiz('daily')">শুরু</button></div>`}<div class="chips">${Object.keys(EXAMS).map(k => `<button class="chip" onclick="qexam='${k}';qcat='সব';quiz=null;go('quiz')">${EXAMS[k][1]} ${EXAMS[k][0]} প্রস্তুতি</button>`).join('')}</div><div class="grid">
<button class="tile" onclick="go('quiz')"><span class="i c1">🧠</span><div><b>মডেল টেস্ট</b><small>${bn(QUIZ.length)}টি MCQ + BCS/ব্যাংক/প্রাথমিক</small></div></button>
<button class="tile" onclick="go('interview')"><span class="i c3">🎤</span><div><b>ইন্টারভিউ</b><small>মক ভাইভা ও উত্তর</small></div></button>
<button class="tile" onclick="go('bcs')"><span class="i c4">🏛️</span><div><b>সরকারি চাকরি</b><small>BCS, ব্যাংক, শিক্ষক</small></div></button>
<button class="tile" onclick="go('age')"><span class="i c5">🎂</span><div><b>বয়স হিসাব</b><small>আবেদনের শেষ দিনে</small></div></button>
<button class="tile" onclick="go('docs')"><span class="i c6">🗂️</span><div><b>ডকুমেন্ট</b><small>আবেদনের কাগজ চেকলিস্ট</small></div></button>
<button class="tile" onclick="go('tips')"><span class="i c2">💡</span><div><b>ক্যারিয়ার টিপস</b><small>সিভি থেকে ভাইভা</small></div></button></div>`;
}
