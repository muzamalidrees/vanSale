import React, { Component } from 'react';
import { MDBDataTable, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBIcon, MDBNavLink } from 'mdbreact';
// import ViewInvoiceModal from './sections/ViewInvoiceModal';
// import EditInvoiceModal from './sections/EditInvoiceModal';
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
                console.log(json)
                if (this._isMounted) {
                    this.setState({ invoices: json.data })
                }
            })
            .catch((error) => console.log(error))
        this.state = {
            invoices: [],
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
        let invoice = { value: dRowValue }

        var options = {
            method: 'DELETE',
            body: JSON.stringify(invoice),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/deleteInvoice', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }



    render() {
        var { invoices } = this.state;
        var rows = [];
        var index = 0;
        invoices.forEach((invoice) => {

            index = index + 1;
            let invoiceDate;
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
                    customer: invoice.customer_id,
                    driver: invoice.driver_id,
                    total: invoice.total,
                    buttons: <React.Fragment>
                        <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleView(invoice.id)} className='m-1 py-1 px-2' outline color='info' size="sm"><MDBIcon icon="eye" /></MDBBtn>
                        {/* <Can I='update' a='invoice'> */}
                        <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleEdit(invoice.id)} className='m-1 py-1 px-2' outline color='teal' size="sm"><MDBIcon icon="pencil-alt" /></MDBBtn>
                        {/* </Can> */}
                        {/* <Can I='delete' a='invoice'> */}
                        <MDBBtn style={{ fontSize: '15px' }} onClick={this.handleDelete(invoice.id)} className='m-1 py-1 px-2' outline color='red darken-3' size="sm"><MDBIcon icon="trash" /></MDBBtn>
                        {/* </Can> */}
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

            <MDBCard className=' p-0' style={{ marginTop: '70px' }}>
                <MDBCardHeader tag="h4" style={{ color: 'dark' }} className="text-center font-weight-bold">
                    All Invoices
                </MDBCardHeader>
                <MDBCardBody className='p-2'>
                    <MDBDataTable id='invoicesTable' striped small hover theadColor="dark"
                        bordered btn entries={15} entriesOptions={[10, 20, 35, 55, 70, 100, 135]} responsive
                        data={data} theadTextWhite >
                    </MDBDataTable>
                    {/* <ViewInvoiceModal
                        ref='viewInvoiceModal'
                    />
                    <EditInvoiceModal
                        ref='editInvoiceModal'
                    /> */}
                    <DeleteModal
                        ref='deleteModal'
                        deleteEntry={this.deleteInvoice}
                    />
                </MDBCardBody>
            </MDBCard>
        );
    }

}

export default AllInvoices