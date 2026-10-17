/* ============================================================
   FEUERWEHR-LERNPLATTFORM · App-Logik (Vanilla JS, offline-fähig)
   Lernwissenschaft 2026: Retrieval Practice · Spaced Repetition
   (Leitner: 1/3/7 Tage) · Interleaving · sofortiges Feedback
   Motivation: Tagespack · Streak · XP · Ränge · Badges
   ============================================================ */
'use strict';
const $ = (id) => document.getElementById(id);
const mix = (a) => { const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=b[i]; b[i]=b[j]; b[j]=t; } return b; };
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const jsq = (s) => String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
/* Inline-Markdown (**fett** -> <b>) für Erklärungen/Katalog — MerkHtml nutzt dieselbe Regel. */
const mdInline = (s) => String(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');

/* ---------- Icons ---------- */
const ICONS = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  dash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  karten:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="16" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
  quiz:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.3 9a2.8 2.8 0 0 1 5.4 1c0 1.8-2.7 2.2-2.7 4"/><circle cx="12" cy="17.3" r=".9" fill="currentColor" stroke="none"/></svg>',
  test:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 4v5c0 4.4-3 8.4-7 9-4-.6-7-4.6-7-9V7z"/><path d="M9 12l2 2 4-4"/></svg>',
  zettel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
  unlagen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  pfeil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  sonne:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  mond:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>',
  paket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  rettung:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3.5c4.5 2.5 7 7 5.5 12.5-.8 3-3.2 4.7-5.7 4.9 1.4-1.9 1.7-4.3.6-6.5-.9-1.9-1.6-4.3-.4-6.3-.9.6-2 1.9-2.6 4.2-.5 2-.1 4.1 1.1 5.9-.9.3-1.9.2-2.8-.3-3.2-1.7-4.3-5.8-2.4-9 1.7-2.9 4.5-4.7 6.7-5.4z"/><path d="M12 22c5 0 9-4 9-9"/></svg>',
  play2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l14 8-14 8z"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  rucksack:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7V5a4 4 0 0 1 8 0v2"/><path d="M5 7h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><path d="M8 12v3a4 4 0 0 0 8 0v-3"/></svg>',
  mission:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
};
function svgIc(name){ return ICONS[name]||ICONS.paket; }
const WAPPEN = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4 L58 14 v13 c0 17-11 27.5-26 32.5 C17 54.5 6 44 6 27 V14 Z" fill="#cf4025" stroke="#8f2c17" stroke-width="2.5"/><path d="M38.5 24.5 c0-3.8-1.4-7.2-3.8-9.6.5 3.3-.65 5.2-2.35 7.1-2 2.2-3.4 4.6-3.4 7.9 0 0-2.35-1.9-3.3-4.25-2.3 2.65-3.65 5.55-3.65 8.85 0 5.7 4.3 10 9.55 10 a9.85 9.85 0 0 0 9.9-9.9 c0-4.3-1.45-7.65-2.95-10.1z" fill="#ffdd64"/><circle cx="31.7" cy="35.6" r="4.1" fill="#cf4025"/></svg>';

/* ---------- Theme & Schriftgröße ---------- */
function themeSet(t){
  if (t) document.documentElement.setAttribute('data-theme', t);
  else document.documentElement.removeAttribute('data-theme');
  try{ localStorage.setItem('fw_theme', t||''); }catch(e){}
  const b = $('themeBtn'); if (b) b.innerHTML = t==='dunkel' ? ICONS.sonne : ICONS.mond;
}
function themeToggle(){ themeSet(document.documentElement.getAttribute('data-theme')==='dunkel' ? '' : 'dunkel'); }
function themeInit(){
  const saved = localStorage.getItem('fw_theme');
  themeSet(saved==='dunkel' ? 'dunkel' : '');
}
const FONT_STUFEN = ['A','A+','A++'];
function fontScaleCycle(){
  const cur = parseInt(localStorage.getItem('fw_font')||'0',10);
  const nxt = (cur+1)%3;
  localStorage.setItem('fw_font', String(nxt));
  fontScaleSet(nxt);
}
function fontScaleSet(n){
  document.documentElement.classList.toggle('fs1', n===1);
  document.documentElement.classList.toggle('fs2', n===2);
  const b = $('fontBtn'); if (b) b.textContent = FONT_STUFEN[n]||'A';
}
function fontScaleInit(){ fontScaleSet(parseInt(localStorage.getItem('fw_font')||'0',10)); }

/* ---------- Jugend / Aktiver Dienst (Modus-Umschalter) ---------- */
function modusSet(m){
  localStorage.setItem('fw_modus', m);
  const b = $('modusBtn');
  if (b){
    b.textContent = m==='jugend' ? 'Jugend' : 'Aktiv';
    b.classList.toggle('modus-jugend', m==='jugend');
  }
  document.documentElement.setAttribute('data-modus', m);
  const ak = $('scr-'+akt);
  if (akt==='home') zeigeHome();
  else if (akt==='themen') zeigeThemen();
  else if (ak && ak.classList.contains('versteckt')===false) {} /* Paket-Screens bleiben */
}
function modusGet(){ const m = localStorage.getItem('fw_modus'); return m==='jugend' ? 'jugend' : 'aktiv'; }
function modusToggle(){ modusSet(modusGet()==='jugend' ? 'aktiv' : 'jugend'); toast('Modus: '+(modusGet()==='jugend'?'Feuerwehrjugend':'Aktiver Dienst')); }
function modusInit(){ modusSet(modusGet()); }
/* Zielgruppen-Filter: Paket ohne passendes zielgruppe wird im aktuellen Modus ausgeblendet. */
function paketPasstZurZielgruppe(meta){
  const zg = (meta && meta.zielgruppe) || 'aktiv';
  if (zg==='beide') return true;
  return zg === modusGet();
}


/* ---------- Streak · XP · Rang · Badges ---------- */
const RAENGE = [
  [0,'Rekrut'],[100,'Feuerwehrmann'],[300,'Löschmeister'],[600,'Hauptlöschmeister'],
  [1000,'Oberlöschmeister'],[1500,'Brandmeister'],[2200,'Hauptbrandmeister'],
  [3000,'Oberbrandmeister'],[4200,'Brandinspektor'],[6000,'Kommandant']
];
function tagKey(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function heute(){ return tagKey(new Date()); }
function tagNum(){ return Math.floor(Date.now()/86400000); }
function statsGet(){
  try{ const v = JSON.parse(localStorage.getItem('fw_stats')||'null');
    if (v && v.tage) return v; }catch(e){}
  return { tage:{}, xps:0 };
}
function statsSet(s){ try{ localStorage.setItem('fw_stats', JSON.stringify(s)); }catch(e){} }
function streakBerechnen(s){
  let streak = 0; const d = new Date();
  for(let i=0;i<3650;i++){
    if (s.tage[tagKey(d)]){ streak++; d.setDate(d.getDate()-1); } else break;
  }
  return streak;
}
function xpAdd(n){
  const s = statsGet();
  s.xps += n;
  const h = heute();
  if (!s.tage[h]) s.tage[h] = {xp:0, karten:0, quiz:0, test:0};
  s.tage[h].xp = (s.tage[h].xp||0) + n;
  statsSet(s);
}
function aktivHeute(kind){
  const s = statsGet();
  const h = heute();
  if (!s.tage[h]) s.tage[h] = {xp:0, karten:0, quiz:0, test:0};
  if (kind==='karte') s.tage[h].karten = (s.tage[h].karten||0)+1;
  if (kind==='quiz') s.tage[h].quiz = (s.tage[h].quiz||0)+1;
  if (kind==='test') s.tage[h].test = (s.tage[h].test||0)+1;
  statsSet(s);
}
function aktivInfo(){
  const s = statsGet();
  const t = s.tage[heute()] || {xp:0,karten:0,quiz:0,test:0};
  return { streak:streakBerechnen(s), xps:s.xps, heute:t };
}
function rangVon(xp){
  let r = RAENGE[0], next = null;
  for (let i=0;i<RAENGE.length;i++){
    if (xp >= RAENGE[i][0]) r = RAENGE[i];
    else { next = RAENGE[i]; break; }
  }
  if (!next && RAENGE.length){ /* max */ }
  return { name:r[1], von:r[0], next };
}
/* Badges */
const BADGES = [
  {id:'start',   ic:'🔥', name:'Erster Schritt', desc:'Erste Lern-Session absolviert'},
  {id:'streak3', ic:'🔥', name:'3-Tage-Streak', desc:'3 Tage in Folge gelernt'},
  {id:'streak7', ic:'⭐', name:'Wochen-Streak', desc:'7 Tage in Folge gelernt — gewohnheitsstark!'},
  {id:'streak30',ic:'🏅', name:'Monats-Streak', desc:'30 Tage in Folge gelernt'},
  {id:'karten10',ic:'🃏', name:'10 Karten sitzen', desc:'10 Lernkarten im Leitner-Kasten durchschaut'},
  {id:'karten50',ic:'🃏', name:'50 Karten sitzen', desc:'50 Lernkarten im Leitner-Kasten durchschaut'},
  {id:'kartenAlle',ic:'🏆', name:'Katalog gemeistert', desc:'Alle Lernkarten eines Lehrgangs sitzen'},
  {id:'quiz100', ic:'🎯', name:'Perfektes Quiz', desc:'Eine Quiz-Runde mit 100 % beendet'},
  {id:'note1',   ic:'🎖️', name:'Prüfungsreif', desc:'Prüfungssimulation mit Note 1 abgeschlossen'},
  {id:'rucksack0',ic:'🎒', name:'Rucksack leer', desc:'Fehlerrucksack komplett abgearbeitet'},
];
function badgesGet(){ try{ return JSON.parse(localStorage.getItem('fw_badges')||'[]'); }catch(e){ return []; } }
function badgeCheck(){
  const hab = badgesGet();
  const vergebe = (id) => { if (!hab.includes(id)){ hab.push(id); try{ localStorage.setItem('fw_badges', JSON.stringify(hab)); }catch(e){}
    const b = BADGES.find(x=>x.id===id);
    if (b) toast(b.ic+' Abzeichen verdient: '+b.name);} };
  const s = statsGet();
  const st = streakBerechnen(s);
  if (Object.keys(s.tage).length >= 1) vergebe('start');
  if (st >= 3) vergebe('streak3');
  if (st >= 7) vergebe('streak7');
  if (st >= 30) vergebe('streak30');
  return hab;
}
function badgeCheckKarten(nGesamt){
  badgeCheck();
  const hab = badgesGet();
  const vergebe = (id) => { if (!hab.includes(id)){ hab.push(id); try{ localStorage.setItem('fw_badges', JSON.stringify(hab)); }catch(e){}
    const b = BADGES.find(x=>x.id===id); if (b) toast(b.ic+' Abzeichen verdient: '+b.name); } };
  if (nGesamt >= 10) vergebe('karten10');
  if (nGesamt >= 50) vergebe('karten50');
  if (nGesamt >= 145) vergebe('kartenAlle');
  return hab;
}
function badgeListeHTML(hab){
  return '<div class="pillrow" style="margin-top:8px">'+BADGES.map(b=>{
    const on = hab.includes(b.id);
    return '<span class="badge-chip'+(on?' on':'')+'" title="'+esc(b.desc)+'">'+b.ic+' '+esc(b.name)+'</span>';
  }).join('')+'</div>';
}

/* ---------- Toast ---------- */
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('zeigen'), 20);
  setTimeout(()=>{ t.classList.remove('zeigen'); setTimeout(()=>t.remove(), 400); }, 3200);
}

