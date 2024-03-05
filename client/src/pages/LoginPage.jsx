import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const LoginPage = (props) => {
    const { handleLogin } = props;

    const location = useLocation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [formValues, setFormValues] = useState({ username: '', password: '' });
    const [show, setShow] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = formValues;

        handleLogin(credentials)
            .then(() => navigate("/"))
            .catch((err) => {
                console.log(err)
                setErrorMessage(err.error); setShow(true);
            });
    };

    return (
        <Container>
            <Row className='justify-content-center my-5'>
                <Col xs={4}>
                    <Form onSubmit={handleSubmit}>
                        <Alert
                            dismissible
                            show={show}
                            onClose={() => setShow(false)}
                            variant="danger">
                            {errorMessage}
                        </Alert>
                        <h1 className='text-center mb-4'>Login</h1>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email"
                                name='username'
                                placeholder="Enter email"
                                value={formValues.username}
                                onChange={handleChange}
                                required={true} />
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                                name='password'
                                placeholder="Enter Password"
                                value={formValues.password}
                                onChange={handleChange}
                                required={true}
                                minLength={6} />
                        </Form.Group>
                        <Row>
                            <Button
                                variant="primary"
                                className='mb-3'
                                type="submit">
                                Log In
                            </Button>
                            <Button
                                variant="link"
                                className='d-flex flex-column me-auto'
                                type="submit"
                                as={Link}
                                to="/register">
                                Don't have an account? Register
                            </Button>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;