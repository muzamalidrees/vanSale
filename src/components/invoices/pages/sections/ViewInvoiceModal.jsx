import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBRow, MDBCol, MDBInput, MDBDataTable } from 'mdbreact';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';



class ViewOrderModal extends Component {
    state = {
        modalShow: false,
        invoice: '',
        invoiceDate: '',
        sales: [],
        returns: []
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }
    fetchData = (id) => {

        fetch('/getSpecificInvoice/' + id)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
                let invoice = json.data
                let date;
                if (invoice.date === null) {
                    date = new Date("2019-07-09T00:00:00.000Z")
                }
                else {
                    date = new Date(invoice.date)
                }
                console.log(date);
                this.setState({
                    invoice: invoice,
                    invoiceDate: date
                })
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
                    delete x.id;
                    delete x.invoice_id;
                });
                this.setState({
                    returns: json.data
                })

            })
            .catch((error) => console.log(error))
    }

    render() {
        var { invoice, sales, returns, orderDate } = this.state;

        var salesData = {
            columns: [
                { label: 'Product', field: 'product_name' },
                { label: 'SKU', field: 'product_sku' }, { label: 'Rate', field: 'product_rate' },
                { label: 'QTY', field: 'product_qty' }, { label: 'Price', field: 'product_price' },
                { label: 'Remarks', field: 'product_remarks' }, { label: 'Extra Added', field: 'product_extra_added' },
            ],
            salesRows: sales
        }

        var returnsData = {
            columns: [
                { label: 'Name', field: 'product_name' },
                { label: 'SKU', field: 'product_sku' }, { label: 'Rate', field: 'product_rate' },
                { label: 'QTY', field: 'product_qty' }, { label: 'Price', field: 'product_price' },
                { label: 'Remarks', field: 'product_remarks' }, { label: 'Extra Added', field: 'product_extra_added' },
            ],
            returnsRows: returns
        }

        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='lg' centered>
                    <MDBModalHeader toggle={this.toggle}>Order details</MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow center>
                            <MDBCol md="9" className='m-0 p-0'>
                                <MDBRow center className='m-0 p-0' >
                                    <MDBCol sm='6' className='m-0'>
                                        <MDBInput value={order.total} label="Total" hint="Total" disabled className='m-0' style={{ fontWeight: 'bold' }} />
                                    </MDBCol>
                                    <MDBCol sm='6' className='m-0'>
                                        <MDBInput value={order.total_value_added} className='m-0' style={{ fontWeight: 'bold' }} label="Total value added" hint="Total value added" disabled />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow center className='m-0 p-0' >
                                    <MDBCol sm='4' className='m-0 ' >
                                        <MDBInput value={order.order_id} label="Id" outline disabled className='mt-0 mb-0' />
                                    </MDBCol>
                                    <MDBCol md='4' className=' ' middle >
                                        <MDBInput outline value={order.source} label='Source' disabled />
                                    </MDBCol>
                                    <MDBCol md='4' className='m-0 ' middle >
                                        <MDBInput outline value={order.status} label='Status' disabled />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow center className='m-0 p-0' >
                                    <MDBCol md='4' className='m-0 p-0' middle >
                                        <DatePicker
                                            id='datePicker'
                                            selected={orderDate}
                                            placeholderText='Date'
                                            className='form-control'
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="dd/MM/yy"
                                            disabled
                                        />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0 '>
                                        <MDBInput label="Tracking Id" value={order.tracking_id} outline className='m-0' disabled />
                                    </MDBCol>
                                    <MDBCol sm='4' className='m-0 '>
                                        <MDBInput type='textarea' rows='1' label="Note" value={order.note} outline className='m-0' disabled />
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='12' className='m-0 p-0' bottom >
                                        <label style={{ fontWeight: 'bold', textAlign: 'left' }}>Customer:</label>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0 p-0'>
                                    <MDBCol sm='3' className='m-0'>
                                        <MDBInput value={order.customer_name} className='m-0' label="Name" outline disabled />
                                    </MDBCol>
                                    <MDBCol sm='3' className='m-0'>
                                        <MDBInput value={order.customer_contact} className='m-0' label="Contact" outline disabled />
                                    </MDBCol>
                                    <MDBCol sm='6' className='m-0'>
                                        <MDBInput value={order.customer_address} className='m-0' label="Address" outline disabled />
                                    </MDBCol>

                                </MDBRow>
                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='12' className='m-0 p-0' bottom >
                                        <label style={{ fontWeight: 'bold', textAlign: 'left' }}>Products:</label>
                                    </MDBCol>
                                </MDBRow>
                                <MDBDataTable id='viewOrdersTable' striped small theadColor="teal"
                                    bordered entries={10} entriesOptions={[5, 10, 20]} responsive
                                    data={data} theadTextWhite >
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

export default ViewOrderModal;