import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllCustomerRoutes extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllCustomerRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customerRoutes: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllCustomers')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customers: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllRoutes')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ routes: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            customerRoutes: [],
            customers: [],
            routes: [],
            rowToBeDeleted: '',
            dRowValue: '',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleDelete = (id) => (e) => {
        let el = e.target
        let row = el.closest('tr')
        var i = row.rowIndex;
        this.setState({
            rowToBeDeleted: i,
            dRowValue: id
        })
        this.refs.deleteModal.setState({
            modalShow: true,
        })
    }

    deleteCustomerRoute = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('customerRoutingTable').deleteRow(rowToBeDeleted)
        let customerRoute = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(customerRoute),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteCustomerRoute', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { customers, routes, customerRoutes } = this.state;
        var rows = [];
        var index = 0;

        customerRoutes.forEach((customerRoute) => {

            index = index + 1;
            let currentCustomer;
            let currentRoute;
            if (customers.length !== 0 && customers !== null && customers !== undefined) {
                customers.forEach(customer => {
                    if (customer.id === customerRoute.customer_id) {
                        currentCustomer = customer
                    }
                });
            }

            if (routes.length !== 0 && routes !== null && routes !== undefined) {
                routes.forEach(route => {
                    if (route.id === customerRoute.route_id) {
                        currentRoute = route.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    customer: currentCustomer ? currentCustomer.name : '',
                    customerId: currentCustomer ? currentCustomer.customer_id : '',
                    route: currentRoute,
                    buttons: <React.Fragment>
                        <Can I='delete' a='customerRoute'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(customerRoute.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Customer', field: 'customer' }, { label: 'Customer_Id', field: 'customerId' },
                { label: 'Route', field: 'route', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }
        return (
            <Can I='read' a='customerRoute'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        Customers' Routes
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>

                        <MDBDataTable id='customerRoutingTable' striped small hover theadColor="dark"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteCustomerRoute}
                        />
                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllCustomerRoutes