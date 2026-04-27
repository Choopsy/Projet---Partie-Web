// ============================================================
//  ACCUEIL — Graphiques
// ============================================================
window.addEventListener('load', () => {

  // Graphique par quartier (barres horizontales)
  new Chart(document.getElementById('chartQuartier'), {
    type: 'bar',
    data: {
      labels: QUARTIERS_DATA.map(d => d.quartier),
      datasets: [{
        data: QUARTIERS_DATA.map(d => d.count),
        backgroundColor: QUARTIERS_DATA.map((_, i) => `rgba(45,106,79,${1 - i * 0.07})`),
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { family: 'Outfit', size: 11 } }, grid: { color: 'rgba(0,0,0,.04)' } },
        y: { ticks: { font: { family: 'Outfit', size: 10 } }, grid: { display: false } }
      },
      animation: { duration: 800 }
    }
  });

  // Graphique par espèce (barres verticales)
  new Chart(document.getElementById('chartSpecies'), {
    type: 'bar',
    data: {
      labels: SPECIES_DATA.map(d => d.espece),
      datasets: [{
        data: SPECIES_DATA.map(d => d.count),
        backgroundColor: SPECIES_DATA.map((_, i) => `rgba(82,183,136,${1 - i * 0.08})`),
        borderRadius: [4, 4, 0, 0],
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { family: 'Outfit', size: 10 }, maxRotation: 30, minRotation: 20 }, grid: { display: false } },
        y: { ticks: { font: { family: 'Outfit', size: 11 } }, grid: { color: 'rgba(0,0,0,.04)' } }
      },
      animation: { duration: 800 }
    }
  });

});
