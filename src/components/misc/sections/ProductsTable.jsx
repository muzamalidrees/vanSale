import React, { Component } from 'react';
import PTableRow from './PTableRow';
import { MDBTable, MDBTableHead, MDBTableBody, MDBCol, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBRow, MDBContainer } from 'mdbreact';


class ProductsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Rows: [],
            askOtherSection: false,
        }
        this.addProductToTbl = this.addProductToTbl.bind(this);
    }

    addProductToTbl = (pId, pName, pRate, pQTY, pPrice, trDate) => {
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
                trDate={trDate}
                key={Math.random()}
                id={Math.random()}
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
        this.props.displayOtherSection();
        this.setState({ askOtherSection: false })
    }

    displaySubmitButton = () => {
        this.props.displaySubmitButton();
        this.setState({ askOtherSection: false })

    }

    handleSubmit = () => {
        console.log('submit ok');
    }
    // submitOrder = () => {
    //     let allFormsValid = this.props.checkOrderDetailsValidity();
    //     // let allFormsValid = true
    //     if (allFormsValid) {
    //         document.getElementById('pTableCard').style.display = 'none';
    //         this.props.saveOrderToDB();
    //         this.setState({ submitOrderBtn: false })
    //         let pTable = document.getElementById('productsTable');
    //         for (let index = 1; index < pTable.rows.length; index++) {
    //             const pName = pTable.rows[index].cells[1].innerHTML;
    //             const pSKU = pTable.rows[index].cells[2].innerHTML;
    //             const pRate = pTable.rows[index].cells[3].innerHTML;
    //             const pQTY = pTable.rows[index].cells[4].innerHTML;
    //             const pPrice = pTable.rows[index].cells[5].innerHTML;
    //             const pRemarks = pTable.rows[index].cells[6].innerHTML;
    //             const pChecked = pTable.rows[index].cells[7].innerHTML;
    //             this.props.saveOrderDetailsToDB(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
    //         }
    //         for (let index = pTable.rows.length - 1; index > 0; index--) {
    //             pTable.deleteRow(index);
    //         }
    //     }
    //     else {
    //         console.log('something wrong')
    //     }
    // }

    render() {
        let { tableId, containerId, isDisplaySubmitButton, } = this.props

        return (
            <MDBContainer id={containerId} fluid className='mt-2' style={{ display: 'none' }}>
                <MDBRow center>
                    <MDBCol>
                        <MDBCard className='p-2'>
                            <MDBCardHeader style={{ color: 'dark' }} tag="h4" className="text-center font-weight-bold">
                                Products to be {tableId === 'saleProductstable' ? 'Sale' : 'Returned'}
                            </MDBCardHeader>
                            <MDBCardBody className='p-2'>
                                <MDBTable id={tableId} striped responsive bordered >
                                    <caption style={{ display: `${this.state.askOtherSection ? '' : 'none'}`, fontWeight: 'bold' }}>
                                        Any {tableId === 'saleProductstable' ? 'Returns' : 'Sales'} ?
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
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }

}

export default ProductsTable