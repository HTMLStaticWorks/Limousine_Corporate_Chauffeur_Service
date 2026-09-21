const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

// Navigation mobile toggle
const nav=$('.nav'), menu=$('.menu'); if(menu) menu.addEventListener('click',()=>nav.classList.toggle('open'));
$$('.navlinks a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));

// Intersection Observer for scroll animations
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});
$$('.reveal').forEach(e=>io.observe(e));

// Back to top button
const topBtn=$('.backtop'); if(topBtn){addEventListener('scroll',()=>topBtn.classList.toggle('show',scrollY>650));topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'})}

// Booking Modal logic
const modal=$('.modal'); $$('.open-book').forEach(b=>b.addEventListener('click',()=>modal?.classList.add('open'))); $('.modal-close')?.addEventListener('click',()=>modal.classList.remove('open')); modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});

// Toast notification helper
function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}

// Demo form submissions & action buttons
$$('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();toast(f.dataset.message||'Request received. Our team will contact you shortly.');f.reset();modal?.classList.remove('open')}));
$$('[data-demo-action]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.demoAction)));

// Dynamic year in footer
const year=$('[data-year]');if(year)year.textContent=new Date().getFullYear();

// Theme switcher (Dark / Light)
const root=document.documentElement;
const themeButton=document.querySelector('.theme-toggle');
const savedTheme=localStorage.getItem('chauffeur-theme');
if(savedTheme==='light'||savedTheme==='dark') root.dataset.theme=savedTheme;
function syncThemeIcon(){if(!themeButton)return; const dark=root.dataset.theme!=='light'; themeButton.textContent=dark?'☀':'☾'; themeButton.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme'); themeButton.title=themeButton.getAttribute('aria-label')}
syncThemeIcon();
themeButton?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';localStorage.setItem('chauffeur-theme',root.dataset.theme);syncThemeIcon();toast(root.dataset.theme==='dark'?'Dark theme enabled':'Light theme enabled')});

// RTL / LTR Direction switcher — persists user choice
const dirButton=document.querySelector('.dir-toggle');
const savedDir=localStorage.getItem('chauffeur-dir');
if(savedDir==='rtl'||savedDir==='ltr') root.dir=savedDir; else root.dir='ltr';
function syncDirIcon(){
  if(!dirButton)return;
  const isRtl=root.dir==='rtl';
  dirButton.textContent=isRtl?'LTR':'RTL';
  dirButton.setAttribute('aria-label',isRtl?'Switch to LTR layout':'Switch to RTL layout');
  dirButton.title=dirButton.getAttribute('aria-label');
}
syncDirIcon();
dirButton?.addEventListener('click',()=>{
  root.dir=root.dir==='rtl'?'ltr':'rtl';
  localStorage.setItem('chauffeur-dir',root.dir);
  syncDirIcon();
  toast(root.dir==='rtl'?'RTL direction enabled':'LTR direction enabled');
});

// Accordion / FAQ Toggle logic (Manual Click Toggle)
$$('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const parent = item?.parentElement;
    if (parent) {
      parent.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
    }
    if (item) item.classList.toggle('active');
  });
});


// Interactive Rate Estimator logic (Pricing page)
const calcBtn = $('#calc-rate-btn');
if(calcBtn) {
  calcBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const vType = $('#calc-vehicle')?.value || 'Sedan';
    const dist = parseInt($('#calc-distance')?.value || '25', 10);
    const service = $('#calc-service')?.value || 'point';
    
    let base = 85;
    if(vType.includes('SUV')) base = 120;
    if(vType.includes('Van')) base = 160;
    if(vType.includes('Maybach') || vType.includes('First Class')) base = 220;
    
    let total = base + (dist * 2.5);
    if(service === 'hourly') total = base * 3;
    
    const resEl = $('#calc-result');
    if(resEl) {
      resEl.innerHTML = `<div style="padding:15px;background:var(--panel2);border-radius:12px;border:1px solid var(--accent);margin-top:15px;text-align:center;">
        <span class="eyebrow">Estimated Rate</span>
        <div style="font:800 32px Manrope;color:var(--accent2);margin:6px 0;">$${Math.round(total)} USD</div>
        <small style="color:var(--muted)">Includes flight monitoring, tolls, taxes & 60-min wait time.</small>
      </div>`;
    }
  });
}

