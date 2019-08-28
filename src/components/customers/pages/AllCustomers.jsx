import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import EditCustomerModal from './sections/EditCustomerModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from "../../../configs/Ability-context";


class AllCustomers extends Component {
    _isMounted = false
    constructor() {
        super();
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
            customers: [],
            rowToBeDeleted: '',
            dRowValue: '',
            routes: '',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }


    handleEdit = (id) => (e) => {
        this.refs.editCustomerModal.setState({
            modalShow: true
        })
        this.refs.editCustomerModal.fetchData(id);
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

    deleteCustomer = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('customersTable').deleteRow(rowToBeDeleted)
        let customer = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(customer),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteCustomer', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { customers, routes } = this.state;
        var rows = [];
        var index = 0;
        // console.log(customers);

        customers.forEach((customer) => {

            index = index + 1;
            let currentRoute;
            if (routes !== '' && routes !== null && routes !== undefined) {
                routes.forEach(route => {
                    if (route.id === customer.route_id) {
                        currentRoute = route.name
                    }
                });
            }
            rows.push(
                {
                    index: index,
                    customer_id: customer.customer_id,
                    name: customer.name,
                    email: customer.email,
                    cell: customer.cell,
                    address: customer.address,
                    postCode: customer.post_code,
                    route: currentRoute,
                    shopName: customer.shop_name,
                    driverMessage: customer.driver_message,
                    invoiceMessage: customer.invoice_message,
                    buttons: <React.Fragment>
                        <Can I='update' a='customer'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(customer.id)} className='m-1 py-1 px-2' outline color='dark' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='customer'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(customer.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Id', field: 'customer_id', }, { label: 'Name', field: 'name' },
                { label: 'Email', field: 'email', }, { label: 'Cell', field: 'cell', },
                { label: 'Address', field: 'address', }, { label: 'Post Code', field: 'postCode', },
                { label: 'Route', field: 'route', }, { label: 'Shop Name', field: 'shopName', },
                { label: 'Message For Driver', field: 'driverMessage', },
                { label: 'Message On Invoice', field: 'invoiceMessage', }, { label: 'Action', field: 'buttons' },
            ],
            rows: rows
        }
        return (
            <Can I='read' a='customer'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" className="text-center font-weight-bold">
                        Your Customers
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>

                        <MDBDataTable id='customersTable' striped small hover theadColor="dark"
                            bordered btn entries={12} entriesOptions={[5, 10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <EditCustomerModal
                            ref='editCustomerModal'
                        />
                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteCustomer}
                        />
                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllCustomers