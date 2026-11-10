/* ===== Job Hunter 3.0 — CV Builder ===== */
const EMPTY = { name: '', title: '', phone: '', email: '', address: '', paddr: '', link: '', photo: '', sign: '', father: '', mother: '', dob: '', nat: 'Bangladeshi', rel: '', mar: '', gender: '', nid: '', blood: '', obj: '', skills: '', langs: '', hobby: '', edu: [{ deg: '', inst: '', year: '', res: '' }], exp: [], train: [], proj: [], ach: [], vol: [], refs: [] };
const SAMPLE = {
  name: 'Rahim Uddin', title: 'Junior Software Engineer', phone: '+880 1700-000000', email: 'rahim.uddin@gmail.com', address: 'Mirpur-10, Dhaka-1216', paddr: 'Village: Char Kukri, Bhola', link: 'linkedin.com/in/rahimuddin', photo: '',
  father: 'Abdul Karim', mother: 'Rahima Begum', dob: '12 March 2000', nat: 'Bangladeshi', rel: 'Islam', mar: 'Single', gender: 'Male', nid: '', blood: 'B+',
  obj: 'Motivated CSE graduate with hands-on experience in web development and a strong foundation in JavaScript and Python. Seeking an entry-level Software Engineer role to build reliable products, learn from senior engineers and contribute to team goals.',
  skills: 'JavaScript, React, Node.js, Python, SQL, Git & GitHub, HTML/CSS, Problem Solving, Teamwork, MS Office',
  langs: 'Bangla (Native), English (Professional)', hobby: 'Open-source, Reading, Football',
  edu: [{ deg: 'B.Sc. in Computer Science & Engineering', inst: 'University of Dhaka', year: '2023', res: 'CGPA 3.62 / 4.00' }, { deg: 'HSC (Science)', inst: 'Notre Dame College, Dhaka', year: '2018', res: 'GPA 5.00 / 5.00' }, { deg: 'SSC (Science)', inst: 'Bhola Govt. High School', year: '2016', res: 'GPA 5.00 / 5.00' }],
  exp: [{ role: 'Software Engineer Intern', org: 'ABC Tech Ltd., Dhaka', period: 'Jan 2023 – Jun 2023', desc: 'Built 6 responsive web pages with React, improving mobile load time by 35%\nFixed 40+ bugs and wrote unit tests that raised coverage from 45% to 70%\nCollaborated with a 5-member QA team in weekly sprints' }],
  train: [{ name: 'Full-Stack Web Development', inst: 'BITM (ICT Division)', year: '2022' }, { name: 'Google Digital Skills', inst: 'Google Grow', year: '2021' }],
  proj: [{ name: 'Job Portal App', desc: 'Developed a job search web app with filters and bookmarks, used by 300+ students in the university community', link: '' }],
  ach: [{ name: 'Champion, Inter-University Programming Contest 2022', desc: '' }],
  vol: [{ role: 'General Member', org: 'DU Computer Club', period: '2020 – 2023', desc: 'Organized 4 workshops with 150+ participants' }],
  refs: [{ name: 'Dr. Karim Ahmed', info: 'Professor, Dept. of CSE, University of Dhaka — 01XXXXXXXXX' }],
};
let cv = Object.assign(clone(EMPTY), LS.get('cv', {}));
let tpl = LS.get('tpl', 't1'), ac = LS.get('ac', ''), profiles = LS.get('profiles', {});
let cvo = Object.assign({ photo: true, sign: true, personal: true, size: 'm', dense: 'n', fit: true, lang: 'en' }, LS.get('cvo', {}));
let cvTab = 'info', cvOpen = LS.get('cvopen', { basic: true, edu: true });
const save = () => LS.set('cv', cv);
const saveO = () => LS.set('cvo', cvo);

const LISTS = {
  edu: ['🎓 শিক্ষাগত যোগ্যতা', [['deg', 'Degree / Exam (যেমন: B.Sc. in CSE)'], ['inst', 'Institution'], ['year', 'Passing Year'], ['res', 'Result (CGPA 3.50/4.00)']]],
  exp: ['💼 কর্ম অভিজ্ঞতা / ইন্টার্নশিপ', [['role', 'Position'], ['org', 'Organization, Location'], ['period', 'Period (Jan 2023 – Jun 2023)'], ['desc', 'দায়িত্ব ও অর্জন — প্রতি লাইনে একটি পয়েন্ট']]],
  proj: ['🚀 প্রজেক্ট', [['name', 'Project name'], ['link', 'Link (ঐচ্ছিক)'], ['desc', 'কী বানিয়েছেন, কোন টুল, ফলাফল কী']]],
  train: ['📜 প্রশিক্ষণ / সার্টিফিকেট', [['name', 'Course / Certificate'], ['inst', 'Institute'], ['year', 'Year']]],
  ach: ['🏆 অর্জন ও পুরস্কার', [['name', 'Award / Achievement'], ['desc', 'সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)']]],
  vol: ['🤝 সহ-শিক্ষা / স্বেচ্ছাসেবা', [['role', 'Role'], ['org', 'Club / Organization'], ['period', 'Period'], ['desc', 'কাজ (প্রতি লাইনে একটি)']]],
  refs: ['👥 রেফারেন্স', [['name', 'Name'], ['info', 'Designation, Organization, Contact']]],
};
const TPLS = [
  ['t1', '🇧🇩 ক্লাসিক বাংলাদেশ', 'ছবি ও ব্যক্তিগত তথ্যসহ — সরকারি, ব্যাংক ও সাধারণ বেসরকারি চাকরি', '#006a4e'],
  ['t2', '✨ মডার্ন সাইডবার', 'দুই কলাম — করপোরেট, মার্কেটিং ও আইটি', '#0b3d33'],
  ['t3', '🌐 আন্তর্জাতিক ATS', 'ছবি ছাড়া, সিম্পল — বিদেশি কোম্পানি ও ATS সফটওয়্যার', '#000000'],
  ['t4', '🎓 ফ্রেশার / স্টুডেন্ট', 'শিক্ষা ও প্রজেক্ট আগে — ইন্টার্নশিপ ও এন্ট্রি-লেভেল', '#0f8a63'],
  ['t5', '🏦 এক্সিকিউটিভ', 'ফরমাল সেরিফ — ব্যাংক, এনজিও ও সিনিয়র পদ', '#1f2937'],
  ['t6', '🧭 মিনিমাল টাইমলাইন', 'পরিষ্কার ও আধুনিক — ডিজাইনার, ইঞ্জিনিয়ার, ক্রিয়েটিভ', '#0f766e'],
];
const TPLC = Object.fromEntries(TPLS.map(t => [t[0], t[3]]));
const PAL = [['', 'ডিফল্ট'], ['#1e3a8a', 'নীল'], ['#7f1d1d', 'মেরুন'], ['#111827', 'কালো'], ['#6d28d9', 'বেগুনি'], ['#b45309', 'কমলা'], ['#0f766e', 'টিল'], ['#be123c', 'রোজ']];
const LBL = {
  en: { obj: 'Career Objective', edu: 'Education', exp: 'Work Experience', tr: 'Training & Certifications', pj: 'Projects', ach: 'Awards & Achievements', vol: 'Extracurricular Activities', sk: 'Skills', lg: 'Languages', hb: 'Interests', pt: 'Personal Details', rf: 'References', ct: 'Contact', sg: 'Signature', father: "Father's Name", mother: "Mother's Name", dob: 'Date of Birth', nat: 'Nationality', rel: 'Religion', mar: 'Marital Status', gender: 'Gender', nid: 'NID / Birth Reg. No.', blood: 'Blood Group', paddr: 'Permanent Address', addr: 'Present Address' },
  bn: { obj: 'ক্যারিয়ার উদ্দেশ্য', edu: 'শিক্ষাগত যোগ্যতা', exp: 'কর্ম অভিজ্ঞতা', tr: 'প্রশিক্ষণ ও সনদ', pj: 'প্রজেক্ট', ach: 'অর্জন ও পুরস্কার', vol: 'সহ-শিক্ষা কার্যক্রম', sk: 'দক্ষতা', lg: 'ভাষা', hb: 'আগ্রহ', pt: 'ব্যক্তিগত তথ্য', rf: 'রেফারেন্স', ct: 'যোগাযোগ', sg: 'স্বাক্ষর', father: 'পিতার নাম', mother: 'মাতার নাম', dob: 'জন্ম তারিখ', nat: 'জাতীয়তা', rel: 'ধর্ম', mar: 'বৈবাহিক অবস্থা', gender: 'লিঙ্গ', nid: 'এনআইডি / জন্মনিবন্ধন নম্বর', blood: 'রক্তের গ্রুপ', paddr: 'স্থায়ী ঠিকানা', addr: 'বর্তমান ঠিকানা' },
};

