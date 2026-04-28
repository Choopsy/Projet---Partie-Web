import os
import sys
import json
import pickle

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: predict_cluster_web.py <hauteur> <diametre> <k>"}))
        sys.exit(1)

    try:
        hauteur  = float(sys.argv[1])
        diametre = float(sys.argv[2])
        k        = sys.argv[3]

        model   = pickle.load(open(os.path.join(BASE_DIR, f'model_k{k}.pkl'),   'rb'))
        mapping = pickle.load(open(os.path.join(BASE_DIR, f'mapping_k{k}.pkl'), 'rb'))
        scaler  = pickle.load(open(os.path.join(BASE_DIR, 'scaler_unique.pkl'), 'rb'))

        data_scaled = scaler.transform([[hauteur, diametre]])
        cluster_id  = model.predict(data_scaled)[0]
        categorie   = mapping[cluster_id]

        print(json.dumps({
            "cluster"  : int(cluster_id),
            "categorie": str(categorie)
        }))

    except FileNotFoundError as e:
        print(json.dumps({"error": f"Fichier introuvable : {str(e)}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
