// ============================================================
//  AJOUTER UN ARBRE — Carte & Formulaire
// ============================================================
const API_BASE = '/Projet---Partie-Web/Front/php';

let mapPicker, pickerMarker;
let pickedLat = 49.8489, pickedLng = 3.2876;

// ============================================================
//  CARTE
// ============================================================
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

// ============================================================
//  CHARGEMENT DES RÉFÉRENTIELS DEPUIS PHP
// ============================================================
async function loadReferentiel(route, selectId, valueKey, labelKey) {
  try {
    const res = await fetch(`${API_BASE}/referentiels.php?route=${route}`);
    const data = await res.json();
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">— Choisir —</option>';
    data.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item[valueKey];
      opt.textContent = item[labelKey];
      select.appendChild(opt);
    });
  } catch (e) {
    console.error(`Erreur chargement ${route}:`, e);
  }
}

async function loadAllReferentiels() {
  await Promise.all([
    loadReferentiel('etats',    'f-etat',      'id', 'fk_arb_etat'),
    loadReferentiel('feuillages','f-feuillage', 'id', 'feuillage'),
    loadReferentiel('stades',   'f-stade',     'id', 'fk_stadedev'),
    loadReferentiel('ports',    'f-port',      'id', 'fk_port'),
    loadReferentiel('pieds',    'f-pied',      'id', 'fk_pied'),
    loadReferentiel('situations','f-situation', 'id', 'fk_situation'),
    loadReferentiel('quartiers','f-quartier',  'id', 'Quartier'),
    loadReferentiel('nomstechniques','f-nomtech','id', 'fk_nomtech'),
  ]);
}

// ============================================================
//  SOUMISSION DU FORMULAIRE
// ============================================================
async function submitForm(e) {
  e.preventDefault();

  const nomtech = document.getElementById('f-nomtech').value;
  if (!nomtech) { showToast("Veuillez indiquer l'espèce.", true); return; }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Enregistrement…`;

  const payload = {
    x:                      pickedLng,
    y:                      pickedLat,
    haut_tot:               parseInt(document.getElementById('f-hauteur').value) || 0,
    haut_tronc:             parseFloat(document.getElementById('f-htronc').value) || 0,
    tronc_diam:             parseInt(document.getElementById('f-diametre').value) || 0,
    dte_plantation:         document.getElementById('f-plantation')?.value || null,
    id_Etat:                parseInt(document.getElementById('f-etat').value) || null,
    id_Feuillage:           parseInt(document.getElementById('f-feuillage').value) || null,
    id_Nom_technique:       parseInt(document.getElementById('f-nomtech').value) || null,
    id_Port:                parseInt(document.getElementById('f-port').value) || null,
    id_Pied:                parseInt(document.getElementById('f-pied').value) || null,
    id_Situation:           parseInt(document.getElementById('f-situation').value) || null,
    id_remarquable:         document.getElementById('f-remarquable').checked ? 2 : 1,
    id_Stade_developpement: parseInt(document.getElementById('f-stade').value) || null,
    id_Secteur:             parseInt(document.getElementById('f-quartier').value) || null,
  };

  try {
    const res = await fetch(`${API_BASE}/arbres.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok) {
      showToast(`✅ Arbre ajouté avec succès ! ID : ${result.global_id}`);
      resetForm();
    } else {
      showToast(`❌ Erreur : ${result.error}`, true);
    }
  } catch (err) {
    showToast('❌ Erreur de connexion au serveur.', true);
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Enregistrer l'arbre`;
  }
}

function resetForm() {
  document.getElementById('form-ajouter').reset();
  updateCoordDisplay();
}

// ============================================================
//  INITIALISATION
// ============================================================
window.addEventListener('load', () => {
  initMapPicker();
  loadAllReferentiels();
});