/* ---------- form ---------- */
const F = (k, l, t = 'text', ph = '') => `<label>${l}</label>${t === 'area' ? `<textarea id="f_${k}" placeholder="${attr(ph)}" oninput="setF('${k}',this.value)">${esc(cv[k])}</textarea>` : `<input type="${t}" ${t === 'tel' ? 'inputmode="tel"' : ''} placeholder="${attr(ph)}" value="${attr(cv[k])}" oninput="setF('${k}',this.value)">`}`;
function setF(k, v) { cv[k] = v; save() }
function setL(k, i, f, v) { cv[k][i][f] = v; save() }
function addL(k) { const o = {}; LISTS[k][1].forEach(f => o[f[0]] = ''); cv[k].push(o); cvOpen[k] = true; save(); render() }
function delL(k, i) { if (!confirm('এই আইটেমটি মুছবেন?')) return; cv[k].splice(i, 1); save(); render() }
function mvL(k, i, d) { const j = i + d; if (j < 0 || j >= cv[k].length) return; [cv[k][i], cv[k][j]] = [cv[k][j], cv[k][i]]; save(); render() }
const secOpen = k => cvOpen[k] ? 'open' : '';
const tg = k => `ontoggle="cvOpen['${k}']=this.open;LS.set('cvopen',cvOpen)"`;
function listEd(k) {
  const [t, fs] = LISTS[k];
  return `<details ${secOpen(k)} ${tg(k)}><summary>${t} <span class="pill">${has(cv[k]).length}</span></summary>${cv[k].map((it, i) => `<div class="item">${fs.map(f => (f[0] === 'desc') ? `<textarea id="t_${k}_${i}" placeholder="${attr(f[1])}" oninput="setL('${k}',${i},'desc',this.value)">${esc(it.desc)}</textarea>` : `<input placeholder="${attr(f[1])}" value="${attr(it[f[0]])}" oninput="setL('${k}',${i},'${f[0]}',this.value)">`).join('')}<div class="row">${(k === 'exp' || k === 'vol' || k === 'proj') ? `<button class="btn gh s" onclick="bulletSheet('${k}',${i})">✨ পয়েন্ট সাজেশন</button>` : ''}<button class="btn gh s" onclick="mvL('${k}',${i},-1)">↑</button><button class="btn gh s" onclick="mvL('${k}',${i},1)">↓</button><button class="btn r s" onclick="delL('${k}',${i})">মুছুন</button></div></div>`).join('')}<button class="btn o s" onclick="addL('${k}')">＋ যোগ করুন</button><div style="height:10px"></div></details>`;
}
function cvForm() {
  const sc = cvScore();
  const prof = Object.keys(profiles);
  return `<div class="card hl"><div class="prog"><div class="ring" style="--p:${sc.score}"><i>${bn(sc.score)}</i></div><div style="flex:1"><b>সিভি স্কোর ${bn(sc.score)}/১০০</b><div class="muted">${sc.score >= 80 ? 'চমৎকার! সিভি প্রায় প্রস্তুত 🎉' : sc.score >= 55 ? 'ভালো চলছে — নিচের টিপস দেখুন' : 'আরও তথ্য যোগ করলে স্কোর বাড়বে'}</div><button class="btn gh s" style="margin-top:6px" onclick="scoreSheet()">💡 উন্নতির টিপস (${bn(sc.tips.length)})</button></div></div></div>
<div class="card"><label>📁 সংরক্ষিত সিভি (সরকারি / কর্পোরেট — আলাদা আলাদা রাখুন)</label><select onchange="loadProfile(this.value)"><option value="">— বাছুন —</option>${prof.map(n => `<option>${esc(n)}</option>`).join('')}</select><div class="row"><button class="btn o s" onclick="saveProfile()">💾 নতুন নামে সেভ</button><button class="btn r s" onclick="delProfile()">নির্বাচিতটি মুছুন</button></div></div>
<div class="row" style="margin-bottom:6px"><button class="btn gh s" onclick="loadSample()">নমুনা তথ্য দেখুন</button><button class="btn gh s" onclick="resetCV()">সব মুছুন</button></div>
<details ${secOpen('basic')} ${tg('basic')}><summary>👤 মূল তথ্য</summary>${F('name', 'পূর্ণ নাম (Full Name) *', 'text', 'Md. Rahim Uddin')}${F('title', 'পদবি / Job Title *', 'text', 'যেমন: Junior Software Engineer, Fresh Graduate')}${F('phone', 'মোবাইল *', 'tel', '+8801XXXXXXXXX')}${F('email', 'ইমেইল * (পেশাদার — নাম দিয়ে বানান)', 'email', 'yourname@gmail.com')}${F('address', 'বর্তমান ঠিকানা', 'text', 'এলাকা, জেলা')}${F('link', 'LinkedIn / GitHub / Portfolio', 'text', 'linkedin.com/in/yourname')}<label>ছবি (পাসপোর্ট সাইজ, পরিষ্কার আলোয় তোলা)</label><input type="file" accept="image/*" onchange="pickPhoto(this)">${cv.photo ? `<div class="row"><img src="${cv.photo}" width="64" style="border-radius:8px"><button class="btn gh s" onclick="recrop()">✂️ আবার ক্রপ</button><button class="btn r s" onclick="cv.photo='';save();render()">ছবি সরান</button></div>` : ''}<label style="margin-top:8px">✍️ স্বাক্ষর (সরকারি/ব্যাংক সিভির জন্য)</label><div class="row"><button class="btn gh s" onclick="signSheet()">✍️ আঙুলে আঁকুন</button><label class="btn gh s" style="margin:0;color:var(--g)">📷 কাগজের ছবি থেকে<input type="file" accept="image/*" hidden onchange="signUpload(this)"></label></div>${cv.sign ? `<div class="row" style="margin-top:6px"><img src="${cv.sign}" style="height:44px;background:#fff;border:1px solid var(--b);border-radius:8px;padding:2px"><button class="btn r s" onclick="signDel()">স্বাক্ষর সরান</button></div>` : ''}</details>
<details ${secOpen('obj')} ${tg('obj')}><summary>🎯 ক্যারিয়ার সারসংক্ষেপ (Summary)</summary>${F('obj', 'আপনার সম্পর্কে ২–৪ লাইন', 'area', 'আমি কী পারি, কী খুঁজছি')}<button class="btn gh s" onclick="summarySheet()">✨ রেডি সামারি বেছে নিন</button><div style="height:10px"></div></details>
${listEd('edu')}${listEd('exp')}${listEd('proj')}
<details ${secOpen('skills')} ${tg('skills')}><summary>🛠️ স্কিল, ভাষা, আগ্রহ</summary>${F('skills', 'Skills (কমা দিয়ে)', 'area', 'Communication, MS Excel, ...')}<button class="btn gh s" onclick="skillSheet()">✨ স্কিল সাজেশন</button>${F('langs', 'Languages (কমা দিয়ে)', 'area', 'Bangla (Native), English (Fluent)')}${F('hobby', 'Interests (কমা দিয়ে)', 'area')}</details>
${listEd('train')}${listEd('ach')}${listEd('vol')}
<details ${secOpen('pers')} ${tg('pers')}><summary>🪪 ব্যক্তিগত তথ্য (সরকারি/ব্যাংক জবের জন্য)</summary>${F('father', "Father's Name")}${F('mother', "Mother's Name")}${F('dob', 'Date of Birth', 'text', '12 March 2000')}${F('gender', 'Gender')}${F('nat', 'Nationality')}${F('rel', 'Religion')}${F('mar', 'Marital Status')}${F('nid', 'NID / Birth Reg. No.')}${F('blood', 'Blood Group')}${F('paddr', 'Permanent Address (স্থায়ী ঠিকানা)')}</details>
${listEd('refs')}<button class="btn w" onclick="cvTab='tpl';render();scrollTo(0,0)">পরের ধাপ: টেমপ্লেট বাছুন →</button>`;
}
function loadSample() { if (!confirm('বর্তমান তথ্য মুছে নমুনা তথ্য বসবে। এগোবেন?')) return; cv = clone(SAMPLE); save(); render(); toast('নমুনা তথ্য লোড হয়েছে') }
function resetCV() { if (confirm('সব তথ্য মুছে ফেলবেন?')) { cv = clone(EMPTY); save(); render() } }
/* ---------- writing helpers ---------- */
const SUMS = [
  ['ফ্রেশার', 'Motivated and detail-oriented {deg} with a strong academic foundation and good communication skills. Eager to start a career as {title}, apply my knowledge, learn from experienced professionals and contribute to the organization\'s growth.'],
  ['আইটি', 'Aspiring {title} with hands-on experience in {skills}. Built academic and personal projects, comfortable with problem-solving and teamwork. Seeking an entry-level opportunity to grow in a fast-paced technology team.'],
  ['ব্যাংক', 'Dedicated {deg} with strong analytical, numerical and customer-communication skills. Seeking an Officer / Trainee Officer role in a reputed bank to deliver accurate, customer-focused service and support the institution\'s growth.'],
  ['শিক্ষকতা', 'Passionate and disciplined graduate with strong subject knowledge, clear communication and classroom-management skills. Seeking a teaching position to inspire students and contribute to quality education.'],
  ['এনজিও', 'Community-oriented professional with strong field, reporting and coordination skills. Seeking a role in the development sector to contribute to sustainable and inclusive impact for communities in Bangladesh.'],
  ['মার্কেটিং/সেলস', 'Result-driven and creative {title} with skills in {skills}. Strong communicator who builds customer relationships and delivers measurable growth in sales and brand reach.'],
  ['অভিজ্ঞ', '{title} with [X] years of experience in [industry]. Proven record of delivering results, leading small teams and improving processes. Looking to take on greater responsibility in a growth-oriented organization.'],
  ['সরকারি (বাংলা)', 'আমি একজন সৎ, পরিশ্রমী ও দায়িত্বশীল নাগরিক। নিজের শিক্ষাগত যোগ্যতা ও আন্তরিকতা দিয়ে সরকারি/স্বায়ত্তশাসিত প্রতিষ্ঠানে দক্ষতার সাথে দায়িত্ব পালন করে দেশের সেবা করতে চাই।'],
];
function fillTok(s) {
  const deg = (has(cv.edu)[0] || {}).deg, sk = String(cv.skills || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 3).join(', ');
  return s.replace('{deg}', deg ? 'graduate (' + deg + ')' : 'graduate').replace('{title}', cv.title || 'professional').replace('{skills}', sk || 'relevant tools and technologies');
}
function summarySheet() { sheet(`<h3>✨ সামারি বেছে নিন</h3><p class="muted">ট্যাপ করলে আপনার তথ্য দিয়ে বসে যাবে। পরে নিজের মতো বদলে নিন।</p>${SUMS.map((s, i) => `<button class="opt" onclick="useSum(${i})"><span class="pill">${s[0]}</span><br>${esc(fillTok(s[1]))}</button>`).join('')}`) }
function useSum(i) { cv.obj = fillTok(SUMS[i][1]); save(); closeSheet(); cvOpen.obj = true; render(); toast('সামারি বসেছে — নিজের মতো বদলে নিন') }
const SK = { 'আইটি': 'HTML, CSS, JavaScript, Python, SQL, Git & GitHub, React, Node.js, Linux, Networking, Problem Solving', 'অফিস': 'MS Word, MS Excel, MS PowerPoint, Email Writing, Bangla & English Typing, Data Entry, Report Writing, Time Management', 'ব্যাংক/হিসাব': 'Customer Service, Accounting, Financial Analysis, MS Excel, Tally, Numerical Ability, Banking Fundamentals', 'মার্কেটিং': 'Digital Marketing, Facebook Ads, SEO, Content Writing, Canva, Copywriting, Social Media, Sales, Negotiation', 'ডিজাইন': 'Photoshop, Illustrator, Figma, Canva, UI/UX, Video Editing, Typography', 'শিক্ষকতা': 'Lesson Planning, Classroom Management, Public Speaking, Student Counseling, Curriculum Design', 'এনজিও': 'Report Writing, Field Work, Data Collection, Community Engagement, Project Management, KoBo / ODK', 'সফট স্কিল': 'Teamwork, Leadership, Critical Thinking, Adaptability, Problem Solving, Time Management, Communication' };
function skillSheet() { sheet(`<h3>✨ স্কিল সাজেশন</h3><p class="muted">শুধু যেগুলো সত্যিই পারেন, সেগুলো যোগ করুন।</p>${Object.keys(SK).map(k => `<h3>${k}</h3><div class="row">${SK[k].split(', ').map(s => `<button class="chip" onclick="addSkill('${attr(s)}')">＋ ${esc(s)}</button>`).join('')}</div>`).join('')}<button class="btn w mt" onclick="closeSheet();render()">হয়েছে</button>`) }
function addSkill(s) { const a = String(cv.skills || '').split(',').map(x => x.trim()).filter(Boolean); if (!a.some(x => x.toLowerCase() === s.toLowerCase())) { a.push(s); cv.skills = a.join(', '); save(); toast('যোগ হয়েছে: ' + s) } else toast('আগেই আছে') }
const VERBS = 'Developed,Managed,Led,Designed,Coordinated,Implemented,Improved,Organized,Analyzed,Delivered,Trained,Streamlined,Prepared,Increased,Reduced,Launched'.split(',');
const BUL = ['Managed [task] for [N] customers/clients, maintaining [X]% satisfaction', 'Developed [feature/product] using [tool], reducing [time/cost] by [X]%', 'Led a team of [N] members to complete [project] before the deadline', 'Prepared weekly reports and presented insights to the manager', 'Coordinated with [N] departments to resolve issues within [time]', 'Increased [sales/followers/traffic] by [X]% in [N] months', 'Assisted in [process], ensuring accuracy and on-time delivery', 'Organized [event] with [N]+ participants', 'Trained [N] new team members on [skill/process]'];
function bulletSheet(k, i) { sheet(`<h3>✨ শক্তিশালী পয়েন্ট লেখার সাজেশন</h3><p class="muted">ট্যাপ করলে লাইনটি যোগ হবে — [ ] এর জায়গায় নিজের তথ্য ও সংখ্যা বসান। সংখ্যা থাকলে সিভি অনেক শক্তিশালী হয়।</p><b>Action verb দিয়ে শুরু করুন:</b><div class="row" style="margin:6px 0 10px">${VERBS.map(v => `<span class="pill">${v}</span>`).join('')}</div>${BUL.map(b => `<button class="opt" onclick="addBul('${k}',${i},this.dataset.t)" data-t="${attr(b)}">＋ ${esc(b)}</button>`).join('')}<button class="btn w mt" onclick="closeSheet();render()">হয়েছে</button>`) }
function addBul(k, i, t) { const o = cv[k][i]; o.desc = (o.desc ? o.desc.replace(/\s+$/, '') + '\n' : '') + t; save(); toast('লাইন যোগ হয়েছে — সম্পাদনা করুন') }

