// ============================================================
//  AJOUTER UN ARBRE — Carte & Formulaire
// ============================================================
let mapPicker, pickerMarker;
let pickedLat = 49.8489, pickedLng = 3.2876;

function initMapPicker() {
  mapPicker = L.map('map-picker').setView([49.8489, 3.2876], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapPicker);

  pickerMarker = L.marker([49.8489, 3.2876], { draggable: true }).addTo(mapPicker);

  mapPicker.on('click', e => {
    pickedLat = e.latlng.lat;
    pickedLng = e.latlng.lng;
    pickerMarker.setLatLng(e.latlng);
    updateCoordDisplay();
  });

  pickerMarker.on('dragend', e => {
    pickedLat = e.target.getLatLng().lat;
    pickedLng = e.target.getLatLng().lng;
    updateCoordDisplay();
  });
}

function updateCoordDisplay() {
  document.getElementById('coord-display').textContent =
    `📍 Lat: ${pickedLat.toFixed(5)} — Lng: ${pickedLng.toFixed(5)}`;
}

function submitForm(e) {
  e.preventDefault();
  const espece = document.getElementById('f-espece').value.trim();
  if (!espece) { showToast("Veuillez indiquer l'espèce.", true); return; }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Enregistrement…`;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Enregistrer l'arbre`;
    showToast(`✅ ${espece} ajouté avec succès au patrimoine !`);
    resetForm();
  }, 900);
}

function resetForm() {
  document.getElementById('form-ajouter').reset();
  updateCoordDisplay();
}

// Initialisation au chargement de la page
window.addEventListener('load', () => {
  initMapPicker();
});
