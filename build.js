// ============================================================
//  build.js  -  Run with: node build.js
//  Generates the complete site into /public from content.json
//  EDIT content.json, NOT this file.
// ============================================================
const { fs, path, ROOT, OUT, C, CSS_SHARED, CSS_HOME, COURSES, TIERS } = require('./build-data.js');

const PRICE = s => `<span class="price-ph">${s}</span>`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">`;

// Analytics + advertising tags (mirrors the portal: GA4 + Meta Pixel).
// GA4 G-0EJWTZD0T9 with cross-domain linking between the marketing site and the portal.
const TRACKING = `<!-- Google tag (gtag.js) - GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0EJWTZD0T9"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-0EJWTZD0T9', { linker: { domains: ['luxuryleasingacademy.com','portal.luxuryleasingacademy.com'] } });
</script>
<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2652339411805018');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2652339411805018&ev=PageView&noscript=1"/></noscript>`;

// Cookie notice: subtle, brand-matched, remembers the choice in localStorage so it shows once.
const COOKIE = `<div id="cookie-bar" role="dialog" aria-label="Cookie notice" style="display:none">
<style>
#cookie-bar{position:fixed;left:18px;bottom:18px;z-index:80;max-width:330px;background:#FFFDF9;border:1px solid rgba(185,137,47,.28);border-radius:14px;box-shadow:0 16px 40px rgba(42,32,24,.16);padding:15px 17px;font-family:'Figtree',sans-serif}
#cookie-bar p{font-size:13px;line-height:1.5;color:#4A3D30;margin:0 0 12px}
#cookie-bar a.cb-link{font-size:12.5px;color:#8C7C68;text-decoration:none}
#cookie-bar a.cb-link:hover{color:#2A2018;text-decoration:underline}
#cookie-bar .cb-row{display:flex;align-items:center;gap:16px}
#cookie-bar .cb-accept{font-family:inherit;font-size:13.5px;font-weight:600;color:#fff;background:linear-gradient(120deg,#B9892F,#D4A94E);border:none;border-radius:999px;padding:9px 24px;cursor:pointer;transition:transform .2s}
#cookie-bar .cb-accept:hover{transform:translateY(-1px)}
@media (max-width:520px){#cookie-bar{left:12px;right:12px;bottom:12px;max-width:none}}
</style>
<p>We use cookies to measure where our traffic comes from and improve your experience.</p>
<div class="cb-row">
<button class="cb-accept" type="button" onclick="window.__llaCookie&&window.__llaCookie()">Accept</button>
<a class="cb-link" href="privacy.html">Privacy Policy</a>
</div>
</div>
<script>
(function(){var K='lla_cookie_consent';function el(){return document.getElementById('cookie-bar');}
window.__llaCookie=function(){try{localStorage.setItem(K,'accepted');}catch(e){}var b=el();if(b)b.style.display='none';};
try{if(!localStorage.getItem(K)){var b=el();if(b)b.style.display='block';}}catch(e){var b2=el();if(b2)b2.style.display='block';}})();
</script>`;

function nav() {
  const L = [['courses.html', C.nav.courses], ['club.html', C.nav.club], ['ebook.html', C.nav.ebook], ['meet-matty.html', C.nav.matty]];
  const desk = L.map(([h, t]) => `<a href="${h}">${t}</a>`).join('');
  const mob = L.map(([h, t]) => `<a href="${h}">${t}</a>`).join('');
  return `<nav>
  <div class="nav-inner">
    <a class="nav-logo" href="index.html"><img src="${C.images.crest}" alt="${C.brand.name}"></a>
    <button class="nav-burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <div class="nav-links">${desk}<a href="${C.brand.portalUrl}" class="nav-login">${C.nav.login}</a><a href="club.html" class="btn btn-gold">${C.nav.joinButton}</a></div>
  </div>
  <div class="mobile-menu" id="mobileMenu">${mob}<a href="${C.brand.portalUrl}" class="mm-login">${C.nav.login}</a><a href="club.html" class="btn btn-gold">${C.nav.joinButton}</a></div>
</nav>`;
}

const FOOTER = `<footer>
  <div class="wrap">
    <div class="foot-brand">
      <div class="foot-logo-big"><img src="${C.images.footerLogo}" alt="${C.brand.name}"></div>
      <div class="foot-tag-center">${C.brand.tagline}</div>
      <div class="foot-hash">${C.brand.hashtag}</div>
    </div>
    <div class="foot-grid foot-grid-3">
      <div><h4>Learn</h4><a href="courses.html">${C.nav.courses}</a><a href="club.html">${C.nav.club}</a><a href="ebook.html">${C.nav.ebook}</a><a href="playbook.html">The Playbook</a></div>
      <div><h4>About</h4><a href="meet-matty.html">${C.nav.matty}</a><a href="the-lease-up.html">The Lease Up</a><a href="mailto:${C.brand.contactEmail}">Contact</a></div>
      <div><h4>Students</h4><a href="${C.brand.portalUrl}">${C.nav.login}</a><a href="${C.links.termsUrl}">Terms</a><a href="${C.links.privacyUrl}">Privacy</a></div>
    </div>
    <div class="foot-legal" style="max-width:880px;margin:0 auto 16px;padding-top:18px;border-top:1px solid rgba(255,255,255,.09);font-size:12px;line-height:1.55;color:rgba(255,255,255,.42);text-align:center">Results vary and are not typical. Luxury Leasing Academy LLC does not guarantee any specific income, earnings, or results. Individual outcomes depend on your own effort, skill, and market conditions. See our <a href="${C.links.termsUrl}" style="color:rgba(255,255,255,.62);text-decoration:underline">Terms</a> for full details.</div>
    <div class="foot-bottom"><div>&copy; 2026 ${C.brand.name}, LLC</div><div>${C.brand.city}</div></div>
  </div>
</footer>`;

const JS = `<script>
const burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
if(burger){burger.addEventListener('click',()=>{const o=mm.classList.toggle('open');burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)});
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');burger.classList.remove('open')}));}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
document.querySelectorAll('form[data-optin],.optin form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var em=f.querySelector('input[type=email]');var body=new URLSearchParams({u:'5',f:'3',s:'',c:'0',m:'0',act:'sub',v:'2',email:em?em.value:''});fetch('https://luxuryleasingacademy.activehosted.com/proc.php',{method:'POST',mode:'no-cors',body:body}).finally(function(){window.location.href='thanks.html';});});});
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,end=parseFloat(el.dataset.count||0);}),{threshold:.6});
</script>`;

const SOCIAL_ICONS = {
  youtube:'<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></svg>',
  instagram:'<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.07 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.05 1.2-.25 1.8-.42 2.2a3.8 3.8 0 0 1-.9 1.4 3.8 3.8 0 0 1-1.4.9c-.4.17-1 .37-2.2.42-1.2.07-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.05-1.8-.25-2.2-.42a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38zm6.97-11.4a1.58 1.58 0 1 1-1.57-1.58 1.58 1.58 0 0 1 1.57 1.58z"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24"><path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.3v13.2a2.4 2.4 0 1 1-2.4-2.4c.2 0 .5 0 .7.1V8.5a5.7 5.7 0 0 0-.7 0 5.7 5.7 0 1 0 5.7 5.7V8.6a7.5 7.5 0 0 0 4.4 1.4V6.7a4.3 4.3 0 0 1-3.4-.9z"/></svg>',
  facebook:'<svg viewBox="0 0 24 24"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.23 2.7.23v2.9h-1.5c-1.5 0-2 .93-2 1.9V12h3.3l-.53 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>',
  linkedin:'<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.53C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.73C24 .78 23.2 0 22.22 0z"/></svg>',
  x:'<svg viewBox="0 0 24 24"><path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.5h7.6l5.24 6.93zm-1.29 18.8h2.04L6.49 3.6H4.3z"/></svg>'
};
function socialIconLinks(obj){
  obj = obj || {};
  return ['youtube','instagram','tiktok','facebook','linkedin','x']
    .filter(k => obj[k] && obj[k].trim())
    .map(k => `<a href="${obj[k]}" target="_blank" rel="noopener" aria-label="${k}">${SOCIAL_ICONS[k]}</a>`).join('');
}

