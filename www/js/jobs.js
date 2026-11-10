/* ===== Job Hunter 3.0 — Jobs, alerts, saved, tracker ===== */
let jobTab = 'live', live = { items: [], updated: '' }, liveBusy = false, jq = '', jt = '', jc = '', jlim = 25, loc = '', kw = '', jobCat = 'govt';
let saved = LS.get('saved', []), alerts = LS.get('alerts', []), seen = new Set(LS.get('seenurls', []));
let jobs = LS.get('jobs', []);   // tracker entries
const LOCS = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ', 'সারা দেশ'];
const JT = [['', 'সব'], ['bd', '🇧🇩 বাংলাদেশ'], ['remote', '🏠 রিমোট'], ['abroad', '✈️ বিদেশ'], ['alert', '🔔 আমার অ্যালার্ট']];
const JC = [['', 'সব ধরন'], ['govt', '🏛️ সরকারি'], ['bank', '🏦 ব্যাংক'], ['it', '💻 আইটি'], ['ngo', '🌍 এনজিও'], ['edu', '📚 শিক্ষা'], ['other', 'অন্যান্য']];
const TYPEN = { bd: 'বাংলাদেশ', remote: 'রিমোট', abroad: 'বিদেশ' };
const ST = ['আবেদন করব', 'আবেদন করেছি', 'পরীক্ষা/লিখিত', 'ইন্টারভিউ', 'অফার পেয়েছি', 'প্রত্যাখ্যাত'];
const ago = d => { if (!d) return ''; const n = -daysLeft(d); return n <= 0 ? 'আজ' : n === 1 ? 'গতকাল' : bn(n) + ' দিন আগে' };
const isSaved = u => saved.some(x => x.url === u);

