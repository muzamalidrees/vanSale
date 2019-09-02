import React, { Component } from 'react';
import {
    MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBTableHead,
    MDBTable, MDBTableBody, MDBModalFooter, MDBRow, MDBCol, MDBInput, MDBIcon
}
    from 'mdbreact';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import PTableRow from '../../../misc/sections/PTableRow'
import DeleteModal from '../../../misc/sections/DeleteModal'
import NewTransaction from '../../../misc/pages/NewTransaction'



class EditInvoiceModal extends Component {
    constructor() {
        super();
        this.addFormToggle = this.addFormToggle.bind(this)
    }
    state = {
        modalShow: false,
        invoice: '',
        sales: [],
        returns: [],
        products: [],
        customer: '',
        driver: '',
        invoiceDate: '',
        total: 0,
        salesRows: [],
        returnsRows: [],
        deleteEntry: { dprice: '', di: '', dtableId: '', dcontainerId: '', dsaleOrReturnId: '' },
        showAddNewSaleToggleButton: true,
        showAddNewSaleForm: false,
        showAddNewReturnToggleButton: true,
        showAddNewReturnForm: false,
        saveUpdatesBtn: false,
    }

    toggle = () => {
        this.setState({
            modalShow: !this.state.modalShow,
            showAddNewSaleToggleButton: true,
            showAddNewSaleForm: false,
            showAddNewReturnToggleButton: true,
            showAddNewReturnForm: false,
            saveUpdatesBtn: false
        });
    }

    fetchData = (id) => {

        fetch('/getSpecificInvoice/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
                let invoice = json.data
                this.setState({
                    invoice: invoice,
                    invoiceDate: new Date(invoice.date),
                    total: invoice.total
                })
                this.getInvoiceCustomer(invoice.customer_id);
                this.getInvoiceDriver(invoice.driver_id);
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

        fetch('/getSpecificSales/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)

                this.setSalesRows(json.data);
            })
            .catch((error) => console.log(error))

        fetch('/getSpecificReturns/' + id)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)

                this.setReturnRows(json.data);
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

    setSalesRows = (sales) => {
        this.setState({
            salesRows: []
        })
        if (sales !== undefined) {
            sales.forEach(sale => {

                let Id = sale.id
                let pName = sale.product_id
                let pRate = sale.rate
                let pQTY = sale.qty
                let pPrice = sale.price
                this.pushRows(Id, pName, pRate, pQTY, pPrice, 'sales')
            });
        }
    }

    setReturnRows = (returns) => {
        this.setState({
            returnsRows: []
        })
        if (returns !== undefined) {
            returns.forEach(Return => {
                let Id = Return.id
                let pName = Return.product_id
                let pRate = Return.rate
                let pQTY = Return.qty
                let pPrice = Return.price
                this.pushRows(Id, pName, pRate, pQTY, pPrice, 'returns')
            });
        }
    }

    pushRows = (Id, pName, pRate, pQTY, pPrice, rowsType) => {
        let productName;
        this.state.products.forEach(product => {
            if (product.id === pName) {
                productName = product.name
            }
        })
        var row = [];
        let index = rowsType === 'sales' ? this.state.salesRows.length + 1 : this.state.returnsRows.length + 1
        row.push(
            <PTableRow
                index={index}
                pId={pName}
                pName={productName}
                pRate={pRate}
                pQTY={pQTY}
                pPrice={pPrice}
                key={Math.random()}
                id={Id}
                tableId={rowsType === 'sales' ? 'saleProductsTable' : 'returnProductstable'}
                containerId={rowsType === 'sales' ? 'editSalesTable' : 'editReturnsTable'}
                deleteProductFrmTbl={this.deleteConfirmation}
                minusFromTotal={this.minusTotalValue}
                addToTotal={this.addTotalValue}
            />
        );
        rowsType === 'sales' ?
            this.setState(state => {
                var salesRows = [...state.salesRows, row]
                return {
                    salesRows
                };
            })
            :
            this.setState(state => {
                var returnsRows = [...state.returnsRows, row]
                return {
                    returnsRows
                };
            });
    }

