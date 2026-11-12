/* ===== Job Hunter 3.3 — "Pro" CV template (t7) + BDJobs-style fields ===== */

LBL.en.decl = LBL.en.decl || 'I hereby declare that the information given above is true and correct to the best of my knowledge.'; LBL.bn.decl = LBL.bn.decl || 'আমি এই মর্মে ঘোষণা করছি যে, উপরোক্ত তথ্যাদি আমার জানামতে সত্য ও নির্ভুল।';
/* ---- 1. extra data fields (BDJobs-compatible) ---- */
Object.assign(EMPTY, { cobj: '', soft: '', hdist: '', village: '', po: '', ps: '', dist: '', country: 'Bangladesh', cs: [] });
Object.keys(EMPTY).forEach(k => { if (cv[k] === undefined) cv[k] = clone(EMPTY[k]) });
Object.assign(SAMPLE, {
  cobj: 'To secure an entry-level position in a reputable organization where I can use my knowledge and skills and grow professionally.',
  soft: 'Communication, Problem Solving, Time Management, Teamwork, Honesty & Integrity, Responsibility', hdist: 'Bhola', village: 'Char Kukri', po: 'Char Kukri', ps: 'Bhola Sadar', dist: 'Bhola', country: 'Bangladesh',
  cs: [{ name: 'JavaScript', pct: '85' }, { name: 'React', pct: '80' }, { name: 'Python', pct: '75' }, { name: 'SQL', pct: '70' }, { name: 'Git & GitHub', pct: '80' }],
});
SAMPLE.edu = [{ deg: 'Bachelor of Science (B.Sc.)', major: 'Computer Science & Engineering', inst: 'University of Dhaka', board: '', res: 'CGPA 3.62 out of 4.00', year: '2023', dur: '4 Years', ach: 'First Class' }, { deg: 'Higher Secondary Certificate (HSC)', major: 'Science', inst: 'Notre Dame College, Dhaka', board: 'Dhaka Board', res: 'GPA 5.00 out of 5.00', year: '2018', dur: '', ach: '' }, { deg: 'Secondary School Certificate (SSC)', major: 'Science', inst: 'Bhola Govt. High School', board: 'Barisal Board', res: 'GPA 5.00 out of 5.00', year: '2016', dur: '', ach: '' }];
SAMPLE.exp[0].loc = 'Dhaka, Bangladesh';
SAMPLE.train = [{ name: 'Full-Stack Web Development', inst: 'BITM (ICT Division)', year: '2022', dur: '6 Months', desc: 'HTML & CSS\nJavaScript & React\nNode.js & SQL' }];
SAMPLE.langs = 'Bangla (Native), English (Intermediate)';

LISTS.edu = ['🎓 শিক্ষাগত যোগ্যতা', [['deg', 'Exam Title (যেমন: Master of Social Science (MSS))'], ['major', 'Concentration / Major (Political Science)'], ['inst', 'Institute (Rangpur Government College)'], ['board', 'University / Board (National University)'], ['res', 'Result (CGPA 3.17 out of 4.00)'], ['year', 'Passing Year'], ['dur', 'Duration (4 Years) — ঐচ্ছিক'], ['ach', 'Achievement (First Class) — ঐচ্ছিক']]];
LISTS.exp = ['💼 কর্ম অভিজ্ঞতা / ইন্টার্নশিপ', [['role', 'Position'], ['org', 'Organization'], ['loc', 'Location (Narsingdi, Bangladesh)'], ['period', 'Duration (Jan 2023 – Jun 2023)'], ['desc', 'দায়িত্ব ও অর্জন — প্রতি লাইনে একটি পয়েন্ট']]];
LISTS.train = ['📜 প্রশিক্ষণ / সার্টিফিকেট', [['name', 'Course / Certificate'], ['inst', 'Institute'], ['year', 'Year'], ['dur', 'Duration (6 Months)'], ['desc', 'Training Areas — প্রতি লাইনে একটি']]];
LISTS.cs = ['🖥️ কম্পিউটার / টেকনিক্যাল স্কিল (শতকরা সহ)', [['name', 'Skill (Microsoft Word)'], ['pct', 'দক্ষতা % (যেমন: 90)']]];

const _cvForm = cvForm;
cvForm = function () {
  let h = _cvForm();
  const ins = (marker, add, after) => { const i = h.indexOf(marker); if (i < 0) return; const j = after ? h.indexOf('</details>', i) : i + marker.length; h = h.slice(0, j) + add + h.slice(j) };
  h = h.replace('🎯 ক্যারিয়ার সারসংক্ষেপ (Summary)', '🎯 Profile Summary ও Career Objective');
  ins('Profile Summary ও Career Objective</summary>', F('cobj', 'Career Objective (১–২ লাইন)', 'area', 'কোন ধরনের চাকরি/পদে কী অবদান রাখতে চান'));
  h = h.replace('🛠️ স্কিল, ভাষা, আগ্রহ', '🛠️ Special Qualification, ভাষা, আগ্রহ');
  ins('Special Qualification, ভাষা, আগ্রহ</summary>', F('soft', 'Soft Skills (কমা দিয়ে)', 'area', 'Communication, Teamwork, ...'));
  const k = h.indexOf('Special Qualification, ভাষা, আগ্রহ</summary>'); const e = h.indexOf('</details>', k) + 10; h = h.slice(0, e) + listEd('cs') + h.slice(e);
  ins('🪪 ব্যক্তিগত তথ্য (সরকারি/ব্যাংক জবের জন্য)</summary>', F('hdist', 'Home District') + '<label style="margin:10px 0 4px;color:var(--g)">📍 স্থায়ী ঠিকানা (Permanent Address)</label>' + F('village', 'Village / Mahalla') + F('po', 'Post Office') + F('ps', 'Police Station / Upazila') + F('dist', 'District') + F('country', 'Country'));
  return h;
};

