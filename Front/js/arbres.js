// ============================================================
//  VISUALISER — Carte & Tableau
// ============================================================
let mapArbres, markersLayer;

function getColor(tree) {
  if (tree.remarquable) return '#D4A373';
  return tree.feuillage === 'Conifère' ? '#7F4F24' : '#2D6A4F';
}

function initMapArbres() {
  mapArbres = L.map('map').setView([49.8489, 3.2876], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapArbres);
  markersLayer = L.layerGroup().addTo(mapArbres);
  renderMarkers(ALL_TREES);
}

function renderMarkers(trees) {
  markersLayer.clearLayers();
  trees.slice(0, 400).forEach(t => {
    L.circleMarker([t.lat, t.lng], {
      radius: t.remarquable ? 7 : 5,
      fillColor: getColor(t),
      color: 'rgba(255,255,255,.4)',
      weight: 1,
      fillOpacity: .75,
    }).bindPopup(
      `<b>${t.espece}</b><br>${t.feuillage} · ${t.quartier}<br>Hauteur: ${t.hauteur} m` +
      (t.remarquable ? ' <span style="color:#8B5E2D">⭐ Remarquable</span>' : '')
    ).addTo(markersLayer);
  });
}

function filterMap() {
  const search   = document.getElementById('search-trees').value.toLowerCase();
  const quartier = document.getElementById('filter-quartier').value;
  const feuillage = document.getElementById('filter-feuillage').value;

  const filtered = ALL_TREES.filter(t => {
    if (quartier  && t.quartier  !== quartier)  return false;
    if (feuillage && t.feuillage !== feuillage) return false;
    if (search && !t.espece.toLowerCase().includes(search) && !t.quartier.toLowerCase().includes(search)) return false;
    return true;
  });

  renderMarkers(filtered);
  document.getElementById('tree-count').textContent =
    `Affichage de ${Math.min(filtered.length, 400)} sur ${filtered.length} arbres filtrés`;
}

function buildTable(data) {
  const tbody = document.getElementById('tree-tbody');
  tbody.innerHTML = data.map(t => `
    <tr>
      <td><strong>${t.espece}</strong></td>
      <td><code style="font-family:'Space Mono',monospace;font-size:.8rem;color:var(--muted-fg)">${t.code}</code></td>
      <td><span class="badge ${t.feuillage === 'Conifère' ? 'badge-brown' : 'badge-green'}">${t.feuillage}</span></td>
      <td>${t.quartier}</td>
      <td>${t.hauteur}</td>
      <td>${t.remarquable
        ? '<span class="badge badge-amber">⭐ Remarquable</span>'
        : '<span style="color:var(--muted-fg)">Standard</span>'}</td>
    </tr>
  `).join('');
}

// Initialisation au chargement de la page
window.addEventListener('load', () => {
  initMapArbres();
  buildTable(TREES_SAMPLE);
});
