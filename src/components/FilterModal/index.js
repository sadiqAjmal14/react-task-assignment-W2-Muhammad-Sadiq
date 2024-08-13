import React from "react";
import { Button, Modal, Spinner, Alert } from "react-bootstrap";

const FilterModal = ({
    showModal,
    setShowModal,
    filterOptions,
    filterType,
    loading,
    error,
    setSelectedOption,
    handlePageChange,
}) => {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Select {filterType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <Spinner animation="border" role="status" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {filterOptions?.results?.map((option) => (
                    <Button
                        key={option.url}
                        variant="outline-secondary"
                        className="w-100 mb-2"
                        onClick={()=>setSelectedOption(option)}
                    >
                        {filterType === "film" ? option.title : option.name}
                    </Button>
                ))}
                <div className="pagination-controls mt-2 d-flex justify-content-between">
                    <Button
                        variant="outline-secondary"
                        onClick={() => handlePageChange(filterOptions?.previous)}
                        disabled={!filterOptions?.previous}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={() => handlePageChange(filterOptions?.next)}
                        disabled={!filterOptions?.next}
                    >
                        Next
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FilterModal;
