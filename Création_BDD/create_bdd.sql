-- ----------------------------------------------------------
-- Script MYSQL pour mcd 
-- ----------------------------------------------------------


-- ----------------------------
-- Table: Nom_technique
-- ----------------------------
CREATE TABLE Nom_technique (
  id INT NOT NULL AUTO_INCREMENT,
  fk_nomtech VARCHAR(12),
  CONSTRAINT Nom_technique_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Stade_developpement
-- ----------------------------
CREATE TABLE Stade_developpement (
  id INT NOT NULL AUTO_INCREMENT,
  fk_stadedev VARCHAR(12),
  CONSTRAINT Stade_developpement_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Etat
-- ----------------------------
CREATE TABLE Etat (
  id INT NOT NULL AUTO_INCREMENT,
  fk_arb_etat VARCHAR(12),
  CONSTRAINT Etat_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Port
-- ----------------------------
CREATE TABLE Port (
  id INT NOT NULL AUTO_INCREMENT,
  fk_port VARCHAR(12),
  CONSTRAINT Port_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: remarquable
-- ----------------------------
CREATE TABLE remarquable (
  id INT NOT NULL AUTO_INCREMENT,
  remarquable BINARY(1),
  CONSTRAINT remarquable_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Feuillage
-- ----------------------------
CREATE TABLE Feuillage (
  id INT NOT NULL AUTO_INCREMENT,
  feuillage VARCHAR(12),
  CONSTRAINT Feuillage_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Revetement
-- ----------------------------
CREATE TABLE Revetement (
  id INT NOT NULL AUTO_INCREMENT,
  fk_revetement TINYINT(1),
  CONSTRAINT Revetement_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Quartier
-- ----------------------------
CREATE TABLE Quartier (
  id INT NOT NULL AUTO_INCREMENT,
  Quartier VARCHAR(12) NOT NULL,
  CONSTRAINT Quartier_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Situation
-- ----------------------------
CREATE TABLE Situation (
  id INT NOT NULL AUTO_INCREMENT,
  fk_situation VARCHAR(12),
  CONSTRAINT Situation_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Pied
-- ----------------------------
CREATE TABLE Pied (
  id INT NOT NULL AUTO_INCREMENT,
  fk_pied VARCHAR(12),
  CONSTRAINT Pied_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Secteur
-- ----------------------------
CREATE TABLE Secteur (
  id INT NOT NULL AUTO_INCREMENT,
  Secteur VARCHAR(12) NOT NULL,
  id_Quartier INT,
  CONSTRAINT Secteur_PK PRIMARY KEY (id),
  CONSTRAINT Secteur_id_Quartier_FK FOREIGN KEY (id_Quartier) REFERENCES Quartier (id)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Arbres
-- ----------------------------
CREATE TABLE Arbres (
  global_id VARCHAR(304) NOT NULL,
  x FLOAT,
  y FLOAT,
  haut_tot INT NOT NULL,
  haut_tronc INT NOT NULL,
  tronc_diam INT NOT NULL,
  dte_plantation DATE,
  dte_abattage DATE,
  age_estim INT,
  clc_nbr_diag INT,
  id INT,
  id_Etat INT,
  id_Feuillage INT,
  id_Nom_technique INT,
  id_Revetement INT,
  id_Port INT,
  id_Pied INT,
  id_Situation INT,
  id_remarquable INT,
  id_Stade_developpement INT,
  CONSTRAINT Arbres_PK PRIMARY KEY (global_id),
  CONSTRAINT Arbres_id_FK FOREIGN KEY (id) REFERENCES Secteur (id),
  CONSTRAINT Arbres_id_Etat_FK FOREIGN KEY (id_Etat) REFERENCES Etat (id),
  CONSTRAINT Arbres_id_Feuillage_FK FOREIGN KEY (id_Feuillage) REFERENCES Feuillage (id),
  CONSTRAINT Arbres_id_Revetement_FK FOREIGN KEY (id_Revetement) REFERENCES Revetement (id),
  CONSTRAINT Arbres_id_Port_FK FOREIGN KEY (id_Port) REFERENCES Port (id),
  CONSTRAINT Arbres_id_Pied_FK FOREIGN KEY (id_Pied) REFERENCES Pied (id),
  CONSTRAINT Arbres_id_Situation_FK FOREIGN KEY (id_Situation) REFERENCES Situation (id),
  CONSTRAINT Arbres_id_remarquable_FK FOREIGN KEY (id_remarquable) REFERENCES remarquable (id)
)ENGINE=InnoDB;


-- ===== FOREIGN KEYS =====

ALTER TABLE Arbres
  ADD CONSTRAINT Arbres_id_Nom_technique_FK FOREIGN KEY (id_Nom_technique)
  REFERENCES `Nom_technique` (id);

ALTER TABLE Arbres
  ADD CONSTRAINT Arbres_id_Stade_developpement_FK FOREIGN KEY (id_Stade_developpement)
  REFERENCES `Stade_developpement` (id);
