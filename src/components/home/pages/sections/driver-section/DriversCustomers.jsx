import React, { Component } from 'react';
import { MDBCard, MDBCardHeader, MDBCardBody, MDBCol, MDBCardImage, MDBCardText, MDBRow } from 'mdbreact';
import { Redirect, withRouter } from 'react-router-dom';


class DriversCustomers extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this._isMounted = true
        fetch('/getAllCustomers')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customers: json.data })
                }
            })
            .catch((error) => console.log(error))

        fetch('/getAllDriverRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ driverRoutes: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllCustomerRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customerRoutes: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            customers: [],
            driverRoutes: [],
            customerRoutes: [],
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleSelect = id => e => {
        // console.log(id);
        this.props.history.push({ pathname: "/customers/customer", search: `@=${id}` })
    }

    render() {
        var { customers, driverRoutes, customerRoutes } = this.state

        let Customers = [], thisDriverCustomers = []
        if (customers.length !== 0 && driverRoutes.length !== 0 && customerRoutes.length !== 0) {
            let driverId = localStorage.getItem('ui')
            let thisDriverRoutes = driverRoutes.filter(driverRoute => driverRoute.driver_id === Number(driverId))

            thisDriverRoutes.forEach(driverRoute => {
                customerRoutes.forEach(customerRoute => {
                    if (customerRoute.route_id === driverRoute.route_id) {
                        thisDriverCustomers.push(customerRoute)
                    }
                })
            })

            thisDriverCustomers.forEach(driverCustomer => {
                customers.forEach(customer => {
                    if (customer.id === driverCustomer.customer_id) {
                        Customers.push(customer)
                    }
                })
            })
            // console.log(thisDriverRoutes);
            // console.log(thisDriverCustomers);
            // console.log(Customers)
        }


        return (
            <>
                {
                    Customers.length !== 0 &&
                    <MDBCol className='top p-0 mx-0 mb-0'>
                        <MDBCard border='primary' className='m-0 p-0'>
                            <MDBCardHeader border='primary' transparent className='m-0 text-center text-primary font-weight-bold'>
                                Your Customers
                            </MDBCardHeader>
                            <MDBCardBody className='m-1 p-1'>
                                {Customers.map(customer => {
                                    return <MDBCard key={customer.id} onClick={this.handleSelect(customer.customer_id)} className='mx-0 my-1 p-0'>
                                        <MDBCardBody className='m-0 p-0'>
                                            <MDBRow className='m-0 p-0'>
                                                <MDBCol size='4' middle>
                                                    <MDBCardImage top alt='customer' src="/404_mdb.png" />
                                                </MDBCol>
                                                <MDBCol size='8' middle className='py-2 pl-2 pr-0'>
                                                    <h5 className='text-secondary m-0'>{customer.name}</h5>
                                                    <MDBCardText small>
                                                        {customer.address}<br />
                                                        Cstomer Route
                                            </MDBCardText>
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCardBody>
                                    </MDBCard>
                                })}
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                }
            </>
        )
    }
}
export default withRouter(DriversCustomers)