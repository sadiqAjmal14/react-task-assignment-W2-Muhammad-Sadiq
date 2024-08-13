import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import FilterOptions from '../Filter';
import { FaSync } from 'react-icons/fa';

const HeaderSection = ({ userName, handleLogout, handleRefresh, isRefreshed,filter,setFilter}) => (
    <Row className="justify-content-between mb-4">
        <Col xs="auto">
            {userName && <h2>Welcome, {userName}</h2>}
        </Col>
        <Col xs="auto">
            <FilterOptions filter={filter} setFilter={setFilter}/>
        </Col>
        <Col xs="auto">
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            <Button variant="outline-light" onClick={handleRefresh} className="ms-2">
                <FaSync className={isRefreshed ? "refresh-icon" : null} />
            </Button>
        </Col>
    </Row>
);

export default HeaderSection;
