/* ===== Job Hunter 3.1 — extra services ===== */

/* ---------- 1. photo & signature resizer ---------- */
const PHP = [['📷 ছবি ৩০০×৩০০ (≤১০০KB)', 300, 300, 100, 'cover'], ['✍️ স্বাক্ষর ৩০০×৮০ (≤৬০KB)', 300, 80, 60, 'contain'], ['📷 ছবি ৩০০×৪০০ (≤১০০KB)', 300, 400, 100, 'cover'], ['🪪 বড় ছবি ৪৫০×৫৬০ (≤১৫০KB)', 450, 560, 150, 'cover']];
let ph = { img: null, w: 300, h: 300, kb: 100, mode: 'cover', out: '', info: '', name: 'photo' };
function phPick(inp) {
  const f = inp.files[0]; if (!f) return; ph.name = (f.name.replace(/\.[^.]*$/, '') || 'photo') + '_resized';
  const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { ph.img = im; ph.out = ''; render(); phRun() }; im.onerror = () => toast('ছবিটি পড়া যায়নি'); im.src = r.result }; r.readAsDataURL(f);
}
function phSet(i) { const p = PHP[i]; ph.w = p[1]; ph.h = p[2]; ph.kb = p[3]; ph.mode = p[4]; render(); if (ph.img) phRun() }
function phRun() {
  if (!ph.img) { toast('আগে একটি ছবি বাছুন'); return }
  const W = Math.max(20, Math.min(2000, +ph.w || 300)), H = Math.max(20, Math.min(2000, +ph.h || 300)), im = ph.img;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  const s = ph.mode === 'cover' ? Math.max(W / im.width, H / im.height) : Math.min(W / im.width, H / im.height), w = im.width * s, h = im.height * s;
  x.imageSmoothingQuality = 'high'; x.drawImage(im, (W - w) / 2, ph.mode === 'cover' ? (H - h) * .35 : (H - h) / 2, w, h);
  let q = .95, url, kb; do { url = c.toDataURL('image/jpeg', q); kb = Math.round(url.length * .75 / 1024); q -= .05 } while (kb > ph.kb && q > .12);
  ph.out = url; ph.info = `${bn(W)}×${bn(H)} px · ${bn(kb)} KB ${kb <= ph.kb ? '✅ সীমার মধ্যে' : '⚠️ সীমার চেয়ে বড় — ছোট ছবি/অন্য মাপ বেছে দেখুন'}`;
  const o = $('#pho'); if (o) o.innerHTML = phOut();
}
const phOut = () => ph.out ? `<div class="card c"><img src="${ph.out}" style="max-width:100%;max-height:260px;border:1px solid var(--b);border-radius:8px"><p><b>${ph.info}</b></p><div class="row" style="justify-content:center"><button class="btn" onclick="phSave()">📥 সেভ / শেয়ার</button></div></div>` : '';
async function phSave() { try { await saveFile(ph.name + '.jpg', ph.out.split(',')[1], 'image/jpeg', true); toast('✅ ছবি তৈরি হয়েছে') } catch (e) { toast('সেভ করা যায়নি') } }
const pPhoto = () => `${back()}<h2>🖼️ ছবি ও স্বাক্ষর রিসাইজ</h2><div class="card hl">সরকারি চাকরির অনলাইন আবেদনে ছবি ও স্বাক্ষর নির্দিষ্ট মাপ ও সাইজে লাগে। এখানে ছবি বেছে নিন, অ্যাপ নিজে মাপ ও কিলোবাইট ঠিক করে দেবে। <b>বিজ্ঞপ্তিতে যে মাপ দেওয়া আছে, সেটি মিলিয়ে নিন।</b></div>
<div class="chips" style="flex-wrap:wrap;overflow:visible">${PHP.map((p, i) => `<button class="chip ${ph.w === p[1] && ph.h === p[2] && ph.kb === p[3] ? 'on' : ''}" onclick="phSet(${i})">${p[0]}</button>`).join('')}</div>
<div class="card"><label>ছবি বাছুন (গ্যালারি/ক্যামেরা)</label><input type="file" accept="image/*" onchange="phPick(this)"><div class="row"><div style="flex:1"><label>প্রস্থ (px)</label><input type="number" inputmode="numeric" value="${ph.w}" oninput="ph.w=this.value"></div><div style="flex:1"><label>উচ্চতা (px)</label><input type="number" inputmode="numeric" value="${ph.h}" oninput="ph.h=this.value"></div><div style="flex:1"><label>সর্বোচ্চ KB</label><input type="number" inputmode="numeric" value="${ph.kb}" oninput="ph.kb=+this.value"></div></div>
<label>ফিট করার ধরন</label><div class="tabs"><button class="${ph.mode === 'cover' ? 'on' : ''}" onclick="ph.mode='cover';render();phRun()">ক্রপ করে ভরাট</button><button class="${ph.mode === 'contain' ? 'on' : ''}" onclick="ph.mode='contain';render();phRun()">পুরোটা রেখে সাদা ব্যাকগ্রাউন্ড</button></div><button class="btn w" onclick="phRun()">✨ তৈরি করুন</button></div><div id="pho">${phOut()}</div>
<div class="card"><b>টিপস</b><div class="tip">📷 সাদা/হালকা ব্যাকগ্রাউন্ডে, পরিষ্কার আলোয় ছবি তুলুন।</div><div class="tip">✍️ সাদা কাগজে কালো/নীল কলমে স্বাক্ষর করে ছবি তুলুন, তারপর "পুরোটা রেখে" বেছে নিন।</div></div>`;