/* ---------- score ---------- */
const has = a => (a || []).filter(x => Object.values(x).some(v => String(v || '').trim()));
function cvScore(d = cv) {
  let s = 0; const tips = [], add = (ok, pts, tip) => { if (ok) s += pts; else if (tip) tips.push(tip) };
  const all = [...has(d.exp), ...has(d.proj), ...has(d.vol)];
  const descs = all.map(x => x.desc || '').filter(Boolean);
  add(d.name.trim().length > 2, 5, '❌ আপনার পূর্ণ নাম লিখুন');
  add(d.title.trim(), 6, '❌ পদবি / Job Title লিখুন (যে পদে আবেদন করছেন)');
  add(/^(\+?88)?0?1[3-9]\d{8}$/.test(d.phone.replace(/[\s-]/g, '')), 6, '❌ সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)');
  add(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(d.email.trim()), 5, '❌ সঠিক ইমেইল ঠিকানা দিন');
  add(!/(cute|lover|boy\d|girl\d|king|queen|sexy|hot|baby|dream|killer|angel)/i.test(d.email) || !d.email, 3, '⚠️ ইমেইলটি পেশাদার নয় — নাম দিয়ে নতুন ইমেইল বানান (যেমন rahim.uddin@gmail.com)');
  add(d.address.trim(), 3, '❌ ঠিকানা (এলাকা ও জেলা) যোগ করুন');
  add(d.obj.trim().length >= 80 && d.obj.length <= 500, 10, d.obj.trim().length ? (d.obj.length > 500 ? '⚠️ সামারি বেশি বড় — ২–৪ লাইনে রাখুন' : '⚠️ সামারি খুব ছোট — ✨ রেডি সামারি ব্যবহার করুন') : '❌ ক্যারিয়ার সামারি লিখুন (১০ পয়েন্ট)');
  add(has(d.edu).length >= 1, 10, '❌ অন্তত একটি শিক্ষাগত যোগ্যতা যোগ করুন');
  add(has(d.edu).length >= 2, 3, '💡 SSC/HSC সহ সব শিক্ষাস্তর যোগ করুন (বাংলাদেশের সিভিতে প্রত্যাশিত)');
  add(all.length >= 1, 12, '❌ অভিজ্ঞতা, ইন্টার্নশিপ বা প্রজেক্ট যোগ করুন — ফ্রেশারদের জন্য প্রজেক্টই অভিজ্ঞতা');
  add(descs.some(t => t.split('\n').filter(x => x.trim()).length >= 2), 8, '💡 অভিজ্ঞতা/প্রজেক্টে প্রতি লাইনে একটি করে কমপক্ষে ২–৩টি পয়েন্ট লিখুন');
  add(descs.some(t => /\d/.test(t)), 8, '💡 পয়েন্টে সংখ্যা ব্যবহার করুন (যেমন: "৩০% বাড়িয়েছি", "১৫০ জন অংশগ্রহণকারী")');
  add(descs.every(t => t.split('\n').every(l => l.length <= 230)), 2, '⚠️ কিছু পয়েন্ট অতিরিক্ত লম্বা — ছোট ও পরিষ্কার রাখুন');
  const nsk = String(d.skills).split(/[,\n]/).filter(x => x.trim()).length;
  add(nsk >= 6, 9, nsk ? '💡 কমপক্ষে ৬টি স্কিল লিখুন (এখন ' + nsk + 'টি)' : '❌ স্কিল যোগ করুন — ✨ স্কিল সাজেশন দেখুন');
  add(d.langs.trim(), 3, '💡 ভাষাদক্ষতা যোগ করুন (Bangla, English)');
  add(has(d.train).length || has(d.ach).length, 5, '💡 একটি কোর্স, সার্টিফিকেট বা অর্জন যোগ করুন');
  add(has(d.vol).length || d.hobby.trim(), 2, '💡 ক্লাব/স্বেচ্ছাসেবা বা আগ্রহ যোগ করুন');
  add(d.link.trim(), 3, '💡 LinkedIn বা পোর্টফোলিও লিংক দিন');
  add(d.photo || !cvo.photo, 2, '💡 BD-স্টাইল সিভির জন্য পাসপোর্ট সাইজ ছবি যোগ করুন');
  add(has(d.refs).length, 2, '💡 একজন রেফারেন্স যোগ করুন (শিক্ষক/ম্যানেজার)');
  return { score: Math.min(100, s), tips };
}
function scoreSheet() { const r = cvScore(); sheet(`<h3>💡 সিভি উন্নতির টিপস</h3><div class="bar"><i style="width:${r.score}%"></i></div><p class="muted">স্কোর ${bn(r.score)}/১০০</p>${r.tips.length ? r.tips.map(t => `<div class="tip">${esc(t)}</div>`).join('') : '<p>🎉 অসাধারণ! কোনো বড় ঘাটতি নেই। এবার টেমপ্লেট বেছে PDF নিন।</p>'}<div class="card"><b>চাকরির আগে শেষ যাচাই</b><div class="tip">✅ বানান ও তারিখ মিলিয়েছেন?</div><div class="tip">✅ প্রতিটি পদের জন্য পদের সাথে মিল রেখে স্কিল সাজিয়েছেন?</div><div class="tip">✅ ফ্রেশার হলে ১ পৃষ্ঠা, অভিজ্ঞ হলে সর্বোচ্চ ২ পৃষ্ঠা?</div><div class="tip">✅ ফাইলের নাম: Name_CV.pdf</div></div><button class="btn w" onclick="closeSheet()">ঠিক আছে</button>`) }

