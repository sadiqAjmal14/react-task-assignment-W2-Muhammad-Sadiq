import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CharacterGrid from '../CharacterGrid';
import CharacterModal from '../CharacterModal';
import useFetchCharacters from '../../hooks/useFetchCharacters';
import Pagination from '../Pagination';
import LoadingPage from '../LoadingPage';
import { LoginStateContext } from '../../context/loginStateContext';
import SearchSection from '../SearchSection';
import HeaderSection from '../HeaderSection';
import './styles.css';

const HomePage = () => {
    const [activeCharacter, setActiveCharacter] = useState(JSON.parse(localStorage.getItem('activeCharacter')));
    const [searchQuery, setSearchQuery] = useState(JSON.parse(localStorage.getItem('searchQuery')) || '');
    const [filter, setFilter] = useState(null);
    const { characters, loading, fetchError, totalPages, currentPage, setPage, next, prev } = useFetchCharacters(searchQuery, filter);
    const { token, userName, setToken, setUserName } = useContext(LoginStateContext);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const navigate = useNavigate();
    const handleLogout = useCallback(() => {
        localStorage.clear();
        setToken(null);
        navigate('/login');
    },[setToken,navigate])
    
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('https://dummyjson.com/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUserName(`${response.data.firstName} ${response.data.lastName}`);
            } catch {
                handleLogout();
            }
        };

        verifyToken();
        const intervalId = setInterval(verifyToken, 300000);
        return () => clearInterval(intervalId);
    }, [navigate, token, setUserName,handleLogout]);

    const handleSearchInputChange = useCallback((e) => setSearchQuery(e.target.value), []);
    const handleCharacterSelect = useCallback((index) => setActiveCharacter(characters[index]), [characters]);

    const handleRefresh = () => {
        setIsRefreshed(true);
        setActiveCharacter(null);
        setSearchQuery('');
        setFilter(null);
        setPage(1);
        localStorage.removeItem('activeCharacter');
        localStorage.removeItem('searchQuery');
        setIsRefreshed(false);
    };

    return (
        <Container fluid className="p-3">
            <HeaderSection 
                userName={userName} 
                handleLogout={handleLogout} 
                handleRefresh={handleRefresh} 
                isRefreshed={isRefreshed} 
                filter={filter}
                setFilter={setFilter}
            />
            <SearchSection 
                searchQuery={searchQuery} 
                handleSearchInputChange={handleSearchInputChange} 
            />
            {loading && <LoadingPage />}
            {fetchError && <p className="text-danger">{fetchError}</p>}
            {!loading && characters && (
                <>
                    {searchQuery && characters.length === 0 && (
                        <Badge bg="danger" className="mb-3">Please enter a valid character name</Badge>
                    )}
                    <CharacterGrid 
                        data={characters} 
                        handleCharacterSelect={handleCharacterSelect} 
                    />
                </>
            )}
            {activeCharacter && (
                <CharacterModal
                    characterDetails={activeCharacter}
                    onHide={() => setActiveCharacter(null)}
                />
            )}
            
            <Row className="mt-4">
                <Col className="d-flex justify-content-end">
                    <Pagination
                        totalPages={totalPages}
                        activePage={currentPage}
                        setActivePage={setPage}
                        next={next}
                        prev={prev}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
