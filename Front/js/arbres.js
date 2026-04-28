// ============================================================
//  VISUALISER — Carte & Tableau (données réelles depuis PHP)
// ============================================================
const API_BASE = '/Projet---Partie-Web/Front/php';

let mapArbres, markersLayer;

function getColor(tree) {
  if (tree.remarquable == 1) return '#D4A373';
  return tree.feuillage === 'Conifère' ? '#7F4F24' : '#2D6A4F';
}

// ============================================================
//  CARTE
// ============================================================
function initMapArbres() {
  mapArbres = L.map('map').setView([49.8489, 3.2876], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapArbres);
  markersLayer = L.layerGroup().addTo(mapArbres);
}

function renderMarkers(trees) {
  markersLayer.clearLayers();
  trees.forEach(t => {
    if (!t.x || !t.y) return;
    L.circleMarker([t.y, t.x], {
      radius     : t.remarquable == 1 ? 7 : 5,
      fillColor  : getColor(t),
      color      : 'rgba(255,255,255,.4)',
      weight     : 1,
      fillOpacity: .75,
    }).bindPopup(`
      <b>${t.nom_technique ?? 'Espèce inconnue'}</b><br>
      ${t.feuillage ?? ''} · ${t.quartier ?? ''}<br>
      Hauteur: ${t.haut_tot ?? '?'} m
      ${t.remarquable == 1 ? ' <span style="color:#8B5E2D">Remarquable</span>' : ''}
    `).addTo(markersLayer);
  });
}

// ============================================================
//  FILTRES
// ============================================================
let ALL_TREES_DB = [];

function filterMap() {
  const search    = document.getElementById('search-trees').value.toLowerCase();
  const quartier  = document.getElementById('filter-quartier').value;
  const feuillage = document.getElementById('filter-feuillage').value;

  const filtered = ALL_TREES_DB.filter(t => {
    if (quartier  && t.quartier  !== quartier)  return false;
    if (feuillage && t.feuillage !== feuillage) return false;
    if (search &&
        !t.nom_technique?.toLowerCase().includes(search) &&
        !t.quartier?.toLowerCase().includes(search)) return false;
    return true;
  });

  renderMarkers(filtered);
  buildTable(filtered);
  document.getElementById('tree-count').textContent =
    `Affichage de ${filtered.length} arbre(s) filtré(s)`;
}

// ============================================================
//  TABLEAU
// ============================================================
function buildTable(data) {
  const tbody = document.getElementById('tree-tbody');
  tbody.innerHTML = data.length === 0
    ? `<tr><td colspan="12" style="text-align:center;color:var(--muted-fg);padding:2rem;">Aucun arbre trouvé</td></tr>`
    : data.map(t => `
        <tr>
          <td style="text-align:center;">
            <input type="radio" name="selected-tree" value="${t.global_id}" />
          </td>
          <td><strong>${t.nom_technique ?? '—'}</strong></td>
          <td>${t.haut_tot ?? '—'}</td>
          <td>${t.haut_tronc ?? '—'}</td>
          <td>${t.tronc_diam ?? '—'}</td>
          <td style="text-align:center;">
            ${t.remarquable == 1
              ? '<span class="badge badge-amber">Oui</span>'
              : '<span style="color:var(--muted-fg)">Non</span>'
            }
          </td>
          <td><code style="font-size:.78rem;color:var(--muted-fg)">${t.y ?? '—'}</code></td>
          <td><code style="font-size:.78rem;color:var(--muted-fg)">${t.x ?? '—'}</code></td>
          <td>${t.etat ?? '—'}</td>
          <td>${t.stade_developpement ?? '—'}</td>
          <td>${t.port ?? '—'}</td>
          <td>${t.pied ?? '—'}</td>
        </tr>
      `).join('');
}

// ============================================================
//  PRÉDICTION — Redirige vers prediction.html
// ============================================================
function predire(type) {
  if (type === 'options') {
    // Saisie manuelle — ouvre l'onglet manuel directement
    window.location.href = 'prediction.html?tab=manuel';
    return;
  }

  const selected = document.querySelector('input[name="selected-tree"]:checked');
  if (!selected) {
    showToast('❌ Veuillez sélectionner un arbre dans le tableau.', true);
    return;
  }
  const globalId = selected.value;
  window.location.href = `prediction.html?global_id=${encodeURIComponent(globalId)}&type=${type}`;
}

// ============================================================
//  CHARGEMENT DES QUARTIERS POUR LE FILTRE
// ============================================================
async function loadQuartiers() {
  try {
    const res  = await fetch(`${API_BASE}/referentiels.php?route=quartiers`);
    const data = await res.json();
    const select = document.getElementById('filter-quartier');
    select.innerHTML = '<option value="">Tous les quartiers</option>';
    data.forEach(q => {
      const opt = document.createElement('option');
      opt.value       = q.Quartier;
      opt.textContent = q.Quartier;
      select.appendChild(opt);
    });
  } catch (e) {
    console.error('Erreur chargement quartiers:', e);
  }
}

// ============================================================
//  CHARGEMENT DES DONNÉES DEPUIS PHP
// ============================================================
async function loadArbres() {
  try {
    const res = await fetch(`${API_BASE}/arbres.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    ALL_TREES_DB = data;
    renderMarkers(data);
    buildTable(data);

    document.getElementById('tree-count').textContent =
      `Affichage de ${data.length} arbre(s) en base`;

  } catch (err) {
    console.error('Erreur chargement arbres:', err);
    document.getElementById('tree-count').textContent = 'Erreur de chargement';
  }
}

// ============================================================
//  INITIALISATION
// ============================================================
window.addEventListener('load', () => {
  initMapArbres();
  loadQuartiers();
  loadArbres();

  document.getElementById('btn-plus-options').addEventListener('click', () => predire('options'));
  document.getElementById('btn-predire-age').addEventListener('click', () => predire('age'));
  document.getElementById('btn-predire-tempete').addEventListener('click', () => predire('tempete'));
});