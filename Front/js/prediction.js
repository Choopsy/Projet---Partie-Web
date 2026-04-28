// ============================================================
//  PRÉDICTION — Âge ou Déracinement
//  Onglet 1 : depuis la BDD (global_id)
//  Onglet 2 : saisie manuelle
// ============================================================
const API_BASE = '/Projet---Partie-Web/Front/php';

const params   = new URLSearchParams(window.location.search);
const globalId = params.get('global_id');
const typeUrl  = params.get('type');
const tabUrl   = params.get('tab'); // 'manuel' si depuis bouton saisie manuelle

let autoType   = typeUrl || '';
let manuelType = '';

const RISQUE_CONFIG = {
  'EN PLACE'    : { color: '#2D6A4F', width: '15%',  label: 'Faible'   },
  'REMPLACÉ'    : { color: '#E9C46A', width: '35%',  label: 'Modéré'   },
  'SUPPRIMÉ'    : { color: '#E9C46A', width: '35%',  label: 'Modéré'   },
  'ABATTU'      : { color: '#E9C46A', width: '35%',  label: 'Modéré'   },
  'Essouché'    : { color: '#F4A261', width: '70%',  label: 'Élevé'    },
  'Non essouché': { color: '#E63946', width: '100%', label: 'Critique' },
};

// ============================================================
//  INITIALISATION
// ============================================================
window.addEventListener('load', async () => {
  await loadReferentiels();

  // Si on arrive depuis "Saisie manuelle" → ouvre l'onglet manuel
  if (tabUrl === 'manuel') {
    switchTab('manuel');
    return;
  }

  // Si on arrive depuis le tableau avec un arbre sélectionné
  if (globalId && autoType) {
    switchTab('auto');
    setAutoType(autoType);

    document.getElementById('auto-arbre-info').innerHTML =
      `<strong>ID :</strong> <code style="font-family:'Space Mono',monospace">${globalId}</code>`;

    lancerPredictionAuto();
  }
});

// ============================================================
//  ONGLETS
// ============================================================
function switchTab(tab) {
  document.getElementById('tab-auto').classList.toggle('active', tab === 'auto');
  document.getElementById('tab-manuel').classList.toggle('active', tab === 'manuel');
  document.getElementById('tab-auto-btn').classList.toggle('active', tab === 'auto');
  document.getElementById('tab-manuel-btn').classList.toggle('active', tab === 'manuel');
}

// ============================================================
//  TYPE DE PRÉDICTION — ONGLET AUTO
// ============================================================
function setAutoType(type) {
  autoType = type;
  document.getElementById('auto-btn-age').classList.toggle('btn-primary', type === 'age');
  document.getElementById('auto-btn-age').classList.toggle('btn-outline', type !== 'age');
  document.getElementById('auto-btn-tempete').classList.toggle('btn-primary', type === 'tempete');
  document.getElementById('auto-btn-tempete').classList.toggle('btn-outline', type !== 'tempete');

  // Reset résultats et relance si un arbre est sélectionné
  resetZone('auto');

  if (globalId && type) {
    lancerPredictionAuto();
  }
}

// ============================================================
//  TYPE DE PRÉDICTION — ONGLET MANUEL
// ============================================================
function setManuelType(type) {
  manuelType = type;
  document.getElementById('manuel-btn-age').classList.toggle('btn-primary', type === 'age');
  document.getElementById('manuel-btn-age').classList.toggle('btn-outline', type !== 'age');
  document.getElementById('manuel-btn-tempete').classList.toggle('btn-primary', type === 'tempete');
  document.getElementById('manuel-btn-tempete').classList.toggle('btn-outline', type !== 'tempete');

  // Affiche/cache les champs supplémentaires tempête
  document.getElementById('champs-tempete').style.display = type === 'tempete' ? 'block' : 'none';

  // Active le bouton lancer
  document.getElementById('btn-lancer').disabled = false;

  // Reset résultats
  resetZone('manuel');
}

// ============================================================
//  CHARGEMENT DES RÉFÉRENTIELS
// ============================================================
async function loadReferentiels() {
  const routes = [
    { route: 'stades',    selectId: 'm-stade',    key: 'fk_stadedev' },
    { route: 'ports',     selectId: 'm-port',     key: 'fk_port'     },
    { route: 'pieds',     selectId: 'm-pied',     key: 'fk_pied'     },
    { route: 'situations',selectId: 'm-situation',key: 'fk_situation' },
    { route: 'feuillages',selectId: 'm-feuillage',key: 'feuillage'   },
  ];

  await Promise.all(routes.map(async ({ route, selectId, key }) => {
    try {
      const res  = await fetch(`${API_BASE}/referentiels.php?route=${route}`);
      const data = await res.json();
      const select = document.getElementById(selectId);
      select.innerHTML = '<option value="">— Choisir —</option>';
      data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = item[key];
        select.appendChild(opt);
      });
    } catch (e) {
      console.error(`Erreur chargement ${route}:`, e);
    }
  }));
}

// ============================================================
//  PRÉDICTION AUTO — depuis BDD
// ============================================================
async function lancerPredictionAuto() {
  if (!globalId || !autoType) return;

  showLoading('auto');

  try {
    const res  = await fetch(`${API_BASE}/predict.php?action=${autoType}`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ global_id: globalId })
    });
    const data = await res.json();

    hideLoading('auto');

    if (!res.ok || data.error) {
      showError('auto', data.error ?? 'Erreur serveur');
      return;
    }

    showResult('auto', data, autoType);

  } catch (err) {
    hideLoading('auto');
    showError('auto', 'Erreur de connexion au serveur.');
    console.error(err);
  }
}