/* ---------- Pakete ---------- */
const MANIFEST = window.FW_PAKETE || [];
let paketAktiv = null;
function boot(){
  MANIFEST.forEach(m => {
    if (window[m.objekt]) { PAKETE_MAP[m.id] = { meta:m, data:window[m.objekt] }; }
  });
  themeInit(); fontScaleInit(); modusInit();
  /* Wappen: echtes OOELFV-Emblem als <img> im HTML */
  go('home');
}
const PAKETE_MAP = {};
function oeffnePaket(id){
  const e = PAKETE_MAP[id];
  if (!e){ toast('Paket noch nicht geladen.'); return; }
  if (paketAktiv && paketAktiv.meta && paketAktiv.meta.id===id){ go('dash'); return; }
  window.__t2 && clearTimeout(window.__t2);
  tStatus && tStatus.tick && clearInterval(tStatus.tick);
  qStatus = {l:false, multiGewertet:false};
  tStatus = {l:false};
  kStatus = {l:false};
  paketAktiv = e;
  try{ localStorage.setItem('fw_zuletzt', id); }catch(err){}
  go('dash');
}
function paketZu(){ paketAktiv = null; go('home'); }

/* ---------- Navigation ---------- */
let akt = 'home';
const SCREENS = ['home','themen','dash','dashKarten','quiz','test','katalog','unlagen'];
function renderNavi(){
  const n = $('navi');
  const items = [['home','Start','home'],['themen','Lernthemen','zettel']];
  if (paketAktiv){
    items.push(
      ['dash','Überblick','dash'],
      ['dashKarten','Karten','karten'],
      ['quiz','Quiz','quiz'],
      ['test','Test','test'],
      ['katalog','Katalog','zettel'],
      ['unlagen','Unterlagen','unlagen']
    );
  }
  /* Mobil max. 5 Punkte (Bottom-Nav-Standard): Katalog + Unterlagen sind im
     Dashboard unter "Werkzeuge" erreichbar, Desktop zeigt alle. */
  const mobil = window.matchMedia('(max-width:699px)').matches;
  const mobilMax = ['dash','katalog','unlagen'];
  const zeigen = mobil ? items.filter(it => mobilMax.indexOf(it[0])===-1) : items;
  n.innerHTML = zeigen.map(([id,l,ic]) =>
    '<button '+(akt===id?'class="sel"':'')+' onclick="go(\''+id+'\')" aria-label="'+l+'">'+svgIc(ic)+'<span>'+l+'</span></button>').join('');
}
function go(m){
  /* Start-Klick verlässt das Lernthema komplett — Navi wie beim frischen Seitenaufruf (nur Start+Lernthemen). */
  if (m==='home' && paketAktiv){ paketAktiv = null; try{ localStorage.removeItem('fw_zuletzt'); }catch(err){} }
  akt = m; renderNavi();
  SCREENS.forEach(s=>{ const n=$('scr-'+s); if(n) n.classList.add('versteckt'); });
  const sc = $('scr-'+m); if (sc) sc.classList.remove('versteckt');
  if (m==='home') zeigeHome();
  if (m==='themen') zeigeThemen();
  if (m==='dash') zeigeDash();
  if (m==='dashKarten' && paketAktiv) kartenInit();
  if (m==='quiz' && paketAktiv && !qStatus.l) quizStart();
  if (m==='test' && paketAktiv && !tStatus.l) testStart();
  if (m==='katalog' && paketAktiv) initKatalog();
  if (m==='unlagen' && paketAktiv) initUnlagen();
  const sc2 = $('scr-'+m);
  if (sc2){ sc2.classList.remove('reveal'); void sc2.offsetWidth; sc2.classList.add('reveal'); }
  window.scrollTo(0,0);
}

/* ---------- Home (Paketwahl) ---------- */

function tipps_und_faq(){
  let t = '<div class="karte"><div class="farbe">Wie du hier am effektivsten lernst</div>'+
    '<ul class="tipp-liste">'+
    '<li><b>1 · Täglich 10–15 Minuten schlagen Marathon.</b> Kurz und regelmäßig: das Tagespack auf dem Überblick bringt dich weiter als ein langer Block am Wochenende.</li>'+
    '<li><b>2 · Erst antworten, dann aufdecken.</b> Bei Karten und Quiz immer erst selbst in eigenen Worten antworten — genau dann entsteht Lernen.</li>'+
    '<li><b>3 · Fehler sind Treibstoff.</b> Falsche Fragen landen im Fehlerrucksack und kommen gezielt wieder — nicht bestraft, sondern geübt.</li>'+
    '<li><b>4 · Kurz vor der Prüfung:</b> Prüfungstag-Simulation unter echten Bedingungen (Zeitdruck, Mischung), dann gezielt den Fehlerrucksack abarbeiten.</li>'+
    '</ul></div>';
  t += '<details class="box"><summary>Warum funktioniert dieses System?</summary><div class="innen stat">'+
    'Die Plattform baut auf den in der Lernforschung am besten belegten Techniken auf.'+
    '<ul style="margin:8px 0 0;list-style:none">'+
    '<li>🧠 <b>Abfragen (Retrieval Practice)</b> — Karten + Quiz erzwingen aktives Erinnern statt passivem Durchlesen.</li>'+
    '<li>📅 <b>Verteiltes Wiederholen (Spaced Repetition)</b> — Leitner: richtige Karten kommen nach 1, 3, dann 7 Tagen wieder.</li>'+
    '<li>🔀 <b>Mischen (Interleaving)</b> — Gebiete wechseln, damit das Gehirn unterscheiden lernt, nicht nur auswendig.</li>'+
    '<li>💬 <b>Sofortiges Feedback mit Erklärung.</b></li>'+
    '<li>🔥 <b>Streak + Tagespack</b> — Gewohnheit statt Motivation: 10 Minuten täglich halten nachweislich am längsten.</li>'+
  '</ul></div></details>';
  return t;
}

function zeigeHome(){
  const zl = localStorage.getItem('fw_zuletzt');
  const s = aktivInfo();
  let h =
    '<div class="karte hero"><div class="farbe r">Ausbildung · Handzettel-Prinzip</div>'+
    '<div class="frage" style="font-size:1.22em">Die komplette Feuerwehr-Ausbildung zum Erlernen — vom Grundlehrgang bis zur Führung, in der echten Reihenfolge.</div>'+
    '<p class="stat" style="margin-top:8px">Jeder Lehrgang ist ein Themen-Paket: Karte anklicken → alles zum Thema. Abfragen statt Lesen, kleine tägliche Sessions, sofortiges Feedback mit Erklärung. Fortschritt bleibt lokal auf deinem Gerät.</p></div>';
  if (s.xps>0 || Object.keys(s).length){
    const r = rangVon(s.xps);
    h += '<div class="streak-row">'+
      '<div class="streak-box"><span class="flamme">🔥</span><div class="val">'+s.streak+' '+(s.streak===1?'Tag':'Tage')+'</div><div class="lbl">Lern-Streak</div></div>'+
      '<div class="streak-box"><span style="font-size:1.55em">⚡</span><div class="val">'+s.xps+' XP</div><div class="lbl">Rang: '+esc(r.name)+'</div></div></div>';
  }
  h += '<div class="home-cta"><button class="btn gross" onclick="go(\'themen\')">Lernthemen öffnen '+svgIc('pfeil')+'</button></div>';
  h += '<div class="home-erklaerung">'+
    '<div class="karte"><div class="farbe">Die Schriftgröße A · A+ · A++</div>'+
    '<div class="stat" style="text-align:left">Oben rechts stellst du mit dem <b>A-Knopf</b> die Schriftgröße ein. '+
    'Drei Stufen, ein Klick pro Stufe: normal, größer, am größten fürs Handy im Einsatz oder bei schlechtem Licht. '+
    'Die Wahl wird gespeichert und bleibt für den nächsten Besuch.</div></div>'+
    '<div class="karte"><div class="farbe">Jugend · Aktiver Dienst</div>'+
    '<div class="stat" style="text-align:left">Der Knopf daneben schaltet zwischen <b>Jugend</b> (Erprobungen, Wissenstest, FJLA) und <b>Aktiver Dienst</b> (Grundlehrgang, TRF-A, Leistungsprüfungen) um. Der Laufbahn-Pfad und die Lernthemen passen sich sofort an — gemacht für Mischwehre mit jugendlichen und aktiven Mitgliedern.</div></div>'+
    '<div class="karte"><div class="farbe">Hell · Dunkel</div>'+
    '<div class="stat" style="text-align:left">Der Mondknopf daneben schaltet zwischen hellem Tag-Design und dunklem Nacht-Design. '+
    'Beide sind aufs OÖLFV-Rot abgestimmt und bleiben gespeichert.</div></div>'+
  '</div>';
  h += tipps_und_faq();
  $('scr-home').innerHTML = h;
}