    deleteConfirmation = (price, i, tableId, containerId, saleOrReturnid) => {
        this.refs.deleteModal.setState({
            modalShow: true,
        })
        this.setState(prevState => {
            let deleteEntry = Object.assign({}, prevState.deleteEntry);
            deleteEntry.dprice = price;
            deleteEntry.di = i;
            deleteEntry.dtableId = tableId;
            deleteEntry.dcontainerId = containerId;
            deleteEntry.dsaleOrReturnId = saleOrReturnid;
            return { deleteEntry };
        })
    }

    deleteEntry = () => {
        let { deleteEntry } = this.state
        let tableId = deleteEntry.dtableId
        let index = deleteEntry.di
        let price = deleteEntry.dprice
        let containerId = deleteEntry.dcontainerId
        let saleOrReturnId = deleteEntry.dsaleOrReturnId
        this.deleteProductFrmTbl(tableId, price, containerId, index);
        this.deleteSaleOrReturnFrmDB(containerId, saleOrReturnId)
    }

    deleteProductFrmTbl = (tableId, price, containerId, index) => {
        if (tableId === 'saleProductsTable') {
            this.minusTotalValue(price)
        }
        else {
            this.addTotalValue(price)
        }
        let table = document.getElementById(`${containerId}`);
        table.deleteRow(index);
    }

