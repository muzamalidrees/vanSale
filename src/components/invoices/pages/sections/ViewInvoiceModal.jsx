import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBRow, MDBCol, MDBInput, MDBDataTable } from 'mdbreact';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';



class ViewInvoiceModal extends Component {
    state = {
        modalShow: false,
        invoice: '',
        customer: '',
        driver: '',
        sales: [],
        returns: [],
        products: [],
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }
    fetchData = (id) => {
        // console.log(id);

        fetch('/getSpecificInvoice/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                let invoice = json.data
                this.setState({
                    invoice: invoice,
                })
                this.getInvoiceCustomer(invoice.customer_id);
                this.getInvoiceDriver(invoice.driver_id);
            })
            .catch((error) => console.log(error))

        fetch('/getSpecificSales/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                json.data.map((x) => {
                    delete x.createdAt;
                    delete x.updatedAt;
                    delete x.deletedAt;
                    delete x.date;
                    delete x.customer_id;
                    delete x.driver_id;
                    delete x.id;
                    delete x.invoice_id;
                });
                this.setState({
                    sales: json.data
                })

            })
            .catch((error) => console.log(error))

        fetch('/getSpecificReturns/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                json.data.map((x) => {
                    delete x.createdAt;
                    delete x.updatedAt;
                    delete x.deletedAt;
                    delete x.date;
                    delete x.customer_id;
                    delete x.driver_id;
                    delete x.id;
                    delete x.invoice_id;
                });
                this.setState({
                    returns: json.data
                })

            })
            .catch((error) => console.log(error))

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ products: json.data })
                }
            })
            .catch((error) => console.log(error))
    }

    getInvoiceCustomer = (id) => {
        this._isMounted = true
        fetch('/getSpecificCustomer/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ customer: json.data })
                }
            })
            .catch((error) => console.log(error))
    }

    getInvoiceDriver = (id) => {
        this._isMounted = true
        fetch('/getSpecificUser/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                if (this._isMounted) {
                    this.setState({ driver: json.data })
                }
            })
            .catch((error) => console.log(error))
    }

    getProduct = (id) => {
        let productName
        this.state.products.forEach(product => {
            if (product.id === id) {
                productName = product.name
                return
            }
            else {

                return
            }
        })
        return productName
    }

    render() {
        var { invoice, customer, driver, sales, returns, } = this.state;

        let invoiceDate;
        if (invoice.date === null) {
            invoiceDate = '';
        }
        else {
            invoiceDate = new Date(invoice.date).toLocaleDateString();
        }

        var salesRows = [];
        var returnsRows = [];
        var index = 0;
        sales.forEach((sale) => {

            index = index + 1;
            salesRows.push(
                {
                    index: index,
                    prodcut: this.getProduct(sale.product_id),
                    rate: sale.rate,
                    qty: sale.qty,
                    price: sale.price,
                }
            );
        });

        returns.forEach((Return) => {

            index = index + 1;
            returnsRows.push(
                {
                    index: index,
                    prodcut: this.getProduct(Return.product_id),
                    rate: Return.rate,
                    qty: Return.qty,
                    price: Return.price,
                }

            );
        });

        var salesData = {
            columns: [
                { label: '#', field: 'index' },
                { label: 'Product', field: 'product' },
                { label: 'Rate', field: 'rate' },
                { label: 'QTY', field: 'qty' },
                { label: 'Price', field: 'sale_product_price' },
            ],
            rows: salesRows
        }

        var returnsData = {
            columns: [
                { label: '#', field: 'index' },
                { label: 'Product', field: 'product' },
                { label: 'Rate', field: 'rate' },
                { label: 'QTY', field: 'qty' },
                { label: 'Price', field: 'price' },
            ],
            rows: returnsRows
        }

        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' className='mb-5 pb-5' centered>
                    <MDBModalHeader toggle={this.toggle}>Invoice details</MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow center>
                            <MDBCol md="9" className='m-0 p-0'>
                                <MDBRow center className='m-0 p-0' >
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput value={invoiceDate} outline className='m-0' style={{ fontWeight: 'bold' }} label="Date" hint="Date" disabled />
                                    </MDBCol>
                                    <MDBCol md='4' className=' ' middle >
                                        <MDBInput outline value={customer.name} label='Customer' disabled />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0'>
                                        <MDBInput value={invoice.total} outline label="Total" hint="Total" disabled className='m-0' style={{ fontWeight: 'bold' }} />
                                    </MDBCol>
                                </MDBRow>
                                {/* <MDBRow center className='m-0 p-0' >
                                    <MDBCol sm='6' className='m-0 ' >
                                        <MDBInput value={driver.name} label="Driver" outline disabled className='mt-0 mb-0' />
                                    </MDBCol>
                                </MDBRow> */}

                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='12' className='m-0 p-0' bottom >
                                        <label style={{ fontWeight: 'bold', textAlign: 'left' }}>Sales:</label>
                                    </MDBCol>
                                </MDBRow>
                                <MDBDataTable striped small theadColor="dark"
                                    bordered entries={10} entriesOptions={[5, 10, 20]} responsive
                                    data={salesData} theadTextWhite >
                                </MDBDataTable>
                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='12' className='m-0 p-0' bottom >
                                        <label style={{ fontWeight: 'bold', textAlign: 'left' }}>Returns:</label>
                                    </MDBCol>
                                </MDBRow>
                                <MDBDataTable striped small theadColor="dark"
                                    bordered entries={10} entriesOptions={[5, 10, 20]} responsive
                                    data={returnsData} theadTextWhite >
                                </MDBDataTable>
                            </MDBCol>
                        </MDBRow>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default ViewInvoiceModal;