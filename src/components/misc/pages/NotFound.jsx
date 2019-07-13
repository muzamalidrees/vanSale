import React, { Component } from 'react';
// import './misc/miscStyles.css';
import { MDBCol, MDBRow } from 'mdbreact';


class NotFound extends Component {

    render() {

        return (

            <React.Fragment>
            <div className="full" style={{border:'none',textAlign:"center",marginTop:'70px'}}>
              <MDBRow className=" mt-5 col-6">
                <MDBCol md="6" className="mt-5">
                  <h1 className="h1-responsive mt-3 mb-2"><strong>404</strong></h1>
                  <h2 className="h2-responsive mt-3 mb-1">That's an error.</h2>
                  <h4>The requested URL was not found.</h4>
                </MDBCol>
                <MDBCol md="4" className="mt-4">
                  <img alt="Error 404" className="img-fluid" src="https://mdbootstrap.com/img/Others/grafika404-bf.png"/>
                </MDBCol>
              </MDBRow>
            </div>
          </React.Fragment>
            // <div style={{ border: 'none', textAlign: 'center', paddingTop: `${this.props.pt}`, paddingBottom: `${this.props.pb}` }} className={this.props.class}>
            //     <h1 className="header-title">404</h1>
            //     <h3 style={{ color: '#274e13' }}>Oops! Page not found</h3>
            //     <p style={{ color: '#783f04' }}><b>Sorry, but the page you are looking for is not found.</b></p>
            // </div>

        )
    }
}


export default NotFound