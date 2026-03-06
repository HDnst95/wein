'use strict';

/* ── State ──────────────────────────────────────────────────── */
let wines = [];
let activeType = 'all';
let searchQuery = '';
let currentRating = 0;
let deleteTargetId = null;

/* ── DOM refs ───────────────────────────────────────────────── */
const grid        = document.getElementById('wine-grid');
const emptyState  = document.getElementById('empty-state');
const overlay     = document.getElementById('modal-overlay');
const deleteOverlay = document.getElementById('delete-overlay');
const form        = document.getElementById('wine-form');
const modalTitle  = document.getElementById('modal-title');
const statTotal   = document.getElementById('stat-total');
const statTypes   = document.getElementById('stat-types');
const stars       = document.querySelectorAll('.star');

/* ── API helpers ────────────────────────────────────────────── */
async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Fehler');
  return data;
}

/* ── Load & render ──────────────────────────────────────────── */
async function loadWines() {
  const q = searchQuery.trim();
  const url = q ? `/api/wines?q=${encodeURIComponent(q)}` : '/api/wines';
  wines = await api(url);
  renderGrid();
}

function renderGrid() {
  const filtered = activeType === 'all'
    ? wines
    : wines.filter(w => w.type === activeType);

  // Remove existing cards (keep empty-state element)
  Array.from(grid.querySelectorAll('.wine-card')).forEach(el => el.remove());

  if (filtered.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    filtered.forEach(w => grid.appendChild(createCard(w)));
  }

  updateStats(filtered);
}

function updateStats(visible) {
  const total = visible.reduce((s, w) => s + (w.quantity || 0), 0);
  statTotal.textContent = `${total} Flasche${total !== 1 ? 'n' : ''}`;

  const typeCounts = {};
  visible.forEach(w => { typeCounts[w.type] = (typeCounts[w.type] || 0) + w.quantity; });
  statTypes.textContent = Object.entries(typeCounts)
    .map(([t, c]) => `${typeEmoji(t)} ${c}`)
    .join('  ·  ');
}

function typeEmoji(type) {
  const map = { Rotwein: '🍷', Weißwein: '🥂', Rosé: '🌸', Sekt: '✨', Dessert: '🍯' };
  return map[type] || '🍾';
}

function starsHtml(rating) {
  if (!rating) return '';
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function createCard(w) {
  const card = document.createElement('article');
  card.className = 'wine-card';
  card.dataset.id = w.id;

  const meta = [w.grape, w.region, w.country].filter(Boolean).join(' · ');
  const price = w.price != null ? `${Number(w.price).toFixed(2)} €` : '';

  card.innerHTML = `
    <div class="wine-card__stripe wine-card__stripe--${w.type}"></div>
    <div class="wine-card__body">
      <div class="wine-card__top">
        <span class="wine-card__name">${esc(w.name)}</span>
        ${w.year ? `<span class="wine-card__year">${w.year}</span>` : ''}
      </div>
      <span class="wine-card__badge">${typeEmoji(w.type)} ${esc(w.type)}</span>
      ${meta ? `<div class="wine-card__meta">${esc(meta)}</div>` : ''}
      ${w.rating ? `<div class="wine-card__stars">${starsHtml(w.rating)}</div>` : ''}
      ${price ? `<div class="wine-card__meta">${price}</div>` : ''}
      ${w.notes ? `<div class="wine-card__notes">${esc(w.notes)}</div>` : ''}
    </div>
    <div class="wine-card__footer">
      <div class="quantity-ctrl">
        <button class="qty-btn" data-action="dec" aria-label="Weniger">−</button>
        <span class="qty-val ${w.quantity === 0 ? 'qty-0' : ''}">${w.quantity}</span>
        <button class="qty-btn" data-action="inc" aria-label="Mehr">+</button>
      </div>
      <div class="card-actions">
        <button class="icon-btn" data-action="edit" aria-label="Bearbeiten" title="Bearbeiten">✏️</button>
        <button class="icon-btn icon-btn--delete" data-action="delete" aria-label="Löschen" title="Löschen">🗑️</button>
      </div>
    </div>
  `;
  return card;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Event delegation on grid ───────────────────────────────── */
grid.addEventListener('click', async e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const card = btn.closest('.wine-card');
  const id   = card?.dataset.id;
  const action = btn.dataset.action;

  if (action === 'edit') {
    const wine = wines.find(w => String(w.id) === id);
    if (wine) openModal(wine);
  }

  if (action === 'delete') {
    const wine = wines.find(w => String(w.id) === id);
    if (wine) openDeleteConfirm(wine);
  }

  if (action === 'inc' || action === 'dec') {
    const delta = action === 'inc' ? 1 : -1;
    try {
      const updated = await api(`/api/wines/${id}/quantity`, {
        method: 'PATCH',
        body: JSON.stringify({ delta }),
      });
      // Update local state and re-render
      const idx = wines.findIndex(w => String(w.id) === id);
      if (idx !== -1) { wines[idx] = updated; renderGrid(); }
    } catch (err) {
      toast(err.message, 'error');
    }
  }
});

/* ── Modal ──────────────────────────────────────────────────── */
function openModal(wine = null) {
  currentRating = wine?.rating || 0;
  document.getElementById('wine-id').value   = wine?.id ?? '';
  document.getElementById('f-name').value    = wine?.name ?? '';
  document.getElementById('f-year').value    = wine?.year ?? '';
  document.getElementById('f-type').value    = wine?.type ?? 'Rotwein';
  document.getElementById('f-grape').value   = wine?.grape ?? '';
  document.getElementById('f-region').value  = wine?.region ?? '';
  document.getElementById('f-country').value = wine?.country ?? '';
  document.getElementById('f-quantity').value = wine?.quantity ?? 1;
  document.getElementById('f-price').value   = wine?.price ?? '';
  document.getElementById('f-notes').value   = wine?.notes ?? '';
  document.getElementById('f-rating').value  = currentRating;
  modalTitle.textContent = wine ? 'Wein bearbeiten' : 'Wein hinzufügen';
  renderStars(currentRating);
  document.getElementById('f-name').classList.remove('invalid');
  overlay.hidden = false;
  document.getElementById('f-name').focus();
}

function closeModal() { overlay.hidden = true; }

document.getElementById('btn-add').addEventListener('click', () => openModal());
document.getElementById('btn-add-empty').addEventListener('click', () => openModal());
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!overlay.hidden) closeModal();
    if (!deleteOverlay.hidden) closeDeleteConfirm();
  }
});

