---
name: Patrimoine Arboré
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#414943'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#717973'
  outline-variant: '#c0c9c1'
  surface-tint: '#3a674f'
  primary: '#14422d'
  on-primary: '#ffffff'
  primary-container: '#2d5a43'
  on-primary-container: '#9fcfb2'
  inverse-primary: '#a1d1b4'
  secondary: '#316948'
  on-secondary: '#ffffff'
  secondary-container: '#b1edc4'
  on-secondary-container: '#356e4c'
  tertiary: '#5c2f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d4200'
  on-tertiary-container: '#ffb477'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bceecf'
  primary-fixed-dim: '#a1d1b4'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#224f39'
  secondary-fixed: '#b4f0c7'
  secondary-fixed-dim: '#98d4ac'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#165132'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Marque et Style

Le système de design est ancré à l'intersection de la conservation de l'environnement et de la science des données moderne. Il évoque un sentiment de « professionnalisme organique » — un style qui équilibre l'essence sauvage et tactile de la nature avec la précision d'un outil d'inventaire scientifique. Le public cible comprend les urbanistes, les environnementalistes et les citoyens engagés qui recherchent un outil à la fois autoritaire et inspirant.

L'esthétique suit un mouvement **moderne-corporate** avec de fortes influences **minimalistes**. Elle donne la priorité à la clarté et aux espaces blancs pour gérer des visualisations de données complexes, tout en utilisant une palette inspirée de la nature pour éviter que l'interface ne paraisse froide ou institutionnelle. L'interface doit être perçue comme un journal botanique de prestige transposé à l'ère numérique.

## Couleurs

La palette est ancrée par un « Vert Forêt Profond » pour représenter la longévité et la protection. Celui-ci est soutenu par un « Vert Sauge » pour les éléments interactifs et les accents, créant ainsi une échelle monochromatique harmonieuse pour la densité des données.

L'arrière-plan utilise un beige « Sable Chaud » plutôt qu'un blanc pur pour réduire la fatigue oculaire et renforcer le thème organique. Le « Blanc Éclatant » est réservé aux cartes et surfaces en relief pour créer une séparation visuelle nette. Un « Ocre » tertiaire est utilisé avec parcimonie pour les points saillants ou les indicateurs de statut (par ex. : « Arbres remarquables ») afin d'offrir un contraste naturel qui complète les verts.

## Typographie

La hiérarchie typographique repose sur un contraste sophistiqué entre Serif (avec empattements) et Sans-Serif (sans empattements). **Noto Serif** apporte l'autorité éditoriale aux titres, conférant à la plateforme une qualité d'archive intemporelle. **Manrope** est utilisé pour tous les éléments fonctionnels de l'interface, les points de données et le corps de texte ; ses proportions modernes et équilibrées assurent une grande lisibilité dans les listes d'inventaire denses et les tableaux de données.

Les titres doivent utiliser la variante italique pour certains mots-clés afin d'accentuer l'aspect « naturel » au sein du cadre numérique, comme on peut le voir dans les sections principales de type « héros ».

## Mise en page et Espacement

Le système de design utilise un modèle de **grille fixe** pour les vues de bureau, centrée à 1280 pixels pour maintenir la concentration, et une **grille fluide** pour les formats tablette et mobile. Un système de 12 colonnes est la norme, avec des gouttières généreuses de 24 pixels pour permettre à la nature « respirante » de la marque de persister, même dans les vues denses en données.

Le rythme est maintenu grâce à une unité de base de 8 pixels. Le rythme vertical doit être intentionnel, utilisant des espaces plus larges (`stack-lg`) entre les sections de contenu distinctes (par ex. : Carte contre Tableau) et des espacements plus serrés (`stack-sm`) pour les éléments de formulaire connexes ou les métadonnées de cartes.

## Élévation et Profondeur

La hiérarchie est établie à l'aide de **couches tonales** combinées à des **ombres ambiantes**. Les surfaces ne « flottent » pas de manière agressive ; elles reposent subtilement au-dessus du canevas beige chaud.

* **Niveau 0 (Canevas) :** L'arrière-plan sable chaud.
* **Niveau 1 (Cartes/Conteneurs) :** Surfaces blanches nettes avec une bordure de 1 pixel dans une teinte sauge très légère et une ombre douce et diffuse (opacité 12 %, flou 16 pixels) pour offrir un atterrissage en douceur.
* **Niveau 2 (Modales/Fenêtres surgissantes) :** Ombres à contraste plus élevé et flous d'arrière-plan (backdrop blur) pour isoler l'attention de l'utilisateur lors de la saisie de données ou de l'enregistrement d'un arbre.

Évitez les ombres noires lourdes ; utilisez plutôt une ombre teintée d'un vert profond pour maintenir l'harmonie des couleurs naturelles.

## Formes

Le langage des formes est systématiquement **arrondi**, reflétant les silhouettes douces trouvées dans la nature.

* **Cartes et conteneurs de données :** Rayon d'angle de 1 rem (`rounded-lg`) pour créer un cadre amical mais structuré.
* **Boutons et champs de saisie :** 0,5 rem (`rounded-md`) pour une sensation professionnelle et cliquable.
* **Puces de statut :** Forme « pilule » complète pour une distinction élevée dans les tableaux.
* **Visuels :** La photographie doit occasionnellement utiliser des masques de détourage (clipping paths) « organiques » (formes fluides ou cadres aux bords doux) pour briser la rigidité de la grille.

## Composants

### Boutons
* **Primaire :** Vert Forêt Profond plein avec texte blanc. Contraste élevé, importance haute.
* **Secondaire :** Vert Sauge avec contour (outlined) et un état de survol (hover) subtil en arrière-plan.
* **Fantôme (Ghost) :** Sans bordure, utilisé pour les actions utilitaires comme « Effacer les filtres ».

### Cartes
Les cartes sont le support principal des données sur les arbres. Elles doivent comporter une bordure subtile de 1 pixel (#E5E9E2) et des ombres douces. Les icônes d'en-tête dans les cartes doivent être enveloppées dans un fond circulaire vert sauge doux.

### Champs de saisie (Inputs)
Les champs utilisent un remplissage d'arrière-plan léger (neutre) plutôt qu'un simple contour. L'état de focus est une bordure vert sauge de 2 pixels.

### Visualisation de données
Les graphiques doivent utiliser un dégradé de verts primaires et secondaires. Pour les données catégorielles (comme les espèces d'arbres), utilisez le vert primaire comme point d'ancrage et diminuez l'opacité ou la clarté pour assurer la cohésion visuelle.

### Liste d'inventaire
Le composant de liste/tableau utilise un style « zébré » avec une teinte sauge très légère pour maintenir le suivi horizontal à travers les nombreux points de données (hauteur, diamètre, âge).
