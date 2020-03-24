import React, { Component } from 'react';
import { MDBCard, MDBCardHeader, MDBCardBody, MDBCol, MDBBtn, MDBFooter } from 'mdbreact';
import { withRouter } from 'react-router-dom'
import ViewInvoiceModal from '../../invoices/pages/sections/ViewInvoiceModal'



class CustomerInvoices extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        let params = new URLSearchParams(window.location.search), comingCustomer = params.get('@')
        this._isMounted = true
        fetch('/getAllSales')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                this._isMounted && this.setState({ sales: json.data })
            })
            .catch((error) => console.log(error))
        fetch('/getAllReturns')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                this._isMounted && this.setState({ returns: json.data })
            })
            .catch((error) => console.log(error))
        fetch('/getAllCustomers')
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                this._isMounted && this.setState({ customers: json.data })
                let SelectedCustomer = json.data.filter(customer => customer.customer_id === comingCustomer).shift()
                fetch('/getSpecificInvoices/' + SelectedCustomer.id)
                    .then(res => res.json())
                    .then(json => {
                        // console.log(json);
                        if (this._isMounted) {
                            this.setState({ invoices: json.data, customer: SelectedCustomer })
                        }
                    })
            })
            .catch((error) => console.log(error))

        this.state = {
            invoices: [],
            customer: '',
            customers: [],
            sales: [],
            returns: []
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleBackClick = () => {
        window.history.go(-1)
        // this.props.history.goback();
    }

    handleView = (id) => {
        console.log(id);
        
        this.refs.viewInvoiceModal.setState({
            modalShow: true
        })
        this.refs.viewInvoiceModal.fetchData(id);
    }


    render() {

        var { invoices, customer, customers, sales, returns } = this.state
        function getShopName(customerId) {
            let ourCustomer = customers && customers.filter(customer => customer.id === customerId).shift()
            return ourCustomer.shop_name
        }
        function getSaleQty(invoiceId) {
            let ourSales = sales && sales.filter(sale => sale.invoice_id === invoiceId)
            let saleQty = 0
            ourSales.forEach(sale => saleQty += sale.qty)
            return saleQty
        }
        function getReturnQty(invoiceId) {
            let ourReturns = returns && returns.filter(Return => Return.invoice_id === invoiceId)
            let returnQty = 0
            ourReturns.forEach(Return => returnQty += Return.qty)
            return returnQty
        }



        return (
            <>
                {
                    invoices.length !== 0 ?
                        <>
                            <MDBCol className='top p-0 mx-0 mb-0'>
                                <MDBCard border='secondary' className='m-0 p-0'>
                                    <MDBCardHeader border='secondary' transparent className='m-0 text-center text-secondary font-weight-bold'>
                                        {customer.name}'s Invoices
                            </MDBCardHeader>
                                    <MDBCardBody className='m-1 p-1'>
                                        {invoices.map(invoice => {
                                            // console.log(invoice);
                                            return <MDBCard key={invoice.id} onClick={() => this.handleView(invoice.id)} className='mx-0 my-1 pl-3 pr-0 py-2'>
                                                <MDBCardBody className='m-0 p-0'>
                                                    <b className='mb-1'>Date: </b>{new Date(invoice.date).toLocaleDateString()}<br />
                                                    <b className='mb-1'>Amount: </b>{invoice.total}<br />
                                                    <b className='mb-1'>Shop Name: </b>{getShopName(invoice.customer_id)}<br />
                                                    <b className='mb-1'>Inv. #: </b>{invoice.id}<br />
                                                    <b className='mb-1'>S. Qty : </b>{getSaleQty(invoice.id)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <b className='mb-1'>R. Qty : </b>{getReturnQty(invoice.id)}
                                                </MDBCardBody>
                                            </MDBCard>
                                        })}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                            <MDBFooter className='text-center fixed-bottom mb-5 font-small'>
                                <MDBBtn size='sm' color='info' className='mb-2' onClick={this.handleBackClick} style={{ width: '40%' }}>Back</MDBBtn>
                                <MDBBtn size='sm' color='info' className='mb-2 mx-0' onClick={() => this.props.history.push('/sales/new')}>New Invoice</MDBBtn>
                            </MDBFooter>
                            <ViewInvoiceModal
                                ref='viewInvoiceModal'
                            />
                        </>
                        :
                        <p>No Invoices۔</p>
                }
            </>
        )
    }
}
export default withRouter(CustomerInvoices)