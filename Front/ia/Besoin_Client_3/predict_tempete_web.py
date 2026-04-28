import os
import sys
import json
import pickle
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

RISK_MAP = {
    'EN PLACE'    : 'Stable — aucun risque détecté',
    'Non essouché': 'Danger élevé — arbre déraciné !',
    'Essouché'    : 'Risque modéré — a déjà été déraciné',
    'REMPLACÉ'    : 'Risque faible — arbre remplacé',
    'SUPPRIMÉ'    : 'Risque faible — arbre supprimé',
    'ABATTU'      : 'Risque faible — arbre abattu',
}

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

def main():
    if len(sys.argv) != 12:
        print(json.dumps({"error": "11 arguments requis"}))
        sys.exit(1)

    try:
        model    = pickle.load(open(os.path.join(BASE_DIR, 'modeles/model_rf.pkl'),    'rb'))
        encoders = pickle.load(open(os.path.join(BASE_DIR, 'modeles/encoders.pkl'),    'rb'))
        scaler   = pickle.load(open(os.path.join(BASE_DIR, 'modeles/scaler.pkl'),      'rb'))

        data = {
            'haut_tot'      : float(sys.argv[1]),
            'haut_tronc'    : float(sys.argv[2]),
            'tronc_diam'    : float(sys.argv[3]),
            'age_estim'     : float(sys.argv[4]),
            'fk_stadedev'   : sys.argv[5],
            'fk_port'       : sys.argv[6],
            'fk_pied'       : sys.argv[7],
            'fk_situation'  : sys.argv[8],
            'fk_revetement' : sys.argv[9],
            'feuillage'     : sys.argv[10],
            'remarquable'   : sys.argv[11],
            'clc_quartier'  : list(encoders['clc_quartier'].classes_)[0],
            'fk_nomtech'    : 'Inconnu',
            'clc_nbr_diag'  : 0,
        }

        df = pd.DataFrame([data])[FEATURES]

        for col in CAT_COLS:
            le = encoders[col]
            df[col] = df[col].apply(lambda x: x if x in le.classes_ else le.classes_[0])
            df[col] = le.transform(df[col])

        df[NUM_COLS] = scaler.transform(df[NUM_COLS])

        pred_encoded = model.predict(df)[0]
        le_target    = encoders['fk_arb_etat']
        etat         = le_target.inverse_transform([pred_encoded])[0]
        risque       = RISK_MAP.get(etat, '')

        print(json.dumps({
            "etat"  : etat,
            "risque": risque
        }))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
