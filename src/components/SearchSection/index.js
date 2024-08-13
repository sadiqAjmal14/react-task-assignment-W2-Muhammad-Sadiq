import React from 'react';
import { Row, Col, InputGroup, FormControl } from 'react-bootstrap';

const SearchSection = ({ searchQuery, handleSearchInputChange }) => (
    <Row className="justify-content-center mb-4">
        <Col xs={12} md={8} lg={6}>
            <InputGroup>
                <FormControl
                    placeholder="Search for a character"
                    onChange={handleSearchInputChange}
                    defaultValue={searchQuery}
                    className="shadow-sm"
                />
            </InputGroup>
        </Col>
    </Row>
);

export default SearchSection;
