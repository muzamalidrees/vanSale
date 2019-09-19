import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewTransaction from '../../misc/pages/NewTransaction';
import ProductsTable from '../../misc/sections/ProductsTable';
import InvoiceDetails from '../../misc/sections/InvoiceDetails'
import LoaderModal from '../../misc/sections/LoaderModal';


class NewReturn extends Component {
    _isMounted = false
    constructor() {
        super();

        this.state = {
            displaySalesSection: false,
            isDisplaySubmitButton: false,
            invoiceId: 1,
            customerId: '',
            modalShow: false
        }
        this.addProductToTbl = this.addProductToTbl.bind(this)
    }

    // setting customer id and enabling add product button
    customerSelected = (selectedCustomer) => {
        if (selectedCustomer === null) {
            this.refs.returnProducts.disableAddProductBtn();
            this.setState({
                customerId: ''
            })
            this.refs.returnProductsTable.makeTablesEmpty();
            // this.refs.saleProductsTable.makeTablesEmpty();
        }
        else {
            this.setState({
                customerId: selectedCustomer.value
            })
            this.refs.returnProducts.enableAddProductBtn();
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

        if (tableId === 'returnProductsTable') {
            this.refs.returnProductsTable.addProductToTbl(pId, pName, pRate, pQTY, pPrice);
            this.refs.invoiceDetails.minusTotalValue(pPrice);
            {
                this.state.displaySalesSection ?
                    console.log()
                    :
                    this.refs.returnProductsTable.setState({ askOtherSection: true })
            }

        }
        else {
            this.refs.saleProductsTable.addProductToTbl(pId, pName, pRate, pQTY, pPrice)
            this.refs.invoiceDetails.addTotalValue(pPrice);
        }
    }

    deleteProductFrmTbl = (price, i, tableId, containerId, pId) => {
        if (tableId === 'returnProductsTable') {
            this.refs.invoiceDetails.addTotalValue(price)
            this.refs.returnProducts.setAlreadyAddedProducts(pId)
        }
        else {
            this.refs.invoiceDetails.minusTotalValue(price)
            this.refs.saleProducts.setAlreadyAddedProducts(pId)
        }
        let table = document.getElementById(`${tableId}`);
        table.deleteRow(i);
        if (table.rows.length === 1) {
            document.getElementById(`${containerId}`).style.display = 'none'
            if (tableId === 'returnProductsTable') {
                this.displaySubmitButton(false)
                this.refs.returnProductsTable.setState({ askOtherSection: false })
            }
            else {
                this.displaySubmitButton(false)
                this.refs.saleProductsTable.setState({ askOtherSection: false, isDisplaySubmitButton: false })
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
        this.setState({ displaySalesSection: value })
        this.refs.saleProducts.setState({
            disableAddProductBtn: !value
        })
    }

    displaySubmitButton = (value) => {
        this.setState({ isDisplaySubmitButton: value })
    }

    saveInvoice = () => {
        this.setState({
            customerId: '',
            invoiceId: this.state.invoiceId + 1
        })
        this.refs.invoiceDetails.saveInvoice();
        this.refs.returnProducts.setAlreadyAddedProducts(null)
    }

    fetchInvoiceDetails = () => {
        let trDate = this.refs.invoiceDetails.state.trDate
        let total = this.refs.invoiceDetails.state.total
        let customer = this.refs.invoiceDetails.state.customer
        let invoiceId = this.refs.invoiceDetails.state.invoiceId
        let invoiceDetails = { total: total, invoiceId: invoiceId, customer: customer, trDate: trDate }
        return invoiceDetails
    }

    loaderModalShow = (value) => {
        this.setState({ modalShow: value })
    }

    render() {
        let { modalShow, isDisplaySubmitButton, customerId, displaySalesSection, askOtherSection } = this.state

        return (
            <React.Fragment>
                <Can I='create' a='returns'>
                    <div style={{ marginTop: '60px', paddingTop: '0px' }} className='mb-0 pb-0'>
                        <InvoiceDetails
                            ref='invoiceDetails'
                            customerSelected={this.customerSelected}
                            lastInvoiceIdFetched={this.lastInvoiceIdFetched}
                        />
                        < NewTransaction
                            ref='returnProducts'
                            tableId={'returnProductsTable'}
                            containerId={'returnProductsContainer'}
                            addProductToTbl={this.addProductToTbl}
                            customerId={customerId}
                        />
                        <ProductsTable
                            ref='returnProductsTable'
                            tableId={'returnProductsTable'}
                            containerId={'returnProductsContainer'}
                            deleteProductFrmTbl={this.deleteProductFrmTbl}
                            minusFromTotal={this.minusFromTotal}
                            addToTotal={this.addToTotal}
                            displayOtherSection={this.displayOtherSection}
                            displaySubmitButton={this.displaySubmitButton}
                            isDisplaySubmitButton={isDisplaySubmitButton}
                            saveReturns={this.saveReturns}
                            saveSales={this.saveSales}
                            saveInvoice={this.saveInvoice}
                            fetchInvoiceDetails={this.fetchInvoiceDetails}
                            loaderModalShow={this.loaderModalShow}
                        />
                    </div>
                </Can>
                <Can I='create' a='sales'>
                    <div style={{ display: `${displaySalesSection ? '' : 'none'}` }}>
                        <ProductsTable
                            ref='saleProductsTable'
                            tableId={'saleProductsTable'}
                            containerId={'saleProductsContainer'}
                            askOtherSection={askOtherSection}
                            deleteProductFrmTbl={this.deleteProductFrmTbl}
                            minusFromTotal={this.minusFromTotal}
                            addToTotal={this.addToTotal}
                            isDisplaySubmitButton={!isDisplaySubmitButton}
                            saveReturns={this.saveReturns}
                            saveSales={this.saveSales}
                            saveInvoice={this.saveInvoice}
                            displayOtherSection={this.displayOtherSection}
                            displaySubmitButton={this.displaySubmitButton}
                            fetchInvoiceDetails={this.fetchInvoiceDetails}
                            loaderModalShow={this.loaderModalShow}
                        />
                        < NewTransaction
                            ref='saleProducts'
                            tableId={'saleProductsTable'}
                            containerId={'saleProductsContainer'}
                            addProductToTbl={this.addProductToTbl}
                            customerId={customerId}
                        />
                    </div>
                </Can>
                <LoaderModal
                    show={modalShow} />
            </React.Fragment>
        );
    }
}

export default NewReturn