"""
=============================================================
Besoin Client 3 — Système d'alerte pour les tempêtes
Script de prédiction de l'état des arbres
=============================================================

Usage :
    python predict_tempete.py

Le script propose deux modes :
    1. Prédiction à partir d'un fichier CSV (plusieurs arbres)
    2. Prédiction pour un seul arbre (saisie manuelle)

Colonnes requises dans le CSV d'entrée (mode 1) :
    haut_tot, haut_tronc, tronc_diam, age_estim, fk_stadedev,
    fk_port, fk_pied, fk_situation, fk_revetement, clc_quartier,
    feuillage, remarquable, fk_nomtech, clc_nbr_diag
=============================================================
"""

import os
import sys
import pickle
import pandas as pd
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix, f1_score
)

# ─── Colonnes attendues ───────────────────────────────────────────────────────
FEATURES = [
    'haut_tot', 'haut_tronc', 'tronc_diam', 'age_estim',
    'fk_stadedev', 'fk_port', 'fk_pied', 'fk_situation',
    'fk_revetement', 'clc_quartier', 'feuillage', 'remarquable',
    'fk_nomtech', 'clc_nbr_diag'
]

CAT_COLS = [
    'fk_stadedev', 'fk_port', 'fk_pied', 'fk_situation',
    'fk_revetement', 'clc_quartier', 'feuillage', 'remarquable', 'fk_nomtech'
]

NUM_COLS = ['haut_tot', 'haut_tronc', 'tronc_diam', 'age_estim', 'clc_nbr_diag']

RISK_MAP = {
    'EN PLACE'    : 'Stable — aucun risque détecté',
    'Non essouché': 'Danger élevé — arbre déraciné !',
    'Essouché'    : 'Risque modéré — a déjà été déraciné',
    'REMPLACÉ'    : 'Risque faible — arbre remplacé',
    'SUPPRIMÉ'    : 'Risque faible — arbre supprimé',
    'ABATTU'      : 'Risque faible — arbre abattu',
}


# ─── Chargement des modèles ───────────────────────────────────────────────────
def load_models():
    model_dir     = os.path.dirname(os.path.abspath(__file__))
    model_path    = os.path.join(model_dir, './modeles/model_rf.pkl')
    encoders_path = os.path.join(model_dir, './modeles/encoders.pkl')
    scaler_path   = os.path.join(model_dir, './modeles/scaler.pkl')

    for path in [model_path, encoders_path, scaler_path]:
        if not os.path.exists(path):
            print(f"Fichier introuvable : {path}")
            print("   Assurez-vous que les fichiers .pkl sont dans le même dossier que ce script.")
            sys.exit(1)

    model    = pickle.load(open(model_path,    'rb'))
    encoders = pickle.load(open(encoders_path, 'rb'))
    scaler   = pickle.load(open(scaler_path,   'rb'))

    print("Modèle et préprocesseurs chargés avec succès.")
    return model, encoders, scaler


# ─── Prétraitement ───────────────────────────────────────────────────────────
def preprocess(df, encoders, scaler):

    # Valeurs par défaut pour les colonnes non saisies manuellement
    DEFAULTS = {
        'clc_nbr_diag' : 0,
        'clc_quartier' : list(encoders['clc_quartier'].classes_)[0],
        'fk_nomtech'   : 'Inconnu',
    }

    # Ajout des colonnes manquantes avec leurs valeurs par défaut
    for col, val in DEFAULTS.items():
        if col not in df.columns:
            df[col] = val

    # Vérification des colonnes restantes
    missing_cols = [col for col in FEATURES if col not in df.columns]
    if missing_cols:
        print(f"Colonnes manquantes : {missing_cols}")
        sys.exit(1)

    df = df[FEATURES].copy()

    df['tronc_diam']   = df['tronc_diam'].fillna(df['tronc_diam'].median())
    df['clc_nbr_diag'] = df['clc_nbr_diag'].fillna(0)
    for col in ['fk_stadedev', 'fk_port', 'fk_pied', 'feuillage', 'fk_nomtech']:
        df[col] = df[col].fillna('Inconnu')
    df['fk_revetement'] = df['fk_revetement'].fillna('Non')
    df['remarquable']   = df['remarquable'].fillna('Non')

    for col in CAT_COLS:
        le = encoders[col]
        df[col] = df[col].apply(
            lambda x: x if x in le.classes_ else le.classes_[0]
        )
        df[col] = le.transform(df[col])

    df[NUM_COLS] = scaler.transform(df[NUM_COLS])

    return df


# ─── Saisie interactive ───────────────────────────────────────────────────────
def saisie_manuelle(encoders):
    print("\n" + "─" * 50)
    print("   Saisie des caractéristiques de l'arbre")
    print("─" * 50)

    def saisir_float(label, unite=""):
        while True:
            try:
                val = input(f"  {label}{' (' + unite + ')' if unite else ''} : ")
                return float(val)
            except ValueError:
                print("Veuillez entrer un nombre valide.")

    def saisir_choix(label, options):
        print(f"\n  {label} :")
        for i, opt in enumerate(options, 1):
            print(f"    {i}. {opt}")
        while True:
            try:
                choix = int(input("  Votre choix (numéro) : "))
                if 1 <= choix <= len(options):
                    return options[choix - 1]
                print(f"Entrez un numéro entre 1 et {len(options)}.")
            except ValueError:
                print("Veuillez entrer un numéro valide.")

    def get_classes(col):
        return list(encoders[col].classes_)

    data = {
        'haut_tot'      : saisir_float("Hauteur totale", "m"),
        'haut_tronc'    : saisir_float("Hauteur du tronc", "m"),
        'tronc_diam'    : saisir_float("Diamètre du tronc", "cm"),
        'age_estim'     : saisir_float("Âge estimé", "années"),
        'fk_stadedev'   : saisir_choix("Stade de développement", get_classes('fk_stadedev')),
        'fk_port'       : saisir_choix("Port de l'arbre", get_classes('fk_port')),
        'fk_pied'       : saisir_choix("Type de pied", get_classes('fk_pied')),
        'fk_situation'  : saisir_choix("Situation", get_classes('fk_situation')),
        'fk_revetement' : saisir_choix("Revêtement", get_classes('fk_revetement')),
        'feuillage'     : saisir_choix("Type de feuillage", get_classes('feuillage')),
        'remarquable'   : saisir_choix("Arbre remarquable ?", get_classes('remarquable')),
    }

    return pd.DataFrame([data])


