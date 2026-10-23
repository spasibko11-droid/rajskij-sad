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

// ===== Афиша ноября =====
// Цены по срокам: до открытия и после открытия.
const PRICE_SWITCH_DAY = '2026-11-15';
const SIGNUP_TG = 'https://t.me/rayskiysad_golitsyno';
const TIER_LABELS = ['До открытия', 'После открытия'];
// живописные постеры к событиям: добавляйте путь, когда картина готова
const POSTERS = {
  lilu: 'images/posters/lilu.webp?v=1792680082',
  brooch: 'images/posters/brooch.webp?v=1792680082',
  selfesteem: 'images/posters/selfesteem.webp?v=1792680082',
  sweets: 'images/posters/sweets.webp?v=1792680082',
  english: 'images/posters/english.webp?v=1792680082',
  photoday: 'images/posters/photoday.webp?v=1792680082',
};

const FILTERS = ['Все встречи', 'Творчество', 'Для себя', 'Игры', 'Английский', 'Психология', 'Кино и книги', 'Женские вечера', 'Эксперты'];

const EVENTS = [
  {
    id: 'lilu', day: 17, month: 'ноября', time: '19:00–21:00', tags: ['Игры', 'Для себя'], meta: ['До 6 участниц', 'Кофе включён'],
    title: 'Игра «Лилу»: раскрыть свой потенциал',
    lead: 'Что вас вдохновляет, на что можно опереться и каким желаниям давно пора дать место? Камерная игра о ваших возможностях, сильных сторонах и следующем шаге.',
    host: { name: 'Асмик Акопян', role: 'ведущая', photo: 'images/people/asmik.webp', bio: 'Исполнительный директор стоматологической клиники «Эстетика Дентал» в Голицыно, эксперт по финансовому и операционному управлению в медицинской сфере.' },
    about: [
      'В повседневной суете мы так привыкаем замечать задачи и ограничения, что забываем, сколько в нас интереса и идей. «Лилу»: повод на время отложить список дел и спросить себя: чего мне сейчас хочется?',
      'Играя, посмотрим на свой запрос с разных сторон, заметим то, что у вас уже получается, и подумаем, что можно попробовать дальше. Здесь нет правильных ответов, ценны ваши собственные наблюдения.',
      'Можно прийти без готового вопроса и без компании. Нас будет до 6 участниц, поэтому у каждой найдётся время и место, а рассказывать о личном нужно только столько, сколько вам комфортно.'
    ],
    steps: ['Знакомимся и выбираем вопрос, который сейчас откликается', 'Играем: ищем желания, сильные стороны и возможности', 'Говорим о том, что помогает двигаться вперёд, а что удерживает', 'Смотрим на свой запрос по-новому и собираем идеи', 'За чашкой кофе подводим итог и намечаем свой следующий шаг'],
    prices: [1200, 1700], priceNote: 'Кофе включён в стоимость · До 6 участниц'
  },
  {
    id: 'brooch', day: 21, month: 'ноября', time: '12:00–14:00', tags: ['Творчество'], meta: ['До 15 участниц'],
    title: 'Брошь, которую вы сделали сами',
    lead: 'Превратим нити в небольшое украшение. Два часа творчества и брошь, которую можно оставить себе или подарить близкому человеку ко Дню матери.',
    host: { name: 'Анастасия', role: 'ведущая', initial: 'А', bio: 'Ведущая творческого мастер-класса по изготовлению брошей крючком.' },
    about: [
      'Как приятно хоть раз за неделю заняться чем-то своими руками: выбрать детали, смотреть, как из ниток понемногу появляется вещь, и забрать её с собой. Для такого удовольствия стоит найти время.',
      'На мастер-классе свяжем брошь крючком. Ведущая шаг за шагом покажет, что и как делать, и поможет на каждом этапе.'
    ],
    steps: ['Смотрим образец и знакомимся с материалами', 'Разбираем, с чего начать и как двигаться дальше', 'Вяжем брошь, ведущая рядом и подсказывает', 'Собираем украшение и добавляем финальные детали'],
    prices: [1300, 1700], priceNote: 'До 15 участниц'
  },
  {
    id: 'selfesteem', day: 22, month: 'ноября', time: '12:00–14:00', tags: ['Психология', 'Для себя'], meta: ['До 10 участниц', 'Кофе включён'],
    title: 'Самооценка: опора на себя',
    lead: 'Как разговаривать с собой бережнее и замечать свои сильные стороны? Встреча с психологом, живое обсуждение и время для ваших вопросов в группе до 10 человек.',
    host: { name: 'Алёна Яровенко', role: 'психолог', photo: 'images/people/alena.webp', bio: 'Психолог. Ведущая встречи о самооценке в «Райском саду».' },
    about: [
      'Бывает, что чужое мнение звучит громче собственного, а за мелкую ошибку мы ругаем себя дольше, чем радуемся успехам. На встрече поговорим о самооценке и о том, как складывается наше отношение к себе.',
      'Это небольшая тёплая встреча с психологом: можно слушать, задавать вопросы и делиться наблюдениями. Рассказывать о личном не нужно, если не хочется.'
    ],
    steps: ['Знакомимся и говорим о том, что такое самооценка', 'Говорим об отношении к себе и о внутреннем критике', 'Отвечаем на вопросы участниц', 'В конце обсудим, что хочется забрать с собой'],
    prices: [1200, 1700], priceNote: 'Кофе включён в стоимость · До 10 участниц'
  },
  {
    id: 'sweets', day: 25, month: 'ноября', time: 'Утро', tags: ['Творчество'], meta: ['До 10 участниц', 'Кофе включён'],
    title: 'Сладкое своими руками',
    lead: 'Кондитерский мастер-класс с Кариной Мироновой: создадим что-то вкусное, уделим внимание оформлению и зададим вопросы мастеру.',
    host: { name: 'Карина Миронова', role: 'кондитер', photo: 'images/people/karina.webp', bio: 'Кондитер, авторская кондитерская «Кондитерская Карины М» в Голицыно. Создаёт торты, бенто и десерты на заказ.' },
    about: [
      'Сладкое творчество складывается из рецепта, удачных сочетаний, аккуратных деталей и радости от того, что получилось у вас в руках.',
      'С Кариной разберём, как создаётся десерт, попробуем сами и будем спрашивать по ходу дела.'
    ],
    steps: ['Знакомимся с Кариной и десертом встречи', 'Разбираем этапы и приёмы оформления', 'Делаем сами, Карина рядом и помогает', 'Задаём вопросы кондитеру и пьём кофе в хорошей компании'],
    prices: [1000, 1500], priceNote: 'Кофе включён в стоимость · До 10 участниц'
  },
  {
    id: 'english', day: 28, month: 'ноября', time: '18:00–19:30', tags: ['Английский'], meta: ['До 10 участников', 'Кофе включён'],
    title: 'Английский без страха: первая встреча клуба',
    lead: 'Даже если пока трудно подобрать слова, приходите практиковаться. Познакомимся с носителем языка, определим уровень и соберём группы, в которых будет комфортно говорить.',
    host: { name: 'Августина', role: 'преподаватель', photo: 'images/people/avgustina.webp', bio: 'Носитель языка, преподаватель «Центр Магистра». Ведёт знакомство и разговорную практику в английском клубе «Райского сада».' },
    about: [
      'Понимаете больше, чем можете сказать? Репетируете фразу в голове, а потом решаете промолчать? Разговорный клуб: место, где можно начать говорить медленно, с паузами и ошибками.',
      'На первой встрече познакомимся с Августиной и немного поговорим в том темпе, который вам удобен. Поймём, какой уровень вам подходит, обсудим ваши цели и соберём группы. Дальше занятия пойдут по уровням: начинающим спокойно, тем, кто говорит увереннее, интересно.',
      'Говорить будем о себе, об интересах и о жизни. Готовить идеальную речь не нужно, главное попробовать, услышать живой английский и шаг за шагом почувствовать себя свободнее.'
    ],
    steps: ['Знакомимся с Августиной, носителем языка', 'Лёгкая разговорная практика: начинаем с того, что уже умеете сказать', 'Определяем уровень и обсуждаем ваши цели', 'Собираем группы с учётом подготовки', 'Договариваемся об удобном расписании'],
    prices: [1200, 1700], priceNote: 'Кофе включён в стоимость · До 10 участников'
  },
  {
    id: 'photoday', day: 29, month: 'ноября', time: '10:00–16:00 · по записи', tags: ['Для себя'], meta: ['До 12 слотов'], kind: 'Фотодень',
    title: 'Фотодень ко Дню матери: самые близкие в кадре',
    lead: 'Мама и ребёнок, вы с мамой, бабушка с внуками или сразу несколько поколений. Приходите одной, вдвоём или втроём. Сохраним ваши объятия, улыбки и время вместе. 20 минут съёмки, 3 фото в ретуши и 20 в цветокоррекции.',
    host: { name: 'Елена', role: 'фотограф', initial: 'Е', bio: 'Фотограф фотодня ко Дню матери в «Райском саду».' },
    about: [
      'Есть фотографии, которые со временем становятся только дороже: вы на руках у мамы, бабушка обнимает внуков, три поколения рядом. Ко Дню матери приглашаем сделать такие кадры в «Райском саду».',
      'Можно прийти одной и сделать портреты для себя, можно с ребёнком, с мамой, с бабушкой или всем втроём. Если вас больше трёх, напишите заранее, и вместе придумаем, как всё устроить.',
      'Это возможность побыть вместе и сохранить на память ваши отношения: как вы смотрите друг на друга, смеётесь и обнимаетесь. В своём слоте можно договориться с фотографом о совместных и отдельных кадрах.',
      'Съёмка по записи, на каждую компанию 20 минут. При записи напишите, кто придёт и сколько лет детям: так фотограф лучше подготовится к встрече.'
    ],
    steps: ['20 минут съёмки в вашем слоте', 'Портреты одной, вдвоём, втроём или всей семьёй', 'Совместные и отдельные кадры по договорённости с фотографом', '3 фотографии в ретуши', '20 фотографий в цветокоррекции'],
    prices: [1700, 2000], priceNote: 'До 12 слотов'
  }
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rub = n => n.toLocaleString('ru-RU') + ' ₽';

// какая цена действует сегодня: 0 до открытия, 1 после открытия
function currentTier() {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return today < PRICE_SWITCH_DAY ? 0 : 1;
}

function pricesHtml(ev) {
  const t = currentTier();
  return `<ul class="tiers">${ev.prices.map((p, i) => `
    <li class="${i === t ? 'is-now' : i < t ? 'is-past' : ''}"><span>${TIER_LABELS[i]}</span><b>${rub(p)}</b>${i === t ? '<em>сейчас</em>' : ''}</li>`).join('')}
  </ul>`;
}

function hostHtml(h, big) {
  if (!h) return '';
  const pic = h.photo
    ? `<img src="${esc(h.photo)}" alt="${esc(h.name)}" loading="lazy">`
    : `<span class="host__initial">${esc(h.initial || h.name[0])}</span>`;
  return `<div class="host${big ? ' host--big' : ''}">${pic}<div><b>${esc(h.name)}</b><span>${esc(big ? h.bio : h.role)}</span></div></div>`;
}

// Афиша: при наведении на строку рядом с курсором появляется картина события
(function peek() {
  const box = $('#peek');
  const list = $('#events');
  if (!box || !list || !window.matchMedia('(pointer: fine)').matches) return;
  const inner = box.firstElementChild;
  let x = 0, y = 0, cx = 0, cy = 0, raf = 0, cur = '';
  const tick = () => {
    cx += (x - cx) * .18; cy += (y - cy) * .18;
    box.style.transform = `translate(${cx}px, ${cy}px)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > .5 ? requestAnimationFrame(tick) : 0;
  };
  list.addEventListener('pointermove', e => {
    x = e.clientX + 28; y = e.clientY - 150;
    if (!raf) raf = requestAnimationFrame(tick);
    const row = e.target.closest('.prow');
    const id = row ? row.dataset.event : '';
    if (id !== cur) {
      cur = id;
      if (id) {
        const ev = EVENTS.find(v => v.id === id);
        inner.innerHTML = POSTERS[id] ? `<img src="${esc(POSTERS[id])}" alt="">` : `<span>${esc(ev ? (ev.kind || ev.tags[0]) : '')}</span>`;
        if (!box.classList.contains('is-on')) { cx = x; cy = y; }
      }
      box.classList.toggle('is-on', !!id);
    }
  });
  list.addEventListener('pointerleave', () => { cur = ''; box.classList.remove('is-on'); });
})();

(function calendar() {
  const chipsEl = $('#chips');
  const eventsEl = $('#events');
  if (!chipsEl || !eventsEl) return;
  let filter = FILTERS[0];

  function renderChips() {
    // показываем только направления, по которым уже есть встречи, с их количеством
    const count = f => EVENTS.filter(e => !e.hidden && (f === FILTERS[0] || e.tags.includes(f))).length;
    chipsEl.innerHTML = FILTERS.filter(f => count(f)).map(f =>
      `<button type="button" class="chip${f === filter ? ' is-active' : ''}" role="tab" aria-selected="${f === filter}" data-filter="${esc(f)}">${esc(f)}<sup>${count(f)}</sup></button>`
    ).join('');
  }

  function renderEvents() {
    const list = EVENTS.filter(e => filter === FILTERS[0] ? !e.hidden : e.tags.includes(filter));
    eventsEl.innerHTML = list.length ? list.map(e => `
      <button type="button" class="event tile" data-event="${e.id}">
        <span class="tile__art">${POSTERS[e.id] ? `<img src="${esc(POSTERS[e.id])}" alt="" loading="lazy">` : `<span class="poster-ph"><span>${esc(e.kind || e.tags[0])}</span></span>`}</span>
        <span class="tile__info">
          <span class="tile__date"><b>${e.day}</b>${esc(e.month)}</span>
          <span class="tile__meta">${[e.kind || e.tags[0], e.time].filter(Boolean).map(esc).join(' · ')}</span>
          <span class="tile__title">${esc(e.title)}</span>
          ${e.host ? `<span class="tile__host">${e.host.photo ? `<img src="${esc(e.host.photo)}" alt="" loading="lazy">` : `<i>${esc(e.host.initial || e.host.name[0])}</i>`}<span>Ведёт ${esc(e.host.name)}</span></span>` : ''}
          <span class="tile__foot">
            <span class="tile__price">${e.prices ? `${rub(e.prices[currentTier()])}<small>${TIER_LABELS[currentTier()]}</small>` : 'Вход свободный'}</span>
            <span class="tile__more" aria-label="Подробнее">→</span>
          </span>
        </span>
      </button>`).join('')
      : `<p class="events__empty">В ноябре таких встреч пока нет. Новые анонсы появляются в <a href="${SIGNUP_TG}" target="_blank" rel="noopener">Telegram «Райского сада»</a>.</p>`;
  }

  chipsEl.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = b.dataset.filter;
    renderChips();
    renderEvents();
  });

  // карточки форматов ведут в афишу с нужным фильтром
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-filter-link]');
    if (!a) return;
    filter = FILTERS.includes(a.dataset.filterLink) ? a.dataset.filterLink : FILTERS[0];
    renderChips();
    renderEvents();
  });

  renderChips();
  renderEvents();
})();

// ===== Карточка встречи =====
(function eventModal() {
  const modal = $('#modal');
  const content = $('#modalContent');
  if (!modal) return;
  let lastFocus = null;

  function open(id) {
    const ev = EVENTS.find(e => e.id === id);
    if (!ev) return;
    const role = ev.host ? (ev.host.role === 'преподаватель' ? 'Преподаватель' : ev.host.role === 'фотограф' ? 'Фотограф' : 'Ведущая') : '';
    const art = POSTERS[id];
    content.innerHTML = `
      <aside class="md__side">
        <div class="md__art">${art ? `<img src="${esc(art)}" alt="">` : `<span>${esc(ev.kind || ev.tags[0])}</span>`}</div>
        <div class="md__when"><b>${ev.day}</b><span>${esc(ev.month)}${ev.time ? `<small>${esc(ev.time)}</small>` : ''}</span></div>
        ${ev.meta.length ? `<ul class="md__meta">${ev.meta.map(m => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
        <div class="md__pay">
          ${ev.free ? '<p class="md__free">Вход свободный</p>' : pricesHtml(ev)}
          <a class="md__btn" href="${esc(ev.signup || SIGNUP_TG)}" target="_blank" rel="noopener">${esc((ev.signupLabel || 'Записаться и оплатить организаторский взнос').replace(/\s*↗$/, ''))}</a>
          <p class="md__note">${esc(ev.free ? (ev.signupNote || '') : (ev.priceNote || ''))}</p>
        </div>
      </aside>
      <div class="md__main">
        <div class="md__kicker">${esc(ev.kind || ev.tags[0])} · Ноябрь в «Райском саду»</div>
        <h3 class="md__title" id="modalTitle">${esc(ev.title)}</h3>
        <p class="md__lead">${esc(ev.lead)}</p>
        <section class="md__block"><h4>О встрече</h4>${ev.about.map(p => `<p>${esc(p)}</p>`).join('')}</section>
        <section class="md__block"><h4>Как пройдёт встреча</h4><ol class="md__steps">${ev.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>
        ${ev.host ? `<section class="md__block md__host"><h4>${esc(role)}</h4>${hostHtml(ev.host, true)}</section>` : ''}
        <p class="md__tg">${esc(ev.free ? '' : (ev.signupNote || 'Напишите нам в Telegram, на какую встречу хотите прийти, и мы ответим и поможем с записью.'))}</p>
      </div>
      <div class="md__bar">
        <span>${ev.free ? 'Вход свободный' : `${rub(ev.prices[currentTier()])}<small>${esc(TIER_LABELS[currentTier()])}</small>`}</span>
        <a href="${esc(ev.signup || SIGNUP_TG)}" target="_blank" rel="noopener">${esc(ev.free ? 'Зарегистрироваться' : 'Записаться и оплатить организаторский взнос')}</a>
      </div>`;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    content.parentElement.scrollTop = 0;
    $('.modal__close', modal).focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-event]');
    if (t) open(t.dataset.event);
  });
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();

// ===== Главный экран: сад =====
const hero = $('#hero');
const garden = $('#garden');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Видео сада: цветы распускаются один раз и остаются раскрытыми
(function startIntro() {
  const v = $('.garden__video', garden);
  let started = false;
  const go = () => { if (!started) { started = true; hero.classList.add('is-ready'); } };
  if (!v) { go(); return; }
  const bloom = () => { hero.classList.add('is-bloomed'); if (v.dataset.end) v.poster = v.dataset.end; };
  if (reduceMotion) { v.poster = v.dataset.end; bloom(); go(); return; }
  v.muted = true;
  v.addEventListener('ended', bloom, { once: true });
  v.addEventListener('timeupdate', () => { if (v.duration && v.currentTime >= v.duration - .15) bloom(); });
  const play = () => { go(); v.play().catch(() => { v.poster = v.dataset.end; bloom(); }); };
  if (v.readyState >= 2) play(); else { v.addEventListener('loadeddata', play, { once: true }); v.play().catch(() => {}); }
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



// Опрос: ответы растут как ветки — длина по числу ответов, у лидера яблоко
(function branches() {
  const list = $('#branches');
  if (!list) return;
  const max = +list.dataset.max, W = 600;
  [...list.children].forEach((li, i) => {
    const v = +li.dataset.v, t = li.textContent, L = Math.round(W * v / max);
    let leaves = '';
    for (let x = 34, k = 0; x < L - 24; x += 38, k++) {
      const s = k % 2 ? 1 : -1, d = (x / L * 1.3).toFixed(2);
      leaves += `<path class="leaf" style="transition-delay:${d}s" d="M${x} 15 C ${x + 4} ${15 + 10 * s}, ${x + 14} ${15 + 13 * s}, ${x + 22} ${15 + 11 * s} C ${x + 16} ${15 + 4 * s}, ${x + 8} ${15 + s}, ${x} 15Z"/>`;
    }
    const end = i === 0
      ? `<circle class="fruit" cx="${L - 9}" cy="15" r="8"/><path class="leaf" style="transition-delay:1.5s" d="M${L - 9} 7 C ${L - 6} 1, ${L} 0, ${L + 4} 1 C ${L} 4, ${L - 5} 6, ${L - 9} 7Z"/>`
      : `<path class="leaf" style="transition-delay:1.4s" d="M${L - 22} 15 C ${L - 16} 8, ${L - 6} 8, ${L} 12 C ${L - 6} 17, ${L - 16} 18, ${L - 22} 15Z"/>`;
    li.className = 'branch';
    li.style.transitionDelay = i * .15 + 's';
    li.innerHTML = `<div class="branch__top"><span>${esc(t)}</span><b>${v}</b></div><svg viewBox="0 0 ${L + 6} 30" style="width:${((L + 6) / (W + 6) * 100).toFixed(1)}%" aria-hidden="true"><path class="stem" d="M0 15 C ${L * .3} ${13 + i % 2 * 4}, ${L * .6} ${17 - i % 2 * 4}, ${L - 12} 15"/>${leaves}${end}</svg>`;
  });
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    list.querySelectorAll('.branch').forEach(b => b.classList.add('is-grown'));
    return;
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-grown'); io.unobserve(e.target); }
  }), { threshold: .4 });
  list.querySelectorAll('.branch').forEach(b => io.observe(b));
})();

// Вопросы: открыт только один ответ; цветок распускается, когда блок появляется на экране
(function faq() {
  const items = [...document.querySelectorAll('.faq3__item')];
  items.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
  }));
  const v = document.querySelector('.faq3__vid');
  if (!v) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { v.poster = v.dataset.end; return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.disconnect();
    v.preload = 'auto';
    v.play().catch(() => { v.poster = v.dataset.end; });
  }), { threshold: .45 });
  v.addEventListener('ended', () => { v.poster = v.dataset.end; }, { once: true });
  io.observe(v);
})();

