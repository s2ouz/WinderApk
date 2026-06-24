/* ═══════════════════════════════════════════════════════════════════
   MATCHWORK — app.js  (vanilla JS SPA, hash routing)
   ═══════════════════════════════════════════════════════════════════ */

/* ─── STATE ──────────────────────────────────────────────────────── */
const state = {
  selectedResult: "",
  rating: 0,
  onboarding: {
    userType: null,
    categories: [],
    distance: 5,
    workTypes: ["Yarı zamanlı"],
    minSalary: 550,
    name: "",
    phone: "",
  },
  register: {
    phone: "",
    firstname: "",
    lastname: "",
    skills: [],
    city: "İstanbul",
    district: "Kadıköy",
    otpVerified: false,
  },
  messages: [
    { from:"business", text:"Merhaba Selin, profilini inceledik. Hafta sonu vardiyası için görüşmek ister misin?", time:"14:08" },
    { from:"me",       text:"Merhaba, uygunum. Vardiya saatleri nasıl olacak?", time:"14:10" },
    { from:"business", text:"Cumartesi ve pazar 10:00-18:00. Kısa bir görüntülü görüşme planlayalım.", time:"14:12" }
  ],
  swipe: {
    deckIndex:0, likedIds:[], skippedIds:[],
    lastAction:null, deckFilter:"Tümü",
    isDragging:false, startX:0, startY:0,
    currentDeltaX:0, currentDeltaY:0,
    thresholdReached:false, directionLocked:null,
    activeCard:null,
  },
  detailJobId: 1,
  detailSource: "home",
  matchesTab: 0,
  selectedPin: null,
  sheetExpanded: false,
  dirMode: "walk",
  chatMatchId: null,
  chatMatch: null,
  chatMessages: [],
  chatTyping: false,
  matchesList: [],
  notifications: [],
  activeInterview: null,
  notifPrefs: { match:true, message:true, interview:true, email:true, promo:false },
  prefTypes: ["Yarı zamanlı","Tam zamanlı"],
  prefRadius: "5 km",
  pfWorkStyles: ["flexible","evening","teamwork"],
  pfInterests: ["Yeme-İçme","Perakende","Hizmet"],
  nfTab: 0,
  navDir:   null,
  navStack: [],
  discovery: {
    weekStart:           null,
    weekViewed:          0,
    weekLiked:           0,
    weekActivity:        [0,0,0,0,0,0,0],
    streakDays:          0,
    streakLastDate:      null,
    milestones:          [],
    viewedIds:           [],
    shownEncouragements: [],
    sessionSwiped:       0,
  },
};

/* ─── DATA ───────────────────────────────────────────────────────── */
let _apiJobsLoaded = false;

const user = {
  name:"Selin Kaya", short:"Selin", initials:"SK",
  role:"Barista · Satış Danışmanı", location:"Kadıköy, İstanbul",
  matchScore:72, responseRate:"92%", rating:4.8,
  verified:true, experience:"3 yıl",
  availability:"Hafta sonu & Hafta içi akşam",
  skills:["Kahve hazırlama","Kasa kullanımı","Müşteri iletişimi","Ekip çalışması","Ürün bilgisi"],
  certs:["Barista Sertifikası","Gıda Hijyeni"],
};

let jobs = [
  { id:1, title:"Barista", company:"Cafe Lumiere", initials:"CL",
    sal:{ min:520, max:580, cur:"₺", per:"gün" },
    distance:1.2, travel:{ walk:15, bus:6, car:4 },
    matchScore:92, type:"Yarı zamanlı", pin:{ x:48, y:50, tier:"high" },
    desc:"Sahil kenarında sakin ve modern bir kafe. Hafta sonu vardiyası, yemek dahil. Deneyimsiz adaylara açık, ekibimiz size her şeyi öğretir.",
    req:["İletişim becerileri","Ekip çalışması","Esnek saat"],
    benefits:["Yemek ikramı","Servis ikramı","Prim sistemi"],
    schedule:"Cumartesi–Pazar 10:00–18:00",
    tags:["Hafta sonu","Yemek dahil","Prim"],
    hue:"108,78,255" },

  { id:2, title:"Garson", company:"Beyaz Masa", initials:"BM",
    sal:{ min:480, max:560, cur:"₺", per:"gün" },
    distance:0.8, travel:{ walk:10, bus:4, car:3 },
    matchScore:85, type:"Tam zamanlı", pin:{ x:62, y:38, tier:"high" },
    desc:"Şehrin kalbinde köklü bir restoran. Tecrübeli bir ekiple çalışma fırsatı. Düzenli müşteri kitlesi, sakin çalışma ortamı.",
    req:["Güler yüz","Dikkatli","Fiziksel dayanıklılık"],
    benefits:["Yemek ikramı","Ulaşım desteği"],
    schedule:"Hafta içi 11:00–20:00",
    tags:["Tam zamanlı","Ulaşım"],
    hue:"34,197,94" },

  { id:3, title:"Kurye", company:"HızlıGit", initials:"HG",
    sal:{ min:600, max:700, cur:"₺", per:"gün" },
    distance:2.1, travel:{ walk:25, bus:9, car:6 },
    matchScore:78, type:"Serbest", pin:{ x:35, y:45, tier:"mid" },
    desc:"Esnek saatler ve yüksek kazanç. Kendi hızınızda çalışın. Bisiklet veya motorsikletle teslimat yapabilirsiniz.",
    req:["Sürücü belgesi (isteğe bağlı)","Fiziksel form","Telefon"],
    benefits:["Esnek saat","Yakıt desteği","Hızlı ödeme"],
    schedule:"Esnek — haftanın 7 günü",
    tags:["Esnek","Yüksek kazanç","Serbest"],
    hue:"245,158,11" },

  { id:4, title:"Kasa Görevlisi", company:"Teknomarket", initials:"TM",
    sal:{ min:490, max:540, cur:"₺", per:"gün" },
    distance:1.8, travel:{ walk:22, bus:8, car:5 },
    matchScore:80, type:"Yarı zamanlı", pin:{ x:55, y:65, tier:"mid" },
    desc:"Büyük bir teknoloji perakende zinciri. Kasa ve iade işlemlerine yardım. Teknolojiyle iç içe bir iş ortamı.",
    req:["Kasa deneyimi","Dikkatli sayım","Müşteri odaklılık"],
    benefits:["Çalışan indirimi","SGK","Yemek kartı"],
    schedule:"Haftaiçi 14:00–20:00",
    tags:["SGK","İndirim","Hafta içi"],
    hue:"239,68,68" },

  { id:5, title:"Güvenlik Görevlisi", company:"SafeGuard", initials:"SG",
    sal:{ min:550, max:620, cur:"₺", per:"gün" },
    distance:3.4, travel:{ walk:40, bus:14, car:8 },
    matchScore:75, type:"Tam zamanlı", pin:{ x:72, y:55, tier:"mid" },
    desc:"AVM güvenlik ekibi. Güvenli ve sakin iş ortamı. Düzenli mola ve yemek aralıkları.",
    req:["Güvenlik belgesi (yoksa verilebilir)","Dikkat","Soğukkanlılık"],
    benefits:["SGK","Yemek","Üniforma"],
    schedule:"Gece/Gündüz vardiyalı",
    tags:["SGK","Vardiyalı","Üniforma"],
    hue:"139,92,255" },

  { id:6, title:"Satış Temsilcisi", company:"ModaPlus", initials:"MP",
    sal:{ min:500, max:650, cur:"₺", per:"gün" },
    distance:1.5, travel:{ walk:18, bus:7, car:4 },
    matchScore:88, type:"Yarı zamanlı", pin:{ x:40, y:30, tier:"high" },
    desc:"Kadıköy'ün en popüler giyim mağazalarından biri. Prim sistemiyle yüksek kazanç imkânı. Genç ve dinamik ekip.",
    req:["Satış yeteneği","Stil bilgisi","Müşteri iletişimi"],
    benefits:["Prim","Çalışan indirimi","Esnek saat"],
    schedule:"Cumartesi–Pazar 11:00–19:00",
    tags:["Prim","Moda","Hafta sonu"],
    hue:"34,197,94" },

  { id:7, title:"Aşçı Yardımcısı", company:"Lezzet Durağı", initials:"LD",
    sal:{ min:460, max:520, cur:"₺", per:"gün" },
    distance:2.8, travel:{ walk:34, bus:12, car:7 },
    matchScore:72, type:"Tam zamanlı", pin:{ x:58, y:35, tier:"mid" },
    desc:"Aile işletmesi, ev yemeği tarzı restoran. Mutfakta temel hazırlık ve temizlik işleri. Sıcak çalışma ortamı.",
    req:["Temel mutfak bilgisi","Hijyen sertifikası (isteğe bağlı)","Fiziksel dayanıklılık"],
    benefits:["Öğle yemeği","Ulaşım desteği"],
    schedule:"Hafta içi 08:00–16:00",
    tags:["Öğle yemeği","Haftaiçi","Tam zamanlı"],
    hue:"245,158,11" },

  { id:8, title:"Çağrı Merkezi Temsilcisi", company:"NetCall", initials:"NC",
    sal:{ min:480, max:580, cur:"₺", per:"gün" },
    distance:1.1, travel:{ walk:13, bus:5, car:3 },
    matchScore:82, type:"Yarı zamanlı", pin:{ x:25, y:62, tier:"high" },
    desc:"Modern ofis ortamında müşteri hizmetleri. Uzaktan çalışma seçeneği de mevcut. Hızlı kariyer ilerleme fırsatı.",
    req:["İyi iletişim","Bilgisayar kullanımı","Sabır"],
    benefits:["SGK","Uzaktan çalışma","Prim"],
    schedule:"Esnek — 09:00–21:00 arası",
    tags:["SGK","Uzaktan","Prim"],
    hue:"108,78,255" },
];

const matchItems = [
  [
    { initials:"CL", name:"Cafe Lumiere",      role:"Barista",               time:"Şimdi",   preview:"Tebrikler! Profilin ilgimizi çekti ✦", unread:2, dot:"dot-new" },
    { initials:"MP", name:"ModaPlus",           role:"Satış Temsilcisi",      time:"2 dk",    preview:"Merhaba, müsait misiniz?", unread:1, dot:"dot-new" },
    { initials:"NC", name:"NetCall",            role:"Çağrı Mrk. Temsilcisi", time:"15 dk",   preview:"Profilinizi inceledik...", unread:0, dot:"dot-new" },
  ],
  [
    { initials:"BM", name:"Beyaz Masa",         role:"Garson",                time:"Dün",     preview:"Yarın 14:00 müsait misiniz?", unread:1, dot:"dot-active" },
    { initials:"SG", name:"SafeGuard",          role:"Güvenlik Görevlisi",    time:"2 gün",   preview:"Belgeleri ilettiniz mi?", unread:0, dot:"dot-active" },
  ],
  [
    { initials:"TM", name:"Teknomarket",        role:"Kasa Görevlisi",        time:"17 Haz",  preview:"Görüşme 17 Haz 14:00 onaylandı", unread:0, dot:"dot-interview" },
  ],
  [
    { initials:"LD", name:"Lezzet Durağı",      role:"Aşçı Yardımcısı",      time:"10 Haz",  preview:"İşe başlama tarihin 20 Haziran", unread:0, dot:"dot-hired" },
  ],
];
const matchTabLabels = ["Yeni Eşleşme","Aktif Konuşma","Görüşme","İşe Alındı"];
const matchTabCounts = matchItems.map(t => t.length);

/* ─── MATCH CENTER DATA ──────────────────────────────────────────── */
const MC_MATCHES = [
  {id:"m1",initials:"CL",name:"Cafe Lumiere",   role:"Barista",              jobId:1,
   stage:"new",       time:"Şimdi",  preview:"Tebrikler! Profilin ilgimizi çekti ✦",
   unread:2,score:92,dist:1.2,hue:"108,78,255"},
  {id:"m2",initials:"MP",name:"ModaPlus",        role:"Satış Temsilcisi",     jobId:4,
   stage:"new",       time:"2 dk",   preview:"Merhaba, seninle görüşmek isteriz.",
   unread:1,score:80,dist:1.8,hue:"34,197,94"},
  {id:"m3",initials:"NC",name:"NetCall",          role:"Çağrı Mrk. Tmslcsi",  jobId:null,
   stage:"new",       time:"15 dk",  preview:"Profilinizi inceledik, ilgileniyoruz.",
   unread:0,score:75,dist:2.3,hue:"245,158,11"},
  {id:"m4",initials:"BM",name:"Beyaz Masa",      role:"Garson",               jobId:2,
   stage:"chatting",  time:"Dün",    preview:"Yarın 14:00 müsait misiniz? Kısa bir görüşme.",
   unread:1,score:85,dist:0.8,hue:"34,197,94"},
  {id:"m5",initials:"SG",name:"SafeGuard",       role:"Güvenlik Görevlisi",   jobId:5,
   stage:"chatting",  time:"2 gün",  preview:"Belgeleri gönderdiyseniz haberdar edin.",
   unread:0,score:75,dist:3.4,hue:"239,68,68"},
  {id:"m6",initials:"TM",name:"Teknomarket",     role:"Kasa Görevlisi",       jobId:4,
   stage:"interview", time:"17 Haz", preview:"Video görüşmen 17 Haz 14:00'da başlıyor.",
   unread:0,score:80,dist:1.8,hue:"239,68,68",
   interview:{date:"17 Haziran",time:"14:00",type:"Video Görüşme"}},
  {id:"m7",initials:"LD",name:"Lezzet Durağı",  role:"Aşçı Yardımcısı",     jobId:null,
   stage:"hired",     time:"10 Haz", preview:"İşe başlama tarihin 20 Haziran!",
   unread:0,score:88,dist:1.1,hue:"34,197,94"},
];

const MC_SAVED = [
  {jobId:3,initials:"HG",name:"HızlıGit",   role:"Kurye",          savedAt:"3 gün",score:78,dist:2.1,type:"Serbest",     hue:"245,158,11"},
  {jobId:4,initials:"TM",name:"Teknomarket", role:"Kasa Görevlisi", savedAt:"1 gün",score:80,dist:1.8,type:"Yarı zamanlı",hue:"239,68,68"},
];

const MC_RECOS = [
  "Hızlı yanıt verenler 3× daha fazla görüşme alıyor — şimdi mesaj gönder!",
  "Bu şirketler genellikle 24 saat içinde yanıt veriyor, devam et.",
  "Görüşme öncesi şirket profilini bir kez daha incelemeyi unutma.",
  "🎉 Harika gidiyorsun! Sürecin doğru ilerliyor.",
  "Kaydettiğin ilanlar dolmadan harekete geç.",
];

/* ─── ROUTING ────────────────────────────────────────────────────── */
const navItems = [
  ["home",     "ti-home",           "Ana Sayfa"],
  ["nearby",   "ti-map-pin",        "Yakında"],
  ["matches",  "ti-sparkles",       "Eşleşmeler"],
  ["messages", "ti-message-circle", "Mesajlar"],
  ["profile",  "ti-user",           "Profil"],
];
const navRoutes = navItems.map(n => n[0]);

function currentRoute() {
  return location.hash.replace(/^#\/?/, "") || "auth";
}
function go(route) {
  const cur = currentRoute();
  if (cur === route) return;
  const tabSet = new Set(navRoutes);
  if (tabSet.has(cur) && tabSet.has(route)) {
    const ci = navRoutes.indexOf(cur), ni = navRoutes.indexOf(route);
    state.navDir = ni > ci ? "right" : "left";
  } else if (!tabSet.has(route)) {
    state.navDir = "up";
  } else {
    state.navDir = "fade";
  }
  mlBounceNavIcon(route);
  location.hash = route;
}

function triggerHaptic(pattern) {
  navigator.vibrate?.(pattern);
}

function mlBounceNavIcon(route) {
  const btn = document.querySelector(`.nav-item[onclick="go('${route}')"]`);
  if (!btn) return;
  const ico = btn.querySelector("i");
  if (!ico) return;
  ico.style.animation = "none";
  requestAnimationFrame(() => {
    ico.style.animation = "";
    btn.classList.remove("ml-bounce");
    requestAnimationFrame(() => btn.classList.add("ml-bounce"));
  });
  setTimeout(() => btn.classList.remove("ml-bounce"), 500);
}

function mlParticles(originEl, color = "#6C4EFF", count = 8) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const container = document.body;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "ml-particle";
    const angle = (i / count) * Math.PI * 2;
    const dist = 40 + Math.random() * 40;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist - 20;
    const dur = (.5 + Math.random() * .3).toFixed(2);
    const delay = (Math.random() * .12).toFixed(2);
    p.style.cssText = `left:${cx - 4}px;top:${cy - 4}px;background:${color};` +
      `--ml-px:${px.toFixed(0)}px;--ml-py:${py.toFixed(0)}px;--ml-dur:${dur}s;--ml-delay:${delay}s;z-index:9999;`;
    container.appendChild(p);
    setTimeout(() => p.remove(), (parseFloat(dur) + parseFloat(delay)) * 1000 + 50);
  }
}

/* ─── HELPERS ────────────────────────────────────────────────────── */
function icon(cls) { return `<i class="${cls}" aria-hidden="true"></i>`; }

function screen(content, nav = "") {
  return `<section class="screen">${content}</section>${nav}`;
}

function topbar(title, backRoute, action = "") {
  const back = backRoute
    ? `<button class="topbar-action" onclick="go('${backRoute}')" aria-label="Geri">${icon("ti-arrow-left")}</button>`
    : "";
  return `<header class="topbar">${back}<h1 class="topbar-title">${title}</h1>${action}</header>`;
}

function bottomNav(active) {
  return `<nav class="bottom-nav" aria-label="Gezinti">
    <div class="sidebar-brand">
      <div class="sidebar-brand-mark">✦</div>
      <span class="sidebar-brand-text">Matchwork</span>
    </div>
    ${navItems.map(([route, ic, label]) => `
      <button class="nav-item${active === route ? " active" : ""}" onclick="go('${route}')" aria-label="${label}">
        ${icon(ic)}<span>${label}</span>
      </button>`).join("")}
  </nav>`;
}

function scorePillClass(s) { return s >= 85 ? "score-high" : s >= 70 ? "score-mid" : "score-low"; }
function pinTier(s) { return s >= 85 ? "pin-high" : s >= 70 ? "pin-mid" : "pin-low"; }
function scoreColor(s) { return s >= 85 ? "var(--success)" : s >= 70 ? "var(--primary)" : "var(--pin-low)"; }

function svgRing(score, r, sw, fgColor, bgColor = "rgba(255,255,255,.15)") {
  const c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  return `<svg viewBox="0 0 ${(r+sw)*2} ${(r+sw)*2}" width="100%" height="100%">
    <circle cx="${r+sw}" cy="${r+sw}" r="${r}" fill="none" stroke="${bgColor}" stroke-width="${sw}"/>
    <circle cx="${r+sw}" cy="${r+sw}" r="${r}" fill="none"
      stroke="${fgColor}" stroke-width="${sw}" stroke-linecap="round"
      stroke-dasharray="${fill.toFixed(1)} ${c.toFixed(1)}"
      stroke-dashoffset="0" transform="rotate(-90,${r+sw},${r+sw})"/>
  </svg>`;
}

function travelPills(t) {
  return `<div class="featured-travel">
    <div class="travel-pill">${icon("ti-walk")} ${t.walk} dk</div>
    <div class="travel-pill">${icon("ti-bus")} ${t.bus} dk</div>
    <div class="travel-pill">${icon("ti-car")} ${t.car} dk</div>
  </div>`;
}

/* ─── JOB CARD COMPONENTS ────────────────────────────────────────── */
function featuredCard(job) {
  const fill = (job.matchScore / 100) * (2 * Math.PI * 22);
  const circ = 2 * Math.PI * 22;
  return `<div class="featured-card" onclick="openJob(${job.id},'home')">
    <div class="featured-visual">
      <div class="featured-initials">${job.initials}</div>
      <div class="featured-match-ring">
        <svg viewBox="0 0 60 60" style="transform:rotate(-90deg)">
          <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="4"/>
          <circle cx="30" cy="30" r="22" fill="none" stroke="${scoreColor(job.matchScore)}" stroke-width="4"
            stroke-linecap="round" stroke-dasharray="${fill.toFixed(1)} ${circ.toFixed(1)}"/>
        </svg>
        <div class="featured-match-num">${job.matchScore}<span>%</span></div>
      </div>
      ${travelPills(job.travel)}
    </div>
    <div class="featured-body">
      <div class="meta">
        <span class="badge badge-success">Sana En Yakın</span>
        <span class="badge badge-dim">${job.type}</span>
      </div>
      <h2>${job.title}</h2>
      <p class="company">${job.company} · ${job.location || "Kadıköy"}</p>
      <div class="featured-footer">
        <div class="featured-salary">${job.sal.cur}${job.sal.min}–${job.sal.max}<span>/${job.sal.per}</span></div>
        <span class="body-sm">${job.distance} km uzaklıkta</span>
      </div>
    </div>
  </div>`;
}

function jobMiniCard(job) {
  const sc = job.matchScore >= 85 ? "" : job.matchScore >= 70 ? " mid" : " low";
  return `<div class="job-mini" onclick="openJob(${job.id},'home')">
    <div class="job-mini-visual">
      <span class="initials">${job.initials}</span>
      <span class="job-mini-score${sc}">${job.matchScore}%</span>
    </div>
    <div class="job-mini-body">
      <h3>${job.title}</h3>
      <p class="co">${job.company}</p>
      <p class="sal">${job.sal.cur}${job.sal.min}–${job.sal.max}<span>/${job.sal.per}</span></p>
      <p class="job-mini-dist">${icon("ti-map-pin")} ${job.distance} km</p>
    </div>
  </div>`;
}

function jobRow(job) {
  return `<div class="job-row" onclick="openJob(${job.id},'home')">
    <div class="job-row-avatar">${job.initials}</div>
    <div class="job-row-body">
      <h3>${job.title}</h3>
      <p class="co">${job.company}</p>
      <div class="job-row-meta">
        <span>${icon("ti-map-pin")} ${job.distance} km</span>
        <span>${icon("ti-walk")} ${job.travel.walk} dk</span>
        <span>${job.type}</span>
      </div>
    </div>
    <div class="job-row-right">
      <span class="job-row-sal">${job.sal.cur}${job.sal.min}<span>/${job.sal.per}</span></span>
      <span class="score-pill ${scorePillClass(job.matchScore)}">${job.matchScore}%</span>
    </div>
  </div>`;
}

/* ─── HOME CARD COMPONENTS ──────────────────────────────────────── */

function heroCard(job) {
  const circ = 2 * Math.PI * 22;
  const fill = (job.matchScore / 100) * circ;
  const distColor = job.distance < 1 ? "var(--success)" : job.distance < 3 ? "var(--primary)" : "var(--text-2)";
  return `<div class="hero-card" onclick="openJob(${job.id},'home')">
    <div class="hero-visual" style="background:linear-gradient(135deg,rgba(${job.hue},1) 0%,rgba(${job.hue},.25) 60%,#080E1F 100%)">
      <div class="hero-initials">${job.initials}</div>
      <div class="hero-ring">
        <svg viewBox="0 0 60 60" style="transform:rotate(-90deg)">
          <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="4"/>
          <circle cx="30" cy="30" r="22" fill="none" stroke="${scoreColor(job.matchScore)}" stroke-width="4"
            stroke-linecap="round" stroke-dasharray="${fill.toFixed(1)} ${circ.toFixed(1)}"/>
        </svg>
        <div class="hero-ring-num">${job.matchScore}<span>%</span></div>
      </div>
      <div class="hero-badges">
        <span class="badge badge-success">✦ Sana En Uygun</span>
        <span class="badge badge-dim">${job.type}</span>
      </div>
      <div class="featured-travel">
        <div class="travel-pill">${icon("ti-walk")} ${job.travel.walk} dk</div>
        <div class="travel-pill">${icon("ti-bus")} ${job.travel.bus} dk</div>
        <div class="travel-pill">${icon("ti-car")} ${job.travel.car} dk</div>
      </div>
    </div>
    <div class="hero-body">
      <div class="hero-title-row">
        <div>
          <h2 class="hero-role">${job.title}</h2>
          <p class="hero-company">${job.company} · Kadıköy</p>
        </div>
        <div class="hero-dist" style="color:${distColor}">
          <span class="hero-dist-num">${job.distance}</span>
          <span class="hero-dist-unit">km</span>
        </div>
      </div>
      <p class="hero-reason">${job.desc.slice(0, 72)}…</p>
      <div class="hero-footer">
        <span class="hero-salary">${job.sal.cur}${job.sal.min}–${job.sal.max}<em>/${job.sal.per}</em></span>
        <div class="hero-btns">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();go('navigation')">Yol Tarifi</button>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openJob(${job.id},'home')">Detaylar →</button>
        </div>
      </div>
    </div>
  </div>`;
}

function discCard(job) {
  const circ = 2 * Math.PI * 16;
  const fill = (job.matchScore / 100) * circ;
  return `<div class="disc-card" onclick="openJob(${job.id},'home')">
    <div class="disc-visual" style="background:linear-gradient(145deg,rgba(${job.hue},1) 0%,rgba(${job.hue},.35) 100%)">
      <div class="disc-initials">${job.initials}</div>
      <div class="disc-ring">
        <svg viewBox="0 0 44 44" style="transform:rotate(-90deg)">
          <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="3"/>
          <circle cx="22" cy="22" r="16" fill="none" stroke="${scoreColor(job.matchScore)}" stroke-width="3"
            stroke-linecap="round" stroke-dasharray="${fill.toFixed(1)} ${circ.toFixed(1)}"/>
        </svg>
        <span class="disc-ring-num">${job.matchScore}%</span>
      </div>
    </div>
    <div class="disc-body">
      <h3 class="disc-role">${job.title}</h3>
      <p class="disc-co">${job.company}</p>
      <div class="disc-kpis">
        <span class="disc-sal">${job.sal.cur}${job.sal.min}</span>
        <span class="disc-dist">${icon("ti-map-pin")} ${job.distance} km</span>
      </div>
      <span class="disc-type">${job.type}</span>
    </div>
  </div>`;
}

function distCard(job) {
  const distColor = job.distance < 1 ? "var(--success)" : job.distance < 3 ? "var(--primary)" : "var(--text-2)";
  return `<div class="dist-card" onclick="openJob(${job.id},'home')">
    <div class="dist-avatar" style="background:rgba(${job.hue},.18);color:rgba(${job.hue},1)">${job.initials}</div>
    <div class="dist-body">
      <div class="dist-top">
        <div class="dist-info">
          <h3 class="dist-role">${job.title}</h3>
          <p class="dist-co">${job.company}</p>
        </div>
        <span class="score-pill ${scorePillClass(job.matchScore)}">${job.matchScore}%</span>
      </div>
      <div class="dist-pills">
        <span class="dist-pill">${icon("ti-walk")} ${job.travel.walk} dk</span>
        <span class="dist-pill">${icon("ti-bus")} ${job.travel.bus} dk</span>
        <span class="dist-pill">${icon("ti-car")} ${job.travel.car} dk</span>
      </div>
      <div class="dist-bottom">
        <span class="dist-sal">${job.sal.cur}${job.sal.min}–${job.sal.max}/${job.sal.per}</span>
        <span class="dist-km" style="color:${distColor}">📍 ${job.distance} km</span>
      </div>
    </div>
  </div>`;
}

const HOME_TIMESTAMPS = ["Az önce", "45 dk önce", "2 saat önce", "Bugün", "Dün"];
function homeNewRow(job, i) {
  return `<div class="job-row" onclick="openJob(${job.id},'home')">
    <div class="job-row-avatar" style="background:rgba(${job.hue},.15);color:rgba(${job.hue},1)">${job.initials}</div>
    <div class="job-row-body">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
        <h3>${job.title}</h3>
        ${i === 0 ? '<span class="new-tag">YENİ</span>' : ""}
      </div>
      <p class="co">${job.company}</p>
      <div class="job-row-meta">
        <span>${icon("ti-map-pin")} ${job.distance} km</span>
        <span>${icon("ti-walk")} ${job.travel.walk} dk</span>
        <span>${job.type}</span>
      </div>
    </div>
    <div class="job-row-right">
      <span class="job-row-sal">${job.sal.cur}${job.sal.min}<span>/${job.sal.per}</span></span>
      <span class="score-pill ${scorePillClass(job.matchScore)}">${job.matchScore}%</span>
      <span class="new-time">${HOME_TIMESTAMPS[i] || "Bugün"}</span>
    </div>
  </div>`;
}

function trendCard(job) {
  const views = 84 + job.id * 23 + job.matchScore;
  return `<div class="disc-card" onclick="openJob(${job.id},'home')">
    <div class="disc-visual" style="background:linear-gradient(145deg,rgba(${job.hue},.95) 0%,rgba(${job.hue},.35) 100%)">
      <div class="disc-initials">${job.initials}</div>
      <div class="trend-views-badge">👁 ${views}</div>
    </div>
    <div class="disc-body">
      <h3 class="disc-role">${job.title}</h3>
      <p class="disc-co">${job.company}</p>
      <div class="disc-kpis">
        <span class="disc-sal">${job.sal.cur}${job.sal.min}</span>
        <span class="disc-dist">${icon("ti-map-pin")} ${job.distance} km</span>
      </div>
      <span class="disc-type" style="color:var(--warning)">◆ Trend</span>
    </div>
  </div>`;
}

/* ─── SCREENS ────────────────────────────────────────────────────── */

/* AUTH — Phone-based entry */
function renderAuth() {
  return `<div class="auth-screen reg-screen anim-fade-in">
    <div class="reg-brand">
      <div class="reg-brand-mark">✦</div>
      <span class="reg-brand-name">Matchwork</span>
    </div>
    <div class="reg-phone-hero">
      <div class="reg-ping-ring reg-ring-1"></div>
      <div class="reg-ping-ring reg-ring-2"></div>
      <div class="reg-phone-icon">🔑</div>
    </div>
    <div class="reg-copy">
      <h2 class="reg-h1">Tekrar hoş geldin</h2>
      <p class="reg-sub">Hesabına giriş yap.</p>
    </div>
    <div class="reg-form">
      <input class="input-field" type="email" placeholder="E-posta adresin"
        autocomplete="email"
        onkeydown="if(event.key==='Enter')this.nextElementSibling.focus()">
      <input class="input-field" type="password" placeholder="Şifren"
        autocomplete="current-password" style="margin-top:10px"
        onkeydown="if(event.key==='Enter')doLogin()">
      <button class="btn btn-primary btn-full reg-cta" style="margin-top:12px"
        onclick="doLogin()">Giriş Yap →</button>
      <div class="auth-divider">veya</div>
      <button class="btn btn-ghost btn-full" onclick="demoLogin()">Demo ile Dene →</button>
      <button class="btn btn-ghost btn-full" style="margin-top:8px;opacity:.6;font-size:13px"
        onclick="go('onboarding-welcome')">← Geri dön</button>
    </div>
  </div>`;
}

