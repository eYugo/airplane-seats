import { React, useState, useEffect } from 'react';
import Airplane from '../components/Airplane';
import SeatCounter from '../components/SeatCounter';
import AirplaneTypeButtons from '../components/AirplaneTypeButtons';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { airplanesData, airplaneConfigData } from '../data/airplane';
import ReservationModal from '../components/ReservationModal';
import reservationsAPI from '../services/api-reservations';
import AutoReservationModal from '../components/AutoReservationModal';

const MainPage = (props) => {
    const airplaneConfig = airplaneConfigData

    const { isLoggedIn, user } = props;

    const [airplanes, setAirplanes] = useState(airplanesData);
    const [airplaneType, setAirplaneType] = useState("local");
    const [dirty, setDirty] = useState(false);
    const [occupiedSelectedSeats, setOccupiedSelectedSeats] = useState([]);
    const [show, setShow] = useState(false);

    const clearSeats = (airplanes) => {
        const clearAirplanes = { ...airplanes }
        for (const type in airplanes) {
            for (const row in airplanes[type]) {
                for (const col in airplanes[type][row]) {
                    clearAirplanes[type][row][col] = 'Available'
                }
            }
        }

        return clearAirplanes;
    }

    const setUpAirplanes = (reservedSeats) => {
        const updatedAirplanes = { ...clearSeats(airplanes) };
        reservedSeats.map(({ airplane_type, row, col }) => {
            updatedAirplanes[airplane_type][row][col] = 'Occupied';
        })
        occupiedSelectedSeats.map(({ airplane_type, row, col }) => {
            updatedAirplanes[airplane_type][row][col] = 'Highlighted';
        })
        setAirplanes(updatedAirplanes)
    }

    useEffect(() => {
        reservationsAPI.getAllReservations()
            .then(clientReservations => {
                setUpAirplanes(clientReservations);
                setDirty(false);
            })
            .catch(e => {
                console.log(e); setDirty(false);
            });
        // If there are occupiedSelectedSeats
        // a timer activate for 5 minutes to highlight the occupiedSelectedSeats
        if (!(occupiedSelectedSeats.length === 0)) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setOccupiedSelectedSeats([]);
                setDirty(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [dirty]);

    return (
        <Container>
            <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger">
                Selected Seats have already been occupied!
            </Alert>
            <Row>
                <Col className="justify-content-center">
                    <AirplaneTypeButtons
                        airplaneType={airplaneType}
                        setAirplaneType={setAirplaneType}
                    />
                    {
                        isLoggedIn ?
                            <AutoReservationModal
                                airplanes={airplanes}
                                setAirplanes={setAirplanes}
                                setDirty={setDirty}
                                user={user}
                                occupiedSelectedSeats={occupiedSelectedSeats}
                                setOccupiedSelectedSeats={setOccupiedSelectedSeats}

                            /> :
                            ''
                    }
                </Col>
                <Col xs={6}>
                    <Airplane
                        airplanes={airplanes}
                        setAirplanes={setAirplanes}
                        airplaneType={airplaneType}
                        airplaneConfig={airplaneConfig}
                        user={user}
                        isLoggedIn={isLoggedIn}
                        occupiedSelectedSeats={occupiedSelectedSeats}
                        setOccupiedSelectedSeats={setOccupiedSelectedSeats}
                    />
                </Col>
                <Col>
                    <SeatCounter
                        airplane={airplanes[airplaneType]}
                        numSeats={airplaneConfig[airplaneType].numSeats}
                    />
                    {
                        isLoggedIn ?
                            <ReservationModal
                                airplanes={airplanes}
                                setAirplanes={setAirplanes}
                                setDirty={setDirty}
                                user={user}
                                occupiedSelectedSeats={occupiedSelectedSeats}
                                setOccupiedSelectedSeats={setOccupiedSelectedSeats}
                            /> :
                            ''
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default MainPage