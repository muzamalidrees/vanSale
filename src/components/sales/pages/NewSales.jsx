import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewTransaction from '../../misc/pages/NewTransaction';
import ProductsTable from '../../misc/sections/ProductsTable';
import InvoiceDetails from '../../misc/sections/InvoiceDetails'


class NewSales extends Component {
    _isMounted = false
    constructor() {
        super();

        this.state = {
            displayReturnsSection: false,
            isDisplaySubmitButton: false,
            invoiceId: 1,
            customerId: ''
        }
        this.addProductToTbl = this.addProductToTbl.bind(this)
    }

    // setting customer id and enabling add product button
    customerSelected = (selectedCustomer) => {
        if (selectedCustomer === null) {
            this.refs.saleProducts.disableAddProductBtn();
        }
        else {
            this.setState({
                customerId: selectedCustomer.value
            })
            this.refs.saleProducts.enableAddProductBtn();
        }
    }

    // setting last invoice id
    lastInvoiceIdFetched = (invoiceId) => {
        this.setState({
            invoiceId: invoiceId
        })
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    addProductToTbl = (tableId, pId, pName, pRate, pQTY, pPrice, ) => {
        // console.log(tableId, pId, pName, pRate, pQTY, pPrice);

        if (tableId === 'saleProductsTable') {
            this.refs.saleProductsTable.addProductToTbl(pId, pName, pRate, pQTY, pPrice);
            this.refs.invoiceDetails.addTotalValue(pPrice);
            {
                this.state.displayReturnsSection ?
                    console.log()
                    :
                    this.refs.saleProductsTable.setState({ askOtherSection: true })
            }
        }
        else {
            this.refs.returnProductsTable.addProductToTbl(pId, pName, pRate, pQTY, pPrice)
            this.refs.invoiceDetails.minusTotalValue(pPrice);
            // this.refs.returnProductsTable.setState({ askOtherSection: true })
        }
    }

    deleteProductFrmTbl = (price, i, tableId, containerId) => {
        if (tableId === 'saleProductsTable') {
            this.refs.invoiceDetails.minusTotalValue(price)
        }
        else {
            this.refs.invoiceDetails.addTotalValue(price)
        }
        let table = document.getElementById(`${tableId}`);
        table.deleteRow(i);
        if (table.rows.length === 1) {
            document.getElementById(`${containerId}`).style.display = 'none'
            if (tableId === 'saleProductsTable') {
                this.displaySubmitButton(false)
                this.refs.saleProductsTable.setState({ askOtherSection: false })
            }
            else {
                this.displaySubmitButton(false)
                this.refs.returnProductsTable.setState({ askOtherSection: false, isDisplaySubmitButton: false })
            }
        }
    }

    minusFromTotal = (pPrice) => {
        this.refs.invoiceDetails.minusTotalValue(pPrice);
    }

    addToTotal = (pPrice) => {
        this.refs.invoiceDetails.addTotalValue(pPrice);
    }

    displayOtherSection = (value) => {
        this.setState({ displayReturnsSection: value })
        this.refs.returnProducts.setState({
            disableAddProductBtn: !value
        })
    }

    displaySubmitButton = (value) => {
        this.setState({ isDisplaySubmitButton: value })
    }

    saveSales = (pId, pRate, pQty, pPrice) => {
        let { trDate } = this.refs.invoiceDetails.state
        let { invoiceId, customerId } = this.state
        // console.log(pId, pRate, pQty, pPrice, trDate, invoiceId, customerId);

        let sales = {
            productId: Number(pId), rate: Number(pRate), qty: Number(pQty), price: Number(pPrice), trDate: trDate,
            invoiceId: invoiceId, customerId: customerId,
            driverId: 7   //  driverId :Number(localStorage.getItem('ui'))
        }

        var options = {
            method: 'POST',
            body: JSON.stringify(sales),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewSale', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))

        var options2 = {
            method: 'PUT',
            body: JSON.stringify(sales),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/decreaseDriverInventory', options2)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }

    saveReturns = (pId, pRate, pQty, pPrice) => {
        let { trDate } = this.refs.invoiceDetails.state
        let { invoiceId, customerId } = this.state
        // console.log(pId, pRate, pQty, pPrice, trDate, invoiceId, customerId);

        let returns = {
            productId: Number(pId), rate: Number(pRate), qty: Number(pQty), price: Number(pPrice), trDate: trDate,
            invoiceId: invoiceId, customerId: customerId,
            driverId: 7   //  driverId :Number(localStorage.getItem('ui'))
        }

        var options = {
            method: 'POST',
            body: JSON.stringify(returns),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewReturn', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))

        var options2 = {
            method: 'PUT',
            body: JSON.stringify(returns),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch('/addNewDriverInventory', options2)
            .then((res) => res.json())
            .then((json) => {
                console.log(json)
            })
            .catch((error) => console.log(error))
    }

    saveInvoice = () => {
        this.refs.invoiceDetails.saveInvoice();
    }


    render() {

        return (
            <React.Fragment>
                <div style={{ marginTop: '72px', paddingTop: '20px' }}>
                    <InvoiceDetails
                        ref='invoiceDetails'
                        customerSelected={this.customerSelected}
                        lastInvoiceIdFetched={this.lastInvoiceIdFetched} />
                    < NewTransaction
                        ref='saleProducts'
                        tableId={'saleProductsTable'}
                        containerId={'saleProductsContainer'}
                        addProductToTbl={this.addProductToTbl}
                        customerId={this.state.customerId}
                    />
                    <ProductsTable
                        ref='saleProductsTable'
                        tableId={'saleProductsTable'}
                        containerId={'saleProductsContainer'}
                        deleteProductFrmTbl={this.deleteProductFrmTbl}
                        minusFromTotal={this.minusFromTotal}
                        addToTotal={this.addToTotal}
                        displayOtherSection={this.displayOtherSection}
                        displaySubmitButton={this.displaySubmitButton}
                        isDisplaySubmitButton={this.state.isDisplaySubmitButton}
                        saveReturns={this.saveReturns}
                        saveSales={this.saveSales}
                        saveInvoice={this.saveInvoice}
                    />
                </div>
                <div style={{ display: `${this.state.displayReturnsSection ? '' : 'none'}` }}>
                    < NewTransaction
                        ref='returnProducts'
                        tableId={'returnProductsTable'}
                        containerId={'returnProductsContainer'}
                        addProductToTbl={this.addProductToTbl}
                        customerId={this.state.customerId}
                    />
                    <ProductsTable
                        ref='returnProductsTable'
                        tableId={'returnProductsTable'}
                        containerId={'returnProductsContainer'}
                        askOtherSection={this.state.askOtherSection}
                        deleteProductFrmTbl={this.deleteProductFrmTbl}
                        minusFromTotal={this.minusFromTotal}
                        addToTotal={this.addToTotal}
                        isDisplaySubmitButton={!this.state.isDisplaySubmitButton}
                        saveReturns={this.saveReturns}
                        saveSales={this.saveSales}
                        saveInvoice={this.saveInvoice}
                        displayOtherSection={this.displayOtherSection}
                        displaySubmitButton={this.displaySubmitButton}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default NewSales