/* ---------- 2. images -> PDF ---------- */
let ip = { imgs: [], name: 'Documents' };
function readImg(f, max = 1600) { return new Promise(res => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .85)) }; im.onerror = () => res(null); im.src = r.result }; r.onerror = () => res(null); r.readAsDataURL(f) }) }
async function ipAdd(inp) { const fs = [...inp.files]; if (!fs.length) return; toast('ছবি যোগ হচ্ছে...'); for (const f of fs) { const d = await readImg(f); if (d) ip.imgs.push(d) } inp.value = ''; render() }
function ipDel(i) { ip.imgs.splice(i, 1); render() }
function ipMv(i, d) { const j = i + d; if (j < 0 || j >= ip.imgs.length) return;[ip.imgs[i], ip.imgs[j]] = [ip.imgs[j], ip.imgs[i]]; render() }
async function ipPDF() {
  if (!ip.imgs.length) { toast('আগে ছবি যোগ করুন'); return } if (!window.html2pdf) { toast('PDF লাইব্রেরি পাওয়া যায়নি'); return }
  toast('PDF তৈরি হচ্ছে...'); const w = document.createElement('div'); w.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff';
  w.innerHTML = ip.imgs.map((s, i) => `<div style="width:794px;height:1116px;display:flex;align-items:center;justify-content:center;background:#fff;overflow:hidden;${i < ip.imgs.length - 1 ? 'page-break-after:always;' : ''}"><img src="${s}" style="max-width:754px;max-height:1076px"></div>`).join(''); document.body.appendChild(w);
  const nm = ((ip.name || 'Documents').trim().replace(/[^\w\u0980-\u09FF]+/g, '_') || 'Documents') + '.pdf';
  try { await elementToPDF(w, nm, { margin: [0, 0, 0, 0], scale: 1.6, avoid: [] }); toast('✅ PDF তৈরি হয়েছে') } catch (e) { toast('PDF তৈরি করা যায়নি') } w.remove();
}
const pImg2Pdf = () => `${back()}<h2>📑 ছবি থেকে PDF</h2><div class="card hl">সনদ, NID, মার্কশিটের ছবি একসাথে একটি PDF ফাইলে বানান — আবেদনে বা ইমেইলে পাঠাতে কাজে লাগবে।</div><div class="card"><label>ছবি যোগ করুন (একসাথে একাধিক বাছতে পারবেন)</label><input type="file" accept="image/*" multiple onchange="ipAdd(this)"><label>PDF-এর নাম</label><input value="${attr(ip.name)}" oninput="ip.name=this.value"></div>
${ip.imgs.map((s, i) => `<div class="card row"><img src="${s}" style="width:64px;height:84px;object-fit:cover;border-radius:6px;border:1px solid var(--b)"><b style="flex:1">পাতা ${bn(i + 1)}</b><button class="btn gh s" onclick="ipMv(${i},-1)">↑</button><button class="btn gh s" onclick="ipMv(${i},1)">↓</button><button class="btn r s" onclick="ipDel(${i})">✕</button></div>`).join('')}${ip.imgs.length ? `<button class="btn w" onclick="ipPDF()">📥 PDF বানান (${bn(ip.imgs.length)} পাতা)</button><button class="btn gh s" onclick="if(confirm('সব ছবি সরাবেন?')){ip.imgs=[];render()}">সব সরান</button>` : ''}`;

