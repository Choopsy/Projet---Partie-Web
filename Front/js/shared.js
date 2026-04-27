// ============================================================
//  DONNÉES PARTAGÉES
// ============================================================
const QUARTIERS_DATA = [
  {quartier:"Centre-Ville", count:1842},
  {quartier:"Europe", count:1423},
  {quartier:"Faubourg d'Isle", count:1187},
  {quartier:"Vermandois", count:952},
  {quartier:"Les Champs-Elysées", count:887},
  {quartier:"Marcellin Berthelot", count:743},
  {quartier:"Saint-Martin", count:612},
  {quartier:"Gay-Lussac", count:589},
  {quartier:"Neuville", count:487},
  {quartier:"Remicourt", count:403},
];

const SPECIES_DATA = [
  {espece:"Platane", count:1240},
  {espece:"Tilleul", count:987},
  {espece:"Érable", count:854},
  {espece:"Chêne", count:742},
  {espece:"Frêne", count:623},
  {espece:"Marronnier", count:512},
  {espece:"Orme", count:421},
  {espece:"Hêtre", count:387},
];

const TREES_SAMPLE = [
  {espece:"Platane commun",code:"PLAO",feuillage:"Feuillu",quartier:"Centre-Ville",hauteur:12.5,remarquable:false},
  {espece:"Tilleul à grandes feuilles",code:"TIGR",feuillage:"Feuillu",quartier:"Europe",hauteur:9.0,remarquable:true},
  {espece:"Érable sycomore",code:"ACPS",feuillage:"Feuillu",quartier:"Faubourg d'Isle",hauteur:11.0,remarquable:false},
  {espece:"Chêne pédonculé",code:"QURO",feuillage:"Feuillu",quartier:"Vermandois",hauteur:15.5,remarquable:true},
  {espece:"Épicéa commun",code:"PIAB",feuillage:"Conifère",quartier:"Europe",hauteur:18.0,remarquable:false},
  {espece:"Pin sylvestre",code:"PISY",feuillage:"Conifère",quartier:"Les Champs-Elysées",hauteur:16.0,remarquable:false},
  {espece:"Frêne commun",code:"FREX",feuillage:"Feuillu",quartier:"Saint-Martin",hauteur:10.5,remarquable:false},
  {espece:"Marronnier d'Inde",code:"AEHP",feuillage:"Feuillu",quartier:"Centre-Ville",hauteur:13.0,remarquable:true},
  {espece:"Orme champêtre",code:"ULMI",feuillage:"Feuillu",quartier:"Marcellin Berthelot",hauteur:8.0,remarquable:false},
  {espece:"Hêtre commun",code:"FAGY",feuillage:"Feuillu",quartier:"Neuville",hauteur:14.0,remarquable:true},
  {espece:"Bouleau verruqueux",code:"BEPE",feuillage:"Feuillu",quartier:"Remicourt",hauteur:7.5,remarquable:false},
  {espece:"Pin noir",code:"PINE",feuillage:"Conifère",quartier:"Gay-Lussac",hauteur:12.0,remarquable:false},
  {espece:"Cerisier tardif",code:"PRSE",feuillage:"Feuillu",quartier:"Europe",hauteur:6.5,remarquable:false},
  {espece:"Charme commun",code:"CABE",feuillage:"Feuillu",quartier:"Vermandois",hauteur:9.5,remarquable:false},
  {espece:"Mélèze d'Europe",code:"LADE",feuillage:"Conifère",quartier:"Centre-Ville",hauteur:20.0,remarquable:true},
  {espece:"Robinier faux-acacia",code:"ROPY",feuillage:"Feuillu",quartier:"Saint-Martin",hauteur:11.5,remarquable:false},
  {espece:"Saule blanc",code:"SAAL",feuillage:"Feuillu",quartier:"Faubourg d'Isle",hauteur:8.5,remarquable:false},
  {espece:"Aulne glutineux",code:"ALGL",feuillage:"Feuillu",quartier:"Marcellin Berthelot",hauteur:7.0,remarquable:false},
  {espece:"Thuya géant",code:"THPL",feuillage:"Conifère",quartier:"Les Champs-Elysées",hauteur:14.5,remarquable:false},
  {espece:"Liquidambar",code:"LIST",feuillage:"Feuillu",quartier:"Centre-Ville",hauteur:10.0,remarquable:true},
];

// Génération de points fictifs autour de Saint-Quentin
function generateTreePoints(n) {
  const trees = [];
  const center = [49.8489, 3.2876];
  const feuillages = ["Feuillu","Feuillu","Feuillu","Conifère"];
  const especes = ["Platane","Tilleul","Érable","Chêne","Frêne","Marronnier","Pin","Épicéa","Bouleau","Orme"];
  const quartiers = ["Centre-Ville","Europe","Faubourg d'Isle","Vermandois","Les Champs-Elysées","Saint-Martin"];
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.random() * 0.035;
    trees.push({
      lat: center[0] + r * Math.cos(angle),
      lng: center[1] + r * Math.sin(angle) * 1.4,
      feuillage: feuillages[Math.floor(Math.random() * feuillages.length)],
      espece: especes[Math.floor(Math.random() * especes.length)],
      quartier: quartiers[Math.floor(Math.random() * quartiers.length)],
      remarquable: Math.random() < 0.04,
      hauteur: (4 + Math.random() * 18).toFixed(1),
    });
  }
  return trees;
}

const ALL_TREES = generateTreePoints(500);

// ============================================================
//  UTILITAIRES
// ============================================================
function showToast(msg, error) {
  const t = document.createElement('div');
  t.className = 'toast';
  if (error) t.style.background = 'hsl(10,50%,40%)';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity .3s';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

function toggleMobileNav() {
  document.getElementById('main-nav').classList.toggle('open');
}

// Animation spin pour le bouton de chargement
const spinStyle = document.createElement('style');
spinStyle.textContent = `.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);