/* ---------- Große Lern-Kapitel (Katalogisierung der Pakete) ---------- */
const THEMEN_GRUPPEN = [
  { key:'grundlage', name:'Grundausbildung & Grundlehrgang', note:'Basis für jedes aktive Mitglied: Truppmann (001) + Refresher-Prüfungsformat', ids:['trm'] },
  { key:'trupa', name:'Truppführer-Ausbildung (189)', note:'6 Module bis zur Abschnittsprüfung: Katalog + Praxis + Simulation', ids:['trfa'] },
  { key:'fach', name:'Fach- & Zusatzqualifikationen', note:'Parallel möglich: Funk (005), Verkehrsregler (195), Feuerwehrführerschein', ids:['funk','verkehrsregler','fw-fuehrerschein'] },
  { key:'pruef', name:'Leistungsprüfungen (LPR)', note:'Atemschutz, Sanität, Funk FKAE, FLA Gold — je Bronze/Silber/Gold', ids:['lpr-as','san-lp','fkae-bronze','fla-gold'] },
  { key:'fuehrung', name:'Führungslaufbahn', note:'Führen I → II → Einsatzleiter → Kommandant — Pakete folgen (LFS-intern), Zugang via Refresher im Grundlehrgang', ids:[] },
  { key:'jugend', name:'Feuerwehrjugend', note:'Erprobungen 1–5 → Wissenstest Bronze/Silber/Gold — der Weg bis zum aktiven Dienst', ids:['erprobungen','wissenstest'] }
];
function kachelIdPasst(gid, m){ return gids(gid).indexOf(m.id)>=0; }
function gids(k){ const g=THEMEN_GRUPPEN.find(g=>g.key===k); return g?g.ids:[]; }
function renderPaketGruppen(modus, zl){
  let h = '';
  THEMEN_GRUPPEN.forEach(g=>{
    const pakete = MANIFEST.filter(m=>gids(g.key).indexOf(m.id)>=0 && paketPasstZurZielgruppe(m));
    if (!pakete.length) return;
    h += '<div class="tg-head"><b>'+g.name+'</b><span class="tg-note">'+g.note+'</span></div>';
    h += '<div class="paket-grid">'+pakete.map(m=>{
      const pk = PAKETE_MAP[m.id];
      const p = pk && pk.data;
      const st = p ? p.stats : null;
      const gelesen = pk && p ? palettenProg(pk) : null;
      return '<button class="paket-kachel" onclick="oeffnePaket(\''+m.id+'\')">'+
        '<div class="pk-head">'+
        '<span class="pk-icon" style="background:'+m.farbe+'22;color:'+m.farbe+';box-shadow:inset 0 0 0 1.5px '+m.farbe+'55">'+svgIc('test')+'</span>'+
        '<div><div class="pk-sub">'+esc(m.untertitel)+'</div><h3>'+esc(m.titel)+'</h3></div></div>'+
        '<p>'+esc(m.beschreibung)+'</p>'+
        (st ? '<div class="chips-klein">'+
          (st.theorie_katalog?'<span class="chip on">'+st.theorie_katalog+' Theorie</span>':'')+
          (st.praxis?'<span class="chip on">'+st.praxis+' Praxis</span>':'')+
          (st.karten?'<span class="chip on">'+st.karten+' Karten</span>':'')+
          (st.unterlagen?'<span class="chip on">'+st.unterlagen+' Unterlagen</span>':'')+'</div>' : '')+
        (gelesen ? '<div class="fbalk gruen" style="margin-top:10px"><i style="width:'+gelesen.pct+'%"></i></div>'+
          '<div class="planhinweis">'+(gelesen.pct>0
            ? '<b>'+gelesen.sitzen+'</b> von '+gelesen.gesamt+' Karten sitzen ('+gelesen.pct+' %)'
            : 'Noch nicht begonnen — <b>'+(gelesen.gesamt)+' Karten</b> warten auf dich')+'</div>'
          : '<div class="planhinweis" style="margin-top:8px">Noch nicht begonnen</div>')+
        '<span class="pk-cta">'+(zl===m.id?'Weitermachen':'Öffnen')+' '+svgIc('pfeil')+'</span></button>';
    }).join('')+'</div>';
  });
  return h;
}

function zeigeThemen(){
  const zl = localStorage.getItem('fw_zuletzt');
  let h = '<div class="farbe hero-titel">Lernthemen</div>'+
    '<p class="stat" style="text-align:left">Jedes Thema ist ein Paket: Kachel anklicken → Überblick, Karten, Quiz, Prüfung, Katalog und Unterlagen.</p>'+
    /* Laufbahn-Pfad nach der offiziellen Oö.-Ausbildungsreihenfolge (OÖLFV-Ausbildungsmodell):
       Grundausbildung → Grundlehrgang 001 → Truppführer (01B9) → Funk/Maschinist/AtGs parallel → Führung. */
    '<div class="laufbahn">'+(modusGet()==='jugend' ?
    '<div class="lb-schritt lb-aktiv"><span class="lb-nr">1</span><div><b>Erprobung 1 · Feuerwehr-Kennen lernen</b><div class="lb-note">Organisation, Verhalten, Erste-Hilfe-Basics — Paket folgt</div></div></div>'+
    '<div class="lb-schritt"><span class="lb-nr">2</span><div><b>Erprobungen 2–5 · Geräte & Einsatztätigkeit</b><div class="lb-note">Knoten, Schlauchleiter, Löschangriff — Paket folgt</div></div></div>'+
    '<div class="lb-schritt"><span class="lb-nr">3</span><div><b>Wissenstest Bronze/Silber/Gold</b><div class="lb-note">5 Stationen je Stufe — <a href="#" onclick="oeffnePaket(\'wissenstest\');return false">Paket öffnen</a></div></div></div>'+
    '<div class="lb-schritt"><span class="lb-nr">4</span><div><b>FJLA Bronze/Silber/Gold (Bewerb)</b><div class="lb-note">Jugend-Leistungsabzeichen — Paket folgt</div></div></div>'+
    '<div class="lb-schritt"><span class="lb-nr">5</span><div><b>Wechsel zum aktiven Dienst</b><div class="lb-note">Mit 18: Grundausbildung → Grundlehrgang (001) → Laufbahn des aktiven Dienstes</div></div></div>' :
    '<div class="lb-schritt lb-aktiv"><span class="lb-nr">1</span><div><b>Grundausbildung in der Feuerwehr</b><div class="lb-note">80 Einheiten + Erste-Hilfe — in der Wehr, Basis für alles</div></div></div>'+
    '<div class="lb-schritt"><span class="lb-nr">2</span><div><b>Grundlehrgang · Abschluss Truppmann (001)</b><div class="lb-note">2 Tage, Bezirk — Paket folgt</div></div></div>'+
    '<div class="lb-schritt lb-aktiv"><span class="lb-nr">3</span><div><b>Truppführer-Ausbildung & Prüfung (TRF-A · 189)</b><div class="lb-note">7 Module in der Wehr, Prüfung am Abschnitt — <a href="#" onclick="oeffnePaket(\'trfa\');return false">Paket öffnen</a></div></div></div>'+
    '<div class="lb-schritt"><span class="lb-nr">4</span><div><b>Fachlehrgänge parallel möglich</b><div class="lb-note">Funk (005), TS-Maschinist (012), Atemschutz — Pakete folgen</div></div></div>'+
    '<div class="lb-schritt"><span class="lb-nr">5</span><div><b>Führungslaufbahn</b><div class="lb-note">Führen I → II → Einsatzleiter → Kommandant — Pakete folgen</div></div></div>')+
    '</div>';
  h += renderPaketGruppen(modusGet(), String(zl));
  const _oldGrid = null;
  h += '<div class="karte"><div class="farbe">Reihenfolge & Freigabe</div><div class="stat">Die Plattform folgt der offiziellen Ausbildungs-Reihenfolge: Grundausbildung → Grundlehrgang → Truppführer → Fachlehrgänge/Führung. Gebaute Pakete sind verlinkt; die anderen erscheinen automatisch, sobald sie fertig sind.</div></div>';
  $('scr-themen').innerHTML = h;
}

/* ---------- Fortschritt pro Paket ---------- */
function fortKey(id){ return 'fw_prog_' + id; }
function progGet(id, n){
  let v = null;
  try{ v = JSON.parse(localStorage.getItem(fortKey(id))||'null'); }catch(e){}
  if (v && Array.isArray(v.lev) && v.lev.length===n){ if (v.shown===undefined) v.shown = 0; if (v.mseen===undefined) v.mseen = 0; return v; }
  return { lev:new Array(n).fill(1), due:new Array(n).fill(0), last:new Array(n).fill(0), tick:0, shown:0, mseen:0 };
}
function progSet(id, v){ try{ localStorage.setItem(fortKey(id), JSON.stringify(v)); }catch(e){} }
function palettenProg(p){
  if (!p || !p.data || !p.data.karten) return null;
  const v = progGet(p.meta.id, p.data.karten.length);
  const sitzen = v.lev.filter(x=>x>=3).length;
  return { sitzen, gesamt:p.data.karten.length, pct:Math.round(sitzen/p.data.karten.length*100) };
}