async function loadLive(force) {
  if (liveBusy) return; liveBusy = true;
  const c = LS.get('live', null); if (c && c.items && c.items.length) live = c;
  if (route === 'jobs') render();
  const U = window.JOBS_URL || ''; let ok = false;
  try { if (U && !U.includes('__')) { const r = await fetch(U + '?t=' + Date.now()); if (r.ok) { const j = await r.json(); if (j && j.items) { live = j; LS.set('live', live); ok = true } } } } catch (e) { }
  if (!ok && !live.items.length) { try { const r = await fetch('data/jobs.json'); if (r.ok) { live = await r.json(); ok = true } } catch (e) { } }
  liveBusy = false;
  if (force) toast(ok ? '✅ চাকরির তালিকা আপডেট হয়েছে' : '⚠️ ইন্টারনেট নেই — সংরক্ষিত তালিকা দেখানো হচ্ছে');
  notifyAlerts(); if (route === 'jobs' || route === 'home') render();
}
const haystack = j => (j.title + ' ' + j.org + ' ' + j.loc + ' ' + (j.tags || []).join(' ')).toLowerCase();
const match = (j, q) => q.toLowerCase().split(/\s+/).filter(Boolean).every(t => haystack(j).includes(t));
const alertHit = j => alerts.some(a => match(j, a));
const newAlertJobs = () => alerts.length ? live.items.filter(j => alertHit(j) && !seen.has(j.url)) : [];
function markSeen() { live.items.forEach(j => seen.add(j.url)); LS.set('seenurls', [...seen].slice(-800)) }
async function notifyAlerts() {
  const n = newAlertJobs().length; if (!n || !isNative() || !plug('LocalNotifications') || LS.get('notified', '') === live.updated) return;
  try { const L = plug('LocalNotifications'); const p = await L.checkPermissions(); if (p.display !== 'granted') return; LS.set('notified', live.updated); await L.schedule({ notifications: [{ id: 7001, title: '🔔 ' + bn(n) + 'টি নতুন চাকরি', body: 'আপনার অ্যালার্টের সাথে মিলে গেছে — Job Hunter খুলে দেখুন', schedule: { at: new Date(Date.now() + 3000) } }] }) } catch (e) { }
}
function filtered() {
  let L = live.items.map((j, i) => ({ ...j, i }));
  if (jt === 'alert') L = L.filter(alertHit); else if (jt) L = L.filter(j => j.type === jt);
  if (jc) L = L.filter(j => j.cat === jc);
  if (jq.trim()) L = L.filter(j => match(j, jq));
  return L;
}
function jobCard(j) {
  const dl = j.deadline ? daysLeft(j.deadline) : null, fresh = j.date && -daysLeft(j.date) <= 2, s = isSaved(j.url);
  return `<div class="card job"><button class="star ${s ? 'on' : ''}" aria-label="সেভ" onclick="toggleSave(${j.i})">${s ? '★' : '☆'}</button>
<h4>${esc(j.title)}</h4><div class="muted"><span class="badge ${j.type}">${TYPEN[j.type] || ''}</span>${fresh ? '<span class="badge new">নতুন</span>' : ''}${esc(j.org)}${j.loc ? ' • ' + esc(j.loc) : ''}${j.date ? ' • ' + ago(j.date) : ''}</div>
${(j.tags || []).length ? `<div style="margin-top:5px">${j.tags.slice(0, 3).map(t => `<span class="pill">${esc(t)}</span>`).join(' ')}</div>` : ''}${dl !== null ? `<div style="margin-top:5px"><span class="pill ${dl <= 3 ? 'red' : 'gold'}">⏰ ডেডলাইন ${esc(j.deadline)} (${dl < 0 ? 'শেষ' : bn(dl) + ' দিন'})</span></div>` : ''}
<div class="row" style="margin-top:9px">${ext(j.url, 'বিস্তারিত ↗', 'btn s')}<button class="btn gh s" onclick="trackLive(${j.i})">📌 ট্র্যাক</button><button class="btn gh s" onclick="shareJob(${j.i})">📤</button></div></div>`;
}
function toggleSave(i) {
  const j = live.items[i]; if (!j) return; const k = saved.findIndex(x => x.url === j.url);
  if (k >= 0) saved.splice(k, 1); else saved.unshift({ ...j, savedAt: ld(new Date()) });
  LS.set('saved', saved); toast(k >= 0 ? 'সেভ তালিকা থেকে সরানো হয়েছে' : '⭐ সেভ হয়েছে'); if (jobTab === 'saved') render(); else $('#jl').innerHTML = liveList();
}
function unsave(i) { saved.splice(i, 1); LS.set('saved', saved); render() }
async function shareJob(i) { const j = live.items[i]; const t = `${j.title} — ${j.org}\n${j.url}\n(Job Hunter অ্যাপ থেকে)`; try { await SH('চাকরির বিজ্ঞপ্তি', j.url, t) } catch (e) { toast(await copyText(t) ? 'লিংক কপি হয়েছে' : 'শেয়ার করা যায়নি') } }
function trackLive(i) { const j = live.items[i]; addTrack({ co: j.org, pos: j.title, date: j.deadline || '', st: ST[0], note: '', url: j.url }); toast('📌 ট্র্যাকারে যোগ হয়েছে') }
function liveList() {
  const L = filtered();
  if (liveBusy && !live.items.length) return '<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
  if (!L.length) return `<div class="card c"><div style="font-size:34px">🔍</div><b>${live.items.length ? 'কিছু পাওয়া যায়নি' : 'এখনো তালিকা লোড হয়নি'}</b><p class="muted">${live.items.length ? 'অন্য শব্দ বা ফিল্টার চেষ্টা করুন। 🔔 অ্যালার্ট সেট করলে নতুন মিললে জানানো হবে।' : 'ইন্টারনেট চালু করে 🔄 চাপুন। তথ্য প্রথমবার লোড হলে অফলাইনেও দেখা যাবে।'}</p>${jq ? `<button class="btn gh s" onclick="addAlert(jq)">🔔 "${esc(jq)}" অ্যালার্ট করুন</button>` : ''}</div>`;
  return L.slice(0, jlim).map(jobCard).join('') + (L.length > jlim ? `<button class="btn o w" onclick="jlim+=25;$('#jl').innerHTML=liveList()">আরও দেখুন (${bn(L.length - jlim)}টি বাকি)</button>` : '');
}
function addAlert(k) { k = String(k || '').trim().toLowerCase(); if (!k) { toast('কীওয়ার্ড লিখুন'); return } if (!alerts.includes(k)) { alerts.push(k); LS.set('alerts', alerts) } toast('🔔 অ্যালার্ট সেট: ' + k); render() }
function delAlert(i) { alerts.splice(i, 1); LS.set('alerts', alerts); render() }
function alertSheet() {
  sheet(`<h3>🔔 জব অ্যালার্ট</h3><p class="muted">পদের নাম বা কীওয়ার্ড দিন (যেমন: ব্যাংক, শিক্ষক, software)। নতুন চাকরি মিললে হোম স্ক্রিনে ও নোটিফিকেশনে জানানো হবে।</p><input id="al" placeholder="যেমন: ব্যাংক / ফ্রেশার / developer"><button class="btn w" onclick="addAlert($('#al').value);closeSheet()">＋ অ্যালার্ট যোগ করুন</button>${alerts.map((a, i) => `<div class="trow"><span>🔔 ${esc(a)}</span><button class="btn r s" onclick="delAlert(${i});alertSheet()">মুছুন</button></div>`).join('')}`);
}
function pLive() {
  const na = newAlertJobs().length;
  return `<div class="row sb"><span class="muted">${live.updated ? 'আপডেট: ' + new Date(live.updated).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' }) : 'আপডেট হয়নি'} · ${bn(live.items.length)}টি জব</span><button class="btn gh s" onclick="loadLive(1)">${liveBusy ? '⏳' : '🔄 রিফ্রেশ'}</button></div>
<div class="sbox" style="background:var(--card);border:1.5px solid var(--b);margin:8px 0"><input id="jq" placeholder="🔎 পদ / কোম্পানি / স্কিল / এলাকা" value="${attr(jq)}" oninput="jq=this.value;jlim=25;$('#jl').innerHTML=liveList()" style="color:var(--t)"><button class="ib" style="width:auto;padding:0 12px;border:0;background:var(--soft)" onclick="alertSheet()">🔔</button></div>
${na ? `<div class="card hl row sb"><b>🔔 ${bn(na)}টি নতুন চাকরি আপনার অ্যালার্টে মিলেছে</b><button class="btn s" onclick="jt='alert';markSeen();render()">দেখুন</button></div>` : ''}
<div class="chips">${JT.map(t => `<button class="chip ${jt === t[0] ? 'on' : ''}" onclick="jt='${t[0]}';jlim=25;render()">${t[1]}</button>`).join('')}</div><div class="chips">${JC.map(t => `<button class="chip ${jc === t[0] ? 'on' : ''}" onclick="jc='${t[0]}';jlim=25;render()">${t[1]}</button>`).join('')}</div>
<div id="jl">${liveList()}</div><p class="muted">সূত্র: নিয়োগ সংবাদ, Remotive, RemoteOK, Jobicy, Arbeitnow, The Muse ও Job Hunter-এর সংগৃহীত সার্কুলার। <b>আবেদনের আগে মূল সাইটে যাচাই করুন।</b> চাকরির নামে টাকা চাইলে সাবধান।</p>`;
}
const pSaved = () => saved.length ? saved.map((j, i) => `<div class="card job"><button class="star on" onclick="unsave(${i})">★</button><h4>${esc(j.title)}</h4><div class="muted">${esc(j.org)}${j.loc ? ' • ' + esc(j.loc) : ''}</div>${j.deadline ? `<span class="pill ${daysLeft(j.deadline) <= 3 ? 'red' : 'gold'}">⏰ ${esc(j.deadline)}</span>` : ''}<div class="row" style="margin-top:8px">${ext(j.url, 'বিস্তারিত ↗', 'btn s')}<button class="btn gh s" onclick="trackSaved(${i})">📌 ট্র্যাক</button></div></div>`).join('') : '<div class="card c"><div style="font-size:34px">⭐</div><b>কোনো সেভ করা চাকরি নেই</b><p class="muted">চাকরির কার্ডের ☆ চাপলে এখানে জমা হবে।</p></div>';
function trackSaved(i) { const j = saved[i]; addTrack({ co: j.org, pos: j.title, date: j.deadline || '', st: ST[0], note: '', url: j.url }); toast('📌 ট্র্যাকারে যোগ হয়েছে') }
function gsearch(site, per) { const q = encodeURIComponent((kw || 'চাকরির বিজ্ঞপ্তি') + ' ' + (loc && loc !== 'সারা দেশ' ? loc + ' ' : '') + 'নিয়োগ circular' + (site ? ' site:' + site : '')); openUrl('https://www.google.com/search?q=' + q + (per ? '&tbs=qdr:' + per : '')) }
const pSearch = () => `<div class="card"><label>কী ধরনের চাকরি?</label><input id="kw" value="${attr(kw)}" placeholder="যেমন: ব্যাংক, শিক্ষক, সফটওয়্যার" oninput="kw=this.value"><div class="chips">${KEYS.map(k => `<button class="chip" onclick="kw='${k}';render()">${k}</button>`).join('')}</div><label>এলাকা</label><div class="chips">${LOCS.map(l => `<button class="chip ${loc === l ? 'on' : ''}" onclick="loc=loc==='${l}'?'':'${l}';render()">${l}</button>`).join('')}</div><label>কত দিনের মধ্যে প্রকাশিত?</label><div class="row"><button class="btn s" onclick="gsearch('','d')">২৪ ঘণ্টা</button><button class="btn s" onclick="gsearch('','w')">৭ দিন</button><button class="btn s" onclick="gsearch('','m')">৩০ দিন</button></div><label style="margin-top:10px">নির্দিষ্ট সাইটে (গত ৭ দিন)</label><div class="row"><button class="btn o s" onclick="gsearch('bdjobs.com','w')">BDJobs</button><button class="btn o s" onclick="gsearch('alljobs.teletalk.com.bd','w')">সরকারি</button><button class="btn o s" onclick="gsearch('linkedin.com/jobs','w')">LinkedIn</button><button class="btn o s" onclick="gsearch('facebook.com','w')">Facebook</button></div></div>`;
const pPortal = () => `<div class="chips">${CATS.map(c => `<button class="chip ${jobCat === c[0] ? 'on' : ''}" onclick="jobCat='${c[0]}';render()">${c[1]}</button>`).join('')}</div>${PORTALS.filter(p => p.c === jobCat).map(p => `<div class="card">${ext(p.u, esc(p.n) + ' ↗')}<br><span class="muted">${esc(p.d)}</span></div>`).join('')}<p class="muted">⚠️ আবেদনের আগে অফিসিয়াল সাইটে বিজ্ঞপ্তি যাচাই করুন। চাকরির নামে টাকা চাইলে সতর্ক হোন।</p>`;
function pJobs() {
  const T = [['live', '🆕 লাইভ'], ['saved', '⭐ সেভ' + (saved.length ? ' ' + bn(saved.length) : '')], ['search', '🔎 সার্চ'], ['portal', '🌐 পোর্টাল']];
  const body = jobTab === 'live' ? pLive() : jobTab === 'saved' ? pSaved() : jobTab === 'search' ? pSearch() : pPortal();
  if (jobTab === 'live' && live.items.length) setTimeout(() => { if (route === 'jobs' && jobTab === 'live' && !newAlertJobs().length) markSeen() }, 4000);
  return `<h2>💼 চাকরি</h2><div class="tabs">${T.map(t => `<button class="${jobTab === t[0] ? 'on' : ''}" onclick="jobTab='${t[0]}';render()">${t[1]}</button>`).join('')}</div>${body}`;
}

