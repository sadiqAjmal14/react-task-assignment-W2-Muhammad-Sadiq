import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

function CharacterCard({ props, onClick }) {
  const [species, setSpecies] = useState('Unknown');
  const [error, setError] = useState(null);

  function toHex(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

  const characterId = props.url.match(/\/([0-9]+)\/$/)[1];

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        if (props.species.length > 0) {
          const response = await axios.get(props.species[0]);
          setSpecies(response.data.name);
        }
      } catch (err) {
        setError('Failed to load species');
      }
    };
    fetchSpecies();
  }, [props.species]);

  return (
    <Button
      onClick={onClick}
      style={{
        appearance: 'none',
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <Card
        className="card-hover"
        style={{
          width: '15rem',
          backgroundColor: '#' + toHex(species).slice(0, 4),
          transition: 'background-color 0.3s ease, transform 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#' + toHex(species).slice(0, 6);
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#' + toHex(species).slice(0, 4);
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {error && error.includes('image') ? (
          <Alert variant="danger">Failed to load image</Alert>
        ) : (
          <Card.Img variant="top" src={`https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`} alt={props.name} onError={() => setError('Failed to load image')} />
        )}
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          {species && <Card.Text>Species: {species}</Card.Text>}
          {error && error.includes('species') && <Alert variant="warning">Failed to load species</Alert>}
        </Card.Body>
      </Card>
    </Button>
  );
}

export default CharacterCard;