function page(title, body, css) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${title}</title>
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="shortcut icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
${FONTS}
<style>${css || CSS_SHARED}</style>
${TRACKING}
</head>
<body>
${nav()}
${body}
${FOOTER}
${JS}
${COOKIE}
</body>
</html>`;
}

function esc(s){return s;}
function highlight(text, phrase, cls='em-gold'){
  if(!phrase || !text.includes(phrase)) return text;
  return text.replace(phrase, `<em style="font-style:italic;color:var(--gold)">${phrase}</em>`);
}

const write = (name, html) => { fs.writeFileSync(path.join(OUT, name), html); console.log('  built', name); };

const THANKS_CSS = `
.ty-wrap{max-width:660px;margin:0 auto;padding:0 28px}
.ty-card{background:var(--white);border:1px solid rgba(185,137,47,.18);border-radius:18px;padding:34px 32px;text-align:left;box-shadow:0 20px 50px rgba(42,32,24,.07)}
.ty-card h2{font-size:23px;margin-bottom:2px}
.ty-sender{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;background:var(--cream);border-radius:12px;padding:13px 18px;margin:16px 0 22px;font-size:15px;color:var(--espresso-soft)}
.ty-sender b{color:var(--espresso)}
.ty-sender .lbl{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--haze)}
.ty-steps{list-style:none;counter-reset:tystep}
.ty-steps li{position:relative;padding:15px 0 15px 48px;border-top:1px solid rgba(185,137,47,.14);font-size:16px;color:var(--espresso-soft);line-height:1.55}
.ty-steps li:first-child{border-top:none}
.ty-steps li strong{color:var(--espresso);font-weight:600}
.ty-steps li::before{counter-increment:tystep;content:counter(tystep);position:absolute;left:0;top:14px;width:31px;height:31px;border-radius:50%;background:linear-gradient(120deg,var(--gold),var(--gold-bright));color:#fff;font-family:'Fraunces',serif;font-weight:600;font-size:15px;display:flex;align-items:center;justify-content:center;box-shadow:0 5px 13px rgba(185,137,47,.3)}
.ty-cta{text-align:center;margin-top:28px}
.ty-note{font-size:14.5px;color:var(--haze);margin:20px auto 0;text-align:center;max-width:560px;line-height:1.55}
.ty-note a{color:var(--gold);font-weight:600;text-decoration:underline}
@media(max-width:600px){.ty-card{padding:26px 22px}.ty-wrap{padding:0 20px}}
`;

function tyShell(o){
  const sender = `<div class="ty-sender"><span class="lbl">Look for</span><b>${C.brand.name}</b><span>&middot;</span><span>${C.brand.contactEmail}</span></div>`;
  const stepsHtml = o.steps.map(s => `<li>${s}</li>`).join('');
  const ctaHtml = o.cta ? `<div class="ty-cta"><a href="${o.cta.href}" class="btn btn-gold" style="font-size:16px;padding:14px 32px">${o.cta.label}</a></div>` : '';
  const noteHtml = o.note ? `<div class="ty-note">${o.note}</div>` : '';
  return `<header class="confirm"><div class="wrap"><div class="eyebrow rv in">${o.eyebrow}</div><h1 class="rv in">${o.h1}</h1><p class="rv in">${o.intro}</p></div></header>
<section class="section" style="padding-top:14px"><div class="ty-wrap rv">
  <div class="ty-card">
    <h2>${o.inboxTitle}</h2>
    ${sender}
    <ol class="ty-steps">${stepsHtml}</ol>
    ${ctaHtml}
  </div>
  ${noteHtml}
</div></section>
${o.secondary || ''}`;
}


// ---------- HOME ----------
function buildHome() {
  const h = C.home;
  const body = `<header class="hero" style="padding:88px 0 70px;position:relative;overflow:hidden">
  <div class="wrap home-hero-grid" id="herogrid">
    <div class="rv in">
      <div class="eyebrow">${h.eyebrow}</div>
      <h1 style="font-size:clamp(40px,5.2vw,64px);margin-bottom:24px">${highlight(h.heroHeadline, h.heroHighlight)}</h1>
      <p style="font-size:19px;color:var(--espresso-soft);max-width:560px;margin-bottom:34px">${h.heroSub}</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:52px">
        <a href="club.html" class="btn btn-gold">Join the Elite Leasing Club</a>
        <a href="ebook.html" class="btn btn-ghost">Get the Free E-Book</a>
      </div>
      <style>@media (max-width:600px){.hero-stats{display:none}}</style>
      <div class="stats hero-stats">
        <div class="stat"><div class="num">${h.stat1Num}</div><div class="lbl">${h.stat1Label}</div></div>
        <div class="stat"><div class="num">${h.stat2Num}</div><div class="lbl">${h.stat2Label}</div></div>
        <div class="stat"><div class="num">${h.stat3Num}</div><div class="lbl">${h.stat3Label}</div></div>
      </div>
    </div>
    <div class="rv in" style="position:relative">
      <div class="arch"><img src="${C.images.heroPhoto}" alt="${C.brand.name}"></div>
    </div>
  </div>
</header>
<hr class="horizon">
<section class="band">
  <div class="glow"></div>
  <div class="wrap home-band-grid">
    <div class="rv home-band-big">${h.problemBig}</div>
    <div class="rv">
      <h2>${h.problemHeadline}</h2>
      <p>${h.problemBody}</p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head rv"><div class="eyebrow">The Model</div><h2>Why agents across the country are switching to luxury leasing</h2></div>
    <div class="cards3">
      <div class="card rv"><div class="tick">1</div><h3 style="font-size:22px;margin-bottom:12px">Faster commissions, no waiting</h3><p style="color:var(--espresso-soft);font-size:16px">Sales agents wait months to close one deal. Rental agents close multiple deals a week. Get paid faster, and more consistently.</p></div>
      <div class="card rv"><div class="tick">2</div><h3 style="font-size:22px;margin-bottom:12px">Clients who are ready to move</h3><p style="color:var(--espresso-soft);font-size:16px">Rental clients aren't browsing. They have a move-in date, a budget, and a decision to make. Fewer tire kickers, more closed deals.</p></div>
      <div class="card rv"><div class="tick">3</div><h3 style="font-size:22px;margin-bottom:12px">A market most agents overlook</h3><p style="color:var(--espresso-soft);font-size:16px">Everyone fights over the same sales listings. Luxury rentals are high volume and high demand, and most agents don't even know the opportunity exists.</p></div>
    </div>
  </div>
</section>
<hr class="horizon">
<section class="section" style="background:var(--cream)">
  <div class="wrap">
    <div class="section-head rv"><div class="eyebrow">The Path</div><h2>Your path to a real luxury rental business</h2></div>
    <div class="cards3">
      <div class="card rv step-card"><div class="step-card-img"><img src="${C.images.ebookCover}" alt="E-book" style="max-height:100%"></div><div class="step-card-body"><div class="step-no-label">STEP 01</div><h3 style="font-size:23px;margin-bottom:10px">Start free</h3><p style="color:var(--espresso-soft);font-size:15.5px;margin-bottom:18px">Download the e-book and learn the 9 secrets top earners use to build their rental businesses.</p><a href="ebook.html" style="color:var(--gold);font-weight:600;font-size:15px">Get the Free E-Book &rarr;</a></div></div>
      <div class="card rv step-card"><div class="step-card-img"><img src="img/c1-mockup.png" alt="Courses" style="max-height:100%"></div><div class="step-card-body"><div class="step-no-label">STEP 02</div><h3 style="font-size:23px;margin-bottom:10px">Learn the system</h3><p style="color:var(--espresso-soft);font-size:15.5px;margin-bottom:18px">Nine courses covering everything from your first lease to scaling a rental empire. In order, step by step.</p><a href="courses.html" style="color:var(--gold);font-weight:600;font-size:15px">Browse the Courses &rarr;</a></div></div>
      <div class="card rv step-card"><div class="step-card-img"><img src="img/club-image.png" alt="Club" style="max-height:100%"></div><div class="step-card-body"><div class="step-no-label">STEP 03</div><h3 style="font-size:23px;margin-bottom:10px">Go all in</h3><p style="color:var(--espresso-soft);font-size:15.5px;margin-bottom:18px">The Elite Leasing Club: every course, weekly live coaching, and a community of agents actually closing deals.</p><a href="club.html" style="color:var(--gold);font-weight:600;font-size:15px">Join the Club &rarr;</a></div></div>
    </div>
  </div>
</section>
<section class="final">
  <div class="glow"></div>
  <div class="wrap">
    <h2 class="rv">${h.finalHeadline}</h2>
    <p class="rv">${h.finalSub}</p>
    <a href="club.html" class="btn btn-gold rv" style="font-size:17px;padding:16px 38px">Join the Elite Leasing Club</a>
    <div class="micro rv">Not ready yet? <a href="ebook.html">Start with the free e-book.</a></div>
  </div>
</section>`;
  write('index.html', page(`${C.brand.name} | Build a Real Rental Business`, body, CSS_HOME));
}

// ---------- CLUB ----------
function buildClub() {
  const cl = C.club;
  const pills = COURSES.map(c => `<span class="pill"><b>C${c.n}</b>${c.title}</span>`).join('');
  const body = `<header class="hero" style="padding:84px 0 72px;text-align:center">
  <div class="wrap">
    <div class="eyebrow rv in">${cl.eyebrow}</div>
    <h1 class="rv in" style="font-size:clamp(36px,4.8vw,58px);max-width:860px;margin:0 auto 24px">${highlight(cl.heroHeadline, cl.heroHighlight)}</h1>
    <p class="rv in" style="font-size:19px;color:var(--espresso-soft);max-width:640px;margin:0 auto 36px">${cl.heroSub}</p>
    <a href="${C.links.clubCheckout}" class="btn btn-gold rv in" style="font-size:17px;padding:16px 38px">Join the Club &middot;&nbsp;${PRICE(C.pricing.clubMonthly)}/month</a>
    <div class="micro rv in" style="font-size:14px;color:var(--haze);margin-top:16px">Cancel anytime. No contracts.</div>
  </div>
</header>
<hr class="horizon">
<section class="section">
  <div class="wrap">
    <div class="section-head rv"><div class="eyebrow">The Value Stack</div><h2>What you get the moment you join</h2></div>
    <div class="stack">
      <div class="stack-item rv"><div class="stack-no">1</div><div><h3>All 9 courses, full access <span>${C.pricing.coursesValue} value</span></h3><p>The complete curriculum, in order, from your first lease to a scaled rental business. 300+ lessons.</p><div class="course-pills">${pills}</div></div></div>
      <div class="stack-item rv"><div class="stack-no">2</div><div><h3>Weekly live strategy sessions</h3><p>Real coaching on what's working right now. Bring your deals, your objections, your stuck points. Leave with answers.</p></div></div>
      <div class="stack-item rv"><div class="stack-no">3</div><div><h3>The private community</h3><p>Agents who close, sharing scripts, wins, and market intel. No spectators.</p></div></div>
      <div class="stack-item rv"><div class="stack-no">4</div><div><h3>The complete deliverables vault <span>$1,500 value</span></h3><p>Done-for-you tools that replace years of trial and error: the 30-Day Action Plan, the Building Bible, the Objection Handling Playbook, the Follow-Up Script Vault, the Content Repurposing Flowchart, the Income Tracker &amp; Commission Forecast, and dozens more.</p></div></div>
      <div class="stack-item rv"><div class="stack-no">5</div><div><h3>The Lease Up, every Saturday</h3><p>Weekly strategies and market insights in your inbox. Stay sharp between sessions.</p></div></div>
    </div>
    <div class="stack-total rv">Total value if bought separately: <span class="strike-val">over ${C.pricing.totalValue}</span>.<br>Yours inside the Club for <strong>${PRICE(C.pricing.clubMonthly)}/month</strong>.</div>
  </div>
</section>
<section class="section who">
  <div class="wrap"><div class="who-grid">
    <div class="who-col rv"><h3>This is for you if</h3><ul><li>You're new and want the full roadmap instead of piecing it together from free videos</li><li>You're licensed but stuck, and tired of guessing what to do next</li><li>You're ready to treat rentals like a real business, not a side hustle</li></ul></div>
    <div class="who-col not rv"><h3>This is not for you if</h3><ul><li>You want a get-rich-quick shortcut</li><li>You won't show up and do the work</li><li>You'd rather collect courses than close leases</li></ul></div>
  </div></div>
</section>
<section class="band">
  <div class="glow"></div>
  <div class="wrap math-inner" style="position:relative">
    <div class="eyebrow rv" style="color:var(--gold-bright)">The Math</div>
    <h2 class="rv math-head">One lease pays for your membership. <em style="font-style:italic;color:var(--gold-bright)">Many times over.</em></h2>
    <div class="math-compare rv">
      <div class="math-fig">
        <div class="math-num">${PRICE(C.pricing.commissionLow)}</div>
        <div class="math-lbl">Typical luxury lease commission</div>
      </div>
      <div class="math-vs">vs</div>
      <div class="math-fig">
        <div class="math-num">${PRICE(C.pricing.clubMonthly)}</div>
        <div class="math-lbl">Per month in the Club</div>
      </div>
    </div>
    <p class="rv math-close">Land just <strong>one extra lease a year</strong> and the membership has already paid for itself. The agents inside are closing far more than that.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head rv"><div class="eyebrow">Compare Your Paths</div><h2>Three ways to do this</h2></div>
    <div class="compare rv"><table>
      <thead><tr><th></th><th>Figure it out alone</th><th>Buy courses one by one</th><th>Elite Leasing Club</th></tr></thead>
      <tbody>
        <tr><td>All 9 courses</td><td><span class="no">&#10005;</span></td><td>${PRICE(C.pricing.coursesValue)}</td><td><span class="yes">&#10003; Included</span></td></tr>
        <tr><td>Weekly live coaching</td><td><span class="no">&#10005;</span></td><td><span class="no">&#10005;</span></td><td><span class="yes">&#10003;</span></td></tr>
        <tr><td>Private community</td><td><span class="no">&#10005;</span></td><td><span class="no">&#10005;</span></td><td><span class="yes">&#10003;</span></td></tr>
        <tr><td>Deliverables vault</td><td><span class="no">&#10005;</span></td><td>Per course only</td><td><span class="yes">&#10003; All 70+</span></td></tr>
        <tr><td>Cost</td><td>Years of lost commissions</td><td>Over ${PRICE(C.pricing.totalValue)}</td><td>${PRICE(C.pricing.clubMonthly)}/mo</td></tr>
      </tbody>
    </table></div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head rv"><div class="eyebrow">Questions</div><h2>Everything you're wondering</h2></div>
    <div class="faq rv">
      <details><summary>Do I need a real estate license first?</summary><p>You'll need a license to close deals, but you don't need one to start. Course 1 walks you through the licensing path step by step, so plenty of members join while their license is in progress and hit the ground running the day it clears.</p></details>
      <details><summary>I'm brand new. Will this work for me?</summary><p>That's exactly who the system was built for. Course 1 starts at zero, and the 30-Day Action Plan gives you your entire first month, day by day. You'll always know what to do next.</p></details>
      <details><summary>I'm not in Chicago. Does this work in my city?</summary><p>Yes. Chicago is where the system was built, but every framework, from the Building Bible to the lead gen playbooks, is designed to replicate in any major metro market. The principles are the same; only the building names change.</p></details>
      <details><summary>How is the Club different from buying courses?</summary><p>Courses teach. The Club coaches. You get every course included, plus weekly live sessions where you can bring your actual deals and roadblocks, plus a community of agents doing the work alongside you.</p></details>
      <details><summary>What if I want to cancel?</summary><p>Cancel anytime, no contracts, no hoops. You keep access through the end of your billing period.</p></details>
    </div>
  </div>
</section>
<section class="final" id="join">
  <div class="glow"></div>
  <div class="wrap">
    <h2 class="rv">${cl.finalHeadline}</h2>
    <p class="rv">Every course. Weekly coaching. A community that closes.</p>
    <a href="${C.links.clubCheckout}" class="btn btn-gold rv" style="font-size:17px;padding:16px 38px">Join the Elite Leasing Club &middot;&nbsp;${PRICE(C.pricing.clubMonthly)}/month</a>
    <div class="micro rv">Not ready yet? <a href="ebook.html">Start with the free e-book.</a></div>
  </div>
</section>`;
  write('club.html', page(`The Elite Leasing Club | ${C.brand.name}`, body, CSS_SHARED));
}

// ---------- COURSES CATALOG ----------
function buildCourses() {
  const ccard = c => `<div class="ccard rv"><div class="ccard-img"><img src="img/c${c.n}-mockup.png" alt="${c.title}" loading="lazy"></div><div class="ccard-body"><div class="ccard-meta"><b>Course ${c.n}</b> &middot; ${c.level} &middot; ${c.lessons} lessons</div><h3>${c.title}</h3><p>${c.promise}</p><div class="ccard-foot">${PRICE(c.price)}<a href="${c.slug}.html">Learn More &rarr;</a></div></div></div>`;
  let tiers = '';
  for (const [label, level, idxs] of TIERS) {
    const cards = idxs.map(i => ccard(COURSES[i])).join('');
    tiers += `<div class="tier"><div class="tier-label rv"><span>${label}</span><h3>${level}</h3></div><div class="course-grid ${idxs.length===2?'two':''}">${cards}</div></div>`;
  }
  const body = `<header class="hero-split" style="padding:84px 0 34px">
  <div class="wrap">
    <div class="eyebrow rv in">The Curriculum</div>
    <style>@media (max-width:600px){.ch-h1 em{display:block}}</style>
    <h1 class="rv in ch-h1" style="font-size:clamp(38px,5vw,58px);margin-bottom:18px">Nine courses. <em style="font-style:italic;color:var(--gold)">One system.</em></h1>
    <p class="rv in" style="font-size:19px;color:var(--espresso-soft);max-width:620px">From your first lease to a scaled rental business, in order, step by step. Start where you are.</p>
  </div>
</header>
<section class="section" style="padding-top:30px">
  <div class="wrap">
    <div class="club-banner rv"><div><strong>Want all nine?</strong><p>Club members get every course, weekly coaching, and the full deliverables vault for ${PRICE(C.pricing.clubMonthly)}/month.</p></div><a href="club.html" class="btn btn-gold">See the Club &rarr;</a></div>
    ${tiers}
  </div>
</section>
<section class="final">
  <div class="glow"></div>
  <div class="wrap">
    <h2 class="rv">Or skip the math. Get everything.</h2>
    <p class="rv">The Club includes all nine courses plus weekly live coaching.</p>
    <a href="club.html" class="btn btn-gold rv" style="font-size:17px;padding:16px 38px">Join the Elite Leasing Club</a>
  </div>
</section>`;
  write('courses.html', page(`Courses | ${C.brand.name}`, body, CSS_SHARED));
}

// ---------- COURSE DETAIL ----------
function buildCourseDetail(c) {
  const dels = c.deliverables.length ? c.deliverables.map(d => `<span class="dpill">${d}</span>`).join('') : '<p class="soon">Deliverables for this course are being finalized and will be included at launch.</p>';
  const mods = c.modules.map(m => `<li>${m}</li>`).join('');
  const whos = c.who.map(w => `<li>${w}</li>`).join('');
  const dcount = c.deliverables.length ? `${c.deliverables.length} done-for-you tools included` : "Toolkit in production";
  const body = `<header class="chero">
  <div class="wrap chero-grid">
    <div class="chero-img rv in"><img src="img/c${c.n}-mockup.png" alt="${c.title} course box"></div>
    <div class="rv in">
      <div class="cmeta"><span class="badge">Course ${c.n}</span><span class="badge">${c.level}</span><span class="badge">${c.lessons} lessons</span></div>
      <h1>${c.title}</h1>
      <p class="promise">${c.promise}</p>
      <div class="cprice"><a href="${C.links.courseCheckout['c'+c.n]}" class="btn btn-gold" style="font-size:16.5px;padding:15px 34px">Enroll Now &middot;&nbsp;${PRICE(c.price)}</a><span class="alt">Or get all 9 courses in <a href="club.html">the Club</a> for ${PRICE(C.pricing.clubMonthly)}/mo</span></div>
    </div>
  </div>
</header>
<hr class="horizon">
<section class="section" style="padding-bottom:50px"><div class="wrap"><div class="section-head rv"><div class="eyebrow">Who This Is For</div><h2>This course is built for you if</h2></div><ul class="bullets rv" style="max-width:700px">${whos}</ul></div></section>
<section class="section" style="padding:50px 0"><div class="wrap"><div class="section-head rv"><div class="eyebrow">The Curriculum</div><h2>What you'll learn</h2><p>${c.modules.length} modules, ${c.lessons} lessons. Slide-based video lessons you can take at your own pace.</p></div><ol class="modlist rv">${mods}</ol></div></section>
<section class="section" style="padding-top:50px"><div class="wrap"><div class="section-head rv"><div class="eyebrow">The Toolkit</div><h2>Your deliverables</h2><p>${dcount}. These aren't worksheets for the sake of worksheets; they're the actual systems used in the field.</p></div><div class="dgrid rv">${dels}</div></div></section>
<section class="final">
  <div class="glow"></div>
  <div class="wrap">
    <h2 class="rv">Take this course. Or take everything.</h2>
    <p class="rv">This course: ${PRICE(c.price)} one-time. Every course plus weekly coaching: ${PRICE(C.pricing.clubMonthly)}/month.</p>
    <div class="final-btns rv"><a href="${C.links.courseCheckout['c'+c.n]}" class="btn btn-gold">Enroll in ${c.title}</a><a href="club.html" class="btn btn-ghost" style="border-color:var(--gold-bright);color:var(--gold-bright)">Join the Club</a></div>
  </div>
</section>`;
  write(`${c.slug}.html`, page(`${c.title} | ${C.brand.name}`, body, CSS_SHARED));
}

// ---------- EBOOK ----------
function buildEbook() {
  const e = C.ebook;
  const body = `<header class="hero-split">
  <div class="wrap hs-grid">
    <div class="rv in">
      <div class="eyebrow">Free E-Book</div>
      <h1>${highlight(e.heroHeadline, e.heroHighlight)}</h1>
      <p class="sub">${e.heroSub}</p>
      <form class="optform" data-optin><input type="email" placeholder="Your best email" required><button class="btn btn-gold" type="submit">${e.formButton}</button></form>
      <div class="form-micro">Delivered instantly. No spam, unsubscribe anytime.</div>
    </div>
    <div class="book-shot rv in"><img src="${C.images.ebookCover}" alt="E-book"></div>
  </div>
</header>
<hr class="horizon">
<section class="section"><div class="wrap"><div class="section-head rv"><div class="eyebrow">Inside The Book</div><h2>What you'll learn</h2></div><ul class="bullets rv" style="max-width:740px"><li>Why luxury rentals can outpace sales commissions, especially in your first 1 to 3 years</li><li>The <strong>Power 25</strong> framework for building a network that sends you deals</li><li>The showing strategy that closes leases in the first 90 seconds</li><li>How to build a personal brand that attracts clients without chasing them</li><li>The system and referral engine behind a scalable rental business</li></ul></div></section>
<section class="band"><div class="glow"></div><div class="wrap" style="position:relative;max-width:760px"><h2 class="rv">99 out of 100 agents enter real estate chasing sales and wondering why nothing is working.</h2><p class="rv">This guide is the playbook for the one who doesn't.</p></div></section>
<section class="section center"><div class="wrap"><div class="section-head rv"><h2>Get your free copy</h2></div><form class="optform rv" data-optin><input type="email" placeholder="Your best email" required><button class="btn btn-gold" type="submit">${e.formButton}</button></form><div class="form-micro rv">Delivered instantly. No spam, unsubscribe anytime.</div></div></section>`;
  write('ebook.html', page(`Free E-Book | ${C.brand.name}`, body, CSS_SHARED));
}


// ---------- PLAYBOOK (paid e-book) ----------
function buildPlaybook() {
  const p = C.playbook;
  const body = `<header class="hero-split">
  <div class="wrap hs-grid">
    <div class="rv in">
      <div class="eyebrow">${p.eyebrow}</div>
      <h1>${highlight(p.heroHeadline, p.heroHighlight)}</h1>
      <p class="sub">${p.heroSub}</p>
      <div class="buy-row"><a href="${C.links.playbookCheckout}" class="btn btn-gold">${p.buyButton}</a><span class="buy-note">Instant access. Yours to keep.</span></div>
    </div>
    <div class="book-shot rv in"><img src="${C.images.playbookCover}" alt="The Luxury Leasing Playbook"></div>
  </div>
</header>
<hr class="horizon">
<section class="section"><div class="wrap"><div class="section-head rv"><div class="eyebrow">Inside The Playbook</div><h2>What's inside</h2></div><ul class="bullets rv" style="max-width:740px"><li>A <strong>day-by-day action plan</strong> for your entire first 30 days, so you always know your next move</li><li>Copy-paste <strong>email templates and phone scripts</strong> that get responses</li><li>The <strong>Power 25</strong> strategy for building a referral network fast</li><li>Real <strong>showing walkthroughs</strong> that turn tours into signed leases</li><li>A printable <strong>progress scorecard</strong> to track your momentum week by week</li></ul></div></section>
<section class="band"><div class="glow"></div><div class="wrap" style="position:relative;max-width:760px"><h2 class="rv">${p.bandLine1}</h2><p class="rv">${p.bandLine2}</p></div></section>
<section class="section center"><div class="wrap"><div class="section-head rv"><div class="eyebrow">Get Started</div><h2>${p.finalHeadline}</h2></div><div class="buy-row buy-row-center rv"><a href="${C.links.playbookCheckout}" class="btn btn-gold" style="font-size:17px;padding:16px 38px">${p.buyButton}</a></div><div class="form-micro rv">Instant access. Yours to keep. No subscription.</div></div></section>`;
  write('playbook.html', page(`The Luxury Leasing Playbook | ${C.brand.name}`, body, CSS_SHARED));
}


// ---------- THE LEASE UP (newsletter, posts to ActiveCampaign) ----------
function buildLeaseUp() {
  const l = C.leaseup;
  const ac = C.links;
  const body = `<header class="hero-split">
  <div class="wrap hs-grid">
    <div class="rv in">
      <div class="eyebrow">${l.eyebrow}</div>
      <h1>${highlight(l.heroHeadline, l.heroHighlight)}</h1>
      <p class="sub">${l.heroSub}</p>
      <form class="optform" method="POST" action="${ac.activeCampaignAction}">
        <input type="hidden" name="u" value="${ac.acUserId}" />
        <input type="hidden" name="f" value="${ac.acFormId}" />
        <input type="hidden" name="s" />
        <input type="hidden" name="c" value="0" />
        <input type="hidden" name="m" value="0" />
        <input type="hidden" name="act" value="sub" />
        <input type="hidden" name="v" value="2" />
        <input type="email" name="email" placeholder="Your best email" required>
        <button class="btn btn-gold" type="submit">${l.formButton}</button>
      </form>
      <div class="form-micro">Every Saturday. No spam, unsubscribe anytime.</div>
    </div>
    <div class="leaseup-art rv in">
      <div class="leaseup-card">
        <div class="leaseup-card-tag">SATURDAYS</div>
        <div class="leaseup-card-title">The Lease Up</div>
        <div class="leaseup-card-line"></div>
        <p class="leaseup-card-sub">One idea. Five minutes. Real leasing strategy from the field.</p>
      </div>
    </div>
  </div>
</header>
<hr class="horizon">
<section class="section"><div class="wrap"><div class="section-head rv"><div class="eyebrow">What You'll Get</div><h2>Every issue, something you can use Monday</h2></div><ul class="bullets rv" style="max-width:740px"><li>The lead gen move that's working <strong>right now</strong>, not last year</li><li>Scripts and templates you can copy straight into your next conversation</li><li>How top agents are positioning their brand to attract clients</li><li>Market shifts and what they mean for your commissions</li></ul></div></section>
<section class="band"><div class="glow"></div><div class="wrap" style="position:relative;max-width:760px"><h2 class="rv">${l.bandLine1}</h2><p class="rv">${l.bandLine2}</p></div></section>
<section class="section center"><div class="wrap"><div class="section-head rv"><div class="eyebrow">Join Free</div><h2>Get The Lease Up this Saturday</h2></div><form class="optform rv" method="POST" action="${ac.activeCampaignAction}"><input type="hidden" name="u" value="${ac.acUserId}" /><input type="hidden" name="f" value="${ac.acFormId}" /><input type="hidden" name="s" /><input type="hidden" name="c" value="0" /><input type="hidden" name="m" value="0" /><input type="hidden" name="act" value="sub" /><input type="hidden" name="v" value="2" /><input type="email" name="email" placeholder="Your best email" required><button class="btn btn-gold" type="submit">${l.formButton}</button></form><div class="form-micro rv">Every Saturday. No spam, unsubscribe anytime.</div></div></section>`;
  write('the-lease-up.html', page(`The Lease Up | ${C.brand.name}`, body, CSS_SHARED));
}

// ---------- THANKS ----------
function buildThanks() {
  const steps = [
    `<strong>Give it a couple of minutes.</strong> Your first email is on its way and usually arrives within five minutes.`,
    `<strong>Don't see it?</strong> Check your spam or junk folder, and if you use Gmail, look under the Promotions tab.`,
    `<strong>Never miss the next one.</strong> Drag the email into your main inbox and add ${C.brand.contactEmail} to your contacts.`
  ];
  const secondary = `<section class="final"><div class="glow"></div><div class="wrap"><h2 class="rv">While you're here</h2><p class="rv">See the full system top agents use to build a real rental business.</p><a href="https://luxuryleasingacademy.com/club" class="btn btn-gold rv">Explore the Elite Leasing Club</a></div></section>`;
  const body = tyShell({
    eyebrow: "You're In",
    h1: "You're on the list. Now check your inbox.",
    intro: "Thanks for signing up. Your first email from Luxury Leasing Academy is on its way right now.",
    inboxTitle: "One quick step so it reaches you",
    steps,
    note: `Grabbed the free e-book? Your download link is inside that first email. Joined The Lease Up? Your first issue lands this Saturday. Questions anytime: <a href="mailto:${C.brand.contactEmail}">${C.brand.contactEmail}</a>.`,
    secondary
  });
  write('thanks.html', page(`You're In | ${C.brand.name}`, body, CSS_SHARED + THANKS_CSS));
}

