import React, { Component } from 'react';
import { MDBCol, MDBRow, MDBNavLink } from 'mdbreact';


class NotFound extends Component {

  render() {

    return (

      <>
        <MDBRow style={{ marginTop: '72px' }}>
          <MDBCol md='12' className='text-center float-md-none mx-auto'>
            <img
              src="/404_mdb.png"
              alt="Error 404"
              className="img-fluid wow fadeIn animated"
              style={{ visibility: 'visible', animationName: 'fadeIn', animationIterationCount: 1 }} />
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-5">
          <MDBCol md='12' className="text-center mb-5">
            <h2 className="h2-responsive wow fadeIn mb-4 animated" data-wow-delay="0.2s" style={{ fontWeight: 500, visibility: 'visible', animationName: 'fadeIn', animationIterationCount: 1, animationDelay: '0.2s' }}>Oops! This obviously isn't a page you were looking for.</h2>
            <p className="wow fadeIn animated" data-wow-delay="0.4s" style={{ fontSize: '1.25rem', visibility: 'visible', animationName: 'fadeIn', animationIterationCount: 1, animationDelay: '0.4s' }}>Please, use following link to navigate back to home page.</p>
            <MDBCol md='6' className='mx-auto' >
              <MDBNavLink to='/home'>Home</MDBNavLink>
            </MDBCol>
          </MDBCol>
        </MDBRow >
      </>
    )
  }
}


export default NotFound