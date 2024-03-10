import { React, useState } from 'react';
import { Row, Button, Alert } from 'react-bootstrap';
import './components.css'; // Import custom CSS file
import utils from '../utils/utils';

const Airplane = (props) => {
    const { isLoggedIn } = props;

    const [show, setShow] = useState(false);

    // Generate seat numbers for each row
    const generateSeats = () => {

        const variant = {
            "Available": "success",
            "Occupied": "danger",
            "Requested": "secondary",
            "Highlighted": "warning"
        }

        const airplaneRows = [];

        const handleClick = (F, P, status) => {
            const updatedAirplanes = { ...props.airplanes };
            updatedAirplanes[props.airplaneType][F][P] = status == 'Available' ? 'Requested' : (status == 'Requested' ? 'Available' : 'Occupied')
            props.setAirplanes(updatedAirplanes);
        }

        for (let row = 1; row <= props.airplaneConfig[props.airplaneType].numRows; row++) {
            const airplaneRow = props.airplanes[props.airplaneType][row]
            const seatsInRow = [];
            for (let seat = 65; seat < props.airplaneConfig[props.airplaneType].numSeatsPerRow + 65; seat++) {
                const letter = String.fromCharCode(seat);
                seatsInRow.push(
                    <Button key={'button' + row + letter}
                        variant={variant[airplaneRow[letter]]}
                        className={props.airplaneConfig[props.airplaneType].seatsLayout[letter]}
                        onClick={() => { isLoggedIn ? handleClick(row, letter, airplaneRow[letter]) : setShow(true) }}
                    >
                        {utils.formatNumber(row)}{letter}
                    </Button>
                );
            }
            airplaneRows.push(
                <Row key={row} className="justify-content-center">
                    {seatsInRow}
                </Row>
            );
        }
        return [...airplaneRows]
    };

    return (
        <div className='my-4'>
            <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger">
                Perform Login to Request a Seat
            </Alert>
            <h3 className="text-center my-4">Airplane {props.airplaneType}</h3>
            {generateSeats()}
        </div>
    );
};

export default Airplane;
