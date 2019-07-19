import React, { Component } from 'react';
import PTableRow from './PTableRow';
import { MDBTable, MDBTableHead, MDBTableBody, MDBCard, MDBCardHeader, MDBCardBody, MDBBtn, MDBRow, MDBContainer } from 'mdbreact';


class ProductsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Rows: [],
            submitBtn: false,
            index: 0
        }
        this.addProductToTbl = this.addProductToTbl.bind(this);
    }

    addProductToTbl = (pId, pRate, pQTY, pPrice) => {
        var row = [];
        row.push(
            <PTableRow
                index={'index'}
                pId={pId}
                pRate={pRate}
                pQTY={pQTY}
                pPrice={pPrice}
                key={Math.random()}
                id={Math.random()}
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
        this.setState({ submitOrderBtn: true });
    }
    submitOrder = () => {
        let allFormsValid = this.props.checkOrderDetailsValidity();
        // let allFormsValid = true
        if (allFormsValid) {
            document.getElementById('pTableCard').style.display = 'none';
            this.props.saveOrderToDB();
            this.setState({ submitOrderBtn: false })
            let pTable = document.getElementById('productsTable');
            for (let index = 1; index < pTable.rows.length; index++) {
                const pName = pTable.rows[index].cells[1].innerHTML;
                const pSKU = pTable.rows[index].cells[2].innerHTML;
                const pRate = pTable.rows[index].cells[3].innerHTML;
                const pQTY = pTable.rows[index].cells[4].innerHTML;
                const pPrice = pTable.rows[index].cells[5].innerHTML;
                const pRemarks = pTable.rows[index].cells[6].innerHTML;
                const pChecked = pTable.rows[index].cells[7].innerHTML;
                this.props.saveOrderDetailsToDB(pName, pSKU, pRate, pQTY, pPrice, pRemarks, pChecked);
            }
            for (let index = pTable.rows.length - 1; index > 0; index--) {
                pTable.deleteRow(index);
            }
        }
        else {
            console.log('something wrong')
        }
    }

    render() {


        return (
            <MDBContainer style={{ display: `${this.props.display}` }}>
                <MDBRow center>
                    <MDBCard id='pTableCard' style={{ display: '' }} className=' m-0 p-0 col-9'>
                        <MDBCardHeader style={{ color: 'teal' }} tag="h4" className="text-center font-weight-bold">
                            Products to be added
                            </MDBCardHeader>
                        <MDBCardBody className='p-2'>
                            <MDBTable id='productsTable' ref={this.props.productsTable} striped responsive bordered >
                                <caption>
                                    {this.state.submitOrderBtn ?
                                        <MDBBtn onClick={this.submitOrder} type='button' size='sm' className='p-2' >Submit</MDBBtn> :
                                        null}
                                </caption>
                                <MDBTableHead color='teal' textWhite >
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Rate</th>
                                        <th>QTY</th>
                                        <th>Price</th>
                                        <th>Remarks</th>
                                        <th>Extra Added?</th>
                                        <th>Action</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {this.state.Rows}
                                </MDBTableBody>
                            </MDBTable>
                        </MDBCardBody>
                    </MDBCard>
                </MDBRow>
            </MDBContainer>
        );
    }

}

export default ProductsTable