# ─── Mode CSV ────────────────────────────────────────────────────────────────
def mode_csv(model, encoders, scaler):
    input_path  = input("\n  Chemin du fichier CSV d'entrée : ").strip()
    output_path = input("  Chemin du fichier CSV de sortie (défaut : resultats.csv) : ").strip()
    if not output_path:
        output_path = 'resultats.csv'

    if not os.path.exists(input_path):
        print(f"Fichier introuvable : {input_path}")
        sys.exit(1)

    df_input = pd.read_csv(input_path)
    print(f"\n{len(df_input)} arbres chargés.")

    df_processed        = preprocess(df_input, encoders, scaler)
    predictions_encoded = model.predict(df_processed)
    le_target           = encoders['fk_arb_etat']
    predictions         = le_target.inverse_transform(predictions_encoded)

    df_output = df_input.copy()
    df_output['prediction_etat'] = predictions
    df_output['niveau_risque']   = df_output['prediction_etat'].map(RISK_MAP)
    df_output.to_csv(output_path, index=False)
    print(f"Prédictions exportées dans : {output_path}")

    print("\nRésumé des prédictions :")
    risque_faible = ['REMPLACÉ', 'SUPPRIMÉ', 'ABATTU']
    stable        = (df_output['prediction_etat'] == 'EN PLACE').sum()
    danger_eleve  = (df_output['prediction_etat'] == 'Non essouché').sum()
    risque_mod    = (df_output['prediction_etat'] == 'Essouché').sum()
    risque_faib   = df_output['prediction_etat'].isin(risque_faible).sum()

    print(f"Stable         (EN PLACE)                     : {stable} arbre(s)")
    print(f"Danger élevé   (Non essouché — déraciné)      : {danger_eleve} arbre(s)")
    print(f"Risque modéré  (Essouché — a été déraciné)    : {risque_mod} arbre(s)")
    print(f"Risque faible  (Abattu + Supprimé + Remplacé) : {risque_faib} arbre(s)")

    if 'fk_arb_etat' in df_input.columns:
        print("\n" + "=" * 55)
        print("        ÉVALUATION DU MODÈLE")
        print("=" * 55)
        y_true     = le_target.transform(df_input['fk_arb_etat'])
        y_pred     = model.predict(df_processed)
        y_true_lbl = le_target.inverse_transform(y_true)
        y_pred_lbl = le_target.inverse_transform(y_pred)

        acc = accuracy_score(y_true, y_pred)
        f1  = f1_score(y_true, y_pred, average='weighted')

        print(f"\nAccuracy            : {acc:.4f} ({acc*100:.2f}%)")
        print(f"F1-Score (weighted) : {f1:.4f}")
        print("\n─── Rapport de classification ───────────────────────")
        print(classification_report(y_true_lbl, y_pred_lbl))
        print("─── Matrice de confusion ────────────────────────────")
        classes = le_target.classes_
        cm      = confusion_matrix(y_true_lbl, y_pred_lbl, labels=classes)
        cm_df   = pd.DataFrame(cm, index=classes, columns=classes)
        print(cm_df)
        print("\nLigne = Valeur réelle | Colonne = Valeur prédite")


# ─── Mode arbre solo ─────────────────────────────────────────────────────────
def mode_solo(model, encoders, scaler):
    df           = saisie_manuelle(encoders)
    df_processed = preprocess(df, encoders, scaler)

    prediction_encoded = model.predict(df_processed)[0]
    le_target          = encoders['fk_arb_etat']
    prediction         = le_target.inverse_transform([prediction_encoded])[0]
    risque             = RISK_MAP.get(prediction, '')

    print("\n" + "=" * 50)
    print("         RÉSULTAT DE LA PRÉDICTION")
    print("=" * 50)
    print(f"\n  État prédit : {prediction}")
    print(f"  {risque}")
    print("=" * 50)


# ─── Point d'entrée ──────────────────────────────────────────────────────────
if __name__ == '__main__':

    print("\n" + "=" * 50)
    print("Système d'alerte pour les tempêtes")
    print("=" * 50)

    model, encoders, scaler = load_models()

    print("\n  Mode de prédiction :")
    print("    1. Prédire à partir d'un fichier CSV")
    print("    2. Prédire pour un seul arbre (saisie manuelle)")

    while True:
        choix = input("\n  Votre choix (1 ou 2) : ").strip()
        if choix == '1':
            mode_csv(model, encoders, scaler)
            break
        elif choix == '2':
            mode_solo(model, encoders, scaler)
            break
        else:
            print("Veuillez entrer 1 ou 2.")