/* ---- 2. adapt BDJobs fields for the older templates & Word ---- */
function adapt(d) {
  const x = clone(d);
  x.edu = (x.edu || []).map(e => ({ ...e, deg: [e.deg, e.major ? 'in ' + e.major : ''].filter(Boolean).join(' '), inst: [e.inst, e.board].filter(Boolean).join(', '), res: [e.res, e.ach].filter(Boolean).join(' • ') }));
  x.exp = (x.exp || []).map(e => ({ ...e, org: [e.org, e.loc].filter(Boolean).join(', ') }));
  x.train = (x.train || []).map(e => ({ ...e, name: e.name + (e.dur ? ' (' + e.dur + ')' : '') }));
  { const seen = new Set(); x.skills = [x.skills, x.soft, (x.cs || []).map(c => c.name).join(', ')].join(',').split(/[,\n]/).map(z => z.trim()).filter(z => z && !seen.has(z.toLowerCase()) && seen.add(z.toLowerCase())).join(', ') }
  x.obj = [x.obj, x.cobj].filter(s => s && s.trim()).join('\n');
  if (!x.paddr && (x.village || x.po || x.ps || x.dist)) x.paddr = [x.village, x.po && 'PO: ' + x.po, x.ps && 'PS: ' + x.ps, x.dist, x.country].filter(Boolean).join(', ');
  return x;
}
const _cvWord = cvWord; cvWord = function (d = cv, o = cvo) { return _cvWord(adapt(d), o) };

/* ---- 3. colour helpers (no color-mix: PDF engine cannot read it) ---- */
function tint(c, p, to) { const h = c.replace('#', ''), f = h.length === 3 ? h.split('').map(z => z + z).join('') : h, n = [0, 2, 4].map(i => parseInt(f.substr(i, 2), 16)), t = to === 'k' ? 0 : 255; return '#' + n.map(v => Math.round(v * p + t * (1 - p)).toString(16).padStart(2, '0')).join('') }
const tintVars = c => [10, 22, 25, 30, 35, 45, 65].map(p => `--ac${p}:${tint(c, p / 100)};`).join('') + `--acd:${tint(c, .72, 'k')};`;