/* HOME */
function renderHome() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";
  const byMatch = [...jobs].sort((a,b) => b.matchScore - a.matchScore);
  const byDist  = [...jobs].sort((a,b) => a.distance - b.distance);
  const byNew   = [...jobs].sort((a,b) => b.id - a.id);
  const hero  = byMatch[0];
  const recs  = byMatch.slice(1);
  const near  = byDist;
  const newJs = byNew.slice(0, 4);
  const trend = byMatch.filter(j => j.id !== hero.id);
  const catTags = [...new Set(jobs.flatMap(j => j.tags || []))].slice(0, 12);

  return screen(`
    <div class="home-hdr">
      <div class="home-hdr-left">
        <p class="home-sub">${greeting} 👋</p>
        <h1 class="home-name">${user.short}</h1>
      </div>
      <div class="home-hdr-right">
        <button class="topbar-action" onclick="go('search')" aria-label="Arama">${icon("ti-search")}</button>
        <button class="topbar-action home-bell-btn" onclick="go('notifications')" aria-label="Bildirimler">
          ${icon("ti-bell")}<span class="home-bell-dot"></span>
        </button>
        <div class="home-avatar" onclick="go('profile')">${user.initials}</div>
      </div>
    </div>

    <div class="screen-body home-body">

      <button class="home-pulse" onclick="go('discover')">
        <span class="home-pulse-dot"></span>
        <span>Kadıköy'de bugün <strong>${jobs.length} fırsat</strong> seni bekliyor</span>
        <span class="home-pulse-arr">→</span>
      </button>

      ${dgHomeWidget()}

      ${heroCard(hero)}

      <div class="quick-actions home-qa">
        <div class="quick-action" onclick="go('discover')">
          <div class="qa-icon primary">${icon("ti-compass")}</div>
          <h3>Keşfet</h3><p>Kaydır & eşleş</p>
        </div>
        <div class="quick-action" onclick="go('nearby')">
          <div class="qa-icon success">${icon("ti-map-pin")}</div>
          <h3>Haritada</h3><p>Yakınındakiler</p>
        </div>
        <div class="quick-action home-qa-matches" onclick="go('matches')">
          <div class="qa-icon warning" style="position:relative">
            ${icon("ti-sparkles")}
            ${matchTabCounts[0] > 0 ? `<span class="qa-badge">${matchTabCounts[0]}</span>` : ""}
          </div>
          <h3>Eşleşmeler</h3><p>${matchTabCounts[0]} yeni</p>
        </div>
      </div>

      <div class="home-section">
        <div class="home-sh">
          <div class="home-sh-l"><span class="sh-ico">✦</span>Sana Özel</div>
          <button class="home-sh-r" onclick="go('discover')">Hepsini gör →</button>
        </div>
        <div class="h-scroll">${recs.map(j => discCard(j)).join("")}</div>
      </div>

      <div class="home-section">
        <div class="home-sh">
          <div class="home-sh-l"><span class="sh-ico">◉</span>Yakınında</div>
          <button class="home-sh-r" onclick="go('nearby')">Haritada gör →</button>
        </div>
        <div class="h-scroll">${near.map(j => distCard(j)).join("")}</div>
      </div>

      <div class="home-section">
        <div class="home-sh">
          <div class="home-sh-l"><span class="sh-ico">◎</span>Yeni Eklendi</div>
          <button class="home-sh-r" onclick="go('discover')">Tümünü gör →</button>
        </div>
        <div class="home-new-list">${newJs.map((j,i) => homeNewRow(j,i)).join("")}</div>
      </div>

      <div class="home-section">
        <div class="home-sh">
          <div class="home-sh-l"><span class="sh-ico">◆</span>Trend</div>
          <button class="home-sh-r" onclick="go('discover')">Tümünü gör →</button>
        </div>
        <div class="h-scroll">${trend.map(j => trendCard(j)).join("")}</div>
      </div>

      <div class="home-section home-cat-section">
        <div class="home-sh">
          <div class="home-sh-l"><span class="sh-ico">⊟</span>Kategori Keşfi</div>
        </div>
        <div class="h-scroll" style="padding-top:0">
          ${catTags.map(tag => `<div class="home-cat-chip" onclick="go('discover')">${tag}</div>`).join("")}
        </div>
      </div>

      <div style="height:20px"></div>
    </div>
  `, bottomNav("home"));
}

/* NEARBY — Opportunity Discovery Map */
let _leafletMap = null;
let _leafletMarkers = {};
let _mapRouteLayer = null;
let _mapDistanceRings = [];

function renderNearby() {
  if (!state.sheetState) state.sheetState = "peek";
  const sheetCls = state.sheetState === "mid" ? " sheet-mid"
    : state.sheetState === "expanded" ? " sheet-expanded" : "";
  const nearby  = [...jobs].sort((a,b) => a.distance - b.distance);
  const sorted  = [...jobs].sort((a,b) => b.matchScore - a.matchScore);
  const bestPct = Math.max(...jobs.map(j => j.matchScore));

  return screen(`
    <div class="map-wrap">
      <div id="leaflet-map" class="map-full"></div>

      <!-- ETA banner -->
      <div class="map-eta-banner" id="map-eta-banner"
        style="display:${state.selectedPin ? "flex" : "none"}">
        <span id="map-eta-text">♟ ${(() => { const j = jobs.find(x=>x.id===state.selectedPin); return j ? j.travel[state.dirMode||"walk"]+" dk" : ""; })()}</span>
        <button onclick="deselectMapPin()">✕</button>
      </div>

      <!-- Top overlay -->
      <div class="map-overlay-top">
        <div class="map-search-row">
          <button class="topbar-action" onclick="go('home')" style="flex-shrink:0">${icon("ti-arrow-left")}</button>
          <div class="map-search">
            ${icon("ti-search")}
            <input type="search" id="map-search-input" placeholder="Kadıköy'de iş ara..."
              oninput="filterMapSearch(this.value)">
          </div>
          <button class="topbar-action" id="map-locate-btn" onclick="centerMapOnUser()" style="flex-shrink:0">${icon("ti-map-pin")}</button>
        </div>
        <div class="map-chips" id="map-filter-chips">
          <div class="chip active" onclick="setMapTypeFilter(this,'')">Tümü</div>
          <div class="chip" onclick="setMapTypeFilter(this,'Yarı zamanlı')">Yarı zamanlı</div>
          <div class="chip" onclick="setMapTypeFilter(this,'Tam zamanlı')">Tam zamanlı</div>
          <div class="chip" onclick="setMapTypeFilter(this,'Serbest')">Serbest</div>
        </div>
      </div>

      <!-- Bottom Sheet -->
      <div class="map-sheet${sheetCls}" id="map-sheet">
        <div class="map-sheet-handle" onclick="cycleSheetState()">
          <div class="sheet-handle"></div>
        </div>

        <!-- PEEK layer -->
        <div class="ms-layer ms-peek">
          <button class="sheet-insights" onclick="setSheetState('expanded')">
            <span class="si-dot"></span>
            <span id="sheet-insight-text">
              <strong>${jobs.length}</strong> fırsat &middot;
              En yakın <strong>${nearby[0].distance} km</strong> &middot;
              En iyi <strong>${bestPct}%</strong>
            </span>
            <span class="si-arr">↑</span>
          </button>
          <div class="h-scroll" style="padding:0 14px 12px">
            <div class="mini-filter-chip active" onclick="setSortMode(this,'match')">✦ En İyi Uyum</div>
            <div class="mini-filter-chip" onclick="setSortMode(this,'distance')">📍 En Yakın</div>
            <div class="mini-filter-chip" onclick="setSortMode(this,'new')">◎ Yeni</div>
            <div class="mini-filter-chip" onclick="setSortMode(this,'salary')">₺ Ücret</div>
          </div>
        </div>

        <!-- MID layer -->
        <div class="ms-layer ms-mid">
          <div id="sheet-selected-card">
            ${state.selectedPin
              ? mapDetailCard(jobs.find(j => j.id === state.selectedPin))
              : mapBrowseCard()}
          </div>
          <div class="sheet-nearby-row">
            <p class="sheet-nearby-label">Diğer fırsatlar →</p>
            <div class="h-scroll" id="sheet-nearby-cards">
              ${nearby.map(j => sheetMiniCard(j)).join("")}
            </div>
          </div>
        </div>

        <!-- EXPANDED layer -->
        <div class="ms-layer ms-expanded">
          <div class="ms-exp-header">
            <span id="sheet-exp-count">${jobs.length} fırsat · Kadıköy</span>
            <button class="ms-exp-close" onclick="setSheetState('peek')">${icon("ti-x")}</button>
          </div>
          <div class="ms-exp-list" id="sheet-full-list">
            ${sorted.map(j => mapListRow(j)).join("")}
          </div>
        </div>
      </div>
    </div>
  `, bottomNav("nearby"));
}

/* ─── MAP CARD COMPONENTS ────────────────────────────────────────── */

function mapDetailCard(job) {
  if (!job) return mapBrowseCard();
  const circ = 2 * Math.PI * 18;
  const fill = (job.matchScore / 100) * circ;
  const mode = state.dirMode || "walk";
  return `<div class="map-detail-card">
    <div class="mdc-header">
      <div class="mdc-avatar" style="background:rgba(${job.hue},.2);color:rgba(${job.hue},1)">${job.initials}</div>
      <div class="mdc-info">
        <h3 class="mdc-role">${job.title}</h3>
        <p class="mdc-co">${job.company}</p>
      </div>
      <div class="mdc-ring">
        <svg viewBox="0 0 48 48" style="transform:rotate(-90deg)">
          <circle cx="24" cy="24" r="18" fill="none" stroke="var(--surface-3)" stroke-width="4"/>
          <circle cx="24" cy="24" r="18" fill="none" stroke="${scoreColor(job.matchScore)}" stroke-width="4"
            stroke-linecap="round" stroke-dasharray="${fill.toFixed(1)} ${circ.toFixed(1)}"/>
        </svg>
        <div class="mdc-ring-num">${job.matchScore}%</div>
      </div>
      <button class="mdc-close" onclick="deselectMapPin()">✕</button>
    </div>
    <div class="mdc-travel-tabs">
      <button class="travel-tab${mode==="walk"?" active":""}" data-mode="walk" onclick="setMapRouteMode('walk')">${icon("ti-walk")} ${job.travel.walk} dk</button>
      <button class="travel-tab${mode==="bus"?" active":""}" data-mode="bus"  onclick="setMapRouteMode('bus')">${icon("ti-bus")} ${job.travel.bus} dk</button>
      <button class="travel-tab${mode==="car"?" active":""}" data-mode="car"  onclick="setMapRouteMode('car')">${icon("ti-car")} ${job.travel.car} dk</button>
    </div>
    <div class="mdc-kpis">
      <div class="mdc-kpi"><span class="mdc-kv">${job.sal.cur}${job.sal.min}–${job.sal.max}</span><span class="mdc-kl">/${job.sal.per}</span></div>
      <div class="mdc-sep"></div>
      <div class="mdc-kpi"><span class="mdc-kv">${job.distance} km</span><span class="mdc-kl">mesafe</span></div>
      <div class="mdc-sep"></div>
      <div class="mdc-kpi"><span class="mdc-kv" style="font-size:11px">${job.type}</span><span class="mdc-kl">çalışma</span></div>
    </div>
    <p class="mdc-desc">${job.desc.slice(0, 78)}…</p>
    <div class="mdc-actions">
      <button class="btn btn-ghost btn-sm" onclick="go('navigation')">Yol Tarifi</button>
      <button class="btn btn-primary" style="flex:1;height:40px;font-size:13px;border-radius:12px" onclick="openJob(${job.id},'nearby')">Detayları Gör →</button>
    </div>
  </div>`;
}

function mapBrowseCard() {
  return `<div class="map-browse-prompt">
    <div class="mbp-icon">◉</div>
    <p class="mbp-text">Haritadan bir fırsat seçin<br>veya aşağıyı kaydırın</p>
    <button class="btn btn-ghost btn-sm" onclick="setSheetState('expanded')">Tüm Fırsatları Gör →</button>
  </div>`;
}

function sheetMiniCard(job) {
  const active = state.selectedPin === job.id;
  return `<div class="sheet-mini-card${active ? " smc-active" : ""}" onclick="selectMapPin(${job.id})">
    <div class="smc-avatar" style="background:rgba(${job.hue},.2);color:rgba(${job.hue},1)">${job.initials}</div>
    <h4 class="smc-role">${job.title}</h4>
    <p class="smc-dist">${icon("ti-map-pin")} ${job.distance} km</p>
    <p class="smc-walk">${icon("ti-walk")} ${job.travel.walk} dk</p>
    <span class="score-pill ${scorePillClass(job.matchScore)}">${job.matchScore}%</span>
  </div>`;
}

function mapListRow(job) {
  return `<div class="job-row" onclick="selectMapPin(${job.id});setSheetState('mid')">
    <div class="job-row-avatar" style="background:rgba(${job.hue},.15);color:rgba(${job.hue},1)">${job.initials}</div>
    <div class="job-row-body">
      <h3>${job.title}</h3>
      <p class="co">${job.company}</p>
      <div class="job-row-meta">
        <span>${icon("ti-map-pin")} ${job.distance} km</span>
        <span>${icon("ti-walk")} ${job.travel.walk} dk</span>
        <span>${job.type}</span>
      </div>
    </div>
    <div class="job-row-right">
      <span class="job-row-sal">${job.sal.cur}${job.sal.min}<span>/${job.sal.per}</span></span>
      <span class="score-pill ${scorePillClass(job.matchScore)}">${job.matchScore}%</span>
    </div>
  </div>`;
}

/* ─── MAP INIT ───────────────────────────────────────────────────── */

function initLeafletMap() {
  if (!window.L) return;
  const el = document.getElementById("leaflet-map");
  if (!el) return;
  if (_leafletMap) { _leafletMap.remove(); _leafletMap = null; }
  _leafletMarkers = {};
  _mapRouteLayer = null;

  const center = [40.9906, 29.0250];
  _leafletMap = L.map("leaflet-map", {
    center, zoom: 15,
    zoomControl: false, attributionControl: false,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 20,
  }).addTo(_leafletMap);

  // Distance rings
  _mapDistanceRings.forEach(r => { try { r.remove(); } catch(_) {} });
  _mapDistanceRings = [
    L.circle(center, { radius:500,  color:"#6C4EFF", opacity:.45, weight:1.5, fill:false, dashArray:"5 5" }),
    L.circle(center, { radius:1000, color:"#6C4EFF", opacity:.28, weight:1,   fill:false, dashArray:"3 7" }),
    L.circle(center, { radius:2000, color:"#6C4EFF", opacity:.14, weight:1,   fill:false, dashArray:"2 9" }),
  ];
  _mapDistanceRings.forEach(r => r.addTo(_leafletMap));

  // User location pin
  const userIcon = L.divIcon({
    html: `<div class="lpin-user"><div class="lpu-dot"></div><div class="lpu-ring"></div></div>`,
    className: "", iconSize:[36,36], iconAnchor:[18,18],
  });
  L.marker(center, { icon: userIcon, zIndexOffset:1000 }).addTo(_leafletMap);

  if (window.MW?.Location) {
    window.MW.Location.get().then(loc => {
      if (loc && _leafletMap) _leafletMap.setView([loc.lat, loc.lng], 15);
    });
  }

  _leafletMap.on("click", () => { if (state.selectedPin) deselectMapPin(); });
  addJobPinsToMap(jobs);
}

function addJobPinsToMap(jobList) {
  if (!_leafletMap || !window.L) return;
  Object.values(_leafletMarkers).forEach(m => m.remove());
  _leafletMarkers = {};

  jobList.forEach(job => {
    const tier   = job.matchScore >= 85 ? "high" : job.matchScore >= 70 ? "mid" : "low";
    const isSel  = state.selectedPin === job.id;
    const isDim  = state.selectedPin && !isSel;
    const licon  = L.divIcon({
      html: `<div class="lpin-wrap lpin-${tier}${isSel?" lpin-sel":""}${isDim?" lpin-dim":""}" id="lpin-${job.id}">
        <div class="lpin-circle">${job.initials}</div>
        <div class="lpin-tail"></div>
        <div class="lpin-score">${job.matchScore}%</div>
      </div>`,
      className: "", iconSize:null, iconAnchor:[20,46],
    });

    const lat = job.pin?.lat || (40.9906 + (job.pin?.y - 50) * 0.002);
    const lng = job.pin?.lng || (29.0250 + (job.pin?.x - 50) * 0.003);

    const marker = L.marker([lat, lng], { icon: licon })
      .addTo(_leafletMap)
      .on("click", e => { L.DomEvent.stopPropagation(e); selectMapPin(job.id); });

    _leafletMarkers[job.id] = marker;
  });
}

function centerMapOnUser() {
  if (!_leafletMap) return;
  const btn = document.getElementById("map-locate-btn");
  if (btn) btn.style.opacity = ".5";
  const done = () => { if (btn) btn.style.opacity = ""; };
  if (window.MW?.Location) {
    window.MW.Location.get().then(loc => {
      if (loc) _leafletMap?.flyTo([loc.lat, loc.lng], 15, { duration: 0.8 });
      done();
    });
  } else {
    _leafletMap.flyTo([40.9906, 29.0250], 15, { duration: 0.8 });
    setTimeout(done, 900);
  }
}

function filterMapSearch(q) {
  state.mapSearchQ = q;
  applyMapFilters();
}

function setMapTypeFilter(btn, type) {
  document.querySelectorAll("#map-filter-chips .chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  state.mapTypeFilter = type;
  applyMapFilters();
}

function applyMapFilters() {
  const q    = (state.mapSearchQ || "").toLowerCase();
  const type = state.mapTypeFilter || "";
  const filtered = jobs.filter(j =>
    (!q    || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)) &&
    (!type || j.type === type)
  );
  addJobPinsToMap(filtered);
  const sorted  = sortMapJobs(filtered);
  const listEl  = document.getElementById("sheet-full-list");
  if (listEl) listEl.innerHTML = sorted.map(j => mapListRow(j)).join("");
  const nearbyEl = document.getElementById("sheet-nearby-cards");
  if (nearbyEl) nearbyEl.innerHTML = [...filtered].sort((a,b)=>a.distance-b.distance).map(j=>sheetMiniCard(j)).join("");
  updateSheetInsights(filtered);
}

function sortMapJobs(list) {
  const arr = [...list];
  const m = state.mapSortMode || "match";
  if (m === "distance") return arr.sort((a,b) => a.distance - b.distance);
  if (m === "new")      return arr.sort((a,b) => b.id - a.id);
  if (m === "salary")   return arr.sort((a,b) => b.sal.min - a.sal.min);
  return arr.sort((a,b) => b.matchScore - a.matchScore);
}

