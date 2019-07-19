import React from 'react';

import { MDBRow } from 'mdbreact';


class AllSales extends React.Component {
  constructor() {
    super();

    this.state = {
      showOrderDetails: false
    };

  }



  render() {

    return (
      <React.Fragment>

       <div style={{
         marginTop:'100px'
       }}>all sales</div>
      </React.Fragment>
    );
  }
}

export default AllSales;