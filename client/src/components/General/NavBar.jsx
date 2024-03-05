import { Container, Nav, Navbar, Image } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../assets/airplane.png'

const NavBar = (props) => {
  const { handleLogout, isLoggedIn } = props

  const navigate = useNavigate();

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      navigate("/");
      handleLogout();
    }
    else {
      navigate("/login");
    }
  }

  return (
    <Navbar bg="primary" expand="sm" variant="dark" >
      <Container>
        <Navbar.Brand href="#home" style={{ color: "white" }} variant="pills">
          <Image src={Icon} width={30} height={30} fluid />{' '}
          Polito Airways
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='me-auto ms-5 justify-content-end ' >
            <Nav.Link as={Link} to="/" >
              Home
            </Nav.Link>
            {
              isLoggedIn ?
                <Nav.Link
                  as={Link}
                  to="/reservations">
                  My Reservations
                </Nav.Link> :
                ''
            }
            <Nav.Link onClick={handleLoginLogoutClick}>
              {isLoggedIn ? "Logout" : "Login"}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;