/* ── Star rating ────────────────────────────────────────────── */
function renderStars(value) {
  stars.forEach(s => {
    s.classList.toggle('active', Number(s.dataset.value) <= value);
  });
}

stars.forEach(star => {
  star.addEventListener('click', () => {
    const val = Number(star.dataset.value);
    currentRating = currentRating === val ? 0 : val; // toggle off on re-click
    document.getElementById('f-rating').value = currentRating;
    renderStars(currentRating);
  });
  star.addEventListener('mouseover', () => renderStars(Number(star.dataset.value)));
  star.addEventListener('mouseout',  () => renderStars(currentRating));
});

/* ── Form submit ────────────────────────────────────────────── */
form.addEventListener('submit', async e => {
  e.preventDefault();
  const nameEl = document.getElementById('f-name');
  if (!nameEl.value.trim()) {
    nameEl.classList.add('invalid');
    nameEl.focus();
    return;
  }
  nameEl.classList.remove('invalid');

  const id = document.getElementById('wine-id').value;
  const payload = {
    name:     document.getElementById('f-name').value.trim(),
    year:     document.getElementById('f-year').value ? Number(document.getElementById('f-year').value) : null,
    type:     document.getElementById('f-type').value,
    grape:    document.getElementById('f-grape').value.trim() || null,
    region:   document.getElementById('f-region').value.trim() || null,
    country:  document.getElementById('f-country').value.trim() || null,
    quantity: Number(document.getElementById('f-quantity').value) || 0,
    price:    document.getElementById('f-price').value ? Number(document.getElementById('f-price').value) : null,
    rating:   Number(document.getElementById('f-rating').value) || null,
    notes:    document.getElementById('f-notes').value.trim() || null,
  };

  try {
    if (id) {
      const updated = await api(`/api/wines/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      const idx = wines.findIndex(w => String(w.id) === id);
      if (idx !== -1) wines[idx] = updated;
    } else {
      const created = await api('/api/wines', { method: 'POST', body: JSON.stringify(payload) });
      wines.push(created);
    }
    closeModal();
    renderGrid();
    toast(id ? 'Wein aktualisiert ✓' : 'Wein hinzugefügt ✓');
  } catch (err) {
    toast(err.message, 'error');
  }
});

/* ── Delete confirm ─────────────────────────────────────────── */
function openDeleteConfirm(wine) {
  deleteTargetId = wine.id;
  document.getElementById('delete-msg').textContent =
    `Möchtest du „${wine.name}" wirklich aus dem Regal entfernen?`;
  deleteOverlay.hidden = false;
}
function closeDeleteConfirm() { deleteOverlay.hidden = true; deleteTargetId = null; }

document.getElementById('delete-confirm').addEventListener('click', async () => {
  if (!deleteTargetId) return;
  try {
    await api(`/api/wines/${deleteTargetId}`, { method: 'DELETE' });
    wines = wines.filter(w => w.id !== deleteTargetId);
    closeDeleteConfirm();
    renderGrid();
    toast('Wein gelöscht');
  } catch (err) {
    toast(err.message, 'error');
  }
});
document.getElementById('delete-cancel').addEventListener('click', closeDeleteConfirm);
document.getElementById('delete-cancel-x').addEventListener('click', closeDeleteConfirm);
deleteOverlay.addEventListener('click', e => { if (e.target === deleteOverlay) closeDeleteConfirm(); });

/* ── Search ─────────────────────────────────────────────────── */
let searchTimer;
document.getElementById('search').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchQuery = e.target.value;
  searchTimer = setTimeout(loadWines, 300);
});

/* ── Type filter ────────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeType = btn.dataset.type;
    renderGrid();
  });
});

/* ── Toast ──────────────────────────────────────────────────── */
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  if (type === 'error') el.style.background = '#c0392b';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* ── Init ───────────────────────────────────────────────────── */
loadWines();