/* ---------- Dashboard ---------- */
function zeigeDash(){
  const d = paketAktiv.data, m = paketAktiv.meta;
  const fr = d.fragen, kar = d.karten, merk = d.merkhilfen;
  const prog = palettenProg(paketAktiv);
  const s = aktivInfo();
  const r = rangVon(s.xps);
  const tages = tagespackState();
  // Reihenfolge der Gebiete fix
  const gew = ['Atemschutz','Branddienst','Funk','Kraftbetriebene Geräte','Technik','Taktik'];
  const gebiete = [...new Set(fr.map(f=>f.m2))].sort((a,b)=>{
    const ia = gew.indexOf(a), ib = gew.indexOf(b);
    return (ia<0?99:ia) - (ib<0?99:ib);
  });
  let h = '<div class="mod-head"><button class="mod-back" onclick="paketZu()" aria-label="Zurück">'+svgIc('back')+'</button>'+
    '<div><div class="pk-sub" style="color:var(--text-dim);font-size:.72em;font-weight:800;text-transform:uppercase;letter-spacing:.05em">'+esc(m.untertitel)+'</div>'+
    '<h2 style="font-size:1.22em">'+esc(m.titel)+'</h2></div></div>';
  /* JETZT DRAN — der eine klare nächste Schritt (Learner-Frage 2: „Was mache ich als Nächstes?") */
  const naechstes = !tages.komplett ? 'karten' : (rucksackN()>0 ? 'rucksack' : null);
  h += '<div class="karte tagespack jetzt-dran'+(tages.komplett?' erledigt':'')+'">'+
    '<div class="farbe">'+(tages.komplett?'Tagespack erledigt ✓':'Jetzt dran · ca. 10 Min')+'</div>'+
    '<div class="stat" style="margin-bottom:10px">'+(tages.komplett
      ? '🎉 Erledigt — Streak für heute gesichert!'
      : (naechstes==='karten'
        ? '<b>'+Math.max(0,15-tages.karten)+' Karten</b> abfragen und <b>1 Quiz-Runde</b> — das ist heute dran.'
        : 'Fehlerrucksack abarbeiten: <b>'+rucksackN()+' Frage'+(rucksackN()===1?'':'n')+'</b> warten auf dich.'))+'</div>'+
    '<div class="mini-row">'+
      '<div class="mini"><span class="flamme">🃏</span><b>'+Math.min(tages.karten,15)+'/15</b><span>Karten</span></div>'+
      '<div class="mini"><span class="flamme">🎯</span><b>'+(tages.quiz?1:0)+'/1</b><span>Quiz-Runde</span></div>'+
    '</div>'+
    (naechstes==='karten'
      ? '<button class="btn" onclick="go(\'dashKarten\')">'+svgIc('play2')+' Tagespack starten</button>'
      : (naechstes==='rucksack'
        ? '<button class="btn" onclick="quizRucksack()">'+svgIc('rucksack')+' Rucksack abfragen</button>'
        : '<button class="btn zweit" onclick="go(\'test\')">'+svgIc('test')+' Optional: Prüfungssimulation</button>'))+
    '</div>';
  /* Status-Zeile (Learner-Frage 1 „Was habe ich geschafft?" + 3 „Wie nah am Ziel?") */
  h += '<div class="fortschritt-band">'+
    '<span title="Tage in Folge gelernt">🔥 '+s.streak+' <b>'+(s.streak===1?'Tag':'Tage')+'</b></span>'+
    '<span title="Gesammelte XP und Rang">⚡ '+s.xps+' XP · '+esc(r.name)+(r.next?' (noch '+(r.next[0]-s.xps)+' bis '+esc(r.next[1])+')':'')+'</span>'+
    '<span title="Karten, die sicher sitzen">🃏 '+prog.sitzen+'/'+prog.gesamt+' sitzen · '+prog.pct+' %</span>'+
  '</div>';
  /* Fortschritts-Kacheln: Karten + Quiz + Test */
  h += '<div class="geb-grid">'+
    '<div class="geb-karte"><div class="streifen" style="background:var(--rot)"></div>'+
      '<div class="farbe r" style="margin-bottom:6px">Lernkarten</div>'+
      '<div class="zahlen">'+prog.sitzen+' von '+prog.gesamt+' sitzen · '+prog.pct+' %</div>'+
      '<div class="fbalk" style="margin-top:9px"><i style="width:'+prog.pct+'%"></i></div>'+
      '<div class="geb-acts"><button class="btn klein" onclick="go(\'dashKarten\')">'+svgIc('play2')+' Abfragen</button></div></div>'+
    '<div class="geb-karte"><div class="streifen" style="background:var(--gelb)"></div>'+
      '<div class="farbe" style="margin-bottom:6px">Fehlerrucksack</div>'+
      (rucksackN()>0
        ? '<div class="zahlen">'+rucksackN()+' Frage'+(rucksackN()===1?'':'n')+' zum Nachholen</div>'
        : '<div class="zahlen">Leer — jede falsche Antwort landet hier zum gezielten Wiederholen.</div>')+
      '<div class="geb-acts"><button class="btn klein'+(rucksackN()===0?'':' gelb')+'" '+(rucksackN()===0?'disabled':'')+' onclick="quizRucksack()">'+svgIc('rucksack')+' Abfragen</button></div></div>'+
    '<div class="geb-karte"><div class="streifen" style="background:var(--blau)"></div>'+
      '<div class="farbe" style="margin-bottom:6px;color:var(--blau)">Prüfungssimulation</div>'+
      (testBest()
        ? '<div class="zahlen">Bestwert: Note '+testBest().note+' · '+testBest().pct+' %</div>'
        : '<div class="zahlen">Noch kein Test absolviert.</div>')+
      '<div class="geb-acts"><button class="btn klein blau" onclick="go(\'test\')">'+svgIc('test')+' Test starten</button></div></div>'+
    '</div>';
  /* Gebiete-Grid */
  h += '<div class="planhinweis" style="margin-top:16px">Die 6 Prüfungs-Gebiete (Taktik = inkl. Gefahrenlehre + Schadstoffeinsatz) — gezielt üben:</div>';
  h += '<div class="geb-grid">'+gebiete.map((g,i)=>{
    const fN = fr.filter(f=>f.m2===g).length, kN = kar.filter(k=>k.g===g).length;
    const sitz = sitzenInGebiet(g);
    return '<div class="geb-karte" style="animation-delay:'+(i*55)+'ms">'+
      '<div class="streifen" style="background:'+m.farbe+'"></div>'+
      '<div class="farbe" style="margin-bottom:6px">'+esc(g)+'</div>'+
      '<div class="zahlen">'+fN+' Fragen · '+kN+' Karten'+(sitz.total?' · '+sitz.ok+'/'+sitz.total+' sitzen':'')+'</div>'+
      '<div class="geb-acts">'+
      '<button class="btn klein" onclick="quizGebiet(\''+jsq(g)+'\')">'+svgIc('quiz')+' Quiz</button>'+
      '<button class="btn zweit klein" onclick="kartenFilterGebiet(\''+jsq(g)+'\')">Karten</button></div></div>';
  }).join('')+'</div>';
  /* PO + Werkzeuge + Badges */
  const po = d.po || {};
  if (po.quelle){
    h += '<details class="box"><summary>Prüfungsordnung & Regeln</summary><div class="innen stat">'+
      '<b>Bestehensregel:</b> '+esc(po.bestehen||'-')+'<br>'+
      (po.zeiten_min ? '<b>Zeitkontingente:</b> '+Object.entries(po.zeiten_min).map(([k,v])=>esc(k)+' '+v+' Min').join(' · ')+'<br>' : '')+
      '<b>Quelle:</b> '+esc(po.quelle)+'</div></details>';
  }
  const hab = badgeCheckKarten(prog.sitzen);
  if (hab.length) h += '<div class="karte"><div class="farbe">Deine Abzeichen</div>'+badgeListeHTML(hab)+'</div>';
  h += '<div class="karte"><div class="farbe">Werkzeuge</div>'+
    '<button class="btn zweit" onclick="go(\'katalog\')">'+svgIc('zettel')+' Kompletter Katalog durchsuchen</button>'+
    '<button class="btn zweit" onclick="go(\'unlagen\')">'+svgIc('unlagen')+' Offizielle Unterlagen (OÖLFS)</button></div>';
  $('scr-dash').innerHTML = h;
}
function sitzenInGebiet(g){
  if (!paketAktiv) return {ok:0,total:0};
  const v = progGet(paketAktiv.meta.id, paketAktiv.data.karten.length);
  let ok=0, total=0;
  paketAktiv.data.karten.forEach((k,i)=>{ if(k.g===g){ total++; if(v.lev[i]>=3) ok++; } });
  return {ok, total};
}
function tagespackState(){
  const s = statsGet();
  const t = s.tage[heute()] || {karten:0, quiz:0, test:0, xp:0};
  return { karten:t.karten||0, quiz:t.quiz||0, test:t.test||0, komplett:(t.karten||0)>=15 && (t.quiz||0)>=1 };
}
function testBest(){
  if (!paketAktiv) return null;
  try{ return JSON.parse(localStorage.getItem('fw_best_'+paketAktiv.meta.id)||'null'); }catch(e){ return null; }
}

/* ---------- Fehlerrucksack ---------- */
function rsKey(){ return 'fw_rs_'+paketAktiv.meta.id; }
function rucksackLaden(){
  try{ const v = JSON.parse(localStorage.getItem(rsKey())||'null'); if (Array.isArray(v)) return v; }catch(e){}
  return [];
}
function rucksackN(){ return paketAktiv ? rucksackLaden().length : 0; }
function rucksackAdd(i){
  const rs = rucksackLaden();
  const e = rs.find(x=>x.i===i);
  if (e) e.n++; else rs.push({i, n:1});
  try{ localStorage.setItem(rsKey(), JSON.stringify(rs)); }catch(err){}
}
function rucksackRemove(i){
  const rs = rucksackLaden().filter(x=>x.i!==i);
  try{ localStorage.setItem(rsKey(), JSON.stringify(rs)); }catch(err){}
}

