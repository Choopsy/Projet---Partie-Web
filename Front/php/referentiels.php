<?php
// ============================================================
//  RÉFÉRENTIELS — Toutes les routes GET pour les listes
// ============================================================
require_once 'config.php';

$pdo = getDB();

// Récupération de la route demandée
$route = $_GET['route'] ?? '';

switch ($route) {

    case 'etats':
        $stmt = $pdo->query('SELECT * FROM Etat');
        echo json_encode($stmt->fetchAll());
        break;

    case 'stades':
        $stmt = $pdo->query('SELECT * FROM Stade_developpement');
        echo json_encode($stmt->fetchAll());
        break;

    case 'ports':
        $stmt = $pdo->query('SELECT * FROM Port');
        echo json_encode($stmt->fetchAll());
        break;

    case 'pieds':
        $stmt = $pdo->query('SELECT * FROM Pied');
        echo json_encode($stmt->fetchAll());
        break;

    case 'feuillages':
        $stmt = $pdo->query('SELECT * FROM Feuillage');
        echo json_encode($stmt->fetchAll());
        break;

    case 'nomstechniques':
        $stmt = $pdo->query('SELECT * FROM Nom_technique');
        echo json_encode($stmt->fetchAll());
        break;

    case 'revetements':
        $stmt = $pdo->query('SELECT * FROM Revetement');
        echo json_encode($stmt->fetchAll());
        break;

    case 'situations':
        $stmt = $pdo->query('SELECT * FROM Situation');
        echo json_encode($stmt->fetchAll());
        break;

    case 'secteurs':
        $stmt = $pdo->query('SELECT * FROM Secteur');
        echo json_encode($stmt->fetchAll());
        break;

    case 'quartiers':
        $stmt = $pdo->query('SELECT * FROM Quartier');
        echo json_encode($stmt->fetchAll());
        break;

    case 'remarquables':
        $stmt = $pdo->query('SELECT * FROM remarquable');
        echo json_encode($stmt->fetchAll());
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Route introuvable']);
        break;
}