/* ---------- 3. email / LinkedIn / message templates ---------- */
let ml = { id: 'apply', name: '', pos: '', co: '', who: '', skills: '', date: '' };
const MAILS = [['apply', '📨', 'চাকরির আবেদনের ইমেইল'], ['follow', '🔁', 'আবেদনের পর ফলো-আপ'], ['thanks', '🙏', 'ইন্টারভিউর পর ধন্যবাদ'], ['accept', '✅', 'অফার গ্রহণের ইমেইল'], ['refreq', '📝', 'সুপারিশ/রেফারেন্স চাওয়া'], ['linkedin', '💼', 'LinkedIn Headline ও About'], ['wa', '💬', 'WhatsApp/Messenger মেসেজ (বাংলা)']];
function mailGen() {
  const n = ml.name || cv.name || '[Your Name]', p = ml.pos || cv.title || '[Position]', c = ml.co || '[Company]', who = ml.who ? 'Dear ' + ml.who + ',' : 'Dear Hiring Manager,', sk = ml.skills || String(cv.skills || '').split(',').slice(0, 3).join(', ').trim() || '[your key skills]', ph2 = cv.phone || '', d = ml.date || '[date]';
  const sig = `\n\nBest regards,\n${n}${ph2 ? '\n' + ph2 : ''}${cv.email ? '\n' + cv.email : ''}`;
  const T = {
    apply: [`Application for ${p} — ${n}`, `${who}\n\nI am writing to apply for the ${p} position at ${c}. I have attached my CV and cover letter for your consideration.\n\nI have experience/skills in ${sk}, and I am confident I can contribute effectively to your team. I would welcome the opportunity to discuss my application in an interview.\n\nThank you for your time and consideration.${sig}`],
    follow: [`Follow-up: ${p} application — ${n}`, `${who}\n\nI hope you are well. I applied for the ${p} position at ${c} on ${d} and wanted to follow up on the status of my application. I remain very interested in the role and would be glad to provide any additional information.\n\nThank you for your time.${sig}`],
    thanks: [`Thank you — ${p} interview`, `${who}\n\nThank you for taking the time to meet with me on ${d} regarding the ${p} position at ${c}. I enjoyed learning more about the team and the role, and my interest in joining ${c} has grown.\n\nPlease let me know if you need anything further from me. I look forward to hearing from you.${sig}`],
    accept: [`Acceptance of offer — ${p}`, `${who}\n\nThank you for offering me the ${p} position at ${c}. I am pleased to accept the offer and look forward to joining the team${ml.date ? ' on ' + ml.date : ''}.\n\nPlease let me know the next steps and any documents I should bring on my first day.${sig}`],
    refreq: [`Request for a reference — ${n}`, `Dear ${ml.who || 'Sir/Madam'},\n\nI hope you are well. I am applying for the ${p} position at ${c}, and I would be grateful if you could serve as my reference or provide a short recommendation letter, as you know my work well.\n\nI can share my CV and the job details to make this easier. Thank you very much for your support.${sig}`],
    linkedin: [`LinkedIn`, `HEADLINE:\n${p} | ${sk} | Open to opportunities\n\nABOUT:\nI am a motivated ${p} with a strong interest in ${sk}. I enjoy learning quickly, solving problems and working in teams. I have worked on academic and personal projects that helped me build practical skills, and I am now looking for an opportunity to grow and add value to a forward-thinking organization.\n\nSkills: ${sk}\nOpen to: ${p} roles — internships, entry-level and full-time.\nLet's connect!`],
    wa: [`WhatsApp`, `আসসালামু আলাইকুম${ml.who ? ', ' + ml.who : ''}। আমি ${n}। ${c}-এ ${p} পদে আবেদন করেছি। আমার সিভি ইমেইলে পাঠিয়েছি। আবেদনের বর্তমান অবস্থা জানালে কৃতজ্ঞ থাকব। ধন্যবাদ।`],
  };
  return T[ml.id];
}
function mailRun() { const t = mailGen(); $('#mo').textContent = (t[0] !== 'LinkedIn' && t[0] !== 'WhatsApp' ? 'Subject: ' + t[0] + '\n\n' : '') + t[1]; $('#mb').style.display = 'block'; $('#mb').scrollIntoView({ behavior: 'smooth' }) }
async function mailCopy() { toast(await copyText($('#mo').textContent) ? '✅ কপি হয়েছে' : 'কপি করা যায়নি') }
function mailOpen() { const t = mailGen(); location.href = 'mailto:?subject=' + encodeURIComponent(t[0]) + '&body=' + encodeURIComponent(t[1]) }
async function mailShare() { try { await SH('মেসেজ', '', $('#mo').textContent) } catch (e) { mailCopy() } }
const pMails = () => `${back()}<h2>📨 ইমেইল ও মেসেজ টেমপ্লেট</h2><div class="chips" style="flex-wrap:wrap;overflow:visible">${MAILS.map(m => `<button class="chip ${ml.id === m[0] ? 'on' : ''}" onclick="ml.id='${m[0]}';render()">${m[1]} ${m[2]}</button>`).join('')}</div>
<div class="card"><input placeholder="আপনার নাম (সিভি থেকে আসবে)" value="${attr(ml.name)}" oninput="ml.name=this.value"><input placeholder="পদের নাম" value="${attr(ml.pos)}" oninput="ml.pos=this.value"><input placeholder="কোম্পানির নাম" value="${attr(ml.co)}" oninput="ml.co=this.value"><input placeholder="যাকে লিখছেন (যেমন: Mr. Rahman) — ঐচ্ছিক" value="${attr(ml.who)}" oninput="ml.who=this.value"><input placeholder="স্কিল (কমা দিয়ে) — ঐচ্ছিক" value="${attr(ml.skills)}" oninput="ml.skills=this.value"><input placeholder="তারিখ (আবেদন/ইন্টারভিউ/যোগদানের)" value="${attr(ml.date)}" oninput="ml.date=this.value"><button class="btn w" onclick="mailRun()">✨ তৈরি করুন</button></div>
<div id="mb" style="display:none"><pre class="lt" id="mo"></pre><div class="row"><button class="btn" onclick="mailCopy()">📋 কপি</button><button class="btn o" onclick="mailOpen()">✉️ ইমেইল অ্যাপে</button><button class="btn o" onclick="mailShare()">📤 শেয়ার</button></div><p class="muted">[ ] এর জায়গায় নিজের তথ্য বসান। ইমেইলের সাথে PDF সিভি সংযুক্ত করতে ভুলবেন না।</p></div>`;

