import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Modal, Row, Col, Spinner, Alert } from "react-bootstrap";

export default function CharModal({ onHide, characterDetails }) {
  const [planetDetails, setPlanetDetails] = useState(null);
  const [error, setError] = useState(null);

  const created = new Date(characterDetails.created);
  const yyyy = created.getFullYear();
  let mm = created.getMonth() + 1; // Months start at 0!
  let dd = created.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  characterDetails = { ...characterDetails, height: characterDetails.height / 100 };
  const formattedDate = dd + '/' + mm + '/' + yyyy;

  useEffect(() => {
    const fetchPlanetDetails = async () => {
      try {
        const response = await axios.get(characterDetails.homeworld);
        setPlanetDetails(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchPlanetDetails();
  }, [characterDetails.homeworld]);

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {characterDetails.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={6}>
              <h3>Height: <span><h5>{characterDetails.height} meters</h5></span></h3>
              <h3>Mass: <span><h5>{characterDetails.mass} kg</h5></span></h3>
              <h3>Date Added: <span><h5>{formattedDate}</h5></span></h3>
            </Col>
            <Col xs={6}>
              <h3>Films: <span><h5>{characterDetails.films.length}</h5></span></h3>
              <h3>Date of Birth: <span><h5>{characterDetails.birth_year}</h5></span></h3>
            </Col>
          </Row>
          {error && <Alert variant="danger">Error: {error}</Alert>}
          {planetDetails ? (
            <>
              <Modal.Header>
                <Modal.Title id="example-modal-sizes-title-lg">
                  HOMEWORLD
                </Modal.Title>
              </Modal.Header>
              <Row>
                <Col>
                  <h3>Name <span><h5>{planetDetails.name}</h5></span></h3>
                  <h3>Climate <span><h5>{planetDetails.climate}</h5></span></h3>
                </Col>
                <Col>
                  <h3>Residents <span><h5>{planetDetails.residents.length}</h5></span></h3>
                  <h3>Terrain <span><h5>{planetDetails.terrain}</h5></span></h3>
                </Col>
              </Row>
            </>
          ) : (
            !error && <Spinner />
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
}
