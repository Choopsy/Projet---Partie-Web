import os
import sys
import json
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: predict_age_web.py <tronc_diam> <haut_tot> <haut_tronc>"}))
        sys.exit(1)

    try:
        tronc_diam = float(sys.argv[1])
        haut_tot   = float(sys.argv[2])
        haut_tronc = float(sys.argv[3])

        model  = joblib.load(os.path.join(BASE_DIR, 'model_age_arbre.pkl'))
        scaler = joblib.load(os.path.join(BASE_DIR, 'scaler_age.pkl'))

        moyennes = scaler.mean_

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

        X_scaled   = scaler.transform(np.array([valeurs]))
        age_predit = model.predict(X_scaled)[0]

        print(json.dumps({
            "age_estime": round(float(age_predit), 1)
        }))

    except FileNotFoundError as e:
        print(json.dumps({"error": f"Fichier introuvable : {str(e)}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
