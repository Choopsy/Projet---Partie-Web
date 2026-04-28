# Importation des Arbres en BDD
> Guide d'utilisation — phpMyAdmin

---

## Fichiers du projet

| Nom du fichier | Type | Description |
|---|---|---|
| `create_bdd.sql` | SQL | Crée la structure de la base de données (tables + clés étrangères) |
| `script.php` | PHP | Lit le CSV et insère toutes les données en respectant les FK |
| `export2.csv` | CSV | Fichier de données source exporté depuis Excel |

---

## Prérequis

- Server SQL installé et démarré (WampServer par exemple)
- Tous les fichiers placés dans le répertoire du serveyr (souvent désigné avec /www/)

---

## Étapes d'installation

### Étape 1 — Créer la base de données

1. Ouvrir **phpMyAdmin** : [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Cliquer sur **"Nouvelle base de données"**
3. Saisir un nom (ex: `arbres_bdd`) et valider

---

### Étape 2 — Exécuter le script SQL

1. Dans phpMyAdmin, **sélectionner la base** créée
2. Aller dans l'onglet **"Importer"**
3. Choisir le fichier **`create_bdd.sql`**
4. Cliquer sur **"Exécuter"**

Toutes les tables seront créées automatiquement.

---

### Étape 3 — Configurer le script PHP

Ouvrir `script.php` et renseigner vos informations de connexion :

```php
$host     = 'localhost';
$dbname   = 'arbres_bdd';   // ← nom de votre base
$user     = 'root';          // ← utilisateur (root par défaut)
$password = '';              // ← mot de passe (vide par défaut)
```

---

### Étape 4 — Lancer l'import

Ouvrir un navigateur et accéder à :
```
http://localhost/Arbre/script.php
```
Attendre le message **"Import terminé !"**

---

## Points importants

> L'import de ~9 900 lignes peut prendre plusieurs minutes, **ne pas fermer le navigateur**.

> Si erreur de timeout : la ligne `set_time_limit(0)` est déjà présente dans le script PHP.

> Le fichier `export2.csv` doit être encodé en **ISO-8859-1 (Latin-1)**. Ne pas le réenregistrer en UTF-8 sous Excel.

---

## Structure de la base de données

Les tables créées par `create_bdd.sql` :

| Table | Description |
|---|---|
| `Arbres` | Table principale (~9 915 entrées) |
| `Quartier`, `Secteur` | Localisation géographique |
| `Etat`, `Stade_developpement`, `Port`, `Pied`, `Situation` | Caractéristiques de l'arbre |
| `Nom_technique`, `Feuillage` | Classification botanique |
| `Revetement`, `remarquable` | Informations complémentaires |