/* ---------- 4. vocabulary ---------- */
const VOCAB = [['abandon', 'পরিত্যাগ করা', 'He abandoned his plan.'], ['abundant', 'প্রচুর', 'The region has abundant water.'], ['accurate', 'নির্ভুল', 'Please give accurate information.'], ['adequate', 'পর্যাপ্ত', 'We have adequate time.'], ['ambiguous', 'দ্ব্যর্থক', 'The answer was ambiguous.'], ['benevolent', 'হিতৈষী, দয়ালু', 'A benevolent donor helped the school.'], ['candid', 'স্পষ্টবাদী', 'She gave a candid opinion.'], ['diligent', 'পরিশ্রমী', 'A diligent student succeeds.'], ['eloquent', 'বাকপটু', 'He is an eloquent speaker.'], ['frugal', 'মিতব্যয়ী', 'They lead a frugal life.'], ['gregarious', 'মিশুক', 'He is a gregarious person.'], ['hostile', 'শত্রুভাবাপন্ন', 'The crowd was hostile.'], ['impartial', 'নিরপেক্ষ', 'A judge must be impartial.'], ['jovial', 'হাসিখুশি', 'He was in a jovial mood.'], ['keen', 'আগ্রহী, তীক্ষ্ণ', 'She is keen to learn.'], ['lucid', 'স্পষ্ট, বোধগম্য', 'He gave a lucid explanation.'], ['meticulous', 'অতি সতর্ক, নিখুঁত', 'She is meticulous about details.'], ['notorious', 'কুখ্যাত', 'The road is notorious for accidents.'], ['obsolete', 'অচল, সেকেলে', 'That technology is obsolete.'], ['pragmatic', 'বাস্তববাদী', 'We need a pragmatic solution.'], ['resilient', 'দৃঢ়, দ্রুত সামলে ওঠে এমন', 'Children are resilient.'], ['scrutinize', 'খুঁটিয়ে পরীক্ষা করা', 'Auditors scrutinize the accounts.'], ['tenacious', 'দৃঢ়প্রতিজ্ঞ', 'A tenacious fighter never quits.'], ['unanimous', 'সর্বসম্মত', 'The decision was unanimous.'], ['vital', 'অত্যাবশ্যক', 'Water is vital for life.'], ['wary', 'সতর্ক', 'Be wary of online scams.'], ['zeal', 'উদ্যম', 'He worked with great zeal.'], ['verbose', 'বাগাড়ম্বরপূর্ণ', 'The report is too verbose.'], ['reluctant', 'অনিচ্ছুক', 'He was reluctant to go.'], ['prudent', 'বিচক্ষণ', 'It is prudent to save money.'], ['inevitable', 'অনিবার্য', 'Change is inevitable.'], ['feasible', 'সম্ভবপর', 'The plan is feasible.'], ['integrity', 'সততা', 'A leader must have integrity.'], ['negligent', 'অবহেলাকারী', 'He was negligent in his duty.'], ['persistent', 'অধ্যবসায়ী', 'Be persistent in your efforts.'], ['concise', 'সংক্ষিপ্ত ও স্পষ্ট', 'Write a concise summary.'], ['mandatory', 'বাধ্যতামূলক', 'Attendance is mandatory.'], ['transparent', 'স্বচ্ছ', 'The process must be transparent.'], ['collaborate', 'একসাথে কাজ করা', 'We collaborate with other teams.'], ['proficient', 'দক্ষ', 'She is proficient in English.'], ['initiative', 'উদ্যোগ', 'He took the initiative.'], ['deadline', 'শেষ সময়সীমা', 'The deadline is Friday.'], ['qualification', 'যোগ্যতা', 'Check the required qualification.']];
let vk2 = LS.get('vknown', {}), vq2 = '';
const dayIdx = n => Math.floor(Date.now() / 864e5) % n;
const todayWord = () => VOCAB[dayIdx(VOCAB.length)];
function vToggle(i) { vk2[i] = !vk2[i]; LS.set('vknown', vk2); render() }
function vocabQuiz() {
  const pool = VOCAB.map((v, i) => ({ v, i })).filter(x => !vk2[x.i]); const src = (pool.length >= 4 ? pool : VOCAB.map((v, i) => ({ v, i })));
  const l = rnd(src.slice()).slice(0, 10).map(x => { const o = rnd(VOCAB.filter(y => y !== x.v).slice()).slice(0, 3).map(y => y[1]); const opts = rnd([x.v[1], ...o]); return ['শব্দভাণ্ডার', `"${x.v[0]}" এর অর্থ কী?`, opts, opts.indexOf(x.v[1])] });
  quiz = { l: l.map(prepQ), raw: l, i: 0, s: 0, sel: null, done: 0, end: 0, mode: 'vocab', wrong: [] }; qcat = 'সব'; go('quiz');
}
function pVocab() {
  const t = todayWord(), k = Object.values(vk2).filter(Boolean).length, L = VOCAB.map((v, i) => ({ v, i })).filter(x => !vq2 || (x.v[0] + x.v[1]).toLowerCase().includes(vq2.toLowerCase()));
  return `${back()}<h2>📖 শব্দভাণ্ডার</h2><div class="card hl"><span class="pill gold">আজকের শব্দ</span><h2 style="margin:6px 0 2px">${esc(t[0])}</h2><b>${esc(t[1])}</b><div class="muted" style="font-style:italic">${esc(t[2])}</div></div><div class="row sb"><span class="muted">${bn(k)}/${bn(VOCAB.length)} শেখা হয়েছে</span><button class="btn s" onclick="vocabQuiz()">🧠 কুইজ দিন</button></div><div class="bar" style="margin:8px 0"><i style="width:${Math.round(k / VOCAB.length * 100)}%"></i></div>
<input placeholder="🔎 শব্দ খুঁজুন" value="${attr(vq2)}" oninput="vq2=this.value;$('#vl').innerHTML=vList()"><div id="vl">${vList()}</div>`;
}
const vList = () => { const L = VOCAB.map((v, i) => ({ v, i })).filter(x => !vq2 || (x.v[0] + x.v[1]).toLowerCase().includes(vq2.toLowerCase())); return L.map(x => `<div class="card row sb" style="${vk2[x.i] ? 'opacity:.6' : ''}"><div><b>${esc(x.v[0])}</b> — ${esc(x.v[1])}<div class="muted sm" style="font-style:italic">${esc(x.v[2])}</div></div><button class="btn ${vk2[x.i] ? '' : 'gh'} s" onclick="vToggle(${x.i})">${vk2[x.i] ? '✓ জানি' : 'শিখলাম'}</button></div>`).join('') || '<p class="muted">পাওয়া যায়নি</p>' };

