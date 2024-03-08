import React, { useState } from 'react';
import { Button, Modal, Card, Col, Row, Container } from 'react-bootstrap';
import utils from '../utils/utils';
import reservationsAPI from '../services/api-reservations';

const ReservationModal = (props) => {
    const { occupiedSelectedSeats, setDirty, setOccupiedSelectedSeats, user } = props;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // function to get the selected seats of the airplanes and retrieve a list of seats in the format {type, seats}
    const getSelectedSeats = (airplanes) => {
        const result = [];

        for (const type in airplanes) {
            const seats = [];

            for (const row in airplanes[type]) {
                for (const col in airplanes[type][row]) {
                    if (airplanes[type][row][col] == "Requested") {
                        seats.push({ row: parseInt(row), col });
                    }
                }
            }

            result.push({ type, seats });
        }

        return result;
    };

    // function to check if the selected seats were occupied
    const checkSelectedSeats = async () => {
        try {
            const occupiedSeats = []
            const reservations = await reservationsAPI.getAllReservations();
            selectedSeats.map(({ type, seats }) => (
                seats.map(({ row, col }) => (
                    reservations.map((reservation) => {
                        if (reservation.airplane_type == type && reservation.row == row && reservation.col == col) {
                            occupiedSeats.push(reservation);
                        }
                    })
                ))))
            setOccupiedSelectedSeats(occupiedSeats);
        } catch (error) {
            console.log(error)
        }
    };


    const selectedSeats = getSelectedSeats(props.airplanes);

    const handleConfirm = () => {
        checkSelectedSeats();
        const reservationsToAdd = [];
        if (occupiedSelectedSeats.length == 0) {
            selectedSeats.map(({ type, seats }) => (
                seats.map(({ row, col }) => (
                    reservationsToAdd.push({ "airplane_type": type, "row": row, "col": col, "user_id": user.id })
                ))))
            reservationsAPI.addReservations(reservationsToAdd)
                .then(() => { setDirty(true) })
                .catch(e => console.log(e))
        }
        setDirty(true);
        handleClose();
    }

    return (
        <>
            <Button variant='primary' className='mx-2 my-4' onClick={handleShow}>Make Reservation</Button>

            <Modal

                show={show}
                onHide={handleClose}
                keyboard={false}
                centered
                className='text-center'
                size='lg'

            >
                <Modal.Header closeButton>
                    <Modal.Title >Confirm Reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {
                            selectedSeats.map(({ type, seats }, index) => ((seats.length === 0) ? <></> :
                                <Col className='d-flex justify-content-center' key={index}>
                                    <Card style={{ width: '14rem' }} className='d-flex flex-column mb-auto'>
                                        <Card.Body>
                                            <Card.Title>{type} flight</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Requested Seats</Card.Subtitle>
                                            <Card.Text>
                                                {seats.map(({ row, col }, index) => (
                                                    <Button style={{
                                                        width: '35px',
                                                        height: '35px',
                                                        fontSize: '13px',
                                                        padding: '0',
                                                    }} key={index} variant='secondary' className='m-1'>{utils.formatNumber(row)}{col}</Button>
                                                ))}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </Modal.Body>
                <Row className='my-4' >
                    <Col></Col>
                    <Col>
                        <Button className='mx-2' variant="primary" onClick={handleConfirm}>Confirm</Button>
                        <Button className='mx-2 link-danger' variant="link" onClick={handleClose}>Cancel</Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Modal>
        </>
    );
}

export default ReservationModal;