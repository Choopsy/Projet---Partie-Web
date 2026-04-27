<?php
// ============================================================
//  ARBRES — GET tous les arbres / POST ajouter un arbre
// ============================================================
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // GET /arbres — Récupérer tous les arbres
    case 'GET':
        $stmt = $pdo->query('
            SELECT 
                a.global_id, a.x, a.y,
                a.haut_tot, a.haut_tronc, a.tronc_diam,
                a.dte_plantation, a.dte_abattage,
                a.age_estim, a.clc_nbr_diag,
                e.fk_arb_etat AS etat,
                f.feuillage,
                n.fk_nomtech AS nom_technique,
                r.fk_revetement AS revetement,
                p.fk_port AS port,
                pi.fk_pied AS pied,
                si.fk_situation AS situation,
                rm.remarquable,
                sd.fk_stadedev AS stade_developpement,
                s.Secteur AS secteur,
                q.Quartier AS quartier
            FROM Arbres a
            LEFT JOIN Etat e ON a.id_Etat = e.id
            LEFT JOIN Feuillage f ON a.id_Feuillage = f.id
            LEFT JOIN Nom_technique n ON a.id_Nom_technique = n.id
            LEFT JOIN Revetement r ON a.id_Revetement = r.id
            LEFT JOIN Port p ON a.id_Port = p.id
            LEFT JOIN Pied pi ON a.id_Pied = pi.id
            LEFT JOIN Situation si ON a.id_Situation = si.id
            LEFT JOIN remarquable rm ON a.id_remarquable = rm.id
            LEFT JOIN Stade_developpement sd ON a.id_Stade_developpement = sd.id
            LEFT JOIN Secteur s ON a.id_Secteur = s.id
            LEFT JOIN Quartier q ON s.id_Quartier = q.id
        ');
        echo json_encode($stmt->fetchAll(), JSON_UNESCAPED_UNICODE);
        break;

    // POST /arbres — Ajouter un nouvel arbre
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        // Vérification des champs obligatoires
        $required = ['haut_tot', 'haut_tronc', 'tronc_diam', 'x', 'y',
                     'id_Etat', 'id_Stade_developpement', 'id_Port',
                     'id_Pied', 'id_remarquable'];

        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                http_response_code(400);
                echo json_encode(['error' => "Champ manquant : $field"]);
                exit;
            }
        }

        // Génération d'un global_id unique
        $global_id = 'ARB-' . strtoupper(uniqid());

        $stmt = $pdo->prepare('
            INSERT INTO Arbres (
                global_id, x, y,
                haut_tot, haut_tronc, tronc_diam,
                dte_plantation,
                id_Etat, id_Feuillage, id_Nom_technique,
                id_Revetement, id_Port, id_Pied,
                id_Situation, id_remarquable,
                id_Stade_developpement, id_Secteur
            ) VALUES (
                :global_id, :x, :y,
                :haut_tot, :haut_tronc, :tronc_diam,
                :dte_plantation,
                :id_Etat, :id_Feuillage, :id_Nom_technique,
                :id_Revetement, :id_Port, :id_Pied,
                :id_Situation, :id_remarquable,
                :id_Stade_developpement, :id_Secteur
            )
        ');

        $stmt->execute([
            ':global_id'             => $global_id,
            ':x'                     => $data['x'],
            ':y'                     => $data['y'],
            ':haut_tot'              => $data['haut_tot'],
            ':haut_tronc'            => $data['haut_tronc'],
            ':tronc_diam'            => $data['tronc_diam'],
            ':dte_plantation'        => $data['dte_plantation'] ?? null,
            ':id_Etat'               => $data['id_Etat'],
            ':id_Feuillage'          => $data['id_Feuillage'] ?? null,
            ':id_Nom_technique'      => $data['id_Nom_technique'] ?? null,
            ':id_Revetement'         => $data['id_Revetement'] ?? null,
            ':id_Port'               => $data['id_Port'],
            ':id_Pied'               => $data['id_Pied'],
            ':id_Situation'          => $data['id_Situation'] ?? null,
            ':id_remarquable'        => $data['id_remarquable'],
            ':id_Stade_developpement'=> $data['id_Stade_developpement'],
            ':id_Secteur'            => $data['id_Secteur'] ?? null,
        ]);

        http_response_code(201);
        echo json_encode([
            'message'   => 'Arbre ajouté avec succès',
            'global_id' => $global_id
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}