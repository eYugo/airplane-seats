import { React, useState, useEffect } from 'react';
import { Button, Card, Container, Col, Row } from 'react-bootstrap';
import utils from '../utils/utils';
import reservationsAPI from '../services/api-reservations';
import CancelReservationModal from '../components/CancelReservationModal';

const MyReservationsPage = (props) => {
    const { user } = props;

    const [dirty, setDirty] = useState(false);
    const [reservations, setReservations] = useState([]);

    const separateReservationsByType = (reservationsList) => {
        const result = [];
        reservationsList.map(({ id, airplane_type, row, col }) => {
            const existingType = result.findIndex(item => item.type === airplane_type);
            if (existingType !== -1) {
                result[existingType].reservedSeats.push({ id, row, col });
            } else {
                result.push({ type: airplane_type, reservedSeats: [{ id, row, col }] });
            }
        });
        return result;
    }

    useEffect(() => {
        if (user) {
            reservationsAPI.getReservations(user.id)
                .then(clientReservations => {
                    setReservations(separateReservationsByType(clientReservations));
                    setDirty(false);
                })
                .catch(e => {
                    console.log(e); setDirty(false);
                });
        }
    }, [user, dirty]);

    return (
        <Container className='text-center my-4'>
            <h2>My reservations:</h2>
            <Row className='mt-4'>
                {
                    reservations.map(({ type, reservedSeats }) => (
                        <Col key={type} className='d-flex justify-content-center'>
                            <Card style={{ width: '18rem' }} className='d-flex flex-column mb-auto'>
                                <Card.Body>
                                    <Card.Title>{type} flight</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Seats</Card.Subtitle>
                                    <Card.Text>
                                        {reservedSeats.map(({ id, row, col }) => (
                                            <Button key={id} style={{
                                                width: '35px',
                                                height: '35px',
                                                fontSize: '13px',
                                                padding: '0',
                                            }} variant='primary' className='m-1'>{utils.formatNumber(row)}{col}</Button>
                                        ))}
                                    </Card.Text>
                                    <CancelReservationModal type={type} reservedSeats={reservedSeats} dirty={dirty} setDirty={setDirty} />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
            </Row>
        </Container>
    )
}

export default MyReservationsPage