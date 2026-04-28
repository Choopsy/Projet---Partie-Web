import numpy as np
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Chargement du modele et du scaler depuis les fichiers pkl
try:
    model  = joblib.load(os.path.join(BASE_DIR, "model_age_arbre.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "scaler_age.pkl"))
    print("Modele et scaler charges avec succes.")
except FileNotFoundError as e:
    print(f"Fichier introuvable : {e}")
    exit(1)

# Recuperation des moyennes calculees lors de l'entrainement du scaler
moyennes = scaler.mean_

# Noms des variables utilisees en estimation complexe
NOMS_VARIABLES = [
    "feuillage",
    "remarquable",
    "fk_pied",
    "fk_port",
    "clc_quartier",
    "clc_secteur",
]

ENCODAGES = {
    "feuillage": {
        "conifère": 0,
        "feuillu": 1,
        "Inconnu": 2
    },
    "remarquable": {
        "Non": 0,
        "Oui": 1
    },
    "fk_port": {
        "tête de chat relaché": 0,
        "tête de chat": 1,
        "têtard relâché": 2,
        "têtard": 3,
        "semi libre": 4,
        "rideau": 5,
        "réduit": 6,
        "réduit relâché": 7,
        "Libre": 8,
        "étêté": 9,
        "couronne": 10,
        "cépée": 11,
        "architecturé": 12,
        "Na": 13
    },
    "fk_pied": {
        "Bac de plantation": 0,
        "Bande de terre": 1,
        "fosse arbre": 2,
        "gazon": 3,
        "revetement non permeable": 4,
        "terre": 5,
        "toile tissée": 6,
        "végétation": 7,
        "NA": 8
    },
    "clc_quartier": {
        "Harly": 0,
        "Omissy": 1,
        "Quartier de l'Europe": 2,
        "Quartier de neuville": 3,
        "Quartier du Centre-ville": 4,
        "Quartier du faubourg d'Isle": 5,
        "Quartier du Vermandois": 6,
        "Quartier Remicourt": 7,
        "Quartier Saint-Jean": 8,
        "Quartier saint-martin-Öestres": 9,
        "Rouvroy": 10,
        "NA": 11
    }
}

def saisir_float(message, min_val=0):
    # Demande une valeur a l'utilisateur et valide la saisie
    while True:
        try:
            valeur = float(input(message))
            if valeur < min_val:
                print(f"La valeur doit etre >= {min_val}. Reessayez.")
            else:
                return valeur
        except ValueError:
            print("Veuillez entrer un nombre valide.")

def saisir_categorie(nom_variable, moyenne, mapping):
    print(f"\nOptions pour {nom_variable} :")
    for cle in mapping:
        print(f" - {cle}")
    
    saisie = input(f"{nom_variable} [tap Entrée pour défaut] : ").strip()

    if saisie == "":
        return moyenne

    if saisie in mapping:
        return mapping[saisie]
    else:
        print("Valeur invalide, moyenne utilisée.")
        return moyenne


def saisir_caracteristiques_base():
    # Collecte les trois mesures principales de l'arbre
    print("\nCARACTERISTIQUES PRINCIPALES :")
    tronc_diam = saisir_float("  Diametre du tronc (cm) : ", min_val=0)
    haut_tot   = saisir_float("  Hauteur totale (m)     : ", min_val=0)
    haut_tronc = saisir_float("  Hauteur du tronc (m)   : ", min_val=0)
    return tronc_diam, haut_tot, haut_tronc


def estimer_age(valeurs_input):
    # Mise a l'echelle des donnees puis prediction de l'age par le modele
    X_scaled   = scaler.transform(np.array([valeurs_input]))
    age_predit = model.predict(X_scaled)[0]
    return age_predit


def estimation_simple():
    # Mode simple : seules les 3 mesures de base sont saisies, les autres prennent la valeur moyenne
    tronc_diam, haut_tot, haut_tronc = saisir_caracteristiques_base()

    # Construction du vecteur d'entree avec les moyennes pour les variables non saisies
    valeurs = [
        tronc_diam,
        haut_tot,
        haut_tronc,
        moyennes[3],
        moyennes[4],
        moyennes[5],
        moyennes[6],
        moyennes[7],
        moyennes[8],
    ]

    age = estimer_age(valeurs)
    print("\n" + "-" * 40)
    print(f"\nAGE ESTIME : {age:.1f} ans")
    print("-" * 40)


def estimation_complexe():
    # Mode complexe : l'utilisateur saisit toutes les variables du modele
    tronc_diam, haut_tot, haut_tronc = saisir_caracteristiques_base()

    # Saisie manuelle des variables supplementaires
    print("\nVARIABLES SUPPLEMENTAIRES :")

    valeurs_sup = []

    for i, nom in enumerate(NOMS_VARIABLES):
        index_mean = i + 3

        if nom in ENCODAGES:
            valeur = saisir_categorie(nom, moyennes[index_mean], ENCODAGES[nom])
        else:
            # fallback si jamais variable non catégorielle
            saisie = input(f"{nom} [tap Entrée pour défaut] : ").strip()
            if saisie == "":
                valeur = moyennes[index_mean]
            else:
                try:
                    valeur = float(saisie)
                except ValueError:
                    print("Valeur invalide, moyenne utilisée.")
                    valeur = moyennes[index_mean]

        valeurs_sup.append(valeur)

    # Construction du vecteur complet avec toutes les variables saisies
    valeurs = [tronc_diam, haut_tot, haut_tronc] + valeurs_sup

    age = estimer_age(valeurs)
    print("\n" + "-" * 40)
    print(f"AGE ESTIME : {age:.1f} ans")
    print("-" * 40)


def afficher_menu():
    # Affichage du menu principal
    print("\n" + "-" * 40)
    print("  ESTIMATION DE L'AGE D'UN ARBRE")
    print("-" * 40)
    print("  1. Estimation simple")
    print("  2. Estimation complexe")
    print("  3. Quitter")
    print("-" * 40)


# Boucle du programme
while True:
    afficher_menu()
    choix = input("Votre choix (1/2/3) : ").strip()

    if choix == "1":
        estimation_simple()

    elif choix == "2":
        estimation_complexe()

    elif choix == "3":
        # Sortie du programme
        break

    else:
        print("Choix invalide. Entrez 1, 2 ou 3.")