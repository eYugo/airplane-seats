import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './components.css'; // Import custom CSS file
import utils from '../utils/utils';

const SeatCounter = (props) => {
  const Legend = [
    { variant: 'danger', status: 'Occupied' },
    { variant: 'success', status: 'Available' },
    { variant: 'secondary', status: 'Requested' },
  ];

  const { airplane, numSeats } = props;

  return (
    <Container>
      <h5 className='mt-5'>Counter:</h5>
      {Legend.map(({ variant, status }) => (
        <p key={variant}>
          <Button variant={variant} className="custom-button my-1 me-1" >{utils.countSeats(airplane, status)}</Button>
          {status}
        </p>
      ))}
      <p>Total: {numSeats}</p>
    </Container>
  );
};

export default SeatCounter;
