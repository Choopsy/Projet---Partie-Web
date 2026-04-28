import os
import pickle
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Nom du fichier HTML de la carte à servir
HTML_FILE = "carte_interactive_besoin1.html"


class QuietHTTPRequestHandler(SimpleHTTPRequestHandler):
    # Désactive les logs de requêtes HTTP pour que le serveur reste silencieux
    def log_message(self, format, *args):
        pass


def start_quiet_server(directory, port=8000):
    """Démarre un serveur HTTP local sur 127.0.0.1.

    Si le port par défaut n'est pas disponible, un port libre est choisi.
    """
    handler = lambda *args, **kwargs: QuietHTTPRequestHandler(*args, directory=directory, **kwargs)
    try:
        server = HTTPServer(("127.0.0.1", port), handler)
    except OSError:
        server = HTTPServer(("127.0.0.1", 0), handler)

    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def main():
    # Affichage de l'entête du programme
    print("====================================================")
    print("   SYSTÈME DE PRÉDICTION DE TAILLE (SAINT-QUENTIN)")
    print("====================================================\n")

    # 1. Sélection du modèle
    k_choice = input("Choisissez le nombre de catégories (2, 3 ou 4) : ")

    try:
        # Chargement du modèle, du mapping des clusters et du scaler
        model = pickle.load(open(f'model_k{k_choice}.pkl', 'rb'))
        mapping = pickle.load(open(f'mapping_k{k_choice}.pkl', 'rb'))
        scaler = pickle.load(open('scaler_unique.pkl', 'rb'))

        # 2. Saisie des caractéristiques de l'arbre
        h = float(input("Entrez la hauteur (m) : ").replace(',', '.'))
        d = float(input("Entrez le diamètre (cm) : ").replace(',', '.'))

        # 3. Prédiction du cluster
        data_scaled = scaler.transform([[h, d]])
        cluster_id = model.predict(data_scaled)[0]

        print(f"\n>>> RÉSULTAT : Catégorie **{mapping[cluster_id]}**")

        # 4. Démarrage du serveur local pour afficher la carte
        html_path = os.path.abspath(HTML_FILE)
        if not os.path.exists(html_path):
            print(f"Erreur : le fichier {HTML_FILE} est introuvable.")
            return

        serve_dir = os.path.dirname(html_path) or os.getcwd()
        server = start_quiet_server(serve_dir)
        port = server.server_address[1]
        url = f"http://127.0.0.1:{port}/{os.path.basename(html_path)}"

        print("\nLe serveur de la carte a démarré sans logs de service.")
        print(f"Accédez à la carte ici : {url}")

        # 5. Attente avant arrêt du serveur
        input("\nAppuyez sur Entrée pour arrêter le serveur et quitter...")
        server.shutdown()
        server.server_close()

    except FileNotFoundError:
        print(f"Erreur : Le modèle pour {k_choice} clusters n'existe pas.")


if __name__ == "__main__":
    main()
    