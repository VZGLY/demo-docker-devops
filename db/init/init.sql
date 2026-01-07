-- Créer la table person si elle n'existe pas
CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    nom TEXT NOT NULL
);

-- Insérer des données de test
INSERT INTO person (nom) VALUES 
    ('Alice Durand'),
    ('Bob Martin'),
    ('Charlie Dupont')
ON CONFLICT DO NOTHING;