// Auth Form Handlers (Sign In & Sign Up redirect to home page index.html)
const signinForm = $('#auth-signin-form');
if (signinForm) {
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    toast('Signed in successfully! Redirecting to home page...');
    setTimeout(() => {
      window.location.href = signinForm.dataset.redirect || 'index.html';
    }, 800);
  });
}

const signupForm = $('#auth-signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    toast('Account created successfully! Redirecting to home page...');
    setTimeout(() => {
      window.location.href = signupForm.dataset.redirect || 'index.html';
    }, 800);
  });
}

// Social Auth Buttons (Google & Apple)
$$('[data-auth-social]').forEach(btn => {
  btn.addEventListener('click', () => {
    const provider = btn.dataset.authSocial || 'Social Provider';
    toast(`Authenticated with ${provider}! Redirecting to home page...`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  });
});

// Password Visibility Toggle Logic
const eyeOpenSvg = `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffSvg = `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

$$('.pass-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const wrapper = btn.closest('.password-wrapper');
    const input = wrapper?.querySelector('input');
    if (input) {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass ? eyeOffSvg : eyeOpenSvg;
      btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
    }
  });
});

// Dashboard Modals Logic (Welcome Confirmation & Sign Out Confirmation)
const welcomeModal = $('#dash-welcome-modal');
const closeWelcomeBtn = $('#close-welcome-btn');
if (closeWelcomeBtn && welcomeModal) {
  closeWelcomeBtn.addEventListener('click', () => {
    welcomeModal.classList.remove('open');
  });
}

const signoutModal = $('#dash-signout-modal');
const openSignoutBtn = $('#open-signout-modal');
const cancelSignoutBtn = $('#cancel-signout-btn');
const confirmSignoutBtn = $('#confirm-signout-btn');

if (openSignoutBtn && signoutModal) {
  openSignoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signoutModal.classList.add('open');
  });
}

if (cancelSignoutBtn && signoutModal) {
  cancelSignoutBtn.addEventListener('click', () => {
    signoutModal.classList.remove('open');
  });
}

if (confirmSignoutBtn) {
  confirmSignoutBtn.addEventListener('click', () => {
    toast('Signing out... Redirecting to home page...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  });
}

// Dashboard Tab Switching Logic (No Page Redirects)
function switchDashTab(targetTab) {
  if (!targetTab) return;
  // Update sidebar active link state
  $$('[data-dash-tab]').forEach(link => {
    link.classList.toggle('active', link.dataset.dashTab === targetTab);
  });
  // Hide all tab panels & activate targeted panel
  $$('.dash-tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = $(`#tab-${targetTab}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }
}

$$('[data-dash-tab]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabName = link.dataset.dashTab;
    switchDashTab(tabName);
    history.replaceState(null, '', `#${tabName}`);
  });
});

$$('[data-switch-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.switchTab;
    switchDashTab(target);
    history.replaceState(null, '', `#${target}`);
  });
});

// Auto-activate tab from URL hash on load
if ($('.dash')) {
  const initialHash = location.hash.replace('#', '');
  if (initialHash && $(`#tab-${initialHash}`)) {
    switchDashTab(initialHash);
  }
}

// Dashboard Mobile Sidebar Hamburger Toggle & Overlay
const dashSide = $('.side');
const dashMenuBtn = $('.dash-menu-toggle');
const dashCloseBtn = $('.side-close-btn');

if (dashSide) {
  let dashOverlay = $('.dash-overlay');
  if (!dashOverlay) {
    dashOverlay = document.createElement('div');
    dashOverlay.className = 'dash-overlay';
    document.body.appendChild(dashOverlay);
  }

  const toggleDashSide = (open) => {
    const isOpen = open !== undefined ? open : !dashSide.classList.contains('open');
    dashSide.classList.toggle('open', isOpen);
    dashOverlay.classList.toggle('open', isOpen);
  };

  dashMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDashSide();
  });

  dashCloseBtn?.addEventListener('click', () => toggleDashSide(false));
  dashOverlay?.addEventListener('click', () => toggleDashSide(false));

  $$('.side a').forEach(link => {
    link.addEventListener('click', () => {
      toggleDashSide(false);
    });
  });
}



