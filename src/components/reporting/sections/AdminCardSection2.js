import React from 'react';
import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol } from 'mdbreact';

class AdminCardSection2 extends React.Component {
  totalSales = 0; totalReturns = 0; netIncome = 0;
  constructor() {
    super();
    this.state = {
      progressShow: false,

    }
  }
  render() {
    let { progressShow } = this.state
    let { sales, returns, invoices } = this.props
    if (!progressShow) {
      this.totalSales = 0; this.totalReturns = 0; this.netIncome = 0
      if (sales !== undefined) {
        sales.forEach(sale => {
          this.totalSales += sale.price
        });
      }
      if (returns !== undefined) {
        returns.forEach(Return => {
          this.totalReturns += Return.price
        });
      }
      if (invoices !== undefined) {
        invoices.forEach(invoice => {
          this.netIncome += invoice.total
        });
      }
    }

    return (
      <MDBRow className="mb-4">
        <MDBCol xl="4" md="6" className="mb-3">
          <MDBCard color="success-color" className="classic-admin-card">
            <MDBCardBody>
              <div className="float-right">
                <MDBIcon far icon="money-bill-alt" />
              </div>
              <p className="white-text">TOTAL SALES</p>
              <h4><strong>${this.totalSales}</strong></h4>
            </MDBCardBody>
            {/* <div className="progress">
              <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg grey darken-3" role="progressbar" style={{ width: "25%" }}></div>
            </div> */}
            <MDBCardBody>
              {/* <p>Better than last week (25%)</p> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol xl="4" md="6" className="mb-3">
          <MDBCard color="warning-color" className="classic-admin-card">
            <MDBCardBody>
              <div className="float-right">
                <MDBIcon  icon="undo-alt" />
              </div>
              <p className="white-text">TOTAL RETURNS</p>
              <h4><strong>${this.totalReturns}</strong></h4>
            </MDBCardBody>
            {/* <div className="progress">
              <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg grey darken-3" role="progressbar" style={{ width: "25%" }}></div>
            </div> */}
            <MDBCardBody>
              {/* <p>Better than last week (25%)</p> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol xl="4" md="6" className="mb-3">
          <MDBCard color="info-color" className="classic-admin-card">
            <MDBCardBody>
              <div className="float-right">
                <MDBIcon icon="dollar-sign" />
              </div>
              <p className="white-text">TOTAL INCOME</p>
              <h4><strong>${this.netIncome}</strong></h4>
            </MDBCardBody>
            {/* <div className="progress">
              <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg grey darken-3" role="progressbar" style={{ width: "25%" }}></div>
            </div> */}
            <MDBCardBody>
              {/* <p>Better than last week (25%)</p> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

      </MDBRow>
    )
  }
}

export default AdminCardSection2;

