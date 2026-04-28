// ============================================================
//  CLUSTERS IA — Prédiction K-Means depuis PHP
// ============================================================
const API_BASE = '/Projet---Partie-Web/Front/php';

let mapClusters;
let mapInitialized = false;

const CLUSTER_COLORS = [
  "#2D6A4F", "#D4A373", "#1B4332",
  "#E9C46A", "#40916C", "#A98467",
];

// ============================================================
//  INITIALISATION CARTE
// ============================================================
function initMapClusters() {
  if (mapInitialized) return;
  mapClusters = L.map('map-clusters').setView([49.8489, 3.2876], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapClusters);
  mapInitialized = true;
}

// ============================================================
//  LANCER LA PRÉDICTION
// ============================================================
window.addEventListener('load', () => {
  document.getElementById('btn-predire').addEventListener('click', lancerPrediction);
});

async function lancerPrediction() {
  const k = document.getElementById('cluster-k').value;

  // Affiche le loading, cache la carte
  document.getElementById('clusters-loading').style.display = 'block';
  document.getElementById('map-clusters').style.display     = 'none';
  document.getElementById('cluster-legend').innerHTML       = '';
  document.getElementById('cluster-count').textContent      = '—';
  document.getElementById('arbres-count').textContent       = '—';

  try {
    const res = await fetch(`${API_BASE}/predict.php?action=cluster`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ k: parseInt(k) })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    // Affiche la carte
    document.getElementById('map-clusters').style.display = 'block';
    document.getElementById('clusters-loading').style.display = 'none';

    initMapClusters();
    renderClusters(data, parseInt(k));

  } catch (err) {
    document.getElementById('clusters-loading').style.display = 'none';
    showToast('❌ Erreur : ' + err.message, true);
    console.error(err);
  }
}

// ============================================================
//  AFFICHAGE DES CLUSTERS SUR LA CARTE
// ============================================================
function renderClusters(data, k) {
  // Nettoie les anciens marqueurs
  mapClusters.eachLayer(l => {
    if (l instanceof L.CircleMarker) mapClusters.removeLayer(l);
  });

  // Groupes par cluster pour la légende
  const groupes = {};

  data.forEach(t => {
    if (!t.x || !t.y) return;

    const color = CLUSTER_COLORS[t.cluster % CLUSTER_COLORS.length];

    L.circleMarker([t.y, t.x], {
      radius     : 6,
      fillColor  : color,
      color      : 'rgba(255,255,255,.3)',
      weight     : 1,
      fillOpacity: .85,
    }).bindPopup(`
      <b>${t.global_id}</b><br>
      Cluster : <b>${t.cluster + 1}</b><br>
      Catégorie : <b>${t.categorie}</b>
    `).addTo(mapClusters);

    if (!groupes[t.cluster]) {
      groupes[t.cluster] = { categorie: t.categorie, count: 0 };
    }
    groupes[t.cluster].count++;
  });

  // Stats
  document.getElementById('cluster-count').textContent = k;
  document.getElementById('arbres-count').textContent  = data.length;

  // Légende
  const legend = document.getElementById('cluster-legend');
  legend.innerHTML = Object.entries(groupes).map(([id, g]) => `
    <div class="cluster-chip">
      <div class="cluster-dot" style="background:${CLUSTER_COLORS[id % CLUSTER_COLORS.length]}"></div>
      Cluster ${parseInt(id) + 1} — ${g.categorie} (${g.count} arbres)
    </div>
  `).join('');
}

// ============================================================
//  INITIALISATION
// ============================================================
window.addEventListener('load', () => {
  // La carte se lance uniquement quand on clique sur "Prédire"
});