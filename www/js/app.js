/* ===== Job Hunter 3.0 — app shell ===== */
const NAV = [
  ['home', 'হোম', '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'],
  ['cv', 'সিভি', '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>'],
  ['jobs', 'চাকরি', '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>'],
  ['prep', 'প্রস্তুতি', '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>'],
  ['more', 'আরও', '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'],
];
const PARENT = { ats: 'cv', letter: 'cv', tracker: 'jobs', scam: 'jobs', quiz: 'prep', interview: 'prep', bcs: 'prep', age: 'prep', docs: 'prep', tips: 'prep', scholar: 'more', courses: 'more', calc: 'more', backup: 'more', vault: 'more', files: 'more', settings: 'more', about: 'more', mails: 'cv', photo: 'cv', img2pdf: 'cv', roadmap: 'prep', vocab: 'prep', study: 'prep' };
const PAGES = { home: pHome, cv: pCV, jobs: pJobs, prep: pPrep, more: pMore, quiz: pQuiz, interview: pInterview, bcs: pBcs, tips: pTips, scholar: pScholar, courses: pCourses, docs: pDocs, tracker: pTracker, letter: pLetter, about: pAbout, ats: pAts, files: pFiles, vault: pVault, calc: pCalc, backup: pBackup, scam: pScam, age: pAge, settings: pSettings, mails: pMails, photo: pPhoto, img2pdf: pImg2Pdf, roadmap: pRoad, vocab: pVocab, study: pStudy };
function render() {
  let html; try { html = (PAGES[route] || pHome)() } catch (e) { console.error(e); html = `<div class="card"><b>⚠️ কিছু একটা সমস্যা হয়েছে</b><p class="muted">${esc(e.message)}</p><button class="btn" onclick="go('home')">হোমে যান</button></div>` }
  $('#app').innerHTML = html;
  const cur = PARENT[route] || route, na = newAlertJobs().length;
  $('#nav').innerHTML = NAV.map(n => `<button class="${cur === n[0] ? 'on' : ''}" onclick="go('${n[0]}')"><svg viewBox="0 0 24 24">${n[2]}</svg>${n[1]}${n[0] === 'jobs' && na ? '<i style="position:absolute;top:5px;left:56%;width:9px;height:9px;border-radius:50%;background:var(--r)"></i>' : ''}</button>`).join('');
  if (route === 'cv' && cvTab === 'view') fitPreview();
  if (route === 'files') fxInfo();
}
addEventListener('resize', () => { if (route === 'cv' && cvTab === 'view') fitPreview() });
applyTheme(); initNative();
history.replaceState({ r: 'home' }, '');
render(); loadLive(); checkUpdate();
if (!PROFILE.onb) showOnb(1);
