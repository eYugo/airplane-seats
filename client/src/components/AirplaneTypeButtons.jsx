import { React } from 'react';
import { Row, ButtonGroup, Button } from 'react-bootstrap';

const AirplaneTypeButtons = (props) => {
    return (
        <Row>
            <h4 className="text-center my-4">Select an Flight Type</h4>
            <ButtonGroup vertical>
                <Button variant="primary" className='mt-4' onClick={() => props.setAirplaneType('local')} active={props.airplaneType === 'local'}>local</Button>
                <Button variant="primary" className='' onClick={() => props.setAirplaneType('regional')} active={props.airplaneType === 'regional'}>regional</Button>
                <Button variant="primary" className='' onClick={() => props.setAirplaneType('international')} active={props.airplaneType === 'international'}>international</Button>
            </ButtonGroup>
        </Row>
    )
}

export default AirplaneTypeButtons;