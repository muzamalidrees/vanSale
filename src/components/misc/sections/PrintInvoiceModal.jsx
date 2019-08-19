import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBInput, MDBModalFooter, MDBRow, MDBCol, MDBModalHeader } from 'mdbreact';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


class PrintInvoiceModal extends Component {

    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            sales: [],
            returns: [],
            invoiceDetails: {},
            products: [],
            paidAmount: 0,
            // dueAmount: 0,
        }

        fetch('/getAllProducts')
            .then((res) => res.json())
            .then(json => {
                this.setState({
                    products: json.data
                })
            })
    }


    componentWillUnmount = () => {
        this._isMounted = false
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,

        });
    }
    saveAndPrint = () => {
        let content = document.getElementById('invoiceContent')
        html2canvas(content)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                // pdf.addImage(imgData, 'PNG', 15, 40, 180, 180);
                pdf.addImage(imgData, 'PNG', 0, 0);
                // pdf.output('dataurlnewwindow');
                pdf.save("download.pdf");
                // pdf.autoPrint()
            })
            ;
        // this.props.saveData();
        // this.toggle();
    }

    //assuring only numbers allowed in input type=number s.
    onKeyPress = (e) => {
        if ((e.which) === 101 || (e.which) === 45) e.preventDefault();
    }

    handleInput = (e) => {
        this.setState({
            paidAmount: e.target.value
        })
    }


    render() {
        let { sales, returns, invoiceDetails, products, dueAmount, paidAmount } = this.state

        let name, shop, address, cell, invoiceMessage, globalMessage, invoiceId, date, saleRows = [], returnRows = [], currentProduct, totalSales = 0, totalReturns = 0
        if (invoiceDetails.customer !== {} && invoiceDetails.customer !== undefined && invoiceDetails.customer !== null) {
            name = invoiceDetails.customer.label
            shop = invoiceDetails.customer.shop
            address = invoiceDetails.customer.address
            cell = invoiceDetails.customer.cell
            invoiceMessage = invoiceDetails.customer.invoiceMessage
        }

        if (invoiceDetails !== {} && invoiceDetails !== undefined && invoiceDetails !== null) {
            invoiceId = invoiceDetails.invoiceId
        }

        if (invoiceDetails.trDate !== {} && invoiceDetails.trDate !== undefined && invoiceDetails.trDate !== null) {
            date = invoiceDetails.trDate.toLocaleDateString()
        }

        sales.forEach(sale => {
            if (products !== [] && products !== null && products !== undefined) {
                products.forEach(product => {
                    if (product.id === Number(sale.pId)) {
                        currentProduct = product.name
                    }
                });
            }
            totalSales = totalSales + Number(sale.pPrice)
            saleRows.push(
                <tr key={Math.random()}>
                    <th scope='row'>{sale.index}</th>
                    <td>{currentProduct}</td>
                    <td>{sale.pRate}</td>
                    <td>{sale.pQty}</td>
                    <td>{sale.pPrice}</td>
                </tr>
            )
        })

        returns.forEach(Return => {
            if (products !== [] && products !== null && products !== undefined) {
                products.forEach(product => {
                    if (product.id === Number(Return.pId)) {
                        currentProduct = product.name
                    }
                });
            }
            totalReturns = totalReturns + Number(Return.pPrice)
            returnRows.push(
                <tr key={Math.random()}>
                    <th scope='row'>{Return.index}</th>
                    <td>{currentProduct}</td>
                    <td>{Return.pRate}</td>
                    <td>{Return.pQty}</td>
                    <td>{Return.pPrice}</td>
                </tr>
            )
        })



        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} autoFocus={true} animation="bottom" >
                    <MDBModalHeader toggle={this.toggle}>
                    </MDBModalHeader>
                    <MDBModalBody id='invoiceContent' style={{ color: 'black' }} className='m-0 px-3'>
                        <h4 style={{ textAlign: 'center', borderRadius: '0.12em', background: '#000', color: '#FFF', padding: '0.2em 0' }}>
                            INVOICE
                        </h4>
                        <MDBRow className='m-0 p-0' center>
                            <address style={{ fontStyle: 'normal', lineHeight: '1.25' }}>
                                <p style={{ margin: '0 0 0.25em' }}>Van Sales</p>
                                <p style={{ margin: '0 0 0.25em' }}>101 E. Chapman Ave<br />Orange, CA 92866</p>
                                <p style={{ margin: '0 0 0.25em' }}>(800) 555-1234</p>
                            </address>
                        </MDBRow>
                        <MDBRow between className='px-3 my-2'>
                            <MDBCol sm='6' bottom className='m-0 p-0'>
                                <p >Customer: <br />{name}<br />{shop}<br />{address} <br />{cell}</p>
                            </MDBCol>
                            <MDBCol sm='4' bottom className='m-0 p-0'>
                                <p >Invoice #:  {invoiceId}<br />
                                    Date:  {date}<br />
                                    {/* Amount Due:  {dueAmount} */}
                                </p>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow className='px-3 '>
                            <h5>
                                Sales:
                            </h5>
                            <table className='table table-borderless table-sm'>
                                <caption>Total Sales: {totalSales}</caption>
                                <thead className='thead-light'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Item</th>
                                        <th scope="col">Rate</th>
                                        <th scope="col">Qty.</th>
                                        <th scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {saleRows}
                                </tbody>
                            </table>

                        </MDBRow>
                        <MDBRow className='px-3'>
                            <h5>
                                Returns:
                            </h5>
                            <table className='table table-borderless table-sm'>
                                <caption>Total Returns: {totalReturns}</caption>
                                <thead className='thead-light'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Item</th>
                                        <th scope="col">Rate</th>
                                        <th scope="col">Qty.</th>
                                        <th scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {returnRows}
                                </tbody>
                            </table>
                        </MDBRow>
                        <MDBRow between className='px-3 my-2'>
                            <MDBCol sm='4' className='p-0 m-0'>
                            </MDBCol>
                            <MDBCol sm='5' className='p-0'>
                                <MDBRow className='m-0'>
                                    <MDBCol sm='7' className='p-0'>
                                        Total Sales:
                                    </MDBCol>
                                    <MDBCol sm='5' className='p-0 text-right'>
                                        {totalSales}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0'>
                                    <MDBCol sm='7' className='p-0'>
                                        Total returns:
                                    </MDBCol>
                                    <MDBCol sm='5' className='p-0 text-right'>
                                        {totalReturns}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className='m-0'>
                                    <MDBCol sm='7' className='p-0'>
                                        Net Total:
                                    </MDBCol >
                                    <MDBCol sm='5' className='p-0 text-right'>
                                        <b> {totalSales - totalReturns}</b>
                                    </MDBCol>
                                </MDBRow>
                                {/* <MDBRow className='m-0 p-0'>
                                    <MDBCol sm='7' className='p-0' middle >
                                        Amount Paid:
                                    </MDBCol>
                                    <MDBCol sm='5' className='p-0 m-0' middle>
                                        <MDBInput type='number' value={paidAmount} onInput={this.handleInput} onKeyPress={this.onKeyPress} className='text-right' /><br />
                                    </MDBCol>
                                </MDBRow> */}
                                {/* <MDBRow className='m-0 p-0'>
                                    <MDBCol id='balanceDue' sm='7' className='p-0'>
                                        Balance Due:
                                    </MDBCol>
                                    <MDBCol sm='5' className='p-0 text-right'>
                                        <b> {totalSales - totalReturns - paidAmount}</b>
                                    </MDBCol>
                                </MDBRow> */}
                            </MDBCol>
                        </MDBRow>

                        {invoiceMessage}
                        <div style={{ borderWidth: '1px 0 0', borderColor: '#999', borderTopStyle: 'solid' }}>
                            <p>{globalMessage}</p>
                        </div>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <div className='text-right'>
                            <MDBBtn color="info" style={{ letterSpacing: '0.3em' }} onClick={this.saveAndPrint}>Save&Print</MDBBtn>
                            <MDBBtn color="info" outline onClick={this.toggle}>Back</MDBBtn>
                        </div>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer >
        );
    }
}

export default PrintInvoiceModal;