function setSortMode(btn, mode) {
  state.mapSortMode = mode;
  document.querySelectorAll(".mini-filter-chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  applyMapFilters();
}

function updateSheetInsights(list) {
  const el = document.getElementById("sheet-insight-text");
  if (!el || !list.length) return;
  const near = [...list].sort((a,b)=>a.distance-b.distance)[0];
  const best = Math.max(...list.map(j=>j.matchScore));
  el.innerHTML = `<strong>${list.length}</strong> fırsat &middot; En yakın <strong>${near.distance} km</strong> &middot; En iyi <strong>${best}%</strong>`;
}

function sheetCard(job) {
  const active = state.selectedPin === job.id ? " active" : "";
  return `<div class="sheet-card${active}" onclick="openJob(${job.id},'nearby')">
    <div class="sheet-card-top">
      <div><h3>${job.title}</h3><p class="co">${job.company}</p></div>
      <span class="score-pill ${scorePillClass(job.matchScore)}">${job.matchScore}%</span>
    </div>
    <div class="sheet-card-meta">
      <span>${icon("ti-map-pin")} ${job.distance} km</span>
      <span>${icon("ti-walk")} ${job.travel.walk} dk</span>
      <span>${job.type}</span>
    </div>
    <div class="sheet-card-footer">
      <span class="sheet-card-sal">${job.sal.cur}${job.sal.min}–${job.sal.max}/${job.sal.per}</span>
      <span class="caption">Detay →</span>
    </div>
  </div>`;
}

/* ─── DISCOVER ────────────────────────────────────────────────────── */

const DC_CAT_MAP = {
  "Kafe":    ["Barista"],
  "Restoran":["Garson","Aşçı Yardımcısı"],
  "Mağaza":  ["Satış Temsilcisi","Kasa Görevlisi"],
  "Kurye":   ["Kurye"],
  "Çağrı":   ["Çağrı Merkezi Temsilcisi"],
};

const DC_REASONS = {
  1:"Kahve deneyimin tam burada geçer",
  2:"Müşteri odaklı çalışma tarzına uygun",
  3:"Esnek saatler sana tam uyar",
  4:"Teknoloji ve satış — tam kombinasyon",
  5:"Güvenilirlik ve düzen senin tarzın",
  6:"Satış yeteneğin burada parlar",
  7:"Mutfak tecrübeni değerlendirme zamanı",
  8:"İletişim becerilerin ön plana çıkar",
};

const DC_ALGO_REASONS = [
  "📍 Hepsine yürüyerek gidebilirsin",
  "✨ Bugün eklendi, henüz görülmedi",
  "₺ Bu kategoride en yüksek ücret",
  "🔥 3 kişi bugün başvurdu",
  "✦ Profiline en yakın fırsatlar",
];

function filteredSwipeJobs() {
  const f = state.swipe.deckFilter || "";
  const base = jobs.filter(j => j.matchScore >= 60);
  if (!f) return base;
  const titles = DC_CAT_MAP[f] || [];
  return base.filter(j => titles.includes(j.title));
}

function buildDiscoverDeck() {
  return [...filteredSwipeJobs()].sort((a, b) => {
    const sa = a.matchScore * .7 + Math.max(0, 5 - a.distance) * 6;
    const sb = b.matchScore * .7 + Math.max(0, 5 - b.distance) * 6;
    return sb - sa;
  });
}

function currentSwipeJob() {
  const deck = buildDiscoverDeck();
  if (!deck.length) return null;
  return deck[state.swipe.deckIndex % deck.length];
}

function discoverCard(job, slot) {
  const isTop = slot === 0;
  const isSpotlight = isTop && job.matchScore >= 85;
  const tier   = job.matchScore >= 85 ? "high" : job.matchScore >= 70 ? "mid" : "low";
  const rColor = scoreColor(job.matchScore);
  const circ   = 2 * Math.PI * 20;
  const fill   = (job.matchScore / 100) * circ;

  if (!isTop) {
    return `<div class="dc-card dc-back dc-back-${slot}" style="z-index:${10 - slot}">
      <div class="dc-hero" style="background:linear-gradient(145deg,rgba(${job.hue},.4),rgba(${job.hue},.1) 65%,var(--surface-2))">
        <div class="dc-big-init">${job.initials}</div>
        <div class="dc-hero-fade"></div>
      </div>
    </div>`;
  }

  return `<div class="dc-card dc-top${isSpotlight ? " dc-spotlight" : ""}" id="top-card" tabindex="0" role="article">
    <div class="swipe-overlay like-overlay"   id="like-ol"><div class="dc-stamp dc-stamp-like">İLGİLENİYORUM ♥</div></div>
    <div class="swipe-overlay pass-overlay"   id="pass-ol"><div class="dc-stamp dc-stamp-pass">GEÇ ✕</div></div>
    <div class="swipe-overlay detail-overlay" id="detail-ol"><div class="dc-stamp dc-stamp-detail">DETAYLAR ↑</div></div>

    <div class="dc-hero" style="background:linear-gradient(155deg,rgba(${job.hue},.55) 0%,rgba(${job.hue},.22) 55%,var(--surface-2) 90%)">
      <div class="dc-big-init">${job.initials}</div>
      ${isSpotlight ? '<div class="dc-spotlight-badge">✦ Sana Özel</div>' : ""}

      <div class="dc-mini-map">
        <div class="dcm-road dcm-h" style="top:35%"></div>
        <div class="dcm-road dcm-h" style="top:62%"></div>
        <div class="dcm-road dcm-v" style="left:38%"></div>
        <div class="dcm-road dcm-v" style="left:68%"></div>
        <div class="dcm-route"></div>
        <div class="dcm-pin dcm-pin-${tier}" style="left:${job.pin.x}%;top:${job.pin.y}%"></div>
        <div class="dcm-user"></div>
      </div>

      <div class="dc-match-ring">
        <svg viewBox="0 0 48 48" width="52" height="52" style="transform:rotate(-90deg)">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="4"/>
          <circle cx="24" cy="24" r="20" fill="none" stroke="${rColor}" stroke-width="4"
            stroke-linecap="round" stroke-dasharray="${fill.toFixed(1)} ${circ.toFixed(1)}"
            class="dc-ring-arc"/>
        </svg>
        <div class="dc-ring-num">${job.matchScore}%</div>
      </div>

      <div class="dc-hero-fade"></div>
    </div>

    <div class="dc-body">
      <div class="dc-title-row">
        <div class="dc-avatar" style="background:rgba(${job.hue},.2);color:rgba(${job.hue},1)">${job.initials}</div>
        <div class="dc-title-info">
          <h2 class="dc-role">${job.title}</h2>
          <p class="dc-co">${job.company}</p>
        </div>
        <span class="dc-type-badge">${job.type}</span>
      </div>

      <div class="dc-match-strip">
        <p class="dc-reason">✓ "${DC_REASONS[job.id] || "Profiline uygun bir fırsat"}"</p>
        ${mxMiniHtml(job)}
      </div>

      <div class="dc-kpis">
        <div class="dc-kpi"><span class="dc-kv" style="color:var(--success)">${job.sal.cur}${job.sal.min}–${job.sal.max}</span><span class="dc-kl">/${job.sal.per}</span></div>
        <div class="dc-ksep"></div>
        <div class="dc-kpi"><span class="dc-kv">${icon("ti-map-pin")} ${job.distance} km</span><span class="dc-kl">mesafe</span></div>
        <div class="dc-ksep"></div>
        <div class="dc-kpi"><span class="dc-kv">${icon("ti-walk")} ${job.travel.walk} dk</span><span class="dc-kl">yürüyüş</span></div>
      </div>

      <div class="dc-travel">
        <span class="dc-t dc-walk">${icon("ti-walk")} ${job.travel.walk} dk</span>
        <span class="dc-t dc-bus">${icon("ti-bus")} ${job.travel.bus} dk</span>
        <span class="dc-t dc-car">${icon("ti-car")} ${job.travel.car} dk</span>
      </div>

      <div class="dc-tags">
        ${job.tags.slice(0,3).map(t => `<span class="dc-tag">${t}</span>`).join("")}
      </div>
    </div>
  </div>`;
}

function renderCardDeck() {
  const deck  = buildDiscoverDeck();
  const total = deck.length;
  if (!total) {
    return state.swipe.deckFilter
      ? filterEmptyState(state.swipe.deckFilter)
      : discoverEmptyState();
  }
  if (state.swipe.deckIndex >= total) return discoverEmptyState();
  const cards = [];
  for (let i = Math.min(2, total - 1 - state.swipe.deckIndex); i >= 0; i--) {
    cards.push(discoverCard(deck[state.swipe.deckIndex + i], i));
  }
  return cards.join("");
}

/* ─── EMPTY & SUCCESS STATES ────────────────────────────────────── */

function esHtml({ tag = "", illu = "", title, sub, actions = [], tip = "", extra = "" }) {
  return `<div class="es">
    ${tag  ? `<div class="es-tag">${tag}</div>` : ""}
    ${illu ? `<div class="es-illu">${illu}</div>` : ""}
    <h2 class="es-title">${title}</h2>
    <p class="es-sub">${sub}</p>
    ${extra}
    <div class="es-actions">
      ${actions.map(a => `<button class="btn ${a.style || "btn-primary"}" onclick="${a.fn}">${a.label}</button>`).join("")}
    </div>
    ${tip ? `<p class="es-tip">${tip}</p>` : ""}
  </div>`;
}

const ES_SVG = {
  compass: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="rgba(108,78,255,.07)"/>
    <circle cx="60" cy="60" r="36" fill="rgba(108,78,255,.13)" stroke="rgba(108,78,255,.22)" stroke-width="1.5" stroke-dasharray="4 3"/>
    <circle cx="60" cy="60" r="5" fill="#6C4EFF"/>
    <path d="M60 30 L67 54 L60 60 L53 54Z" fill="#6C4EFF" opacity=".9"/>
    <path d="M60 90 L53 66 L60 60 L67 66Z" fill="rgba(108,78,255,.32)"/>
    <circle cx="60" cy="60" r="2.5" fill="white"/>
    <circle cx="19" cy="42" r="3.5" fill="rgba(34,197,94,.55)"/>
    <circle cx="99" cy="55" r="2.5" fill="rgba(245,158,11,.55)"/>
    <circle cx="88" cy="94" r="4" fill="rgba(108,78,255,.3)"/>
  </svg>`,

  puzzle: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="36" width="38" height="38" rx="8" fill="rgba(108,78,255,.15)" stroke="rgba(108,78,255,.38)" stroke-width="1.5"/>
    <path d="M52 55 C52 55 58 48 64 55 C58 62 52 55 52 55Z" fill="rgba(108,78,255,.15)" stroke="rgba(108,78,255,.38)" stroke-width="1.5"/>
    <rect x="68" y="36" width="38" height="38" rx="8" fill="rgba(245,158,11,.12)" stroke="rgba(245,158,11,.38)" stroke-width="1.5"/>
    <path d="M68 55 C68 55 62 62 56 55 C62 48 68 55 68 55Z" fill="rgba(245,158,11,.12)" stroke="rgba(245,158,11,.38)" stroke-width="1.5"/>
    <circle cx="33" cy="55" r="5" fill="rgba(108,78,255,.45)"/>
    <circle cx="87" cy="55" r="5" fill="rgba(245,158,11,.45)"/>
    <path d="M54 84 L66 84" stroke="rgba(108,78,255,.2)" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 3"/>
  </svg>`,

  bubble: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="70" height="50" rx="16" fill="rgba(108,78,255,.12)" stroke="rgba(108,78,255,.28)" stroke-width="1.5"/>
    <path d="M20 70 L12 88 L38 76" fill="rgba(108,78,255,.12)" stroke="rgba(108,78,255,.28)" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="46" y="52" width="62" height="44" rx="14" fill="rgba(34,197,94,.09)" stroke="rgba(34,197,94,.24)" stroke-width="1.5"/>
    <path d="M96 96 L104 112 L80 100" fill="rgba(34,197,94,.09)" stroke="rgba(34,197,94,.24)" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="32" cy="45" r="3.5" fill="rgba(108,78,255,.38)"/>
    <circle cx="45" cy="45" r="3.5" fill="rgba(108,78,255,.38)"/>
    <circle cx="58" cy="45" r="3.5" fill="rgba(108,78,255,.38)"/>
  </svg>`,

  bell: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="rgba(108,78,255,.06)"/>
    <path d="M60 18 C43 18 31 32 31 50 L31 68 L22 78 L98 78 L89 68 L89 50 C89 32 77 18 60 18Z" fill="rgba(108,78,255,.15)" stroke="rgba(108,78,255,.32)" stroke-width="1.5"/>
    <path d="M51 78 Q51 88 60 88 Q69 88 69 78" stroke="rgba(108,78,255,.45)" stroke-width="1.5" fill="none"/>
    <text x="76" y="46" font-size="12" fill="rgba(108,78,255,.5)" font-family="system-ui,sans-serif" font-weight="600">z</text>
    <text x="85" y="36" font-size="10" fill="rgba(108,78,255,.38)" font-family="system-ui,sans-serif" font-weight="600">z</text>
    <text x="93" y="27" font-size="8"  fill="rgba(108,78,255,.26)" font-family="system-ui,sans-serif" font-weight="600">z</text>
  </svg>`,

  person: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="38" r="24" fill="rgba(108,78,255,.12)" stroke="rgba(108,78,255,.28)" stroke-width="1.5" stroke-dasharray="6 3"/>
    <path d="M22 100 C22 78 38 66 60 66 C82 66 98 78 98 100" stroke="rgba(108,78,255,.28)" stroke-width="1.5" fill="rgba(108,78,255,.07)" stroke-dasharray="6 3"/>
    <circle cx="86" cy="26" r="13" fill="rgba(245,158,11,.18)" stroke="rgba(245,158,11,.45)" stroke-width="1.5"/>
    <path d="M86 20 L86 30 M86 33 L86 34" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  search: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="30" fill="rgba(108,78,255,.09)" stroke="rgba(108,78,255,.28)" stroke-width="2"/>
    <line x1="71" y1="71" x2="96" y2="96" stroke="rgba(108,78,255,.38)" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="41" x2="60" y2="59" stroke="rgba(239,68,68,.65)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="60" y1="41" x2="40" y2="59" stroke="rgba(239,68,68,.65)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  wifi: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="64" r="50" fill="rgba(239,68,68,.06)"/>
    <path d="M18 46 Q60 20 102 46" stroke="rgba(239,68,68,.18)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M30 60 Q60 40 90 60" stroke="rgba(239,68,68,.32)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M42 74 Q60 62 78 74" stroke="rgba(239,68,68,.5)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <circle cx="60" cy="88" r="4.5" fill="rgba(239,68,68,.7)"/>
    <line x1="44" y1="24" x2="68" y2="24" stroke="rgba(239,68,68,.55)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="56" y1="14" x2="56" y2="34" stroke="rgba(239,68,68,.55)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  heart: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="rgba(34,197,94,.07)"/>
    <path d="M60 82 C60 82 28 62 28 42 C28 31 37 24 46 24 C52 24 57 28 60 33 C63 28 68 24 74 24 C83 24 92 31 92 42 C92 62 60 82 60 82Z" fill="rgba(34,197,94,.22)" stroke="rgba(34,197,94,.55)" stroke-width="1.5"/>
    <circle cx="26" cy="26" r="4" fill="rgba(245,158,11,.55)"/>
    <circle cx="94" cy="22" r="3" fill="rgba(108,78,255,.5)"/>
    <circle cx="97" cy="90" r="5" fill="rgba(34,197,94,.38)"/>
    <circle cx="18" cy="82" r="3" fill="rgba(245,158,11,.38)"/>
    <path d="M52 48 L68 48 M52 57 L62 57" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>
  </svg>`,

  chat: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="18" width="76" height="60" rx="18" fill="rgba(108,78,255,.11)" stroke="rgba(108,78,255,.28)" stroke-width="1.5"/>
    <path d="M20 78 L12 100 L48 82" fill="rgba(108,78,255,.11)" stroke="rgba(108,78,255,.28)" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="26" y="38" width="44" height="5" rx="2.5" fill="rgba(108,78,255,.3)"/>
    <rect x="26" y="51" width="28" height="5" rx="2.5" fill="rgba(108,78,255,.2)"/>
    <circle cx="94" cy="88" r="20" fill="rgba(34,197,94,.14)" stroke="rgba(34,197,94,.32)" stroke-width="1.5"/>
    <text x="94" y="95" text-anchor="middle" font-size="18" fill="rgba(34,197,94,.85)">👋</text>
  </svg>`,

  calendar: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="24" width="96" height="84" rx="14" fill="rgba(108,78,255,.09)" stroke="rgba(108,78,255,.28)" stroke-width="1.5"/>
    <rect x="12" y="24" width="96" height="30" rx="14" fill="rgba(108,78,255,.18)"/>
    <rect x="12" y="40" width="96" height="14" fill="rgba(108,78,255,.18)"/>
    <circle cx="38" cy="18" r="6" fill="none" stroke="rgba(108,78,255,.48)" stroke-width="2"/>
    <line x1="38" y1="12" x2="38" y2="24" stroke="rgba(108,78,255,.48)" stroke-width="2"/>
    <circle cx="82" cy="18" r="6" fill="none" stroke="rgba(108,78,255,.48)" stroke-width="2"/>
    <line x1="82" y1="12" x2="82" y2="24" stroke="rgba(108,78,255,.48)" stroke-width="2"/>
    <path d="M36 76 L50 90 L84 60" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ml-check-path"/>
  </svg>`,
};

/* 1. Discover — all cards swiped */
function discoverEmptyState() {
  const liked   = state.swipe.likedIds.length;
  const skipped = state.swipe.skippedIds.length;
  const total   = liked + skipped;
  const rate    = total > 0 ? Math.round(liked / total * 100) : 0;
  return esHtml({
    tag: "✦ Oturum Tamamlandı",
    illu: ES_SVG.compass,
    title: "Çevrendeki tüm fırsatları gördün",
    sub: `Bu oturumda <strong>${liked}</strong> ilana ilgi gösterdin. Yeni ilanlar her gün ekleniyor.`,
    extra: `<div class="es-stat-row">
      <div class="es-stat"><strong>${liked}</strong><span>İlgi</span></div>
      <div class="es-stat-div"></div>
      <div class="es-stat"><strong>${skipped}</strong><span>Geçilen</span></div>
      <div class="es-stat-div"></div>
      <div class="es-stat"><strong>${rate}%</strong><span>Beğeni Oranı</span></div>
    </div>`,
    actions: [
      { label: "Yeniden Keşfet", fn: "resetDeck()", style: "btn-primary" },
      { label: "Haritada Ara →",  fn: "go('nearby')", style: "btn-ghost"  },
    ],
    tip: "💡 Profil fotoğrafı ekleyenler %60 daha fazla ilgi alıyor",
  });
}

/* 2. Filter returned 0 results */
function filterEmptyState(filterLabel) {
  return esHtml({
    illu: ES_SVG.search,
    title: `"${filterLabel}" için ilan bulunamadı`,
    sub: "Farklı bir kategori dene veya filtreyi kaldırarak tüm ilanları gör.",
    actions: [
      { label: "Filtreyi Temizle", fn: "filterSwipeDeck(null,'')", style: "btn-primary" },
    ],
  });
}

/* 3. No Messages */
function messagesEmptyState() {
  return esHtml({
    tag: "💬 Henüz Mesaj Yok",
    illu: ES_SVG.bubble,
    title: "Mesaj kutun boş",
    sub: "Eşleşme oluştuktan sonra iş yerleriyle doğrudan mesajlaşabilirsin. İlk adımı sen at.",
    actions: [
      { label: "İlan Keşfet",       fn: "go('discover')", style: "btn-primary" },
      { label: "Eşleşmelerime Bak →", fn: "go('matches')", style: "btn-ghost"  },
    ],
    tip: "💡 Eşleşme oluştuktan sonra ilk 24 saat içinde mesaj atanların görüşmeye geçme oranı %78",
  });
}

/* 4. No Notifications */
function nfEmptyState() {
  return esHtml({
    tag: "🔔 Sessiz Bir Gün",
    illu: ES_SVG.bell,
    title: "Henüz bildirim yok",
    sub: "Yeni ilan, eşleşme veya mesaj geldiğinde burada anında görünecek.",
    actions: [
      { label: "İlan Keşfet", fn: "go('discover')", style: "btn-primary" },
    ],
    tip: "💡 Profil fotoğrafı ekleyenler %60 daha fazla ilgi alıyor",
  });
}

/* 5. Profile incomplete banner (injected at top of profile body) */
function pfIncompleteBanner(score) {
  if (score >= 85) return "";
  const missing = PF_STRENGTH_SEGS.filter(s => s.pct < 80).map(s => s.label);
  const circ    = 2 * Math.PI * 18;
  const fill    = (score / 100 * circ).toFixed(1);
  return `<div class="es-profile-banner">
    <div class="es-pb-top">
      <div class="es-pb-score">
        <div class="es-pb-ring">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--surface-2)" stroke-width="3"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke="#6C4EFF" stroke-width="3"
              stroke-dasharray="${fill} ${circ.toFixed(1)}" stroke-dashoffset="${(circ * 0.25).toFixed(1)}"
              stroke-linecap="round" transform="rotate(-90 22 22)"/>
          </svg>
          <span class="es-pb-pct">${score}%</span>
        </div>
        <div>
          <div class="es-pb-title">Profil Gücü</div>
          <div class="es-pb-sub">${score < 60 ? "Zayıf · Eşleşme oranı düşük" : "Orta · İyileştirilebilir"}</div>
        </div>
      </div>
      <button class="btn btn-primary" style="height:36px;font-size:13px;padding:0 16px;flex-shrink:0" onclick="go('settings-profile')">Tamamla</button>
    </div>
    ${missing.length ? `<div class="es-pb-missing">Eksik: ${missing.map(m => `<span class="es-pb-chip">${m}</span>`).join("")}</div>` : ""}
  </div>`;
}

/* 6–10 below — matches tabs, chat, interview, offline, match celebration */

function mcEmptyState(tab) {
  const configs = [
    { tag:"✦ İlk Eşleşme", illu:ES_SVG.puzzle,
      title:"İlk eşleşmen yakın",
      sub:"Beğendiğin bir yer de seni beğenince eşleşme oluşur. Keşfet ekranından ilgi göster.",
      actions:[
        {label:"İlan Keşfet",          fn:"go('discover')", style:"btn-primary"},
        {label:"Profili Güçlendir →",  fn:"go('profile')",  style:"btn-ghost"},
      ],
      tip:"💡 Eşleşme oranı yüksek profiller 3× daha hızlı eşleşiyor" },

    { tag:"💬 Aktif Sohbet Yok", illu:ES_SVG.bubble,
      title:"Konuşma henüz başlamadı",
      sub:"Yeni eşleşmene ilk mesajı sen gönder. Hızlı yanıt veren adaylar görüşmeye 4× daha sık davet ediliyor.",
      actions:[
        {label:"Eşleşmelerime Git", fn:"setMCTab(0)", style:"btn-primary"},
      ],
      tip:"💡 İlk 24 saatte mesaj atanların %78'i görüşmeye davet ediliyor" },

    { tag:"📅 Görüşme Bekleniyor", illu:ES_SVG.calendar,
      title:"Henüz görüşme daveti yok",
      sub:"Aktif konuşmalarında ilerleme sağlandıkça görüşme davetleri burada görünecek.",
      actions:[
        {label:"Aktif Konuşmalar", fn:"setMCTab(1)", style:"btn-primary"},
      ],
      tip:"💡 3 mesajın ardından görüşme teklifi alma ihtimali %65 artıyor" },

    { tag:"🏆 İşe Alım", illu:ES_SVG.heart,
      title:"Henüz işe alınmadın",
      sub:"Her görüşme değerli bir deneyim. İpucu: görüşme sonrası teşekkür mesajı gönderenler 2× daha çok işe alınıyor.",
      actions:[
        {label:"Görüşmelerime Git", fn:"setMCTab(2)", style:"btn-primary"},
      ],
      tip:"💡 Görüşme sonrası mesaj atanların işe alınma oranı 2× yüksek" },

    { tag:"☆ Kaydedilenler", illu:ES_SVG.compass,
      title:"Kaydedilen ilan yok",
      sub:"Kart kaydırırken yukarı kaydır ↑ veya ilan detayında kaydet butonuna bas.",
      actions:[
        {label:"İlan Keşfet", fn:"go('discover')", style:"btn-primary"},
      ],
      tip:"" },
  ];
  return esHtml(configs[tab] || configs[0]);
}

/* 8. First Match — enhanced celebration */
function matchCelebrationHtml(job) {
  const isFirst = state.swipe.likedIds.length === 1;
  return `<div class="ss">
    <div class="ss-confetti" id="ss-confetti"></div>
    <div class="ss-ring-wrap ml-success-ring">
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="48" fill="rgba(34,197,94,.1)" stroke="rgba(34,197,94,.3)" stroke-width="1.5"/>
        <circle cx="55" cy="55" r="32" fill="rgba(34,197,94,.15)" stroke="rgba(34,197,94,.45)" stroke-width="2"/>
        <text x="55" y="64" text-anchor="middle" font-size="28" fill="rgba(34,197,94,.9)">✦</text>
      </svg>
    </div>
    ${isFirst ? `<div class="es-tag ss-tag">🎉 İlk Eşleşmen!</div>` : `<div class="es-tag ss-tag">✦ Yeni Eşleşme</div>`}
    <h1 class="ss-title">${job ? job.company : "İşveren"} seni seçti</h1>
    <p class="ss-sub">${job ? `<strong>${job.title}</strong> pozisyonu için mesajlaşmaya başlayabilirsin.` : "Tebrikler! Karşılıklı ilgi oluştu."}</p>
    ${isFirst ? `<div class="ss-first-steps">
      <div class="ss-fs-hdr">Sıradaki adımlar</div>
      <div class="ss-fs-item"><span class="ss-fs-num">1</span>İlk mesajı gönder — samimi ve kısa tut</div>
      <div class="ss-fs-item"><span class="ss-fs-num">2</span>İlanı tekrar oku, pozisyonu anla</div>
      <div class="ss-fs-item"><span class="ss-fs-num">3</span>Görüşme daveti bekle</div>
    </div>` : ""}
    <div class="es-actions" style="margin-top:20px">
      <button class="btn btn-primary" onclick="go('messages')">Mesaj Gönder</button>
      <button class="btn btn-ghost"   onclick="go('discover')">Keşfetmeye Devam Et</button>
    </div>
  </div>`;
}

/* 9. First Conversation */
function chatEmptyState(companyName) {
  const starters = [
    "Merhaba! Mesajınızı aldım, çok heyecanlandım. Ne zaman müsaitsiniz?",
    "İyi günler. Pozisyon hakkında birkaç sorum olacak, uygun bir zaman var mı?",
    "Merhaba, ilginiz için teşekkürler! Detayları konuşmak isterim.",
  ];
  return `<div class="es es-chat-empty">
    <div class="es-illu">${ES_SVG.chat}</div>
    <h2 class="es-title">${companyName} seni seçti!</h2>
    <p class="es-sub">İlk mesajla iyi bir izlenim bırak. Kısa, samimi ve özgüvenli yaz.</p>
    <div class="es-starters">
      <div class="es-starters-hdr">Hazır Başlangıç Mesajları</div>
      ${starters.map(s => `<button class="es-starter-btn" onclick="useStarterMessage(this)">${s}</button>`).join("")}
    </div>
  </div>`;
}

/* 10. Interview confirmed */
function interviewSuccessHtml(opts = {}) {
  const { company = "Şirket", time = "Yarın 14:00", format = "Yüz yüze", address = "Kadıköy, İstanbul" } = opts;
  const circ = 2 * Math.PI * 32;
  return `<div class="ss">
    <div class="ss-check ml-success-ring">
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <circle cx="45" cy="45" r="38" fill="rgba(34,197,94,.1)" stroke="rgba(34,197,94,.35)" stroke-width="2"/>
        <path d="M27 45 L38 56 L63 30" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ml-check-path"/>
      </svg>
    </div>
    <div class="es-tag ss-tag">🎉 Görüşme Onaylandı</div>
    <h1 class="ss-title">${company} ile görüşmen hazır!</h1>
    <p class="ss-sub">Görüşme detaylarını kaydet ve hazırlığını erkenden tamamla.</p>
    <div class="ss-detail-card">
      <div class="ss-detail-row"><span class="ss-detail-ico">📅</span><span>${time}</span></div>
      <div class="ss-detail-row"><span class="ss-detail-ico">📍</span><span>${address}</span></div>
      <div class="ss-detail-row"><span class="ss-detail-ico">💬</span><span>${format}</span></div>
    </div>
    <div class="es-actions">
      <button class="btn btn-primary" onclick="go('matches')">Hazırlık İpuçlarını Gör</button>
      <button class="btn btn-ghost"   onclick="go('nearby')">Yol Tarifi →</button>
    </div>
    <div class="ss-next-steps">
      <div class="ss-ns-hdr">Görüşme Öncesi Kontrol Listesi</div>
      <div class="ss-ns-item"><span class="ss-ns-dot"></span>Şirketi araştır (web sitesi, sosyal medya)</div>
      <div class="ss-ns-item"><span class="ss-ns-dot"></span>Sık sorulan soruları hazırla</div>
      <div class="ss-ns-item"><span class="ss-ns-dot"></span>Konuma 10 dakika erken git</div>
      <div class="ss-ns-item"><span class="ss-ns-dot"></span>Görüşme sonrası teşekkür mesajı gönder</div>
    </div>
  </div>`;
}

/* Offline state */
function offlineState() {
  return esHtml({
    illu: ES_SVG.wifi,
    title: "Bağlantı kesildi",
    sub: "İnternet erişimi yok. Wi-Fi veya mobil verini kontrol et ve tekrar dene.",
    actions: [
      { label: "Tekrar Dene", fn: "location.reload()", style: "btn-primary" },
    ],
    tip: "Bağlantı kesildiğinde Keşfet ekranındaki kartlar çevrimdışı çalışmaya devam eder",
  });
}

function useStarterMessage(btn) {
  const inp = document.getElementById("chat-input");
  if (inp) {
    inp.value = btn.textContent.trim();
    inp.focus();
    const emptyEl = document.querySelector(".es-chat-empty");
    if (emptyEl) emptyEl.style.display = "none";
  }
}

function quickBrowseCard(job) {
  return `<div class="qbc" onclick="openJob(${job.id},'discover')">
    <div class="qbc-avatar" style="background:rgba(${job.hue},.18);color:rgba(${job.hue},1)">${job.initials}</div>
    <div class="qbc-body">
      <h4 class="qbc-role">${job.title}</h4>
      <p class="qbc-co">${job.company}</p>
      <p class="qbc-dist">${icon("ti-map-pin")} ${job.distance} km · ${icon("ti-walk")} ${job.travel.walk} dk</p>
    </div>
    <span class="score-pill ${scorePillClass(job.matchScore)}" style="align-self:center;flex-shrink:0">${job.matchScore}%</span>
  </div>`;
}

function updateDeckInfo() {
  const deck      = buildDiscoverDeck();
  const remaining = Math.max(0, deck.length - state.swipe.deckIndex);
  const dotsEl    = document.getElementById("dc-dots");
  const countEl   = document.getElementById("dc-count");
  const reasonEl  = document.getElementById("dc-algo-reason");
  const detailBtn = document.getElementById("dc-detail-btn");
  const job       = currentSwipeJob();

  if (dotsEl) dotsEl.innerHTML = Array.from({length: Math.min(5, remaining)}, (_, i) =>
    `<div class="dc-dot${i === 0 ? " dc-dot-active" : ""}"></div>`).join("");
  if (countEl)  countEl.textContent  = `${remaining} / ${deck.length}`;
  if (reasonEl) reasonEl.textContent = DC_ALGO_REASONS[state.swipe.deckIndex % DC_ALGO_REASONS.length];
  if (detailBtn && job) detailBtn.setAttribute("onclick", `openJob(${job.id},'discover')`);
}

function showLikeExplosion() {
  const stage = document.querySelector(".dc-stage");
  if (!stage) return;
  const ex = document.createElement("div");
  ex.className = "dc-like-explosion";
  ex.innerHTML = Array.from({length: 7}, (_, i) =>
    `<div class="dc-lh" style="--i:${i}">♥</div>`).join("");
  stage.appendChild(ex);
  mlParticles(ex, "#22c55e", 10);
  setTimeout(() => ex.remove(), 900);
}

function showSwipeToast(msg) {
  const wrap = document.querySelector(".dc-wrap");
  if (!wrap) return;
  const t = document.createElement("div");
  t.className = "dc-toast";
  t.textContent = msg;
  wrap.appendChild(t);
  requestAnimationFrame(() => t.classList.add("dc-toast-show"));
  setTimeout(() => { t.classList.remove("dc-toast-show"); setTimeout(() => t.remove(), 300); }, 2800);
}

function toggleSpeedMode() {
  state.speedMode = !state.speedMode;
  const btn   = document.getElementById("dc-speed-btn");
  const stage = document.querySelector(".dc-stage");
  if (btn)   btn.classList.toggle("dc-speed-active", state.speedMode);
  if (stage) stage.classList.toggle("dc-speed-mode", state.speedMode);
}

function renderDetailPane(job) {
  if (!job) return "";
  return `<div style="padding:24px 20px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="width:52px;height:52px;border-radius:var(--r-sm);background:linear-gradient(135deg,rgba(${job.hue},.3),rgba(${job.hue},.1));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:var(--text-2);">${job.initials}</div>
      <div><h2 style="font-size:18px;font-weight:800">${job.title}</h2><p style="font-size:13px;color:var(--text-2)">${job.company}</p></div>
      <span class="score-pill ${scorePillClass(job.matchScore)}" style="margin-left:auto">${job.matchScore}%</span>
    </div>
    <p style="font-size:14px;color:var(--text-2);line-height:1.6;margin-bottom:16px">${job.desc}</p>
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary" style="flex:1" onclick="openJob(${job.id},'discover')">Detayları Gör</button>
      <button class="btn btn-success" style="flex:1" onclick="swipeCard('right')">İlgileniyorum</button>
    </div>
  </div>`;
}

function renderDiscover() {
  const deck      = buildDiscoverDeck();
  const remaining = Math.max(0, deck.length - state.swipe.deckIndex);
  const job       = currentSwipeJob();
  const filter    = state.swipe.deckFilter || "";

  const cats = [
    {val:"",        label:"◉ Tümü"},
    {val:"Kafe",    label:"☕ Kafe"},
    {val:"Restoran",label:"🍽 Restoran"},
    {val:"Mağaza",  label:"🛍 Mağaza"},
    {val:"Kurye",   label:"📦 Kurye"},
    {val:"Çağrı",   label:"📞 Çağrı"},
  ];

  return screen(`
    <div class="dc-wrap">
      <header class="dc-topbar">
        <button class="dc-loc-btn" onclick="go('nearby')">
          ${icon("ti-map-pin")} Kadıköy <span style="opacity:.5;font-size:10px">▾</span>
        </button>
        <div class="topbar-logo">
          <div class="topbar-logo-mark">✦</div>
          <span class="topbar-logo-text">Keşfet</span>
        </div>
        <div style="display:flex;gap:2px">
          <button class="topbar-action${state.speedMode ? " dc-speed-active" : ""}" id="dc-speed-btn" onclick="toggleSpeedMode()" title="Hız Modu">⚡</button>
          <button class="topbar-action" onclick="go('notifications')">${icon("ti-bell")}</button>
        </div>
      </header>

      <div class="dc-chips" id="dc-filter-chips">
        ${cats.map(c => `<div class="chip${filter === c.val ? " active" : ""}" onclick="filterSwipeDeck(this,'${c.val}')">${c.label}</div>`).join("")}
      </div>

      ${dgDiscoverHeader()}

      <div class="dc-stage${state.speedMode ? " dc-speed-mode" : ""}" id="dc-stage">
        <div class="card-deck" id="card-deck">${renderCardDeck()}</div>
      </div>

      <div class="dc-deck-info">
        <div class="dc-dots" id="dc-dots">
          ${Array.from({length: Math.min(5, remaining)}, (_, i) =>
            `<div class="dc-dot${i === 0 ? " dc-dot-active" : ""}"></div>`).join("")}
        </div>
        <div class="dc-algo-reason" id="dc-algo-reason">${DC_ALGO_REASONS[state.swipe.deckIndex % DC_ALGO_REASONS.length]}</div>
        <span class="dc-count" id="dc-count">${remaining} / ${deck.length}</span>
      </div>

      <div class="dc-actions">
        <button class="dc-btn dc-undo"   onclick="undoSwipe()"                               title="Geri Al">${icon("ti-undo")}</button>
        <button class="dc-btn dc-pass"   onclick="swipeCard('left')"                         title="Geç">✕</button>
        <button class="dc-btn dc-detail" onclick="openJob(${job ? job.id : 1},'discover')"   title="Detay" id="dc-detail-btn">↑</button>
        <button class="dc-btn dc-like"   onclick="swipeCard('right')"                        title="İlgileniyorum">♥</button>
      </div>

      <div class="dc-quick-browse">
        <div class="dc-qb-hdr">
          <span class="dc-qb-title">Tüm fırsatlar</span>
          <span class="dc-qb-count">${deck.length} ilan</span>
        </div>
        <div class="h-scroll" style="padding:0 14px 16px;gap:8px">
          ${deck.map(j => quickBrowseCard(j)).join("")}
        </div>
      </div>
    </div>`, bottomNav(""));
}

/* JOB DETAIL */
function openJob(id, source) {
  state.detailJobId = String(id);
  state.detailSource = source || "home";
  go("job-detail");
}

/* ── JOB DETAIL HELPERS ──────────────────────────────────────── */
const JD_DAY_LABELS = ["Pt","Sa","Ça","Pe","Cu","Ct","Pz"];

function scheduleActiveDays(schedule) {
  const s = schedule.toLowerCase();
  if (s.includes("7 gün") || s.includes("esnek")) return [true,true,true,true,true,true,true];
  if (s.includes("hafta içi") || s.includes("haftaiçi")) return [true,true,true,true,true,false,false];
  if (s.includes("cumartesi") && (s.includes("pazar") || s.includes("–pazar"))) return [false,false,false,false,false,true,true];
  if (s.includes("cumartesi")) return [false,false,false,false,false,true,false];
  if (s.includes("pazar")) return [false,false,false,false,false,false,true];
  return [true,true,true,true,true,false,false];
}

function scheduleTimeStr(schedule) {
  const m = schedule.match(/(\d{1,2}:\d{2})\s*[–\-]\s*(\d{1,2}:\d{2})/);
  return m ? `${m[1]} – ${m[2]}` : "Esnek saatler";
}

function scheduleHours(schedule) {
  const m = schedule.match(/(\d{1,2}):\d{2}\s*[–\-]\s*(\d{1,2}):\d{2}/);
  if (!m) return "";
  const h = parseInt(m[2]) - parseInt(m[1]);
  return h > 0 ? `${h} saat/gün` : "";
}

function getMatchReasons(job) {
  const reasons = [];
  reasons.push(job.distance < 2 ? "Konumuna yürüme mesafesinde" : `Yalnızca ${job.distance} km uzakta`);
  reasons.push(job.matchScore >= 85 ? "Beceri profilin mükemmel uyum sağlıyor" : "Temel becerilerin bu role uyuyor");
  reasons.push(job.sal.min >= 480 ? "Ücret beklentini karşılıyor" : "Prim sistemiyle beklenti aşılabilir");
  const sched = job.schedule.toLowerCase();
  const dayHit = sched.includes("cumartesi") || sched.includes("esnek") || sched.includes("sonu");
  reasons.push(dayHit ? "Hafta sonu müsaitliğin var" : "Çalışma saatin bu ilanla uyuşuyor");
  return reasons;
}

function reqMatchesUser(req) {
  const r = req.toLowerCase();
  return user.skills.some(s =>
    s.toLowerCase().split(/[\s,]+/).some(w => w.length > 3 && r.includes(w))
  );
}

const JD_BENEFIT_ICONS = {
  "yemek ikramı":"🍽","servis ikramı":"💰","prim sistemi":"📈",
  "ulaşım desteği":"🚌","esnek saat":"⏰","yakıt desteği":"⛽",
  "hızlı ödeme":"💸","çalışan indirimi":"🏷","sgk":"🏥","yemek kartı":"💳",
};
function benefitIcon(b) { return JD_BENEFIT_ICONS[b.toLowerCase()] || "✦"; }

function jdScoreColor(s) { return s >= 90 ? "#22c55e" : s >= 70 ? "#6C4EFF" : "#f59e0b"; }

function setDetailMode(mode, btn) {
  const job = jobs.find(j => String(j.id) === String(state.detailJobId)) || jobs[0];
  document.querySelectorAll(".jd-tm").forEach(b => b.classList.remove("jd-tm-on"));
  btn.classList.add("jd-tm-on");
  const fill = document.getElementById("jd-dist-fill");
  const note = document.getElementById("jd-dist-note");
  const cfg = {
    walk:{ pct: Math.min(95, (job.travel.walk / 45) * 100), note:`${job.distance} km · Yürüyerek ${job.travel.walk} dakika` },
    bus: { pct: Math.min(95, (job.travel.bus  / 30) * 100), note:`${job.distance} km · Otobüsle ${job.travel.bus} dakika` },
    car: { pct: Math.min(95, (job.travel.car  / 20) * 100), note:`${job.distance} km · Arabayla ${job.travel.car} dakika` },
  };
  const c = cfg[mode];
  if (fill) fill.style.width = c.pct + "%";
  if (note) note.textContent = c.note;
}

function commitDetailInterest() {
  const job = jobs.find(j => String(j.id) === String(state.detailJobId)) || jobs[0];
  if (!state.swipe.likedIds.includes(job.id)) state.swipe.likedIds.push(job.id);
  state.swipe.lastAction = { direction:"right", job };
  navigator.vibrate?.([20, 30, 80]);
  go("match");
}

/* ─── MATCH VISUALIZATION SYSTEM ─────────────────────────────── */
function computeMatchDimensions(job) {
  const distScore = job.distance <= 0.6 ? 100 :
                    job.distance <= 1.2 ? 95  :
                    job.distance <= 2.0 ? 85  :
                    job.distance <= 3.0 ? 72  : 58;

  const matched    = job.req.filter(r => reqMatchesUser(r)).length;
  const skillScore = Math.min(100, Math.round(
    (matched / Math.max(1, job.req.length)) * 60 + job.matchScore * 0.4
  ));

  const sched = job.schedule.toLowerCase();
  const avail = user.availability.toLowerCase();
  let schedScore = 65;
  if ((sched.includes("cumartesi") || sched.includes("hafta sonu")) &&
      (avail.includes("hafta sonu") || avail.includes("cumartesi"))) schedScore = 96;
  else if (sched.includes("esnek"))                                    schedScore = 88;
  else if (sched.includes("hafta içi") && avail.includes("akşam"))    schedScore = 85;

  let salScore = 70;
  const uMin = 500, uMax = 700;
  if (job.sal.min >= uMin && job.sal.max <= uMax + 100)  salScore = 93;
  else if (job.sal.max >= uMin)                           salScore = 80;
  else                                                    salScore = 58;

  const interests = state.pfInterests || ["Yeme-İçme","Perakende","Hizmet"];
  const ctx = [job.title, job.company, ...(job.tags || [])].join(" ").toLowerCase();
  const imap = {
    "Yeme-İçme": ["barista","kafe","cafe","garson","restoran","aşçı","lezzet","masa","lumiere"],
    "Perakende": ["satış","mağaza","kasa","market","teknomarket","moda","plus"],
    "Hizmet":    ["çağrı","güvenlik","kurye","hizmet","call","safe","hızlı"],
  };
  let prefScore = 65;
  for (const int of interests) {
    if ((imap[int] || []).some(k => ctx.includes(k))) { prefScore = 92; break; }
  }

  return {
    distance:   { score:distScore, icon:"📍", label:"Konum Uyumu",
      note: distScore >= 90
        ? `✓ ${job.distance} km — Yürüme mesafesinde`
        : `${job.distance} km · ${job.travel.walk} dk yürüyüş` },
    skills:     { score:skillScore, icon:"🎯", label:"Beceri Uyumu",
      note: matched >= 2
        ? `✓ ${matched}/${job.req.length} gereksinim profilinde var`
        : `${matched}/${job.req.length} beceri eşleşiyor` },
    schedule:   { score:schedScore, icon:"📅", label:"Program Uyumu",
      note: schedScore >= 88
        ? "✓ Müsaitliğin bu ilanla birebir uyuşuyor"
        : "Kısmi uyum — programını gözden geçir" },
    salary:     { score:salScore, icon:"₺", label:"Ücret Uyumu",
      note: salScore >= 85
        ? `✓ ₺${job.sal.min}–${job.sal.max}/gün beklentine uygun`
        : `₺${job.sal.min}–${job.sal.max}/gün — yakın beklenti` },
    preference: { score:prefScore, icon:"✦", label:"Tercih Uyumu",
      note: prefScore >= 85
        ? "✓ İlgi alanlarınla örtüşüyor"
        : "Yeni bir sektör keşfetme fırsatı" },
  };
}

function mxGrade(score) {
  if (score >= 90) return { label:"Mükemmel Uyum", sub:"Seninle çok uyumlu" };
  if (score >= 80) return { label:"Güçlü Uyum",    sub:"Çoğu boyut eşleşiyor" };
  if (score >= 70) return { label:"İyi Uyum",       sub:"Temel gereksinimler karşılanıyor" };
  return              { label:"Kısmi Uyum",      sub:"Bazı farklılıklar var" };
}

function mxDimColor(s) {
  return s >= 85 ? "#22c55e" : s >= 65 ? "#6C4EFF" : "#f59e0b";
}

function mxDimHtml(dim, delayS) {
  const c     = mxDimColor(dim.score);
  const isGood = dim.score >= 80;
  return `
    <div class="mx-dim">
      <div class="mx-dim-row">
        <span class="mx-dim-icon">${dim.icon}</span>
        <span class="mx-dim-label">${dim.label}</span>
        <div class="mx-dim-track">
          <div class="mx-dim-fill"
            style="background:${c};--mx-w:${dim.score}%;--mx-delay:${delayS.toFixed(2)}s">
          </div>
        </div>
        <span class="mx-dim-pct" style="color:${c}">${dim.score}%</span>
      </div>
      <p class="mx-dim-note${isGood ? " mx-good" : " mx-warn"}">${dim.note}</p>
    </div>`;
}

function mxMiniHtml(job) {
  const dims = computeMatchDimensions(job);
  return `<div class="mx-mini">
    ${Object.values(dims).map(d => {
      const c = mxDimColor(d.score);
      return `<div class="mx-mini-bar" title="${d.label} ${d.score}%">
        <div class="mx-mini-fill" style="height:${d.score}%;background:${c}"></div>
      </div>`;
    }).join("")}
  </div>`;
}

function mxPanelHtml(job, sColor) {
  const dims  = computeMatchDimensions(job);
  const grade = mxGrade(job.matchScore);
  const ringOff2 = Math.round(151 * (1 - job.matchScore / 100));
  return `
    <div class="mx-panel">
      <div class="mx-head">
        <div class="mx-head-ring">
          <svg class="mx-ring-svg" viewBox="0 0 56 56">
            <circle class="mx-ring-bg" cx="28" cy="28" r="24"/>
            <circle class="mx-ring-arc" cx="28" cy="28" r="24"
              style="stroke:${sColor};--mx-ring-off:${ringOff2}"/>
          </svg>
          <div class="mx-ring-val" style="color:${sColor}">${job.matchScore}%</div>
        </div>
        <div class="mx-head-info">
          <div class="mx-grade-label" style="color:${sColor}">${grade.label}</div>
          <div class="mx-grade-sub">${grade.sub}</div>
          <div class="mx-overall-track">
            <div class="mx-overall-fill"
              style="background:${sColor};--mx-w:${job.matchScore}%;--mx-delay:0s">
            </div>
          </div>
        </div>
      </div>
      <div class="mx-why">Neden ${job.matchScore}% — 5 boyut</div>
      <div class="mx-dims">
        ${Object.values(dims).map((d, i) => mxDimHtml(d, 0.12 + i * 0.09)).join("")}
      </div>
      <div class="mx-edu">
        💡 Konum · Beceri · Program · Ücret · Tercih boyutlarının ortalaması
      </div>
    </div>`;
}

function renderJobDetail() {
  const job      = jobs.find(j => String(j.id) === String(state.detailJobId)) || jobs[0];
  const back     = state.detailSource === "discover" ? "discover" :
                   state.detailSource === "nearby"   ? "nearby"   : "home";
  const sColor   = jdScoreColor(job.matchScore);
  const ringOff  = Math.round(226 * (1 - job.matchScore / 100));
  const grad     = `linear-gradient(160deg,rgba(${job.hue},.85) 0%,rgba(${job.hue},.4) 55%,rgba(${job.hue},.15) 100%)`;
  const walkPct  = Math.min(95, (job.travel.walk / 45) * 100);
  const days     = scheduleActiveDays(job.schedule);
  const timeStr  = scheduleTimeStr(job.schedule);
  const hoursStr = scheduleHours(job.schedule);
  const reasons  = getMatchReasons(job);

  const daysHtml = JD_DAY_LABELS.map((d, i) =>
    `<div class="jd-day${days[i] ? " jd-day-on" : ""}">${d}</div>`
  ).join("");

  const reqHtml = job.req.map(r => {
    const matched = reqMatchesUser(r);
    return `<div class="jd-req ${matched ? "jd-req-yes" : "jd-req-open"}">
      <span class="jd-req-ic">${matched ? "✓" : "○"}</span>
      <div>
        <span class="jd-req-name">${r}</span>
        <span class="jd-req-tag ${matched ? "jd-rtag-yes" : "jd-rtag-open"}">${matched ? "Profilinde var" : "Geliştirilebilir"}</span>
      </div>
    </div>`;
  }).join("");

  const benefitsHtml = job.benefits.map(b =>
    `<div class="jd-benefit"><span class="jd-bic">${benefitIcon(b)}</span>${b}</div>`
  ).join("");

  return screen(`
    <div class="jd-hero" style="background:${grad}">
      <button class="jd-nav-btn jd-back" onclick="go('${back}')">←</button>
      <button class="jd-nav-btn jd-save">♡</button>

      <div class="jd-ring-wrap">
        <svg class="jd-ring-svg" viewBox="0 0 88 88">
          <circle class="jd-ring-bg" cx="44" cy="44" r="36"/>
          <circle class="jd-ring-arc" cx="44" cy="44" r="36"
            style="stroke:${sColor};--offset:${ringOff}"/>
        </svg>
        <div class="jd-hero-init">${job.initials}</div>
        <div class="jd-hero-score" style="color:${sColor}">${job.matchScore}%</div>
      </div>

      <div class="jd-hero-foot">
        <h1 class="jd-hero-title">${job.title}</h1>
        <p class="jd-hero-company">${job.company} · ${job.location || "Kadıköy, İstanbul"}</p>
        <div class="jd-hero-pills">
          <span class="jd-hpill">${job.sal.cur}${job.sal.min}/${job.sal.per}</span>
          <span class="jd-hpill">${job.distance} km</span>
          <span class="jd-hpill">${job.type}</span>
        </div>
      </div>
    </div>

    <div class="jd-body">

      ${mxPanelHtml(job, sColor)}

      <div class="jd-sec-hdr">Mesafe & Ulaşım</div>
      <div class="jd-card">
        <div class="jd-travel-row">
          <button class="jd-tm jd-tm-on" onclick="setDetailMode('walk',this)">
            🚶 ${job.travel.walk} dk<span>Yürüyerek</span>
          </button>
          <button class="jd-tm" onclick="setDetailMode('bus',this)">
            🚌 ${job.travel.bus} dk<span>Otobüs</span>
          </button>
          <button class="jd-tm" onclick="setDetailMode('car',this)">
            🚗 ${job.travel.car} dk<span>Araba</span>
          </button>
        </div>
        <div class="jd-dist-bar">
          <div class="jd-dist-fill" id="jd-dist-fill" style="width:${walkPct}%"></div>
        </div>
        <p class="jd-dist-note" id="jd-dist-note">${job.distance} km · Yürüyerek ${job.travel.walk} dakika</p>
      </div>

      <div class="jd-sec-hdr">Ücret</div>
      <div class="jd-card jd-sal-card">
        <div class="jd-sal-range">
          <span class="jd-sal-cur">${job.sal.cur}</span>${job.sal.min}
          <span class="jd-sal-dash"> – </span>
          <span class="jd-sal-cur">${job.sal.cur}</span>${job.sal.max}
          <span class="jd-sal-per">/${job.sal.per}</span>
        </div>
        <div class="jd-sal-tag">↑ Ücret beklentinin üzerinde</div>
      </div>

      <div class="jd-sec-hdr">Çalışma Takvimi</div>
      <div class="jd-card jd-sched-card">
        <div class="jd-days">${daysHtml}</div>
        <div class="jd-sched-row">
          <span class="jd-sched-time">${timeStr}</span>
          ${hoursStr ? `<span class="jd-sched-hrs">${hoursStr}</span>` : ""}
        </div>
        <span class="jd-type-pill">${job.type}</span>
      </div>

      <div class="jd-sec-hdr">İşletme</div>
      <div class="jd-card">
        <div class="jd-co-row">
          <div class="jd-co-init" style="background:rgba(${job.hue},.15);color:rgba(${job.hue},1)">${job.initials}</div>
          <div class="jd-co-info">
            <div class="jd-co-name">${job.company}</div>
            <div class="jd-co-meta">⭐ 4.8 · 127 işe alım · 3 yıllık üye</div>
          </div>
          <span class="jd-verified">✓ Onaylı</span>
        </div>
        <p class="jd-co-desc">${job.desc}</p>
      </div>

      <div class="jd-sec-hdr">Aranan Özellikler</div>
      <div class="jd-card"><div class="jd-reqs">${reqHtml}</div></div>

      <div class="jd-sec-hdr">Yan Haklar</div>
      <div class="jd-card"><div class="jd-benefits">${benefitsHtml}</div></div>

      <div style="height:6px"></div>
    </div>

    <div class="jd-cta-bar">
      <button class="jd-cta-sec" onclick="go('navigation')">🗺 Yol Tarifi</button>
      <button class="jd-cta-pri" onclick="commitDetailInterest()">♥ İlgileniyorum</button>
    </div>`);
}

/* MATCH CELEBRATION */
function renderMatch() {
  const last = state.swipe.lastAction;
  const job  = last ? last.job : jobs[0];
  const html = screen(matchCelebrationHtml(job));
  requestAnimationFrame(() => {
    const ring = document.querySelector(".ss-ring-wrap") || document.querySelector(".ss-check");
    if (ring) mlParticles(ring, "#22c55e", 14);
  });
  return html;
}

/* ─── NOTIFICATIONS v2 ─── */
const NF_FEED = [
  { id:"nf1", type:"match",
    company:"Cafe Lumiere", initials:"CL", hue:"108,78,255",
    role:"Barista", score:92, dist:1.2,
    title:"Yeni Eşleşme!",
    body:"Cafe Lumiere, Barista pozisyonu için seni seçti.",
    time:"Az önce", group:"today", unread:true, action:"chat" },

  { id:"nf2", type:"message",
    company:"Beyaz Masa", initials:"BM", hue:"28,111,215",
    title:"Yeni Mesaj",
    body:"\"Yarın sabah müsait misiniz? Sizi bekliyoruz.\"",
    time:"12 dk", group:"today", unread:true, action:"chat" },

  { id:"nf3", type:"interview",
    company:"Teknomarket", initials:"TM", hue:"245,158,11",
    title:"Görüşme Yarın!", detail:"Video Görüşme · 17 Haziran · 14:00",
    body:"Görüşmeye hazır ol — yarın saat 14:00'te başlıyor.",
    time:"1 saat", group:"today", unread:true, action:"interview" },

  { id:"nf4", type:"opportunity",
    title:"8 Yeni Fırsat Yakında",
    body:"Kadıköy bölgesinde sana uygun 8 yeni ilan eklendi.",
    time:"3 saat", group:"today", unread:false, action:"discover" },

  { id:"nf5", type:"profile",
    title:"3 İşveren Profilini İnceledi",
    body:"Bu hafta 3 farklı işveren profilinde zaman geçirdi.",
    time:"Dün", group:"yesterday", unread:false, action:"profile" },

  { id:"nf6", type:"tip",
    title:"Akıllı Öneri",
    body:"2 yetenek daha ekle — benzer profiller %30 daha fazla eşleşiyor.",
    time:"Dün", group:"yesterday", unread:false, action:"settings-profile" },

  { id:"nf7", type:"match",
    company:"Lezzet Durağı", initials:"LD", hue:"34,197,94",
    role:"Garson", score:78, dist:0.6,
    title:"Yeni Eşleşme",
    body:"Lezzet Durağı, Garson pozisyonu için seni seçti.",
    time:"2 gün önce", group:"week", unread:false, action:"chat" },

  { id:"nf8", type:"opportunity",
    title:"Haftalık Fırsat Özeti",
    body:"Bu hafta 14 yeni fırsat eklendi. En yüksek uyum: %92.",
    time:"3 gün önce", group:"week", unread:false, action:"discover" },
];

const NF_TYPE_META = {
  match:       { icon:"✦", bg:"rgba(108,78,255,.14)", label:"Eşleşme"  },
  message:     { icon:"💬", bg:"rgba(34,197,94,.12)",  label:"Mesaj"    },
  interview:   { icon:"📅", bg:"rgba(245,158,11,.14)", label:"Görüşme"  },
  opportunity: { icon:"📍", bg:"rgba(28,111,215,.12)", label:"Fırsatlar" },
  profile:     { icon:"👁", bg:"var(--surface-3)",     label:"Profil"   },
  tip:         { icon:"💡", bg:"var(--primary-dim)",   label:"Öneri"    },
};

function nfUnreadCount() {
  return NF_FEED.filter(n => n.unread).length;
}

/* ── Digest card (Activity tab top) ── */
function nfDigestCardHtml() {
  return `
    <div class="nf-digest" onclick="go('discover')">
      <div class="nf-digest-hd">
        <span class="nf-digest-loc">📍 Kadıköy · Bugün</span>
        <span class="nf-digest-tag">Günlük Özet</span>
      </div>
      <div class="nf-digest-stats">
        <div class="nf-ds-col">
          <span class="nf-ds-num">8</span>
          <span class="nf-ds-lbl">Yeni İlan</span>
        </div>
        <div class="nf-ds-div"></div>
        <div class="nf-ds-col">
          <span class="nf-ds-num" style="color:#22c55e">3</span>
          <span class="nf-ds-lbl">Yüksek Uyum</span>
        </div>
        <div class="nf-ds-div"></div>
        <div class="nf-ds-col">
          <span class="nf-ds-num" style="color:#1c6fd7">0.8</span>
          <span class="nf-ds-lbl">En Yakın km</span>
        </div>
      </div>
      <button class="nf-digest-cta">🔍 Bugün Keşfet →</button>
    </div>`;
}

/* ── Per-type card renderers ── */
function nfMatchCard(n, i) {
  const meta = NF_TYPE_META.match;
  return `
    <div class="nf-item nf-item-match${n.unread ? " nf-unread" : ""}" id="nf-${i}"
         onclick="go('${n.action}');markNotifRead('${n.id}')">
      <div class="nf-match-head">
        <div class="nf-av" style="background:rgba(${n.hue},.15);color:rgba(${n.hue},1)">
          ${n.initials}
        </div>
        <div class="nf-match-info">
          <span class="nf-type-tag" style="background:${meta.bg};color:rgba(${n.hue},1)">
            ${meta.icon} ${meta.label}
          </span>
          <div class="nf-match-name">${n.company}</div>
          <div class="nf-match-role">${n.role} · ${n.score}% · ${n.dist} km</div>
        </div>
        <span class="nf-time${n.unread ? " nf-time-new" : ""}">${n.time}</span>
      </div>
      <p class="nf-match-body">${n.body}</p>
      <button class="nf-cta" onclick="event.stopPropagation();go('chat')">
        💬 Mesaj Gönder
      </button>
    </div>`;
}

function nfMessageCard(n, i) {
  const meta = NF_TYPE_META.message;
  return `
    <div class="nf-item nf-item-msg${n.unread ? " nf-unread" : ""}" id="nf-${i}"
         onclick="go('${n.action}');markNotifRead('${n.id}')">
      <div class="nf-row">
        <div class="nf-icon" style="background:${meta.bg}">${meta.icon}</div>
        <div class="nf-body">
          <div class="nf-title-row">
            <span class="nf-title">${n.title}</span>
            ${n.unread ? '<span class="nf-dot"></span>' : ""}
          </div>
          <span class="nf-company">${n.company}</span>
          <p class="nf-preview">${n.body}</p>
        </div>
        <span class="nf-time">${n.time}</span>
      </div>
    </div>`;
}

function nfInterviewCard(n, i) {
  return `
    <div class="nf-item nf-item-iv${n.unread ? " nf-unread" : ""}" id="nf-${i}"
         onclick="go('${n.action}');markNotifRead('${n.id}')">
      <div class="nf-row">
        <div class="nf-icon nf-icon-iv">📅</div>
        <div class="nf-body">
          <div class="nf-title-row">
            <span class="nf-title">${n.title}</span>
            ${n.unread ? '<span class="nf-dot nf-dot-iv"></span>' : ""}
          </div>
          <span class="nf-iv-detail">${n.detail}</span>
          <p class="nf-preview">${n.body}</p>
        </div>
        <span class="nf-time">${n.time}</span>
      </div>
      <button class="nf-cta nf-cta-iv" onclick="event.stopPropagation();go('interview')">
        📋 Görüşme Detayları
      </button>
    </div>`;
}

function nfStandardCard(n, i) {
  const meta = NF_TYPE_META[n.type] || NF_TYPE_META.tip;
  return `
    <div class="nf-item${n.unread ? " nf-unread" : ""}" id="nf-${i}"
         onclick="go('${n.action}');markNotifRead('${n.id}')">
      <div class="nf-row">
        <div class="nf-icon" style="background:${meta.bg}">${meta.icon}</div>
        <div class="nf-body">
          <div class="nf-title-row">
            <span class="nf-title">${n.title}</span>
            ${n.unread ? '<span class="nf-dot"></span>' : ""}
          </div>
          <p class="nf-preview">${n.body}</p>
        </div>
        <span class="nf-time">${n.time}</span>
      </div>
    </div>`;
}

function nfItemHtml(n, i) {
  if (n.type === "match")     return nfMatchCard(n, i);
  if (n.type === "message")   return nfMessageCard(n, i);
  if (n.type === "interview") return nfInterviewCard(n, i);
  return nfStandardCard(n, i);
}

function nfGroupHtml(label, items) {
  if (!items.length) return "";
  return `
    <div class="nf-group-hdr">${label}</div>
    ${items.map((n, i) => nfItemHtml(n, NF_FEED.indexOf(n))).join("")}`;
}

function nfBodyContent(tab) {
  if (!NF_FEED.length) return nfEmptyState();
  if (tab === 1) {
    return nfDigestCardHtml() +
      NF_FEED.map((n, i) => nfItemHtml(n, i)).join("");
  }
  const today     = NF_FEED.filter(n => n.group === "today");
  const yesterday = NF_FEED.filter(n => n.group === "yesterday");
  const week      = NF_FEED.filter(n => n.group === "week");
  const body = nfGroupHtml("Bugün", today) +
    nfGroupHtml("Dün", yesterday) +
    nfGroupHtml("Bu Hafta", week);
  return body || nfEmptyState();
}

function setNFTab(tab) {
  state.nfTab = tab;
  const body = document.getElementById("nf-body");
  if (body) body.innerHTML = nfBodyContent(tab);
  document.querySelectorAll(".nf-tab").forEach((b, i) =>
    b.classList.toggle("nf-tab-on", i === tab));
}

function renderNotifications() {
  const unread = nfUnreadCount();
  return screen(`
    <div class="nf-header">
      <div class="nf-header-top">
        <h1 class="nf-header-title">Bildirimler</h1>
        <button class="nf-read-all" onclick="markAllRead()">Tümünü Oku</button>
      </div>
      <div class="nf-tabs">
        <button class="nf-tab nf-tab-on" onclick="setNFTab(0)">
          Bildirimler
          ${unread > 0 ? `<span class="nf-tab-badge">${unread}</span>` : ""}
        </button>
        <button class="nf-tab" onclick="setNFTab(1)">Aktivite</button>
      </div>
    </div>
    <div class="nf-body" id="nf-body">
      ${nfBodyContent(state.nfTab)}
    </div>
  `, bottomNav(""));
}

function markAllRead() {
  NF_FEED.forEach(n => { n.unread = false; });
  document.querySelectorAll(".nf-unread").forEach(el => el.classList.remove("nf-unread"));
  document.querySelectorAll(".nf-dot").forEach(el => el.remove());
  document.querySelectorAll(".nf-tab-badge").forEach(el => el.remove());
  document.querySelectorAll(".nf-time-new").forEach(el => el.classList.remove("nf-time-new"));
}

function markNotifRead(id) {
  const n = NF_FEED.find(x => x.id === id);
  if (n) n.unread = false;
}

function markNFRead(id) { markNotifRead(id); }

/* MATCHES */
/* ── MATCH CENTER HELPERS ──────────────────────────────────────── */
function mcCardNew(m) {
  return `
  <div class="mc-card mc-card-new" onclick="go('chat')">
    <div class="mc-card-head">
      <div class="mc-av" style="background:rgba(${m.hue},.18);color:rgba(${m.hue},1)">
        ${m.initials}<div class="mc-dot mc-dot-new"></div>
      </div>
      <div class="mc-info">
        <div class="mc-name">${m.name}</div>
        <div class="mc-role">${m.role}</div>
      </div>
      <div class="mc-meta">
        <span class="mc-time">${m.time}</span>
        ${m.unread ? `<span class="mc-unread">${m.unread}</span>` : ""}
      </div>
    </div>
    <div class="mc-preview">"${m.preview}"</div>
    <div class="mc-card-foot">
      <div class="mc-kpis">
        <span class="mc-kpi-score" style="color:${jdScoreColor(m.score)}">${m.score}%</span>
        <span class="mc-kpi-dot">·</span>
        <span class="mc-kpi-dist">${m.dist} km</span>
      </div>
      <span class="mc-sb mc-sb-new">✦ Yeni Eşleşme</span>
    </div>
    <div class="mc-actions">
      <button class="mc-act mc-act-ghost"
        onclick="event.stopPropagation();openJob(${m.jobId||1},'matches')">👤 Profil</button>
      <button class="mc-act mc-act-pri"
        onclick="event.stopPropagation();go('chat')">💬 Mesaj Gönder</button>
    </div>
  </div>`;
}

function mcCardActive(m) {
  return `
  <div class="mc-card" onclick="go('chat')">
    <div class="mc-card-head">
      <div class="mc-av" style="background:rgba(${m.hue},.18);color:rgba(${m.hue},1)">
        ${m.initials}<div class="mc-dot mc-dot-active"></div>
      </div>
      <div class="mc-info">
        <div class="mc-name">${m.name}</div>
        <div class="mc-role">${m.role}</div>
      </div>
      <div class="mc-meta">
        <span class="mc-time">${m.time}</span>
        ${m.unread ? `<span class="mc-unread">${m.unread}</span>` : ""}
      </div>
    </div>
    <div class="mc-preview">${m.preview}</div>
    <div class="mc-card-foot">
      <span class="mc-sb mc-sb-active">● Konuşma Devam Ediyor</span>
    </div>
  </div>`;
}

function mcCardInterview(m) {
  const iv = m.interview || {};
  return `
  <div class="mc-card mc-card-interview" onclick="go('interview')">
    <div class="mc-card-head">
      <div class="mc-av" style="background:rgba(${m.hue},.18);color:rgba(${m.hue},1)">
        ${m.initials}<div class="mc-dot mc-dot-interview"></div>
      </div>
      <div class="mc-info">
        <div class="mc-name">${m.name}</div>
        <div class="mc-role">${m.role}</div>
      </div>
      <span class="mc-sb mc-sb-interview">📅 Görüşme Var</span>
    </div>
    <div class="mc-iv-block">
      <div class="mc-iv-row">
        <span class="mc-iv-ic">📅</span>
        <span class="mc-iv-val">${iv.date||""} · ${iv.time||""}</span>
      </div>
      <div class="mc-iv-row">
        <span class="mc-iv-ic">🎥</span>
        <span class="mc-iv-val">${iv.type||"Görüşme"}</span>
      </div>
    </div>
    <div class="mc-actions">
      <button class="mc-act mc-act-ghost" onclick="event.stopPropagation()">🗺 Konum</button>
      <button class="mc-act mc-act-amber"
        onclick="event.stopPropagation();go('interview')">✓ Görüşmeye Git</button>
    </div>
  </div>`;
}

function mcCardHired(m) {
  return `
  <div class="mc-card mc-card-hired" onclick="go('chat')">
    <div class="mc-hired-banner">🏆 Tebrikler! Bu macera başlıyor.</div>
    <div class="mc-card-head">
      <div class="mc-av" style="background:rgba(${m.hue},.18);color:rgba(${m.hue},1)">
        ${m.initials}<div class="mc-dot mc-dot-hired"></div>
      </div>
      <div class="mc-info">
        <div class="mc-name">${m.name}</div>
        <div class="mc-role">${m.role}</div>
      </div>
      <span class="mc-time">${m.time}</span>
    </div>
    <p class="mc-hired-note">${m.preview}</p>
  </div>`;
}

function mcSavedContent() {
  const likedJobs = jobs.filter(j => state.swipe.likedIds.includes(j.id));
  const list = likedJobs.length
    ? likedJobs.map(j => ({jobId:j.id,initials:j.initials,name:j.company,role:j.title,
        savedAt:"Bugün",score:j.matchScore,dist:j.distance,type:j.type,hue:j.hue}))
    : MC_SAVED;
  if (!list.length) return mcEmptyState(4);
  return list.map(s => `
    <div class="mc-saved-card" onclick="openJob(${s.jobId||1},'matches')">
      <div class="mc-av" style="background:rgba(${s.hue},.18);color:rgba(${s.hue},1)">${s.initials}</div>
      <div class="mc-s-info">
        <div class="mc-s-name">${s.name}</div>
        <div class="mc-s-role">${s.role}</div>
        <div class="mc-s-meta">${s.score}% · ${s.dist} km · ${s.type}</div>
      </div>
      <div class="mc-s-right">
        <span class="mc-s-time">${s.savedAt} önce</span>
        <button class="mc-s-view"
          onclick="event.stopPropagation();openJob(${s.jobId||1},'matches')">Görüntüle →</button>
      </div>
    </div>`).join("") + `
    <div class="mc-reco-card">
      <span class="mc-reco-ic">⚡</span>
      <div>
        <div class="mc-reco-title">Dolmadan Karar Ver</div>
        <div class="mc-reco-sub">Kaydettiklerini hızlıca incele ve ilgi göster.</div>
      </div>
    </div>`;
}


function mcBodyContent(tab) {
  if (tab === 4) return mcSavedContent();
  const stageMap = [["new"],["chatting"],["interview"],["hired","offer"]];
  const stages   = stageMap[tab] || [];
  const items    = MC_MATCHES.filter(m => stages.includes(m.stage));
  if (!items.length) return mcEmptyState(tab);
  const cards = items.map(m => {
    if (stages[0] === "new")       return mcCardNew(m);
    if (stages[0] === "chatting")  return mcCardActive(m);
    if (stages[0] === "interview") return mcCardInterview(m);
    if (stages[0] === "hired")     return mcCardHired(m);
    return "";
  }).join("");
  return cards + `
    <div class="mc-reco-card">
      <span class="mc-reco-ic">💡</span>
      <div>
        <div class="mc-reco-title">Sürecini Hızlandır</div>
        <div class="mc-reco-sub">${MC_RECOS[tab] || MC_RECOS[0]}</div>
      </div>
    </div>`;
}

function mcPipelineHtml() {
  const cnt = {
    new:       MC_MATCHES.filter(m => m.stage === "new").length,
    chatting:  MC_MATCHES.filter(m => m.stage === "chatting").length,
    interview: MC_MATCHES.filter(m => m.stage === "interview").length,
    hired:     MC_MATCHES.filter(m => m.stage === "hired").length,
  };
  const nodes = [
    {label:"Yeni",    n:cnt.new,       c:"#22c55e"},
    {label:"Aktif",   n:cnt.chatting,  c:"#6C4EFF"},
    {label:"Görüşme", n:cnt.interview, c:"#f59e0b"},
    {label:"Alındı",  n:cnt.hired,     c:"#22c55e"},
  ];
  return `<div class="mc-pipe">
    ${nodes.map((nd, i) => `
      ${i > 0 ? `<div class="mc-pipe-line${nd.n > 0 ? " mc-pl-on" : ""}"></div>` : ""}
      <div class="mc-pipe-node">
        <div class="mc-pn-circle${nd.n > 0 ? " mc-pn-on" : ""}"
          style="${nd.n > 0 ? `background:${nd.c}` : ""}">
          ${nd.n > 0 ? nd.n : "·"}
        </div>
        <div class="mc-pn-label">${nd.label}</div>
      </div>`).join("")}
  </div>`;
}

function renderMatches() {
  const tab   = state.matchesTab;
  const newCt = MC_MATCHES.filter(m => m.stage === "new").length;
  const actCt = MC_MATCHES.filter(m => m.stage === "chatting").length;
  const ivCt  = MC_MATCHES.filter(m => m.stage === "interview").length;
  const tabs  = [
    {label:"✦ Yeni",    count:newCt},
    {label:"💬 Aktif",  count:actCt},
    {label:"📅 Görüşme",count:ivCt},
    {label:"🏆 Alındı", count:0},
    {label:"☆ Kayıtlı", count:0},
  ];
  return screen(`
    <header class="mc-topbar">
      <div>
        <h1 class="mc-topbar-title">Fırsat Merkezi</h1>
        <div class="mc-topbar-sub">${MC_MATCHES.length} aktif süreç</div>
      </div>
    </header>
    ${mcPipelineHtml()}
    <div class="mc-tabs">
      ${tabs.map((t, i) => `
        <button class="mc-tab${tab === i ? " mc-tab-on" : ""}" onclick="setMCTab(${i})">
          ${t.label}${t.count > 0 ? `<span class="mc-tab-ct">${t.count}</span>` : ""}
        </button>`).join("")}
    </div>
    <div class="mc-body" id="mc-body">
      ${mcBodyContent(tab)}
    </div>`, bottomNav("matches"));
}

/* MESSAGES */
function renderMessages() {
  const list = state.matchesList;
  const cards = list.length > 0
    ? list.map(m => {
        const co = m.jobs?.companies || {};
        const lastMsg = m.last_message;
        const preview = lastMsg ? lastMsg.content.slice(0, 60) : "Eşleşme oluştu! 🎉";
        const timeStr = lastMsg ? formatTime(lastMsg.created_at) : formatTime(m.created_at);
        return `
        <div class="match-card" onclick="openChat('${m.id}','${(co.name||"").replace(/'/g,"\\'")}','${co.initials||"?"}')">
          <div class="match-avatar">
            ${co.initials || "?"}
            <div class="match-status-dot dot-new"></div>
          </div>
          <div class="match-body">
            <h3>${co.name || "?"}</h3>
            <p class="role">${m.jobs?.title || ""}</p>
            <p class="preview">${preview}</p>
          </div>
          <div class="match-right">
            <span class="match-time">${timeStr}</span>
            ${m.unread_count > 0 ? `<span class="match-unread">${m.unread_count}</span>` : ""}
          </div>
        </div>`;
      }).join("")
    : matchItems.flat().map(m => `
        <div class="match-card" onclick="go('chat')">
          <div class="match-avatar">${m.initials}<div class="match-status-dot ${m.dot}"></div></div>
          <div class="match-body">
            <h3>${m.name}</h3><p class="role">${m.role}</p><p class="preview">${m.preview}</p>
          </div>
          <div class="match-right">
            <span class="match-time">${m.time}</span>
            ${m.unread > 0 ? `<span class="match-unread">${m.unread}</span>` : ""}
          </div>
        </div>`).join("");

  return screen(`
    ${topbar("Mesajlar")}
    <div class="screen-body">
      ${cards || messagesEmptyState()}
    </div>`, bottomNav("messages"));
}

/* ── CHAT HUB HELPERS ──────────────────────────────────────────── */
function getChatCtx() {
  const company = state.chatMatch?.company || "Cafe Lumiere";
  const inits   = state.chatMatch?.initials || "CL";
  return MC_MATCHES.find(m => m.name === company) || {
    name:company, initials:inits, role:"Barista", stage:"chatting",
    score:85, dist:1.2, hue:"108,78,255", jobId:1, interview:null,
  };
}

function chatQRHtml(stage) {
  const sets = {
    new:       ["👋 Merhaba!", "📋 CV göndereyim mi?", "📅 Ne zaman görüşebiliriz?", "✓ Müsaitim"],
    chatting:  ["✓ Müsaitim", "📅 Yarın 14:00 olur mu?", "📋 Belgeleri gönderdim", "❓ Sorum var"],
    interview: ["✓ Görüşmeye hazırım", "📅 Saati teyit eder misiniz?", "🔗 Link bekliyorum", "❓ Detay sorum var"],
    hired:     ["🏆 Teşekkürler!", "📅 Başlangıç tarihi onaylıyorum", "📋 Evrak gönderebilirim"],
  };
  return (sets[stage] || sets.chatting).map(r =>
    `<button class="ch-qr" onclick="sendQuickReply('${r.replace(/'/g,"\\'")}')">${r}</button>`
  ).join("");
}

