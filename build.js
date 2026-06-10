// ============================================================
//  build.js  -  Run with: node build.js
//  Generates the complete site into /public from content.json
//  EDIT content.json, NOT this file.
// ============================================================
const { fs, path, ROOT, OUT, C, CSS_SHARED, CSS_HOME, COURSES, TIERS } = require('./build-data.js');

const PRICE = s => `<span class="price-ph">${s}</span>`;
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">`;

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
      <div><h4>Learn</h4><a href="courses.html">${C.nav.courses}</a><a href="club.html">${C.nav.club}</a><a href="ebook.html">${C.nav.ebook}</a><a href="thanks.html">The Playbook</a></div>
      <div><h4>About</h4><a href="meet-matty.html">${C.nav.matty}</a><a href="ebook.html">The Lease Up</a><a href="mailto:${C.brand.contactEmail}">Contact</a></div>
      <div><h4>Students</h4><a href="${C.brand.portalUrl}">${C.nav.login}</a><a href="#">Terms</a><a href="#">Privacy</a></div>
    </div>
    <div class="foot-bottom"><div>&copy; 2026 ${C.brand.name}, LLC</div><div>${C.brand.city}</div></div>
  </div>
</footer>`;

const JS = `<script>
const burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
if(burger){burger.addEventListener('click',()=>{const o=mm.classList.toggle('open');burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)});
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');burger.classList.remove('open')}));}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
document.querySelectorAll('form[data-optin],.optin form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();window.location.href='thanks.html'}));
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,end=parseFloat(el.dataset.count||0);}),{threshold:.6});
</script>`;

function page(title, body, css) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${title}</title>
${FONTS}
<style>${css || CSS_SHARED}</style>
</head>
<body>
${nav()}
${body}
${FOOTER}
${JS}
</body>
</html>`;
}

function esc(s){return s;}
function highlight(text, phrase, cls='em-gold'){
  if(!phrase || !text.includes(phrase)) return text;
  return text.replace(phrase, `<em style="font-style:italic;color:var(--gold)">${phrase}</em>`);
}

const write = (name, html) => { fs.writeFileSync(path.join(OUT, name), html); console.log('  built', name); };

// ---------- HOME ----------
function buildHome() {
  const h = C.home;
  const testis = C.testimonials.map(t => `<div class="card rv"><div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p>"${t.quote}"</p><div class="who-sig" style="margin-top:20px;font-weight:700;font-size:14.5px">${t.name} <span style="display:block;font-weight:500;color:var(--haze);font-size:13px;margin-top:2px">${t.location}</span></div></div>`).join('');
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
      <div class="stats">
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
    <div class="section-head rv"><div class="eyebrow">The Path</div><h2>Your path to $100K+ with luxury rentals</h2></div>
    <div class="cards3">
      <div class="card rv step-card"><div class="step-card-img"><img src="${C.images.ebookCover}" alt="E-book" style="max-height:100%"></div><div class="step-card-body"><div class="step-no-label">STEP 01</div><h3 style="font-size:23px;margin-bottom:10px">Start free</h3><p style="color:var(--espresso-soft);font-size:15.5px;margin-bottom:18px">Download the e-book and learn the 9 secrets top earners use to build six-figure rental businesses.</p><a href="ebook.html" style="color:var(--gold);font-weight:600;font-size:15px">Get the Free E-Book &rarr;</a></div></div>
      <div class="card rv step-card"><div class="step-card-img"><img src="img/c1-mockup.png" alt="Courses" style="max-height:100%"></div><div class="step-card-body"><div class="step-no-label">STEP 02</div><h3 style="font-size:23px;margin-bottom:10px">Learn the system</h3><p style="color:var(--espresso-soft);font-size:15.5px;margin-bottom:18px">Nine courses covering everything from your first lease to scaling a rental empire. In order, step by step.</p><a href="courses.html" style="color:var(--gold);font-weight:600;font-size:15px">Browse the Courses &rarr;</a></div></div>
      <div class="card rv step-card"><div class="step-card-img"><img src="https://i0.wp.com/luxuryleasingacademy.com/wp-content/uploads/brizy/imgs/Club-Website-Image-270x270x0x0x270x270x1752690028.png?w=1400&ssl=1" alt="Club" style="max-height:100%"></div><div class="step-card-body"><div class="step-no-label">STEP 03</div><h3 style="font-size:23px;margin-bottom:10px">Go all in</h3><p style="color:var(--espresso-soft);font-size:15.5px;margin-bottom:18px">The Elite Leasing Club: every course, weekly live coaching, and a community of agents actually closing deals.</p><a href="club.html" style="color:var(--gold);font-weight:600;font-size:15px">Join the Club &rarr;</a></div></div>
    </div>
  </div>
</section>
<hr class="horizon">
<section class="section" style="background:var(--cream)">
  <div class="wrap">
    <div class="section-head rv"><div class="eyebrow">Beta Students</div><h2>Agents who stopped guessing</h2></div>
    <div class="cards3">${testis}</div>
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
  write('index.html', page(`${C.brand.name} | Build a Six-Figure Rental Business`, body, CSS_HOME));
}

