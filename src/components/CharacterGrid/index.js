import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CharacterCard from '../CharacterCard';

const CharacterGrid = ({ data, handleCharacterSelect }) => (
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
);

export default CharacterGrid;