// ---------- PURCHASE THANK YOU PAGES ----------
function buildPurchaseThanks() {
  write('thank-you-course.html', page(`Welcome to Your Course | ${C.brand.name}`, tyShell({
    eyebrow: "Purchase Confirmed",
    h1: "You're in. Your course is ready.",
    intro: "Thank you for enrolling. Your receipt and access details are on their way to your inbox.",
    inboxTitle: "How to get started",
    steps: [
      `<strong>Check your email for your receipt and login details.</strong> It usually arrives within a few minutes.`,
      `<strong>Log in to start your course.</strong> Use the Student Login with the same email you purchased with.`,
      `<strong>Can't find the email?</strong> Check spam, junk, and Gmail's Promotions tab, then add ${C.brand.contactEmail} to your contacts.`
    ],
    cta: { href: C.brand.portalUrl, label: "Go to Student Login" },
    note: `Still nothing after ten minutes? Email <a href="mailto:${C.brand.contactEmail}">${C.brand.contactEmail}</a> and we'll get you in right away.`
  }), CSS_SHARED + THANKS_CSS));

  write('thank-you-club.html', page(`Welcome to the Elite Leasing Club | ${C.brand.name}`, tyShell({
    eyebrow: "Welcome to the Club",
    h1: "Welcome to the Elite Leasing Club.",
    intro: "Your membership is active. Your receipt and access details are heading to your inbox now.",
    inboxTitle: "How to get started",
    steps: [
      `<strong>Check your email for your receipt and login details.</strong> Give it a few minutes to arrive.`,
      `<strong>Log in to unlock everything.</strong> All nine courses, weekly coaching, and the community are waiting behind the Student Login.`,
      `<strong>Don't see the email?</strong> Check spam, junk, and Gmail's Promotions tab, then add ${C.brand.contactEmail} to your contacts.`
    ],
    cta: { href: C.brand.portalUrl, label: "Enter the Club" },
    note: `Need a hand getting in? Email <a href="mailto:${C.brand.contactEmail}">${C.brand.contactEmail}</a> anytime.`
  }), CSS_SHARED + THANKS_CSS));

  write('thank-you-playbook.html', page(`Your Playbook Is On The Way | ${C.brand.name}`, tyShell({
    eyebrow: "Purchase Confirmed",
    h1: "Got it. Your Playbook is on its way.",
    intro: "Thank you for your purchase. Your receipt and download are heading to your inbox right now.",
    inboxTitle: "How to get your download",
    steps: [
      `<strong>Check your email for your receipt and download link.</strong> It usually lands within a few minutes.`,
      `<strong>Don't see it?</strong> Check your spam or junk folder, and your Gmail Promotions tab.`,
      `<strong>Keep it handy.</strong> Add ${C.brand.contactEmail} to your contacts so your receipt and any updates always reach you.`
    ],
    cta: { href: "https://luxuryleasingacademy.com/club", label: "See the full system in the Club" },
    note: `Trouble with your download? Email <a href="mailto:${C.brand.contactEmail}">${C.brand.contactEmail}</a> and we'll send it straight over.`
  }), CSS_SHARED + THANKS_CSS));
}

