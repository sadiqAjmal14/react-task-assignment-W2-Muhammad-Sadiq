import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

function CharacterCard({ props, onClick }) {

  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState('Unknown');
  const [error, setError] = useState(null);
  
  function toHex(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }


  useEffect(() => {
    const fetchImage = async () => {
      try {
        const characterId = props.url.match(/\/([0-9]+)\/$/)[1];
        const imageUrl = `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`;
        setImage(imageUrl);
      } catch (error) {
        setError('Failed to load image');
      }
    };

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

    fetchImage();
    fetchSpecies();
  }, [props.species, props.url]);

  return (
    <Button
      onClick={onClick}
      className='btn btn-outline-dark'
      style={{ marginBottom: '25%', backgroundColor: '#' + toHex(species).slice(0, 4) }}
    >
      <Card className='card-hover' style={{ width: '15rem', backgroundColor: '#' + toHex(species).slice(0, 4) }}>
        {error && error.includes('image') ? (
          <Alert variant="danger">Failed to load image</Alert>
        ) : (
          image ? <Card.Img variant="top" src={image} alt={props.name} onError={() => setError('Failed to load image')} /> : <Spinner />
        )}
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
         {species&& <Card.Text> Species:{" "+species}</Card.Text>}
          {error && error.includes('species') && <Alert variant="warning">Failed to load species</Alert>}
        </Card.Body>
      </Card>
    </Button>
  );
}

export default CharacterCard;