/* ---------- builder (HTML for the 6 templates) ---------- */
const br = s => esc(s).replace(/\n/g, '<br>');
const bul = s => { const L = String(s || '').split(/\n/).map(x => x.replace(/^\s*[-•*·▪●‣]+\s*/, '').trim()).filter(Boolean); return L.length > 1 ? `<ul>${L.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : L.length ? `<p class="is">${esc(L[0])}</p>` : '' };
const chips = s => { const a = String(s || '').split(/[,\n]/).map(x => x.trim()).filter(Boolean); return a.length ? `<div class="ch">${a.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : '' };
const itm = (title, sub, date, body) => `<div class="it"><div class="ih"><b>${title}</b>${date ? `<span class="dt">${esc(date)}</span>` : ''}</div>${sub ? `<div class="is">${sub}</div>` : ''}${body || ''}</div>`;
function cvHTML(d, t, o = cvo, color = ac) {
  const L = LBL[o.lang] || LBL.en;
  const eduA = has(d.edu).map(e => itm(esc(e.deg), esc(e.inst) + (e.res ? ` — <span class="gpa">${esc(e.res)}</span>` : ''), e.year));
  const expA = has(d.exp).map(e => itm(esc(e.role), esc(e.org), e.period, bul(e.desc)));
  const trA = has(d.train).map(e => itm(esc(e.name), esc(e.inst), e.year));
  const pjA = has(d.proj).map(e => itm(esc(e.name) + (e.link ? ` <small style="font-weight:400;color:#555">(${esc(e.link)})</small>` : ''), '', '', bul(e.desc)));
  const achA = has(d.ach).map(e => itm(esc(e.name), '', '', e.desc ? bul(e.desc) : ''));
  const volA = has(d.vol).map(e => itm(esc(e.role), esc(e.org), e.period, bul(e.desc)));
  const rfA = has(d.refs).map(e => itm(esc(e.name), esc(e.info)));
  const P = [[L.father, d.father], [L.mother, d.mother], [L.dob, d.dob], [L.gender, d.gender], [L.nat, d.nat], [L.rel, d.rel], [L.mar, d.mar], [L.nid, d.nid], [L.blood, d.blood], [L.paddr, d.paddr]].filter(x => x[1] && String(x[1]).trim());
  const pt = (o.personal && P.length) ? `<table class="pt">${P.map(x => `<tr><td>${x[0]}</td><td>: ${esc(x[1])}</td></tr>`).join('')}</table>` : '';
  const contact = [d.phone, d.email, d.address, d.link].filter(x => x && x.trim()).map(esc);
  const showPh = d.photo && o.photo && t !== 't3';
  const sg = (d.sign && o.sign !== false) ? `<div class="sg"><img src="${d.sign}"><div>${L.sg}</div></div>` : '';
  const ph = showPh ? `<img class="ph" src="${d.photo}">` : '';
  const sec = (title, body) => !body || (Array.isArray(body) && !body.length) ? '' : Array.isArray(body) ? `<section><div class="kp"><h3>${title}</h3>${body[0]}</div>${body.slice(1).join('')}</section>` : `<section><div class="kp"><h3>${title}</h3>${body}</div></section>`;
  const sc6 = (title, body) => !body || (Array.isArray(body) && !body.length) ? '' : `<section class="sc"><h3>${title}</h3><div>${Array.isArray(body) ? body.join('') : body}</div></section>`;
  const S = t === 't6' ? sc6 : sec;
  const objB = d.obj && d.obj.trim() ? `<p>${br(d.obj)}</p>` : '';
  const sk = S(L.sk, chips(d.skills)), lg = S(L.lg, chips(d.langs)), hb = S(L.hb, chips(d.hobby));
  const blocks = { obj: S(L.obj, objB), edu: S(L.edu, eduA), exp: S(L.exp, expA), tr: S(L.tr, trA), pj: S(L.pj, pjA), ach: S(L.ach, achA), vol: S(L.vol, volA), sk, lg, hb, pt: S(L.pt, pt), rf: S(L.rf, rfA) };
  const head = `<h1>${esc(d.name || 'Your Name')}</h1>${d.title ? `<div class="tt">${esc(d.title)}</div>` : ''}`;
  const sz = { s: 12.5, m: 13.5, l: 14.5 }[o.size] || 13.5, gap = o.dense === 'c' ? .72 : 1;
  const sty = `--ac:${color || TPLC[t] || '#006a4e'};--fs:${sz}px;--gap:${gap}`;
  let h;
  if (t === 't2') {
    const side = (title, b) => b ? `<h3>${title}</h3>${b}` : '';
    h = `<div class="cv t2" style="${sty}"><aside>${ph}${side(L.ct, contact.map(c => `<div>${c}</div>`).join(''))}${side(L.sk, chips(d.skills))}${side(L.lg, chips(d.langs))}${side(L.hb, chips(d.hobby))}${side(L.pt, pt)}</aside><main>${head}${blocks.obj + blocks.exp + blocks.edu + blocks.pj + blocks.tr + blocks.ach + blocks.vol + blocks.rf}</main></div>`;
  } else if (t === 't3') h = `<div class="cv t3" style="${sty}"><div class="hd">${head}<div class="ct">${contact.join(' &nbsp;|&nbsp; ')}</div></div>${blocks.obj + blocks.sk + blocks.exp + blocks.pj + blocks.edu + blocks.tr + blocks.ach + blocks.vol + blocks.lg + blocks.rf}</div>`;
  else if (t === 't5') h = `<div class="cv t5" style="${sty}"><div class="hd">${head}<div class="ct">${contact.join(' &nbsp;|&nbsp; ')}</div></div>${blocks.obj + blocks.exp + blocks.edu + blocks.tr + blocks.pj + blocks.ach + blocks.vol + blocks.sk + blocks.lg + blocks.pt + blocks.rf}</div>`;
  else if (t === 't4') h = `<div class="cv t4" style="${sty}"><div class="band">${ph}<div>${head}<div class="ct">${contact.join(' &nbsp;•&nbsp; ')}</div></div></div><div class="bd">${blocks.obj + blocks.edu + blocks.pj + blocks.exp + blocks.tr + blocks.ach + blocks.vol + blocks.sk + blocks.lg + blocks.pt + blocks.hb + blocks.rf}</div></div>`;
  else if (t === 't6') h = `<div class="cv t6" style="${sty}"><div class="hd"><div>${head}<div class="ct">${contact.map(c => `<span>${c}</span>`).join('')}</div></div>${ph}</div>${blocks.obj + blocks.exp + blocks.edu + blocks.pj + blocks.tr + blocks.ach + blocks.vol + blocks.sk + blocks.lg + blocks.pt + blocks.hb + blocks.rf}</div>`;
  else h = `<div class="cv t1" style="${sty}"><div class="hd"><div>${head}<div class="ct" style="margin-top:6px">${contact.join('<br>')}</div></div>${ph}</div>${blocks.obj + blocks.edu + blocks.exp + blocks.tr + blocks.pj + blocks.ach + blocks.vol + blocks.sk + blocks.lg + blocks.pt + blocks.hb + blocks.rf}</div>`;
  if (sg) { if (t === 't2') h = h.replace(/<\/main><\/div>$/, sg + '</main></div>'); else if (t === 't4') h = h.replace(/<\/div><\/div>$/, sg + '</div></div>'); else if (t !== 't3') h = h.replace(/<\/div>$/, sg + '</div>') }
  return h;
}
/* shrink font/spacing step by step until the CV fits one A4 page (only when it is "almost" one page) */
function fitCV(el) {
  const root = el.classList.contains('cv') ? el : el.querySelector('.cv'); if (!root) return 1;
  const MAX = 1040, fs0 = parseFloat(getComputedStyle(root).getPropertyValue('--fs')) || 13.5;
  const gap0 = parseFloat(getComputedStyle(root).getPropertyValue('--gap')) || 1;
  root.style.minHeight = '0'; let h = root.offsetHeight;
  if (h > MAX && h < MAX * 1.22) {
    for (const k of [.96, .93, .9, .87, .84, .81]) { root.style.setProperty('--fs', (fs0 * k).toFixed(2) + 'px'); root.style.setProperty('--gap', (gap0 * k * .9).toFixed(2)); h = root.offsetHeight; if (h <= MAX) break }
  }
  root.style.minHeight = ''; return Math.max(1, Math.ceil(h / 1047));
}
const pages = () => { const w = document.createElement('div'); w.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px'; w.innerHTML = cvHTML(cv, tpl); document.body.appendChild(w); const n = cvo.fit ? fitCV(w) : Math.max(1, Math.ceil(w.firstElementChild.offsetHeight / 1047)); w.remove(); return n };

/* ---------- pages: template + preview ---------- */
const thumb = t => `<div class="th"><div style="width:794px;transform:scale(.058);transform-origin:0 0;pointer-events:none">${cvHTML(SAMPLE, t, Object.assign({}, cvo, { photo: false }), ac)}</div></div>`;
const sw = (k, l, sub) => `<div class="trow"><div><b>${l}</b>${sub ? `<div class="muted sm">${sub}</div>` : ''}</div><label class="sw"><input type="checkbox" ${cvo[k] ? 'checked' : ''} onchange="cvo['${k}']=this.checked;saveO()"><i></i></label></div>`;
function cvTpl() {
  return `<p class="muted">টেমপ্লেট বদলালেও আপনার তথ্য একই থাকে। চাকরির ধরন অনুযায়ী বাছুন।</p>${TPLS.map(t => `<button class="tp ${tpl === t[0] ? 'on' : ''}" onclick="tpl='${t[0]}';LS.set('tpl',tpl);render()">${thumb(t[0])}<div><b>${t[1]}</b><br><span class="muted">${t[2]}</span></div></button>`).join('')}
<h3>🎨 সিভির রং</h3><div class="row">${PAL.map(p => `<button class="chip" style="background:${p[0] || TPLC[tpl]};color:#fff;border-color:transparent;${ac === p[0] ? 'outline:3px solid #f23a4d' : ''}" onclick="setAc('${p[0]}')">${p[1]}</button>`).join('')}<input type="color" value="${ac || TPLC[tpl]}" style="width:44px;height:36px;padding:2px;margin:0" onchange="setAc(this.value)"></div>
<div class="card mt"><h3 style="margin-top:0">⚙️ সিভির সেটিংস</h3>${sw('photo', '📷 ছবি দেখান', 'আন্তর্জাতিক/ATS সিভিতে বন্ধ রাখুন')}${sw('sign', '✍️ স্বাক্ষর দেখান', 'সিভির শেষে (ATS টেমপ্লেটে দেখানো হয় না)')}${sw('personal', '🪪 ব্যক্তিগত তথ্য দেখান', 'পিতা-মাতা, জন্মতারিখ, NID — বিদেশি সিভিতে বন্ধ রাখুন')}${sw('fit', '📄 এক পৃষ্ঠায় ফিট করুন (অটো)', 'সামান্য বেশি হলে লেখা একটু ছোট করে এক পাতায় আনে')}
<label>সেকশনের ভাষা</label><div class="tabs"><button class="${cvo.lang === 'en' ? 'on' : ''}" onclick="cvo.lang='en';saveO();render()">English</button><button class="${cvo.lang === 'bn' ? 'on' : ''}" onclick="cvo.lang='bn';saveO();render()">বাংলা</button></div>
<label>লেখার সাইজ</label><div class="tabs">${[['s', 'ছোট'], ['m', 'মাঝারি'], ['l', 'বড়']].map(x => `<button class="${cvo.size === x[0] ? 'on' : ''}" onclick="cvo.size='${x[0]}';saveO();render()">${x[1]}</button>`).join('')}</div>
<label>ফাঁকা জায়গা</label><div class="tabs"><button class="${cvo.dense === 'n' ? 'on' : ''}" onclick="cvo.dense='n';saveO();render()">স্বাভাবিক</button><button class="${cvo.dense === 'c' ? 'on' : ''}" onclick="cvo.dense='c';saveO();render()">কম্প্যাক্ট</button></div></div>
<button class="btn w" onclick="cvTab='view';render();scrollTo(0,0)">প্রিভিউ দেখুন →</button>`;
}
function setAc(c) { ac = c; LS.set('ac', c); render() }
function cvView() {
  const sc = cvScore();
  return `<div class="row"><button class="btn" onclick="exportPDF()">📥 PDF</button><button class="btn o" onclick="exportWord()">📝 Word (.doc)</button><button class="btn gh" onclick="cvTab='tpl';render()">🎨 বদলান</button></div>
<div class="card" style="margin:10px 0"><div class="row sb"><span><b>সিভি স্কোর ${bn(sc.score)}/১০০</b></span><button class="btn gh s" onclick="scoreSheet()">টিপস দেখুন</button></div><div class="bar" style="margin-top:6px"><i style="width:${sc.score}%"></i></div></div>
<div class="pw" id="pw"><div class="pwi" id="pwi">${cvHTML(cv, tpl)}</div></div><p class="muted" id="pgn"></p>
<div class="card"><b>কোন ফরম্যাট কখন?</b><div class="tip">📄 <span><b>PDF</b> — ইমেইল, WhatsApp ও অনলাইন আবেদনে পাঠানোর জন্য সেরা। বাংলা ফন্টও ঠিক থাকে।</span></div><div class="tip">📝 <span><b>Word</b> — পরে নিজে এডিট করতে চাইলে, বা কোনো ATS পোর্টাল টেক্সট পড়তে চাইলে।</span></div></div>`;
}
function fitPreview() {
  const w = $('#pw'), i = $('#pwi'); if (!w || !i) return;
  const root = i.querySelector('.cv'); const n = cvo.fit ? fitCV(i) : 0; const s = Math.min(1, w.clientWidth / 794);
  i.style.transform = `scale(${s})`; const H = i.offsetHeight; w.style.height = (H * s) + 'px';
  const pc = Math.max(1, Math.ceil(H / 1047)); i.querySelectorAll('.pgmark').forEach(x => x.remove());
  for (let p = 1; p < pc; p++) { const m = document.createElement('div'); m.className = 'pgmark'; m.style.top = (p * 1047) + 'px'; m.innerHTML = `<span>পেজ ${p + 1} শুরু</span>`; i.appendChild(m) }
  const pn = $('#pgn'); if (pn) pn.textContent = `📄 মোট পেজ: ${bn(pc)}${pc > 2 ? ' — সিভি ২ পেজের মধ্যে রাখা ভালো। কম গুরুত্বপূর্ণ তথ্য কমান বা কম্প্যাক্ট/ছোট সাইজ বেছে নিন।' : pc === 2 ? ' — অভিজ্ঞদের জন্য ঠিক আছে; ফ্রেশার হলে ১ পেজে আনার চেষ্টা করুন।' : ' — আদর্শ ✅'}`;
}
async function exportPDF() {
  if (!cv.name.trim()) { toast('আগে নাম লিখুন'); return }
  if (!window.html2pdf) { toast('PDF লাইব্রেরি পাওয়া যায়নি'); return }
  toast('PDF তৈরি হচ্ছে... একটু অপেক্ষা করুন');
  const wrap = document.createElement('div'); wrap.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff'; wrap.innerHTML = cvHTML(cv, tpl); document.body.appendChild(wrap);
  const name = (cv.name.trim().replace(/[^\w\u0980-\u09FF]+/g, '_') || 'My') + '_CV.pdf';
  try { const pc = cvo.fit ? fitCV(wrap) : Math.ceil(wrap.firstElementChild.offsetHeight / 1047); await elementToPDF(wrap.firstElementChild, name, { margin: [10, 0, 10, 0], scale: pc > 2 ? 2 : 2.5 }); toast('✅ PDF তৈরি হয়েছে') }
  catch (e) { toast('PDF তৈরি করা যায়নি — আবার চেষ্টা করুন') }
  wrap.remove();
}
function cvWord(d = cv, o = cvo) {
  const L = LBL[o.lang] || LBL.en, col = ac || TPLC[tpl] || '#006a4e';
  const H = t => `<h2 style="color:${col};border-bottom:1.5pt solid ${col};font:bold 12pt Arial;margin:14pt 0 5pt;padding-bottom:2pt;text-transform:uppercase">${t}</h2>`;
  const it = (a, b, c, desc) => `<p style="margin:0 0 1pt"><b>${esc(a)}</b>${c ? `<span style="float:right">${esc(c)}</span>` : ''}</p>${b ? `<p style="margin:0 0 2pt;color:#444">${esc(b)}</p>` : ''}${desc ? `<ul style="margin:2pt 0 7pt">${String(desc).split(/\n/).map(x => x.replace(/^\s*[-•*]+\s*/, '').trim()).filter(Boolean).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p style="margin:0 0 5pt"></p>'}`;
  let b = `<h1 style="font:bold 22pt Arial;color:${col};margin:0">${esc(d.name)}</h1>${d.title ? `<p style="font:12pt Arial;margin:0 0 3pt">${esc(d.title)}</p>` : ''}<p style="font:10pt Arial;color:#333">${[d.phone, d.email, d.address, d.link].filter(Boolean).map(esc).join(' | ')}</p>`;
  if (d.obj) b += H(L.obj) + `<p>${br(d.obj)}</p>`;
  const lst = (title, arr, f) => { arr = has(arr); if (arr.length) b += H(title) + arr.map(f).join('') };
  lst(L.exp, d.exp, e => it(e.role, e.org, e.period, e.desc)); lst(L.edu, d.edu, e => it(e.deg, e.inst + (e.res ? ' — ' + e.res : ''), e.year)); lst(L.pj, d.proj, e => it(e.name + (e.link ? ' (' + e.link + ')' : ''), '', '', e.desc));
  lst(L.tr, d.train, e => it(e.name, e.inst, e.year)); lst(L.ach, d.ach, e => it(e.name, '', '', e.desc)); lst(L.vol, d.vol, e => it(e.role, e.org, e.period, e.desc));
  if (String(d.skills).trim()) b += H(L.sk) + `<p>${esc(String(d.skills).split(/[,\n]/).map(x => x.trim()).filter(Boolean).join(' • '))}</p>`;
  if (String(d.langs).trim()) b += H(L.lg) + `<p>${esc(String(d.langs).split(/[,\n]/).map(x => x.trim()).filter(Boolean).join(' • '))}</p>`;
  const P = [[L.father, d.father], [L.mother, d.mother], [L.dob, d.dob], [L.gender, d.gender], [L.nat, d.nat], [L.rel, d.rel], [L.mar, d.mar], [L.nid, d.nid], [L.blood, d.blood], [L.paddr, d.paddr]].filter(x => x[1]);
  if (o.personal && P.length) b += H(L.pt) + `<table>${P.map(x => `<tr><td style="padding-right:14pt;color:#555">${x[0]}</td><td>: ${esc(x[1])}</td></tr>`).join('')}</table>`;
  lst(L.rf, d.refs, e => it(e.name, e.info));
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${esc(d.name)} CV</title><style>@page{size:A4;margin:1.6cm}body{font:10.5pt 'Noto Sans Bengali',Arial,sans-serif;line-height:1.35;color:#111}li{margin:0 0 1pt}</style></head><body>${b}</body></html>`;
}
async function exportWord() { if (!cv.name.trim()) { toast('আগে নাম লিখুন'); return } try { await saveFile((cv.name.trim().replace(/[^\w\u0980-\u09FF]+/g, '_') || 'My') + '_CV.doc', cvWord(), 'application/msword'); toast('✅ Word ফাইল তৈরি হয়েছে') } catch (e) { toast('ফাইল তৈরি করা যায়নি') } }

function pCV() {
  const T = { info: '✏️ তথ্য', tpl: '🎨 টেমপ্লেট', view: '👁 প্রিভিউ' }, ix = ['info', 'tpl', 'view'].indexOf(cvTab);
  return `<h2>📄 সিভি বিল্ডার</h2><div class="stepper">${[0, 1, 2].map(i => `<i class="${i <= ix ? 'd' : ''}"></i>`).join('')}</div><div class="tabs">${Object.keys(T).map(k => `<button class="${cvTab === k ? 'on' : ''}" onclick="cvTab='${k}';render();scrollTo(0,0)">${T[k]}</button>`).join('')}</div>${cvTab === 'info' ? cvForm() : cvTab === 'tpl' ? cvTpl() : cvView()}`;
}
/* ---------- profiles ---------- */
function saveProfile() { const n = (prompt('সিভির নাম দিন (যেমন: সরকারি, কর্পোরেট, আইটি)') || '').trim(); if (!n) return; profiles[n] = clone(cv); LS.set('profiles', profiles); render(); toast('সেভ হয়েছে: ' + n) }
function loadProfile(n) { if (n && profiles[n]) { cv = Object.assign(clone(EMPTY), clone(profiles[n])); save(); render(); toast('লোড হয়েছে: ' + n) } }
function delProfile() { const s = document.querySelector('select[onchange^="loadProfile"]'), n = s && s.value; if (!n) { toast('আগে তালিকা থেকে সিভি বাছুন'); return } if (confirm(n + ' মুছবেন?')) { delete profiles[n]; LS.set('profiles', profiles); render() } }
