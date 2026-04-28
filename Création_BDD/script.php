<?php
$host     = 'localhost';
$dbname   = 'projetarbre1';
$user     = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4");  // ← force l'encodage de la connexion
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

function getOrCreate($pdo, $table, $column, $value) {
    if (!$value || $value === 'NA') return null;

    // Convertit chaque valeur de Latin-1 vers UTF-8
    $value = mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');

    $stmt = $pdo->prepare("SELECT id FROM $table WHERE $column = ?");
    $stmt->execute([$value]);
    $row = $stmt->fetch();

    if ($row) return $row['id'];

    $stmt = $pdo->prepare("INSERT INTO $table ($column) VALUES (?)");
    $stmt->execute([$value]);
    return $pdo->lastInsertId();
}

set_time_limit(0);

$file = fopen('export2.csv', 'r');
$header = fgetcsv($file, 0, ';');

while (($row = fgetcsv($file, 0, ';')) !== false) {
    // Convertit toute la ligne en UTF-8
    $row = array_map(fn($val) => mb_convert_encoding($val, 'UTF-8', 'ISO-8859-1'), $row);
    $data = array_combine($header, $row);

    $id_quartier = getOrCreate($pdo, 'Quartier',            'Quartier',     $data['clc_quartier']);
    $id_secteur  = getOrCreate($pdo, 'Secteur',             'Secteur',      $data['clc_secteur']);
    $id_etat     = getOrCreate($pdo, 'Etat',                'fk_arb_etat',  $data['fk_arb_etat']);
    $id_stade    = getOrCreate($pdo, 'Stade_developpement', 'fk_stadedev',  $data['fk_stadedev']);
    $id_port     = getOrCreate($pdo, 'Port',                'fk_port',      $data['fk_port']);
    $id_pied     = getOrCreate($pdo, 'Pied',                'fk_pied',      $data['fk_pied']);
    $id_sit      = getOrCreate($pdo, 'Situation',           'fk_situation', $data['fk_situation']);
    $id_rv       = getOrCreate($pdo, 'Revetement',          'fk_revetement',$data['fk_revetement']);
    $id_nt       = getOrCreate($pdo, 'Nom_technique',       'fk_nomtech',   $data['fk_nomtech']);
    $id_fe       = getOrCreate($pdo, 'Feuillage',           'feuillage',    $data['feuillage']);
    $id_rq       = getOrCreate($pdo, 'remarquable',         'remarquable',  $data['remarquable']);

    if ($id_secteur && $id_quartier) {
        $pdo->prepare("UPDATE Secteur SET id_Quartier = ? WHERE id = ?")
            ->execute([$id_quartier, $id_secteur]);
    }

    $stmt = $pdo->prepare("
        INSERT IGNORE INTO Arbres 
        (global_id, x, y, haut_tot, haut_tronc, tronc_diam, dte_plantation, dte_abattage, 
         age_estim, clc_nbr_diag, id, id_Etat, id_Feuillage, id_Nom_technique, 
         id_Revetement, id_Port, id_Pied, id_Situation, id_remarquable, id_Stade_developpement)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data['global_id'],
        $data['x'],
        $data['y'],
        $data['haut_tot'],
        $data['haut_tronc'],
        $data['tronc_diam'],
        $data['dte_plantation'] !== 'NA' ? $data['dte_plantation'] : null,
        $data['dte_abattage']   !== 'NA' ? $data['dte_abattage']   : null,
        $data['age_estim']      !== 'NA' ? $data['age_estim']      : null,
        $data['clc_nbr_diag'],
        $id_secteur,
        $id_etat,
        $id_fe,
        $id_nt,
        $id_rv,
        $id_port,
        $id_pied,
        $id_sit,
        $id_rq,
        $id_stade,
    ]);
}

fclose($file);
echo "Import terminé !";
?>