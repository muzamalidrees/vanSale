import React, { Component } from 'react';
import PTableRow from './PTableRow';
import { MDBTable, MDBTableHead, MDBTableBody, MDBCol, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBRow, MDBContainer } from 'mdbreact';
import PrintInvoiceModal from './PrintInvoiceModal'


class ProductsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Rows: [],
            askOtherSection: false,
            sales: [],
            returns: []
        }
        this.addProductToTbl = this.addProductToTbl.bind(this);
    }

    addProductToTbl = (pId, pName, pRate, pQTY, pPrice, ) => {

        var row = [];
        let index = this.state.Rows.length + 1;
        row.push(
            <PTableRow
                index={index}
                pId={pId}
                pName={pName}
                pRate={pRate}
                pQTY={pQTY}
                pPrice={pPrice}
                key={Math.random()}
                id={pId}
                tableId={this.props.tableId}
                containerId={this.props.containerId}
                deleteProductFrmTbl={this.props.deleteProductFrmTbl}
                minusFromTotal={this.props.minusFromTotal}
                addToTotal={this.props.addToTotal}
            />
        );

        this.setState(state => {
            var Rows = [...state.Rows, row]
            return {
                Rows
            };
        });
    }

    displayOtherSection = () => {
        this.props.displayOtherSection(true);
        this.props.displaySubmitButton(false);
        this.setState({ askOtherSection: false })
    }

    displaySubmitButton = () => {
        this.props.displaySubmitButton(true);
        this.props.displayOtherSection(false);
        this.setState({ askOtherSection: false })

    }

    fetchSalesTableData = () => {
        let sales = [];
        let salesTable = document.getElementById('saleProductsTable')
        let salesTableLength = salesTable.rows.length;

        if (salesTableLength > 1) {
            for (var index = salesTableLength - 1; index > 0; index--) {
                var pId = salesTable.rows[index].cells[1].innerHTML;
                var pRate = salesTable.rows[index].cells[3].innerHTML;
                var pQty = salesTable.rows[index].cells[4].innerHTML;
                var pPrice = salesTable.rows[index].cells[5].innerHTML;
                // console.log(pId, pRate, pQty, pPrice);
                let sale = { pId: pId, pRate: pRate, pQty: pQty, pPrice: pPrice, index: index }
                sales.push(sale)
                // console.log(sales);
            }
        }
        return sales;
    }

    fetchReturnsTableData = () => {
        let returns = [];
        let returnsTable = document.getElementById('returnProductsTable')
        let returnsTableLength = returnsTable.rows.length;

        if (returnsTableLength > 1) {
            for (var index = returnsTableLength - 1; index > 0; index--) {
                const pId = returnsTable.rows[index].cells[1].innerHTML;
                const pRate = returnsTable.rows[index].cells[3].innerHTML;
                const pQty = returnsTable.rows[index].cells[4].innerHTML;
                const pPrice = returnsTable.rows[index].cells[5].innerHTML;
                let Return = { pId: pId, pRate: pRate, pQty: pQty, pPrice: pPrice, index: index }
                returns.push(Return)
                // console.log(returns);
            }
        }
        return returns
    }

    handleSubmit = () => {
        let sales = this.fetchSalesTableData(),
            returns = this.fetchReturnsTableData();
        this.setState({
            sales: sales,
            returns: returns
        })
        let invoiceDetails = this.props.fetchInvoiceDetails();
        this.refs.printInvoiceModal.setState({
            sales: sales,
            returns: returns,
            invoiceDetails: invoiceDetails,
            modalShow: true,
        })
    }

    saveData = () => {
        this.props.loaderModalShow(true)
        let invoiceDetails = this.props.fetchInvoiceDetails();
        console.log(invoiceDetails);
        
        this.props.saveInvoice()
        let { sales, returns } = this.state
        let currentComponent = this
        let calls = []
        if (sales !== undefined && sales .length!==0) {
            sales.forEach(sale => {
                let Sales = {
                    productId: Number(sale.pId), rate: Number(sale.pRate), qty: Number(sale.pQty), price: Number(sale.pPrice), trDate: invoiceDetails.trDate,
                    invoiceId: invoiceDetails.invoiceId, customerId: invoiceDetails.customer.value,
                    driverId: Number(localStorage.getItem('ui'))
                }
                console.log(Sales);

                let options = {
                    method: 'POST',
                    body: JSON.stringify(Sales),
                    headers: { 'Content-Type': 'application/json' }
                }
                let call = { options: options, path: '/addNewSale' }
                calls.push(call);
                currentComponent.props.deleteProductFrmTbl(sale.pPrice, sale.index, 'saleProductsTable', 'saleProductsContainer', Number(sale.pId))
            })
        }
        let saleRequests = calls.map(call => fetch(call.path, call.options))
        Promise.all(saleRequests).then(() => {
            calls = []
            if (returns !== undefined && returns .length!==0) {
                returns.forEach(Return => {
                    let Returns = {
                        productId: Number(Return.pId), rate: Number(Return.pRate), qty: Number(Return.pQty), price: Number(Return.pPrice), trDate: invoiceDetails.trDate,
                        invoiceId: invoiceDetails.invoiceId, customerId: invoiceDetails.customer.value,
                        driverId: Number(localStorage.getItem('ui'))
                    }
                    let options = {
                        method: 'POST',
                        body: JSON.stringify(Returns),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    let call = { options: options, path: '/addNewReturn' }
                    calls.push(call);
                    this.props.deleteProductFrmTbl(Return.pPrice, Return.index, 'returnProductsTable', 'returnProductsContainer', Number(Return.pId))
                })
            }
            let returnRequests = calls.map(call => fetch(call.path, call.options))
            Promise.all(returnRequests).then(() => {
                this.props.displaySubmitButton(false);
                this.props.displayOtherSection(false);
                this.props.loaderModalShow(false)
            })
        })
    }

    makeTablesEmpty = () => {
        let sales = this.fetchSalesTableData(),
            returns = this.fetchReturnsTableData();
        sales.forEach(sale => {
            this.props.deleteProductFrmTbl(sale.pPrice, sale.index, 'saleProductsTable', 'saleProductsContainer', Number(sale.pId))
        })
        returns.forEach(Return => {
            this.props.deleteProductFrmTbl(Return.pPrice, Return.index, 'returnProductsTable', 'returnProductsContainer', Number(Return.pId))
        })
        this.props.displaySubmitButton(false);
        this.props.displayOtherSection(false);
    }


    render() {

        let { tableId, containerId, isDisplaySubmitButton, } = this.props

        return (
            <MDBContainer id={containerId} className=' py-0 my-2' style={{ display: 'none' }}>
                <MDBRow center>
                    <MDBCol>
                        <MDBCard className='px-2 pt-2 pb-0'>
                            <MDBCardHeader style={{ color: 'dark', lineHeight: '10px' }} tag="h5" className="text-center font-weight-bold">
                                Products to be {tableId === 'saleProductsTable' ? 'Sale' : 'Returned'}
                            </MDBCardHeader>
                            <MDBCardBody className='px-2 pt-2 pb-0'>
                                <MDBTable small id={tableId} striped responsive bordered >
                                    <caption style={{ display: `${this.state.askOtherSection ? '' : 'none'}`, fontWeight: 'bold' }}>
                                        Any {tableId === 'saleProductsTable' ? 'Returns' : 'Sales'} ?
                                        <MDBBtn
                                            size='sm'
                                            color="dark"
                                            className='font-weight-bold px-3 py-auto '
                                            type='submit'
                                            onClick={this.displayOtherSection}
                                            outline
                                        >
                                            Yes
                                        </MDBBtn>
                                        <MDBBtn
                                            size='sm'
                                            color="dark"
                                            className='font-weight-bold px-4 py-auto'
                                            type='submit'
                                            onClick={this.displaySubmitButton}
                                        >
                                            No
                                    </MDBBtn>
                                    </caption>
                                    <MDBTableHead color='dark' textWhite >
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Product</th>
                                            <th>Rate</th>
                                            <th>QTY</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {this.state.Rows}
                                    </MDBTableBody>
                                </MDBTable>
                                <div style={{ display: `${isDisplaySubmitButton ? '' : 'none'}` }} className='text-right'>
                                    <MDBBtn
                                        size='sm'
                                        color="dark"
                                        className='font-weight-bold'
                                        type='submit'
                                        onClick={this.handleSubmit}
                                    >
                                        Submit
                                    </MDBBtn>
                                </div>
                                <PrintInvoiceModal
                                    ref='printInvoiceModal'
                                    saveData={this.saveData}
                                />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }

}

export default ProductsTable