/* ============================================================
   LERNKARTEN — Leitner mitdue-Daten (1/3/7 Tage)
   ============================================================ */
const LEITNER_TAGE = [0, 1, 3, 7];
let kStatus = {l:false};
function kartenInit(){
  const d = paketAktiv.data;
  kStatus = Object.assign({l:true, gestartet:false, gesamt:d.karten.length, filter:null, cur:null}, progGet(paketAktiv.meta.id, d.karten.length));
  zeigeKartenStart();
}
function kartenFilterGebiet(g){ go('dashKarten'); kStatus.filter = g; kStatus.gestartet = false; setTimeout(()=>zeigeKartenStart(), 40); }
function kartenPool(g){
  const d = paketAktiv.data;
  let all = d.karten.map((_,i)=>i);
  if (g==null || g==='Alle gemischt') return all;
  return all.filter(i=>d.karten[i].g===g);
}
function kartenSitzen(g){
  const pool = kartenPool(g);
  let n=0; pool.forEach(i=>{ if(kStatus.lev[i]>=3) n++; }); return n;
}
function kartenOffen(g){
  const pool = kartenPool(g);
  let n=0; pool.forEach(i=>{ if(kStatus.lev[i]<3) n++; }); return n;
}
function kartenFaellig(g){
  const pool = kartenPool(g);
  const t = tagNum();
  let n=0; pool.forEach(i=>{ if(kStatus.lev[i]<3 && kStatus.due[i]<=t) n++; }); return n;
}
function zeigeKartenStart(){
  const d = paketAktiv.data;
  const sc = $('scr-dashKarten');
  const sitzen = kStatus.lev.filter(x=>x>=3).length;
  if (!kStatus.gestartet){
    const chipsG = ['Alle gemischt'].concat([...new Set(d.karten.map(k=>k.g))]);
    const chips = chipsG.map(g=>{
      const n = kartenPool(g).length, sz = kartenSitzen(g), fa = kartenFaellig(g);
      const sel = (kStatus.filter||'Alle gemischt')===g;
      const lbl = g==='Alle gemischt' ? 'Alle ('+n+')' : g+' · '+n+(sz>0?' · '+sz+' ✓':'');
      return '<button class="pill'+(sel?' pillsel':'')+'" onclick="kSetFilter(\''+jsq(g)+'\')">'+esc(lbl)+(fa>0?'<span class="due-dot" title="wieder fällig"></span>':'')+'</button>';
    }).join('');
    sc.innerHTML = '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button>'+
      '<h2 style="font-size:1.18em">Lernkarten</h2></div>'+
      '<div class="karte"><div class="farbe">Abfragen statt Lesen</div>'+
      '<div class="stat" style="text-align:left">Erst selbst laut antworten, <b>dann</b> aufdecken — der Lern-Effekt entsteht beim Abrufen, nicht beim Schauen.<br>'+
      '<div class="legende"><span class="stufe"><i style="background:var(--rot)"></i>Stufe 1 — morgen wieder</span>'+
      '<span class="stufe"><i style="background:var(--gelb)"></i>Stufe 2 — in 3 Tagen</span>'+
      '<span class="stufe"><i style="background:var(--gruen-stark)"></i>Stufe 3 — in 7 Tagen = sitzt</span></div>'+
      'Richtig = eine Stufe höher · Falsch = zurück auf Stufe 1. Die gelben <b>Merkhilfen</b> kommen automatisch alle 8 Karten als Auffrischer.</div>'+
      '<div class="planhinweis" style="text-align:left;margin-top:12px">Gebiet wählen:</div><div class="pillrow">'+chips+'</div>'+
      '<div class="stat" style="text-align:center;margin-top:12px">'+sitzen+' von '+d.karten.length+' sitzen · '+kartenFaellig(kStatus.filter)+' fällig heute</div>'+
      '<div class="fbalk"><i style="width:'+(d.karten.length?Math.round(sitzen/d.karten.length*100):0)+'%"></i></div>'+
      '<button class="btn" onclick="kartenRun()">'+svgIc('play2')+' Los geht\'s</button>'+
      '<button class="btn zweit klein" onclick="kartenRun(\'alle\')">Auch sitze Karten wiederholen</button>'+
      (sitzen>0?'<button class="btn zweit klein" onclick="kartenReset()">Fortschritt zurücksetzen</button>':'')+'</div>';
    return;
  }
  const modus = kStatus.practice ? 'practice' : 'normal';
  const it = nextItem(modus);
  const fA = kStatus.filter || 'Alle gemischt';
  const fSitA = kartenSitzen(fA), fTotA = kartenPool(fA).length;
  if (!it){
    kStatus.l = false;
    progSet(paketAktiv.meta.id, kStatusRo());
    badgeCheckKarten(kStatus.lev.filter(x=>x>=3).length);
    tagespackCheckToast('karte');
    const fLbl = (kStatus.filter && kStatus.filter!=='Alle gemischt') ? esc(fA)+': alle fälligen Karten dran!' : 'Alle fälligen Karten dran — für heute genug!';
    sc.innerHTML = '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button><h2 style="font-size:1.18em">Karten fertig</h2></div>'+
      '<div class="karte" style="text-align:center"><div class="ende-hero"><div class="note" style="color:var(--gruen)">✓</div>'+
      '<div class="big" style="font-size:1.35em;margin-top:6px">'+fLbl+'</div></div>'+
      '<div class="stat">Nicht fällige Karten kommen laut Leitner-Plan erst am nächsten Termin (1 / 3 / 7 Tage) — die Abstände zwischen den Wiederholungen sind genau der Lerneffekt.</div>'+
      '<button class="btn zweit" onclick="kartenRun(\'alle\')">Trotzdem weiterüben (alle Karten)</button>'+
      '<button class="btn" onclick="go(\'quiz\')">Weiter zum Quiz</button>'+
      '<button class="btn zweit" onclick="kSetFilter(null)">Gebiete-Auswahl</button></div>';
    confetti(45);
    return;
  }
  kStatus.cur = it;
  const stufeTxt = (it.k !== undefined) ? ' · Stufe '+kStatus.lev[it.k]+'/3' : '';
  let h = '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button>'+
    '<div class="minfo" style="margin:0">'+(fA!=='Alle gemischt'?esc(fA)+' · ':'')+fSitA+'/'+fTotA+' sitzen · '+(fTotA-fSitA)+' offen'+stufeTxt+'</div></div>';
  if (it.m !== undefined){
    h += '<div class="karte"><div class="farbe">Merkhilfe · Auffrischer</div>'+
      '<div class="merkkachel" style="font-size:1em">'+MerkHtml(d.merkhilfen[it.m])+'</div>'+
      '<button class="btn" onclick="karteEval(true)">'+svgIc('check')+' Weiter</button>'+
      '<button class="btn zweit klein" onclick="karteEvalSkip()">Überspringen</button></div>';
  } else {
    const k = d.karten[it.k];
    h += '<div class="karte"><div class="farbe r">'+esc(k.b)+'</div><div class="frage">'+k.q+'</div>'+
      '<div class="ruck" id="kflip">'+k.a+'</div>'+
      '<div class="split" id="kjudge" style="display:none"><button class="ja" onclick="karteEval(true)">✓ Wusst ich</button><button class="no" onclick="karteEval(false)">✗ Nochmal</button></div>'+
      '<button class="btn" id="kflipbtn" onclick="karteFlip()">Antwort zeigen</button>'+
      '<button class="btn zweit klein" onclick="karteEvalSkip()">Überspringen</button></div>';
  }
  sc.innerHTML = h;
  window.scrollTo(0,0);
}
function kStatusRo(){
  return { lev:kStatus.lev, due:kStatus.due, last:kStatus.last, tick:kStatus.tick };
}
function kartenRun(practice){
  if (!kStatus.lev) kartenInit();
  kStatus.gestartet = true;
  kStatus.practice = (practice==='alle');
  zeigeKartenStart();
}
function karteFlip(){
  const f = $('kflip'), j = $('kjudge'), b = $('kflipbtn');
  if (f) f.classList.add('zeigen');
  if (j) j.style.display='flex';
  if (b) b.style.display='none';
}
function kSetFilter(g){ kStatus.filter = g; kStatus.gestartet = false; zeigeKartenStart(); }
function nextItem(modus){
  const d = paketAktiv.data;
  const f = kStatus.filter || 'Alle gemischt';
  const pool = kartenPool(f);
  const mM = d.merkhilfen.map((x,i)=>((f==='Alle gemischt')||x.g===f||(x.g==='Allgemein'&&f==='Alle gemischt'))?i:-1).filter(i=>i>=0);
  if ((kStatus.shown + 1) % 8 === 0){
    const nxt = mM.find(gi=>gi>=kStatus.mseen);
    if (nxt !== undefined){ kStatus.shown++; kStatus.mseen = nxt+1; return {m:nxt}; }
  }
  kStatus.shown++;
  const t = tagNum();
  let best = -1, score = 1e18;
  for (const i of pool){
    if (modus!=='practice' && kStatus.lev[i] >= 3) continue;
    if (modus!=='practice' && kStatus.lev[i] < 3 && kStatus.due[i] > t) continue;
    const s = kStatus.lev[i]*1000 + kStatus.last[i];
    if (s < score){ score = s; best = i; }
  }
  if (best === -1){
    const ung = mM.filter(gi=>gi>=kStatus.mseen);
    if (ung.length){ kStatus.mseen = ung[0]+1; return {m:ung[0]}; }
    return null;
  }
  return {k:best};
}
function karteEval(ok){
  if (kStatus.cur && kStatus.cur.k !== undefined){
    const i = kStatus.cur.k;
    kStatus.last[i] = ++kStatus.tick;
    const t = tagNum();
    if (ok){ kStatus.lev[i] = Math.min(3, kStatus.lev[i]+1); kStatus.due[i] = t + LEITNER_TAGE[kStatus.lev[i]]; xpAdd(2); }
    else { kStatus.lev[i] = 1; kStatus.due[i] = t; xpAdd(1); }
    aktivHeute('karte');
  } else if (kStatus.cur && kStatus.cur.m !== undefined){ xpAdd(1); }
  progSet(paketAktiv.meta.id, kStatusRo());
  zeigeKartenStart();
}
function karteEvalSkip(){
  if (kStatus.cur && kStatus.cur.k !== undefined){ const i = kStatus.cur.k; kStatus.last[i] = ++kStatus.tick; }
  progSet(paketAktiv.meta.id, kStatusRo());
  zeigeKartenStart();
}
function kartenReset(){
  if (!confirm('Karten-Fortschritt für dieses Paket wirklich zurücksetzen?')) return;
  const d = paketAktiv.data;
  kStatus.lev = new Array(d.karten.length).fill(1);
  kStatus.due = new Array(d.karten.length).fill(0);
  kStatus.last = new Array(d.karten.length).fill(0);
  kStatus.mseen = 0; kStatus.shown = 0; kStatus.tick = 0;
  progSet(paketAktiv.meta.id, kStatusRo());
  zeigeKartenStart();
}
function MerkHtml(m){
  const t = (typeof m==='string') ? m : m.t;
  return t.replace(/&lt;b&gt;/g,'\u00a7B\u00a7').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\u00a7B\u00a7/g,'&lt;b&gt;');
}
function tagespackCheckToast(kind){
  const tp = tagespackState();
  if (tp.komplett) toast('🎉 Tagespack komplett — Streak für heute gesichert!');
}