    deleteSaleOrReturnFrmDB = (containerId, saleOrReturnId) => {
        if (containerId === 'editSalesTable' && saleOrReturnId !== null) {
            let sale = { value: saleOrReturnId }
            let options = {
                method: 'DELETE',
                body: JSON.stringify(sale),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/deleteSale', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                })
                .catch((error) => console.log(error))
        }
        else if (saleOrReturnId !== null) {
            let Return = { value: saleOrReturnId }
            let options = {
                method: 'DELETE',
                body: JSON.stringify(Return),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch('/deleteReturn', options)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json)
                })
                .catch((error) => console.log(error))
        }
    }

    minusTotalValue = (value) => {

        this.setState({
            total: this.state.total - parseInt(value),
            saveUpdatesBtn: true
        })
    }

    addTotalValue = (value) => {

        this.setState({
            total: this.state.total + parseInt(value),
            saveUpdatesBtn: true
        })
    }

    // updating sales,returns & invoices from database
    saveUpdates = () => {
        let currentComponent = this
        let promise1 = new Promise(function (resolve, reject) {
            // console.log('ok');
            let salesTable = document.getElementById('editSalesTable');
            let salesTableLength = salesTable.rows.length, sales = []
            if (salesTableLength > 1) {
                for (let index = salesTableLength - 1; index > 0; index--) {
                    let pId = salesTable.rows[index].cells[1].innerHTML;
                    let pRate = salesTable.rows[index].cells[3].innerHTML;
                    let pQty = salesTable.rows[index].cells[4].innerHTML;
                    let pPrice = salesTable.rows[index].cells[5].innerHTML;
                    let saleId = salesTable.rows[index].cells[7].innerHTML;
                    // console.log(pId, pRate, pQty, pPrice);
                    let transaction = { pId: pId, pRate: pRate, pQty: pQty, pPrice: pPrice, saleId: saleId }
                    sales.push(transaction)
                }
            }
            resolve(sales);
        });
        promise1.then(function (sales) {
            // console.log('value');
            let { invoiceDate, invoice } = currentComponent.state
            sales.forEach(sale => {
                if (sale.saleId === null || sale.saleId === '' || sale.saleId === undefined) {
                    let newSale = {
                        trDate: invoiceDate, invoiceId: invoice.id, customerId: invoice.customer_id,
                        driverId: invoice.driver_id, productId: sale.pId, rate: sale.pRate, qty: sale.pQty, price: sale.pPrice
                    }
                    let options1 = {
                        method: 'POST',
                        body: JSON.stringify(newSale),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    fetch('/addNewSale', options1)
                        .then((res) => res.json())
                        .then((json) => {
                            // console.log(json)
                        })
                        .catch((error) => console.log(error))
                }
                else {
                    let saleUpdate = {
                        id: sale.saleId, qty: sale.pQty, price: sale.pPrice
                    }
                    let options2 = {
                        method: 'PUT',
                        body: JSON.stringify(saleUpdate),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    fetch('/updateSale', options2)
                        .then((res) => res.json())
                        .then((json) => {
                            // console.log(json)
                        })
                        .catch((error) => console.log(error))
                }
            })
        }).then(() => {
            let promise2 = new Promise(function (resolve, reject) {
                // console.log('value1');
                let returnsTable = document.getElementById('editReturnsTable')
                let returnsTableLength = returnsTable.rows.length, returns = []
                if (returnsTableLength > 1) {
                    for (let index = returnsTableLength - 1; index > 0; index--) {
                        let pId = returnsTable.rows[index].cells[1].innerHTML;
                        let pRate = returnsTable.rows[index].cells[3].innerHTML;
                        let pQty = returnsTable.rows[index].cells[4].innerHTML;
                        let pPrice = returnsTable.rows[index].cells[5].innerHTML;
                        let returnId = returnsTable.rows[index].cells[7].innerHTML;
                        // console.log(pId, pRate, pQty, pPrice);
                        let transaction = { pId: pId, pRate: pRate, pQty: pQty, pPrice: pPrice, returnId: returnId }
                        returns.push(transaction)
                    }
                }
                resolve(returns)
            });
            promise2.then((returns) => {
                // console.log('value2');
                let { invoiceDate, invoice } = currentComponent.state
                returns.forEach(Return => {
                    if (Return.returnId === null || Return.returnId === '' || Return.returnId === undefined) {
                        let newReturn = {
                            trDate: invoiceDate, invoiceId: invoice.id, customerId: invoice.customer_id,
                            driverId: invoice.driver_id, productId: Return.pId, rate: Return.pRate, qty: Return.pQty, price: Return.pPrice
                        }
                        let options1 = {
                            method: 'POST',
                            body: JSON.stringify(newReturn),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        fetch('/addNewReturn', options1)
                            .then((res) => res.json())
                            .then((json) => {
                                // console.log(json)
                            })
                            .catch((error) => console.log(error))
                    }
                    else {
                        let returnUpdate = {
                            id: Return.returnId, qty: Return.pQty, price: Return.pPrice
                        }
                        let options2 = {
                            method: 'PUT',
                            body: JSON.stringify(returnUpdate),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        fetch('/updateReturn', options2)
                            .then((res) => res.json())
                            .then((json) => {
                                // console.log(json)
                            })
                            .catch((error) => console.log(error))
                    }
                })
            })
        }).then(() => {
            this.updateInvoice();
        }).then(() => {
            // closing edit modal
            // this.toggle()
        })
        // .then(() => {
        // refreshing all records table
        //     window.location.reload();
        // })
    }

    updateInvoice = () => {
        let { invoice, invoiceDate, total } = this.state
        let invoiceUpdate = { id: invoice.id, date: invoiceDate, total: total }
        let options = {
            method: 'PUT',
            body: JSON.stringify(invoiceUpdate),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/updateInvoice', options)
            .then((res) => res.json())
            .then((json) => {
                // console.log(json)
            })
            .catch((error) => console.log(error))
    }

    //toggling add saleOrReturn form
    addFormToggle = (form) => () => {
        if (form === 'sale') {
            this.setState({
                showAddNewSaleForm: true,
                showAddNewSaleToggleButton: false
            }, function () {
                this.saleProducts.enableAddProductBtn();
            })

        }
        else {
            this.setState({
                showAddNewReturnForm: true,
                showAddNewReturnToggleButton: false
            }, function () {
                this.returnProducts.enableAddProductBtn();
            })
        }
    }

    addProductToTbl = (tableId, pId, pName, pRate, pQTY, pPrice) => {
        if (tableId === 'saleProductsTable') {
            this.pushRows(null, pId, pRate, pQTY, pPrice, 'sales');
            this.addTotalValue(pPrice);
        }
        else {
            this.pushRows(null, pId, pRate, pQTY, pPrice, 'returns');
            this.minusTotalValue(pPrice);
        }
    }


    render() {
        var {
            customer, driver, invoiceDate, total, showAddNewReturnForm, saveUpdatesBtn,
            showAddNewReturnToggleButton, showAddNewSaleForm, showAddNewSaleToggleButton
        } = this.state;



        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modalShow} toggle={this.toggle} size='fluid' centered>
                    <MDBModalHeader toggle={this.toggle}>Edit Invoice details</MDBModalHeader>
                    <MDBModalBody>
                        <MDBRow center>
                            <MDBCol md="10" className='m-0 p-0'>
                                <MDBRow center className='m-0 p-0' >
                                    <MDBCol md='4' className='' middle >
                                        <DatePicker
                                            selected={invoiceDate}
                                            placeholderText='Date'
                                            onChange={this.handleDateChange}
                                            className='form-control'
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="dd/MM/yy"
                                            autoComplete='off'
                                            required
                                            disabled
                                        />
                                    </MDBCol>
                                    <MDBCol md='4' className=' ' middle >
                                        <MDBInput outline value={customer.name} label='Customer' disabled />
                                    </MDBCol>
                                    <MDBCol md='4' className='m-0'>
                                        <MDBInput value={total} label="Total" hint="Total" outline disabled style={{ fontWeight: 'bold' }} />
                                    </MDBCol>
                                </MDBRow>
                                {/* <MDBRow center className='m-0 p-0' >
                                    <MDBCol sm='6' className='m-0 ' >
                                        <MDBInput value={driver.name} label="Driver" outline disabled className='mt-0 mb-0' />
                                    </MDBCol>
                                </MDBRow> */}

                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='6' className='m-0 p-0' bottom >
                                        <label style={{ fontWeight: 'bold', textAlign: 'left' }}>Sales:</label>
                                    </MDBCol>
                                    <MDBCol sm='6' className='m-0 p-0 text-right'  >
                                        {showAddNewSaleToggleButton ?
                                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.addFormToggle('sale')} className='ml-2 py-0 px-2' outline color='#4B515D' size="sm"><MDBIcon icon="plus" /></MDBBtn>
                                            : null}
                                    </MDBCol >
                                </MDBRow>
                                {showAddNewSaleForm ?
                                    <MDBRow className='m-0 p-0'>
                                        < NewTransaction
                                            ref={el => this.saleProducts = el}
                                            tableId={'saleProductsTable'}
                                            containerId={null}
                                            addProductToTbl={this.addProductToTbl}
                                            customerId={customer.id}
                                        />
                                    </MDBRow>
                                    : null}
                                <MDBTable id='editSalesTable' striped responsive bordered >
                                    <MDBTableHead color='dark' textWhite >
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Product</th>
                                            <th>Rate</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {this.state.salesRows}
                                    </MDBTableBody>
                                </MDBTable>
                                <MDBRow className='m-0 p-0' end>
                                    <MDBCol sm='6' className='m-0 p-0' bottom >
                                        <label style={{ fontWeight: 'bold', textAlign: 'left' }}>Returns:</label>
                                    </MDBCol>
                                    <MDBCol sm='6' className='m-0 p-0 text-right'  >
                                        {showAddNewReturnToggleButton ?
                                            <MDBBtn style={{ fontSize: '15px' }} onClick={this.addFormToggle('return')} className='ml-2 py-0 px-2' outline color='#4B515D' size="sm"><MDBIcon icon="plus" /></MDBBtn>
                                            : null}
                                    </MDBCol >
                                </MDBRow>
                                {showAddNewReturnForm ?
                                    <MDBRow className='m-0 p-0'>
                                        < NewTransaction
                                            ref={el => this.returnProducts = el}
                                            tableId={'returnProductsTable'}
                                            containerId={null}
                                            addProductToTbl={this.addProductToTbl}
                                            customerId={customer.id}
                                        />
                                    </MDBRow>
                                    : null}
                                <MDBTable id='editReturnsTable' striped responsive bordered >
                                    <MDBTableHead color='dark' textWhite >
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Product</th>
                                            <th>Rate</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {this.state.returnsRows}
                                    </MDBTableBody>
                                </MDBTable>
                            </MDBCol>
                        </MDBRow>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                        {saveUpdatesBtn ?
                            <MDBBtn color="secondary" outline onClick={this.saveUpdates}>Save Updates</MDBBtn>
                            :
                            null}
                    </MDBModalFooter>
                </MDBModal>
                <DeleteModal
                    ref='deleteModal'
                    deleteEntry={this.deleteEntry}
                />
            </MDBContainer >
        );
    }
}

export default EditInvoiceModal;