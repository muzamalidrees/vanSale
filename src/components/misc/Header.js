import React from 'react';
import {
  MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBNavLink, MDBIcon, MDBRow, MDBCol
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

  reload = () => {
    if (window.Android !== undefined) {
      window.Android.reloadWebview()
    }
  }

  goForward = () => {
    if (window.Android !== undefined) {
      window.Android.goforwardWebview()
    }
  }

  render() {
    return (
      <div>
        <header>
          <MDBNavbar color="black" dark expand="lg" scrolling fixed="top">
            <MDBNavbarToggler left className='actionBarToggler' onClick={this.onClick} />
            <MDBNavbarBrand className='actionBarBrand'>
              <strong style={{ marginLeft: '15px', letterSpacing: '3px' }} className="font-weight-bold white-text">VanSales</strong>
            </MDBNavbarBrand>
            <MDBRow className='p-0 m-0'>
              <MDBCol className='p-0 m-0 actionBarIcons'>
                <MDBNavLink style={{ color: '#FFFFFF' }} onClick={this.reload} to=''><MDBIcon icon="redo" /></MDBNavLink>
              </MDBCol>
              <MDBCol className='m-0 p-0 actionBarIcons'>
                <MDBNavLink style={{ color: '#FFFFFF' }} onClick={this.goForward} to=''><MDBIcon icon="arrow-right" /></MDBNavLink>
              </MDBCol>
              <MDBCol className='p-0 m-0'>
              </MDBCol>
            </MDBRow>
            <HeaderNav loggingOut={this.props.loggingOut} loggedIn={this.props.loggedIn} collapse={this.state.collapse} />
          </MDBNavbar>
        </header>
      </div>
    );
  }
}

export default Header