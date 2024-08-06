import CharacterCard from './components/Card';
import './App.css';
import { Spinner, Container, Row, Col, Badge, InputGroup, FormControl } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CharModal from './components/Modal';
import Pagination from './components/Pagination';

function App() {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const isLoading = !fetchError && !data;
  const debounceTimer = useRef(null);

  useEffect(() => {
    const fetchCharacters = async (query) => {
      try {
        const url = `https://swapi.dev/api/people?search=${query}`;
        const response = await axios.get(url);
        setData(response.data);
        setFetchError(null);
      } catch (error) {
        setFetchError('Failed to fetch data. Please try again later.');
        setData(null);
      }
    };

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery === '') {
      fetchCharacters('');
    } else {
      debounceTimer.current = setTimeout(() => {
        fetchCharacters(searchQuery);
      }, 500);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCharacterSelect = (index) => {
    setActiveCharacter(data.results[index]);
  };

  return (
    <>
      <Row style={{ marginBottom: '5%' }}>
        <Col xs={12} md={8} lg={6}>
          <InputGroup>
            <FormControl
              placeholder="Search for a character"
              onChange={handleSearchInputChange}
            />
          </InputGroup>
        </Col>
      </Row>
      {isLoading && <Spinner />}
      {fetchError && <p className="text-danger">{fetchError}</p>}
      {data && !fetchError && (
        <Container fluid>
          {searchQuery && data.count === 0 && (
            <Badge bg="danger">Please enter a valid character name</Badge>
          )}
          <Row xs={1} md={2} lg={4}>
            {data.results.map((character, index) => (
              <Col key={character.name}>
                <CharacterCard
                  props={character}
                  onClick={() => handleCharacterSelect(index)}
                />
              </Col>
            ))}
          </Row>
          <Pagination setResponse={setData} setError={setFetchError} count={data.count} search={searchQuery} />
        </Container>
      )}
      {activeCharacter && (
        <CharModal
          characterDetails={activeCharacter}
          onHide={() => setActiveCharacter(null)}
        />
      )}
    </>
  );
}

export default App;
