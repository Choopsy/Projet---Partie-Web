// ============================================================
//  CLUSTERS IA — Carte k-means
// ============================================================
let mapClusters;
const CLUSTER_COLORS = [
  "#2D6A4F","#D4A373","#1B4332","#E9C46A",
  "#40916C","#B7B7A4","#95D5B2","#A98467",
  "#52B788","#7F4F24","#5C8A66","#C97B57"
];

function initMapClusters() {
  mapClusters = L.map('map-clusters').setView([49.8489, 3.2876], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapClusters);
  renderClusters();
}

function renderClusters() {
  if (!mapClusters) return;

  // Supprimer les couches non-tuiles
  mapClusters.eachLayer(l => {
    if (l instanceof L.LayerGroup || l instanceof L.CircleMarker) mapClusters.removeLayer(l);
  });

  const k = document.getElementById('cluster-k').value;
  const numClusters = k === 'auto' ? 8 : parseInt(k);
  document.getElementById('cluster-count').textContent = numClusters;

  const trees = ALL_TREES.slice(0, 300);
  const groups = L.layerGroup().addTo(mapClusters);

  trees.forEach((t, i) => {
    const cluster = i % numClusters;
    const color = CLUSTER_COLORS[cluster];
    L.circleMarker([t.lat, t.lng], {
      radius: 5,
      fillColor: color,
      color: 'rgba(255,255,255,.3)',
      weight: 1,
      fillOpacity: .8,
    }).bindPopup(`<b>${t.espece}</b><br>Cluster ${cluster + 1}`)
      .addTo(groups);
  });

  // Légende
  const legend = document.getElementById('cluster-legend');
  legend.innerHTML = Array.from({ length: numClusters }, (_, i) => `
    <div class="cluster-chip">
      <div class="cluster-dot" style="background:${CLUSTER_COLORS[i]}"></div>
      Cluster ${i + 1}
    </div>
  `).join('');
}

// Initialisation au chargement de la page
window.addEventListener('load', () => {
  initMapClusters();
});
