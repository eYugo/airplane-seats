import { React, useEffect } from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import utils from '../utils/utils';
import reservationsAPI from '../services/api-reservations';

const AutoReservationConfirm = (props) => {
    const { airplanes, formValues, handleClose, occupiedSelectedSeats, setDirty, setSubmitConfirm, setOccupiedSelectedSeats, submitConfirm, user } = props;

    // function to generate automatic reservation
    const generateAutoReservation = (airplane, numberOfSeats) => {
        let counter = 0;
        const seats = [];
        for (const row in airplane) {
            for (const col in airplane[row]) {
                if (airplane[row][col] == "Available" && counter < numberOfSeats) {
                    seats.push({ row: parseInt(row), col });
                    counter++;
                }
            }
        }
        return seats
    };

    const reservedSeats = generateAutoReservation(airplanes[formValues.flightType], formValues.numberOfSeats)

    // function to check if the selected seats were occupied
    const checkSelectedSeatsAndAdd = async () => {
        try {
            const occupiedSeats = []
            const reservations = await reservationsAPI.getAllReservations();
            reservedSeats.map(({ row, col }) => (
                reservations.map((reservation) => {
                    if (reservation.airplane_type == formValues.flightType && reservation.row == row && reservation.col == col) {
                        occupiedSeats.push(reservation);
                    }
                })
            ))
            setOccupiedSelectedSeats(occupiedSeats);
            console.log(occupiedSeats)

            const reservationsToAdd = [];
            if (occupiedSeats.length == 0) {
                reservedSeats.map(({ row, col }) => (
                    reservationsToAdd.push({ "airplane_type": formValues.flightType, "row": row, "col": col, "user_id": user.id })
                ))
                reservationsAPI.addReservations(reservationsToAdd)
                    .then(() => { setDirty(true); setSubmitConfirm(false) })
                    .catch(e => console.log(e))
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleConfirm = () => {
        checkSelectedSeatsAndAdd();
        setDirty(true);
        handleClose();
    }

    useEffect(() => {
        if (submitConfirm) {
            handleConfirm();
        }
    }, [submitConfirm])

    return (
        <Col className='d-flex justify-content-center'>
            <Card style={{ width: '14rem' }} className='d-flex flex-column mb-auto'>
                <Card.Body>
                    <Card.Title>{formValues.flightType} flight</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Requested Seats</Card.Subtitle>
                    <Card.Text>
                        {reservedSeats.map(({ row, col }) => (
                            <Button style={{
                                width: '35px',
                                height: '35px',
                                fontSize: '13px',
                                padding: '0',
                            }} variant='secondary' className='m-1'>{utils.formatNumber(row)}{col}</Button>
                        ))}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default AutoReservationConfirm;