/* ---------- application tracker + reminders ---------- */
const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return Math.abs(h) % 1e8 };
function addTrack(nj) { nj.id = nj.id || Date.now(); jobs.unshift(nj); LS.set('jobs', jobs); remind(nj) }
async function remind(j) {
  if (!isNative() || !j.date || !plug('LocalNotifications')) return;
  try {
    const L = plug('LocalNotifications'); let p = await L.checkPermissions(); if (p.display !== 'granted') p = await L.requestPermissions(); if (p.display !== 'granted') return;
    const base = hash(j.pos + j.co + j.date) * 10, ns = [];
    [[3, 'আর ৩ দিন বাকি'], [1, 'ডেডলাইন আগামীকাল'], [0, 'আজই শেষ দিন!']].forEach(([off, msg], k) => { const d = new Date(j.date + 'T09:00:00'); d.setDate(d.getDate() - off); if (d > new Date()) ns.push({ id: base + k, title: '⏰ ' + msg, body: j.pos + ' — ' + j.co, schedule: { at: d } }) });
    if (ns.length) { await L.schedule({ notifications: ns }); toast('⏰ রিমাইন্ডার সেট হয়েছে') }
  } catch (e) { }
}
async function unremind(j) { if (!isNative() || !j.date || !plug('LocalNotifications')) return; try { const b = hash(j.pos + j.co + j.date) * 10; await plug('LocalNotifications').cancel({ notifications: [0, 1, 2].map(k => ({ id: b + k })) }) } catch (e) { } }
function addJob() { const co = $('#jc').value.trim(), pos = $('#jp').value.trim(); if (!co || !pos) { toast('কোম্পানি ও পদ লিখুন'); return } addTrack({ co, pos, date: $('#jd').value, st: ST[0], note: $('#jn').value, url: '' }); render() }
function setSt(i, v) { jobs[i].st = v; LS.set('jobs', jobs); render() }
function delJob(i) { if (!confirm('মুছবেন?')) return; unremind(jobs[i]); jobs.splice(i, 1); LS.set('jobs', jobs); render() }
let tf = '';
function pTracker() {
  const cnt = s => jobs.filter(j => j.st === s).length, list = jobs.map((j, i) => ({ ...j, i })).filter(j => !tf || j.st === tf);
  return `${back()}<h2>📌 আবেদন ট্র্যাকার</h2><div class="xp"><div class="card"><b>${bn(jobs.length)}</b><span class="muted sm">মোট</span></div><div class="card"><b>${bn(cnt(ST[1]))}</b><span class="muted sm">আবেদন</span></div><div class="card"><b>${bn(cnt(ST[3]))}</b><span class="muted sm">ইন্টারভিউ</span></div><div class="card"><b>${bn(cnt(ST[4]))}</b><span class="muted sm">অফার</span></div></div>
<details class="mt"><summary>＋ নতুন আবেদন যোগ করুন</summary><input id="jc" placeholder="কোম্পানি / প্রতিষ্ঠান"><input id="jp" placeholder="পদের নাম"><label>আবেদনের শেষ তারিখ / পরীক্ষার তারিখ (রিমাইন্ডার আসবে)</label><input id="jd" type="date"><input id="jn" placeholder="নোট (ঐচ্ছিক)"><button class="btn w" onclick="addJob()">＋ যোগ করুন</button></details>
<div class="chips"><button class="chip ${tf === '' ? 'on' : ''}" onclick="tf='';render()">সব</button>${ST.map(s => `<button class="chip ${tf === s ? 'on' : ''}" onclick="tf='${s}';render()">${s}</button>`).join('')}</div>
${list.map(j => `<div class="card"><b>${esc(j.pos)}</b> — ${esc(j.co)}<br>${j.date ? `<span class="pill ${daysLeft(j.date) <= 3 ? 'red' : ''}">${daysLeft(j.date) >= 0 ? bn(daysLeft(j.date)) + ' দিন বাকি' : 'সময় শেষ'} (${j.date})</span>` : ''}${j.note ? `<div class="muted">${esc(j.note)}</div>` : ''}<select onchange="setSt(${j.i},this.value)">${ST.map(s => `<option ${s === j.st ? 'selected' : ''}>${s}</option>`).join('')}</select><div class="row">${j.url ? ext(j.url, 'বিস্তারিত ↗', 'btn gh s') : ''}<button class="btn r s" onclick="delJob(${j.i})">মুছুন</button></div></div>`).join('') || '<div class="card c muted">এখনো কিছু যোগ করা হয়নি। চাকরির কার্ডের 📌 ট্র্যাক বাটন চাপুন।</div>'}`;
}