// Колесо фортуны: призы пока условные, вес задаёт, как часто выпадает приз
(function wheel() {
  const disc = $('#wheelDisc'), btn = $('#wheelSpin');
  if (!disc || !btn) return;
  const PRIZES = [
    { t: 'Бесплатный мастер-класс', s: ['Бесплатный', 'мастер-класс'], w: 1, code: 'SAD-MK' },
    { t: 'Скидка 10% на встречу', s: ['Скидка', '10%'], w: 5, code: 'SAD-10' },
    { t: 'Десерт в кофейне', s: ['Десерт', 'в кофейне'], w: 4, code: 'SAD-DESSERT' },
    { t: 'Скидка 20% на встречу', s: ['Скидка', '20%'], w: 2, code: 'SAD-20' },
    { t: 'Кофе в подарок', s: ['Кофе', 'в подарок'], w: 5, code: 'SAD-COFFEE' },
    { t: 'Подарок от сада', s: ['Подарок', 'от сада'], w: 3, code: 'SAD-GIFT' },
    { t: 'Скидка 15% на встречу', s: ['Скидка', '15%'], w: 3, code: 'SAD-15' },
    { t: 'Чай и десерт для двоих', s: ['Чай и десерт', 'для двоих'], w: 2, code: 'SAD-TEA2' }
  ];
  const n = PRIZES.length, step = 360 / n;
  // сектора рисуем сами (у картинки они неровные), от картинки берём только обод с цветами
  const COLORS = ['#7E1B24', '#FDFBF8', '#4A5439', '#EFE6D6'];
  const R = 181, pt = (a, r) => { const t = (a - 90) * Math.PI / 180; return [(r * Math.cos(t)).toFixed(2), (r * Math.sin(t)).toFixed(2)]; };
  disc.innerHTML = `<defs>
      <radialGradient id="wheelRim"><stop offset="0.885" stop-color="#000"/><stop offset="0.9" stop-color="#fff"/></radialGradient>
      <mask id="wheelMask"><circle r="200" fill="url(#wheelRim)"/></mask>
      
    </defs>` +
    PRIZES.map((p, i) => {
      const [x0, y0] = pt(i * step, R), [x1, y1] = pt((i + 1) * step, R);
      return `<path d="M0 0L${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}Z" fill="${COLORS[i % 4]}"/>`;
    }).join('') +
    
    PRIZES.map((p, i) => { const [x, y] = pt(i * step, R); return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#B8964E" stroke-width="1.2" opacity=".85"/>`; }).join('') +
    PRIZES.map((p, i) => {
      const mid = i * step + step / 2, fg = i % 2 === 0 ? '#FDFBF8' : '#7E1B24';
      return `<g transform="rotate(${mid - 90}) translate(100 0)"><text text-anchor="middle" fill="${fg}">
        <tspan x="0" dy="-4">${esc(p.s[0])}</tspan><tspan x="0" dy="17">${esc(p.s[1])}</tspan></text></g>`;
    }).join('');

  const KEY = 'rs-wheel';
  const show = r => {
    $('#wheelPrize').textContent = r.t;
    $('#wheelCode').textContent = r.code;
    $('#wheelResult').hidden = false;
    btn.hidden = true;
  };
  let saved = null;
  // для проверки: ?wheelreset сбрасывает сохранённый выигрыш
  try { if (location.search.includes('wheelreset')) localStorage.removeItem(KEY); saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (saved && saved.t) {
    const i = PRIZES.findIndex(p => p.t === saved.t);
    if (i >= 0) disc.style.transform = `rotate(${-(i * step + step / 2)}deg)`;
    show(saved);
  }
  let turn = 0;
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    btn.disabled = true;
    const total = PRIZES.reduce((s, p) => s + p.w, 0);
    let r = Math.random() * total, i = 0;
    while ((r -= PRIZES[i].w) > 0) i++;
    const jitter = (Math.random() - .5) * step * .6;
    turn += 360 * 6 + (360 - (turn % 360)) - (i * step + step / 2) + jitter;
    disc.style.transform = `rotate(${turn}deg)`;
    const code = PRIZES[i].code + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const res = { t: PRIZES[i].t, code };
    setTimeout(() => {
      show(res);
      try { localStorage.setItem(KEY, JSON.stringify(res)); } catch (e) {}
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 5600);
  });
})();

