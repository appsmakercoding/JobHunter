/* ===== Job Hunter 3.0 — tools ===== */
const links = a => a.map(x => `<div class="card">${ext(x[1], esc(x[0]) + ' ↗')}</div>`).join('');
let chk = LS.get('chk', {});

/* ---------- cover letter ---------- */
let lt = { lang: 'bn', style: 'fresher' };
const LSTY = [['fresher', 'ফ্রেশার'], ['exp', 'অভিজ্ঞ'], ['govt', 'সরকারি আবেদন']];
function letterText() {
  const v = id => ($('#' + id) || { value: '' }).value.trim();
  const n = v('ln') || '[আপনার নাম]', p = v('lp') || '[পদের নাম]', c = v('lc') || '[প্রতিষ্ঠানের নাম]', e = v('le'), s = v('ls'), x = v('lx'), ph = v('lph') || cv.phone, em = v('lem') || cv.email;
  const dt = new Date().toLocaleDateString(lt.lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const contact = [ph, em].filter(Boolean).join(' | ');
  if (lt.lang === 'bn') {
    if (lt.style === 'govt') return `তারিখ: ${dt}\n\nবরাবর,\nসচিব / নিয়োগ কর্তৃপক্ষ\n${c}\n\nবিষয়: ${p} পদে নিয়োগের জন্য আবেদন।\n\nজনাব,\nবিনীত নিবেদন এই যে, গত [তারিখ] তারিখে প্রকাশিত নিয়োগ বিজ্ঞপ্তির প্রেক্ষিতে আমি ${p} পদে আবেদন করছি। ${e ? `আমার শিক্ষাগত যোগ্যতা: ${e}।\n` : ''}আমার প্রয়োজনীয় সনদ ও তথ্যাদি আবেদনের সাথে সংযুক্ত করা হলো।\n\nআমি অঙ্গীকার করছি যে, আবেদনপত্রে প্রদত্ত সকল তথ্য সত্য। নিয়োগ পেলে আমি সততা, নিষ্ঠা ও দায়িত্বশীলতার সাথে কর্তব্য পালন করব।\n\nএমতাবস্থায়, মহোদয় সমীপে আকুল আবেদন — আমাকে উক্ত পদে নিয়োগ দানে বাধিত করবেন।\n\nবিনীত নিবেদক,\n${n}\n${contact}`;
    return `তারিখ: ${dt}\n\nবরাবর,\nমানবসম্পদ ব্যবস্থাপক\n${c}\n\nবিষয়: ${p} পদে আবেদন।\n\nজনাব/জনাবা,\nসবিনয় নিবেদন এই যে, আমি ${n}। ${c}-এ ${p} পদে নিয়োগের বিজ্ঞপ্তি দেখে আবেদন করছি।\n\n${e ? `শিক্ষাগত যোগ্যতা: ${e}।\n` : ''}${s ? `আমার প্রধান দক্ষতা: ${s}।\n` : ''}${x ? `${x}\n` : ''}আমি পরিশ্রমী, শেখার প্রতি আগ্রহী এবং দলগতভাবে কাজ করতে সক্ষম। সুযোগ পেলে প্রতিষ্ঠানের লক্ষ্য অর্জনে আন্তরিকভাবে কাজ করব।\n\nআমার সিভি সংযুক্ত করা হলো। সাক্ষাৎকারের সুযোগ দিলে কৃতজ্ঞ থাকব।\n\nবিনীত,\n${n}\n${contact}`;
  }
  const body = lt.style === 'exp'
    ? `I am writing to express my interest in the ${p} position at ${c}. ${x || 'With my professional experience and a proven record of delivering results, I am confident that I can contribute to your team from day one.'} ${s ? `My core strengths include ${s}. ` : ''}${e ? `I hold ${e}. ` : ''}`
    : `I am writing to apply for the ${p} position at ${c}. ${e ? `I recently completed ${e}, ` : 'As a recent graduate, '}where I developed a strong foundation and a keen interest in this field. ${s ? `My key skills include ${s}. ` : ''}${x || 'I am a quick learner, a dependable team player and eager to contribute to your organization.'}`;
  return `${dt}\n\nTo\nThe Hiring Manager\n${c}\n\nSubject: Application for ${p} — ${n}\n\nDear Sir/Madam,\n\n${body.trim()}\n\nI have attached my CV for your kind consideration. I would welcome the opportunity to discuss my application in an interview.\n\nThank you for your time and consideration.\n\nSincerely,\n${n}\n${contact}`;
}
function genLetter() { $('#lo').textContent = letterText(); $('#lb').style.display = 'block'; $('#lb').scrollIntoView({ behavior: 'smooth' }) }
function setLang(l) { lt.lang = l; $('#lgbn').className = l === 'bn' ? 'on' : ''; $('#lgen').className = l === 'en' ? 'on' : ''; if ($('#lb').style.display === 'block') genLetter() }
function setLSty(s) { lt.style = s; document.querySelectorAll('.lsty').forEach(b => b.classList.toggle('on', b.dataset.s === s)); if ($('#lb').style.display === 'block') genLetter() }
async function shareLetter() { const t = $('#lo').textContent; try { await SH('কভার লেটার', '', t) } catch (e) { toast(await copyText(t) ? '✅ কপি হয়েছে' : 'কপি করা যায়নি') } }
async function copyLetter() { toast(await copyText($('#lo').textContent) ? '✅ কপি হয়েছে' : 'কপি করা যায়নি') }
async function letterPDF() {
  const t = $('#lo').textContent; const w = document.createElement('div'); w.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px';
  w.innerHTML = `<div style="width:794px;padding:56px 64px;background:#fff;color:#111;font:15px/1.8 'Noto Sans Bengali',Arial,sans-serif;white-space:pre-wrap">${esc(t)}</div>`; document.body.appendChild(w);
  toast('PDF তৈরি হচ্ছে...'); try { await elementToPDF(w.firstElementChild, 'Application_Letter.pdf', { margin: [8, 0, 8, 0], scale: 2, avoid: [] }); toast('✅ PDF তৈরি হয়েছে') } catch (e) { toast('PDF তৈরি করা যায়নি') } w.remove();
}
const pLetter = () => `${back()}<h2>✉️ কভার লেটার / আবেদনপত্র</h2><div class="tabs"><button id="lgbn" class="${lt.lang === 'bn' ? 'on' : ''}" onclick="setLang('bn')">বাংলা</button><button id="lgen" class="${lt.lang === 'en' ? 'on' : ''}" onclick="setLang('en')">English</button></div><div class="chips">${LSTY.map(s => `<button class="chip lsty ${lt.style === s[0] ? 'on' : ''}" data-s="${s[0]}" onclick="setLSty('${s[0]}')">${s[1]}</button>`).join('')}</div>
<div class="card"><input id="ln" value="${attr(cv.name)}" placeholder="আপনার নাম"><input id="lp" value="${attr(cv.title)}" placeholder="পদের নাম"><input id="lc" placeholder="প্রতিষ্ঠানের নাম"><input id="le" value="${attr((has(cv.edu)[0] || {}).deg || '')}" placeholder="শিক্ষাগত যোগ্যতা (যেমন: B.Sc in CSE)"><input id="ls" value="${attr(String(cv.skills || '').split(',').slice(0, 4).join(',').trim())}" placeholder="প্রধান স্কিল (কমা দিয়ে)"><textarea id="lx" placeholder="আপনার একটি বিশেষ অর্জন বা কারণ (ঐচ্ছিক)"></textarea><button class="btn w" onclick="genLetter()">✨ তৈরি করুন</button></div>
<div id="lb" style="display:none"><pre class="lt" id="lo"></pre><div class="row"><button class="btn" onclick="copyLetter()">📋 কপি</button><button class="btn o" onclick="shareLetter()">📤 শেয়ার</button><button class="btn o" onclick="letterPDF()">📥 PDF</button></div><p class="muted">[ ] এর জায়গায় নিজের তথ্য বসিয়ে নিন। প্রতিটি আবেদনের জন্য আলাদা করে মানিয়ে নিন।</p></div>`;

/* ---------- ATS checker ---------- */
const STOP = new Set('with that this have will from your their they them been were such than also into over more must able work role team years year plus good well like using used including etc and the for are you our can has not but all any about who what when where which job description requirements responsibilities experience skills knowledge strong ability looking should would could their other these those within across'.split(' '));
function runATS() {
  const jd = $('#jd2').value.toLowerCase(); const words = [...new Set((jd.match(/[a-z][a-z+#.]{3,}/g) || []).filter(w => !STOP.has(w)))].slice(0, 45);
  const t = JSON.stringify(cv).toLowerCase(), hit = words.filter(w => t.includes(w)), miss = words.filter(w => !t.includes(w));
  const sc = cvScore(), kwp = words.length ? Math.round(hit.length / words.length * 100) : null, tot = kwp === null ? sc.score : Math.round(kwp * .55 + sc.score * .45);
  $('#atso').innerHTML = `<div class="card hl"><div class="prog"><div class="ring" style="--p:${tot}"><i>${bn(tot)}</i></div><div><b>ATS স্কোর ${bn(tot)}/১০০</b><div class="muted">সিভি গুণমান ${bn(sc.score)}%${kwp !== null ? ` · কীওয়ার্ড মিল ${bn(kwp)}%` : ''}</div></div></div></div>${miss.length ? `<div class="card"><b>সিভিতে নেই এমন কীওয়ার্ড</b><div class="row" style="margin-top:6px">${miss.map(w => `<span class="chip wrap">${esc(w)}</span>`).join('')}</div><p class="muted">যেগুলো আপনার সত্যিই আছে, সেগুলো স্কিল/অভিজ্ঞতায় যোগ করুন। যা নেই তা লিখবেন না।</p></div>` : ''}${sc.tips.length ? `<div class="card"><b>সিভি উন্নতির টিপস</b>${sc.tips.slice(0, 6).map(x => `<div class="tip">${esc(x)}</div>`).join('')}</div>` : ''}`;
}
const pAts = () => `${back()}<h2>📊 ATS সিভি চেকার</h2><div class="card"><label>চাকরির বিবরণ (ইংরেজিতে) পেস্ট করুন — ঐচ্ছিক</label><textarea id="jd2" style="min-height:130px" placeholder="Paste the job description here..."></textarea><button class="btn w" onclick="runATS()">স্কোর দেখুন</button><p class="muted">বিবরণ পেস্ট করলে সিভির সাথে কীওয়ার্ড মিল দেখাবে। না দিলে শুধু সিভির গুণমান দেখাবে।</p></div><div id="atso"></div>`;

/* ---------- scam checker ---------- */
const FLAGS = [
  [/(registration|রেজিস্ট্রেশন|নিবন্ধন|security deposit|জামানত|training fee|প্রশিক্ষণ ফি|advance|অগ্রিম|আবেদন ফি|ফাইল চার্জ|প্রসেসিং ফি|ভিসা ফি|visa fee)/i, 'টাকা/ফি চাওয়া হচ্ছে — আসল নিয়োগকারী চাকরির আগে টাকা চায় না (সরকারি ফি শুধু অফিসিয়াল পোর্টালে)'],
  [/(bkash|nagad|rocket|বিকাশ|নগদ|রকেট|send money|টাকা পাঠান)/i, 'মোবাইল ব্যাংকিংয়ে টাকা পাঠাতে বলা — বড় লাল সংকেত'],
  [/(whatsapp|হোয়াটসঅ্যাপ|telegram|টেলিগ্রাম|imo|ইমো)/i, 'শুধু WhatsApp/Telegram-এ যোগাযোগ — অফিসিয়াল ইমেইল/ওয়েবসাইট আছে কিনা দেখুন'],
  [/(@gmail\.com|@yahoo\.com|@hotmail\.com|@outlook\.com)/i, 'কোম্পানির নামে নয়, সাধারণ ইমেইল (Gmail/Yahoo) — বড় কোম্পানি নিজস্ব ডোমেইন ব্যবহার করে'],
  [/(no experience|অভিজ্ঞতা লাগবে না|অভিজ্ঞতা প্রয়োজন নেই|দৈনিক|ঘরে বসে|home based|work from home).{0,80}(৳|tk|taka|টাকা|\$|usd|[0-9]{4,})/i, '"ঘরে বসে/অভিজ্ঞতা ছাড়াই" অস্বাভাবিক উচ্চ আয়ের প্রলোভন'],
  [/(urgent|জরুরি ভিত্তিতে|আজই|limited seat|সীমিত আসন|last chance|এখনই যোগাযোগ)/i, 'তাড়াহুড়োর চাপ — প্রতারকরা চিন্তার সময় দিতে চায় না'],
  [/(100% job|১০০% চাকরি|চাকরির নিশ্চয়তা|গ্যারান্টি|guarantee)/i, 'চাকরির "গ্যারান্টি" — বৈধ নিয়োগে কেউ নিশ্চয়তা দেয় না'],
  [/(nid|passport|পাসপোর্ট|এনআইডি|bank account|ব্যাংক একাউন্ট|ব্যাংক অ্যাকাউন্ট|otp|পিন)/i, 'সংবেদনশীল তথ্য (NID, পাসপোর্ট, OTP, ব্যাংক) চাওয়া হচ্ছে — নিয়োগ নিশ্চিত হওয়ার আগে দেবেন না, OTP/PIN কখনোই নয়'],
];
function runScam() {
  const t = $('#sc').value, ch = [...document.querySelectorAll('.scq:checked')].length;
  const hits = FLAGS.filter(f => f[0].test(t)).map(f => f[1]), n = hits.length + ch;
  const lvl = n >= 3 ? ['🚨 উচ্চ ঝুঁকি', 'red', 'এটি প্রতারণা হওয়ার সম্ভাবনা অনেক। টাকা বা তথ্য দেবেন না।'] : n >= 1 ? ['⚠️ সতর্ক থাকুন', 'gold', 'কিছু সন্দেহজনক লক্ষণ আছে। অফিসিয়াল ওয়েবসাইটে যাচাই করুন।'] : ['✅ স্পষ্ট লাল সংকেত নেই', '', 'তবুও আবেদনের আগে অফিসিয়াল সাইটে যাচাই করুন।'];
  $('#sco').innerHTML = `<div class="card"><span class="pill ${lvl[1]}" style="font-size:14px">${lvl[0]}</span><p>${lvl[2]}</p>${hits.map(h => `<div class="tip"><b>🚩</b><span>${esc(h)}</span></div>`).join('')}</div>`;
}
const pScam = () => `${back()}<h2>🛡️ ভুয়া চাকরি চেকার</h2><div class="card">চাকরির বিজ্ঞাপন/মেসেজ এখানে পেস্ট করুন, অ্যাপ লাল সংকেত খুঁজে দেখাবে।<textarea id="sc" style="min-height:120px" placeholder="বিজ্ঞাপন বা মেসেজটি পেস্ট করুন..."></textarea>
<label class="trow"><span>অফিসিয়াল ওয়েবসাইট/ঠিকানা পাচ্ছি না</span><input class="scq" type="checkbox"></label><label class="trow"><span>ইন্টারভিউ ছাড়াই চাকরি/অফার লেটার দিচ্ছে</span><input class="scq" type="checkbox"></label><label class="trow"><span>বেতন অস্বাভাবিক বেশি, কাজ অস্পষ্ট</span><input class="scq" type="checkbox"></label>
<button class="btn w" onclick="runScam()">যাচাই করুন</button></div><div id="sco"></div><div class="card hl"><b>মনে রাখুন</b><div class="tip">🏛️ সরকারি চাকরির আবেদন ফি শুধু টেলিটক/সংশ্লিষ্ট অফিসিয়াল পোর্টালে জমা হয়।</div><div class="tip">🔗 সন্দেহজনক ফেসবুক পেজ/লিংক এড়িয়ে চলুন।</div><div class="tip">📞 প্রতারিত হলে সাইবার সহায়তা: বিটিআরসি/পুলিশের সাইবার ইউনিট বা জাতীয় জরুরি সেবা ৯৯৯।</div></div>`;

/* ---------- age calculator ---------- */
function runAge() {
  const b = $('#ab').value, e = $('#ae').value || ld(new Date()), lim = +$('#al2').value || 0; if (!b) { toast('জন্মতারিখ দিন'); return }
  const d1 = new Date(b), d2 = new Date(e); if (d2 < d1) { toast('শেষ তারিখ জন্মতারিখের আগে হতে পারে না'); return }
  let y = d2.getFullYear() - d1.getFullYear(), m = d2.getMonth() - d1.getMonth(), d = d2.getDate() - d1.getDate();
  if (d < 0) { m--; d += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate() } if (m < 0) { y--; m += 12 }
  let msg = ''; if (lim) { const ok = y < lim || (y === lim && m === 0 && d === 0); msg = ok ? `<span class="pill">✅ বয়সসীমা (${bn(lim)} বছর) এর মধ্যে</span>` : `<span class="pill red">❌ বয়সসীমা (${bn(lim)} বছর) অতিক্রান্ত</span>`; if (ok) { const last = new Date(d1); last.setFullYear(d1.getFullYear() + lim + 1); last.setDate(last.getDate() - 1); msg += `<p class="muted">আপনি ${last.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })} পর্যন্ত এই সীমার মধ্যে থাকবেন।</p>` } }
  $('#ao').innerHTML = `<div class="card hl"><b style="font-size:20px">${bn(y)} বছর ${bn(m)} মাস ${bn(d)} দিন</b><div class="muted">${esc(e)} তারিখে</div><div style="margin-top:6px">${msg}</div><p class="muted">বিজ্ঞপ্তির নিয়ম (কোটা ও ছাড়) অনুযায়ী চূড়ান্ত সীমা যাচাই করুন।</p></div>`;
}
const pAge = () => `${back()}<h2>🎂 বয়স ক্যালকুলেটর</h2><div class="card"><label>জন্মতারিখ</label><input id="ab" type="date"><label>আবেদনের শেষ তারিখ (খালি রাখলে আজকের তারিখ)</label><input id="ae" type="date"><label>বিজ্ঞপ্তির বয়সসীমা (বছর, ঐচ্ছিক)</label><input id="al2" type="number" inputmode="numeric" placeholder="যেমন: ৩০"><button class="btn w" onclick="runAge()">হিসাব করুন</button></div><div id="ao"></div>`;

/* ---------- offer compare ---------- */
function runCalc() {
  const o = ['a', 'b'].map(k => { const g = +$('#s' + k).value || 0, b = +$('#b' + k).value || 0, c = +$('#c' + k).value || 0; return Math.round(g * 12 + g * b - c * 12) });
  $('#co').innerHTML = `<div class="card"><b>অফার A:</b> বছরে ৳${bn(o[0].toLocaleString('en-US'))} (মাসে গড় ৳${bn(Math.round(o[0] / 12).toLocaleString('en-US'))})<br><b>অফার B:</b> বছরে ৳${bn(o[1].toLocaleString('en-US'))} (মাসে গড় ৳${bn(Math.round(o[1] / 12).toLocaleString('en-US'))})<br><span class="pill">${o[0] === o[1] ? 'দুটি সমান' : o[0] > o[1] ? 'A ভালো (+৳' + bn((o[0] - o[1]).toLocaleString('en-US')) + ')' : 'B ভালো (+৳' + bn((o[1] - o[0]).toLocaleString('en-US')) + ')'}</span><p class="muted">বেতনের পাশাপাশি কাজের পরিবেশ, শেখার সুযোগ ও গ্রোথ বিবেচনা করুন।</p></div>`;
}
const pCalc = () => `${back()}<h2>⚖️ অফার তুলনা</h2>${['a', 'b'].map(k => `<div class="card"><h3>অফার ${k.toUpperCase()}</h3><label>মাসিক বেতন (৳)</label><input id="s${k}" type="number" inputmode="numeric"><label>বছরে কয়টি বোনাস (মাসের বেতনের সমান)</label><input id="b${k}" type="number" inputmode="decimal" placeholder="যেমন: 2"><label>মাসিক যাতায়াত/অতিরিক্ত খরচ (৳)</label><input id="c${k}" type="number" inputmode="numeric"></div>`).join('')}<button class="btn w" onclick="runCalc()">তুলনা করুন</button><div id="co"></div>`;

/* ---------- lists ---------- */
const pScholar = () => `${back()}<h2>🎓 স্কলারশিপ</h2>${links(SCHOLAR)}<p class="muted">আবেদনের শর্ত ও সময়সীমা অফিসিয়াল সাইটে যাচাই করুন।</p>`;
const pCourses = () => `${back()}<h2>💻 স্কিল কোর্স</h2>${links(COURSES)}`;
const pDocs = () => { const n = DOCS.filter((d, i) => chk[i]).length; return `${back()}<h2>🗂️ ডকুমেন্ট চেকলিস্ট</h2><div class="card"><b>${bn(n)}/${bn(DOCS.length)} প্রস্তুত</b><div class="bar" style="margin-top:6px"><i style="width:${Math.round(n / DOCS.length * 100)}%"></i></div></div>${DOCS.map((d, i) => `<label class="card" style="display:flex;gap:12px;align-items:center;color:var(--t);font-size:14.5px;font-weight:500"><input type="checkbox" style="width:22px;height:22px" ${chk[i] ? 'checked' : ''} onchange="chk[${i}]=this.checked;LS.set('chk',chk);render()">${d}</label>`).join('')}` };

/* ---------- backup ---------- */
async function exportBackup() {
  const txt = JSON.stringify({ app: 'jobhunter', v: 3, cv, profiles, jobs, chk, stats, tpl, ac, cvo, saved, alerts, wrong: [...wrongSet], me: PROFILE, vault: LS.get('vault', null) });
  try { await saveFile('JobHunter_backup.json', txt, 'application/json'); toast('✅ ব্যাকআপ ফাইল তৈরি হয়েছে') } catch (e) { toast('ব্যাকআপ করা যায়নি') }
}
function importBackup(inp) {
  const f = inp.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result); if (!d || typeof d !== 'object') throw 0;
      if (d.cv) { cv = Object.assign(clone(EMPTY), d.cv); LS.set('cv', cv) } profiles = d.profiles || {}; LS.set('profiles', profiles); jobs = d.jobs || []; LS.set('jobs', jobs); chk = d.chk || {}; LS.set('chk', chk);
      if (d.stats) { stats = Object.assign(stats, d.stats); LS.set('stats', stats) } if (d.tpl) { tpl = d.tpl; LS.set('tpl', tpl) } ac = d.ac || ''; LS.set('ac', ac); if (d.cvo) { cvo = Object.assign(cvo, d.cvo); saveO() }
      if (d.saved) { saved = d.saved; LS.set('saved', saved) } if (d.alerts) { alerts = d.alerts; LS.set('alerts', alerts) } if (d.wrong) { wrongSet = new Set(d.wrong); LS.set('wrong', d.wrong) } if (d.me) { Object.assign(PROFILE, d.me); saveMe() } if (d.vault) LS.set('vault', d.vault);
      toast('✅ রিস্টোর সম্পন্ন'); render();
    } catch (e) { toast('ফাইলটি সঠিক ব্যাকআপ নয়') }
  }; r.readAsText(f);
}
const pBackup = () => `${back()}<h2>💾 ব্যাকআপ ও রিস্টোর</h2><div class="card">ফোন বদলালে বা অ্যাপ মুছলে তথ্য হারাতে পারে। ব্যাকআপ ফাইল Drive/WhatsApp-এ সেভ রাখুন। সিভি, ট্র্যাকার, সেভ করা চাকরি, অ্যালার্ট ও পাসওয়ার্ড ম্যানেজার (এনক্রিপ্টেড) সব এতে থাকে।<br><br><button class="btn w" onclick="exportBackup()">📤 ব্যাকআপ নিন</button><label style="margin-top:10px">ব্যাকআপ ফাইল থেকে রিস্টোর</label><input type="file" accept=".json,application/json" onchange="importBackup(this)"></div>`;

/* ---------- password vault (AES-GCM) ---------- */
let vk = null, vdata = [], vshow = {};
const b64 = b => { let t = ''; new Uint8Array(b).forEach(c => t += String.fromCharCode(c)); return btoa(t) }, ub = t => Uint8Array.from(atob(t), c => c.charCodeAt(0));
async function deriveKey(pw, salt) { const m = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']); return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' }, m, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']) }
async function vSave() { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, vk, new TextEncoder().encode(JSON.stringify(vdata))); LS.set('vault', { salt: LS.get('vault').salt, iv: b64(iv), ct: b64(ct) }) }
async function vSetup() { const p = $('#mp').value; if (p.length < 6) { toast('কমপক্ষে ৬ অক্ষর দিন'); return } if (p !== $('#mp2').value) { toast('দুটি পাসওয়ার্ড মিলছে না'); return } const salt = crypto.getRandomValues(new Uint8Array(16)); LS.set('vault', { salt: b64(salt) }); vk = await deriveKey(p, salt); vdata = []; await vSave(); render() }
async function vUnlock() { const v = LS.get('vault'); try { const k = await deriveKey($('#mp').value, ub(v.salt)); const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ub(v.iv) }, k, ub(v.ct)); vdata = JSON.parse(new TextDecoder().decode(pt)); vk = k; render() } catch (e) { toast('মাস্টার পাসওয়ার্ড ভুল') } }
function vLock() { vk = null; vdata = []; vshow = {}; render() }
function vReset() { if (confirm('সব সেভ করা আইডি-পাসওয়ার্ড চিরতরে মুছে যাবে। নিশ্চিত?')) { LS.del('vault'); vLock() } }
async function vAdd() { const site = $('#vs').value.trim(), uid = $('#vu').value.trim(), pw = $('#vp').value; if (!site || !uid || !pw) { toast('সাইট, আইডি ও পাসওয়ার্ড দিন'); return } vdata.unshift({ site, uid, pw, note: $('#vn').value.trim() }); await vSave(); render(); toast('সেভ হয়েছে') }
async function vDel(i) { if (confirm('মুছে ফেলবেন?')) { vdata.splice(i, 1); await vSave(); render() } }
async function vCopy(i, k) { toast(await copyText(vdata[i][k]) ? 'কপি হয়েছে' : 'কপি করা যায়নি') }
function vGen() { const c = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789@#$%&*!'; const r = crypto.getRandomValues(new Uint32Array(14)); $('#vp').value = [...r].map(x => c[x % c.length]).join('') }
async function vPDF() {
  if (!vdata.length) { toast('কিছু সেভ করা নেই'); return } if (!confirm('PDF ফাইলে পাসওয়ার্ডগুলো সাধারণ লেখা হিসেবে থাকবে, কেউ পেলে পড়তে পারবে। ফাইলটি নিরাপদ জায়গায় রাখবেন। এগিয়ে যাবেন?')) return;
  const w = document.createElement('div'); w.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px';
  w.innerHTML = `<div style="width:794px;padding:30px;background:#fff;color:#222;font:13px 'Noto Sans Bengali',Arial,sans-serif"><h2 style="margin:0 0 4px;color:#006a4e">Job Hunter — Saved Logins</h2><p style="margin:0 0 12px;color:#b00">তারিখ: ${ld(new Date())} • গোপনীয় ফাইল, কাউকে দেবেন না</p><table style="width:100%;border-collapse:collapse"><tr style="background:#e6f2ee">${['#', 'সাইট', 'ইউজার আইডি', 'পাসওয়ার্ড', 'নোট'].map(h => `<th style="border:1px solid #ccc;padding:6px;text-align:left">${h}</th>`).join('')}</tr>${vdata.map((e, i) => `<tr>${[i + 1, e.site, e.uid, e.pw, e.note].map(x => `<td style="border:1px solid #ccc;padding:6px;word-break:break-all">${esc(x)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  document.body.appendChild(w); toast('PDF তৈরি হচ্ছে...'); try { await elementToPDF(w.firstElementChild, 'JobHunter_Logins.pdf', { margin: 8, scale: 2, avoid: ['tr'] }) } catch (e) { toast('PDF তৈরি করা যায়নি') } w.remove();
}
document.addEventListener('visibilitychange', () => { if (document.hidden && vk) { vk = null; vdata = []; vshow = {}; if (route === 'vault') render() } });
function pVault() {
  const v = LS.get('vault', null), H = `${back()}<h2>🔐 পাসওয়ার্ড ম্যানেজার</h2>`;
  if (!v) return H + `<div class="card">আবেদনের আইডি-পাসওয়ার্ড এখানে এনক্রিপ্ট করে (AES-256) সেভ থাকবে। শুরুতে একটা <b>মাস্টার পাসওয়ার্ড</b> দিন।<p style="color:var(--r)"><b>⚠️ মাস্টার পাসওয়ার্ড ভুলে গেলে ডেটা ফেরত আনার উপায় নেই।</b></p><input id="mp" type="password" placeholder="মাস্টার পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"><input id="mp2" type="password" placeholder="আবার লিখুন"><button class="btn w" onclick="vSetup()">তৈরি করুন</button></div>`;
  if (!vk) return H + `<div class="card"><input id="mp" type="password" placeholder="মাস্টার পাসওয়ার্ড"><button class="btn w" onclick="vUnlock()">🔓 খুলুন</button><button class="btn r s" onclick="vReset()">পাসওয়ার্ড ভুলে গেছি / সব মুছুন</button></div>`;
  return H + `<div class="row"><button class="btn o s" onclick="vLock()">🔒 লক করুন</button><button class="btn s" onclick="vPDF()">📥 সব PDF করুন</button></div><div class="card"><input id="vs" placeholder="সাইট / আবেদনের নাম (যেমন: BPSC)"><input id="vu" placeholder="ইউজার আইডি / ইমেইল / মোবাইল"><input id="vp" placeholder="পাসওয়ার্ড"><button class="btn o s" onclick="vGen()">🎲 শক্তিশালী পাসওয়ার্ড বানান</button><input id="vn" placeholder="নোট (ঐচ্ছিক)" style="margin-top:8px"><button class="btn w" onclick="vAdd()">＋ সেভ করুন</button></div><p class="muted">${bn(vdata.length)}টি সেভ করা আছে। অ্যাপ ব্যাকগ্রাউন্ডে গেলে নিজে লক হয়ে যায়।</p>${vdata.map((e, i) => `<div class="card"><b>${esc(e.site)}</b><br>ID: ${esc(e.uid)} <button class="btn gh s" onclick="vCopy(${i},'uid')">কপি</button><br>Password: ${vshow[i] ? esc(e.pw) : '••••••••'} <button class="btn gh s" onclick="vshow[${i}]=!vshow[${i}];render()">${vshow[i] ? 'লুকান' : 'দেখুন'}</button> <button class="btn gh s" onclick="vCopy(${i},'pw')">কপি</button>${e.note ? `<br><span class="muted">${esc(e.note)}</span>` : ''}<br><button class="btn r s" style="margin-top:6px" onclick="vDel(${i})">মুছুন</button></div>`).join('')}`;
}

/* ---------- file converter / saver ---------- */
const EXTS = ['txt', 'yml', 'yaml', 'py', 'js', 'kt', 'java', 'json', 'html', 'css', 'md', 'xml', 'sh', 'csv', 'ts', 'php', 'sql', 'ini', 'toml', 'gradle', 'c', 'cpp', 'none'];
let fx = { name: '', ext: 'yml', custom: '', eol: 'LF', text: LS.get('fdraft', '') };
const fxExt = () => { const c = fx.custom.trim().replace(/^\.+/, '').replace(/[^\w+-]/g, ''); return c || (fx.ext === 'none' ? '' : fx.ext) };
const fxName = () => { const n = (fx.name.trim() || 'file').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_'), e = fxExt(); return e && !n.toLowerCase().endsWith('.' + e.toLowerCase()) ? n + '.' + e : n };
const fxBody = () => { let t = fx.text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'); return fx.eol === 'CRLF' ? t.replace(/\n/g, '\r\n') : t };
function fxInfo() { const e = $('#fxi'); if (!e) return; e.innerHTML = `ফাইল: <b>${esc(fxName())}</b> · ${fx.text.length} অক্ষর · ${fx.text ? fx.text.split('\n').length : 0} লাইন · ${new TextEncoder().encode(fxBody()).length} বাইট (UTF-8)` }
function fxType(v) { fx.text = v; LS.set('fdraft', v); fxInfo() }
function fxCheck() {
  const e = fxExt().toLowerCase(), t = fxBody(), o = $('#fxc'); let m = '';
  try {
    if (!t.trim()) m = '⚠️ লেখা খালি';
    else if (e === 'json') { JSON.parse(t); m = '✅ JSON সঠিক' }
    else if (e === 'yml' || e === 'yaml') { if (!window.jsyaml) m = 'ℹ️ YAML যাচাইয়ের লাইব্রেরি পাওয়া যায়নি'; else { window.jsyaml.loadAll(t); m = '✅ YAML সঠিক' } }
    else if (e === 'xml') { const d = new DOMParser().parseFromString(t, 'application/xml'); m = d.querySelector('parsererror') ? '❌ XML-এ ভুল আছে' : '✅ XML সঠিক' }
    else m = 'ℹ️ এই ফরম্যাটের সিনট্যাক্স যাচাই করা যায় না। ফাইল হুবহু আপনার লেখা অনুযায়ী সেভ হবে।';
  } catch (x) { m = '❌ ভুল পাওয়া গেছে' + (x.mark ? ` (লাইন ${x.mark.line + 1}, কলাম ${x.mark.column + 1})` : '') + ': ' + esc(String(x.reason || x.message).slice(0, 160)) }
  o.innerHTML = `<div class="card">${m}</div>`;
}
async function fxOpen(inp) {
  const f = inp.files[0]; if (!f) return; if (f.size > 5e6) { toast('ফাইল ৫ MB এর বেশি বড়'); return }
  const b = await f.arrayBuffer(); let t; try { t = new TextDecoder('utf-8', { fatal: true }).decode(b) } catch (e) { toast('এটা টেক্সট ফাইল নয় (বাইনারি বা ভিন্ন এনকোডিং)'); return }
  if (t.includes('\u0000')) { toast('এটা টেক্সট ফাইল নয়'); return }
  fx.text = t.replace(/^\uFEFF/, ''); fx.name = f.name.replace(/\.[^.]*$/, '') || f.name; LS.set('fdraft', fx.text); render(); toast('ফাইল খোলা হয়েছে, এখন এক্সটেনশন বেছে নিন');
}
async function fxSave(mode) {
  if (!fx.text) { toast('লেখা খালি'); return } const body = fxBody(), name = fxName(), C = window.Capacitor;
  try {
    if (isNative() && plug('Filesystem')) {
      const Fs = plug('Filesystem'), doc = mode === 'doc', path = doc ? 'JobHunter/' + name : name, dir = doc ? 'DOCUMENTS' : 'CACHE';
      const r = await Fs.writeFile({ path, data: body, directory: dir, encoding: 'utf8', recursive: true });
      const rb = await Fs.readFile({ path, directory: dir, encoding: 'utf8' });
      if (rb.data !== body) { toast('⚠️ যাচাইয়ে মিলছে না, আবার চেষ্টা করুন'); return }
      if (doc) toast('✅ সেভ ও যাচাই সম্পন্ন: Documents/JobHunter/' + name); else { toast('✅ ফাইল তৈরি ও যাচাই সম্পন্ন'); await SH(name, r.uri, '').catch(() => { }) }
    } else { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click(); a.remove() }
  } catch (e) { toast(mode === 'doc' ? 'সরাসরি সেভ হয়নি, শেয়ার বাটন ব্যবহার করুন' : 'সেভ করা যায়নি') }
}
async function fxCopy() { toast(await copyText(fxBody()) ? 'কপি হয়েছে' : 'কপি করা যায়নি') }
function fxClear() { if (confirm('সব লেখা মুছবেন?')) { fx.text = ''; fx.name = ''; LS.set('fdraft', ''); render() } }
const pFiles = () => `${back()}<h2>📝 ফাইল কনভার্টার ও সেভার</h2><div class="card">টেক্সট লিখুন/পেস্ট করুন বা ফাইল খুলুন, তারপর নাম ও এক্সটেনশন দিয়ে সেভ করুন। লেখা হুবহু (UTF-8) সংরক্ষিত হয়।<br><span class="muted">এটি শুধু ফাইলের নাম/এক্সটেনশন বদলায়; এক প্রোগ্রামিং ভাষা থেকে অন্য ভাষায় অনুবাদ করে না।</span><label style="margin-top:8px">📂 ফাইল খুলুন</label><input type="file" onchange="fxOpen(this)"></div>
<label>লেখা / কোড</label><textarea id="fxt" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" style="min-height:240px;font-family:monospace;font-size:13px;white-space:pre;overflow:auto" oninput="fxType(this.value)">${esc(fx.text)}</textarea>
<label>ফাইলের নাম (এক্সটেনশন ছাড়া)</label><input value="${attr(fx.name)}" placeholder="যেমন: config, main" oninput="fx.name=this.value;fxInfo()">
<label>এক্সটেনশন</label><div class="chips">${EXTS.map(x => `<button class="chip ${fx.ext === x && !fx.custom.trim() ? 'on' : ''}" onclick="fx.ext='${x}';fx.custom='';render()">${x === 'none' ? 'কিছু নেই' : '.' + x}</button>`).join('')}</div>
<input value="${attr(fx.custom)}" placeholder="অন্য এক্সটেনশন লিখুন (যেমন: swift)" oninput="fx.custom=this.value;fxInfo()">
<label>লাইন শেষ</label><div class="tabs"><button class="${fx.eol === 'LF' ? 'on' : ''}" onclick="fx.eol='LF';render()">LF (Android, সুপারিশকৃত)</button><button class="${fx.eol === 'CRLF' ? 'on' : ''}" onclick="fx.eol='CRLF';render()">CRLF (Windows)</button></div>
<div class="card" id="fxi"></div><button class="btn o w" onclick="fxCheck()">🔍 সিনট্যাক্স যাচাই (JSON / YAML / XML)</button><div id="fxc"></div>
<button class="btn w" onclick="fxSave('share')">📤 সেভ / শেয়ার</button><button class="btn o w" onclick="fxSave('doc')">📁 Documents/JobHunter ফোল্ডারে সেভ</button><div class="row"><button class="btn gh s" onclick="fxCopy()">📋 কপি</button><button class="btn r s" onclick="fxClear()">🗑 মুছুন</button></div><p class="muted">YAML-এ ইন্ডেন্টেশনে ট্যাব দেবেন না, স্পেস ব্যবহার করুন।</p>`;