/* ---------- 5. study timer (pomodoro) ---------- */
let sd = Object.assign({ date: '', min: 0, sess: 0 }, LS.get('study', {})); if (sd.date !== ld(new Date())) sd = { date: ld(new Date()), min: 0, sess: 0 };
let stm = { focus: 25, brk: 5, mode: 'focus', left: 25 * 60, run: false, end: 0, t: null };
const fmtT = s => bn(String(Math.floor(s / 60)).padStart(2, '0')) + ':' + bn(String(s % 60).padStart(2, '0'));
async function stNotify(on) { try { const L = plug('LocalNotifications'); if (!isNative() || !L) return; if (!on) { await L.cancel({ notifications: [{ id: 7002 }] }); return } let p = await L.checkPermissions(); if (p.display !== 'granted') p = await L.requestPermissions(); if (p.display !== 'granted') return; await L.schedule({ notifications: [{ id: 7002, title: stm.mode === 'focus' ? '⏰ ফোকাস সময় শেষ!' : '⏰ বিরতি শেষ!', body: stm.mode === 'focus' ? 'একটু বিরাম নিন 🙂' : 'আবার পড়তে বসুন 💪', schedule: { at: new Date(stm.end) } }] }) } catch (e) { } }
function stTick() {
  if (!stm.run) return; stm.left = Math.max(0, Math.round((stm.end - Date.now()) / 1000)); const e = $('#stt'); if (e) e.textContent = fmtT(stm.left);
  if (!stm.left) { clearInterval(stm.t); stm.run = false; if (stm.mode === 'focus') { sd.min += stm.focus; sd.sess++; sd.date = ld(new Date()); LS.set('study', sd); toast('🎉 চমৎকার! একটি সেশন সম্পন্ন'); stm.mode = 'break'; stm.left = stm.brk * 60 } else { toast('বিরতি শেষ — আবার শুরু করুন'); stm.mode = 'focus'; stm.left = stm.focus * 60 } try { navigator.vibrate && navigator.vibrate([300, 150, 300]) } catch (e) { } if (route === 'study') render() }
}
function stStart() { if (stm.run) return; stm.run = true; stm.end = Date.now() + stm.left * 1000; clearInterval(stm.t); stm.t = setInterval(stTick, 500); stNotify(true); render() }
function stPause() { if (!stm.run) return; stTick(); stm.run = false; clearInterval(stm.t); stNotify(false); render() }
function stReset() { stm.run = false; clearInterval(stm.t); stNotify(false); stm.mode = 'focus'; stm.left = stm.focus * 60; render() }
function stSet(f, b) { stm.focus = f; stm.brk = b; stReset() }
const pStudy = () => `${back()}<h2>⏱️ স্টাডি টাইমার</h2><div class="card c hl"><span class="pill ${stm.mode === 'focus' ? '' : 'gold'}">${stm.mode === 'focus' ? '📚 ফোকাস' : '☕ বিরতি'}</span><div id="stt" style="font-size:56px;font-weight:800;line-height:1.2;margin:6px 0">${fmtT(stm.left)}</div><div class="row" style="justify-content:center">${stm.run ? '<button class="btn o" onclick="stPause()">⏸ থামান</button>' : '<button class="btn" onclick="stStart()">▶ শুরু</button>'}<button class="btn gh" onclick="stReset()">↺ রিসেট</button></div></div>
<div class="chips">${[[25, 5], [45, 10], [60, 10], [15, 3]].map(x => `<button class="chip ${stm.focus === x[0] ? 'on' : ''}" onclick="stSet(${x[0]},${x[1]})">${bn(x[0])} মি + ${bn(x[1])} মি বিরতি</button>`).join('')}</div>
<div class="xp"><div class="card"><b>${bn(sd.sess)}</b><span class="muted sm">আজকের সেশন</span></div><div class="card"><b>${bn(sd.min)}</b><span class="muted sm">মিনিট পড়েছেন</span></div></div>
<div class="card"><b>পোমোডোরো কেন?</b><p class="muted" style="margin:4px 0 0">২৫ মিনিট মন দিয়ে পড়ুন, ৫ মিনিট বিরতি — এভাবে ক্লান্তি কমে ও মনোযোগ বাড়ে। টাইমার চলাকালীন ফোন বন্ধ করে সোশ্যাল মিডিয়া থেকে দূরে থাকুন।</p></div>`;