// ---------- MEET MATTY ----------
function buildMatty() {
  const m = C.matty;
  const mattySocial = socialIconLinks(m.social);
  const follow = mattySocial ? `<section class="matty-follow"><div class="wrap">
  <div class="eyebrow">Follow Along</div>
  <h2>Follow my journey</h2>
  <p>Most of what I share day to day lives on my personal pages. Come say hi.</p>
  <div class="matty-social">${mattySocial}</div>
</div></section>` : '';
  const MATTY_CSS = `
.matty-follow{text-align:center;padding:4px 0 80px}
.matty-follow .eyebrow{margin-bottom:12px}
.matty-follow h2{font-size:clamp(24px,3.2vw,34px);margin-bottom:10px;color:var(--espresso)}
.matty-follow p{color:var(--espresso-soft);font-size:16.5px;max-width:460px;margin:0 auto 26px;line-height:1.55}
.matty-social{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}
.matty-social a{width:50px;height:50px;border-radius:50%;border:1px solid rgba(185,137,47,.3);display:flex;align-items:center;justify-content:center;color:var(--espresso-soft);transition:color .2s,border-color .2s,transform .2s}
.matty-social a:hover{color:var(--gold);border-color:var(--gold);transform:translateY(-3px)}
.matty-social svg{width:21px;height:21px;fill:currentColor}
`;
  const body = `<header class="mhero">
  <div class="wrap mhero-grid">
    <div class="rv in"><div class="eyebrow">Meet Matty</div><h1>${m.heroHeadline}</h1><p class="sub">${m.heroSub}</p></div>
    <div class="rv in"><div class="matty-photo"><img src="${C.images.mattyPhoto}" alt="Matty"></div></div>
  </div>
</header>
<hr class="horizon">
<section class="section"><div class="wrap story">
  <p class="lede rv">I didn't come from real estate. I came from behind a bar, and before that, from rock bottom.</p>
  <p class="rv">No trust fund. No team. No listings handed to me. What I had was hustle, and a belief most people thought was naive: that leasing could be more than a stepping stone. That it could be a real business.</p>
  <p class="rv">I spent five years as an independent broker learning every hard lesson this industry has, then five more onsite at Chicago's top luxury residential building. Along the way I closed <strong>more than 1,000 leases</strong> and moved <strong>over $2.5 million in rental volume</strong>, not by selling homes, but by treating rentals like the business they really are.</p>
  <p class="rv">Somewhere in those thousand leases I realized something: it was never talent. It was a <strong>system</strong>. Repeatable, teachable, and nobody was teaching it. Agents were quitting in their first year while a lucrative market sat right in front of them, overlooked.</p>
  <p class="rv">So I built ${C.brand.name}: the roadmap I wish someone had handed me. Every course, every script, every tracker inside comes from the field, not from theory that sounds nice on a slide.</p>
</div></section>
${follow}
<section class="band"><div class="glow"></div><div class="wrap" style="position:relative"><div class="stats stats-centered">
  <div class="stat rv"><div class="num">${C.home.stat1Num}</div><div class="lbl" style="color:#A4937D">${C.home.stat1Label}</div></div>
  <div class="stat rv"><div class="num">${C.home.stat2Num}</div><div class="lbl" style="color:#A4937D">${C.home.stat2Label}</div></div>
  <div class="stat rv"><div class="num">${C.home.stat3Num}</div><div class="lbl" style="color:#A4937D">${C.home.stat3Label}</div></div>
</div></div></section>
<section class="section"><div class="wrap"><div class="section-head rv"><div class="eyebrow">What We Stand For</div><h2>Driven by discipline. Powered by purpose.</h2></div><div class="cards3">
  <div class="card rv"><div class="tick">1</div><h3 style="font-size:22px;margin-bottom:12px">Excellence over ego</h3><p style="color:var(--espresso-soft);font-size:16px">We lead with value, not vanity.</p></div>
  <div class="card rv"><div class="tick">2</div><h3 style="font-size:22px;margin-bottom:12px">Real skills = real money</h3><p style="color:var(--espresso-soft);font-size:16px">Everything we teach works in the real world.</p></div>
  <div class="card rv"><div class="tick">3</div><h3 style="font-size:22px;margin-bottom:12px">Ownership mindset</h3><p style="color:var(--espresso-soft);font-size:16px">We train agents to think like entrepreneurs, not employees.</p></div>
</div></div></section>
<section class="final"><div class="glow"></div><div class="wrap"><h2 class="rv">${m.finalHeadline}</h2><p class="rv">${C.brand.hashtag}</p><div class="final-btns rv"><a href="club.html" class="btn btn-gold">Join the Elite Leasing Club</a><a href="ebook.html" class="btn btn-ghost" style="border-color:var(--gold-bright);color:var(--gold-bright)">Start with the Free E-Book</a></div></div></section>`;
  write('meet-matty.html', page(`Meet Matty | ${C.brand.name}`, body, CSS_SHARED + MATTY_CSS));
}

