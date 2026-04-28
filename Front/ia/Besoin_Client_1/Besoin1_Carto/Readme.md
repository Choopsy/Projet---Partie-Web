
# OUTIL D'AIDE À LA DÉCISION : GESTION DES ARBRES (IA) VILLE DE SAINT-QUENTIN


Cet outil professionnel permet de classer instantanément un arbre dans 
une catégorie de taille et de visualiser les résultats sur une interface 
cartographique dynamique pilotée par un serveur local intégré.

------------------------------------------------------------------------
1. INNOVATIONS TECHNIQUES
------------------------------------------------------------------------
- Moteur IA : Algorithme K-Means (Apprentissage Non Supervisé).
- Variables : Hauteur totale (m) et Diamètre du tronc (cm).
- Serveur Local : Micro-serveur HTTP intégré pour une visualisation 
  cartographique fluide et sécurisée dans votre navigateur.
- Optimisation : Modèles sérialisés (Pickle) pour une réponse immédiate.

------------------------------------------------------------------------
2. CONTENU DU DOSSIER
------------------------------------------------------------------------
- predict_cluster.py   : Programme principal avec serveur intégré.
- model_kX.pkl         : Cerveaux de l'IA pré-entraînés (K=2, 3 et 4).
- scaler_unique.pkl    : Module de normalisation statistique.
- mapping_kX.pkl       : Dictionnaires de labels (Petit, Moyen, Grand).
- carte_interactive_besoin1.html : Base de données cartographique.

------------------------------------------------------------------------
3. MODE D'EMPLOI
------------------------------------------------------------------------
Pour lancer l'application, utilisez votre terminal dans ce dossier :

    > python predict_cluster.py

DÉROULEMENT DE L'ANALYSE :
1. CONFIGURATION : Choisissez le nombre de catégories (2, 3 ou 4).
   * Conseil : Tapez '3' pour le profil standard (Petit/Moyen/Grand).

2. PRÉDICTION : Saisissez les dimensions de l'arbre à tester.

3. VISUALISATION : 
   - Le script affiche le résultat textuel.
   - Un serveur web local démarre automatiquement.
   - Une URL (http://127.0.0.1:8000/...) est générée.
   - La carte interactive s'ouvre pour situer l'arbre dans son contexte urbain.

4. FERMETURE : Appuyez sur 'Entrée' dans le terminal pour éteindre 
   proprement le serveur et quitter l'application.

------------------------------------------------------------------------
4. SÉCURITÉ ET PERFORMANCE
------------------------------------------------------------------------
Le serveur inclus est configuré en mode "Quiet" (silencieux) : il ne 
génère aucun log technique inutile, garantissant une lecture claire de 
vos résultats de prédiction dans le terminal.


Réalisé dans le cadre du Projet IA - FISA 4 - ISEN

