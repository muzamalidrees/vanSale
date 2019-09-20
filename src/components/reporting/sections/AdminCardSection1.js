import React from 'react';
import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol, MDBCardText } from 'mdbreact';



class AdminCardSection1 extends React.Component {
  totalSales = 0; totalReturns = 0; netIncome = 0;
  constructor() {
    super();
    this.state = {
      progressShow: false,

    }
  }

  makeSpecificReport = (reportOn, reportBy, selectedEntity, fromDate, toDate) => {

    //making all items zero
    this.totalReturns = 0; this.totalSales = 0; this.netIncome = 0;

    //fetching data from props
    let { sales, returns, invoices } = this.props

    // making transaction generic
    let transactions = reportOn === 'sale' ? sales : reportOn === 'return' ? returns : reportOn === 'total' ? invoices : [];

    //getting our desired transactions
    let desiredTransactions = [], desiredSales = [], desiredReturns = [],
      comingFromDate = new Date(fromDate.toDateString()), comingToDate = new Date(toDate.toDateString());
    if (reportOn === 'total') {
      switch (reportBy) {
        case 'customer':
          desiredTransactions = transactions.filter(transaction => (
            transaction.customer_id === selectedEntity &&
            new Date(new Date(transaction.date).toDateString()) >= comingFromDate &&
            new Date(new Date(transaction.date).toDateString()) <= comingToDate))
          break;
        case 'driver':
          desiredTransactions = transactions.filter(transaction => (
            transaction.driver_id === selectedEntity &&
            new Date(new Date(transaction.date).toDateString()) >= comingFromDate &&
            new Date(new Date(transaction.date).toDateString()) <= comingToDate))
          break;
        case 'product':
          desiredSales = sales.filter(sale => (
            sale.product_id === selectedEntity &&
            new Date(new Date(sale.date).toDateString()) >= comingFromDate &&
            new Date(new Date(sale.date).toDateString()) <= comingToDate))

          desiredReturns = returns.filter(Return => (
            Return.product_id === selectedEntity &&
            new Date(new Date(Return.date).toDateString()) >= comingFromDate &&
            new Date(new Date(Return.date).toDateString()) <= comingToDate))
          break;
        default:
          desiredTransactions = []
          break;
      }
      this.props.setTabularFormData(desiredTransactions, reportOn, reportBy)
    }
    else {
      switch (reportBy) {
        case 'customer':
          desiredTransactions = transactions.filter(transaction => (
            transaction.customer_id === selectedEntity &&
            new Date(new Date(transaction.date).toDateString()) >= comingFromDate &&
            new Date(new Date(transaction.date).toDateString()) <= comingToDate))
          break;
        case 'driver':
          desiredTransactions = transactions.filter(transaction => (
            transaction.driver_id === selectedEntity &&
            new Date(new Date(transaction.date).toDateString()) >= comingFromDate &&
            new Date(new Date(transaction.date).toDateString()) <= comingToDate))
          break;
        case 'product':
          desiredTransactions = transactions.filter(transaction => (
            transaction.product_id === selectedEntity &&
            new Date(new Date(transaction.date).toDateString()) >= comingFromDate &&
            new Date(new Date(transaction.date).toDateString()) <= comingToDate))
          break;
        default:
          desiredTransactions = []
          break;
      }
      this.props.setTabularFormData(desiredTransactions, reportOn, reportBy)
    }

    //calculating results
    if (reportOn === 'total' && reportBy === 'product') {
      // console.log(desiredSales);
      // console.log(desiredReturns);
      let totalSales = 0
      let totalReturns = 0
      if (desiredSales !== null && desiredSales .length!==0) {
        desiredSales.forEach(sale => {
          totalSales += sale.price
        })
      }
      if (desiredReturns !== null && desiredReturns .length!==0) {
        desiredReturns.forEach(Return => {
          totalReturns += Return.price
        })
      }
      this.totalReturns = totalReturns; this.totalSales = totalSales
      this.netIncome = totalSales - totalReturns
    }
    else if (reportOn === 'total' && reportBy === 'driver' || reportBy === 'customer') {
      let totalAmount = 0
      if (desiredTransactions !== null && desiredTransactions .length!==0) {
        desiredTransactions.forEach(transaction => {
          totalAmount += transaction.total
        })
      }
      this.netIncome = totalAmount
    }
    else {
      // console.log(desiredTransactions);
      let totalAmount = 0
      if (desiredTransactions !== null && desiredTransactions .length!==0) {
        desiredTransactions.forEach(transaction => {
          totalAmount += transaction.price
        })
      }
      reportOn === 'sale' ? this.totalSales = totalAmount : reportOn === 'return' ? this.totalReturns = totalAmount : totalAmount = 0
    }

    this.setState({
      progressShow: true
    })
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
      <MDBRow className="mb-5" >
        <MDBCol xl="4" md="6" className="mb-r">
          <MDBCard className="cascading-admin-card">
            <div className="admin-up">
              <MDBIcon icon="money-bill-alt" className="success-color" />
              <div className="data">
                <p>SALES</p>
                <h4>
                  <strong>${this.totalSales}</strong>
                </h4>
              </div>
            </div>
          </MDBCard>
        </MDBCol>
        <MDBCol xl="4" md="6" className="mb-r">
          <MDBCard className="cascading-admin-card">
            <div className="admin-up">
              <MDBIcon icon="undo-alt" className="warning-color" />
              <div className="data">
                <p>RETURNS</p>
                <h4>
                  <strong>${this.totalReturns}</strong>
                </h4>
              </div>
            </div>
          </MDBCard>
        </MDBCol>
        <MDBCol xl="4" md="6" className="mb-r">
          <MDBCard className="cascading-admin-card">
            <div className="admin-up">
              <MDBIcon icon="dollar-sign" className="info-color" />
              <div className="data">
                <p>NET INCOME</p>
                <h4>
                  <strong>${this.netIncome}</strong>
                </h4>
              </div>
            </div>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    )
  }
}

export default AdminCardSection1;