/* ============================================================
   QUIZ — sofortiges Feedback + Erklärung + Fehlerrucksack
   ============================================================ */
let qStatus = {l:false};
function quizGebiete(){
  const d = paketAktiv.data;
  const gew = ['Atemschutz','Branddienst','Funk','Kraftbetriebene Geräte','Technik','Taktik'];
  return [...new Set(d.fragen.map(f=>f.m2))].sort((a,b)=>{
    const ia = gew.indexOf(a), ib = gew.indexOf(b);
    return (ia<0?99:ia) - (ib<0?99:ib);
  });
}
function quizStart(){
  const d = paketAktiv.data;
  const fr = d.fragen;
  const gebiete = quizGebiete();
  const nAll = fr.length;
  const katN = fr.filter(q=>!q.zusatz).length;
  const zusN = fr.filter(q=>q.zusatz).length;
  let h = '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button><h2 style="font-size:1.18em">Quiz</h2></div>';
  h += '<div class="karte"><div class="farbe">Womit anfangen?</div>'+
    '<button class="btn" onclick="quizBeginn(null)">'+svgIc('play2')+' Alles gemischt ('+nAll+' · '+katN+' Katalog + '+zusN+' Zusatz)</button>'+
    '<button class="btn zweit" onclick="quizBeginn(\'*KAT*\')">Nur Katalog-Fragen ('+katN+')</button>'+
    (rucksackN()>0 ? '<button class="btn gelb" onclick="quizRucksack()">'+svgIc('rucksack')+' Fehlerrucksack ('+rucksackN()+')</button>' : '')+
    '<div class="planhinweis" style="margin-top:12px">Gebiete — gemischt üben trainiert das Unterscheiden:</div>'+
    '<div class="pillrow">'+gebiete.map(g=>'<button class="pill" onclick="quizGebiet(\''+jsq(g)+'\')">'+esc(g)+' ('+fr.filter(q=>q.m2===g).length+')</button>').join('')+'</div>';
  const zusG = gebiete.filter(g=>fr.filter(q=>q.zusatz&&q.m2===g).length>0);
  if (zusG.length){
    h += '<div class="planhinweis" style="margin-top:12px">Zusatz-Stoff aus den Schulungsunterlagen (OÖLFS-Handzettel):</div><div class="pillrow">'+
      zusG.map(g=>'<button class="pill" onclick="quizGebietZus(\''+jsq(g)+'\')">'+esc(g)+' · Zusatz ('+fr.filter(q=>q.zusatz&&q.m2===g).length+')</button>').join('')+
      '<button class="pill" onclick="quizBeginn(\'*ZUS*\')">Alle Zusatz ('+zusN+')</button></div>';
  }
  const praxN = fr.filter(q=>q.m.startsWith('Praxis')).length;
  h += '<div class="planhinweis" style="margin-top:12px">Praxis-Aufgaben (Theorie-Teil der Praxisaufgaben):</div><div class="pillrow">'+
    '<button class="pill" onclick="quizBeginn(\'*PRAX*\')">Alle Praxis ('+praxN+')</button>'+
    gebiete.map(g=>{ const n=fr.filter(q=>q.m2===g&&q.m.startsWith('Praxis')).length; return n?('<button class="pill" onclick="quizBeginn(\'Praxis · '+jsq(g)+'\')">'+esc(g)+' (Praxis)</button>'):''; }).join('')+
    '</div></div>';
  $('scr-quiz').innerHTML = h;
}
function quizStartMit(idx, rucksackModus){
  qStatus = {l:true, idx:mix(idx), pos:0, punkte:0, rs:!!rucksackModus, multiGewertet:false};
  zeigeQuiz();
}
function quizGebiet(g){
  const pool = paketAktiv.data.fragen.map((_,i)=>i).filter(i=>paketAktiv.data.fragen[i].m2===g);
  quizStartMit(pool);
}
function quizGebietZus(g){
  const pool = paketAktiv.data.fragen.map((_,i)=>i).filter(i=>paketAktiv.data.fragen[i].m2===g && paketAktiv.data.fragen[i].zusatz);
  quizStartMit(pool);
}
function quizRucksack(){
  const rs = rucksackLaden();
  if (!rs.length){ toast('Fehlerrucksack ist leer — stark!'); return; }
  quizStartMit(rs.map(x=>x.i), true);
}
function quizBeginn(wahl){
  const fr = paketAktiv.data.fragen;
  let pool = fr.map((_,i)=>i);
  if (wahl===null){ }
  else if (wahl==='*KAT*') pool = pool.filter(i=>!fr[i].zusatz);
  else if (wahl==='*ZUS*') pool = pool.filter(i=>fr[i].zusatz);
  else if (wahl==='*PRAX*') pool = pool.filter(i=>fr[i].m.startsWith('Praxis'));
  else if (wahl.indexOf('Praxis · ')===0){ const g = wahl.slice(9); pool = pool.filter(i=>fr[i].m2===g && fr[i].m.startsWith('Praxis')); }
  else pool = pool.filter(i=>fr[i].m2===wahl);
  quizStartMit(pool);
}
const BUCHST = ['A','B','C','D','E','F'];
function zeigeQuiz(){
  qStatus.multiGewertet = false;
  const d = paketAktiv.data;
  const q = $('scr-quiz');
  if (qStatus.pos >= qStatus.idx.length){ quizEnde(); return; }
  const f = d.fragen[qStatus.idx[qStatus.pos]];
  q.innerHTML = '<div class="mod-head"><button class="mod-back" onclick="quizAbort()" aria-label="Zurück">'+svgIc('back')+'</button>'+
    '<div class="minfo" style="margin:0">Frage '+(qStatus.pos+1)+' von '+qStatus.idx.length+' · '+qStatus.punkte+' richtig'+(qStatus.rs?' · Fehlerrucksack':'')+'</div></div>'+
    '<div class="karte"><div class="farbe r">'+esc(f.src)+(f.zusatz?' · Zusatz':'')+'</div><div class="frage">'+f.f+'</div>'+
    f.opts.map((o,j)=>'<button class="opt" onclick="quizWaehl('+j+',this)"><span class="buchstabe">'+BUCHST[j]+'</span><span>'+o+'</span></button>').join('')+
    '<div class="ruck" id="qerkl">'+mdInline(f.e||'')+'</div>'+
    '<button class="btn klein" id="qweiter" style="display:none" onclick="quizWeiter()">Weiter '+svgIc('pfeil')+'</button></div>';
  window.scrollTo(0,0);
}
function quizWeiter(){
  const cur = paketAktiv.data.fragen[qStatus.idx[qStatus.pos]];
  if (Array.isArray(cur.r) && !qStatus.multiGewertet){
    qStatus.multiGewertet = true;
    const opts = $('scr-quiz').querySelectorAll('.opt');
    const gewaehlt = new Set();
    opts.forEach((b,j)=>{ if (b && b.classList.contains('mehrfach-gewaehlt')) gewaehlt.add(j); });
    const richtig = gewaehlt.size===cur.r.length && cur.r.every(x=>gewaehlt.has(x));
    opts.forEach((b,j)=>{
      if (!b) return;
      if (cur.r.includes(j)) b.classList.add('richtig');
      else if (gewaehlt.has(j)) b.classList.add('falsch');
      else b.classList.add('dim');
      b.disabled = true;
    });
    if (richtig){ qStatus.punkte++; xpAdd(3); if (qStatus.rs) rucksackRemove(qStatus.idx[qStatus.pos]); }
    else { xpAdd(1); rucksackAdd(qStatus.idx[qStatus.pos]); }
    const ex = $('qerkl'); if (ex) ex.classList.add('zeigen');
    const wb = $('qweiter'); if (wb){ wb.textContent = 'Weiter'; wb.style.display='flex'; }
    return; /* Wertung angezeigt — nächstes quizWeiter geht zur nächsten Frage */
  }
  qStatus.pos++; zeigeQuiz();
}
function quizWaehl(n, btn){
  const d = paketAktiv.data;
  const f = d.fragen[qStatus.idx[qStatus.pos]];
  const opts = $('scr-quiz').querySelectorAll('.opt');
  if (Array.isArray(f.r)){ /* Mehrfachantwort: Häkchen umschalten, Wertung erst über 'Fertig' */
    if (btn){
      btn.classList.toggle('mehrfach-gewaehlt');
      const bs = btn.querySelector('.buchstabe');
      if (bs) bs.textContent = btn.classList.contains('mehrfach-gewaehlt') ? '✓' : BUCHST[n];
    }
    const wb = $('qweiter');
    if (wb){ wb.style.display='flex'; wb.textContent = 'Fertig — auswerten'; }
    return;
  }
  opts.forEach(b=>{ if (b) b.disabled = true; });
  if (n===f.r){
    if (btn){ btn.classList.add('richtig'); const bs = btn.querySelector('.buchstabe'); if (bs) bs.textContent='✓'; }
    qStatus.punkte++; xpAdd(3);
    if (qStatus.rs) rucksackRemove(qStatus.idx[qStatus.pos]);
  } else {
    if (btn){ btn.classList.add('falsch'); const bs = btn.querySelector('.buchstabe'); if (bs) bs.textContent='✗'; }
    if (opts[f.r]){ opts[f.r].classList.add('richtig'); const bs = opts[f.r].querySelector('.buchstabe'); if (bs) bs.textContent='✓'; }
    opts.forEach(b=>{ b && b!==btn && !b.classList.contains('richtig') && b.classList.add('dim'); });
    xpAdd(1);
    rucksackAdd(qStatus.idx[qStatus.pos]);
  }
  const ex = $('qerkl'); if (ex) ex.classList.add('zeigen');
  const wb = $('qweiter'); if (wb) wb.style.display='flex';
  window.__t2 && clearTimeout(window.__t2);
  window.__t2 = setTimeout(()=>{ if (document.getElementById('qweiter')) quizWeiter(); }, 9000);
}
function quizAbort(){ window.__t2 && clearTimeout(window.__t2); qStatus.l=false; qStatus={l:false, multiGewertet:false}; go('quiz'); }
function quizEnde(){
  qStatus.l = false;
  const n = qStatus.idx.length;
  const p = n ? qStatus.punkte/n : 0;
  const farbe = p>=.9?'var(--gruen-stark)':(p>=.65?'var(--gelb)':'var(--rot)');
  const txt = p>=.9?'Prüfungsniveau!':(p>=.65?'Solide — einmal Test zum Festigen.':'Noch dünn — Karten + Merkhilfen, dann wieder.');
  xpAdd(p>=.9?10:(p>=.65?5:2));
  aktivHeute('quiz');
  if (p>=.999) badgeVergebe('quiz100');
  const rsN = rucksackN();
  let h = '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button><h2 style="font-size:1.18em">Quiz-Ergebnis</h2></div>'+
    '<div class="karte" style="text-align:center"><div class="ende-hero"><div class="note" style="color:'+farbe+'">'+qStatus.punkte+'/'+n+'</div></div>'+
    '<div class="stat">'+txt+'</div>';
  if (qStatus.rs && qStatus.punkte===n){ h += '<div class="merkkachel" style="margin-top:10px">🎒 <b>Fehlerrucksack komplett abgearbeitet!</b> Diese Fragen saßen beim zweiten Anlauf.</div>'; badgeVergebe('rucksack0'); }
  h += '<button class="btn" onclick="quizStart();quizBeginn(null)">Neue Mischung</button>';
  if (rsN>0) h += '<button class="btn gelb" onclick="quizRucksack()">'+svgIc('rucksack')+' Fehlerrucksack weiter ('+rsN+')</button>';
  h += '<button class="btn zweit" onclick="go(\'test\')">Zum Test</button>'+
    '<button class="btn zweit" onclick="go(\'dash\')">Zum Überblick</button></div>';
  $('scr-quiz').innerHTML = h;
  if (p>=.9) confetti(90);
}
function badgeVergebe(id){
  const hab = badgesGet();
  if (!hab.includes(id)){
    hab.push(id); try{ localStorage.setItem('fw_badges', JSON.stringify(hab)); }catch(e){}
    const b = BADGES.find(x=>x.id===id);
    if (b) toast(b.ic+' Abzeichen verdient: '+b.name);
  }
}

