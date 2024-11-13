import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import IconApp from '../assets/timeline.png'

export default function Navigation() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavLink className="navbar-brand" to='/'><img
              alt=""
              src={IconApp}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}Tiempos de Trabajo</NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink className="nav-link" to='/'>Inicio</NavLink>
            <NavLink className="nav-link" to='/codigo-tareas'>Codigos de tareas</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}