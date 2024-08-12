import { Container, Row, Col, Badge, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CharacterCard from '../Card';
import CharModal from '../Modal';
import useFetchCharacters from '../../hooks/useFetchCharacters';
import Pagination from '../Pagination';
import LoadingPage from '../LoadingPage';
import { LoginStateContext } from '../../context/loginStateContext';

function HomePage() {
    const [activeCharacter, setActiveCharacter] = useState(JSON.parse(localStorage.getItem('activeCharacter')));
    const [searchQuery, setSearchQuery] = useState(JSON.parse(localStorage.getItem('searchQuery')) || '');
    const { data, isLoading, fetchError, totalPages, currentPage, setCurrentPage, next, prev } = useFetchCharacters(searchQuery);
    const setSearch = (search) => {
        setSearchQuery(search);
        localStorage.setItem('searchQuery', JSON.stringify(search));
    }
    const setCharacter = (character) => {
        setActiveCharacter(character);
        localStorage.setItem('activeCharacter', JSON.stringify(character));
    }
    const { token, userName, setToken, setUserName } = useContext(LoginStateContext);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = token;
            if (!storedToken) {
                navigate('/login');
            } else {
                try {
                    const response = await axios.get('https://dummyjson.com/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });
                    setUserName(response.data.firstName + " " + response.data.lastName);
                } catch (error) {
                    console.error('Error:', error);
                    setToken(null);
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        verifyToken();
        const intervalId = setInterval(verifyToken, 600000);
        return () => clearInterval(intervalId);
    }, [navigate, setToken, setUserName, token]);

    const handleSearchInputChange = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    const handleCharacterSelect = useCallback((index) => {
        setCharacter(data[index]);
    }, [data]);

    const handleLogout = () => {
        localStorage.clear();
        setToken(null);
        navigate('/login');
    };

    return (
        <Container fluid className="p-3">
            <Row className="justify-content-between mb-4">
                <Col xs="auto">
                    {userName && <h2>Welcome, {userName}</h2>}
                </Col>
                <Col xs="auto">
                </Col>
                <Col xs="auto">
                    <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                </Col>
            </Row>
            <Row className="justify-content-center mb-4">
                <Col xs={12} md={8} lg={6}>
                    <InputGroup>
                        <FormControl
                            placeholder="Search for a character"
                            onChange={handleSearchInputChange}
                            className="shadow-sm"
                        />
                    </InputGroup>
                </Col>
            </Row>
            {isLoading && <LoadingPage />}
            {!isLoading && fetchError && <p className="text-danger">{fetchError}</p>}
            {!isLoading && data && !fetchError && (
                <>
                    {searchQuery && totalPages === 0 && (
                        <Badge bg="danger" className="mb-3">Please enter a valid character name</Badge>
                    )}
                    <Row xs={1} md={2} lg={4} className="g-4">
                        {data.map((character, index) => (
                            <Col key={character.name}>
                                <CharacterCard
                                    props={character}
                                    onClick={() => handleCharacterSelect(index)}
                                />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
            {activeCharacter && (
                <CharModal
                    characterDetails={activeCharacter}
                    onHide={() => setActiveCharacter(null)}
                />
            )}
            <Row className="mt-4">
                <Col className="d-flex justify-content-end">
                    <Pagination
                        totalPages={totalPages}
                        activePage={currentPage}
                        setActivePage={setCurrentPage}
                        next={next}
                        prev={prev}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;