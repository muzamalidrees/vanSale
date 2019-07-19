import React from 'react';
import {
  MDBNavbar, MDBNavbarBrand, MDBNavbarToggler
} from "mdbreact";
import HeaderNav from './sections/HeaderNav';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };

    this.onClick = this.onClick.bind(this);

  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  render() {

    return (
      <div>
        <header>
          <MDBNavbar color="black" dark expand="lg" scrolling fixed="top">
            <MDBNavbarBrand>
              <strong className="white-text">Bucket Orders Management</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.onClick} />
            <HeaderNav loggedOut={this.props.loggedOut} loggedIn={this.props.loggedIn} collapse={this.state.collapse} />
          </MDBNavbar>
        </header>
      </div>
    );
  }
}

export default Header