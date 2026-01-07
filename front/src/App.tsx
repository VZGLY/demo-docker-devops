import { useState, useEffect, type FormEvent } from 'react';

interface Person {
  id: number;
  nom: string;
}

interface APIError {
  message: string;
}

function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [nom, setNom] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<APIError | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/persons`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data: Person[] = await response.json();
      setPersons(data);
    } catch (err) {
      setError({ message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!nom.trim()) return;

    try {
      setError(null);
      const response = await fetch(`${API_URL}/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: nom.trim() }),
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const newPerson: Person = await response.json();
      setPersons([newPerson, ...persons]);
      setNom('');
    } catch (err) {
      setError({ message: (err as Error).message });
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gestion des personnes</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom de la personne"
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          required
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Ajouter
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {persons.map((person) => (
          <li key={person.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            ID: {person.id} - {person.nom}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