/* ============================================================
   TEST — Prüfungssimulation nach Prüfungsordnung
   ============================================================ */
let tStatus = {l:false};
const NOTE = (p) => p>=92?1:p>=81?2:p>=67?3:p>=50?4:p>=30?5:6;
function poModulListe(){
  const fr = paketAktiv && paketAktiv.data ? paketAktiv.data.fragen : [];
  if (!fr.length) return [];
  /* Prüfungstag-Module dynamisch aus dem Paket: je Modul (m-Feld) ausreichend Katalog-Fragen (ohne Praxis/Zusatz) */
  const zaehl = new Map();
  fr.forEach(q=>{ if (!q.zusatz && !String(q.m||'').startsWith('Praxis')) zaehl.set(q.m, (zaehl.get(q.m)||0)+1); });
  const kandidaten = [...zaehl.entries()].filter(([m,n])=>n>=5).map(([m])=>m);
  if (kandidaten.length>=3) return kandidaten.slice(0,8);
  /* Fallback: m2-Gruppen */
  const zaehl2 = new Map();
  fr.forEach(q=>{ if (!q.zusatz) zaehl2.set(q.m2, (zaehl2.get(q.m2)||0)+1); });
  return [...zaehl2.entries()].filter(([m,n])=>n>=5).map(([m])=>m).slice(0,8);
}
function buildPruefungTag(){
  const fr = paketAktiv.data.fragen;
  const theoIdx = fr.map((q,i)=>i).filter(i=>!fr[i].m.startsWith('Praxis') && !fr[i].zusatz);
  const by = mm => theoIdx.filter(i=>fr[i].m===mm);
  const pick = (arr,n) => mix(arr).slice(0, Math.min(n, arr.length));
  const pool = [];
  poModulListe().forEach(mm => pick(by(mm),5).forEach(i=>pool.push(i)));
  pool.push(...pick(by('Taktik'),5));
  pool.push(...pick(by('Gefahrenlehre').concat(by('Schadstoffeinsatz')),5));
  return pool;
}
function testStart(){
  let h = '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button><h2 style="font-size:1.18em">Prüfungssimulation</h2></div>'+
    '<div class="karte"><div class="farbe r">Test · unter echten Bedingungen</div><div class="frage" style="margin-bottom:4px">Welcher Modus?</div>'+
    '<div class="stat" style="margin-bottom:12px">Zwei Wege — wie am echten Prüfungstag oder locker gemischt zum Üben.</div>'+
    '<button class="btn" onclick="testLauf(1)">'+svgIc('test')+' Prüfungstag — 35 Fragen, 25 Min</button>'+
    '<div class="planhinweis" style="margin:4px 0 12px">5 Fragen je Modul + 10 Taktik-Kombi, Bestehens-Prognose je Modul (3 von 5 = bestanden) — laut Prüfungsordnung v03.</div>'+
    '<button class="btn gelb" onclick="testLauf(2)">'+svgIc('play2')+' Übungs-Mix — 30 Fragen, 15 Min</button>'+
    '<div class="planhinweis" style="margin:4px 0 0">Nur Katalog-Fragen locker gemischt (ohne Zusatz-Stoff). Bestwert wird gespeichert.</div></div>';
  const best = testBest();
  if (best) h += '<div class="karte"><div class="farbe">Dein Bestwert (Übungs-Mix)</div><div class="stat">Note '+best.note+' · '+best.pct+' %</div></div>';
  $('scr-test').innerHTML = h;
}
function testLauf(modus){
  const fr = paketAktiv.data.fragen;
  const katIdx = fr.map((_,i)=>i).filter(i=>!fr[i].zusatz && typeof fr[i].r==='number');
  let idx;
  if (modus===2){ idx = mix(katIdx).slice(0,30); }
  else { idx = mix(buildPruefungTag()).filter(i=>typeof fr[i].r==='number'); }
  if (!idx.length){ /* Fallback: kein passender Pool → nur Übungs-Mix */ idx = mix(katIdx).slice(0,30); tStatus = {l:true, modus:2, idx, pos:0, Antw:[], rest:900, tick:null}; zeigeTest(); tStatus.tick = window.setInterval(testTick, 1000); toast('Prüfungstag-Format braucht Modul-Struktur — Übungs-Mix gestartet.'); return; }
  const dauer = modus===2 ? 900 : 1500;
  tStatus = {l:true, modus, idx, pos:0, Antw:[], rest:dauer, tick:null};
  zeigeTest();
  tStatus.tick = window.setInterval(testTick, 1000);
}
function testTick(){
  tStatus.rest--;
  const t = $('tmr');
  if (t){ t.textContent = Math.floor(tStatus.rest/60)+':'+String(tStatus.rest%60).padStart(2,'0');
    if (tStatus.rest<=60) t.classList.add('bald'); }
  if (tStatus.rest<=0){ clearInterval(tStatus.tick); testAusw(); }
}
function zeigeTest(){
  const fr = paketAktiv.data.fragen;
  const t = $('scr-test');
  if (tStatus.pos >= tStatus.idx.length){ clearInterval(tStatus.tick); testAusw(); return; }
  const f = fr[tStatus.idx[tStatus.pos]];
  const punkte = tStatus.idx.map((fi,j)=>'<div class="p'+(j<tStatus.pos?' angeklickt':'')+(j===tStatus.pos?' jetzt':'')+'"></div>').join('');
  t.innerHTML = '<div class="karte"><div class="minfo" style="justify-content:space-between">'+
    '<span>Frage '+(tStatus.pos+1)+' von '+tStatus.idx.length+'</span>'+
    '<span class="timer" id="tmr">'+Math.floor(tStatus.rest/60)+':'+String(tStatus.rest%60).padStart(2,'0')+'</span></div>'+
    '<div class="punkte">'+punkte+'</div>'+
    '<div class="farbe r">'+esc(f.src)+'</div><div class="frage">'+f.f+'</div>'+
    f.opts.map((o,j)=>'<button class="opt" onclick="testWaehl('+j+')"><span class="buchstabe">'+BUCHST[j]+'</span><span>'+o+'</span></button>').join('')+
    '</div>';
  if (tStatus.rest<=60){ const tmr=$('tmr'); if (tmr) tmr.classList.add('bald'); }
  window.scrollTo(0,0);
}
function testWaehl(n){
  tStatus.Antw[tStatus.pos] = n;
  tStatus.pos++;
  if (tStatus.pos >= tStatus.idx.length){ clearInterval(tStatus.tick); testAusw(); return; }
  zeigeTest();
}
function testAusw(){
  if (tStatus.tick) clearInterval(tStatus.tick);
  tStatus.l = false;
  const fr = paketAktiv.data.fragen;
  let richtig = 0; const fehler = [];
  const pruef = (tStatus.modus !== 2);
  tStatus.idx.forEach((fi,pos)=>{
    const f = fr[fi];
    if (tStatus.Antw[pos]===f.r) richtig++;
    else { const de=(tStatus.Antw[pos]===undefined||tStatus.Antw[pos]===null)?'nicht beantwortet':f.opts[tStatus.Antw[pos]];
      fehler.push({f:f.f, src:f.src, deine:de, r:f.opts[f.r], e:f.e});
      rucksackAdd(fi); }
  });
  const pct = tStatus.idx.length ? Math.round(richtig/tStatus.idx.length*100) : 0;
  const note = NOTE(pct);
  xpAdd(pct>=80?25:(pct>=60?15:8));
  aktivHeute('test');
  let prognose = '';
  if (pruef){
    let pr = '<details class="box" open><summary>Prognose je Modul (3 von 5 = bestanden)</summary><div class="innen stat" style="text-align:left">';
    const rows = poModulListe().map(mm => {
      const qs = tStatus.idx.map((fi,pos)=>({fi,pos})).filter(x=>fr[x.fi].m===mm);
      let ok=0; qs.forEach(x=>{ if(tStatus.Antw[x.pos]===fr[x.fi].r) ok++; });
      return {mm, ok, n:qs.length};
    });
    rows.forEach(rw => { pr += esc(rw.mm)+': <b style="color:'+(rw.ok>=3?'var(--gruen-stark)':'var(--rot)')+'">'+rw.ok+'/'+rw.n+'</b> — '+(rw.ok>=3?'bestanden ✓':'nicht bestanden ✗')+'<br>'; });
    const tk = tStatus.idx.map((fi,pos)=>({fi,pos})).filter(x=>['Taktik','Gefahrenlehre','Schadstoffeinsatz'].includes(fr[x.fi].m));
    if (tk.length){ let okT=0; tk.forEach(x=>{ if(tStatus.Antw[x.pos]===fr[x.fi].r) okT++; });
      pr += 'Taktik-Kombi: <b style="color:'+(okT>=6?'var(--gruen-stark)':'var(--rot)')+'">'+okT+'/'+tk.length+'</b> — '+(okT>=6?'bestanden ✓ (6/10 nötig)':'nicht bestanden ✗')+'<br>'; }
    pr += '<span class="planhinweis">Schwache Module gezielt nachholen: im Quiz das Gebiet wählen — Taktik-Fehler im Taktik-Gebiet (inkl. Gefahrenlehre + Schadstoffe).</span></div></details>';
    prognose = pr;
  } else {
    const best = testBest();
    if (!best || best.note>note || (best.note===note && pct>best.pct)){
      try{ localStorage.setItem('fw_best_'+paketAktiv.meta.id, JSON.stringify({note,pct})); }catch(e){}
    }
  }
  const farbe = note<=2?'var(--gruen-stark)':(note===3?'var(--gelb)':'var(--rot)');
  const cmt = note===1?'Stark! So gehst du in die Prüfung.':(note===2?'Gut drin — noch eine Runde.':(note===3?'Solide Basis.':(note===4?'Merkhilfen + Karten nochmal.':'Üben, üben — dafür ist der Trainer da.')));
  const fehlerH = fehler.length ? '<div style="text-align:left;margin-top:12px">'+fehler.map(x=>
    '<div class="fehler-row"><div class="farbe r" style="margin-bottom:6px">'+esc(x.src)+'</div><b>'+x.f+'</b><br>'+
    'Deine Antwort: '+esc(x.deine)+'<br>✅ Richtig: <b>'+esc(x.r)+'</b><br><span class="stat">'+mdInline(x.e)+'</span></div>').join('')+'</div>'
    : '<div class="stat" style="text-align:center;margin-top:8px">Keine Fehler — sauber! 🎖️</div>';
  const hint = fehler.length ? '<div class="merkkachel" style="margin:12px 0">🎒 Die '+fehler.length+' falschen '+(fehler.length===1?'Frage ist':'Fragen sind')+' automatisch in den <b>Fehlerrucksack</b> gewandert — gezielt nachholen, bis sie sitzen.</div>' : '';
  $('scr-test').innerHTML =
    '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button><h2 style="font-size:1.18em">Test-Auswertung</h2></div>'+
    '<div class="karte" style="text-align:center"><div class="ende-hero"><div class="note" style="color:'+farbe+'">'+note+'</div>'+
    '<div class="stat">'+richtig+' von '+tStatus.idx.length+' richtig · '+pct+' %</div><div class="stat">'+cmt+'</div></div>'+
    prognose + hint + fehlerH +
    '<button class="btn" onclick="testStart()">Neuer Durchlauf</button>'+
    '<button class="btn gelb" onclick="quizRucksack()">'+svgIc('rucksack')+' Fehlerrucksack abfragen</button>'+
    '<button class="btn zweit" onclick="go(\'dash\')">Zum Überblick</button></div>';
  if (note===1) badgeVergebe('note1');
  if (pct>=90) confetti(120);
}