// ============================================================
//  PRÉDICTION MANUELLE
// ============================================================
async function lancerPredictionManuelle() {
  if (!manuelType) {
    showToast('Veuillez choisir un type de prédiction.', true);
    return;
  }

  const hautTot   = parseFloat(document.getElementById('m-haut-tot').value);
  const hautTronc = parseFloat(document.getElementById('m-haut-tronc').value);
  const troncDiam = parseFloat(document.getElementById('m-tronc-diam').value);

  if (isNaN(hautTot) || isNaN(hautTronc) || isNaN(troncDiam)) {
    showToast('Veuillez remplir les 3 dimensions obligatoires.', true);
    return;
  }

  showLoading('manuel');

  let body = { manuel: true, haut_tot: hautTot, haut_tronc: hautTronc, tronc_diam: troncDiam };

  if (manuelType === 'tempete') {
    body = {
      ...body,
      age_estim    : parseFloat(document.getElementById('m-age').value)       || 0,
      fk_stadedev  : document.getElementById('m-stade').value                 || 'Inconnu',
      fk_port      : document.getElementById('m-port').value                  || 'Inconnu',
      fk_pied      : document.getElementById('m-pied').value                  || 'Inconnu',
      fk_situation : document.getElementById('m-situation').value             || 'Inconnu',
      feuillage    : document.getElementById('m-feuillage').value             || 'Inconnu',
      remarquable  : document.getElementById('m-remarquable').value,
      fk_revetement: document.getElementById('m-revetement').value,
    };
  }

  try {
    const res  = await fetch(`${API_BASE}/predict.php?action=${manuelType}`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(body)
    });
    const data = await res.json();

    hideLoading('manuel');

    if (!res.ok || data.error) {
      showError('manuel', data.error ?? 'Erreur serveur');
      return;
    }

    showResult('manuel', data, manuelType);

  } catch (err) {
    hideLoading('manuel');
    showError('manuel', 'Erreur de connexion au serveur.');
    console.error(err);
  }
}

// ============================================================
//  AFFICHAGE DES RÉSULTATS
// ============================================================
function showResult(zone, data, type) {
  const el = document.getElementById(`${zone}-result`);
  el.style.display = 'block';
  el.innerHTML     = buildResultHTML(data, type);

  // Animation barre de risque
  setTimeout(() => {
    const barre = document.getElementById('barre-risque');
    if (barre) barre.style.width = barre.dataset.width;
  }, 100);
}

function buildResultHTML(data, type) {
  if (type === 'age') {
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Âge estimé
          </div>
          <div class="card-desc">Estimation par régression à partir des dimensions</div>
        </div>
        <div class="card-content" style="text-align:center;padding:2.5rem;">
          <div style="font-size:5rem;font-weight:700;color:var(--primary);line-height:1;">${data.age_estime}</div>
          <div style="font-size:1.1rem;color:var(--muted-fg);margin-top:.75rem;">années estimées</div>
          <div style="margin-top:1.5rem;padding:1rem;background:var(--surface);border-radius:8px;font-size:.85rem;color:var(--muted-fg);">
            Basé sur le diamètre du tronc, la hauteur totale et la hauteur du tronc
          </div>
        </div>
      </div>
    `;
  } else {
    const config = RISQUE_CONFIG[data.etat] ?? { color: '#999', width: '50%', label: 'Inconnu' };
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>
            Risque de déracinement
          </div>
          <div class="card-desc">Prédiction par Random Forest</div>
        </div>
        <div class="card-content" style="padding:2rem;">
          <div style="text-align:center;margin-bottom:2rem;">
            <div style="font-size:.85rem;color:var(--muted-fg);margin-bottom:.5rem;">État prédit</div>
            <div style="font-size:2rem;font-weight:700;color:${config.color};">${data.etat}</div>
            <div style="font-size:1rem;color:var(--muted-fg);margin-top:.5rem;">${data.risque}</div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted-fg);margin-bottom:.4rem;">
              <span>Risque faible</span><span>Risque critique</span>
            </div>
            <div style="background:var(--border);border-radius:99px;height:14px;overflow:hidden;">
              <div
                id="barre-risque"
                data-width="${config.width}"
                style="height:100%;border-radius:99px;background:${config.color};width:0%;transition:width .8s ease;"
              ></div>
            </div>
            <div style="font-size:.9rem;font-weight:600;margin-top:.5rem;text-align:center;color:${config.color};">
              Niveau de risque : ${config.label}
            </div>
          </div>
          <div style="margin-top:1.5rem;padding:1rem;background:var(--surface);border-radius:8px;font-size:.85rem;color:var(--muted-fg);">
            Algorithme : Random Forest — entraîné sur le patrimoine arboré de Saint-Quentin
          </div>
        </div>
      </div>
    `;
  }
}

// ============================================================
//  UTILITAIRES
// ============================================================
function showLoading(zone) {
  document.getElementById(`${zone}-loading`).style.display = 'block';
  document.getElementById(`${zone}-result`).style.display  = 'none';
  document.getElementById(`${zone}-error`).style.display   = 'none';
}

function hideLoading(zone) {
  document.getElementById(`${zone}-loading`).style.display = 'none';
}

function showError(zone, msg) {
  document.getElementById(`${zone}-error`).style.display   = 'block';
  document.getElementById(`${zone}-error-msg`).textContent = msg;
}

function resetZone(zone) {
  document.getElementById(`${zone}-result`).style.display  = 'none';
  document.getElementById(`${zone}-error`).style.display   = 'none';
  document.getElementById(`${zone}-loading`).style.display = 'none';
}