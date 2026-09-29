// ===== Утилиты =====
const $ = (sel, root = document) => root.querySelector(sel);

// ===== Мобильное меню =====
const header = $('#header');
const burger = $('#burger');
burger.addEventListener('click', () => {
  const open = header.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});
header.addEventListener('click', e => {
  if (e.target.closest('.nav a, .header__cta')) {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Шапка: прозрачная над садом, при прокрутке сжимается и получает фон
const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

// Подсветка текущего раздела в меню
(function scrollSpy() {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const sections = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const visible = new Set();
  const update = () => {
    let current = null;
    for (const sec of sections) if (visible.has(sec)) { current = sec; break; }
    links.forEach(a => a.classList.toggle('is-active', current && byId.get(current.id) === a));
  };
  // раздел считается текущим, когда пересекает полосу чуть выше середины экрана
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => en.isIntersecting ? visible.add(en.target) : visible.delete(en.target));
    update();
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(sec => io.observe(sec));
})();

// ===== Заявка на аренду =====
const bookingForm = $('#bookingForm');
const bookingThanks = $('#bookingThanks');

bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  // TODO: отправка заявки на сервер / в Telegram
  bookingForm.hidden = true;
  bookingThanks.hidden = false;
});
$('#bookingReset').addEventListener('click', () => {
  bookingForm.reset();
  bookingForm.hidden = false;
  bookingThanks.hidden = true;
});

// ===== Главный экран: сменяющаяся роль =====
(function rotateRole() {
  const el = $('#roleWord');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const roles = ['режиссёр', 'коллекционер', 'автор', 'арт-директор', 'хозяйка салона', 'дирижёр', 'парфюмер'];
  let i = 0;
  setInterval(() => {
    el.classList.add('is-out');
    setTimeout(() => {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
      el.classList.remove('is-out');
    }, 350);
  }, 2600);
})();

// ===== Никогда раньше: отметки и паспорт =====
(function firstsPassport() {
  const box = $('#firsts');
  if (!box) return;
  const stamps = $('#stamps');
  const empty = $('#stampsEmpty');
  const count = $('#firstsCount');
  const word = $('#firstsWord');
  const KEY = 'rs-firsts';
  const plural = n => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return 'первый раз';
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'первых раза';
    return 'первых разов';
  };
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
  const buttons = [...box.querySelectorAll('.first')];
  buttons.forEach(b => { if (saved.includes(b.dataset.i)) b.setAttribute('aria-pressed', 'true'); });

  function render(animate) {
    const on = buttons.filter(b => b.getAttribute('aria-pressed') === 'true');
    count.textContent = on.length;
    word.textContent = plural(on.length);
    empty.hidden = on.length > 0;
    stamps.innerHTML = '';
    on.forEach((b, k) => {
      const st = document.createElement('span');
      st.className = 'stamp';
      st.textContent = b.textContent;
      st.style.setProperty('--r', ((k * 37) % 24 - 12) + 'deg');
      if (!animate) st.style.animation = 'none';
      stamps.appendChild(st);
    });
    try { localStorage.setItem(KEY, JSON.stringify(on.map(b => b.dataset.i))); } catch (e) {}
  }

  box.addEventListener('click', e => {
    const b = e.target.closest('.first');
    if (!b) return;
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    render(true);
  });
  render(false);
})();

// ===== Меняющийся знак: выбор эмблемы для шапки =====
(function emblemPicker() {
  const list = $('#emblems');
  const logo = $('#brandLogo');
  if (!list || !logo) return;
  const buttons = [...list.querySelectorAll('.emblem')];
  const mark = i => buttons.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === i)));
  mark(+logo.dataset.i || 0);
  list.addEventListener('click', e => {
    const b = e.target.closest('.emblem');
    if (!b) return;
    const i = +b.dataset.i;
    const img = b.querySelector('img');
    logo.src = img.src;
    logo.width = +img.getAttribute('width');
    logo.height = +img.getAttribute('height');
    logo.dataset.i = i;
    logo.classList.remove('is-swap');
    void logo.offsetWidth;
    logo.classList.add('is-swap');
    // следующий визит продолжит с выбранного
    try { localStorage.setItem('rs-emblem', i); } catch (e) {}
    mark(i);
  });
})();

// ===== Главный экран: сад =====
const hero = $('#hero');
const garden = $('#garden');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Запускаем вход, когда загрузился фон сада (или через 2.5 с на медленной сети)
(function startIntro() {
  const bg = $('.garden__layer--bg img', garden);
  let started = false;
  const go = () => { if (!started) { started = true; hero.classList.add('is-ready'); } };
  if (bg.complete) go();
  else { bg.addEventListener('load', go, { once: true }); bg.addEventListener('error', go, { once: true }); }
  setTimeout(go, 2500);
})();

// Лепестки
(function makePetals() {
  if (reduceMotion) return;
  const box = $('#petals');
  const count = window.innerWidth < 600 ? 6 : 11;
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.setProperty('--x', rnd(38, 100) + '%');
    p.style.setProperty('--s', rnd(14, 24).toFixed(1) + 'px');
    p.style.setProperty('--dur', rnd(11, 19).toFixed(1) + 's');
    p.style.setProperty('--delay', (2.5 + i * 1.3 + rnd(0, 1)).toFixed(1) + 's');
    p.style.setProperty('--drift', rnd(-160, 60).toFixed(0) + 'px');
    p.style.setProperty('--rot', rnd(240, 620).toFixed(0) + 'deg');
    box.appendChild(p);
  }
})();

// Параллакс: слои сада сдвигаются от курсора и прокрутки с разной силой
(function parallax() {
  if (reduceMotion) return;
  const layers = [...garden.querySelectorAll('.garden__layer')].map(el => ({
    el, mouse: +el.dataset.mouse, scroll: +el.dataset.scroll,
  }));
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  let visible = true, raf = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', e => {
      target.x = e.clientX / window.innerWidth * 2 - 1;
      target.y = e.clientY / window.innerHeight * 2 - 1;
      kick();
    }, { passive: true });
  }
  window.addEventListener('scroll', kick, { passive: true });

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); }).observe(garden);

  function kick() { if (!raf && visible) raf = requestAnimationFrame(tick); }
  function tick() {
    raf = 0;
    cur.x += (target.x - cur.x) * .06;
    cur.y += (target.y - cur.y) * .06;
    const sy = Math.min(window.scrollY, 500);
    for (const l of layers) {
      const tx = -cur.x * l.mouse;
      const ty = -cur.y * l.mouse * .6 + sy * l.scroll;
      l.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    }
    if (Math.abs(target.x - cur.x) > .001 || Math.abs(target.y - cur.y) > .001) kick();
  }
  kick();
})();
