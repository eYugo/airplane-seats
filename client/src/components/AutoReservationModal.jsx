import React, { useState } from 'react';
import { Button, Modal, Card, Col, Row, Container, Form } from 'react-bootstrap';
import AutoReservationForm from './AutoReservationForm';
import AutoReservationConfirm from './AutoReservationConfirm';

const AutoReservationModal = (props) => {

    const [formValues, setFormValues] = useState({ flightType: 'local', numberOfSeats: '' });
    const [isConfirm, setIsConfirm] = useState(false);
    const [show, setShow] = useState(false);
    const [submitConfirm, setSubmitConfirm] = useState(false);

    const handleClose = () => { setShow(false); setIsConfirm(false) };
    const handleShow = () => { setShow(true); setIsConfirm(false) };

    return (
        <>
            <Button variant='primary' className='mx-5 my-5' onClick={handleShow}>Auto generate your reservation!</Button>

            <Modal

                show={show}
                onHide={handleClose}
                keyboard={false}
                centered
                className='text-center'

            >
                <Modal.Header closeButton>
                    <Modal.Title >Auto Reservation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col></Col>
                        <Col xs={6}>
                            {
                                isConfirm ?
                                    <AutoReservationConfirm
                                        formValues={formValues}
                                        airplanes={props.airplanes}
                                        setAirplanes={props.setAirplanes}
                                        submitConfirm={submitConfirm}
                                        setSubmitConfirm={setSubmitConfirm}
                                        setDirty={props.setDirty}
                                        handleClose={handleClose}
                                        user={props.user}
                                        occupiedSelectedSeats={props.occupiedSelectedSeats}
                                        setOccupiedSelectedSeats={props.setOccupiedSelectedSeats}
                                    /> :
                                    <AutoReservationForm
                                        airplaneType={props.airplaneType}
                                        setAirplaneType={props.setAirplaneType}
                                        formValues={formValues}
                                        setFormValues={setFormValues}
                                        setIsConfirm={setIsConfirm}
                                        airplanes={props.airplanes}
                                        setDirty={props.setDirty} />
                            }
                        </Col>
                        <Col></Col>
                    </Row>
                </Modal.Body>
                <Row className='my-4' >
                    <Col></Col>
                    <Col xs={6}>
                        {
                            isConfirm ?
                                <Button
                                    className='mx-2'
                                    variant="primary"
                                    onClick={() => setSubmitConfirm(true)}>
                                    Confirm
                                </Button> :
                                <Button
                                    className='mx-2'
                                    variant="primary"
                                    type='submit'
                                    form='AutoReservationForm'>
                                    Confirm
                                </Button>
                        }
                        <Button
                            className='mx-2 link-danger'
                            variant="link"
                            onClick={handleClose}>
                            Cancel
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Modal>
        </>
    );
}

export default AutoReservationModal;