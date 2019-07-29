import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon, MDBNavLink } from 'mdbreact';
import { Can } from '../../../configs/Ability-context'




class AllTransactions extends Component {
  _isMounted = false
  constructor(props) {
    super(props);
    this._isMounted = true
    {
      props.trType === 'sales' ?
        fetch('/getAllSales',
        )
          .then((res) => res.json())
          .then((json) => {
            console.log(json)
            if (this._isMounted) {
              this.setState({ transactions: json.data })
            }
          })
          .catch((error) => console.log(error))
        :
        fetch('/getAllReturns',
        )
          .then((res) => res.json())
          .then((json) => {
            console.log(json)
            if (this._isMounted) {
              this.setState({ transactions: json.data })
            }
          })
          .catch((error) => console.log(error))
    }
    
    fetch('/getAllProducts',
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        if (this._isMounted) {
          this.setState({ products: json.data })
        }
      })
      .catch((error) => console.log(error))

    this.state = {
      transactions: [],
      products: [],
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render() {

    var { transactions, products, } = this.state;
    var rows = [];
    var index = 0;
    transactions.forEach((transaction) => {

      index = index + 1;
      let trDate = transaction.date === null ? '' : new Date(transaction.date).toLocaleDateString();
      // if ({sale.date === null}) {
      //   trDate = '';
      // }
      // else {
      //   trDate = new Date(sale.date).toLocaleDateString();
      // }

      let Product;
      if (products !== '' && products !== null && products !== undefined) {
        products.forEach(product => {
          if (product.id.toString() === transaction.product_id) {
            Product = product.name
          }
        });
      }

      // if (customers !== '' && customers !== null && customers !== undefined) {
      //   customers.forEach(customer => {
      //     if (customer.id.toString() === sale.customer_id) {
      //       Customer = customer.name
      //     }
      //   });
      // }

      // if (drivers !== '' && drivers !== null && drivers !== undefined) {
      //   drivers.forEach(driver => {
      //     if (driver.id.toString() === sale.driver_id) {
      //       Driver = driver.name
      //     }
      //   });
      // }

      rows.push(
        {
          index: index,
          invoice_id: transaction.invoice_id,
          date: trDate,
          pName: Product,
          pRate: transaction.rate,
          pQty: transaction.qty,
          pPrice: transaction.price,
        }
      );
    });

    var data = {
      columns: [
        { label: '#', field: 'index', }, { label: 'Invoice_Id', field: 'invoice_id', }, { label: 'Date', field: 'date', },
        { label: 'Product', field: 'pName' }, { label: 'Rate', field: 'pRate', },
        { label: 'Qty.', field: 'pQty', }, { label: 'Price', field: 'pPrice', },
      ],
      rows: rows
    }


    return (

      <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
        <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
          All {this.props.trType === 'sales' ? 'Sales' : 'Returns'}
        </MDBCardHeader>
        <MDBCardBody className='p-2'>
          <MDBBtn size='sm' className='m-0 p-0 font-weight-bold' color='info ' >
            <MDBNavLink to={this.props.trType === 'sales' ? '/sales/new' : '/returns/new'} className='m-0' style={{ fontSize: '16px', color: 'white' }}>
              New {this.props.trType === 'sales' ? 'Sales' : 'Returns'}
            </MDBNavLink>
          </MDBBtn>
          <MDBDataTable id='allTransactionsTable' striped small hover theadColor="dark"
            bordered btn entries={15} entriesOptions={[10, 20, 35, 55, 70, 100, 135]} responsive
            data={data} theadTextWhite >
          </MDBDataTable>
        </MDBCardBody>
      </MDBCard>
    );
  }

}
export default AllTransactions;