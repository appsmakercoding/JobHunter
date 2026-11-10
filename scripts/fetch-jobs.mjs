// Job Hunter — collects fresh jobs into data/jobs.json (runs on GitHub Actions every 6 hours)
// Every source is wrapped in try/catch: if one source fails the others still work.
import fs from 'node:fs';

const UA = { headers: { 'User-Agent': 'JobHunterApp/3.0 (+github actions)' }, signal: undefined };
const fetchT = (u, ms = 25000) => fetch(u, { headers: UA.headers, signal: AbortSignal.timeout(ms) });
const getJSON = async u => { const r = await fetchT(u); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); };
const getText = async u => { const r = await fetchT(u); if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); };
const day = t => { const d = new Date(t); return isNaN(d) ? '' : d.toISOString().slice(0, 10); };
const cl = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const dec = s => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const today = new Date().toISOString().slice(0, 10);
const daysAgo = n => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

// ---- category detection (used for filter chips in the app) ----
const RX = {
  govt: /সরকারি|বিসিএস|bcs|অধিদপ্তর|অধিদফতর|মন্ত্রণালয়|পুলিশ|সেনা|নৌবাহিনী|বিমান বাহিনী|আনসার|ডিপিই|এনটিআরসিএ|ntrca|পিএসসি|জেলা প্রশাসক|জেলা প্রশাসন|পৌরসভা|সিটি করপোরেশন|টেলিটক|বিদ্যুৎ|কারা|রেলওয়ে|সচিবালয়|বোর্ড|কর্তৃপক্ষ/i,
  bank: /ব্যাংক|bank|ব্যাংকিং|বীমা|insurance|ফাইন্যান্স|finance/i,
  ngo: /এনজিও|ngo|ব্র্যাক|brac|ইউএন|unicef|undp|world vision|save the children|জাতিসংঘ|\bun\b|unhcr|wfp/i,
  edu: /শিক্ষক|বিশ্ববিদ্যালয়|কলেজ|স্কুল|মাদ্রাসা|প্রভাষক|শিক্ষা|teacher|lecturer|professor|tutor/i,
  it: /software|developer|engineer|frontend|backend|full.?stack|devops|data |analyst|programmer|react|python|java|android|ios|ui\/ux|designer|সফটওয়্যার|আইটি|ডেভেলপার|প্রোগ্রামার|কম্পিউটার/i,
};
const catOf = txt => { for (const k of ['govt', 'bank', 'ngo', 'edu', 'it']) if (RX[k].test(txt)) return k; return 'other'; };

let out = [];
async function run(name, fn) {
  try { const a = await fn(); out.push(...a); console.log('OK  ', name, a.length); }
  catch (e) { console.error('FAIL', name, e.message); }
}

// ---- international / remote sources ----
await run('remotive', async () => (await getJSON('https://remotive.com/api/remote-jobs?limit=80')).jobs.map(j => ({
  title: cl(j.title), org: cl(j.company_name), loc: cl(j.candidate_required_location) || 'Remote', type: 'remote', src: 'Remotive',
  date: day(j.publication_date), url: j.url, tags: [j.category, j.job_type].filter(Boolean),
})));

await run('remoteok', async () => (await getJSON('https://remoteok.com/api')).filter(j => j.id && j.position).slice(0, 80).map(j => ({
  title: cl(j.position), org: cl(j.company), loc: cl(j.location) || 'Remote', type: 'remote', src: 'RemoteOK',
  date: day(j.date), url: j.url, tags: (j.tags || []).slice(0, 4),
})));

await run('jobicy', async () => (await getJSON('https://jobicy.com/api/v2/remote-jobs?count=50')).jobs.map(j => ({
  title: cl(j.jobTitle), org: cl(j.companyName), loc: cl(j.jobGeo) || 'Remote', type: 'remote', src: 'Jobicy',
  date: day(j.pubDate), url: j.url, tags: [].concat(j.jobIndustry || [], j.jobType || []).map(cl).slice(0, 4),
})));

await run('arbeitnow', async () => (await getJSON('https://www.arbeitnow.com/api/job-board-api')).data.slice(0, 70).map(j => ({
  title: cl(j.title), org: cl(j.company_name), loc: cl(j.location), type: 'abroad', src: 'Arbeitnow',
  date: day(j.created_at * 1000), url: j.url, tags: (j.tags || []).slice(0, 4),
})));

