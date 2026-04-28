// ============================================================
//  PRÉDICTION — Âge ou Déracinement
//  Onglet 1 : depuis la BDD (global_id)
//  Onglet 2 : saisie manuelle
// ============================================================
const API_BASE = '/Projet---Partie-Web/Front/php';

const params   = new URLSearchParams(window.location.search);
const globalId = params.get('global_id');
const typeUrl  = params.get('type');

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

  // Si on arrive depuis le tableau avec un global_id
  if (globalId && autoType) {
    switchTab('auto');
    setAutoType(autoType);

    // Affiche l'info de l'arbre
    document.getElementById('auto-arbre-info').innerHTML =
      `<strong>ID :</strong> <code style="font-family:'Space Mono',monospace">${globalId}</code>`;

    // Lance la prédiction directement
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
  document.getElementById('auto-btn-tempete').classList.toggle('btn-primary', type === 'tempete');
  document.getElementById('auto-btn-tempete').classList.toggle('btn-outline', type !== 'tempete');

  // Reset résultats
  document.getElementById('auto-result').style.display = 'none';
  document.getElementById('auto-error').style.display  = 'none';
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
  document.getElementById('manuel-result').style.display = 'none';
  document.getElementById('manuel-error').style.display  = 'none';
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
  if (!globalId) {
    document.getElementById('auto-error').style.display   = 'block';
    document.getElementById('auto-error-msg').textContent = 'Aucun arbre sélectionné.';
    return;
  }
  if (!autoType) {
    showToast('❌ Veuillez choisir un type de prédiction.', true);
    return;
  }

  document.getElementById('auto-loading').style.display = 'block';
  document.getElementById('auto-result').style.display  = 'none';
  document.getElementById('auto-error').style.display   = 'none';

  try {
    const res  = await fetch(`${API_BASE}/predict.php?action=${autoType}`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ global_id: globalId })
    });
    const data = await res.json();

    document.getElementById('auto-loading').style.display = 'none';

    if (!res.ok || data.error) {
      document.getElementById('auto-error').style.display   = 'block';
      document.getElementById('auto-error-msg').textContent = data.error ?? 'Erreur serveur';
      return;
    }

    document.getElementById('auto-result').style.display   = 'block';
    document.getElementById('auto-result').innerHTML       = buildResultHTML(data, autoType);
    animateBarre();

  } catch (err) {
    document.getElementById('auto-loading').style.display = 'none';
    document.getElementById('auto-error').style.display   = 'block';
    document.getElementById('auto-error-msg').textContent = 'Erreur de connexion au serveur.';
  }
}

// ============================================================
//  PRÉDICTION MANUELLE
// ============================================================
async function lancerPredictionManuelle() {
  if (!manuelType) {
    showToast('❌ Veuillez choisir un type de prédiction.', true);
    return;
  }

  const hautTot   = parseFloat(document.getElementById('m-haut-tot').value);
  const hautTronc = parseFloat(document.getElementById('m-haut-tronc').value);
  const troncDiam = parseFloat(document.getElementById('m-tronc-diam').value);

  if (isNaN(hautTot) || isNaN(hautTronc) || isNaN(troncDiam)) {
    showToast('❌ Veuillez remplir les 3 dimensions obligatoires.', true);
    return;
  }

  document.getElementById('manuel-loading').style.display = 'block';
  document.getElementById('manuel-result').style.display  = 'none';
  document.getElementById('manuel-error').style.display   = 'none';

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

    document.getElementById('manuel-loading').style.display = 'none';

    if (!res.ok || data.error) {
      document.getElementById('manuel-error').style.display   = 'block';
      document.getElementById('manuel-error-msg').textContent = data.error ?? 'Erreur serveur';
      return;
    }

    document.getElementById('manuel-result').style.display = 'block';
    document.getElementById('manuel-result').innerHTML     = buildResultHTML(data, manuelType);
    animateBarre();

  } catch (err) {
    document.getElementById('manuel-loading').style.display = 'none';
    document.getElementById('manuel-error').style.display   = 'block';
    document.getElementById('manuel-error-msg').textContent = 'Erreur de connexion au serveur.';
  }
}

// ============================================================
//  CONSTRUCTION DU HTML RÉSULTAT
// ============================================================
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
              <div id="barre-risque" style="height:100%;border-radius:99px;background:${config.color};width:0%;transition:width .8s ease;"></div>
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
//  ANIMATION BARRE DE RISQUE
// ============================================================
function animateBarre() {
  setTimeout(() => {
    const barre = document.getElementById('barre-risque');
    if (barre) {
      const target = barre.style.background;
      const config = Object.values(RISQUE_CONFIG).find(c => c.color === target);
      if (config) barre.style.width = config.width;
      // fallback : lit data-width si on en avait mis
      else barre.style.width = barre.dataset.width ?? '50%';
    }
  }, 100);
}