// ---------- LEGAL (Terms + Privacy) ----------
function buildLegal() {
  const LEGAL_CSS = `
.legal-hero{padding:74px 0 26px}
.legal-hero h1{font-size:clamp(34px,4.6vw,54px);margin:6px 0 14px}
.legal-meta{color:var(--haze);font-weight:600;font-size:14.5px;letter-spacing:.02em}
.legal-body{max-width:820px}
.legal-body h2{font-size:25px;margin:42px 0 14px;color:var(--espresso)}
.legal-body h3{font-size:18.5px;margin:28px 0 10px;color:var(--espresso)}
.legal-body p{color:var(--espresso-soft);font-size:16.5px;line-height:1.75;margin-bottom:14px}
.legal-body ul{padding-left:22px;margin:0 0 16px}
.legal-body li{color:var(--espresso-soft);font-size:16.5px;line-height:1.7;margin-bottom:7px}
.legal-body a{color:var(--gold);font-weight:600}
.legal-body a:hover{text-decoration:underline}
.legal-body strong{color:var(--espresso)}
.legal-disclaimer{margin-top:36px;padding:20px 24px;background:var(--cream);border:1px solid rgba(185,137,47,.18);border-radius:14px;font-size:14.5px;color:var(--haze);line-height:1.6}
`;

  const shell = (h1, meta, inner) => `<header class="hero legal-hero"><div class="wrap"><div class="eyebrow">Legal</div><h1>${h1}</h1><p class="legal-meta">${meta}</p></div></header>
<hr class="horizon">
<section class="section" style="padding-top:42px"><div class="wrap legal-body">${inner}</div></section>`;

  // ---- Terms of Service ----
  const termsInner = `<h2>1. Agreement to Terms</h2>
<p>By accessing or using the Luxury Leasing Academy website (luxuryleasingacademy.com), purchasing any products, enrolling in courses, or subscribing to any membership, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our site or services.</p>
<h2>2. Services Offered</h2>
<p>Luxury Leasing Academy LLC provides online educational courses, digital products (including e-books), membership programs, live webinars, community access, and related tools and resources for real estate professionals. All services are delivered digitally through our website.</p>
<h2>3. Account Registration</h2>
<p>To access courses, memberships, or certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to provide accurate and current information during registration.</p>
<h2>4. Purchases and Payments</h2>
<p>All purchases are processed securely through Stripe. Prices for courses, e-books, and memberships are listed on the website and are subject to change at any time. By completing a purchase, you authorize Luxury Leasing Academy LLC to charge the payment method provided.</p>
<h2>5. Memberships and Subscriptions</h2>
<p>The Elite Leasing Club is a recurring monthly subscription. By subscribing, you authorize automatic monthly charges to your payment method until you cancel. You may cancel your membership at any time. Upon cancellation, you will retain access through the end of your current billing period. No prorated refunds will be issued for partial months.</p>
<h2>6. Refund Policy</h2>
<p>All sales of digital courses, e-books, and membership subscriptions are considered final. Due to the nature of digital products and immediate access to course content upon purchase, refunds are generally not offered. If you believe there are exceptional circumstances, you may contact us at the email address listed below and your request will be reviewed on a case-by-case basis at the sole discretion of Luxury Leasing Academy LLC.</p>
<h2>7. Intellectual Property</h2>
<p>All content provided through Luxury Leasing Academy, including but not limited to course materials, videos, e-books, templates, tools, graphics, and written content, is the property of Luxury Leasing Academy LLC and is protected by copyright law. You may not reproduce, distribute, modify, resell, or share any content without prior written permission. Your purchase grants you a personal, non-transferable license to access and use the materials for your own professional development.</p>
<h2>8. User Conduct</h2>
<p>You agree not to:</p>
<ul>
<li>Share your account credentials with others</li>
<li>Distribute or resell any course content or materials</li>
<li>Use the platform for any unlawful purpose</li>
<li>Disrupt or interfere with the operation of the website</li>
<li>Post harmful, abusive, or inappropriate content in any community spaces</li>
</ul>
<p>Violation of these terms may result in immediate termination of your account and access without refund.</p>
<h2>9. Community Guidelines</h2>
<p>Participation in any Luxury Leasing Academy community (including private groups, forums, and live sessions) is a privilege. You agree to engage respectfully with other members and staff. Luxury Leasing Academy LLC reserves the right to remove any member from community spaces whose behavior is disruptive, harmful, or inconsistent with the professional environment we maintain.</p>
<h2>10. Disclaimer</h2>
<p>The content provided by Luxury Leasing Academy is for educational and informational purposes only. Results will vary based on individual effort, market conditions, and other factors. Luxury Leasing Academy LLC does not guarantee any specific income, results, or outcomes from the use of our materials or participation in our programs. Any earnings or results referenced are not typical and should not be interpreted as a promise of similar performance.</p>
<h2>11. Limitation of Liability</h2>
<p>To the fullest extent permitted by law, Luxury Leasing Academy LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our website, courses, products, or services. Our total liability for any claim related to our services shall not exceed the amount you paid for the specific product or service in question.</p>
<h2>12. Third-Party Links and Services</h2>
<p>Our website may contain links to third-party websites or services. Luxury Leasing Academy LLC is not responsible for the content, privacy practices, or availability of any third-party sites. Use of external services is at your own risk.</p>
<h2>13. Modifications to Terms</h2>
<p>Luxury Leasing Academy LLC reserves the right to update or modify these Terms of Service at any time. When material changes are made, we will update the effective date at the top of this page. Continued use of our website and services after changes are posted constitutes acceptance of the revised terms.</p>
<h2>14. Governing Law</h2>
<p>These Terms of Service shall be governed by and construed in accordance with the laws of the State of Illinois, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the courts of Cook County, Illinois.</p>
<h2>15. Contact Us</h2>
<p>If you have questions about these Terms of Service, please contact us at:</p>
<p><strong>Luxury Leasing Academy LLC</strong><br>Email: <a href="mailto:matty@luxuryleasingacademy.com">matty@luxuryleasingacademy.com</a><br>Website: luxuryleasingacademy.com</p>`;
  write('terms.html', page(`Terms of Service | ${C.brand.name}`, shell('Terms of Service', 'Luxury Leasing Academy LLC &middot; Effective February 16, 2026', termsInner), CSS_SHARED + LEGAL_CSS));

  // ---- Privacy Policy ----
  const privacyInner = `<p>Luxury Leasing Academy LLC ("we," "our," or "us") operates the website luxuryleasingacademy.com (the "Site"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site, purchase our products, subscribe to our newsletter, enroll in our courses, or interact with us in any way.</p>
<p>By accessing or using our Site, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our Site immediately.</p>
<h2>1. Information We Collect</h2>
<h3>1.1 Personal Information You Provide</h3>
<p>We may collect personally identifiable information that you voluntarily provide when you:</p>
<ul>
<li>Create an account or enroll in a course</li>
<li>Subscribe to The Lease Up newsletter</li>
<li>Purchase a product or membership (e.g., The Luxury Leasing Playbook, Elite Leasing Club)</li>
<li>Fill out a contact form or survey</li>
<li>Participate in a webinar or live event</li>
<li>Communicate with us via email or social media</li>
</ul>
<p>This information may include:</p>
<ul>
<li>Full name</li>
<li>Email address</li>
<li>Phone number</li>
<li>Billing address</li>
<li>Payment information (processed securely through Stripe; we do not store credit card numbers)</li>
<li>Professional information (e.g., brokerage, license number, market area)</li>
</ul>
<h3>1.2 Information Collected Automatically</h3>
<p>When you visit our Site, we may automatically collect certain information, including:</p>
<ul>
<li>IP address</li>
<li>Browser type and version</li>
<li>Operating system</li>
<li>Pages viewed, links clicked, and time spent on our Site</li>
<li>Referring URL</li>
<li>Device identifiers</li>
</ul>
<h3>1.3 Cookies and Tracking Technologies</h3>
<p>We use cookies, pixel tags, and similar tracking technologies to enhance your experience, analyze Site traffic, and serve targeted advertisements. These may include:</p>
<ul>
<li>Essential cookies required for Site functionality</li>
<li>Analytics cookies (e.g., Google Analytics) to understand usage patterns</li>
<li>Advertising cookies (e.g., Facebook Pixel) to deliver relevant ads and measure campaign effectiveness</li>
</ul>
<p>You can manage cookie preferences through your browser settings. Disabling certain cookies may affect Site functionality.</p>
<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
<li>Process transactions and deliver purchased products, courses, and memberships</li>
<li>Send you The Lease Up newsletter and other marketing communications</li>
<li>Manage your account and provide customer support</li>
<li>Personalize your experience on our Site</li>
<li>Analyze Site usage to improve our content, products, and services</li>
<li>Run targeted advertising campaigns on platforms such as Facebook and Instagram</li>
<li>Send administrative communications (e.g., order confirmations, policy updates)</li>
<li>Comply with legal obligations and protect our rights</li>
</ul>
<h2>3. How We Share Your Information</h2>
<p>We do not sell your personal information. We may share your data with the following categories of third parties:</p>
<h3>3.1 Service Providers</h3>
<p>We work with trusted third-party providers who assist in operating our business, including:</p>
<ul>
<li>Stripe: payment processing</li>
<li>ActiveCampaign: email marketing and automation</li>
<li>Zapier: workflow automation</li>
<li>LifterLMS / WordPress: course delivery and website hosting</li>
<li>Google Analytics: website analytics</li>
<li>Meta (Facebook/Instagram): advertising and retargeting</li>
</ul>
<p>These providers only access your data as necessary to perform their services and are contractually obligated to protect it.</p>
<h3>3.2 Legal Requirements</h3>
<p>We may disclose your information if required by law, regulation, legal process, or governmental request, or to protect our rights, property, or safety.</p>
<h3>3.3 Business Transfers</h3>
<p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.</p>
<h2>4. Data Security</h2>
<p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
<h2>5. Data Retention</h2>
<p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we will securely delete or anonymize it.</p>
<h2>6. Your Rights and Choices</h2>
<h3>6.1 Email Communications</h3>
<p>You may opt out of marketing emails at any time by clicking the "unsubscribe" link at the bottom of any email. Please note that you may still receive transactional emails related to your account or purchases.</p>
<h3>6.2 Cookies</h3>
<p>You can control cookies through your browser settings. Most browsers allow you to refuse or delete cookies.</p>
<h3>6.3 Access and Deletion</h3>
<p>You may request access to, correction of, or deletion of your personal information by contacting us at the email address listed below. We will respond to your request within a reasonable timeframe and in accordance with applicable law.</p>
<h3>6.4 California Residents (CCPA)</h3>
<p>If you are a California resident, you have the right to:</p>
<ul>
<li>Know what personal information we collect and how it is used</li>
<li>Request deletion of your personal information</li>
<li>Opt out of the sale of personal information (we do not sell personal data)</li>
<li>Not be discriminated against for exercising your privacy rights</li>
</ul>
<p>To exercise these rights, contact us using the information provided below.</p>
<h3>6.5 Illinois Residents</h3>
<p>If you are an Illinois resident, you may have additional rights under state privacy laws. We are committed to complying with all applicable state and federal regulations. Contact us for more information about your specific rights.</p>
<h2>7. Third-Party Links</h2>
<p>Our Site may contain links to third-party websites, services, or platforms. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>
<h2>8. Children's Privacy</h2>
<p>Our Site and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete such information promptly.</p>
<h2>9. Changes to This Privacy Policy</h2>
<p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will update the "Effective Date" at the top of this page and, where appropriate, notify you via email or a prominent notice on our Site.</p>
<h2>10. Contact Us</h2>
<p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
<p><strong>Luxury Leasing Academy LLC</strong><br>Email: <a href="mailto:matty@luxuryleasingacademy.com">matty@luxuryleasingacademy.com</a><br>Website: luxuryleasingacademy.com</p>`;
  write('privacy.html', page(`Privacy Policy | ${C.brand.name}`, shell('Privacy Policy', 'Luxury Leasing Academy LLC &middot; Effective February 13, 2026', privacyInner), CSS_SHARED + LEGAL_CSS));
}