/* ---- 4. icons (explicit colours: html2canvas draws SVG standalone) ---- */
const IC = { phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>', mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>', pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>', user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', award: '<circle cx="12" cy="8" r="7"/><path d="M8.2 13.9 7 23l5-3 5 3-1.2-9.1"/>', brief: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>', book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.8 21 7 14.1l-5-4.8 6.9-1z"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>', globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>', edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>', check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>' };
const ico = (n, s, col, w = 2) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="display:block">${IC[n]}</svg>`;
const lvPct = s => { s = String(s || '').toLowerCase(); return /native|mother/.test(s) ? 100 : /fluent|excellent/.test(s) ? 92 : /advanced|very good/.test(s) ? 85 : /professional|proficient|good/.test(s) ? 80 : /intermediate|moderate|medium|working/.test(s) ? 70 : /basic|elementary|fair|average/.test(s) ? 50 : /beginner/.test(s) ? 40 : 75 };
const ring7 = (p, col) => `<svg viewBox="0 0 36 36" width="74" height="74" style="display:block"><circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e3e6ee" stroke-width="3.6"/><circle cx="18" cy="18" r="15.9155" fill="none" stroke="${col}" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="${p} ${100 - p}" transform="rotate(-90 18 18)"/></svg>`;

/* ---- 5. styles ---- */
document.head.insertAdjacentHTML('beforeend', `<style id="cvpro-css">
.cv{--ac10:#e7f3ee;--ac22:#c9e4da;--ac25:#c3dfd5;--ac30:#b3d6c9;--ac35:#a6cfc1;--ac45:#8cc0ae;--ac65:#5ca88e}
.cv.t7{--o:#f5a524;width:794px;min-height:0;font-family:'Roboto Condensed','Arial Narrow','Noto Sans Bengali',Arial,sans-serif;font-size:var(--fs);line-height:1.45;color:#1b2340;background:#fff}
.t7 .pg{position:relative;min-height:1120px;page-break-after:always;break-after:page;overflow:hidden}
.t7 .pg:last-child{page-break-after:auto;break-after:auto}
.t7 .p1{display:flex}
.t7 aside{width:306px;flex:none;background:linear-gradient(180deg,var(--ac),var(--acd));color:#fff;padding:34px 24px 100px}
.t7 .av{width:190px;height:190px;border-radius:50%;border:5px solid #fff;margin:0 auto 22px;display:block;object-fit:cover;background:#fff}
.t7 .avi{display:flex;align-items:center;justify-content:center;font-size:4.6em;font-weight:800;color:var(--ac)}
.t7 aside h4{margin:calc(20px*var(--gap)) 0 10px;color:var(--o);font-size:1.28em;font-weight:800;text-transform:uppercase;display:flex;align-items:center;gap:10px;letter-spacing:.3px}
.t7 aside h4::after{content:"";flex:1;height:2px;background:var(--o)}
.t7 .ci{display:flex;gap:10px;align-items:center;margin:8px 0;word-break:break-word;font-size:.98em}
.t7 .cb{width:30px;height:30px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex:none}
.t7 .kv{display:flex;gap:6px;margin:4px 0;font-size:.95em;line-height:1.35}.t7 .kv i{font-style:normal;flex:none}.t7 .kv b{font-weight:400;width:104px;flex:none}.t7 .kv span{word-break:break-word}
.t7 .mn{flex:1;min-width:0;padding:42px 34px 100px 34px}
.t7 .nm{margin:0;font-size:calc(var(--fs)*3.9);line-height:1.02;font-weight:800;text-transform:uppercase;color:var(--ac);letter-spacing:-.5px;word-break:break-word}
.t7 .tt7{margin-top:14px;padding-bottom:12px;border-bottom:3px solid var(--o);font-size:1.4em;text-transform:uppercase;color:#1b2340}
.t7 .sh{display:flex;align-items:center;gap:12px;margin:calc(24px*var(--gap)) 0 12px;font-weight:800;font-size:1.32em;text-transform:uppercase;color:#10183a}
.t7 .sh::after{content:"";flex:1;height:2px;background:var(--o);max-width:150px}
.t7 .bi{width:38px;height:38px;border-radius:50%;background:var(--ac);display:flex;align-items:center;justify-content:center;flex:none}
.t7 .sm{font-size:1.02em;line-height:1.6;text-align:left}
.t7 .cg{display:grid;grid-template-columns:1fr 1fr;gap:9px 14px}.t7 .cg div{display:flex;gap:8px;align-items:center;font-size:1em}
.t7 .bd7{background:var(--ac);color:#fff;display:flex;align-items:center;gap:14px;padding:11px 22px;font-weight:800;font-size:1.5em;text-transform:uppercase;margin:calc(8px*var(--gap)) 0 14px;border-bottom:3px solid var(--o)}
.t7 .bd7::after{content:"";flex:1;height:2px;background:var(--o)}
.t7 .bd7 .bi{background:#fff;width:34px;height:34px}
.t7 .cnt{padding:0 40px 96px}
.t7 .pg>.cnt:first-child{padding-top:34px}
.t7 .tl .ti{display:flex;gap:16px;position:relative;padding-bottom:calc(14px*var(--gap));break-inside:avoid}
.t7 .tl .ti::before{content:"";position:absolute;left:19px;top:42px;bottom:2px;width:2px;background:var(--o)}
.t7 .tl .ti:last-child::before{display:none}
.t7 .tb{flex:none}.t7 .tc{flex:1;min-width:0;line-height:1.4}.t7 .tc .h{font-size:1.14em;font-weight:800;color:#10183a;display:block;margin-bottom:1px}
.t7 .tc .m{font-size:.92em;color:#333;margin-top:3px;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center}.t7 .tc .m span{display:inline-flex;gap:4px;align-items:center}
.t7 .tc ul{margin:4px 0 0;padding-left:18px}.t7 .tc li{font-size:.94em;margin:1px 0}
.t7 .st li{list-style:none;display:flex;gap:10px;margin:4px 0}.t7 ul.st{padding:0;margin:0}
.t7 .cols{display:grid;grid-template-columns:1.25fr 1fr;gap:0 26px}.t7 .cols>div+div{border-left:2px solid var(--o);padding-left:22px}
.t7 .sb7{display:flex;align-items:center;gap:10px;margin:10px 0;font-size:.98em}.t7 .sb7 .n{width:150px;flex:none}.t7 .sb7 .p{width:52px;flex:none;text-align:right;font-weight:700}
.t7 .br{flex:1;height:8px;border-radius:5px;background:#e9ebf3;overflow:hidden}.t7 .br i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,var(--ac) 88%,var(--o) 88%)}
.t7 .sub{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.2em;text-transform:uppercase;margin:6px 0 10px}
.t7 .lg{display:flex;gap:34px;flex-wrap:wrap}.t7 .lg>div{display:flex;align-items:center;gap:12px}.t7 .lgp{position:relative;width:74px;height:74px}.t7 .lgp b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.05em}
.t7 .pi{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}.t7 .pi>div+div{border-left:2px solid var(--o);padding-left:24px}
.t7 .pr{display:flex;gap:6px;margin:11px 0}.t7 .pr b{width:112px;flex:none}.t7 .pr span{word-break:break-word}
.t7 .sgn{display:flex;justify-content:space-between;align-items:flex-end;margin-top:34px}.t7 .sgn .l{min-width:210px;text-align:center}.t7 .sgn img{height:50px;max-width:200px;object-fit:contain;display:block;margin:0 auto 2px}.t7 .sgn .ln{border-top:1.5px solid #111;padding-top:4px}
.t7 .dl{display:flex;gap:6px;align-items:flex-end}.t7 .dl i{display:inline-block;width:150px;border-bottom:1.5px solid #111;height:1px}
.t7 .pb{position:absolute;left:40px;right:40px;bottom:30px;height:46px;background:var(--ac);color:var(--o);font-weight:800;font-size:1.25em;display:flex;align-items:center;justify-content:flex-end;padding-right:36px;text-transform:uppercase}
.t7 .p1 .pb{left:auto;right:0;width:240px;color:#fff;justify-content:center;padding:0}
.t7 .one .mn{padding:36px 30px 36px 30px}.t7 .one aside{padding:30px 20px 36px;width:268px}.t7 .one .av{width:150px;height:150px}.t7 .one .nm{font-size:calc(var(--fs)*3.2)}
.t7 .one .sh{margin:calc(16px*var(--gap)) 0 8px;font-size:1.18em}.t7 .one .bi{width:30px;height:30px}.t7 .one .kv b{width:84px}
.t7 .one aside .bar7{height:6px;border-radius:4px;background:#ffffff40;overflow:hidden;margin:3px 0 7px}.t7 .one aside .bar7 i{display:block;height:100%;background:var(--o);border-radius:4px}
#pwi .t7 .pg+.pg{border-top:3px dashed #f23a4d77}
</style>`);

/* ---- 6. the template ---- */
const H7 = {
  en: { sum: 'Profile Summary', comp: 'Core Competencies', obj: 'Career Objective', edu: 'Education', ach: 'Academic Achievements', exp: 'Work Experience', proj: 'Projects', vol: 'Extracurricular Activities', skills: 'Skills', cs: 'Computer Skills', soft: 'Soft Skills', train: 'Training & Certifications', lang: 'Language Proficiency', pinfo: 'Personal Information', addr: 'Permanent & Present Address', decl: 'Declaration', contact: 'Contact', pd: 'Personal Details', langs: 'Languages', ref: 'References', page: 'Page', avail: 'Available on request.', area: 'Training Areas', dur: 'Duration', res: 'Result', year: 'Passing Year', ach2: 'Achievement', village: 'Village', po: 'Post Office', ps: 'Police Station', dist: 'District', country: 'Country', pres: 'Present Address', hd: 'Home District', date: 'Date', sig: 'Signature' },
  bn: { sum: 'প্রোফাইল সারসংক্ষেপ', comp: 'মূল দক্ষতা', obj: 'ক্যারিয়ার উদ্দেশ্য', edu: 'শিক্ষাগত যোগ্যতা', ach: 'একাডেমিক অর্জন', exp: 'কর্ম অভিজ্ঞতা', proj: 'প্রজেক্ট', vol: 'সহ-শিক্ষা কার্যক্রম', skills: 'দক্ষতা', cs: 'কম্পিউটার দক্ষতা', soft: 'সফট স্কিল', train: 'প্রশিক্ষণ ও সনদ', lang: 'ভাষা দক্ষতা', pinfo: 'ব্যক্তিগত তথ্য', addr: 'স্থায়ী ও বর্তমান ঠিকানা', decl: 'ঘোষণা', contact: 'যোগাযোগ', pd: 'ব্যক্তিগত বিবরণ', langs: 'ভাষা', ref: 'রেফারেন্স', page: 'পৃষ্ঠা', avail: 'চাইলে সরবরাহ করা হবে।', area: 'প্রশিক্ষণের বিষয়', dur: 'মেয়াদ', res: 'ফলাফল', year: 'পাসের সন', ach2: 'অর্জন', village: 'গ্রাম', po: 'ডাকঘর', ps: 'থানা', dist: 'জেলা', country: 'দেশ', pres: 'বর্তমান ঠিকানা', hd: 'নিজ জেলা', date: 'তারিখ', sig: 'স্বাক্ষর' },
};
function cvPro(d, o, color) {
  const T = H7[o.lang] || H7.en, L = LBL[o.lang] || LBL.en, col = color || TPLC.t7, bl = col;
  const sz = { s: 12.5, m: 13.5, l: 14.5 }[o.size] || 13.5, gap = o.dense === 'c' ? .72 : 1, mode = o.pg || 'two';
  const sty = `--ac:${col};${tintVars(col)}--fs:${sz}px;--gap:${gap}`;
  const e = esc, bul = s => { const a = String(s || '').split(/\n/).map(x => x.replace(/^\s*[-•*·▪●‣]+\s*/, '').trim()).filter(Boolean); return a.length ? `<ul>${a.map(x => `<li>${e(x)}</li>`).join('')}</ul>` : '' };
  const chipsA = s => String(s || '').split(/[,\n]/).map(x => x.trim()).filter(Boolean);
  const badge = n => `<span class="bi">${ico(n, mode === 'one' ? 16 : 19, '#fff')}</span>`;
  const sh = (n, t) => `<div class="sh">${badge(n)}<span>${e(t)}</span></div>`;
  const band = (n, t) => `<div class="bd7"><span class="bi">${ico(n, 19, bl)}</span><span>${e(t)}</span></div>`;
  const showPh = o.photo, ini = String(d.name || 'U').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
  const avatar = !showPh ? '' : d.photo ? `<img class="av" src="${d.photo}">` : `<div class="av avi">${e(ini)}</div>`;
  const cinfo = [['phone', d.phone], ['mail', d.email], ['pin', d.address], ['link', d.link]].filter(x => x[1] && String(x[1]).trim());
  const contact = cinfo.map(x => `<div class="ci"><span class="cb">${ico(x[0], 16, bl)}</span><span>${e(x[1])}</span></div>`).join('');
  const kv = (a, b) => b && String(b).trim() ? `<div class="kv"><i>•</i><b>${a}</b><span>: ${e(b)}</span></div>` : '';
  const pdet = o.personal ? [kv(L.dob, d.dob), kv(L.nat, d.nat), kv(L.rel, d.rel), kv(L.mar, d.mar), kv(L.nid.split(' /')[0], d.nid), kv(L.gender, d.gender), kv(L.blood, d.blood)].join('') : '';
  const permT = [d.village, d.po && 'PO: ' + d.po, d.ps && 'PS: ' + d.ps, d.dist, d.country].filter(Boolean).join(', ') || d.paddr;
  const pdet2 = o.personal ? [kv(L.father, d.father), kv(L.mother, d.mother), kv(L.dob, d.dob), kv(L.nat, d.nat), kv(L.rel, d.rel), kv(L.mar, d.mar), kv(L.nid.split(' /')[0], d.nid), kv(L.gender, d.gender), kv(L.blood, d.blood), kv(T.hd, d.hdist), kv(o.lang === 'bn' ? 'স্থায়ী ঠিকানা' : 'Permanent Addr.', permT)].join('') : '';
  const langs = chipsA(d.langs).map(x => { const m = x.match(/^(.*?)\s*\((.*?)\)\s*$/); return m ? { n: m[1], l: m[2] } : { n: x, l: '' } });
  const langKV = langs.map(x => `<div class="kv"><i>•</i><b style="width:80px">${e(x.n)}</b><span>${x.l ? ': ' + e(x.l) : ''}</span></div>`).join('');
  const refs = has(d.refs).length ? has(d.refs).map(r => `<div style="margin:5px 0;font-size:.95em"><b>${e(r.name)}</b><br>${e(r.info)}</div>`).join('') : `<div style="font-size:.95em">${T.avail}</div>`;
  const cs = has(d.cs).map(c => ({ n: c.name, p: Math.max(5, Math.min(100, parseInt(c.pct) || 80)) }));
  const soft = chipsA(d.soft);
  const comp = chipsA(d.skills);
  const compHTML = comp.length ? `<div class="cg">${comp.map(c => `<div>${ico('check', 18, bl)}<span>${e(c)}</span></div>`).join('')}</div>` : '';
  const sumB = d.obj && d.obj.trim() ? `<div class="sm">${esc(d.obj).replace(/\n/g, '<br>')}</div>` : '';
  const objB = d.cobj && d.cobj.trim() ? `<div class="sm">${esc(d.cobj).replace(/\n/g, '<br>')}</div>` : '';
  const head = `<h1 class="nm">${e(d.name || 'Your Name')}</h1>${d.title ? `<div class="tt7">${e(d.title)}</div>` : ''}`;
  const pgBar = (n, tot) => tot > 1 ? `<div class="pb">${T.page} ${n}</div>` : '';
  /* items */
  const eduI = has(d.edu).map(x => `<div class="ti"><div class="tb"><span class="bi">${ico(/ssc|hsc|secondary|school|ক্লাস/i.test(x.deg) ? 'book' : 'cap', 19, '#fff')}</span></div><div class="tc"><b class="h">${e(x.deg)}${x.major ? ' in ' + e(x.major) : ''}</b>${x.inst ? `<div>${e(x.inst)}</div>` : ''}${x.board ? `<div>${e(x.board)}</div>` : ''}${x.res ? `<div>${T.res}: <b>${e(x.res)}</b></div>` : ''}${x.year ? `<div>${T.year}: <b>${e(x.year)}</b>${x.dur ? ` &nbsp;|&nbsp; ${T.dur}: ${e(x.dur)}` : ''}</div>` : x.dur ? `<div>${T.dur}: ${e(x.dur)}</div>` : ''}${x.ach ? `<div>${T.ach2}: ${e(x.ach)}</div>` : ''}</div></div>`);
  const eduC = has(d.edu).map(x => `<div style="margin:5px 0;line-height:1.35"><b>${e(x.deg)}${x.major ? ' in ' + e(x.major) : ''}</b> <span style="float:right">${e(x.year)}</span><br><span style="font-size:.95em">${[x.inst, x.board].filter(Boolean).map(e).join(', ')}${x.res ? ' — <b>' + e(x.res) + '</b>' : ''}${x.ach ? ' • ' + e(x.ach) : ''}</span></div>`);
  const expI = (arr, ic) => has(arr).map(x => `<div class="ti"><div class="tb"><span class="bi">${ico(ic, 19, '#fff')}</span></div><div class="tc"><b class="h">${e(x.role)}</b>${x.org ? `<div><b>${e(x.org)}</b></div>` : ''}<div class="m">${x.loc ? `<span>${ico('pin', 14, bl)}${e(x.loc)}</span>` : ''}${x.period ? `<span>${ico('brief', 14, bl)}${T.dur}: ${e(x.period)}</span>` : ''}</div>${bul(x.desc)}</div></div>`);
  const expC = arr => has(arr).map(x => `<div style="margin:6px 0;line-height:1.35"><b>${e(x.role)}</b>${x.org ? ' — ' + e(x.org) : ''}${x.loc ? ', ' + e(x.loc) : ''} <span style="float:right;font-size:.95em">${e(x.period)}</span>${bul(x.desc).replace('<ul>', '<ul style="margin:2px 0 0;padding-left:18px;font-size:.95em">')}</div>`);
  const pjI = has(d.proj).map(x => `<div class="ti"><div class="tb"><span class="bi">${ico('gear', 19, '#fff')}</span></div><div class="tc"><b class="h">${e(x.name)}</b>${x.link ? `<div>${e(x.link)}</div>` : ''}${bul(x.desc)}</div></div>`);
  const achL = has(d.ach).length ? `<ul class="st">${has(d.ach).map(x => `<li>${ico('star', 16, '#10183a')}<span><b>${e(x.name)}</b>${x.desc ? ' — ' + e(x.desc) : ''}</span></li>`).join('')}</ul>` : '';
  const trI = has(d.train).map(x => `<div style="margin:6px 0 10px;break-inside:avoid"><b style="font-size:1.1em">${e(x.name)}</b>${x.inst ? `<div>${e(x.inst)}${x.year ? ' • ' + e(x.year) : ''}</div>` : x.year ? `<div>${e(x.year)}</div>` : ''}${x.dur ? `<div>${T.dur}: ${e(x.dur)}</div>` : ''}${x.desc ? `<div>${T.area}:</div>${bul(x.desc).replace('<ul>', '<ul style="margin:2px 0 0;padding-left:20px">')}` : ''}</div>`);
  const bars = cs.map(c => `<div class="sb7"><span class="n">${e(c.n)}</span><span class="br"><i style="width:${c.p}%"></i></span><span class="p">${c.p}%</span></div>`).join('');
  const softL = soft.length ? `<ul class="st">${soft.map(s => `<li><span style="font-size:1.3em;line-height:1">•</span><span>${e(s)}</span></li>`).join('')}</ul>` : '';
  const langR = langs.length ? `<div class="lg">${langs.map(x => { const p = lvPct(x.l); return `<div><div class="lgp">${ring7(p, bl)}<b>${p}%</b></div><div><b>${e(x.n)}</b>${x.l ? `<br>(${e(x.l)})` : ''}</div></div>` }).join('')}</div>` : '';
  const addrT = ([[T.village, d.village], [T.po, d.po], [T.ps, d.ps], [T.dist, d.dist], [T.country, d.country]].filter(x => x[1] && String(x[1]).trim()));
  const addrB = (d.address ? `<div class="pr"><b>${T.pres}</b><span>: ${e(d.address)}</span></div>` : '') + (addrT.length ? addrT.map(x => `<div class="pr"><b>${x[0]}</b><span>: ${e(x[1])}</span></div>`).join('') : d.paddr ? `<div class="pr"><b>${L.paddr.split(' ')[0] === 'Permanent' ? 'Permanent' : 'স্থায়ী'}</b><span>: ${e(d.paddr)}</span></div>` : '');
  const pinfo = [[L.father, d.father], [L.mother, d.mother], [L.dob, d.dob], [L.nat, d.nat], [L.rel, d.rel], [L.mar, d.mar], [L.nid.split(' /')[0], d.nid], [T.hd, d.hdist], [L.gender, d.gender], [L.blood, d.blood]].filter(x => x[1] && String(x[1]).trim()).map(x => `<div class="pr"><b>${x[0]}</b><span>: ${e(x[1])}</span></div>`).join('');
  const piB = o.personal && (pinfo || addrB) ? `<div class="sh">${badge('user')}<span>${T.pinfo}</span></div><div class="pi"><div>${pinfo}</div><div><div class="sub">${ico('home', 20, bl)}<span>${T.addr}</span></div>${addrB}</div></div>` : '';
  const sgn = (compact) => !(o.decl !== false) && !(o.sign && d.sign) ? '' : `${o.decl !== false ? `<div class="sh">${badge('edit')}<span>${T.decl}</span></div><div class="sm">${e(L.decl || '')}</div>` : ''}<div class="sgn" style="${compact ? 'margin-top:16px' : ''}"><div class="l">${o.sign && d.sign ? `<img src="${d.sign}">` : `<div style="height:${compact ? 22 : 40}px"></div>`}<div class="ln">${T.sig}</div></div><div class="dl">${T.date}: <i></i></div></div>`;

  const side = (full, ext) => `<aside>${avatar}<h4>${T.contact}</h4>${contact}${(ext ? pdet2 : pdet) ? `<h4>${T.pd}</h4>${ext ? pdet2 : pdet}` : ''}${langKV ? `<h4>${T.langs}</h4>${langKV}` : ''}${full ? `<h4>${T.ref}</h4>${refs}` : ''}${mode === 'one' ? (cs.length ? `<h4>${T.cs}</h4>${cs.map(c => `<div style="font-size:.95em;display:flex;justify-content:space-between"><span>${e(c.n)}</span><span>${c.p}%</span></div><div class="bar7"><i style="width:${c.p}%"></i></div>`).join('')}` : '') + (soft.length ? `<h4>${T.soft}</h4>${soft.map(s => `<div class="kv"><i>•</i><span>${e(s)}</span></div>`).join('')}` : '') + `<h4>${T.ref}</h4>${refs}` : ''}</aside>`;
  const secE = (arr, n, t, cls) => arr.length ? sh(n, t) + `<div class="${cls || ''}">${arr.join('')}</div>` : '';
  const P = [];
  if (mode === 'one') {
    P.push(`<div class="pg p1 one">${side(false, true)}<div class="mn">${head}${d.obj && d.obj.trim() ? sh('user', T.sum) + sumB : ''}${comp.length ? sh('award', T.comp) + compHTML : ''}${eduC.length ? sh('cap', T.edu) + eduC.join('') : ''}${has(d.exp).length ? sh('brief', T.exp) + expC(d.exp).join('') : ''}${has(d.proj).length ? sh('gear', T.proj) + has(d.proj).map(x => `<div style="margin:5px 0"><b>${e(x.name)}</b>${bul(x.desc)}</div>`).join('') : ''}${has(d.train).length ? sh('award', T.train) + has(d.train).map(x => `<div style="margin:4px 0"><b>${e(x.name)}</b>${x.inst ? ' — ' + e(x.inst) : ''}${x.dur ? ' (' + e(x.dur) + ')' : ''}${x.year ? ' <span style="float:right">' + e(x.year) + '</span>' : ''}</div>`).join('') : ''}${has(d.ach).length ? sh('star', T.ach) + achL : ''}${objB ? sh('brief', T.obj) + objB : ''}${sgn(true)}</div></div>`);
  } else if (mode === 'full') {
    P.push(`<div class="pg p1">${side(true)}<div class="mn">${head}${d.obj && d.obj.trim() ? sh('user', T.sum) + sumB : ''}${comp.length ? sh('award', T.comp) + compHTML : ''}${objB ? sh('brief', T.obj) + objB : ''}</div>PB</div>`);
    const p2 = (eduI.length ? band('cap', T.edu) + `<div class="tl">${eduI.join('')}</div>` : '') + (achL ? band('star', T.ach) + achL : '') + (has(d.exp).length ? band('brief', T.exp) + `<div class="tl">${expI(d.exp, 'brief').join('')}</div>` : '') + (pjI.length ? band('gear', T.proj) + `<div class="tl">${pjI.join('')}</div>` : '') + (has(d.vol).length ? band('user', T.vol) + `<div class="tl">${expI(d.vol, 'user').join('')}</div>` : '');
    if (p2) P.push(`<div class="pg"><div class="cnt">${p2}</div>PB</div>`);
    const p3 = ((cs.length || soft.length) ? sh('gear', T.skills) + `<div class="${cs.length && soft.length ? 'cols' : ''}">${cs.length ? `<div><div class="sub">${ico('monitor', 22, bl)}<span>${T.cs}</span></div>${bars}</div>` : ''}${soft.length ? `<div><div class="sub">${ico('user', 22, bl)}<span>${T.soft}</span></div>${softL}</div>` : ''}</div>` : '') + (trI.length ? sh('award', T.train) + trI.join('') : '') + (langR ? sh('globe', T.lang) + langR : '');
    if (p3) P.push(`<div class="pg"><div class="cnt">${p3}</div>PB</div>`);
    const p4 = piB + sgn(false);
    if (p4.trim()) P.push(`<div class="pg"><div class="cnt">${p4}</div>PB</div>`);
  } else { /* two pages */
    P.push(`<div class="pg p1">${side(true, true)}<div class="mn">${head}${d.obj && d.obj.trim() ? sh('user', T.sum) + sumB : ''}${comp.length ? sh('award', T.comp) + compHTML : ''}${eduI.length ? band('cap', T.edu).replace('<div class="bd7">', '<div class="bd7" style="margin-left:-34px;margin-right:-34px">') + `<div class="tl">${eduI.join('')}</div>` : ''}${objB ? sh('brief', T.obj) + objB : ''}</div>PB</div>`);
    const p2 = (has(d.exp).length ? band('brief', T.exp) + `<div class="tl">${expI(d.exp, 'brief').join('')}</div>` : '') + (achL ? band('star', T.ach) + achL : '') + (has(d.proj).length ? sh('gear', T.proj) + has(d.proj).map(x => `<div style="margin:5px 0"><b>${e(x.name)}</b>${bul(x.desc)}</div>`).join('') : '') + (has(d.vol).length ? sh('user', T.vol) + expC(d.vol).join('') : '') + ((cs.length || soft.length) ? sh('gear', T.skills) + `<div class="${cs.length && soft.length ? 'cols' : ''}">${cs.length ? `<div>${bars}</div>` : ''}${soft.length ? `<div>${softL}</div>` : ''}</div>` : '') + (has(d.train).length ? sh('award', T.train) + has(d.train).map(x => `<div style="margin:4px 0"><b>${e(x.name)}</b>${x.inst ? ' — ' + e(x.inst) : ''}${x.dur ? ' (' + e(x.dur) + ')' : ''}${x.year ? ' <span style="float:right">' + e(x.year) + '</span>' : ''}</div>`).join('') : '') + sgn(true);
    if (p2.trim()) P.push(`<div class="pg"><div class="cnt">${p2}</div>PB</div>`);
  }
  const tot = P.length;
  return `<div class="cv t7" data-mode="${mode}" style="${sty}">${P.map((p, i) => p.replace('PB', pgBar(i + 1, tot))).join('')}</div>`;
}

/* ---- 7. wire into the existing builder ---- */
TPLS.unshift(['t7', '💎 প্রো (BD প্রফেশনাল)', 'ছবিসহ নীল সাইডবার, আইকন, স্কিল বার, শিক্ষার টাইমলাইন, ঘোষণা ও স্বাক্ষর — ১ / ২ / ৪ পাতা', '#0b2a8a']); TPLC.t7 = '#0b2a8a';
if (!LS.get('tpl', null)) tpl = 't7';
cvo.pg = cvo.pg || 'two'; if (!LS.get('decl_init', 0)) { cvo.decl = true; saveO(); LS.set('decl_init', 1) }
const _cvHTML = cvHTML;
cvHTML = function (d, t, o = cvo, color = ac) {
  if (t === 't7') return cvPro(d, o, color);
  const c = color || TPLC[t] || '#006a4e';
  return _cvHTML(adapt(d), t, o, color).replace(/style="--ac:(#[0-9a-fA-F]{3,6});/, (m, x) => m + tintVars(x));
};
function fitPages(root) {
  if (!root.dataset.fs0) { root.dataset.fs0 = parseFloat(getComputedStyle(root).getPropertyValue('--fs')) || 13.5; root.dataset.g0 = parseFloat(getComputedStyle(root).getPropertyValue('--gap')) || 1 }
  const fs0 = +root.dataset.fs0, g0 = +root.dataset.g0, pgs = [...root.querySelectorAll('.pg')], steps = root.dataset.mode === 'one' ? [1, .95, .9, .86, .82, .78, .74, .7] : [1, .96, .92, .88, .84, .8, .76];
  for (const k of steps) { root.style.setProperty('--fs', (fs0 * k).toFixed(2) + 'px'); root.style.setProperty('--gap', (g0 * k).toFixed(2)); if (pgs.every(p => p.offsetHeight <= 1121)) break }
  return pgs.length;
}
const _fitCV = fitCV;
fitCV = function (el) { const r = el.classList && el.classList.contains('cv') ? el : el.querySelector('.cv'); return r && r.classList.contains('t7') ? fitPages(r) : _fitCV(el) };
const _fitPreview = fitPreview;
fitPreview = function () {
  const i = $('#pwi'); const r = i && i.querySelector('.cv.t7'); if (r) { r.dataset.fs0 = ''; fitPages(r) }
  _fitPreview();
  if (r) {
    i.querySelectorAll('.pgmark').forEach(x => x.remove()); const n = r.querySelectorAll('.pg').length, pn = $('#pgn');
    if (pn) pn.textContent = `📄 মোট পেজ: ${bn(n)} — ${cvo.pg === 'one' ? 'এক পাতার সিভি ✅' : cvo.pg === 'full' ? 'বিস্তারিত ৪ পাতার সিভি (প্রতি পাতায় নির্দিষ্ট বিভাগ)' : 'দুই পাতার সিভি ✅'}`;
  }
};
const _exportPDF = exportPDF;
exportPDF = async function () {
  if (tpl !== 't7') return _exportPDF();
  if (!cv.name.trim()) { toast('আগে নাম লিখুন'); return } if (!window.html2pdf) { toast('PDF লাইব্রেরি পাওয়া যায়নি'); return }
  toast('PDF তৈরি হচ্ছে... একটু অপেক্ষা করুন');
  const wrap = document.createElement('div'); wrap.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff'; wrap.innerHTML = cvHTML(cv, 't7'); document.body.appendChild(wrap);
  const name = (cv.name.trim().replace(/[^\w\u0980-\u09FF]+/g, '_') || 'My') + '_CV.pdf';
  try { const n = fitPages(wrap.firstElementChild); await elementToPDF(wrap.firstElementChild, name, { margin: [0, 0, 0, 0], scale: n > 2 ? 2 : 2.5 }); toast('✅ PDF তৈরি হয়েছে') } catch (e) { toast('PDF তৈরি করা যায়নি — আবার চেষ্টা করুন') }
  wrap.remove();
};
const _cvTpl = cvTpl;
cvTpl = function () {
  let h = _cvTpl();
  if (tpl === 't7') h = h.replace('<h3>🎨 সিভির রং</h3>', `<div class="card"><h3 style="margin-top:0">📄 পাতার সংখ্যা</h3><div class="tabs">${[['one', '১ পাতা'], ['two', '২ পাতা'], ['full', '৪ পাতা']].map(x => `<button class="${cvo.pg === x[0] ? 'on' : ''}" onclick="cvo.pg='${x[0]}';saveO();render()">${x[1]}</button>`).join('')}</div><div class="muted sm">${cvo.pg === 'one' ? 'সব তথ্য কম্প্যাক্ট করে এক পাতায় — ফ্রেশারদের জন্য সেরা।' : cvo.pg === 'full' ? 'প্রতি পাতায় আলাদা বিভাগ: প্রোফাইল, শিক্ষা-অভিজ্ঞতা, স্কিল, ব্যক্তিগত তথ্য ও ঘোষণা।' : 'পাতা ১: প্রোফাইল ও শিক্ষা, পাতা ২: অভিজ্ঞতা, স্কিল ও ব্যক্তিগত তথ্য — সবচেয়ে প্রচলিত।'}</div></div><h3>🎨 সিভির রং</h3>`);
  return h;
};