function sendQuickReply(text) {
  const inp = document.getElementById("chat-input");
  if (inp) { inp.value = text; sendMessage(); }
}

function toggleChatAttach() {
  document.getElementById("ch-attach-sheet")?.classList.toggle("ch-attach-open");
}

function shareLocation() {
  const mc = getChatCtx();
  const html = `<div class="ch-loc-card">
    <div class="ch-lc-map">📍</div>
    <div class="ch-lc-info">
      <div class="ch-lc-name">${mc.name}</div>
      <div class="ch-lc-addr">Kadıköy, İstanbul · ${mc.dist} km</div>
    </div>
    <button class="ch-lc-btn" onclick="go('navigation')">Yol Tarifi Al →</button>
  </div>`;
  _appendChatBlock(html);
}

function shareDocument() {
  const html = `<div class="ch-doc-card">
    <span class="ch-dc-ic">📄</span>
    <div><div class="ch-dc-name">Selin_Kaya_CV.pdf</div>
    <div class="ch-dc-meta">PDF · 245 KB</div></div>
  </div>`;
  _appendChatBlock(html);
}

function shareProfile() {
  const html = `<div class="ch-doc-card">
    <span class="ch-dc-ic">👤</span>
    <div><div class="ch-dc-name">${user.name} — Profil</div>
    <div class="ch-dc-meta">${user.role} · ${user.experience}</div></div>
  </div>`;
  _appendChatBlock(html);
}

