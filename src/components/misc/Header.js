import React from 'react';
import {
  MDBNavbar, MDBNavbarBrand, MDBNavbarToggler
} from "mdbreact";
import HeaderNav from './sections/HeaderNav';
import { Redirect } from 'react-router-dom'


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
              <strong style={{marginLeft:'15px', letterSpacing: '3px' }} className="white-text">VanSales</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={this.onClick} />
            <HeaderNav loggingOut={this.props.loggingOut} loggedIn={this.props.loggedIn} collapse={this.state.collapse} />
          </MDBNavbar>
        </header>
      </div>
    );
  }
}

export default Header