// ---------- HUB (link-in-bio) ----------
function buildHub() {
  const hub = C.hub;
  const socialItems = socialIconLinks(hub.social);
  const socialHtml = socialItems ? `<div class="hub-social">${socialItems}</div>` : '';

  const HUB_CSS = `
body{background:var(--ivory)}
.hub{max-width:480px;margin:0 auto;padding:40px 22px 54px;text-align:center}
.hub-crest{height:92px;width:auto;margin:0 auto 16px}
.hub-brand{font-family:'Fraunces',serif;font-weight:600;font-size:25px;color:var(--espresso);letter-spacing:.01em}
.hub-hero{background:var(--white);border:1px solid rgba(185,137,47,.22);border-top:3px solid var(--gold);border-radius:20px;padding:22px 22px 20px;margin:28px 0 32px;box-shadow:0 22px 50px rgba(42,32,24,.11);text-align:left}
.hub-hero-row{display:flex;gap:16px;align-items:center;margin-bottom:14px}
.hub-hero-cover{width:82px;height:auto;border-radius:8px;box-shadow:0 8px 20px rgba(42,32,24,.2);flex:0 0 auto}
.hub-tag{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:7px}
.hub-hero-title{font-family:'Fraunces',serif;font-size:20px;line-height:1.18;color:var(--espresso)}
.hub-hero-sub{font-size:14px;color:var(--espresso-soft);margin:0 0 16px;line-height:1.5}
.hub-form{display:flex;flex-direction:column;gap:10px}
.hub-form input{width:100%;padding:13px 18px;border-radius:999px;border:1px solid rgba(185,137,47,.35);background:var(--ivory);color:var(--espresso);font-family:inherit;font-size:15px;outline:none;transition:border-color .2s}
.hub-form input::placeholder{color:var(--haze)}
.hub-form input:focus{border-color:var(--gold)}
.hub-form .btn{width:100%;text-align:center;padding:14px;font-size:15.5px}
.hub-micro{font-size:12.5px;color:var(--haze);margin-top:11px;text-align:center}
.hub-grouplabel{font-size:11.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--haze);text-align:left;margin:0 4px 12px}
.hub-stack{display:flex;flex-direction:column;gap:12px;margin-bottom:28px}
.hub-link{display:flex;align-items:center;justify-content:space-between;gap:14px;background:var(--white);border:1px solid rgba(185,137,47,.20);border-radius:15px;padding:16px 18px;text-align:left;transition:transform .2s,box-shadow .2s,border-color .2s}
.hub-link:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(42,32,24,.12);border-color:rgba(185,137,47,.42)}
.hub-link-main{display:flex;flex-direction:column;gap:3px;min-width:0}
.hub-link-title{font-weight:700;font-size:16px;color:var(--espresso)}
.hub-link-note{font-size:13px;color:var(--haze);line-height:1.35}
.hub-arrow{color:var(--gold);font-size:18px;font-weight:700;flex:0 0 auto}
.hub-price{font-family:'Fraunces',serif;font-weight:600;color:var(--gold);font-size:18px;flex:0 0 auto}
.hub-pill{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--amber);border:1px solid rgba(201,111,35,.4);border-radius:999px;padding:4px 10px;flex:0 0 auto}
.hub-link.feat{background:linear-gradient(180deg,rgba(212,169,78,.13),var(--white));border-color:rgba(185,137,47,.5)}
.hub-link.feat .hub-link-title{font-size:16.5px}
.hub-social{display:flex;justify-content:center;gap:13px;margin:4px 0 30px}
.hub-social a{width:42px;height:42px;border-radius:50%;border:1px solid rgba(185,137,47,.28);display:flex;align-items:center;justify-content:center;color:var(--espresso-soft);transition:color .2s,border-color .2s,transform .2s}
.hub-social a:hover{color:var(--gold);border-color:var(--gold);transform:translateY(-2px)}
.hub-social svg{width:19px;height:19px;fill:currentColor}
.hub-foot{border-top:1px solid rgba(185,137,47,.18);padding-top:22px}
.hub-hash{font-family:'Fraunces',serif;font-style:italic;color:var(--gold);font-weight:600;font-size:15px;margin-bottom:10px}
.hub-foot-links{font-size:13px;color:var(--haze);display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap}
.hub-foot-links a{color:var(--espresso-soft);transition:color .2s}
.hub-foot-links a:hover{color:var(--gold)}
.hub-copy{font-size:12px;color:var(--haze);margin-top:12px}
@media(max-width:380px){.hub-hero-cover{width:68px}.hub-hero-title{font-size:18px}.hub-brand{font-size:23px}}
`;

  const HUB_JS = `<script>
document.querySelectorAll('form[data-optin]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var em=f.querySelector('input[type=email]');var body=new URLSearchParams({u:'5',f:'3',s:'',c:'0',m:'0',act:'sub',v:'2',email:em?em.value:''});fetch('https://luxuryleasingacademy.activehosted.com/proc.php',{method:'POST',mode:'no-cors',body:body}).finally(function(){window.location.href='thanks.html';});});});
</script>`;

  const body = `<main class="hub">
  <div class="hub-top">
    <a href="index.html"><img class="hub-crest" src="${C.images.crest}" alt="${C.brand.name}"></a>
    <div class="hub-brand">${C.brand.name}</div>
  </div>

  <div class="hub-hero">
    <div class="hub-hero-row">
      <img class="hub-hero-cover" src="${C.images.ebookCover}" alt="Free e-book">
      <div>
        <div class="hub-tag">${hub.ebookTag}</div>
        <div class="hub-hero-title">${hub.ebookTitle}</div>
      </div>
    </div>
    <p class="hub-hero-sub">${hub.ebookSub}</p>
    <form class="hub-form" data-optin>
      <input type="email" placeholder="Your best email" required>
      <button class="btn btn-gold" type="submit">${C.ebook.formButton}</button>
    </form>
    <div class="hub-micro">Delivered instantly. No spam, unsubscribe anytime.</div>
  </div>

  <div class="hub-grouplabel">${hub.group1Label}</div>
  <div class="hub-stack">
    <a class="hub-link feat" href="club.html">
      <span class="hub-link-main"><span class="hub-link-title">The Elite Leasing Club</span><span class="hub-link-note">All 9 courses, weekly coaching, the community</span></span>
      <span class="hub-arrow">&rarr;</span>
    </a>
    <a class="hub-link" href="playbook.html">
      <span class="hub-link-main"><span class="hub-link-title">The Luxury Leasing Playbook</span><span class="hub-link-note">Your first 30 days, mapped day by day</span></span>
      <span class="hub-price">${C.pricing.playbook}</span>
    </a>
    <a class="hub-link" href="courses.html">
      <span class="hub-link-main"><span class="hub-link-title">Browse the 9 Courses</span><span class="hub-link-note">From your first lease to a scaled business</span></span>
      <span class="hub-arrow">&rarr;</span>
    </a>
  </div>

  <div class="hub-grouplabel">${hub.group2Label}</div>
  <div class="hub-stack">
    <a class="hub-link" href="the-lease-up.html">
      <span class="hub-link-main"><span class="hub-link-title">The Lease Up</span><span class="hub-link-note">Weekly leasing strategy, every Saturday</span></span>
      <span class="hub-pill">Free</span>
    </a>
    <a class="hub-link" href="meet-matty.html">
      <span class="hub-link-main"><span class="hub-link-title">Meet Matty</span><span class="hub-link-note">The story behind the Academy</span></span>
      <span class="hub-arrow">&rarr;</span>
    </a>
  </div>

  ${socialHtml}

  <div class="hub-foot">
    <div class="hub-hash">${C.brand.hashtag}</div>
    <div class="hub-foot-links"><a href="index.html">Full site</a><span>&middot;</span><a href="${C.links.termsUrl}">Terms</a><span>&middot;</span><a href="${C.links.privacyUrl}">Privacy</a><span>&middot;</span><a href="mailto:${C.brand.contactEmail}">Contact</a></div>
    <div class="hub-copy">&copy; 2026 ${C.brand.name}, LLC</div>
  </div>
</main>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>Start Here | ${C.brand.name}</title>
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="shortcut icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
${FONTS}
<style>${CSS_SHARED}${HUB_CSS}</style>
${TRACKING}
</head>
<body>
${body}
${HUB_JS}
${COOKIE}
</body>
</html>`;
  write('hub.html', html);
}

// ---------- RUN ----------
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, f), path.join(dest, f));
  }
}

console.log('Building Luxury Leasing Academy site...');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(ROOT, 'img'), path.join(OUT, 'img'));
buildHome();
buildClub();
buildCourses();
COURSES.forEach(buildCourseDetail);
buildEbook();
buildPlaybook();
buildLeaseUp();
buildThanks();
buildPurchaseThanks();
buildMatty();
buildHub();
buildLegal();
console.log('Done. Site is in /public');