// ---------- CLUB ----------
function buildClub() {
  const cl = C.club;
  const pills = COURSES.map(c => `<span class="pill"><b>C${c.n}</b>${c.title}</span>`).join('');
  const testis = C.testimonials.map(t => `<div class="card rv"><div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p>"${t.quote}"</p><div class="who-sig">${t.name} <span>${t.location}</span></div></div>`).join('');
  const body = `<header class="hero" style="padding:84px 0 72px;text-align:center">
  <div class="wrap">
    <div class="eyebrow rv in">${cl.eyebrow}</div>
    <h1 class="rv in" style="font-size:clamp(36px,4.8vw,58px);max-width:860px;margin:0 auto 24px">${highlight(cl.heroHeadline, cl.heroHighlight)}</h1>
    <p class="rv in" style="font-size:19px;color:var(--espresso-soft);max-width:640px;margin:0 auto 36px">${cl.heroSub}</p>
    <a href="#join" class="btn btn-gold rv in" style="font-size:17px;padding:16px 38px">Join the Club &middot;&nbsp;${PRICE(C.pricing.clubMonthly)}/month</a>
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
<hr class="horizon">
<section class="section" style="background:var(--cream)">
  <div class="wrap">
    <div class="section-head rv"><div class="eyebrow">Member Results</div><h2>Agents who stopped guessing</h2></div>
    <div class="cards3">${testis}</div>
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
    <h1 class="rv in" style="font-size:clamp(38px,5vw,58px);margin-bottom:18px">Nine courses. <em style="font-style:italic;color:var(--gold)">One system.</em></h1>
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
    <a href="${C.links.courseCheckout['c'+c.n]}" class="btn btn-gold rv" style="margin-right:12px">Enroll in ${c.title}</a>
    <a href="club.html" class="btn btn-ghost rv" style="border-color:var(--gold-bright);color:var(--gold-bright)">Join the Club</a>
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

// ---------- THANKS ----------
function buildThanks() {
  const body = `<header class="confirm"><div class="wrap"><div class="eyebrow rv in">You're In</div><h1 class="rv in">Done! Check your inbox. Your e-book is on the way.</h1><p class="rv in">Give it 2 to 3 minutes. If it's not there, check spam and drag it to your inbox so you never miss The Lease Up.</p></div></header>
<section class="section tripwire"><div class="wrap tw-grid">
  <div class="book-shot rv"><img src="${C.images.playbookCover}" alt="The Luxury Leasing Playbook"></div>
  <div class="rv">
    <div class="eyebrow">Wait, one thing before you go</div>
    <h2 style="font-size:clamp(28px,3.4vw,40px);margin-bottom:18px">The e-book tells you the 9 secrets. The Playbook tells you what to do every single day for your first 30 days.</h2>
    <p style="color:var(--espresso-soft);font-size:17px;margin-bottom:8px"><em>The Luxury Leasing Playbook: Your First 30 Days as a Luxury Leasing Agent</em> gives you a daily action plan, copy-paste email templates and phone scripts, the Power 25 strategy, real showing walkthroughs, and a printable progress scorecard.</p>
    <div class="anchor-line">One lease commission: <span class="strike">${PRICE(C.pricing.commissionLow)}</span> &nbsp;&middot;&nbsp; This playbook: <span class="pop">${C.pricing.playbook}</span></div>
    <a href="#" class="btn btn-gold" style="font-size:16.5px;padding:15px 34px">Get the Playbook for ${C.pricing.playbook}</a>
  </div>
</div></section>
<section class="final"><div class="glow"></div><div class="wrap"><h2 class="rv">While you wait for your e-book</h2><p class="rv">See what the complete system looks like.</p><a href="club.html" class="btn btn-gold rv">Explore the Elite Leasing Club</a></div></section>`;
  write('thanks.html', page(`Your E-Book Is On The Way | ${C.brand.name}`, body, CSS_SHARED));
}

// ---------- MEET MATTY ----------
function buildMatty() {
  const m = C.matty;
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
  <p class="rv">I spent five years as an independent broker learning every hard lesson this industry has, then five more onsite at Chicago's top luxury residential building. Along the way I closed <strong>more than 1,000 leases</strong> and earned <strong>over $2.5 million in commissions</strong>, not by selling homes, but by treating rentals like the business they really are.</p>
  <p class="rv">Somewhere in those thousand leases I realized something: it was never talent. It was a <strong>system</strong>. Repeatable, teachable, and nobody was teaching it. Agents were quitting in their first year while a six-figure market sat right in front of them, overlooked.</p>
  <p class="rv">So I built ${C.brand.name}: the roadmap I wish someone had handed me. Every course, every script, every tracker inside comes from the field, not from theory that sounds nice on a slide.</p>
</div></section>
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
<section class="final"><div class="glow"></div><div class="wrap"><h2 class="rv">${m.finalHeadline}</h2><p class="rv">${C.brand.hashtag}</p><a href="club.html" class="btn btn-gold rv" style="margin-right:12px">Join the Elite Leasing Club</a><a href="ebook.html" class="btn btn-ghost rv" style="border-color:var(--gold-bright);color:var(--gold-bright)">Start with the Free E-Book</a></div></section>`;
  write('meet-matty.html', page(`Meet Matty | ${C.brand.name}`, body, CSS_SHARED));
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
buildThanks();
buildMatty();
console.log('Done. Site is in /public');
