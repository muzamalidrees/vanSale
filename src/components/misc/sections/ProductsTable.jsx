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


    handleSubmit = () => {
        let sales = [], returns = [];
        // document.getElementById('saleProductsContainer').style.display = 'none'
        // document.getElementById('returnProductsContainer').style.display = 'none'
        let salesTable = document.getElementById('saleProductsTable')
        let returnsTable = document.getElementById('returnProductsTable')
        let salesTableLength = salesTable.rows.length;
        let returnsTableLength = returnsTable.rows.length;

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
        let { sales, returns } = this.state
        sales.forEach(sale => {
            this.props.saveSales(sale.pId, sale.pRate, sale.pQty, sale.pPrice);
            this.props.deleteProductFrmTbl(sale.pPrice, sale.index, 'saleProductsTable', 'saleProductsContainer')
        })
        returns.forEach(Return => {
            this.props.saveSales(Return.pId, Return.pRate, Return.pQty, Return.pPrice);
            this.props.deleteProductFrmTbl(Return.pPrice, Return.index, 'returnProductsTable', 'returnProductsContainer')
        })
        this.props.displaySubmitButton(false);
        this.props.displayOtherSection(false);
        this.props.saveInvoice()
    }



    render() {
        let { tableId, containerId, isDisplaySubmitButton, } = this.props

        return (
            <MDBContainer id={containerId} fluid className='mt-2' style={{ display: 'none' }}>
                <MDBRow center>
                    <MDBCol>
                        <MDBCard className='p-2'>
                            <MDBCardHeader style={{ color: 'dark' }} tag="h4" className="text-center font-weight-bold">
                                Products to be {tableId === 'saleProductsTable' ? 'Sale' : 'Returned'}
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>
                                <MDBTable id={tableId} striped responsive bordered >
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