await run('themuse', async () => (await getJSON('https://www.themuse.com/api/public/jobs?page=1&level=Entry%20Level')).results.map(j => ({
  title: cl(j.name), org: cl(j.company && j.company.name), loc: cl((j.locations || []).map(l => l.name).join(', ')) || 'Flexible', type: 'abroad', src: 'The Muse',
  date: day(j.publication_date), url: j.refs && j.refs.landing_page, tags: (j.categories || []).map(c => c.name).slice(0, 3).concat('Entry Level'),
})));

// ---- Bangladesh: circular news via Google News RSS (Bangla) ----
const BD_QUERIES = [
  'সরকারি চাকরি নিয়োগ বিজ্ঞপ্তি', 'বিসিএস নিয়োগ বিজ্ঞপ্তি', 'ব্যাংক নিয়োগ বিজ্ঞপ্তি', 'এনজিও নিয়োগ বিজ্ঞপ্তি',
  'শিক্ষক নিয়োগ বিজ্ঞপ্তি', 'বিশ্ববিদ্যালয় নিয়োগ বিজ্ঞপ্তি', 'আইটি সফটওয়্যার চাকরি বাংলাদেশ', 'ফ্রেশার চাকরি বাংলাদেশ নিয়োগ',
];
const JOBWORD = /নিয়োগ|বিজ্ঞপ্তি|চাকরি|চাকুরি|লোক নিয়োগ|পদে|ক্যারিয়ার|circular|career|job|hiring/i;
for (const q of BD_QUERIES) {
  await run('gnews:' + q, async () => {
    const xml = await getText('https://news.google.com/rss/search?q=' + encodeURIComponent(q + ' when:14d') + '&hl=bn&gl=BD&ceid=BD:bn');
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
    return items.slice(0, 25).map(it => {
      const g = tag => { const m = it.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>')); return m ? cl(dec(m[1])) : ''; };
      const srcName = g('source');
      let title = g('title'); if (srcName && title.endsWith(' - ' + srcName)) title = title.slice(0, -(srcName.length + 3));
      return { title, org: srcName || 'সংবাদ সূত্র', loc: 'বাংলাদেশ', type: 'bd', src: 'নিয়োগ সংবাদ', date: day(g('pubDate')), url: g('link'), tags: ['সংবাদ'] };
    }).filter(j => j.title && JOBWORD.test(j.title));
  });
}

// ---- your own curated Bangladeshi circulars (data/curated.json) ----
let cur = [];
try { cur = JSON.parse(fs.readFileSync('data/curated.json', 'utf8')); } catch (e) { console.error('curated.json error:', e.message); }
const bd = cur.filter(j => j && j.title && j.url && (!j.deadline || j.deadline >= today)).map(j => ({
  title: cl(j.title), org: cl(j.org), loc: cl(j.loc) || 'বাংলাদেশ', type: 'bd', src: 'Job Hunter', date: j.date || today,
  deadline: j.deadline || '', url: j.url, tags: j.tags || [], cat: j.cat || '', pinned: true,
}));

// ---- merge, clean, dedupe ----
const seenU = new Set(), seenT = new Set();
const all = [...bd, ...out]
  .filter(j => j.title && j.url && /^https?:/.test(j.url))
  .filter(j => j.pinned || !j.date || j.date >= daysAgo(45))
  .filter(j => { const k = (j.title + '|' + j.org).toLowerCase(); if (seenU.has(j.url) || seenT.has(k)) return false; seenU.add(j.url); seenT.add(k); return true; })
  .map(j => ({ ...j, cat: j.cat || catOf([j.title, j.org, (j.tags || []).join(' ')].join(' ')) }));

const rank = j => (j.pinned ? 0 : j.type === 'bd' ? 1 : j.type === 'abroad' ? 2 : 3);
all.sort((a, b) => rank(a) - rank(b) || String(b.date).localeCompare(String(a.date)));

// keep a balanced mix: all BD, then up to 60 each of the others
const cap = { remote: 70, abroad: 60 };
const cnt = {};
const items = all.filter(j => { if (j.type === 'bd') return true; cnt[j.type] = (cnt[j.type] || 0) + 1; return cnt[j.type] <= (cap[j.type] || 50); }).slice(0, 320);

if (!items.length) { console.log('nothing fetched, keeping old file'); process.exit(0); }
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/jobs.json', JSON.stringify({ updated: new Date().toISOString(), count: items.length, items }, null, 1));
console.log('saved', items.length, 'jobs');