function proposeInterview() {
  const html = `<div class="ch-prop-card">
    <div class="ch-pc-hdr">📅 Görüşme Önerisi</div>
    <div class="ch-pc-opt">Yarın · 14:00</div>
    <div class="ch-pc-opt">Perşembe · 10:00</div>
    <div class="ch-pc-opt">Cuma · 16:00</div>
    <div class="ch-pc-note">Uygun gün seçilmesini bekliyorum.</div>
  </div>`;
  _appendChatBlock(html);
}

function acceptInterview() {
  const mc = getChatCtx();
  const iv = mc.interview || {date:"17 Haziran",time:"14:00"};
  const card = document.querySelector(".ch-iv-card");
  if (card) card.innerHTML = `<div class="ch-iv-accepted">✓ Görüşme Kabul Edildi — ${iv.date} · ${iv.time}</div>`;
  const now = new Date();
  const t   = now.getHours() + ":" + String(now.getMinutes()).padStart(2,"0");
  _appendMsg("from-me", "✓ Görüşmeyi kabul ettim, görüşürüz!", t);
}

function declineInterview() {
  document.querySelector(".ch-iv-card")?.remove();
  const now = new Date();
  const t   = now.getHours() + ":" + String(now.getMinutes()).padStart(2,"0");
  _appendMsg("from-me", "Bu saat maalesef uygun değil, başka bir zaman önerebilir misiniz?", t);
}

function _appendChatBlock(html) {
  const list = document.getElementById("messages-list");
  if (!list) return;
  const wrap = document.createElement("div");
  wrap.className = "ch-bub ch-bub-out";
  wrap.innerHTML = html;
  list.appendChild(wrap);
  list.scrollTop = list.scrollHeight;
}

/* CHAT */
function renderChat() {
  const mc       = getChatCtx();
  const stage    = mc.stage || "chatting";
  const hue      = mc.hue  || "108,78,255";
  const stageIdx = ["new","chatting","interview","hired"].indexOf(stage);
  const stageColors = {
    new:       {color:"#22c55e", label:"✦ Yeni Eşleşme"},
    chatting:  {color:"#6C4EFF", label:"💬 Konuşma"},
    interview: {color:"#f59e0b", label:"📅 Görüşme Var"},
    hired:     {color:"#22c55e", label:"🏆 İşe Alındı"},
  };
  const sc  = stageColors[stage] || stageColors.chatting;
  const iv  = mc.interview || null;
  const statusTxt = state.chatTyping ? "● Yazıyor..." : `● Çevrimiçi · ${mc.dist} km`;

  const bubbles = state.chatMatchId
    ? state.chatMessages.map(m => `
        <div class="ch-bub ${m.sender_type === "user" ? "ch-bub-out" : "ch-bub-in"}">
          <div class="ch-bub-text">${m.content}</div>
          <div class="ch-bub-meta">${formatTime(m.created_at)}${m.sender_type === "user" ? '<span class="ch-read">✓✓</span>' : ""}</div>
        </div>`)
    : state.messages.map(m => `
        <div class="ch-bub ${m.from === "me" ? "ch-bub-out" : "ch-bub-in"}">
          <div class="ch-bub-text">${m.text}</div>
          <div class="ch-bub-meta">${m.time}${m.from === "me" ? '<span class="ch-read">✓✓</span>' : ""}</div>
        </div>`);

  const ivCardHtml = `
    <div class="ch-iv-card">
      <div class="ch-iv-card-hdr">📅 Görüşme Daveti</div>
      <div class="ch-iv-detail">
        <div class="ch-iv-row"><span class="ch-iv-ic">📅</span><span>${iv ? iv.date : "17 Haziran"} · ${iv ? iv.time : "14:00"}</span></div>
        <div class="ch-iv-row"><span class="ch-iv-ic">🎥</span><span>${iv ? iv.type : "Video Görüşme"}</span></div>
        <div class="ch-iv-row"><span class="ch-iv-ic">📍</span><span>${mc.name} · ${mc.dist} km uzakta</span></div>
      </div>
      <div class="ch-iv-actions">
        <button class="ch-iv-decline" onclick="declineInterview()">✗ Başka Zaman</button>
        <button class="ch-iv-accept" onclick="acceptInterview()">✓ Kabul Et</button>
      </div>
    </div>`;

  const stepLabels = ["Eşleşme","Konuşma","Görüşme","İşe Alım"];

  return screen(`
    <div class="ch-ctx-bar">
      <button class="ch-back-btn" onclick="go('matches')">${icon("ti-arrow-left")}</button>
      <div class="ch-av" style="background:rgba(${hue},.2);color:rgba(${hue},1)">${mc.initials}</div>
      <div class="ch-ctx-info">
        <div class="ch-ctx-name">${mc.name}</div>
        <div class="ch-ctx-sub" id="chat-status">${statusTxt}</div>
      </div>
      <div class="ch-call-actions">
        <button class="ch-call-btn" onclick="startChatCall('audio')" title="Sesli arama" aria-label="Sesli arama">
          ${callIcon("phone")}
        </button>
        <button class="ch-call-btn" onclick="startChatCall('video')" title="Görüntülü arama" aria-label="Görüntülü arama">
          ${callIcon("video")}
        </button>
        <button class="ch-call-btn ch-job-btn" onclick="openJob(${mc.jobId||1},'chat')" title="İlanı gör" aria-label="İlanı gör">
          ${callIcon("briefcase")}
        </button>
      </div>
    </div>

    <div class="ch-stage-bar">
      <span class="ch-stage-label" style="color:${sc.color}">${sc.label}</span>
      <div class="ch-steps">
        ${stepLabels.map((s, i) => `
          <span class="ch-step${stageIdx >= i ? " ch-step-on" : ""}">${s}</span>
          ${i < 3 ? '<span class="ch-step-sep">›</span>' : ""}`).join("")}
      </div>
    </div>

    ${iv ? `
    <div class="ch-iv-banner">
      <div class="ch-iv-ban-l">
        <span class="ch-iv-ban-ic">📅</span>
        <div>
          <div class="ch-iv-ban-title">${iv.date} · ${iv.time}</div>
          <div class="ch-iv-ban-sub">${iv.type}</div>
        </div>
      </div>
      <button class="ch-iv-ban-cta" onclick="go('interview')">Hazırım →</button>
    </div>` : ""}

    <div class="ch-thread" id="messages-list">
      <div class="ch-sys">✦ ${mc.name} seninle eşleşti</div>
      ${bubbles.length === 0 ? chatEmptyState(mc.name) : bubbles.join("")}
      ${bubbles.length > 0 ? ivCardHtml : ""}
    </div>

    <div class="ch-qr-bar" id="ch-qr-bar">
      ${chatQRHtml(stage)}
    </div>

    <div class="ch-input-row">
      <button class="ch-attach-btn" onclick="toggleChatAttach()">＋</button>
      <input class="ch-input" id="chat-input" placeholder="Mesaj yaz..."
        onkeydown="if(event.key==='Enter')sendMessage()"
        oninput="onChatTyping()">
      <button class="ch-send-btn" onclick="sendMessage()">➤</button>
    </div>

    <div class="ch-attach-sheet" id="ch-attach-sheet">
      <div class="ch-as-handle"></div>
      <div class="ch-as-grid">
        <button class="ch-as-opt" onclick="shareLocation();toggleChatAttach()">
          <span class="ch-as-ic">📍</span><span class="ch-as-lbl">Konum</span>
        </button>
        <button class="ch-as-opt" onclick="shareDocument();toggleChatAttach()">
          <span class="ch-as-ic">📄</span><span class="ch-as-lbl">Belge</span>
        </button>
        <button class="ch-as-opt" onclick="proposeInterview();toggleChatAttach()">
          <span class="ch-as-ic">📅</span><span class="ch-as-lbl">Görüşme Öner</span>
        </button>
        <button class="ch-as-opt" onclick="shareProfile();toggleChatAttach()">
          <span class="ch-as-ic">👤</span><span class="ch-as-lbl">Profilim</span>
        </button>
      </div>
    </div>`);
}

/* CHAT CALLS — WebRTC media, Socket.IO signaling */
let _callSession = null;
let _callTimer = null;
let _callListenersReady = false;

function callIcon(name, size = 19) {
  const paths = {
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>',
    video:'<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/>',
    mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/>',
    micOff:'<path d="m2 2 20 20M9 9v1a3 3 0 0 0 4.7 2.5M15 9.3V5a3 3 0 0 0-5.6-1.5M17 16.7A7 7 0 0 0 19 10M5 10a7 7 0 0 0 11.7 5.2M12 19v3"/>',
    videoOff:'<path d="m2 2 20 20M10.7 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.7M18 9l3-2v10l-3-2M14 5h2a2 2 0 0 1 2 2v2"/>',
    speaker:'<path d="M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12"/>',
    hangup:'<path d="M4 15.5c4.8-4.2 11.2-4.2 16 0M7 13l-2 4M17 13l2 4"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.phone}</svg>`;
}

function getCallMatchId() {
  return state.chatMatchId || `demo-job-${getChatCtx().jobId || 1}`;
}

function callStatusText(status, type) {
  const kind = type === "video" ? "görüntülü" : "sesli";
  return {
    requesting:"Kamera ve mikrofon izni bekleniyor…",
    calling:`${kind[0].toUpperCase()+kind.slice(1)} arama yapılıyor…`,
    incoming:`Gelen ${kind} arama`,
    connecting:"Bağlanıyor…",
    active:"00:00",
    unavailable:"Şu anda ulaşılamıyor",
    rejected:"Arama reddedildi",
    ended:"Görüşme sona erdi",
    failed:"Bağlantı kurulamadı",
  }[status] || "Arama hazırlanıyor…";
}

function mountCallOverlay(status) {
  if (!_callSession) return;
  _callSession.status = status;
  const mc = getChatCtx();
  const person = !_callSession.isCaller && _callSession.caller
    ? { name:_callSession.caller.name || "Matchwork kullanıcısı", initials:_callSession.caller.initials || "MW" }
    : mc;
  let overlay = document.getElementById("ch-call-overlay");
  if (!overlay) {
    overlay = document.createElement("section");
    overlay.id = "ch-call-overlay";
    document.querySelector(".screen")?.appendChild(overlay);
  }
  const incoming = status === "incoming";
  const video = _callSession.type === "video";
  overlay.className = `ch-call-overlay${video ? " ch-call-video" : " ch-call-audio"}`;
  overlay.innerHTML = `
    <video class="ch-call-remote" id="ch-call-remote" autoplay playsinline></video>
    ${video ? '<video class="ch-call-local" id="ch-call-local" autoplay playsinline muted></video>' : ""}
    <div class="ch-call-shade"></div>
    <div class="ch-call-person">
      <div class="ch-call-avatar">${person.initials}</div>
      <h2>${person.name}</h2>
      <p id="ch-call-status">${callStatusText(status, _callSession.type)}</p>
    </div>
    <div class="ch-call-controls">
      ${incoming ? `
        <button class="ch-call-control ch-call-decline" onclick="rejectIncomingCall()">${callIcon("hangup",24)}<span>Reddet</span></button>
        <button class="ch-call-control ch-call-accept" onclick="acceptIncomingCall()">${callIcon(video?"video":"phone",24)}<span>Kabul Et</span></button>
      ` : `
        <button class="ch-call-control" id="ch-mute-btn" onclick="toggleCallMute()">${callIcon("mic",22)}<span>Sessiz</span></button>
        ${video ? `<button class="ch-call-control" id="ch-camera-btn" onclick="toggleCallCamera()">${callIcon("video",22)}<span>Kamera</span></button>` : `<button class="ch-call-control">${callIcon("speaker",22)}<span>Hoparlör</span></button>`}
        <button class="ch-call-control ch-call-decline" onclick="endChatCall()">${callIcon("hangup",24)}<span>Bitir</span></button>
      `}
    </div>`;
  attachCallMedia();
}

function attachCallMedia() {
  if (!_callSession) return;
  const remote = document.getElementById("ch-call-remote");
  const local = document.getElementById("ch-call-local");
  if (remote && _callSession.remoteStream) remote.srcObject = _callSession.remoteStream;
  if (local && _callSession.localStream) local.srcObject = _callSession.localStream;
}

async function getCallMedia(type) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
  return navigator.mediaDevices.getUserMedia({
    audio:{ echoCancellation:true, noiseSuppression:true, autoGainControl:true },
    video:type === "video" ? { facingMode:"user", width:{ideal:1280}, height:{ideal:720} } : false,
  });
}

function createCallPeer() {
  const pc = new RTCPeerConnection({ iceServers:[{ urls:"stun:stun.l.google.com:19302" }] });
  _callSession.pc = pc;
  _callSession.remoteStream = new MediaStream();
  _callSession.localStream?.getTracks().forEach(track => pc.addTrack(track, _callSession.localStream));
  pc.ontrack = event => {
    event.streams[0]?.getTracks().forEach(track => {
      if (!_callSession.remoteStream.getTracks().some(t => t.id === track.id)) _callSession.remoteStream.addTrack(track);
    });
    attachCallMedia();
  };
  pc.onicecandidate = event => {
    if (event.candidate) window.MW?.Socket.sendIce(_callSession.matchId, event.candidate);
  };
  pc.onconnectionstatechange = () => {
    if (!_callSession || pc !== _callSession.pc) return;
    if (pc.connectionState === "connected") activateChatCall();
    if (["failed","disconnected"].includes(pc.connectionState)) finishChatCall("failed", false);
  };
  return pc;
}

async function startChatCall(type) {
  if (_callSession) return;
  if (!window.MW?.Socket.connected) {
    dgEncouragementToast("Arama sunucusuna bağlanılamadı");
    return;
  }
  _callSession = { type, matchId:getCallMatchId(), isCaller:true, status:"requesting", pendingIce:[], startedAt:null };
  mountCallOverlay("requesting");
  try {
    _callSession.localStream = await getCallMedia(type);
    const pc = createCallPeer();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    window.MW.Socket.startCall({ matchId:_callSession.matchId, type, offer, caller:{ name:user.name, initials:user.initials } });
    mountCallOverlay("calling");
  } catch (error) {
    finishChatCall(error?.name === "NotAllowedError" ? "permission" : "failed", false);
  }
}

async function acceptIncomingCall() {
  if (!_callSession?.offer) return;
  mountCallOverlay("requesting");
  try {
    _callSession.localStream = await getCallMedia(_callSession.type);
    const pc = createCallPeer();
    await pc.setRemoteDescription(_callSession.offer);
    await flushCallIce();
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    window.MW.Socket.acceptCall(_callSession.matchId, answer);
    mountCallOverlay("connecting");
  } catch (error) {
    window.MW?.Socket.rejectCall(_callSession.matchId, "media-error");
    finishChatCall(error?.name === "NotAllowedError" ? "permission" : "failed", false);
  }
}

function rejectIncomingCall() {
  if (!_callSession) return;
  window.MW?.Socket.rejectCall(_callSession.matchId, "rejected");
  finishChatCall("ended", false, 0);
}

async function flushCallIce() {
  if (!_callSession?.pc?.remoteDescription) return;
  for (const candidate of _callSession.pendingIce.splice(0)) {
    try { await _callSession.pc.addIceCandidate(candidate); } catch (_) {}
  }
}

function activateChatCall() {
  if (!_callSession || _callSession.status === "active") return;
  _callSession.startedAt = Date.now();
  mountCallOverlay("active");
  clearInterval(_callTimer);
  _callTimer = setInterval(() => {
    const el = document.getElementById("ch-call-status");
    if (!el || !_callSession?.startedAt) return;
    const secs = Math.floor((Date.now() - _callSession.startedAt) / 1000);
    el.textContent = `${String(Math.floor(secs/60)).padStart(2,"0")}:${String(secs%60).padStart(2,"0")}`;
  }, 1000);
}

function toggleCallMute() {
  if (!_callSession?.localStream) return;
  _callSession.muted = !_callSession.muted;
  _callSession.localStream.getAudioTracks().forEach(t => t.enabled = !_callSession.muted);
  const btn = document.getElementById("ch-mute-btn");
  if (btn) { btn.classList.toggle("is-off", _callSession.muted); btn.innerHTML = `${callIcon(_callSession.muted?"micOff":"mic",22)}<span>${_callSession.muted?"Sesi Aç":"Sessiz"}</span>`; }
}

function toggleCallCamera() {
  if (!_callSession?.localStream) return;
  _callSession.cameraOff = !_callSession.cameraOff;
  _callSession.localStream.getVideoTracks().forEach(t => t.enabled = !_callSession.cameraOff);
  const btn = document.getElementById("ch-camera-btn");
  if (btn) { btn.classList.toggle("is-off", _callSession.cameraOff); btn.innerHTML = `${callIcon(_callSession.cameraOff?"videoOff":"video",22)}<span>${_callSession.cameraOff?"Kamerayı Aç":"Kamera"}</span>`; }
}

function endChatCall() {
  if (!_callSession) return;
  window.MW?.Socket.endCall(_callSession.matchId);
  finishChatCall("ended", false);
}

function finishChatCall(status="ended", notify=false, delay=1100) {
  if (!_callSession) return;
  if (notify) window.MW?.Socket.endCall(_callSession.matchId);
  _callSession.localStream?.getTracks().forEach(t => t.stop());
  _callSession.remoteStream?.getTracks().forEach(t => t.stop());
  _callSession.pc?.close();
  clearInterval(_callTimer);
  _callTimer = null;
  const el = document.getElementById("ch-call-status");
  if (el) el.textContent = status === "permission" ? "Mikrofon/kamera izni verilmedi" : callStatusText(status, _callSession.type);
  const overlay = document.getElementById("ch-call-overlay");
  const old = _callSession;
  setTimeout(() => { if (_callSession === old) { _callSession = null; overlay?.remove(); } }, delay);
}

/* ─── PROFILE v2 ─── */
const PF_STRENGTH_SEGS = [
  { label:"Kimlik",    pct:100 },
  { label:"Yetkinlik", pct:80  },
  { label:"Deneyim",   pct:60  },
  { label:"Müsaitlik", pct:100 },
  { label:"Tercihler", pct:40  },
];

function pfOverallScore() {
  return Math.round(PF_STRENGTH_SEGS.reduce((a,s) => a + s.pct, 0) / PF_STRENGTH_SEGS.length);
}

function pfSegColor(pct) {
  return pct >= 80 ? "#22c55e" : pct >= 50 ? "#6C4EFF" : "#f59e0b";
}

function pfStrengthHtml() {
  const score = pfOverallScore();
  const sColor = pfSegColor(score);
  const ringOff = Math.round(226 * (1 - score / 100));
  return `
    <div class="pf-strength">
      <div class="pf-s-ring-wrap">
        <svg class="pf-s-svg" viewBox="0 0 88 88">
          <circle class="pf-s-bg" cx="44" cy="44" r="36"/>
          <circle class="pf-s-arc" cx="44" cy="44" r="36"
            style="stroke:${sColor};--pf-offset:${ringOff}"/>
        </svg>
        <div class="pf-s-inner">
          <span class="pf-s-num" style="color:${sColor}">${score}</span>
          <span class="pf-s-lbl">Profil</span>
        </div>
      </div>
      <div class="pf-strength-segs">
        ${PF_STRENGTH_SEGS.map(s => `
          <div class="pf-seg-row">
            <span class="pf-seg-label">${s.label}</span>
            <div class="pf-seg-bar">
              <div class="pf-seg-fill" style="width:${s.pct}%;background:${pfSegColor(s.pct)}"></div>
            </div>
            <span class="pf-seg-pct" style="color:${pfSegColor(s.pct)}">${s.pct}%</span>
          </div>`).join("")}
        <p class="pf-strength-tip">💡 <b>Tercihlerini</b> tamamla — görünürlüğünü %40 artır</p>
      </div>
    </div>`;
}

const PF_SKILL_LEVELS = {
  "Kahve hazırlama":3,"Kasa kullanımı":3,"Müşteri iletişimi":3,
  "Ekip çalışması":2,"Ürün bilgisi":2,
};

function pfSkillDots(level) {
  return [1,2,3].map(i =>
    `<span class="pf-sk-dot${i<=level?" on":""}"></span>`
  ).join("");
}

function pfSkillsHtml() {
  return `
    <div class="pf-section">
      <div class="pf-sec-hdr">
        <span class="pf-sec-title">Yetkinlikler</span>
        <button class="pf-sec-edit" onclick="go('settings-profile')">+ Düzenle</button>
      </div>
      <div class="pf-skill-grid">
        ${user.skills.map(s => {
          const lvl = PF_SKILL_LEVELS[s] || 2;
          return `<div class="pf-skill-card">
            <div class="pf-sk-name">${s}</div>
            <div class="pf-sk-dots">${pfSkillDots(lvl)}</div>
          </div>`;
        }).join("")}
      </div>
      ${user.certs.length ? `<div class="pf-cert-row">
        ${user.certs.map(c => `<span class="pf-cert-chip">✦ ${c}</span>`).join("")}
      </div>` : ""}
    </div>`;
}

const PF_EXPERIENCE = [
  { role:"Barista", company:"The Roast Café", period:"Oca 2024 – Haz 2024", desc:"Kahve hazırlama, kasa işlemleri, müşteri iletişimi.", icon:"☕" },
  { role:"Satış Danışmanı", company:"Zara Kadıköy", period:"Eyl 2023 – Ara 2023", desc:"Ürün tanıtımı, stok takibi, kasa işlemleri.", icon:"🛍" },
];

function pfTimelineHtml() {
  return `
    <div class="pf-section">
      <div class="pf-sec-hdr">
        <span class="pf-sec-title">Deneyim</span>
        <button class="pf-sec-edit" onclick="go('settings-profile')">+ Ekle</button>
      </div>
      <div class="pf-timeline">
        ${PF_EXPERIENCE.map((e, i) => `
          <div class="pf-tl-item">
            <div class="pf-tl-left">
              <div class="pf-tl-icon">${e.icon}</div>
              ${i < PF_EXPERIENCE.length - 1 ? '<div class="pf-tl-line"></div>' : ""}
            </div>
            <div class="pf-tl-body">
              <div class="pf-tl-role">${e.role}</div>
              <div class="pf-tl-co">${e.company}</div>
              <div class="pf-tl-period">${e.period}</div>
              <div class="pf-tl-desc">${e.desc}</div>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

const PF_AVAIL_DAYS  = ["Pt","Sa","Ça","Pe","Cu","Ct","Pz"];
const PF_AVAIL_ON    = [false,false,false,false,false,true,true];
const PF_AVAIL_TIMES = [
  { label:"Sabah",  icon:"🌅", on:false },
  { label:"Öğlen",  icon:"☀️", on:false },
  { label:"Akşam",  icon:"🌙", on:true  },
];

function pfAvailHtml() {
  return `
    <div class="pf-section">
      <div class="pf-sec-hdr">
        <span class="pf-sec-title">Müsaitlik</span>
        <button class="pf-sec-edit" onclick="go('settings-prefs')">Düzenle</button>
      </div>
      <div class="pf-avail-days">
        ${PF_AVAIL_DAYS.map((d, i) => `
          <div class="pf-avail-day${PF_AVAIL_ON[i] ? " on" : ""}">
            <span>${d}</span>
          </div>`).join("")}
      </div>
      <div class="pf-avail-times">
        ${PF_AVAIL_TIMES.map(t => `
          <div class="pf-avail-time${t.on ? " on" : ""}">
            <span class="pf-avail-t-icon">${t.icon}</span>
            <span>${t.label}</span>
          </div>`).join("")}
      </div>
      <p class="pf-avail-note">⚡ ${user.availability}</p>
    </div>`;
}

const PF_WORK_STYLES = [
  { id:"flexible", icon:"🔀", label:"Esnek"     },
  { id:"morning",  icon:"🌅", label:"Sabahçı"   },
  { id:"evening",  icon:"🌙", label:"Akşamcı"   },
  { id:"teamwork", icon:"👥", label:"Ekip"      },
  { id:"solo",     icon:"🎯", label:"Bireysel"  },
  { id:"physical", icon:"💪", label:"Aktif"     },
];

const PF_INTERESTS = [
  { icon:"☕", label:"Yeme-İçme" },
  { icon:"🛍", label:"Perakende" },
  { icon:"💆", label:"Hizmet"    },
  { icon:"📦", label:"Lojistik"  },
  { icon:"🎨", label:"Yaratıcı" },
  { icon:"📚", label:"Eğitim"    },
];

function pfPrefsHtml() {
  const ws  = state.pfWorkStyles;
  const wi  = state.pfInterests;
  return `
    <div class="pf-section">
      <div class="pf-sec-hdr">
        <span class="pf-sec-title">Çalışma Tarzı</span>
      </div>
      <div class="pf-style-grid">
        ${PF_WORK_STYLES.map(s => `
          <div class="pf-style-card${ws.includes(s.id) ? " on" : ""}"
               onclick="togglePfStyle('${s.id}')">
            <span class="pf-style-icon">${s.icon}</span>
            <span class="pf-style-label">${s.label}</span>
          </div>`).join("")}
      </div>
    </div>
    <div class="pf-section">
      <div class="pf-sec-hdr">
        <span class="pf-sec-title">İlgi Alanları</span>
      </div>
      <div class="pf-interest-row">
        ${PF_INTERESTS.map(p => `
          <div class="pf-interest-chip${wi.includes(p.label) ? " on" : ""}"
               onclick="togglePfInterest('${p.label}')">
            ${p.icon} ${p.label}
          </div>`).join("")}
      </div>
    </div>
    <div class="pf-section">
      <div class="pf-sec-hdr">
        <span class="pf-sec-title">Ücret Beklentisi</span>
      </div>
      <div class="pf-salary-display">
        <span class="pf-sal-min">₺500</span>
        <span class="pf-sal-sep">—</span>
        <span class="pf-sal-max">₺700</span>
        <span class="pf-sal-unit">/gün</span>
      </div>
      <div class="pf-sal-track">
        <div class="pf-sal-fill"></div>
        <div class="pf-sal-thumb" style="left:29%"></div>
        <div class="pf-sal-thumb" style="left:57%"></div>
      </div>
      <div class="pf-sal-labels"><span>₺300</span><span>₺1.000</span></div>
    </div>`;
}

function togglePfStyle(id) {
  const idx = state.pfWorkStyles.indexOf(id);
  if (idx >= 0) state.pfWorkStyles.splice(idx, 1);
  else state.pfWorkStyles.push(id);
  document.querySelectorAll(".pf-style-card").forEach(el => {
    const elId = el.getAttribute("onclick").match(/'([^']+)'/)?.[1];
    if (elId) el.classList.toggle("on", state.pfWorkStyles.includes(elId));
  });
}

function togglePfInterest(label) {
  const idx = state.pfInterests.indexOf(label);
  if (idx >= 0) state.pfInterests.splice(idx, 1);
  else state.pfInterests.push(label);
  document.querySelectorAll(".pf-interest-chip").forEach(el => {
    const elLabel = el.getAttribute("onclick").match(/'([^']+)'/)?.[1];
    if (elLabel) el.classList.toggle("on", state.pfInterests.includes(elLabel));
  });
}

function renderProfile() {
  const score  = pfOverallScore();
  const sColor = pfSegColor(score);
  const ringOff = Math.round(226 * (1 - score / 100));
  return screen(`
    <div class="pf-cover">
      <div class="pf-cover-top">
        <div class="pf-cover-title">Profilim</div>
        <button class="pf-settings-btn" onclick="go('settings')">⚙</button>
      </div>
      <div class="pf-identity">
        <div class="pf-avatar-wrap">
          <svg class="pf-av-svg" viewBox="0 0 88 88">
            <circle class="pf-av-bg" cx="44" cy="44" r="36"/>
            <circle class="pf-av-arc" cx="44" cy="44" r="36"
              style="stroke:${sColor};--pf-offset:${ringOff}"/>
          </svg>
          <div class="pf-avatar">${user.initials}</div>
        </div>
        <div class="pf-identity-info">
          <div class="pf-name-row">
            <h1 class="pf-name">${user.name}</h1>
            <span class="pf-verified">✦ Doğrulandı</span>
          </div>
          <p class="pf-role">${user.role}</p>
          <p class="pf-loc">📍 ${user.location}</p>
          <div class="pf-tag-chips">
            <span class="pf-tagchip">⚡ ${user.experience}</span>
            <span class="pf-tagchip">★ ${user.rating}</span>
            <span class="pf-tagchip">📩 ${user.responseRate}</span>
          </div>
        </div>
      </div>
      <div class="pf-score-pill" style="color:${sColor};border-color:${sColor}">
        <span class="pf-score-n">${score}</span>
        <span class="pf-score-t">Profil Puanı</span>
      </div>
    </div>
    <div class="pf-completion-bar">
      ${PF_STRENGTH_SEGS.map(s => `
        <div class="pf-cb-seg"
          style="background:${pfSegColor(s.pct)};opacity:${(s.pct/100).toFixed(2)}"
          title="${s.label} · ${s.pct}%"></div>`).join("")}
    </div>
    <div class="pf-body">
      ${pfIncompleteBanner(pfOverallScore())}
      ${pfStrengthHtml()}
      ${pfSkillsHtml()}
      ${pfTimelineHtml()}
      ${pfAvailHtml()}
      ${pfPrefsHtml()}
      <div class="pf-section pf-actions">
        <button class="pf-action-btn" onclick="go('settings')">⚙ Ayarlar</button>
        <button class="pf-action-btn pf-action-share">↗ Profili Paylaş</button>
      </div>
    </div>
  `, bottomNav("profile"));
}

