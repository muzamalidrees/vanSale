import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon, MDBNavLink } from 'mdbreact';
// import { Link } from 'react-router-dom'
import { Can } from '../../../configs/Ability-context'




class AllSales extends Component {
  _isMounted = false
  constructor() {
    super();
    this._isMounted = true
    fetch('/getAllSales',
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        if (this._isMounted) {
          this.setState({ sales: json.data })
        }
      })
      .catch((error) => console.log(error))

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

    fetch('/getAllCustomers',
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        if (this._isMounted) {
          this.setState({ customers: json.data })
        }
      })
      .catch((error) => console.log(error))

    fetch('/getAllDrivers',
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        if (this._isMounted) {
          this.setState({ drivers: json.data })
        }
      })
      .catch((error) => console.log(error))

    this.state = {
      sales: [],
      products: [],
      customers: [],
      drivers: []
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  render() {

    var { sales, products, customers, drivers } = this.state;
    var rows = [];
    var index = 0;
    sales.forEach((sale) => {

      index = index + 1;
      let trDate = sale.date === null ? '' : new Date(sale.date).toLocaleDateString();
      // if ({sale.date === null}) {
      //   trDate = '';
      // }
      // else {
      //   trDate = new Date(sale.date).toLocaleDateString();
      // }

      let Product, Customer, Driver;
      if (products !== '' && products !== null && products !== undefined) {
        products.forEach(product => {
          if (product.id.toString() === sale.product_id) {
            Product = product.name
          }
        });
      }

      if (customers !== '' && customers !== null && customers !== undefined) {
        customers.forEach(customer => {
          if (customer.id.toString() === sale.customer_id) {
            Customer = customer.name
          }
        });
      }

      if (drivers !== '' && drivers !== null && drivers !== undefined) {
        drivers.forEach(driver => {
          if (driver.id.toString() === sale.driver_id) {
            Driver = driver.name
          }
        });
      }

      rows.push(
        {
          index: index,
          invoice_id: sale.invoice_id,
          date: trDate,
          pName: Product,
          pRate: sale.rate,
          pQty: sale.qty,
          pPrice: sale.price,
          customer: Customer,
          driver: Driver,
        }
      );
    });

    var data = {
      columns: [
        { label: '#', field: 'index', }, { label: 'Invoice_Id', field: 'invoice_id', }, { label: 'Date', field: 'date', },
        { label: 'Product', field: 'pName' }, { label: 'Rate', field: 'pRate', },
        { label: 'Qty.', field: 'pQty', }, { label: 'Price', field: 'pPrice', },
        { label: 'Customer', field: 'customer', }, { label: 'Driver', field: 'driver', }
      ],
      rows: rows
    }


    return (

      <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
        <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
          All Sales
        </MDBCardHeader>
        <MDBCardBody className='p-2'>
          <MDBBtn size='sm' className='m-0 p-0 font-weight-bold' color='info ' >
            <MDBNavLink to='/home' className='m-0' style={{ fontSize: '16px', color: 'white' }}>
              New Sales
            </MDBNavLink>
          </MDBBtn>
          <MDBDataTable id='allSalesTable' striped small hover theadColor="dark"
            bordered btn entries={15} entriesOptions={[10, 20, 35, 55, 70, 100, 135]} responsive
            data={data} theadTextWhite >
          </MDBDataTable>
        </MDBCardBody>
      </MDBCard>
    );
  }

}
export default AllSales;