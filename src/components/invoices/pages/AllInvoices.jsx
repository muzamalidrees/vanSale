import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import ViewInvoiceModal from './sections/ViewInvoiceModal';
import EditInvoiceModal from './sections/EditInvoiceModal';
import DeleteModal from '../../misc/sections/DeleteModal';
import { Can } from '../../../configs/Ability-context'


class AllInvoices extends Component {
    _isMounted = false
    constructor() {
        super();
        this._isMounted = true
        fetch('/getAllInvoices')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ invoices: json.data })
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
        fetch('/getAllUsers')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ users: json.data })
                }
            })
            .catch((error) => console.log(error))
        fetch('/getAllRoles')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ roles: json.data })
                }
            })
            .catch((error) => console.log(error))

        this.state = {
            invoices: [],
            customers: [],
            users: [],
            roles: [],
            rowToBeDeleted: '',
            dRowValue: ''
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    handleView = (id) => e => {
        this.refs.viewInvoiceModal.setState({
            modalShow: true
        })
        this.refs.viewInvoiceModal.fetchData(id);
    }

    handleEdit = (id) => e => {
        this.refs.editInvoiceModal.setState({
            modalShow: true
        })
        this.refs.editInvoiceModal.fetchData(id);
    }

    handleDelete = (id) => e => {
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

    deleteInvoice = () => {
        let rowToBeDeleted = this.state.rowToBeDeleted
        let dRowValue = this.state.dRowValue
        document.getElementById('invoicesTable').deleteRow(rowToBeDeleted)
        let sales = [], returns = [], calls = []

        //fetching sales of this invoice
        let call = { path: '/getSpecificSales/' + dRowValue }
        calls.push(call)

        //fetching returns of this invoice
        let anotherCall = { path: '/getSpecificReturns/' + dRowValue }
        calls.push(anotherCall)
        let dataRequests = calls.map(call =>
            fetch(call.path)
        )

        //running data requests
        Promise.all(dataRequests)
            .then(responses =>

                //getting responses from data requests
                Promise.all(responses.map(res =>
                    res.json()
                ))
                    .then(jsons => {

                        //initializing sales and returns
                        sales = jsons[0].data
                        returns = jsons[1].data
                    })
            )
            .then(() => {

                // deleting sales
                if (sales !== undefined && sales !== null && sales.length !== 0) {
                    sales.forEach(sale => {
                        let Sale = { value: sale.id }
                        let saleOptions = {
                            method: 'DELETE',
                            body: JSON.stringify(Sale),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        let call = { options: saleOptions, path: '/deleteSale' }
                        calls.push(call)
                    })
                }
                let saleRequests = calls.map(call => fetch(call.path, call.options))
                Promise.all(saleRequests).then(() => {
                    calls = []

                    //deleting returns
                    if (returns !== undefined && returns !== null && returns.length !== 0) {
                        returns.forEach(Return => {
                            let _return = { value: Return.id }
                            let returnOptions = {
                                method: 'DELETE',
                                body: JSON.stringify(_return),
                                headers: { 'Content-Type': 'application/json' }
                            }
                            let call = { options: returnOptions, path: '/deleteReturn' }
                            calls.push(call)
                        })
                    }
                    let returnRequests = calls.map(call => fetch(call.path, call.options))
                    Promise.all(returnRequests).then(() => {

                        //deleting invoice
                        let invoice = { value: dRowValue }
                        let invoiceOptions = {
                            method: 'DELETE',
                            body: JSON.stringify(invoice),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        fetch('/deleteInvoice', invoiceOptions)
                            .then((res) => res.json())
                            .then((json) => {
                                // console.log(json)
                            })
                            .catch((error) => console.log(error))
                    })
                })
            })
    }


    render() {
        var { invoices, customers, users, roles } = this.state;

        var rows = [];
        var index = 0;
        let roleId;

        if (roles !== '' && roles !== null && roles !== undefined) {
            roles.forEach(role => {
                if (role.name === 'driver') {
                    roleId = role.id
                }
            })
        }
        let drivers = users.filter(user => user.role_id === roleId)

        invoices.forEach((invoice) => {

            index = index + 1;
            let currentCustomer, invoiceDate, currentDriver
            if (customers !== '' && customers !== null && customers !== undefined) {
                customers.forEach(customer => {
                    if (customer.id === invoice.customer_id) {
                        currentCustomer = customer.name
                    }
                });
            }
            if (drivers !== '' && drivers !== null && drivers !== undefined) {
                drivers.forEach(driver => {
                    if (driver.id === invoice.driver_id) {
                        currentDriver = driver.name
                    }
                });
            }

            if (invoice.date === null) {
                invoiceDate = '';
            }
            else {
                invoiceDate = new Date(invoice.date).toLocaleDateString();
            }
            rows.push(
                {
                    index: index,
                    date: invoiceDate,
                    customer: currentCustomer,
                    driver: currentDriver,
                    total: invoice.total,
                    buttons: <React.Fragment>
                        <Can I='read' a='invoice'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleView(invoice.id)} className='m-1 py-1 px-2' outline color='info' size="sm"><MDBIcon icon="eye" /></MDBBtn>
                        </Can>
                        <Can I='update' a='invoice'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(invoice.id)} className='m-1 py-1 px-2' outline color='teal' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        </Can>
                        <Can I='delete' a='invoice'>
                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(invoice.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        </Can>
                    </React.Fragment>
                }
            );
        });

        var data = {
            columns: [
                { label: '#', field: 'index', }, { label: 'Date', field: 'date', }, { label: 'Customer', field: 'customer', },
                { label: 'Driver', field: 'driver' },
                { label: 'Total', field: 'total', }, { label: 'Action', field: 'buttons' }
            ],
            rows: rows
        }


        return (
            <Can I='read' a='invoice'>
                <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                    <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                        All Invoices
                </MDBCardHeader>
                    <MDBCardBody className='p-2'>
                        <MDBDataTable id='invoicesTable' striped small hover theadColor="dark"
                            bordered btn entries={10} entriesOptions={[10, 20, 35, 55, 70, 100, 135]} responsive
                            data={data} theadTextWhite >
                        </MDBDataTable>
                        <ViewInvoiceModal
                            ref='viewInvoiceModal'
                        />
                        <EditInvoiceModal
                            ref='editInvoiceModal'
                        />
                        <DeleteModal
                            ref='deleteModal'
                            deleteEntry={this.deleteInvoice}
                        />
                    </MDBCardBody>
                </MDBCard>
            </Can>
        );
    }

}

export default AllInvoices