/* ---------- 6. career roadmaps ---------- */
const ROAD = [
  ['🏛️ সরকারি চাকরি / BCS (৬ মাস)', ['১ম মাস: সর্বশেষ সার্কুলার ও সিলেবাস দেখুন, সময়সূচি বানান', '২য়–৩য় মাস: বাংলা, ইংরেজি, গণিত, বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি পড়ুন', '৪র্থ মাস: সাধারণ বিজ্ঞান, ICT, মানসিক দক্ষতা ও ভূগোল শেষ করুন', '৫ম মাস: প্রতিদিন মডেল টেস্ট, ভুলের খাতা থেকে রিভিশন', '৬ষ্ঠ মাস: মক পরীক্ষা (সময় ধরে), দৈনিক সংবাদ, ভাইভার প্রস্তুতি', 'সবসময়: ডকুমেন্ট ও ছবি-স্বাক্ষর প্রস্তুত রাখুন, টেলিটক SIM চালু রাখুন']],
  ['🏦 ব্যাংক জব (৩–৪ মাস)', ['বাংলা, ইংরেজি ও গণিত (আর্থিক গণিতসহ) জোরদার করুন', 'ব্যাংকিং ও অর্থনীতির প্রাথমিক ধারণা, সাম্প্রতিক খবর পড়ুন', 'সাপ্তাহিক মডেল টেস্ট দিন, পূর্বের প্রশ্ন সমাধান করুন', 'ইংরেজিতে নিজের পরিচয় ও ব্যাংকে কাজের আগ্রহ নিয়ে ভাইভা প্র্যাকটিস করুন']],
  ['💻 আইটি / ওয়েব ডেভেলপার (৬ মাস)', ['১–২ মাস: HTML, CSS, JavaScript (freeCodeCamp)', '৩–৪ মাস: React, Git/GitHub, API ও ডেটাবেস (SQL)', '৫ম মাস: ২–৩টি প্রজেক্ট বানিয়ে GitHub-এ রাখুন', '৬ষ্ঠ মাস: সিভি/LinkedIn সাজান, ইন্টার্নশিপে আবেদন করুন, কোডিং প্রশ্ন প্র্যাকটিস করুন']],
  ['🧑‍💻 ফ্রিল্যান্সিং (৩–৬ মাস)', ['একটি স্কিল বেছে নিন (ডিজাইন, কনটেন্ট, ওয়েব, ভিডিও এডিটিং, ডেটা এন্ট্রি)', 'কোর্সের পাশাপাশি ৩–৫টি নমুনা কাজ বানান', 'Upwork/Fiverr প্রোফাইল তৈরি করে ছোট কাজ দিয়ে শুরু করুন', 'ইংরেজি যোগাযোগ উন্নত করুন; রিভিউ বাড়িয়ে ধীরে ধীরে রেট বাড়ান', 'সতর্কতা: কাজ শুরুর আগে টাকা চাওয়া প্রতিষ্ঠান এড়িয়ে চলুন']],
  ['🏢 কর্পোরেট ফ্রেশার (২–৩ মাস)', ['সিভি ও কভার লেটার তৈরি করুন, LinkedIn সাজান', 'MS Excel, Word, PowerPoint ও ইংরেজি ইমেইল লেখা শিখুন', 'প্রতি সপ্তাহে ১০–১৫টি আবেদন করুন, ট্র্যাকারে হিসাব রাখুন', 'ভাইভার সাধারণ প্রশ্ন ও STAR পদ্ধতি অনুশীলন করুন']],
  ['🌍 এনজিও / UN', ['রিপোর্ট লেখা, ডেটা কালেকশন (KoBo/ODK) ও প্রজেক্ট ম্যানেজমেন্ট শিখুন', 'ইংরেজি লেখা ও বলায় দক্ষ হন', 'স্বেচ্ছাসেবী কাজ ও ইন্টার্নশিপ করুন', 'ReliefWeb, BRAC, UN Careers-এ নিয়মিত খুঁজুন']],
];
const pRoad = () => `${back()}<h2>🗺️ ক্যারিয়ার রোডম্যাপ</h2><p class="muted">লক্ষ্য অনুযায়ী ধাপে ধাপে পরিকল্পনা। নিজের সময় অনুযায়ী মানিয়ে নিন।</p>${ROAD.map(r => `<details><summary>${r[0]}</summary><div style="padding-bottom:10px">${r[1].map((s, i) => `<div class="tip"><b>${bn(i + 1)}.</b><span>${esc(s)}</span></div>`).join('')}</div></details>`).join('')}<div class="row"><button class="btn o" onclick="go('courses')">💻 স্কিল কোর্স</button><button class="btn o" onclick="go('study')">⏱️ স্টাডি টাইমার</button></div>`;

/* ---------- 7. update checker ---------- */
let upd = LS.get('upd', null);
async function checkUpdate() {
  const m = (window.JOBS_URL || '').match(/githubusercontent\.com\/([^/]+)\/([^/]+)\//), cur = +window.BUILD; if (!m || !cur) return;
  if (upd && upd.build <= cur) upd = null; const last = LS.get('updchk', 0); if (Date.now() - last < 6 * 36e5) return
  try { const r = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}/releases/latest`); if (!r.ok) return; const j = await r.json(), n = +((j.name || '').match(/#(\d+)/) || [])[1]; LS.set('updchk', Date.now()); upd = n && n > cur ? { build: n, url: j.html_url } : null; LS.set('upd', upd); if (route === 'home') render() } catch (e) { }
}
const updBanner = () => upd ? `<div class="card hl row sb"><div><b>🆕 নতুন সংস্করণ পাওয়া যাচ্ছে</b><div class="muted sm">বিল্ড #${bn(upd.build)} — আপডেট করুন</div></div>${ext(upd.url, 'ডাউনলোড ↗', 'btn s')}</div>` : '';
