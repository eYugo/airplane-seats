import React, { useState } from 'react';
import { Button, Modal, Card, Col, Row, Container } from 'react-bootstrap';
import utils from '../utils/utils';
import reservationsAPI from '../services/api-reservations';

const CancelReservationModal = (props) => {
    const { reservedSeats, setDirty } = props;

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleConfirm = () => {
        reservedSeats.map(({ id }) => (
            reservationsAPI.deleteReservation(id)
                .then(() => { setDirty(true); })
                .catch(e => console.log(e))

        ))
        handleCloseModal();
    }

    return (
        <>
            <Button className='mx-2 link-danger' variant="link" onClick={handleShowModal}>Cancel Reservation</Button>
            <Modal

                show={showModal}
                onHide={handleCloseModal}
                keyboard={false}
                centered
                className='text-center'
            >
                <Modal.Header closeButton>
                    <Modal.Title >Confirm Cancellation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <Card style={{ width: '18rem' }} className='d-flex flex-column mb-auto'>
                                <Card.Body>
                                    <Card.Title>{props.type} flight</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Seats</Card.Subtitle>
                                    <Card.Text>
                                        {props.reservedSeats.map(({ row, col }) => (
                                            <Button style={{
                                                width: '35px',
                                                height: '35px',
                                                fontSize: '13px',
                                                padding: '0',
                                            }} variant='primary' className='m-1'>{utils.formatNumber(row)}{col}</Button>
                                        ))}
                                    </Card.Text>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Row className='mb-4' >
                    <Col></Col>
                    <Col xs={6}>
                        <Button className='mx-2' variant="danger" onClick={handleConfirm}>Confirm</Button>
                        <Button className='mx-2 link-secondary' variant="link" onClick={handleCloseModal}>Go back</Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Modal>
        </>
    );
}

export default CancelReservationModal;