<?php
// ============================================================
//  PREDICT — Appels aux scripts Python IA
//  Modes : automatique (global_id BDD) ou manuel (données directes)
// ============================================================
require_once 'config.php';

$pdo    = getDB();
$action = $_GET['action'] ?? '';

// ============================================================
//  HELPER — Filtre les warnings Python et extrait le JSON
// ============================================================
function extractJson(string $output): ?array {
    $lines = explode("\n", trim($output));
    foreach ($lines as $line) {
        $line = trim($line);
        if (str_starts_with($line, '{') || str_starts_with($line, '[')) {
            $decoded = json_decode($line, true);
            if ($decoded !== null) return $decoded;
        }
    }
    return null;
}

switch ($action) {

    // ============================================================
    // POST /predict/cluster
    // Body : { "k": 3 }
    // ============================================================
    case 'cluster':
        $data = json_decode(file_get_contents('php://input'), true);
        $k    = $data['k'] ?? 3;

        $stmt = $pdo->query('
            SELECT a.global_id, a.haut_tot, a.tronc_diam, a.x, a.y
            FROM Arbres a
        ');
        $arbres = $stmt->fetchAll();

        if (empty($arbres)) {
            http_response_code(400);
            echo json_encode(['error' => 'Aucun arbre en base']);
            exit;
        }

        $results = [];
        $script = IA_BASE . '\\Besoin_Client_1\\Besoin1_Carto\\predict_cluster_web.py';

        foreach ($arbres as $arbre) {
            $hauteur  = escapeshellarg($arbre['haut_tot']);
            $diametre = escapeshellarg($arbre['tronc_diam']);
            $kArg     = escapeshellarg($k);

            $output = shell_exec("python \"$script\" $hauteur $diametre $kArg 2>&1");
            $result = extractJson($output);

            if (!$result || isset($result['error'])) {
                http_response_code(500);
                echo json_encode(['error' => $result['error'] ?? 'Erreur script Python cluster']);
                exit;
            }

            $results[] = [
                'global_id' => $arbre['global_id'],
                'cluster'   => $result['cluster'],
                'categorie' => $result['categorie'],
                'x'         => $arbre['x'],
                'y'         => $arbre['y'],
            ];
        }

        echo json_encode($results, JSON_UNESCAPED_UNICODE);
        break;

    // ============================================================
    // POST /predict/age
    // Body auto   : { "global_id": "ARB-xxx" }
    // Body manuel : { "manuel": true, "haut_tot": 12, "haut_tronc": 3, "tronc_diam": 45 }
    // ============================================================
    case 'age':
        $data   = json_decode(file_get_contents('php://input'), true);
        $manuel = $data['manuel'] ?? false;

        if ($manuel) {
            $hautTot   = $data['haut_tot']   ?? null;
            $hautTronc = $data['haut_tronc'] ?? null;
            $troncDiam = $data['tronc_diam'] ?? null;

            if ($hautTot === null || $hautTronc === null || $troncDiam === null) {
                http_response_code(400);
                echo json_encode(['error' => 'Champs manquants : haut_tot, haut_tronc, tronc_diam']);
                exit;
            }
        } else {
            $global_id = $data['global_id'] ?? null;
            if (!$global_id) {
                http_response_code(400);
                echo json_encode(['error' => 'global_id manquant']);
                exit;
            }

            $stmt = $pdo->prepare('
                SELECT a.haut_tot, a.haut_tronc, a.tronc_diam
                FROM Arbres a WHERE a.global_id = :id
            ');
            $stmt->execute([':id' => $global_id]);
            $arbre = $stmt->fetch();

            if (!$arbre) {
                http_response_code(404);
                echo json_encode(['error' => 'Arbre non trouvé']);
                exit;
            }

            $hautTot   = $arbre['haut_tot'];
            $hautTronc = $arbre['haut_tronc'];
            $troncDiam = $arbre['tronc_diam'];
        }

        $script = IA_BASE . '\\Besoin_Client_2\\Besoin2\\predict_age_web.py';
        $tronc      = escapeshellarg($troncDiam);
        $hautTotA   = escapeshellarg($hautTot);
        $hautTroncA = escapeshellarg($hautTronc);

        $output = shell_exec("python \"$script\" $tronc $hautTotA $hautTroncA 2>&1");
        $result = extractJson($output);

        if (!$result || isset($result['error'])) {
            http_response_code(500);
            echo json_encode(['error' => $result['error'] ?? 'Erreur script Python age']);
            exit;
        }

        echo json_encode([
            'age_estime' => $result['age_estime']
        ], JSON_UNESCAPED_UNICODE);
        break;

    // ============================================================
    // POST /predict/tempete
    // Body auto   : { "global_id": "ARB-xxx" }
    // Body manuel : { "manuel": true, "haut_tot": 12, ... }
    // ============================================================
    case 'tempete':
        $data   = json_decode(file_get_contents('php://input'), true);
        $manuel = $data['manuel'] ?? false;

        if ($manuel) {
            $hautTot     = $data['haut_tot']      ?? 0;
            $hautTronc   = $data['haut_tronc']    ?? 0;
            $troncDiam   = $data['tronc_diam']    ?? 0;
            $age         = $data['age_estim']     ?? 0;
            $stade       = $data['fk_stadedev']   ?? 'Inconnu';
            $port        = $data['fk_port']       ?? 'Inconnu';
            $pied        = $data['fk_pied']       ?? 'Inconnu';
            $situation   = $data['fk_situation']  ?? 'Inconnu';
            $revetement  = $data['fk_revetement'] ?? 'Non';
            $feuillage   = $data['feuillage']     ?? 'Inconnu';
            $remarquable = $data['remarquable']   ?? 'Non';
        } else {
            $global_id = $data['global_id'] ?? null;
            if (!$global_id) {
                http_response_code(400);
                echo json_encode(['error' => 'global_id manquant']);
                exit;
            }

            $stmt = $pdo->prepare('
                SELECT
                    a.haut_tot, a.haut_tronc, a.tronc_diam, a.age_estim,
                    sd.fk_stadedev, p.fk_port, pi.fk_pied,
                    si.fk_situation, r.fk_revetement,
                    f.feuillage, rm.remarquable
                FROM Arbres a
                LEFT JOIN Stade_developpement sd ON a.id_Stade_developpement = sd.id
                LEFT JOIN Port p                 ON a.id_Port = p.id
                LEFT JOIN Pied pi                ON a.id_Pied = pi.id
                LEFT JOIN Situation si           ON a.id_Situation = si.id
                LEFT JOIN Revetement r           ON a.id_Revetement = r.id
                LEFT JOIN Feuillage f            ON a.id_Feuillage = f.id
                LEFT JOIN remarquable rm         ON a.id_remarquable = rm.id
                WHERE a.global_id = :id
            ');
            $stmt->execute([':id' => $global_id]);
            $arbre = $stmt->fetch();

            if (!$arbre) {
                http_response_code(404);
                echo json_encode(['error' => 'Arbre non trouvé']);
                exit;
            }

            $hautTot     = $arbre['haut_tot']      ?? 0;
            $hautTronc   = $arbre['haut_tronc']    ?? 0;
            $troncDiam   = $arbre['tronc_diam']    ?? 0;
            $age         = $arbre['age_estim']     ?? 0;
            $stade       = $arbre['fk_stadedev']   ?? 'Inconnu';
            $port        = $arbre['fk_port']       ?? 'Inconnu';
            $pied        = $arbre['fk_pied']       ?? 'Inconnu';
            $situation   = $arbre['fk_situation']  ?? 'Inconnu';
            $revetement  = $arbre['fk_revetement'] ?? 'Non';
            $feuillage   = $arbre['feuillage']     ?? 'Inconnu';
            $remarquable = $arbre['remarquable']   ? 'Oui' : 'Non';
        }

        $script = IA_BASE . '\\Besoin_Client_3\\predict_tempete_web.py';
        $hautTotE     = escapeshellarg($hautTot);
        $hautTroncE   = escapeshellarg($hautTronc);
        $troncE       = escapeshellarg($troncDiam);
        $ageE         = escapeshellarg($age);
        $stadeE       = escapeshellarg($stade);
        $portE        = escapeshellarg($port);
        $piedE        = escapeshellarg($pied);
        $situationE   = escapeshellarg($situation);
        $revetementE  = escapeshellarg($revetement);
        $feuillageE   = escapeshellarg($feuillage);
        $remarquableE = escapeshellarg($remarquable);

        $output = shell_exec("python \"$script\" $hautTotE $hautTroncE $troncE $ageE $stadeE $portE $piedE $situationE $revetementE $feuillageE $remarquableE 2>&1");
        $result = extractJson($output);

        if (!$result || isset($result['error'])) {
            http_response_code(500);
            echo json_encode(['error' => $result['error'] ?? 'Erreur script Python tempete']);
            exit;
        }

        echo json_encode([
            'etat'  => $result['etat'],
            'risque'=> $result['risque']
        ], JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Action introuvable']);
        break;
}