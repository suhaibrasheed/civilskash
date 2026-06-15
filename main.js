/* ══════════════════════════════════════════════════════════════════════════
   CIVILSKASH — MOTION & INTERACTION ENGINE v2
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';

// ── UTILITIES ────────────────────────────────────────────────────────────────
const qs    = (sel, ctx = document) => ctx.querySelector(sel);
const qsa   = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const rand  = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp  = (a, b, t) => a + (b - a) * t;

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function initReveal() {
    const els = qsa('.js-reveal, .js-reveal-delay');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => io.observe(el));
}

// ── FLOATING PARTICLES ────────────────────────────────────────────────────────
function initParticles() {
    const container = qs('#particles');
    if (!container) return;
    const count = 26;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'particle';
        const size = rand(1.2, 2.8);
        el.style.cssText = [
            `width:${size}px`,
            `height:${size}px`,
            `left:${rand(2, 98)}%`,
            `top:${rand(5, 92)}%`,
            `--dur:${rand(8, 17)}s`,
            `--delay:${rand(0, 11)}s`,
        ].join(';');
        if (Math.random() < 0.22) el.style.background = '#9B6DFF';
        else if (Math.random() < 0.18) el.style.background = '#4A9EFF';
        frag.appendChild(el);
    }
    container.appendChild(frag);
}

// ── NAV GLASS ON SCROLL & MOBILE TOGGLE ───────────────────────────────────────
function initNav() {
    const nav = qs('#nav');
    if (!nav) return;
    
    // Scroll glass effect
    let ticking = false;
    function update() {
        const y = window.scrollY;
        if (y > 40) {
            nav.style.backdropFilter         = 'blur(30px)';
            nav.style.webkitBackdropFilter   = 'blur(30px)';
            nav.style.background             = 'rgba(7,7,10,0.15)';
            nav.style.borderBottom           = '1px solid rgba(255,255,255,0.03)';
        } else {
            nav.style.backdropFilter         = '';
            nav.style.webkitBackdropFilter   = '';
            nav.style.background             = '';
            nav.style.borderBottom           = '';
        }
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    // Mobile menu toggle
    const toggle = qs('#mobile-toggle');
    const menu = qs('#mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            menu.setAttribute('aria-hidden', expanded);
            toggle.classList.toggle('nav__mobile-toggle--active');
            menu.classList.toggle('nav__mobile-menu--active');
        });

        // Close menu on navigation click
        qsa('.nav__mobile-link', menu).forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
                toggle.classList.remove('nav__mobile-toggle--active');
                menu.classList.remove('nav__mobile-menu--active');
            });
        });
    }
}

// ── HERO TITLE STAGGER ────────────────────────────────────────────────────────
function initHeroStagger() {
    const ecoIntro = qs('.eco-intro');
    if (ecoIntro) {
        ecoIntro.style.opacity = '0';
        ecoIntro.style.transform = 'translateY(20px)';
        ecoIntro.style.transition = 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            ecoIntro.style.opacity = '1';
            ecoIntro.style.transform = 'translateY(0)';
        }));
    }

    const lines = qsa('.hero__title-line');
    lines.forEach((line, i) => {
        line.style.opacity   = '0';
        line.style.transform = 'translateY(28px)';
        line.style.transition = `opacity 0.78s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.11}s, transform 0.78s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.11}s`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            line.style.opacity   = '1';
            line.style.transform = 'translateY(0)';
        }));
    });
}

// ── FEATURE CAPSULE ENTRANCE ──────────────────────────────────────────────────
function initCapsuleEntrance() {
    const capsules = qsa('.capsule');
    capsules.forEach((c, i) => {
        c.style.opacity   = '0';
        c.style.transform = 'translateY(12px)';
        c.style.transition = `opacity 0.5s ease ${0.6 + i * 0.07}s, transform 0.5s ease ${0.6 + i * 0.07}s`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            c.style.opacity   = '1';
            c.style.transform = 'translateY(0)';
        }));
    });
}

// ── 3D CARD TILT ──────────────────────────────────────────────────────────────
function initCardTilt() {
    const card = qs('.hero__card');
    if (!card) return;
    const wrap  = card.closest('.hero__card-wrap');
    if (!wrap) return;
    const MAX_DEG = 7;
    let targetX = 0, targetY = 0, currX = 0, currY = 0;

    wrap.addEventListener('mousemove', e => {
        const rect = wrap.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        targetX = clamp(dy * MAX_DEG, -MAX_DEG, MAX_DEG);
        targetY = clamp(-dx * MAX_DEG, -MAX_DEG, MAX_DEG);
    });
    wrap.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

    (function loop() {
        currX = lerp(currX, targetX, 0.075);
        currY = lerp(currY, targetY, 0.075);
        // Only apply tilt if MCQ hasn't been answered (no redirect in progress)
        if (!card.dataset.answered) {
            card.style.transform = `perspective(1100px) rotateX(${currX}deg) rotateY(${currY}deg) translateZ(0)`;
        }
        requestAnimationFrame(loop);
    })();
}

// ── CURSOR SHINE ON CARDS ─────────────────────────────────────────────────────
function initCardShine() {
    qsa('.eco-card, .notekash-card, .social-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
            const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
            card.style.backgroundImage = `
                radial-gradient(
                    circle at ${x}% ${y}%,
                    rgba(255,255,255,0.035) 0%,
                    transparent 65%
                )
            `;
        });
        card.addEventListener('mouseleave', () => {
            card.style.backgroundImage = '';
        });
    });
}

// ── PARALLAX ORBS ─────────────────────────────────────────────────────────────
function initParallax() {
    const orb1 = qs('.scene__orb--1');
    const orb2 = qs('.scene__orb--2');
    const spot = qs('.scene__spotlight');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (orb1) orb1.style.transform = `translateX(-50%) translateY(${y * 0.11}px)`;
                if (orb2) orb2.style.transform = `translate(${-y * 0.05}px, ${-y * 0.08}px)`;
                if (spot) spot.style.transform = `translateY(${y * 0.06}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ── INTERACTIVE MCQ CARD ──────────────────────────────────────────────────────
function initMCQ() {
    const opts = qsa('.hero__card-opt');
    if (!opts.length) return;
    const card = qs('#mcq-card');
    const expEl = qs('#mcq-exp');
    let answered = false;

    // Explanation text for the correct answer
    const EXPLANATION = 'Carbon monoxide is a toxic gas but not considered a direct greenhouse gas because it does not absorb infrared radiation strongly, unlike Methane, Nitrous oxide, and Carbon dioxide.';

    opts.forEach(btn => {
        btn.addEventListener('click', () => {
            if (answered) return;
            answered = true;
            card.dataset.answered = '1';
            const isCorrect = btn.dataset.correct === 'true';

            // Mark selected option
            btn.classList.add(isCorrect ? 'hero__card-opt--correct' : 'hero__card-opt--selected');

            // If wrong, highlight correct and mark wrong
            opts.forEach(o => {
                o.disabled = true;
                if (o.dataset.correct === 'true' && !isCorrect) {
                    o.classList.add('hero__card-opt--correct');
                    o.innerHTML = `<span class="opt__icon opt__icon--correct">✓</span> ${o.textContent.trim()}`;
                }
            });

            if (!isCorrect) {
                btn.classList.remove('hero__card-opt--selected');
                btn.classList.add('hero__card-opt--wrong');
                btn.innerHTML = `<span class="opt__icon opt__icon--wrong">✗</span> ${btn.textContent.trim()}`;
            } else {
                btn.innerHTML = `<span class="opt__icon opt__icon--correct">✓</span> ${btn.textContent.trim()}`;
            }

            // Show explanation inline
            let expBox = qs('.mcq-explanation', card);
            if (!expBox) {
                expBox = document.createElement('div');
                expBox.className = 'mcq-explanation';
                qs('.hero__card-body', card).appendChild(expBox);
            }
            expBox.textContent = EXPLANATION;
            // Animate in after brief pause
            setTimeout(() => expBox.classList.add('show'), 180);

            // Update footer tag
            if (expEl) {
                expEl.textContent = isCorrect
                    ? 'Correct! Redirecting to MCQKash…'
                    : 'Nice try! Opening MCQKash for more…';
            }

            // Polished redirect after 3 seconds, keeping the card fully visible
            setTimeout(() => {
                window.location.href = 'https://civilskash.in/mcq/';
            }, 3000);
        });

        // Hover feedback (non-answered state only)
        btn.addEventListener('mouseenter', () => {
            if (answered) return;
            btn.style.transform = 'translateX(3px)';
        });
        btn.addEventListener('mouseleave', () => {
            if (answered) return;
            btn.style.transform = '';
        });
    });
}

// ── SMOOTH SCROLL FOR ANCHORS ─────────────────────────────────────────────────
function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = qs(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ── CURSOR GLOW (desktop) ─────────────────────────────────────────────────────
function initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = document.createElement('div');
    dot.style.cssText = [
        'position:fixed', 'width:280px', 'height:280px',
        'border-radius:50%', 'pointer-events:none', 'z-index:0',
        'background:radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)',
        'transform:translate(-50%,-50%)',
        'will-change:left,top',
        'left:-999px', 'top:-999px',
    ].join(';');
    document.body.appendChild(dot);
    let mx = -999, my = -999, cx = -999, cy = -999;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
        cx = lerp(cx, mx, 0.09);
        cy = lerp(cy, my, 0.09);
        dot.style.left = `${cx}px`;
        dot.style.top  = `${cy}px`;
        requestAnimationFrame(loop);
    })();
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
    initParticles();
    initReveal();
    initNav();
    initHeroStagger();
    initCapsuleEntrance();
    initCardTilt();
    initCardShine();
    initParallax();
    initMCQ();
    initSmoothScroll();
    initCursorGlow();

    // Above-fold elements revealed immediately
    const nav  = qs('.nav.js-reveal');
    const hero = qs('.hero.js-reveal');
    if (nav)  setTimeout(() => nav.classList.add('is-visible'),  40);
    if (hero) setTimeout(() => hero.classList.add('is-visible'), 90);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
