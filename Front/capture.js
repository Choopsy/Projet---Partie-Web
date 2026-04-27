const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Liste de tes fichiers à capturer
  const pagesToCapture = [
    { name: 'index', url: `file:${path.join(__dirname, 'index.html')}` },
    { name: 'carte', url: `file:${path.join(__dirname, 'arbres.html')}` },
    { name: 'prediction', url: `file:${path.join(__dirname, 'clusters.html')}` },
    { name: 'ajouter', url: `file:${path.join(__dirname, 'ajouter.html')}` }
  ];

  for (const item of pagesToCapture) {
    console.log(`Capture de ${item.name}...`);
    
    await page.goto(item.url, { waitUntil: 'networkidle0' });

    // On définit une taille de fenêtre type "Desktop"
    await page.setViewport({
      width: 1440,
      height: 1080,
      deviceScaleFactor: 2, // Multiplier par 2 pour une qualité "Retina" (super net dans Figma)
    });

    // Capture toute la hauteur de la page
    await page.screenshot({
      path: `maquette_${item.name}.png`,
      fullPage: true
    });
  }

  await browser.close();
  console.log('Toutes les captures sont prêtes !');
})();