/* SETTINGS */
function renderSettings() {
  const dark = document.body.classList.contains("light-mode") ? false : true;
  return screen(`
    ${topbar("Ayarlar", "profile")}
    <div class="screen-body">
      <div class="settings-group">
        <p class="settings-group-title">Hesap</p>
        <div class="settings-row" onclick="go('settings-profile')"><div class="settings-row-icon" style="background:var(--primary-dim);color:var(--primary)">⊙</div><div class="settings-row-body"><h3>Profil Düzenle</h3><p>İsim, fotoğraf, beceriler</p></div><span class="settings-row-right">→</span></div>
        <div class="settings-row" onclick="go('settings-verify')"><div class="settings-row-icon" style="background:var(--success-dim);color:var(--success)">◈</div><div class="settings-row-body"><h3>Kimlik Doğrulama</h3><p>Doğrulandı ✓</p></div><span class="settings-row-right">→</span></div>
        <div class="settings-row" onclick="go('settings-notifs')"><div class="settings-row-icon" style="background:var(--warning-dim);color:var(--warning)">◉</div><div class="settings-row-body"><h3>Bildirimler</h3><p>Push, e-posta ayarları</p></div><span class="settings-row-right">→</span></div>
      </div>
      <div class="settings-group">
        <p class="settings-group-title">Tercihler</p>
        <div class="settings-row" onclick="go('settings-prefs')"><div class="settings-row-icon" style="background:var(--surface-3);color:var(--text-2)">⊞</div><div class="settings-row-body"><h3>İş Tercihleri</h3><p>${user.availability}</p></div><span class="settings-row-right">→</span></div>
        <div class="settings-row" onclick="go('settings-location')"><div class="settings-row-icon" style="background:var(--surface-3);color:var(--text-2)">◉</div><div class="settings-row-body"><h3>Konum</h3><p>${user.location}</p></div><span class="settings-row-right">→</span></div>
        <div class="settings-row" onclick="toggleDarkMode()">
          <div class="settings-row-icon" style="background:var(--surface-3);color:var(--text-2)">⌘</div>
          <div class="settings-row-body"><h3>Karanlık Mod</h3><p>Uygulama genelinde</p></div>
          <div class="toggle${dark?" on":""}"><div class="toggle-knob"></div></div>
        </div>
      </div>
      <div class="settings-group">
        <p class="settings-group-title">Uygulama</p>
        <div class="settings-row" onclick="go('settings-about')"><div class="settings-row-icon" style="background:var(--surface-3);color:var(--text-2)">⋄</div><div class="settings-row-body"><h3>Hakkında</h3><p>Matchwork v2.0</p></div><span class="settings-row-right">→</span></div>
        <div class="settings-row" onclick="doLogout()"><div class="settings-row-icon" style="background:var(--danger-dim);color:var(--danger)">✕</div><div class="settings-row-body"><h3 style="color:var(--danger)">Çıkış Yap</h3></div></div>
      </div>
    </div>`, bottomNav(""));
}

/* SETTINGS SUB-SCREENS */
function renderSettingsProfile() {
  return screen(`
    ${topbar("Profil Düzenle", "settings")}
    <div class="screen-body">
      <div class="settings-group">
        <p class="settings-group-title">Kişisel Bilgiler</p>
        <div class="input-group"><label class="input-label">Tam Ad</label>
          <input class="input-field" id="sp-name" value="${user.name}"></div>
        <div class="input-group"><label class="input-label">Rol / Unvan</label>
          <input class="input-field" id="sp-role" value="${user.role}"></div>
        <div class="input-group"><label class="input-label">Konum</label>
          <input class="input-field" id="sp-location" value="${user.location}"></div>
        <div class="input-group"><label class="input-label">Deneyim</label>
          <input class="input-field" id="sp-exp" value="${user.experience}"></div>
        <div class="input-group"><label class="input-label">Müsaitlik</label>
          <input class="input-field" id="sp-avail" value="${user.availability}"></div>
      </div>
      <div class="settings-group">
        <p class="settings-group-title">Yetenekler</p>
        <div class="skill-grid" style="padding:0 2px 12px">
          ${user.skills.map((s,i) => `<span class="skill-chip" onclick="removeSkill(${i})" title="Kaldır">${s} ✕</span>`).join("")}
          <span class="skill-chip" style="border-style:dashed;opacity:.7" onclick="addSkill()">+ Ekle</span>
        </div>
      </div>
      <div style="padding:16px 18px 32px;display:flex;gap:12px">
        <button class="btn btn-ghost" style="flex:1" onclick="go('settings')">Vazgeç</button>
        <button class="btn btn-primary" style="flex:2" onclick="saveProfile()">Kaydet</button>
      </div>
    </div>`);
}

function renderSettingsVerify() {
  return screen(`
    ${topbar("Kimlik Doğrulama", "settings")}
    <div class="screen-body" style="text-align:center;padding-top:48px">
      <div style="width:80px;height:80px;border-radius:50%;background:var(--success-dim);display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 20px">✓</div>
      <h2 style="font-size:22px;font-weight:800;margin-bottom:8px">Kimliğin Doğrulandı</h2>
      <p class="body-sm" style="max-width:260px;margin:0 auto 32px;color:var(--text-2)">Kimlik doğrulaman tamamlandı. İşverenler profilinde doğrulama rozetini görebilir.</p>
      <div class="settings-group" style="text-align:left">
        <div class="settings-row"><div class="settings-row-icon" style="background:var(--success-dim);color:var(--success)">✓</div><div class="settings-row-body"><h3>TC Kimlik</h3><p>Doğrulandı · ${new Date().toLocaleDateString('tr-TR')}</p></div></div>
        <div class="settings-row"><div class="settings-row-icon" style="background:var(--success-dim);color:var(--success)">✓</div><div class="settings-row-body"><h3>E-posta</h3><p>selin@demo.com · Doğrulandı</p></div></div>
        <div class="settings-row"><div class="settings-row-icon" style="background:var(--surface-3);color:var(--text-3)">◎</div><div class="settings-row-body"><h3>Telefon</h3><p>Henüz doğrulanmadı</p></div><span class="settings-row-right" style="color:var(--primary);font-size:12px">Doğrula</span></div>
      </div>
    </div>`);
}

function renderSettingsNotifs() {
  const prefs = state.notifPrefs;
  const row = (key, title, sub) => `
    <div class="settings-row" onclick="toggleNotifPref('${key}')">
      <div class="settings-row-body"><h3>${title}</h3><p>${sub}</p></div>
      <div class="toggle${prefs[key]?" on":""}"><div class="toggle-knob"></div></div>
    </div>`;
  return screen(`
    ${topbar("Bildirimler", "settings")}
    <div class="screen-body">
      <div class="settings-group">
        <p class="settings-group-title">Push Bildirimleri</p>
        ${row("match",   "Yeni Eşleşme",          "Biri seni beğendiğinde")}
        ${row("message", "Mesajlar",               "Yeni mesaj geldiğinde")}
        ${row("interview","Görüşme Hatırlatması",  "Görüşme öncesi uyarı")}
      </div>
      <div class="settings-group">
        <p class="settings-group-title">E-posta</p>
        ${row("email",   "Haftalık Özet",          "İş ve eşleşme özeti")}
        ${row("promo",   "Kampanyalar",            "Fırsatlar ve yenilikler")}
      </div>
    </div>`);
}

function renderSettingsPrefs() {
  const types = ["Tam zamanlı","Yarı zamanlı","Serbest","Staj"];
  const radii = ["1 km","3 km","5 km","10 km"];
  return screen(`
    ${topbar("İş Tercihleri", "settings")}
    <div class="screen-body">
      <div class="settings-group">
        <p class="settings-group-title">İş Tipi</p>
        <div class="skill-grid" style="padding:8px 2px 12px">
          ${types.map(t => `<span class="skill-chip${state.prefTypes.includes(t)?" selected":""}" onclick="togglePrefType('${t}')" style="${state.prefTypes.includes(t)?"background:var(--primary-dim);color:var(--primary);border-color:var(--primary)":""}">${t}</span>`).join("")}
        </div>
      </div>
      <div class="settings-group">
        <p class="settings-group-title">Mesafe</p>
        <div style="display:flex;gap:8px;padding:8px 2px 12px;flex-wrap:wrap">
          ${radii.map(r => `<span class="skill-chip${state.prefRadius===r?" selected":""}" onclick="setPrefRadius('${r}')" style="${state.prefRadius===r?"background:var(--primary-dim);color:var(--primary);border-color:var(--primary)":""}">${r}</span>`).join("")}
        </div>
      </div>
      <div style="padding:16px 18px 32px">
        <button class="btn btn-primary btn-full" onclick="go('settings')">Kaydet</button>
      </div>
    </div>`);
}

function renderSettingsLocation() {
  const loc = window.MW?.Location.current || { lat: 40.9906, lng: 29.0250 };
  return screen(`
    ${topbar("Konum", "settings")}
    <div class="screen-body">
      <div class="settings-group">
        <p class="settings-group-title">Mevcut Konum</p>
        <div class="settings-row">
          <div class="settings-row-icon" style="background:var(--primary-dim);color:var(--primary)">◉</div>
          <div class="settings-row-body"><h3>${user.location}</h3><p>${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</p></div>
        </div>
      </div>
      <div style="padding:16px 18px">
        <button class="btn btn-primary btn-full" onclick="refreshLocation()">
          ${icon("ti-map-pin")} GPS ile Güncelle
        </button>
      </div>
      <div class="settings-group">
        <p class="settings-group-title">Arama Yarıçapı</p>
        <div style="display:flex;gap:8px;padding:8px 2px 12px;flex-wrap:wrap">
          ${["1 km","3 km","5 km","10 km"].map(r => `<span class="skill-chip${state.prefRadius===r?" selected":""}" onclick="setPrefRadius('${r}')" style="${state.prefRadius===r?"background:var(--primary-dim);color:var(--primary);border-color:var(--primary)":""}">${r}</span>`).join("")}
        </div>
      </div>
    </div>`);
}

function renderSettingsAbout() {
  return screen(`
    ${topbar("Hakkında", "settings")}
    <div class="screen-body" style="text-align:center;padding-top:40px">
      <div style="width:64px;height:64px;border-radius:18px;background:var(--primary-dim);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px">✦</div>
      <h2 style="font-size:22px;font-weight:900;margin-bottom:4px">Matchwork</h2>
      <p style="color:var(--text-3);font-size:13px;margin-bottom:32px">Versiyon 2.0.0</p>
      <div class="settings-group" style="text-align:left">
        <p class="settings-group-title">Teknoloji</p>
        <div class="settings-row"><div class="settings-row-icon" style="background:var(--success-dim);color:var(--success)">◈</div><div class="settings-row-body"><h3>Supabase</h3><p>Veritabanı & Auth</p></div></div>
        <div class="settings-row"><div class="settings-row-icon" style="background:var(--primary-dim);color:var(--primary)">⌾</div><div class="settings-row-body"><h3>Socket.io</h3><p>Gerçek zamanlı mesajlaşma</p></div></div>
        <div class="settings-row"><div class="settings-row-icon" style="background:var(--warning-dim);color:var(--warning)">◉</div><div class="settings-row-body"><h3>Leaflet.js</h3><p>İnteraktif harita</p></div></div>
      </div>
      <div class="settings-group" style="text-align:left">
        <p class="settings-group-title">Bağlantılar</p>
        <div class="settings-row"><div class="settings-row-body"><h3>GitHub</h3><p>github.com/kadiryar571-eng/WinderApk</p></div><span class="settings-row-right">↗</span></div>
        <div class="settings-row"><div class="settings-row-body"><h3>Gizlilik Politikası</h3><p>Verileriniz güvende</p></div><span class="settings-row-right">→</span></div>
      </div>
    </div>`);
}

/* INTERVIEW */
function renderInterview() {
  const iv = state.activeInterview || matchItems[2][0] || {};
  const co = iv.name || "Şirket";
  const coInit = iv.initials || co.slice(0,2).toUpperCase();
  const role = iv.role || "Pozisyon";
  const d = new Date(); d.setDate(d.getDate() + 3);
  const dateDay = iv.date || d.getDate();
  const dateMon = iv.month || d.toLocaleDateString("tr-TR",{month:"long",year:"numeric"});
  const time = iv.time || "14:00";
  return screen(`
    ${topbar("Görüşme Detayı", "matches")}
    <div class="screen-body">
      <div class="interview-card">
        <div class="interview-header">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div class="match-avatar" style="width:44px;height:44px">${coInit}</div>
            <div>
              <h3 style="font-weight:800">${co}</h3>
              <p style="font-size:13px;color:var(--text-2)">${role}</p>
            </div>
            <span class="badge badge-warning" style="margin-left:auto">Beklemede</span>
          </div>
        </div>
        <div class="interview-time-block">
          <div>
            <div class="interview-date-big">${dateDay}</div>
            <div class="interview-date-month">${dateMon}</div>
          </div>
          <div>
            <p style="font-size:18px;font-weight:800">${time}</p>
            <p style="font-size:12px;color:var(--text-2)">Görüntülü Görüşme</p>
          </div>
        </div>
        <div style="padding:14px 18px;border-bottom:.5px solid var(--border)">
          <p class="body-sm">Görüşme bağlantısı e-posta ile paylaşılacak. Görüntülü aramaya hazır ol.</p>
        </div>
        <div class="interview-actions">
          <button class="btn btn-danger" style="flex:1" onclick="go('matches')">Reddet</button>
          <button class="btn btn-success" style="flex:2" onclick="go('result')">Onayla</button>
        </div>
      </div>
    </div>`, bottomNav(""));
}

/* NAVIGATION */
function renderNavigation() {
  const job = jobs.find(j => String(j.id) === String(state.detailJobId)) || jobs[0];
  const t = job.travel || { walk:15, bus:6, car:4 };
  const modes = [
    { key:"walk", label:"Yürüyerek", time:`${t.walk} dk` },
    { key:"bus",  label:"Otobüs",    time:`${t.bus} dk`  },
    { key:"car",  label:"Araba",     time:`${t.car} dk`  },
  ];
  const selected = modes.find(m => m.key === state.dirMode) || modes[0];
  return screen(`
    <div class="directions-head">
      ${topbar("Yol Tarifi", "job-detail")}
      <div class="dir-journey" aria-label="Rota özeti">
        <div class="dir-place"><span class="dir-place-dot current"></span><span>Mevcut konum</span></div>
        <span class="dir-journey-arrow">→</span>
        <div class="dir-place dir-place-destination"><span class="dir-place-dot destination"></span><span>${job.company}</span></div>
      </div>
    </div>
    <div class="directions-map">
      <svg class="dir-map-art" viewBox="0 0 390 470" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <pattern id="dir-blocks" width="74" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
            <path d="M0 8H74M15 0V64M52 0V64" fill="none" stroke="rgba(124,133,162,.10)" stroke-width="1"/>
            <rect x="19" y="13" width="28" height="18" rx="2" fill="rgba(124,133,162,.035)"/>
            <rect x="20" y="37" width="48" height="18" rx="2" fill="rgba(124,133,162,.025)"/>
          </pattern>
          <filter id="route-glow" x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="route-color" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stop-color="#6C4EFF"/><stop offset=".75" stop-color="#765BFF"/><stop offset="1" stop-color="#22C55E"/>
          </linearGradient>
        </defs>
        <rect width="390" height="470" fill="#0A0F1D"/>
        <rect width="390" height="470" fill="url(#dir-blocks)"/>
        <g class="dir-roads" fill="none" stroke-linecap="round">
          <path d="M-30 115C63 92 116 106 190 78S320 39 430 72"/>
          <path d="M-24 348C70 318 120 346 190 308S318 250 421 268"/>
          <path d="M50 -25C61 72 90 132 72 226S42 385 66 500"/>
          <path d="M308 -30C280 88 310 155 285 245S238 384 264 500"/>
          <path d="M-20 228C94 210 132 235 210 205S329 158 415 178"/>
        </g>
        <g class="dir-districts">
          <text x="28" y="84">ACIBADEM</text><text x="283" y="112">FENERYOLU</text>
          <text x="28" y="292">KOZYATAĞI</text><text x="276" y="326">HASANPAŞA</text>
          <text x="276" y="424">EĞİTİM</text>
        </g>
        <path class="dir-route-glow" d="M202 405C190 353 202 330 185 292S222 224 226 180S190 146 209 94"/>
        <path class="dir-route-line" d="M202 405C190 353 202 330 185 292S222 224 226 180S190 146 209 94"/>
      </svg>
      <div class="dir-turn-cue"><strong>↑</strong><span><b>350 m</b> ileride sağa dön</span></div>
      <div class="dir-destination" style="left:53.6%;top:18%">
        <div class="dir-destination-pin"><b>${job.initials}</b></div>
        <span>${job.company}</span>
      </div>
      <div class="map-user dir-user" style="left:51.8%;top:83%">
        <div class="user-ring"></div>
        <div class="user-dot"></div>
        <span>Mevcut konum</span>
      </div>
    </div>
    <div class="directions-panel">
      <div class="dir-sheet-handle"></div>
      <div class="dir-panel-title">
        <div><h3>${job.company}</h3><p>${job.location || "Kadıköy, İstanbul"}</p></div>
        <span class="dir-mode-badge">${selected.time}</span>
      </div>
      <div class="dir-route-meta"><span>${navModeIcon(state.dirMode, 15)} ${job.distance || "1,1"} km</span><i></i><span>${selected.time}</span><i></i><span class="dir-traffic"><b></b>Trafik normal</span></div>
      <div class="directions-options">
        ${modes.map(m => `
          <button class="dir-option${state.dirMode===m.key?" active":""}" onclick="setDirMode('${m.key}')" aria-pressed="${state.dirMode===m.key}">
            <span class="dicon">${navModeIcon(m.key)}</span>
            <span class="dtime">${m.time}</span>
            <span class="dlabel">${m.label}</span>
          </button>`).join("")}
      </div>
      <button class="dir-start-btn" onclick="startDirections()">${navModeIcon("navigate", 18)}<span>Yolculuğu Başlat</span></button>
      <button class="dir-open-btn" onclick="openExternalDirections('${encodeURIComponent(job.company)}')">Haritada Aç</button>
    </div>`);
}

function navModeIcon(mode, size = 22) {
  const paths = {
    walk: '<path d="M13 5.2a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 4.2ZM9.7 21l1.1-5.3 2.2-2.2 1.5 2.1V21m-7.2-8.4 2.1-4.2c.5-1 1.5-1.5 2.6-1.3l2.6.5 2.2 3.2 3.2 1.1m-10.5.5 3.3 2.7m-5.5 5.9 2.4-4.5"/>',
    bus: '<rect x="5" y="2" width="14" height="18" rx="3"/><path d="M5 8h14M8 16h.01M16 16h.01M7 22v-2m10 2v-2"/>',
    car: '<path d="M4 11l2-5h12l2 5m-16 0h16v8H4zM7 15h.01M17 15h.01M6 19v2m12-2v2"/>',
    navigate: '<path d="m3 11 18-8-8 18-2.5-7.5L3 11Z"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[mode] || paths.walk}</svg>`;
}

function startDirections() {
  triggerHaptic?.(35);
  dgEncouragementToast("Rota hazır · Güvenli yolculuklar");
}

function openExternalDirections(destination) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank", "noopener,noreferrer");
}

/* RESULT */
function renderResult() {
  const options = ["İşe Alındım 🎉","Reddedildim","Teklif Bekliyorum","İptal Edildi"];
  return screen(`
    ${topbar("Görüşme Sonucu", "interview")}
    <div class="screen-body" style="padding-top:20px">
      <p style="padding:0 18px 14px;font-size:14px;color:var(--text-2)">${(state.activeInterview?.name || matchItems[2]?.[0]?.name || "Görüşme")} görüşmesi nasıl geçti?</p>
      <div class="result-options">
        ${options.map(o => `
          <button class="result-option${state.selectedResult===o?" selected":""}" onclick="selectResult('${o}')">
            ${o}
          </button>`).join("")}
      </div>
      <div class="stars">
        ${[1,2,3,4,5].map(n => `
          <button class="star-btn${state.rating>=n?" on":""}" onclick="setRating(${n})">★</button>`).join("")}
      </div>
      <div style="padding:20px 18px">
        <button class="btn btn-primary btn-full" onclick="go('matches')">Kaydet</button>
      </div>
    </div>`, bottomNav(""));
}

/* ─── REGISTRATION ───────────────────────────────────────────────── */

const REG_ROLES = [
  { section:"Yiyecek & İçecek",  chips:["Barista","Garson","Aşçı Yardımcısı","Kasa Görevlisi","Şef"] },
  { section:"Satış & Perakende", chips:["Satış Danışmanı","Mağaza Görevlisi","Stokçu"] },
  { section:"Lojistik",          chips:["Kurye","Depo Görevlisi","Dağıtım"] },
  { section:"Güzellik & Bakım",  chips:["Kuaför","Estetisyen","Spa Görevlisi"] },
  { section:"Teknik",            chips:["IT Destek","Teknik Servis","Elektrikçi"] },
  { section:"Temizlik",          chips:["Temizlik Görevlisi","Ev Temizliği"] },
];

const REG_CITIES = ["İstanbul","Ankara","İzmir","Bursa","Antalya"];
const REG_DISTRICTS = {
  "İstanbul":["Kadıköy","Beşiktaş","Şişli","Üsküdar","Fatih","Beyoğlu","Bakırköy","Maltepe"],
  "Ankara":  ["Çankaya","Keçiören","Mamak","Etimesgut","Yenimahalle"],
  "İzmir":   ["Konak","Bornova","Karşıyaka","Buca","Çiğli"],
  "Bursa":   ["Osmangazi","Nilüfer","Yıldırım","Gemlik"],
  "Antalya": ["Muratpaşa","Kepez","Konyaaltı","Döşemealtı"],
};

function getRegInitials() {
  const f = state.register.firstname;
  const l = state.register.lastname;
  if (!f) return user.initials || "SK";
  return ((f[0] || "") + (l?.[0] || "")).toUpperCase();
}

function renderRegisterOTP() {
  const phone = state.register.phone
    ? state.register.phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4")
    : "5XX XXX XX XX";
  return `<div class="reg-screen">
    ${obProgress(1, 5)}
    <button class="reg-back" onclick="go('auth')">←</button>
    <div class="reg-copy" style="align-items:center;text-align:center;padding-top:24px">
      <div class="reg-otp-icon">📱</div>
      <h2 class="reg-h1" style="text-align:center">Kodu gir</h2>
      <p class="reg-sub" style="text-align:center">+90 ${phone} numarana<br>4 haneli kod gönderdik.</p>
    </div>
    <div class="ob-otp-inputs">
      <input class="ob-otp-box" id="rotp0" type="tel" inputmode="numeric" maxlength="1"
        oninput="onRegOtpInput(this,0)" onkeydown="onRegOtpKey(event,0)">
      <input class="ob-otp-box" id="rotp1" type="tel" inputmode="numeric" maxlength="1"
        oninput="onRegOtpInput(this,1)" onkeydown="onRegOtpKey(event,1)">
      <input class="ob-otp-box" id="rotp2" type="tel" inputmode="numeric" maxlength="1"
        oninput="onRegOtpInput(this,2)" onkeydown="onRegOtpKey(event,2)">
      <input class="ob-otp-box" id="rotp3" type="tel" inputmode="numeric" maxlength="1"
        oninput="onRegOtpInput(this,3)" onkeydown="onRegOtpKey(event,3)">
    </div>
    <div id="reg-otp-feedback" class="ob-otp-feedback"></div>
    <div class="ob-sticky-bottom" style="border-top:none;padding-top:4px">
      <button class="ob-resend-btn" id="reg-resend" disabled>
        Kodu almadım → <span id="reg-resend-timer">60s</span> sonra tekrar gönder
      </button>
      <button class="reg-minor-btn" onclick="go('auth')">Numarayı değiştir</button>
    </div>
  </div>`;
}

function renderRegisterName() {
  const hasName = state.register.firstname.trim().length >= 2;
  return `<div class="reg-screen">
    ${obProgress(2, 5)}
    <button class="reg-back" onclick="go('register-otp')">←</button>
    <div class="reg-avatar-area">
      <div class="reg-avatar" id="reg-avatar-circle">${getRegInitials()}</div>
      <button class="reg-avatar-change" onclick="cycleAvatarColor()">Rengi değiştir</button>
    </div>
    <div class="reg-copy">
      <h2 class="reg-h1">Adın ne?</h2>
      <p class="reg-sub">Profil kartında görünecek.</p>
    </div>
    <div class="reg-form">
      <div class="input-group">
        <label class="input-label">Ad</label>
        <input class="input-field" id="reg-firstname" type="text"
          autocapitalize="words" autocomplete="given-name"
          placeholder="Ad" value="${state.register.firstname}"
          oninput="onRegNameInput(this)">
      </div>
      <div class="input-group">
        <label class="input-label" style="color:var(--text-3)">Soyad (opsiyonel)</label>
        <input class="input-field" id="reg-lastname" type="text"
          autocapitalize="words" autocomplete="family-name"
          placeholder="Soyad" value="${state.register.lastname}"
          oninput="state.register.lastname=this.value;updateRegAvatar()">
      </div>
      <p class="ob-legal">İsmini daha sonra değiştirebilirsin.</p>
    </div>
    <div class="ob-sticky-bottom" style="border-top:none">
      <button class="btn btn-primary btn-full ob-btn${hasName ? "" : " disabled"}"
        id="reg-name-btn" ${hasName ? "" : "disabled"} onclick="go('register-role')">
        Devam Et →
      </button>
    </div>
  </div>`;
}

function renderRegisterRole() {
  const sel = state.register.skills;
  return `<div class="reg-screen">
    ${obProgress(3, 5)}
    <button class="reg-back" onclick="go('register-name')">←</button>
    <div class="reg-mini-profile">
      <div class="reg-mini-avatar">${getRegInitials()}</div>
      <span class="reg-mini-name">${state.register.firstname || "Sen"}</span>
    </div>
    <div class="reg-copy" style="padding-top:10px">
      <h2 class="reg-h1">Ne işler yapıyorsun?</h2>
      <p class="reg-sub">İşverenler seni bu alanlarda arar.</p>
    </div>
    <div class="reg-roles-body">
      ${REG_ROLES.map(g => `
        <div class="reg-role-section">
          <p class="reg-role-label">${g.section}</p>
          <div class="reg-role-chips">
            ${g.chips.map(c => `
              <span class="ob-chip${sel.includes(c) ? " active" : ""}" onclick="toggleRegSkill('${c}')">
                ${sel.includes(c) ? "✓ " : ""}${c}
              </span>`).join("")}
          </div>
        </div>`).join("")}
    </div>
    <div class="ob-sticky-bottom">
      <div class="ob-count">${sel.length > 0 ? `${sel.length} beceri seçildi` : "En az 1 seç"}</div>
      <button class="btn btn-primary btn-full ob-btn${sel.length === 0 ? " disabled" : ""}"
        ${sel.length === 0 ? "disabled" : ""} onclick="goToRegisterLocation()">
        Profilimi Oluştur →
      </button>
      <button class="reg-skip-btn" onclick="goToRegisterLocation()">Şimdi değil, sonra eklerim</button>
    </div>
  </div>`;
}

function renderRegisterLocation() {
  const city = state.register.city;
  const district = state.register.district;
  const districts = REG_DISTRICTS[city] || [];
  return `<div class="reg-screen">
    ${obProgress(4, 5)}
    <button class="reg-back" onclick="go('register-role')">←</button>
    <div class="reg-copy" style="align-items:center;text-align:center;padding-top:16px">
      <div class="reg-loc-icon">📍</div>
      <h2 class="reg-h1" style="text-align:center">Çalışmak istediğin<br>bölge hangisi?</h2>
      <p class="reg-sub" style="text-align:center">Yakınındaki fırsatları sana göstereceğiz.</p>
    </div>
    <div class="reg-loc-body">
      <p class="reg-role-label">Şehir</p>
      <div class="reg-city-grid">
        ${REG_CITIES.map(c => `
          <div class="reg-city-card${city === c ? " selected" : ""}" onclick="selectRegCity('${c}')">
            ${c}${city === c ? '<span class="reg-city-check">✓</span>' : ""}
          </div>`).join("")}
      </div>
      ${districts.length ? `
        <p class="reg-role-label" style="margin-top:18px">İlçe</p>
        <div class="reg-role-chips" id="reg-district-chips">
          ${districts.map(d => `
            <span class="ob-chip${district === d ? " active" : ""}" onclick="selectRegDistrict('${d}')">${d}</span>`).join("")}
        </div>` : ""}
    </div>
    <div class="ob-sticky-bottom" style="border-top:none">
      <button class="btn btn-primary btn-full ob-btn" onclick="finishRegistration()">Hazırım →</button>
    </div>
  </div>`;
}

function renderRegisterSuccess() {
  const fullName = [state.register.firstname, state.register.lastname].filter(Boolean).join(" ");
  const loc = state.register.district || state.register.city || "Kadıköy";
  setTimeout(() => {
    const el = document.getElementById("reg-count-num");
    if (!el) return;
    let n = 0; const target = jobs.length;
    const t = setInterval(() => { n = Math.min(n+1, target); el.textContent = n; if (n >= target) clearInterval(t); }, 55);
  }, 400);
  return `<div class="reg-screen reg-success anim-fade-in">
    <div class="ob-confetti">${_generateConfetti()}</div>
    <div class="reg-success-hero">
      <div class="reg-success-avatar">${getRegInitials()}</div>
      <div style="text-align:center">
        <div class="ob-count-num" id="reg-count-num">0</div>
        <div class="ob-count-label">fırsat seni bekliyor</div>
        <p class="ob-count-sub" style="margin-top:6px">${state.register.firstname || user.short}, ${loc}'ye hoş geldin.</p>
      </div>
    </div>
    <div class="reg-profile-card">
      <div class="reg-card-avatar">${getRegInitials()}</div>
      <div class="reg-card-info">
        <h3>${fullName || user.name}</h3>
        <p>${state.register.skills.slice(0,2).join(" · ") || user.role}</p>
        <p class="reg-card-loc">📍 ${loc} · ✓ Doğrulandı</p>
      </div>
      <button class="reg-card-edit" onclick="go('settings-profile')">Düzenle →</button>
    </div>
    <div class="ob-sticky-bottom ob-success-actions" style="border-top:none">
      <button class="btn btn-primary btn-full ob-btn ob-btn-pulse" onclick="completeRegistration()">
        Keşfetmeye Başla →
      </button>
    </div>
  </div>`;
}

/* ─── REGISTRATION HELPERS ──────────────────────────────────────── */

function formatAuthPhone(input) {
  let raw = input.value.replace(/\D/g, "");
  if (raw.length > 10) raw = raw.slice(0, 10);
  let fmt = raw;
  if (raw.length > 3) fmt = raw.slice(0,3) + " " + raw.slice(3);
  if (raw.length > 6) fmt = raw.slice(0,3) + " " + raw.slice(3,6) + " " + raw.slice(6);
  if (raw.length > 8) fmt = raw.slice(0,3) + " " + raw.slice(3,6) + " " + raw.slice(6,8) + " " + raw.slice(8);
  input.value = fmt;
  state.register.phone = raw;
  const btn = document.getElementById("auth-phone-btn");
  if (btn) btn.disabled = raw.length < 10;
}

function submitAuthPhone() {
  if (state.register.phone.length < 10) return;
  go("register-otp");
}

