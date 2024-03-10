import { React, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import utils from '../utils/utils';

const AutoReservationForm = (props) => {
    const { formValues, setDirty, setFormValues, setIsConfirm } = props;
    const { airplaneType, setAirplaneType } = props;

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        name == "flightType" ? setAirplaneType(value) : null
        setFormValues({ ...formValues, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        setDirty(true);
    };

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            setIsConfirm(true)
        }
    }, [formErrors])

    const validate = (values) => {
        const errors = {};
        const availableSeats = utils.countSeats(props.airplanes[values.flightType], 'Available')
        if (!values.flightType) {
            errors.flightType = "Flight Type is required!"
        }
        if (!values.numberOfSeats) {
            errors.numberOfSeats = "Number of seats is required!"
        }
        else if (values.numberOfSeats <= 0) {
            errors.numberOfSeats = "Type a valid number!"
        }
        else if (values.numberOfSeats > availableSeats) {
            errors.numberOfSeats = `There are ${availableSeats} seats available in this flight!`
        }
        return errors;
    }

    return (
        <Form onSubmit={handleSubmit} id='AutoReservationForm'>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Choose the flight type:</Form.Label>
                <Form.Select name="flightType" value={airplaneType} onChange={handleChange}>
                    <option value="local">local</option>
                    <option value="regional">regional</option>
                    <option value="international">international</option>
                </Form.Select>
            </Form.Group>
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
            >
                <Form.Label>Type the number of seats:</Form.Label>
                <Form.Control type="number" name="numberOfSeats" value={formValues.numberOfSeats} onChange={handleChange} isInvalid={formErrors.numberOfSeats ? true : false} />
                <Form.Control.Feedback type="invalid">
                    {formErrors.numberOfSeats}
                </Form.Control.Feedback>
            </Form.Group>
        </Form>
    )
}

export default AutoReservationForm;