import React, { Component } from 'react';
import { MDBCol, MDBRow, MDBContainer } from 'mdbreact';


class NotFound extends Component {

  render() {

    return (

      <MDBContainer style={{ marginTop: '170px' }}>
        <MDBRow center >
          <MDBCol middle className="mt-5 text-center">
            <h1 className="h1-responsive mt-3 mb-2"><strong>404</strong></h1>
            <h2 className="h2-responsive mt-3 mb-1">That's an error.</h2>
            <h4>The requested URL was not found.</h4>
          </MDBCol>
          <MDBCol middle className="mt-4">
            <img alt="Error 404" className="img-fluid" src="https://mdbootstrap.com/img/Others/grafika404-bf.png" />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    )
  }
}


export default NotFound