let _regOtpTimer = null;
function startRegOtpTimer() {
  let secs = 60;
  const timerEl = document.getElementById("reg-resend-timer");
  const btn = document.getElementById("reg-resend");
  if (_regOtpTimer) clearInterval(_regOtpTimer);
  _regOtpTimer = setInterval(() => {
    secs--;
    if (timerEl) timerEl.textContent = `${secs}s`;
    if (secs <= 0) {
      clearInterval(_regOtpTimer);
      if (btn) { btn.disabled = false; btn.innerHTML = `Kodu almadım → <u>Yeniden gönder</u>`; }
    }
  }, 1000);
}

function onRegOtpInput(el, idx) {
  el.value = el.value.replace(/\D/g, "");
  if (el.value && idx < 3) document.getElementById(`rotp${idx+1}`)?.focus();
  const code = [0,1,2,3].map(i => document.getElementById(`rotp${i}`)?.value || "").join("");
  if (code.length === 4) {
    [0,1,2,3].forEach(i => {
      const b = document.getElementById(`rotp${i}`);
      if (b) { b.style.borderColor = "var(--success)"; b.style.background = "var(--success-dim)"; }
    });
    const fb = document.getElementById("reg-otp-feedback");
    if (fb) { fb.textContent = "✓ Doğrulandı"; fb.className = "ob-otp-feedback ob-otp-success"; }
    state.register.otpVerified = true;
    setTimeout(() => go("register-name"), 700);
  }
}

function onRegOtpKey(e, idx) {
  if (e.key === "Backspace" && !e.target.value && idx > 0) {
    document.getElementById(`rotp${idx-1}`)?.focus();
  }
}

function onRegNameInput(input) {
  state.register.firstname = input.value;
  updateRegAvatar();
  const btn = document.getElementById("reg-name-btn");
  if (btn) {
    const ok = input.value.trim().length >= 2;
    btn.disabled = !ok;
    btn.classList.toggle("disabled", !ok);
  }
}

function updateRegAvatar() {
  const el = document.getElementById("reg-avatar-circle");
  if (el) el.textContent = getRegInitials() || "?";
}

const _avatarColors = ["var(--primary)","var(--success)","#8B5CFF","#F59E0B","#06B6D4","#EC4899","#10B981","#EF4444"];
let _avatarColorIdx = 0;
function cycleAvatarColor() {
  _avatarColorIdx = (_avatarColorIdx + 1) % _avatarColors.length;
  const el = document.getElementById("reg-avatar-circle");
  if (el) el.style.background = _avatarColors[_avatarColorIdx];
}

function toggleRegSkill(skill) {
  const skills = state.register.skills;
  const idx = skills.indexOf(skill);
  if (idx >= 0) skills.splice(idx, 1);
  else if (skills.length < 5) skills.push(skill);
  document.querySelectorAll(".reg-role-chips .ob-chip").forEach(chip => {
    const raw = chip.textContent.replace(/^✓\s*/, "").trim();
    if (raw !== skill) return;
    const active = skills.includes(skill);
    chip.classList.toggle("active", active);
    chip.textContent = (active ? "✓ " : "") + skill;
  });
  const countEl = document.querySelector(".ob-count");
  if (countEl) countEl.textContent = skills.length > 0 ? `${skills.length} beceri seçildi` : "En az 1 seç";
  const btn = document.querySelector(".ob-sticky-bottom .ob-btn");
  if (btn) { btn.disabled = skills.length === 0; btn.classList.toggle("disabled", skills.length === 0); }
}

function goToRegisterLocation() {
  if (window.MW?.Location?.current) {
    finishRegistration();
  } else {
    go("register-location");
  }
}

function selectRegCity(city) {
  state.register.city = city;
  state.register.district = "";
  render();
}

function selectRegDistrict(district) {
  state.register.district = district;
  document.querySelectorAll("#reg-district-chips .ob-chip").forEach(c => {
    c.classList.toggle("active", c.textContent.trim() === district);
  });
}

function finishRegistration() {
  if (state.register.firstname) {
    user.name = [state.register.firstname, state.register.lastname].filter(Boolean).join(" ");
    user.short = state.register.firstname;
    user.initials = getRegInitials();
  }
  if (state.register.skills.length) {
    user.skills = [...state.register.skills, ...user.skills.filter(s => !state.register.skills.includes(s))];
    user.role = state.register.skills.slice(0, 2).join(" · ");
  }
  if (state.register.district || state.register.city) {
    user.location = [state.register.district, state.register.city].filter(Boolean).join(", ");
  }
  go("register-success");
}

function completeRegistration() {
  localStorage.setItem("mw_onboarding_done", "1");
  go("home");
}

/* ─── ONBOARDING ────────────────────────────────────────────────── */

function obProgress(step, total = 5) {
  return `<div class="ob-progress">${Array.from({length: total}, (_,i) =>
    `<div class="ob-dot${i < step ? " done" : i === step ? " active" : ""}"></div>`
  ).join("")}</div>`;
}

function renderOnboardingSplash() {
  setTimeout(() => {
    if (currentRoute() === "onboarding-splash") go("onboarding-welcome");
  }, 2200);
  return `<div class="ob-screen ob-splash anim-fade-in">
    <div class="ob-splash-content">
      <div class="ob-splash-logo-wrap">
        <div class="ob-splash-radar ob-splash-radar-1"></div>
        <div class="ob-splash-radar ob-splash-radar-2"></div>
        <div class="ob-splash-mark">✦</div>
      </div>
      <h1 class="ob-splash-title">Matchwork</h1>
    </div>
  </div>`;
}

function _cityPreviewCards() {
  return [
    {title:"Cafe Lumiere", score:92, dist:"1.2 km", delay:"0s"},
    {title:"ModaPlus", score:88, dist:"0.8 km", delay:".3s"},
    {title:"NetCall", score:82, dist:"2.1 km", delay:".6s"},
  ].map(c => `
    <div class="city-preview-card" style="animation-delay:${c.delay}">
      <span class="city-card-score ${c.score>=85?"score-green":"score-blue"}">${c.score}%</span>
      <span class="city-card-title">${c.title}</span>
      <span class="city-card-dist">📍 ${c.dist}</span>
    </div>`).join("");
}

function renderOnboardingWelcome() {
  return `<div class="ob-screen ob-welcome">
    <div class="ob-city-anim">
      <div class="city-grid-lines">
        <div class="cgl cgl-h" style="top:30%"></div>
        <div class="cgl cgl-h" style="top:58%"></div>
        <div class="cgl cgl-h" style="top:80%"></div>
        <div class="cgl cgl-v" style="left:25%"></div>
        <div class="cgl cgl-v" style="left:62%"></div>
        <div class="cgl cgl-v" style="left:85%"></div>
        <div class="city-user-pin"></div>
      </div>
      <div class="city-cards-preview">${_cityPreviewCards()}</div>
    </div>
    <div class="ob-welcome-copy">
      <h1 class="ob-headline">Çevrende iş var.<br>Henüz haberdar değilsin.</h1>
      <p class="ob-subline">Matchwork yakınındaki fırsatları bulur,<br>seni doğru işe saniyeler içinde eşleştirir.</p>
      <div class="ob-actions">
        <button class="btn btn-primary btn-full ob-btn" onclick="go('onboarding-location')">Başlayalım →</button>
        <button class="btn btn-ghost btn-full ob-btn-sec" onclick="go('auth')">Zaten hesabım var</button>
      </div>
    </div>
  </div>`;
}

function renderOnboardingLocation() {
  const pins = [
    {label:"1.2 km",x:"70%",y:"25%",d:".1s"},
    {label:"0.8 km",x:"18%",y:"33%",d:".4s"},
    {label:"2.1 km",x:"74%",y:"70%",d:".7s"},
    {label:"1.7 km",x:"14%",y:"68%",d:"1s"},
  ];
  return `<div class="ob-screen">
    ${obProgress(0)}
    <div class="ob-hero ob-loc-hero">
      <div class="ob-loc-anim">
        <div class="ob-loc-ring ob-loc-ring-1"></div>
        <div class="ob-loc-ring ob-loc-ring-2"></div>
        <div class="ob-loc-ring ob-loc-ring-3"></div>
        <div class="ob-loc-center">📍</div>
        ${pins.map(p=>`<div class="ob-loc-pin" style="left:${p.x};top:${p.y};animation-delay:${p.d}">${p.label}</div>`).join("")}
      </div>
    </div>
    <div class="ob-copy">
      <h2 class="ob-h2">Sana yakın fırsatlar için<br>konumunu paylaş</h2>
      <p class="ob-body">🔒 Yalnızca uygulama açıkken kullanılır.<br>Konumun hiçbir işveren ile paylaşılmaz.</p>
      <div class="ob-actions">
        <button class="btn btn-primary btn-full ob-btn" onclick="requestLocationPermission()">Konumuma İzin Ver</button>
        <button class="btn btn-ghost btn-full ob-btn-sec" onclick="go('onboarding-type')">Şimdi değil</button>
      </div>
    </div>
  </div>`;
}

function renderOnboardingType() {
  const t = state.onboarding.userType;
  return `<div class="ob-screen">
    ${obProgress(1)}
    <div class="ob-copy ob-type-copy">
      <h2 class="ob-h2">Sen kimsin?</h2>
      <p class="ob-body">Deneyimini buna göre kişiselleştireceğiz.</p>
    </div>
    <div class="ob-type-cards">
      <div class="ob-type-card${t==="seeker"?" selected":""}" onclick="selectUserType('seeker')">
        <div class="ob-type-icon">👤</div>
        <h3>Fırsat Arıyorum</h3>
        <p>Yakınımdaki işleri keşfet, hızla eşleş, başla.</p>
        ${t==="seeker"?'<div class="ob-type-check">✓</div>':""}
      </div>
      <div class="ob-type-card${t==="business"?" selected":""}" onclick="selectUserType('business')">
        <div class="ob-type-icon">🏢</div>
        <h3>Eleman Arıyorum</h3>
        <p>Doğru kişiyi bul, davet et, bugün çalıştır.</p>
        ${t==="business"?'<div class="ob-type-check">✓</div>':""}
      </div>
    </div>
  </div>`;
}

const OB_CATEGORIES = [
  {icon:"☕",label:"Kafe & Restoran"},
  {icon:"🛍️",label:"Perakende & Satış"},
  {icon:"🍳",label:"Mutfak & Aşçılık"},
  {icon:"📦",label:"Lojistik & Depo"},
  {icon:"💆",label:"Güzellik & Spa"},
  {icon:"🎨",label:"Yaratıcı & Tasarım"},
  {icon:"🔧",label:"Teknik & Tamir"},
  {icon:"👶",label:"Bakım & Eğitim"},
  {icon:"🏋️",label:"Sağlık & Spor"},
  {icon:"🧹",label:"Temizlik & Bakım"},
  {icon:"🎪",label:"Etkinlik & Org."},
  {icon:"➕",label:"Diğer"},
];

function renderOnboardingCategories() {
  const sel = state.onboarding.categories;
  return `<div class="ob-screen">
    ${obProgress(2)}
    <div class="ob-copy" style="padding-bottom:0">
      <h2 class="ob-h2">Ne tür işler seni<br>heyecanlandırır?</h2>
      <p class="ob-body" style="margin-bottom:0">En az 1 kategori seç. İstediğin kadar ekleyebilirsin.</p>
    </div>
    <div class="ob-cat-grid">
      ${OB_CATEGORIES.map(c => `
        <div class="ob-cat-item${sel.includes(c.label)?" selected":""}" onclick="toggleCategory('${c.label}')">
          <span class="ob-cat-icon">${c.icon}</span>
          <span class="ob-cat-label">${c.label}</span>
          ${sel.includes(c.label)?'<div class="ob-cat-check">✓</div>':""}
        </div>`).join("")}
    </div>
    <div class="ob-sticky-bottom">
      <div class="ob-count">${sel.length > 0 ? `${sel.length} kategori seçildi` : "Kategori seç"}</div>
      <button class="btn btn-primary btn-full ob-btn${sel.length===0?" disabled":""}"
        ${sel.length===0?"disabled":""} onclick="go('onboarding-prefs')">Devam Et →</button>
    </div>
  </div>`;
}

function renderOnboardingPrefs() {
  const ob = state.onboarding;
  const workOpts = ["Tam zamanlı", "Yarı zamanlı", "Günlük / Gig"];
  return `<div class="ob-screen">
    ${obProgress(3)}
    <div class="ob-copy" style="padding-bottom:0">
      <h2 class="ob-h2">Nasıl çalışmak istersin?</h2>
      <p class="ob-body" style="margin-bottom:0">Bunları istediğin zaman değiştirebilirsin.</p>
    </div>
    <div class="ob-prefs-body">
      <div class="ob-pref-section">
        <p class="ob-pref-label">Ne kadar uzağa gidebilirsin?</p>
        <div class="ob-slider-wrap">
          <input type="range" class="ob-slider" id="ob-dist-slider" min="1" max="15" value="${ob.distance}"
            oninput="updateObDistance(this.value)">
          <div class="ob-slider-val" id="ob-dist-val">${ob.distance} km</div>
        </div>
        <div class="ob-quick-chips">
          ${[1,3,5,10].map(v=>`<span class="ob-chip${ob.distance==v?" active":""}" onclick="updateObDistance(${v})">${v} km</span>`).join("")}
          <span class="ob-chip${ob.distance>10?" active":""}">10+ km</span>
        </div>
      </div>
      <div class="ob-pref-section">
        <p class="ob-pref-label">Çalışma şekli</p>
        <div class="ob-quick-chips" id="ob-work-chips">
          ${workOpts.map(w=>`<span class="ob-chip${ob.workTypes.includes(w)?" active":""}" onclick="toggleObWorkType('${w}')">${w}</span>`).join("")}
        </div>
      </div>
      <div class="ob-pref-section">
        <p class="ob-pref-label">Günlük minimum kaç ₺ bekliyorsun?</p>
        <div class="ob-slider-wrap">
          <input type="range" class="ob-slider" id="ob-sal-slider" min="300" max="2000" step="50" value="${ob.minSalary}"
            oninput="updateObSalary(this.value)">
          <div class="ob-slider-val" id="ob-sal-val">₺${ob.minSalary} ve üzeri</div>
        </div>
      </div>
    </div>
    <div class="ob-sticky-bottom" style="border-top:none">
      <button class="btn btn-primary btn-full ob-btn" onclick="go('onboarding-account')">Fırsatları Göster →</button>
    </div>
  </div>`;
}

function renderOnboardingAccount() {
  return `<div class="ob-screen">
    ${obProgress(4)}
    <div class="ob-copy">
      <h2 class="ob-h2">Neredeyse hazırsın.</h2>
      <p class="ob-body">Hesabını oluştur, fırsatlara eriş.</p>
    </div>
    <div class="ob-form">
      <div class="input-group">
        <label class="input-label">Ad Soyad</label>
        <input class="input-field ob-input" id="ob-name" type="text" placeholder="Ad Soyad"
          value="${state.onboarding.name}"
          oninput="state.onboarding.name=this.value;updateObAccountBtn()">
      </div>
      <div class="input-group">
        <label class="input-label">Telefon</label>
        <div class="ob-phone-wrap">
          <span class="ob-phone-prefix">🇹🇷 +90</span>
          <input class="input-field ob-phone-input" id="ob-phone" type="tel"
            placeholder="5XX XXX XX XX" maxlength="14"
            value="${state.onboarding.phone}"
            oninput="state.onboarding.phone=this.value;updateObAccountBtn()">
        </div>
      </div>
      <div class="input-group">
        <label class="input-label" style="color:var(--text-3)">E-posta (opsiyonel)</label>
        <input class="input-field ob-input" type="email" placeholder="E-posta" style="opacity:.6">
      </div>
      <p class="ob-legal">Devam ederek <u>Kullanım Koşulları</u> ve <u>Gizlilik Politikası</u>'nı kabul ediyorsun.</p>
    </div>
    <div class="ob-sticky-bottom" style="border-top:none">
      <button class="btn btn-primary btn-full ob-btn" id="ob-account-btn"
        onclick="go('onboarding-otp')" disabled>Doğrulama Kodu Gönder</button>
    </div>
  </div>`;
}

function renderOnboardingOTP() {
  const phone = state.onboarding.phone || "5XX XXX XX XX";
  return `<div class="ob-screen">
    ${obProgress(4)}
    <div class="ob-copy" style="align-items:center;text-align:center">
      <div class="ob-otp-icon">📱</div>
      <h2 class="ob-h2" style="text-align:center">Kodu gir</h2>
      <p class="ob-body" style="text-align:center">+90 ${phone} numarana<br>4 haneli kod gönderdik</p>
    </div>
    <div class="ob-otp-inputs">
      <input class="ob-otp-box" id="otp0" type="tel" maxlength="1"
        oninput="onOtpInput(this,0)" onkeydown="onOtpKey(event,0)">
      <input class="ob-otp-box" id="otp1" type="tel" maxlength="1"
        oninput="onOtpInput(this,1)" onkeydown="onOtpKey(event,1)">
      <input class="ob-otp-box" id="otp2" type="tel" maxlength="1"
        oninput="onOtpInput(this,2)" onkeydown="onOtpKey(event,2)">
      <input class="ob-otp-box" id="otp3" type="tel" maxlength="1"
        oninput="onOtpInput(this,3)" onkeydown="onOtpKey(event,3)">
    </div>
    <div id="ob-otp-feedback" class="ob-otp-feedback"></div>
    <div class="ob-sticky-bottom" style="border-top:none;padding-top:8px">
      <button class="ob-resend-btn" id="ob-resend" disabled>
        Kodu almadım → <span id="ob-resend-timer">60s</span> sonra tekrar gönder
      </button>
    </div>
  </div>`;
}

function _generateConfetti() {
  const colors = ["var(--primary)","var(--success)","var(--warning)","#ff6b9d","#4ecdc4"];
  return Array.from({length:28}, () => {
    const x = (Math.random()*100).toFixed(1);
    const delay = (Math.random()*1.4).toFixed(2);
    const dur = (1.4 + Math.random()*.8).toFixed(2);
    const size = 4 + Math.floor(Math.random()*6);
    const color = colors[Math.floor(Math.random()*colors.length)];
    return `<div class="confetti-piece" style="left:${x}%;animation-delay:${delay}s;animation-duration:${dur}s;width:${size}px;height:${size}px;background:${color}"></div>`;
  }).join("");
}

function renderOnboardingSuccess() {
  setTimeout(() => {
    const el = document.getElementById("ob-count-num");
    if (!el) return;
    let n = 0;
    const target = jobs.length;
    const t = setInterval(() => {
      n = Math.min(n+1, target);
      el.textContent = n;
      if (n >= target) clearInterval(t);
    }, 55);
  }, 350);

  return `<div class="ob-screen ob-success anim-fade-in">
    <div class="ob-confetti">${_generateConfetti()}</div>
    <div class="ob-success-hero">
      <div class="ob-count-display">
        <span class="ob-count-num" id="ob-count-num">0</span>
        <span class="ob-count-label">fırsat seni bekliyor</span>
      </div>
      <p class="ob-count-sub">Kadıköy ve çevresinde</p>
    </div>
    <div class="ob-preview-cards">
      ${jobs.slice(0,3).map(j => `
        <div class="ob-preview-card" onclick="finishOnboarding();openJob(${j.id},'home')">
          <span class="ob-prev-score ${j.matchScore>=85?"score-green":"score-blue"}">${j.matchScore}%</span>
          <span class="ob-prev-init">${j.initials}</span>
          <span class="ob-prev-title">${j.company}</span>
          <span class="ob-prev-dist">📍 ${j.distance} km</span>
        </div>`).join("")}
    </div>
    <div class="ob-sticky-bottom ob-success-actions" style="border-top:none">
      <button class="btn btn-primary btn-full ob-btn ob-btn-pulse" onclick="finishOnboarding()">
        Fırsatları Keşfet →
      </button>
    </div>
  </div>`;
}

/* ─── ONBOARDING HELPERS ────────────────────────────────────────── */

function requestLocationPermission() {
  if (!navigator.geolocation) { go("onboarding-type"); return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      if (window.MW?.Location) {
        window.MW.Location.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      }
      go("onboarding-type");
    },
    () => go("onboarding-type"),
    { timeout: 8000 }
  );
}

function selectUserType(type) {
  state.onboarding.userType = type;
  render();
  setTimeout(() => go("onboarding-categories"), 350);
}

function toggleCategory(label) {
  const cats = state.onboarding.categories;
  const idx = cats.indexOf(label);
  if (idx >= 0) cats.splice(idx, 1);
  else cats.push(label);
  const items = document.querySelectorAll(".ob-cat-item");
  items.forEach(item => {
    const lbl = item.querySelector(".ob-cat-label")?.textContent;
    if (lbl !== label) return;
    const active = cats.includes(label);
    item.classList.toggle("selected", active);
    const existing = item.querySelector(".ob-cat-check");
    if (active && !existing) {
      const d = document.createElement("div");
      d.className = "ob-cat-check"; d.textContent = "✓";
      item.appendChild(d);
    } else if (!active && existing) {
      existing.remove();
    }
  });
  const countEl = document.querySelector(".ob-count");
  if (countEl) countEl.textContent = cats.length > 0 ? `${cats.length} kategori seçildi` : "Kategori seç";
  const btn = document.querySelector(".ob-sticky-bottom .ob-btn");
  if (btn) { btn.disabled = cats.length === 0; btn.classList.toggle("disabled", cats.length === 0); }
}

function updateObDistance(val) {
  state.onboarding.distance = +val;
  const slider = document.getElementById("ob-dist-slider");
  const valEl = document.getElementById("ob-dist-val");
  if (slider) slider.value = val;
  if (valEl) valEl.textContent = `${val} km`;
  const chips = document.querySelectorAll("#ob-dist-slider ~ .ob-quick-chips .ob-chip, .ob-quick-chips .ob-chip");
  // simpler: re-evaluate all chips in first pref section
  document.querySelectorAll(".ob-pref-section:first-child .ob-chip").forEach((c,i) => {
    const v = [1,3,5,10][i];
    if (v !== undefined) c.classList.toggle("active", v == val);
  });
}

function toggleObWorkType(type) {
  const wt = state.onboarding.workTypes;
  const idx = wt.indexOf(type);
  if (idx >= 0 && wt.length > 1) wt.splice(idx, 1);
  else if (idx < 0) wt.push(type);
  document.querySelectorAll("#ob-work-chips .ob-chip").forEach(c => {
    c.classList.toggle("active", wt.includes(c.textContent.trim()));
  });
}

function updateObSalary(val) {
  state.onboarding.minSalary = +val;
  const valEl = document.getElementById("ob-sal-val");
  if (valEl) valEl.textContent = `₺${val} ve üzeri`;
}

function updateObAccountBtn() {
  const btn = document.getElementById("ob-account-btn");
  if (!btn) return;
  const hasName = state.onboarding.name.trim().length > 1;
  const hasPhone = state.onboarding.phone.replace(/\D/g,"").length >= 10;
  btn.disabled = !(hasName && hasPhone);
}

let _otpResendTimer = null;
function startOtpTimer() {
  let secs = 60;
  const timerEl = document.getElementById("ob-resend-timer");
  const btn = document.getElementById("ob-resend");
  _otpResendTimer = setInterval(() => {
    secs--;
    if (timerEl) timerEl.textContent = `${secs}s`;
    if (secs <= 0) {
      clearInterval(_otpResendTimer);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `Kodu almadım → <u>Yeniden gönder</u>`;
      }
    }
  }, 1000);
}

function onOtpInput(el, idx) {
  el.value = el.value.replace(/\D/g,"");
  if (el.value && idx < 3) document.getElementById(`otp${idx+1}`)?.focus();
  // check complete
  const code = [0,1,2,3].map(i => document.getElementById(`otp${i}`)?.value || "").join("");
  if (code.length === 4) {
    const fb = document.getElementById("ob-otp-feedback");
    if (fb) { fb.textContent = "✓ Doğrulandı"; fb.className = "ob-otp-feedback ob-otp-success"; }
    setTimeout(() => go("onboarding-success"), 600);
  }
}

function onOtpKey(e, idx) {
  if (e.key === "Backspace" && !e.target.value && idx > 0) {
    document.getElementById(`otp${idx-1}`)?.focus();
  }
}

function finishOnboarding() {
  localStorage.setItem("mw_onboarding_done", "1");
  if (state.onboarding.name.trim()) {
    user.name = state.onboarding.name.trim();
    user.short = user.name.split(" ")[0];
    user.initials = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  }
  go("home");
}

function resetOnboarding() {
  localStorage.removeItem("mw_onboarding_done");
  state.onboarding = { userType:null, categories:[], distance:5, workTypes:["Yarı zamanlı"], minSalary:550, name:"", phone:"" };
  go("onboarding-splash");
}

/* ─── ROUTER MAP ─────────────────────────────────────────────────── */
const routes = {
  "register-otp":      renderRegisterOTP,
  "register-name":     renderRegisterName,
  "register-role":     renderRegisterRole,
  "register-location": renderRegisterLocation,
  "register-success":  renderRegisterSuccess,
  "onboarding-splash":     renderOnboardingSplash,
  "onboarding-welcome":    renderOnboardingWelcome,
  "onboarding-location":   renderOnboardingLocation,
  "onboarding-type":       renderOnboardingType,
  "onboarding-categories": renderOnboardingCategories,
  "onboarding-prefs":      renderOnboardingPrefs,
  "onboarding-account":    renderOnboardingAccount,
  "onboarding-otp":        renderOnboardingOTP,
  "onboarding-success":    renderOnboardingSuccess,
  auth:          renderAuth,
  home:          renderHome,
  nearby:        renderNearby,
  discover:      renderDiscover,
  "job-detail":  renderJobDetail,
  match:         renderMatch,
  notifications: renderNotifications,
  matches:       renderMatches,
  messages:      renderMessages,
  chat:          renderChat,
  profile:       renderProfile,
  settings:      renderSettings,
  interview:          renderInterview,
  navigation:         renderNavigation,
  result:             renderResult,
  "settings-profile": renderSettingsProfile,
  "settings-verify":  renderSettingsVerify,
  "settings-notifs":  renderSettingsNotifs,
  "settings-prefs":   renderSettingsPrefs,
  "settings-location":renderSettingsLocation,
  "settings-about":   renderSettingsAbout,
};

/* ─── RENDER ─────────────────────────────────────────────────────── */
function render() {
  const route = currentRoute();
  const fn = routes[route] || renderHome;
  document.getElementById("app").innerHTML = fn();
  const screenEl = document.querySelector(".screen");
  if (screenEl && state.navDir) {
    screenEl.classList.add(`ml-enter-${state.navDir}`);
    state.navDir = null;
  }
  if (route === "discover") initSwipeListeners();
  if (route === "chat") {
    const list = document.getElementById("messages-list");
    if (list) list.scrollTop = list.scrollHeight;
    window.MW?.Socket.joinMatch(getCallMatchId());
    if (_callSession) mountCallOverlay(_callSession.status);
  }
  if (route === "messages") {
    requestAnimationFrame(() => loadMatchesList());
  }
  if (route === "register-otp") {
    requestAnimationFrame(() => {
      document.getElementById("rotp0")?.focus();
      startRegOtpTimer();
    });
  }
  if (route === "onboarding-otp") {
    requestAnimationFrame(() => {
      document.getElementById("otp0")?.focus();
      startOtpTimer();
    });
  }
  if (route === "nearby") {
    requestAnimationFrame(() => {
      initLeafletMap();
      // Restore sheet state
      const sheet = document.getElementById("map-sheet");
      if (sheet && state.sheetState === "mid") sheet.classList.add("sheet-mid");
      else if (sheet && state.sheetState === "expanded") sheet.classList.add("sheet-expanded");
      // Restore selected pin route if any
      if (state.selectedPin) {
        const job = jobs.find(j => j.id === state.selectedPin);
        if (job) drawMapRoute(job);
      }
    });
  }
  // Rota değişince eski haritayı temizle
  if (route !== "nearby" && _leafletMap) {
    _leafletMap.remove();
    _leafletMap = null;
    _leafletMarkers = {};
  }
}

/* ─── SWIPE ENGINE ───────────────────────────────────────────────── */
const SWIPE_THRESHOLD = 80;
const UP_THRESHOLD    = 90;

function initSwipeListeners() {
  const card = document.getElementById("top-card");
  if (!card) return;
  card.addEventListener("pointerdown", onDragStart, { passive:false });
  document.addEventListener("pointermove", onDragMove, { passive:false });
  document.addEventListener("pointerup",   onDragEnd);
  document.addEventListener("pointercancel", () => snapBack(card));
  card.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") swipeCard("right");
    if (e.key === "ArrowLeft")  swipeCard("left");
    if (e.key === "ArrowUp")    openJob(currentSwipeJob()?.id || 1, "discover");
  });
  card.setAttribute("tabindex","0");
  card.setAttribute("role","article");
}

function onDragStart(e) {
  const sw = state.swipe;
  sw.isDragging = true;
  sw.startX = e.clientX; sw.startY = e.clientY;
  sw.currentDeltaX = 0; sw.currentDeltaY = 0;
  sw.thresholdReached = false; sw.directionLocked = null;
  sw.activeCard = document.getElementById("top-card");
  if (sw.activeCard) sw.activeCard.setPointerCapture(e.pointerId);
  e.preventDefault();
}

function onDragMove(e) {
  const sw = state.swipe;
  if (!sw.isDragging || !sw.activeCard) return;
  const dx = e.clientX - sw.startX;
  const dy = e.clientY - sw.startY;
  sw.currentDeltaX = dx;
  sw.currentDeltaY = dy;
  const absDx = Math.abs(dx), absDy = Math.abs(dy);

  if (!sw.directionLocked) {
    if (absDx > 8 || absDy > 8)
      sw.directionLocked = absDy > absDx * 1.2 ? "y" : "x";
  }

  if (sw.directionLocked === "y" && dy < -40) {
    sw.activeCard.style.transform = `translateY(${dy}px) scale(.97)`;
    const detailOl = document.getElementById("detail-ol");
    if (detailOl) detailOl.style.opacity = Math.min(1, (-dy - 40) / 50).toString();
    const likeOl  = document.getElementById("like-ol");
    const passOl  = document.getElementById("pass-ol");
    if (likeOl) likeOl.style.opacity = "0";
    if (passOl) passOl.style.opacity = "0";
    return;
  }

  if (sw.directionLocked !== "x") return;
  e.preventDefault();
  const rot = (dx / 160) * 16;
  sw.activeCard.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;

  const t = Math.min(1, Math.max(0, (absDx - 30) / 60));
  const likeOl = document.getElementById("like-ol");
  const passOl = document.getElementById("pass-ol");
  if (dx > 0) {
    if (likeOl) likeOl.style.opacity = t.toString();
    if (passOl) passOl.style.opacity = "0";
  } else {
    if (passOl) passOl.style.opacity = t.toString();
    if (likeOl) likeOl.style.opacity = "0";
  }
  if (absDx >= SWIPE_THRESHOLD && !sw.thresholdReached) {
    sw.thresholdReached = true;
    triggerHaptic(12);
    sw.activeCard.classList.add(dx > 0 ? "dc-at-threshold-r" : "dc-at-threshold-l");
  }
  if (absDx < SWIPE_THRESHOLD && sw.thresholdReached) {
    sw.thresholdReached = false;
    sw.activeCard.classList.remove("dc-at-threshold-r", "dc-at-threshold-l");
  }
}