/* ============================================================
   KATALOG — komplett durchsuchbar
   ============================================================ */
function initKatalog(){
  const kh = paketAktiv.data.katalog_html || '';
  $('scr-katalog').innerHTML =
    '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button><h2 style="font-size:1.18em">Kompletter Katalog</h2></div>'+
    '<div class="karte"><div class="farbe r">Alles zum Nachlesen</div>'+
    '<input class="suche" id="zsearch" placeholder="Suchen … (z. B. Greifzug, Mayday, 3-2-7)" oninput="zSearch(this.value)">'+
    '<div class="planhinweis">Durchsucht den ganzen Katalog — Merkhilfen, alle Fragen und Aufgaben.</div>'+
    '<div id="zcontent2" class="zcontent">'+mdInline(kh)+'</div></div>';
}
function zSearch(v){
  const c = $('zcontent2');
  if (!v || v.length<2){ c.innerHTML = mdInline(paketAktiv.data.katalog_html); return; }
  const lv = v.toLowerCase();
  const raw = paketAktiv.data.katalog_html;
  const parts = raw.split(/(?=<div class="(?:merkkachel|zmod|zq|figs)">)/);
  let out = '', hits = 0;
  for (let i=0;i<parts.length;i++){
    const b = parts[i];
    if (b.toLowerCase().replace(/<[^>]+>/g,' ').indexOf(lv) !== -1){ out += mdInline(b); hits++; }
    if (hits>=60) break;
  }
  c.innerHTML = hits ? out : '<div class="stat">Nichts gefunden.</div>';
}

/* ============================================================
   UNTERLAGEN — offizielle OÖLFS-PDFs
   ============================================================ */
function initUnlagen(){
  const d = paketAktiv.data;
  const base = (d.unterlagen_base!==undefined && d.unterlagen_base!==null) ? d.unterlagen_base : 'https://wiki.feuerwehr-walding.at/lib/exe/fetch.php?media=';
  let h = '<div class="mod-head"><button class="mod-back" onclick="go(\'dash\')" aria-label="Zurück">'+svgIc('back')+'</button><h2 style="font-size:1.18em">Unterlagen</h2></div>'+
    '<div class="karte"><div class="farbe">Offizielle OÖLFS-Schulungs-PDFs</div>'+
    '<div class="frage">Handzettel + Präsentationen zu den Modulen (Quelle: Oö. Landes-Feuerwehrschule).</div>'+
    '<div class="merkkachel" style="margin-top:10px">📡 <b>Internet nötig.</b> Quelle ist die Feuerwehr-Wissensbasis (wiki.feuerwehr-walding.at). Karten, Quiz und Katalog funktionieren auch offline weiter.</div>';
  for (const g of Object.keys(d.unterlagen)){
    h += '<div class="planhinweis" style="margin-top:14px">'+esc(g)+'</div>';
    h += d.unterlagen[g].map(x=>'<a class="uni" href="'+base+esc(x[2])+'" target="_blank" rel="noopener">'+svgIc('doc')+'<span>'+esc(x[0])+'</span><span class="uni-badge">PDF</span></a>').join('');
  }
  h += '</div>';
  $('scr-unlagen').innerHTML = h;
}

/* ============================================================
   CONFETTI
   ============================================================ */
function confetti(n){
  const c = $('confetti-canvas'); if (!c) return;
  const ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const farben = ['#cf4025','#ffdd64','#e40521','#394348','#2e7d43','#ff6600'];
  const teile = [];
  for (let i=0;i<(n||80);i++) teile.push({
    x: innerWidth/2 + (Math.random()-0.5)*220, y: innerHeight*0.35,
    vx: (Math.random()-0.5)*11, vy: -(Math.random()*13+5),
    s: Math.random()*6+3, f: farben[i%farben.length], r: Math.random()*Math.PI, vr:(Math.random()-.5)*.3
  });
  let rahmen = 0;
  (function anim(){
    ctx.clearRect(0,0,c.width,c.height);
    teile.forEach(p=>{
      p.vy += .32; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.f; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6); ctx.restore();
    });
    rahmen++;
    if (rahmen < 110) requestAnimationFrame(anim);
    else ctx.clearRect(0,0,c.width,c.height);
  })();
}

/* ---------- Boot ---------- */
window.addEventListener('load', boot);
/* Mobile Nav: bei Resize neu rendern (Punkt-Anzahl hängt von Breite ab) */
window.addEventListener('resize', function(){ renderNavi(); });