function onDragEnd() {
  const sw = state.swipe;
  if (!sw.isDragging) return;
  sw.isDragging = false;
  const card = sw.activeCard;
  if (!card) return;
  document.removeEventListener("pointermove", onDragMove);
  document.removeEventListener("pointerup", onDragEnd);

  if (sw.directionLocked === "y" && sw.currentDeltaY < -UP_THRESHOLD) {
    const job = currentSwipeJob();
    if (job) { openJob(job.id, "discover"); return; }
  }
  if (sw.directionLocked === "x" && Math.abs(sw.currentDeltaX) >= SWIPE_THRESHOLD) {
    const dir = sw.currentDeltaX > 0 ? "right" : "left";
    animateCardOut(card, dir, () => commitSwipe(dir));
    return;
  }
  snapBack(card);
  initSwipeListeners();
}

function snapBack(card) {
  if (!card) return;
  card.classList.remove("dc-at-threshold-r", "dc-at-threshold-l", "dc-at-threshold-u");
  card.style.transition = "transform .45s cubic-bezier(.34,1.56,.64,1), box-shadow .2s";
  card.style.transform = "translateX(0) rotate(0deg) translateY(0) scale(1)";
  const likeOl = document.getElementById("like-ol");
  const passOl = document.getElementById("pass-ol");
  const detOl  = document.getElementById("detail-ol");
  [likeOl, passOl, detOl].forEach(el => { if (el) el.style.opacity = "0"; });
  setTimeout(() => { card.style.transition = "none"; }, 450);
}

function animateCardOut(card, dir, callback) {
  card.classList.remove("dc-at-threshold-r", "dc-at-threshold-l", "dc-at-threshold-u");
  const flyX = dir === "right" ? window.innerWidth + 300 : -(window.innerWidth + 300);
  const rot  = dir === "right" ? 32 : -32;
  card.style.transition = "transform .38s cubic-bezier(.25,.46,.45,.94), opacity .3s, box-shadow .15s";
  card.style.transform  = `translateX(${flyX}px) rotate(${rot}deg)`;
  card.style.opacity    = "0";
  card.style.boxShadow  = "none";
  playSwipeSound(dir);
  if (dir === "right") triggerHaptic([15, 20, 60]);
  else triggerHaptic(8);
  setTimeout(callback, 380);
}

function commitSwipe(dir) {
  const job = currentSwipeJob();
  if (!job) return;
  state.swipe.lastAction = { direction:dir, job, deckIndex:state.swipe.deckIndex };
  dgRecordView(job.id);
  dgRecordSwipe(dir);
  if (window.MW?.Auth.isLoggedIn()) {
    window.MW.JobsAPI.swipe(job.id, dir).catch(() => {});
  }
  if (dir === "right") {
    state.swipe.likedIds.push(job.id);
    navigator.vibrate?.([20, 30, 80]);
    showLikeExplosion();
    state.swipe.deckIndex++;
    // Every 3rd like triggers match screen
    if (state.swipe.likedIds.length % 3 === 1) {
      setTimeout(() => go("match"), 650);
      return;
    }
    showSwipeToast(`♥ ${job.company}'e ilgin iletildi`);
  } else {
    state.swipe.skippedIds.push(job.id);
    navigator.vibrate?.(8);
    state.swipe.deckIndex++;
  }
  const deckEl = document.getElementById("card-deck");
  if (deckEl) { deckEl.innerHTML = renderCardDeck(); initSwipeListeners(); }
  updateDeckInfo();
}

function swipeCard(dir) {
  const card = document.getElementById("top-card");
  if (!card) return;
  animateCardOut(card, dir, () => commitSwipe(dir));
}

function undoSwipe() {
  const last = state.swipe.lastAction;
  if (!last) return;
  if (last.direction === "right") state.swipe.likedIds = state.swipe.likedIds.filter(id => id !== last.job.id);
  else state.swipe.skippedIds = state.swipe.skippedIds.filter(id => id !== last.job.id);
  state.swipe.deckIndex = last.deckIndex;
  state.swipe.lastAction = null;
  const deckEl = document.getElementById("card-deck");
  if (deckEl) { deckEl.innerHTML = renderCardDeck(); initSwipeListeners(); }
  updateDeckInfo();
}

function resetDeck() {
  state.swipe.deckIndex = 0;
  state.swipe.likedIds = [];
  state.swipe.skippedIds = [];
  state.swipe.lastAction = null;
  const deckEl = document.getElementById("card-deck");
  if (deckEl) { deckEl.innerHTML = renderCardDeck(); initSwipeListeners(); }
  updateDeckInfo();
}

function playSwipeSound(dir) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const sf = dir === "right" ? 380 : 260;
    const ef = dir === "right" ? 580 : 140;
    osc.frequency.setValueAtTime(sf, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(ef, ctx.currentTime + .09);
    gain.gain.setValueAtTime(.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .09);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + .09);
  } catch(_) {}
}

/* ─── INTERACTION HANDLERS ───────────────────────────────────────── */
/* ─── MAP INTERACTION ────────────────────────────────────────────── */

function setSheetState(s) {
  state.sheetState = s;
  const sheet = document.getElementById("map-sheet");
  if (!sheet) return;
  sheet.className = "map-sheet" +
    (s === "mid" ? " sheet-mid" : s === "expanded" ? " sheet-expanded" : "");
}

function cycleSheetState() {
  const s = state.sheetState || "peek";
  setSheetState(s === "peek" ? "expanded" : "peek");
}

function selectMapPin(jobId) {
  state.selectedPin = jobId;
  const job = jobs.find(j => j.id === jobId);
  if (!job) return;

  // Update selected card HTML
  const cardEl = document.getElementById("sheet-selected-card");
  if (cardEl) cardEl.innerHTML = mapDetailCard(job);

  // Slide sheet to mid
  setSheetState("mid");

  // Update pin visual states
  jobs.forEach(j => {
    const el = document.getElementById(`lpin-${j.id}`);
    if (!el) return;
    el.classList.toggle("lpin-sel", j.id === jobId);
    el.classList.toggle("lpin-dim", j.id !== jobId);
  });

  // Draw route
  drawMapRoute(job);

  // Pan map to center between user and pin
  const marker = _leafletMarkers[jobId];
  if (marker && _leafletMap) {
    const userPt = L.latLng(40.9906, 29.0250);
    const pinPt  = marker.getLatLng();
    const mid    = L.latLng((userPt.lat + pinPt.lat) / 2, (userPt.lng + pinPt.lng) / 2);
    _leafletMap.flyTo(mid, 15, { duration: 0.5 });
  }

  // Show ETA banner
  const eta = document.getElementById("map-eta-banner");
  const etaTxt = document.getElementById("map-eta-text");
  if (eta) eta.style.display = "flex";
  if (etaTxt) etaTxt.textContent = `♟ ${job.travel[state.dirMode || "walk"]} dk`;
}

function deselectMapPin() {
  state.selectedPin = null;

  // Clear route
  if (_mapRouteLayer && _leafletMap) {
    _leafletMap.removeLayer(_mapRouteLayer);
    _mapRouteLayer = null;
  }

  // Restore pin styles
  jobs.forEach(j => {
    const el = document.getElementById(`lpin-${j.id}`);
    if (el) { el.classList.remove("lpin-sel", "lpin-dim"); }
  });

  // Reset sheet
  const cardEl = document.getElementById("sheet-selected-card");
  if (cardEl) cardEl.innerHTML = mapBrowseCard();
  setSheetState("peek");

  // Hide ETA banner
  const eta = document.getElementById("map-eta-banner");
  if (eta) eta.style.display = "none";
}

function drawMapRoute(job) {
  if (!_leafletMap || !window.L) return;
  if (_mapRouteLayer) { _leafletMap.removeLayer(_mapRouteLayer); }
  const modeColors = { walk:"#6C4EFF", bus:"#22C55E", car:"#F59E0B" };
  const color = modeColors[state.dirMode || "walk"];
  const lat = job.pin?.lat || (40.9906 + (job.pin?.y - 50) * 0.002);
  const lng = job.pin?.lng || (29.0250 + (job.pin?.x - 50) * 0.003);
  _mapRouteLayer = L.polyline([[40.9906, 29.0250],[lat, lng]],
    { color, weight:3, opacity:.85, dashArray:"8 6" }).addTo(_leafletMap);
}

function setMapRouteMode(mode) {
  state.dirMode = mode;
  document.querySelectorAll(".travel-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.mode === mode));
  if (state.selectedPin) {
    const job = jobs.find(j => j.id === state.selectedPin);
    if (job) {
      drawMapRoute(job);
      const etaTxt = document.getElementById("map-eta-text");
      const icons = { walk:"♟", bus:"▣", car:"◈" };
      if (etaTxt) etaTxt.textContent = `${icons[mode]} ${job.travel[mode]} dk`;
    }
  }
}

function selectPin(jobId) { selectMapPin(jobId); }
function toggleSheet() { cycleSheetState(); }
function filterMapJobs(q) { filterMapSearch(q); }
function filterMapType(btn, type) { setMapTypeFilter(btn, type); }

function setMCTab(tab) {
  state.matchesTab = tab;
  const body = document.getElementById("mc-body");
  if (body) body.innerHTML = mcBodyContent(tab);
  document.querySelectorAll(".mc-tab").forEach((b, i) =>
    b.classList.toggle("mc-tab-on", i === tab));
}
function setMatchesTab(i) { setMCTab(i); }

function setDirMode(m) {
  state.dirMode = m;
  render();
}

function selectResult(r) {
  state.selectedResult = r;
  document.querySelectorAll(".result-option").forEach(el => {
    el.classList.toggle("selected", el.textContent.trim() === r);
  });
}

function setRating(n) {
  state.rating = n;
  document.querySelectorAll(".star-btn").forEach((el, i) => {
    el.classList.toggle("on", i < n);
  });
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  if (!input || !input.value.trim()) return;
  const content = input.value.trim();
  input.value = "";

  if (state.chatMatchId && window.MW?.Socket.connected) {
    window.MW.Socket.sendMessage(state.chatMatchId, content);
    const now = new Date().toISOString();
    state.chatMessages.push({ sender_type:"user", content, created_at:now });
    _appendMsg("from-me", content, formatTime(now));
  } else {
    const now = new Date();
    const time = now.getHours() + ":" + String(now.getMinutes()).padStart(2,"0");
    state.messages.push({ from:"me", text:content, time });
    _appendMsg("from-me", content, time);
  }
}

function _appendMsg(cls, text, time) {
  const list = document.getElementById("messages-list");
  if (!list) return;
  const div = document.createElement("div");
  if (list.classList.contains("ch-thread")) {
    const isOut = cls === "from-me";
    div.className = `ch-bub ${isOut ? "ch-bub-out" : "ch-bub-in"}`;
    div.innerHTML = `<div class="ch-bub-text">${text}</div>
      <div class="ch-bub-meta">${time}${isOut ? '<span class="ch-read">✓✓</span>' : ""}</div>`;
  } else {
    div.className = `msg ${cls}`;
    div.innerHTML = `${text}<div class="msg-time">${time}</div>`;
  }
  list.appendChild(div);
  list.scrollTop = list.scrollHeight;
}

/* ─── SETTINGS & PROFILE HELPERS ────────────────────────────────── */
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("mw_theme", document.body.classList.contains("light-mode") ? "light" : "dark");
  render();
}

function doLogout() {
  window.MW?.AuthAPI.logout();
  window.MW?.Socket.disconnect();
  state.matchesList = [];
  state.chatMessages = [];
  state.chatMatchId = null;
  go("auth");
}

function saveProfile() {
  const name     = document.getElementById("sp-name")?.value.trim();
  const role     = document.getElementById("sp-role")?.value.trim();
  const location = document.getElementById("sp-location")?.value.trim();
  const exp      = document.getElementById("sp-exp")?.value.trim();
  const avail    = document.getElementById("sp-avail")?.value.trim();
  if (name)     { user.name = name; user.short = name.split(" ")[0]; user.initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }
  if (role)     user.role = role;
  if (location) user.location = location;
  if (exp)      user.experience = exp;
  if (avail)    user.availability = avail;
  go("settings");
}

function removeSkill(index) {
  user.skills.splice(index, 1);
  render();
}

function addSkill() {
  const name = prompt("Yeni yetenek:");
  if (name?.trim()) { user.skills.push(name.trim()); render(); }
}

function toggleNotifPref(key) {
  state.notifPrefs[key] = !state.notifPrefs[key];
  render();
}

function togglePrefType(type) {
  const idx = state.prefTypes.indexOf(type);
  if (idx >= 0) state.prefTypes.splice(idx, 1);
  else state.prefTypes.push(type);
  render();
}

function setPrefRadius(r) {
  state.prefRadius = r;
  render();
}

function filterSwipeDeck(btn, tag) {
  state.swipe.deckFilter = tag;
  state.swipe.deckIndex  = 0;
  document.querySelectorAll("#dc-filter-chips .chip").forEach(c => c.classList.remove("active"));
  if (btn) btn.classList.add("active");
  else {
    const allChip = document.querySelector("#dc-filter-chips .chip");
    if (allChip) allChip.classList.add("active");
  }
  const deckEl = document.getElementById("card-deck");
  if (deckEl) { deckEl.innerHTML = renderCardDeck(); initSwipeListeners(); }
  updateDeckInfo();
}

function openInterview(name, initials, role) {
  state.activeInterview = { name, initials, role };
  go("interview");
}

async function refreshLocation() {
  const btn = document.querySelector(".btn-primary");
  if (btn) { btn.disabled = true; btn.textContent = "Konum alınıyor..."; }
  const loc = await window.MW?.Location.get() || { lat:40.9906, lng:29.0250 };
  user.location = `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
  if (btn) { btn.disabled = false; btn.textContent = `${icon("ti-map-pin")} GPS ile Güncelle`; }
  render();
}

/* ─── CHAT HELPERS ───────────────────────────────────────────────── */
function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2,"0");
}

let _typingTimer = null;
function onChatTyping() {
  if (!state.chatMatchId || !window.MW?.Socket.connected) return;
  window.MW.Socket.typingStart(state.chatMatchId);
  clearTimeout(_typingTimer);
  _typingTimer = setTimeout(() => window.MW.Socket.typingStop(state.chatMatchId), 2000);
}

async function openChat(matchId, companyName, companyInitials) {
  state.chatMatchId = matchId;
  state.chatMatch   = { company: companyName, initials: companyInitials };
  state.chatMessages = [];
  state.chatTyping   = false;

  if (window.MW?.Socket.connected) {
    window.MW.Socket.joinMatch(matchId);
  }

  try {
    const msgs = await window.MW.MessagesAPI.list(matchId);
    if (Array.isArray(msgs)) state.chatMessages = msgs;
  } catch(e) {}

  go('chat');
}

async function loadMatchesList() {
  if (!window.MW?.Auth.isLoggedIn()) return;
  try {
    const data = await window.MW.MatchesAPI.list();
    if (Array.isArray(data)) {
      const prevLen = state.matchesList.length;
      state.matchesList = data;
      if (data.length !== prevLen && location.hash === "#messages") render();
    }
  } catch(e) {}
}

function initSocketListeners() {
  if (!window.MW?.Socket || _callListenersReady) return;
  _callListenersReady = true;

  window.MW.Socket.onMessage(msg => {
    if (msg.match_id !== state.chatMatchId) return;
    if (msg.sender_type === "user") return; // kendi mesajımız, zaten ekledik
    state.chatMessages.push(msg);
    if (location.hash === "#chat") {
      _appendMsg("from-other", msg.content, formatTime(msg.created_at));
    }
  });

  window.MW.Socket.onTypingStart(() => {
    state.chatTyping = true;
    const el = document.getElementById("chat-status");
    if (el) el.textContent = "● Yazıyor...";
  });

  window.MW.Socket.onTypingStop(() => {
    state.chatTyping = false;
    const el = document.getElementById("chat-status");
    if (el) el.textContent = "● Çevrimiçi";
  });

  window.MW.Socket.onIncomingCall(payload => {
    if (_callSession) {
      window.MW.Socket.rejectCall(payload.matchId, "busy");
      return;
    }
    _callSession = {
      type:payload.type, matchId:payload.matchId, offer:payload.offer,
      caller:payload.caller, isCaller:false, status:"incoming", pendingIce:[], startedAt:null,
    };
    triggerHaptic?.([180,80,180]);
    mountCallOverlay("incoming");
  });

  window.MW.Socket.onCallAccepted(async ({ matchId, answer }) => {
    if (!_callSession?.isCaller || _callSession.matchId !== matchId) return;
    try {
      await _callSession.pc.setRemoteDescription(answer);
      await flushCallIce();
      mountCallOverlay("connecting");
    } catch (_) { finishChatCall("failed", false); }
  });

  window.MW.Socket.onCallIce(async ({ matchId, candidate }) => {
    if (!_callSession || _callSession.matchId !== matchId) return;
    if (!_callSession.pc?.remoteDescription) _callSession.pendingIce.push(candidate);
    else try { await _callSession.pc.addIceCandidate(candidate); } catch (_) {}
  });

  window.MW.Socket.onCallRejected(({ matchId, reason }) => {
    if (_callSession?.matchId !== matchId) return;
    finishChatCall(reason === "busy" ? "unavailable" : "rejected", false);
  });

  window.MW.Socket.onCallEnded(({ matchId }) => {
    if (_callSession?.matchId === matchId) finishChatCall("ended", false);
  });

  window.MW.Socket.onCallUnavailable(({ matchId }) => {
    if (_callSession?.matchId === matchId) finishChatCall("unavailable", false, 1500);
  });
}

/* ─── API ENTEGRASYONU ───────────────────────────────────────────── */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function mapFullApiJob(j, index, userLat, userLng) {
  const distKm = (userLat != null && j.lat != null)
    ? haversineKm(userLat, userLng, j.lat, j.lng)
    : 1.5;
  const walkMin = Math.max(1, Math.round(distKm * 1000 / 80));
  const hues = ["108,78,255","34,197,94","245,158,11","239,68,68","139,92,255","20,184,166","251,113,133","96,165,250"];
  const score = Math.min(95, Math.max(60, 72 + Math.round((j.salary_max - 520) / 5)));
  const tier = score >= 85 ? "high" : score >= 70 ? "mid" : "low";
  const co = j.companies || {};
  return {
    id: j.id,
    title: j.title,
    company: co.name || "?",
    initials: co.initials || "??",
    sal: { min: j.salary_min, max: j.salary_max, cur: j.currency || "₺", per: j.period || "gün" },
    distance: +distKm.toFixed(1),
    travel: { walk: walkMin, bus: Math.round(walkMin * 0.4), car: Math.round(walkMin * 0.27) },
    matchScore: score,
    type: j.type,
    pin: { x: 20 + (index * 11) % 60, y: 30 + (index * 13) % 50, tier },
    desc: j.description || "",
    req: j.requirements || [],
    benefits: j.benefits || [],
    schedule: j.schedule || "",
    tags: j.tags || [],
    hue: hues[index % hues.length],
  };
}

async function loadJobsFromAPI() {
  if (!window.MW?.Auth.isLoggedIn()) return;
  try {
    const loc = await window.MW.Location.get();
    const data = await window.MW.JobsAPI.nearby(loc.lat, loc.lng, 5000);
    if (Array.isArray(data) && data.length > 0) {
      jobs = data.map((j, i) => mapFullApiJob(j, i, loc.lat, loc.lng));
      _apiJobsLoaded = true;
      state.swipe.deckIndex = 0;
      if (currentRoute() === "discover") render();
    }
  } catch(e) {
    console.warn("API yüklenemedi, demo verisi kullanılıyor:", e);
  }
}

async function doLogin() {
  const emailEl = document.querySelector('.auth-screen input[type="email"]');
  const passEl  = document.querySelector('.auth-screen input[type="password"]');
  if (!emailEl || !passEl) return;
  const btn = document.querySelector('.auth-screen .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = "Giriş yapılıyor..."; }
  const res = await window.MW.AuthAPI.login(emailEl.value.trim(), passEl.value);
  if (!res.ok) {
    if (btn) { btn.disabled = false; btn.textContent = "Giriş Yap"; }
    alert(res.error || "Giriş başarısız");
    return;
  }
  await loadJobsFromAPI();
  window.MW.Socket.connect();
  setTimeout(initSocketListeners, 1000);
  go('home');
}

function demoLogin() {
  go('home');
}

/* ─── DISCOVERY GAMIFICATION ─────────────────────────────────────── */

const DG_WEEKLY_GOAL = 15;

const DG_MILESTONES = [
  { key:"first_like",   test: d => d.weekLiked  >= 1,  label:"İlk ilgin gönderildi",      sub:"Keşfin başladı." },
  { key:"five_likes",   test: d => d.weekLiked  >= 5,  label:"Bu hafta 5 ilgi",            sub:"Güçlü bir başlangıç." },
  { key:"ten_views",    test: d => d.weekViewed >= 10, label:"10 fırsat incelendi",         sub:"Alanı geniş tutuyorsun." },
  { key:"goal_reached", test: d => d.weekViewed >= 15, label:"Haftalık hedef tamamlandı",   sub:"Bu hafta 15 fırsat keşfettin." },
  { key:"streak_3",     test: d => d.streakDays >= 3,  label:"3 günlük keşif serisi",      sub:"Tutarlılık güç." },
  { key:"streak_7",     test: d => d.streakDays >= 7,  label:"7 günlük keşif serisi",      sub:"Haftanın her günü aktifsin." },
];

const DG_ENCOURAGEMENTS = [
  { trigger:1,  dir:"any",   msg:"İyi başlangıç — çevrende fırsatlar var." },
  { trigger:3,  dir:"any",   msg:"Momentum yakaladın." },
  { trigger:5,  dir:"right", msg:"Bu hafta 5 fırsat için ilgin kaydedildi." },
  { trigger:10, dir:"any",   msg:"10 fırsat incelendi — sana daha iyi öneriler geliyor." },
  { trigger:15, dir:"any",   msg:"Haftalık hedefe ulaştın. Harika." },
];

function dgIsoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function dgWeekStart(d = new Date()) {
  const dt  = new Date(d);
  const dow = dt.getDay();
  dt.setDate(dt.getDate() - (dow === 0 ? 6 : dow - 1));
  return dgIsoDate(dt);
}

function dgDayIndex() {
  const dow = new Date().getDay();
  return dow === 0 ? 6 : dow - 1;
}

function dgLoad() {
  try {
    const raw = localStorage.getItem("mw_discovery");
    if (!raw) return;
    Object.assign(state.discovery, JSON.parse(raw));
  } catch(e) {}
}

function dgSave() {
  try {
    localStorage.setItem("mw_discovery", JSON.stringify(state.discovery));
  } catch(e) {}
}

function dgCheckWeekReset() {
  const d = state.discovery;
  const thisWeek = dgWeekStart();
  if (d.weekStart !== thisWeek) {
    d.weekStart    = thisWeek;
    d.weekViewed   = 0;
    d.weekLiked    = 0;
    d.weekActivity = [0,0,0,0,0,0,0];
    d.viewedIds    = [];
    dgSave();
  }
}

function dgUpdateStreak() {
  const d     = state.discovery;
  const today = dgIsoDate();
  if (d.streakLastDate === today) return;
  if (!d.streakLastDate) {
    d.streakDays     = 1;
    d.streakLastDate = today;
    dgSave();
    return;
  }
  const diffDay = Math.round((new Date(today) - new Date(d.streakLastDate)) / 86400000);
  d.streakDays     = diffDay === 1 ? (d.streakDays || 0) + 1 : 1;
  d.streakLastDate = today;
  dgSave();
}

function dgRecordView(jobId) {
  const d = state.discovery;
  if (!d.viewedIds) d.viewedIds = [];
  if (d.viewedIds.includes(jobId)) return;
  d.viewedIds.push(jobId);
  d.weekViewed = (d.weekViewed || 0) + 1;
  d.sessionSwiped = (d.sessionSwiped || 0) + 1;
  if (!d.weekActivity) d.weekActivity = [0,0,0,0,0,0,0];
  d.weekActivity[dgDayIndex()] = (d.weekActivity[dgDayIndex()] || 0) + 1;
  dgSave();
}

function dgRecordSwipe(dir) {
  const d = state.discovery;
  if (dir === "right") d.weekLiked = (d.weekLiked || 0) + 1;
  dgUpdateStreak();
  dgSave();
  dgCheckMilestones();
  // Smart encouragement — fire once per trigger
  const enc = DG_ENCOURAGEMENTS.find(e =>
    (d.weekViewed === e.trigger || d.weekLiked === e.trigger) &&
    (e.dir === "any" || e.dir === dir)
  );
  if (enc) {
    if (!d.shownEncouragements) d.shownEncouragements = [];
    const key = `${enc.trigger}:${enc.dir}`;
    if (!d.shownEncouragements.includes(key)) {
      d.shownEncouragements.push(key);
      dgSave();
      setTimeout(() => dgEncouragementToast(enc.msg), 900);
    }
  }
}

function dgCheckMilestones() {
  const d = state.discovery;
  if (!d.milestones) d.milestones = [];
  DG_MILESTONES.forEach(m => {
    if (!d.milestones.includes(m.key) && m.test(d)) {
      d.milestones.push(m.key);
      dgSave();
      setTimeout(() => dgMilestoneToast(m), 1400);
    }
  });
}

function dgEncouragementToast(msg) {
  const el = document.createElement("div");
  el.className = "dg-encourage-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("dg-et-in"));
  setTimeout(() => {
    el.classList.remove("dg-et-in");
    setTimeout(() => el.remove(), 400);
  }, 3500);
}

function dgMilestoneToast(milestone) {
  const el = document.createElement("div");
  el.className = "dg-milestone-toast";
  el.innerHTML = `<span class="dg-mt-icon">✦</span>
    <div class="dg-mt-body">
      <div class="dg-mt-title">${milestone.label}</div>
      <div class="dg-mt-sub">${milestone.sub}</div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("dg-mt-in"));
  setTimeout(() => {
    el.classList.remove("dg-mt-in");
    setTimeout(() => el.remove(), 400);
  }, 4500);
}

function dgWeeklyProgress() {
  const d   = state.discovery;
  const done = Math.min(d.weekViewed || 0, DG_WEEKLY_GOAL);
  const pct  = Math.round(done / DG_WEEKLY_GOAL * 100);
  return { done, goal: DG_WEEKLY_GOAL, pct };
}

function dgHomeWidget() {
  const d = state.discovery;
  const { done, goal, pct } = dgWeeklyProgress();
  const streak = d.streakDays || 0;
  const todayIdx = dgDayIndex();
  const activity = d.weekActivity || [0,0,0,0,0,0,0];
  const maxAct = Math.max(...activity, 1);
  const dayLabels = ["Pt","Sa","Ça","Pe","Cu","Ct","Pz"];
  const label = done === 0 ? "Bu hafta keşfet" : "Bu hafta keşifler";
  const streakHtml = streak >= 2
    ? `<div class="dg-streak-pill"><span class="dg-streak-dot"></span>${streak} günlük seri</div>`
    : done > 0
      ? `<div class="dg-streak-pill dg-streak-dim">Seriyi sürdür →</div>`
      : `<div class="dg-streak-pill dg-streak-dim">Bugün keşfet → seri başlat</div>`;
  return `<div class="dg-widget" onclick="go('discover')">
    <div class="dg-widget-main">
      <div class="dg-widget-top">
        <span class="dg-widget-label">${label}</span>
        <span class="dg-widget-nums">${done}/${goal}</span>
      </div>
      <div class="dg-progress-track">
        <div class="dg-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="dg-widget-bottom">
        ${streakHtml}
        <span class="dg-widget-cta">Keşfe git →</span>
      </div>
    </div>
    <div class="dg-mini-chart">
      <div class="dg-day-bars">
        ${activity.map((c, i) => `<div class="dg-day-bar${i === todayIdx ? " dg-today" : ""}" style="--dg-h:${Math.round(c / maxAct * 100)}%"></div>`).join("")}
      </div>
      <div class="dg-day-labels">
        ${dayLabels.map((l, i) => `<span${i === todayIdx ? ' class="dg-lbl-today"' : ""}>${l}</span>`).join("")}
      </div>
    </div>
  </div>`;
}

function dgDiscoverHeader() {
  const { done, goal, pct } = dgWeeklyProgress();
  if (done === 0) return "";
  return `<div class="dg-dc-header">
    <span class="dg-dc-label">Haftalık hedef</span>
    <div class="dg-dc-bar-wrap">
      <div class="dg-dc-bar-fill" style="width:${pct}%"></div>
    </div>
    <span class="dg-dc-nums">${done}/${goal}</span>
  </div>`;
}

/* ─── BOOT ───────────────────────────────────────────────────────── */
window.addEventListener("hashchange", render);
window.addEventListener("offline", () => {
  const app = document.getElementById("app");
  if (app) app.innerHTML = `<section class="screen" style="display:flex;align-items:center;justify-content:center;min-height:100vh">${offlineState()}</section>`;
});
window.addEventListener("online", () => render());
window.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("mw_theme") === "light") document.body.classList.add("light-mode");
  dgLoad();
  dgCheckWeekReset();
  const onboardingDone = localStorage.getItem("mw_onboarding_done");
  if (window.MW?.Auth.isLoggedIn()) {
    await loadJobsFromAPI();
    if (!location.hash || location.hash === "#auth") location.hash = "home";
  } else if (!onboardingDone) {
    location.hash = "onboarding-splash";
  } else {
    if (!location.hash || location.hash === "#onboarding-splash") location.hash = "auth";
  }
  render();
  window.MW?.Socket.connect();
  initSocketListeners();
  setTimeout(() => {
    if (currentRoute() === "chat") window.MW?.Socket.joinMatch(getCallMatchId());
  }, 500);
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js", { updateViaCache:"none" })
      .then(reg => reg.update())
      .catch(() => {});
  }
});

/* expose to inline onclick */
Object.assign(window, {
  go, render, openJob, swipeCard, undoSwipe, resetDeck,
  selectPin, toggleSheet, setMatchesTab, setMCTab, setDirMode,
  selectResult, setRating, sendMessage,
  startChatCall, acceptIncomingCall, rejectIncomingCall, endChatCall,
  toggleCallMute, toggleCallCamera,
  selectMapPin, deselectMapPin, setSheetState, cycleSheetState,
  setMapRouteMode, setMapTypeFilter, filterMapSearch, applyMapFilters,
  setSortMode, filterMapJobs, filterMapType, centerMapOnUser,
  doLogin, demoLogin, openChat, onChatTyping,
  toggleDarkMode, doLogout, saveProfile, removeSkill, addSkill,
  markAllRead, markNotifRead, toggleNotifPref,
  togglePrefType, setPrefRadius, filterSwipeDeck,
  triggerHaptic, mlParticles, mlBounceNavIcon,
  useStarterMessage, offlineState, interviewSuccessHtml, filterEmptyState,
  toggleSpeedMode, showLikeExplosion, showSwipeToast, updateDeckInfo,
  setDetailMode, commitDetailInterest,
  sendQuickReply, toggleChatAttach, shareLocation, shareDocument, shareProfile,
  proposeInterview, acceptInterview, declineInterview,
  openInterview, refreshLocation, togglePfStyle, togglePfInterest,
  setNFTab, markNFRead,
  formatAuthPhone, submitAuthPhone, onRegOtpInput, onRegOtpKey,
  onRegNameInput, updateRegAvatar, cycleAvatarColor,
  toggleRegSkill, goToRegisterLocation, selectRegCity, selectRegDistrict,
  finishRegistration, completeRegistration,
  requestLocationPermission, selectUserType, toggleCategory,
  updateObDistance, toggleObWorkType, updateObSalary,
  updateObAccountBtn, onOtpInput, onOtpKey,
  finishOnboarding, resetOnboarding,
  dgHomeWidget, dgDiscoverHeader, dgEncouragementToast, dgMilestoneToast,
  dgLoad, dgSave, dgRecordView, dgRecordSwipe, dgCheckMilestones,
});
