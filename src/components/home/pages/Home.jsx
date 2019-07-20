import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewTransaction from '../../misc/pages/NewTransaction';
import ProductsTable from '../../misc/sections/ProductsTable';


class Home extends Component {
    _isMounted = false
    constructor() {
        super();

        this.state = {
            displayReturnsSection: false,
            isDisplaySubmitButton: false,
            
        }
        this.addProductToTbl = this.addProductToTbl.bind(this)
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }

    addProductToTbl = (tableId, pId, pName, pRate, pQTY, pPrice, trDate) => {
        console.log(tableId, pId, pName, pRate, pQTY, pPrice, trDate);

        if (tableId === 'saleProductstable') {
            this.refs.saleProductstable.addProductToTbl(pId, pName, pRate, pQTY, pPrice, trDate)
            this.refs.saleProductstable.setState({ askOtherSection: true })
        }
        else {
            this.refs.returnProductstable.addProductToTbl(pId, pName, pRate, pQTY, pPrice, trDate)
            // this.refs.returnProductstable.setState({ askOtherSection: true })
        }
    }

    deleteProductFrmTbl = (price, i, tableId, containerId) => {
        if (tableId === 'saleProductstable') {
            this.refs.saleProducts.minusTotalValue(price)
        }
        else {
            this.refs.returnProducts.minusTotalValue(price)
        }
        let table = document.getElementById(`${tableId}`);
        table.deleteRow(i);
        if (table.rows.length === 1) {
            document.getElementById(`${containerId}`).style.display = 'none'
            tableId === 'saleProductstable' ?
                this.refs.saleProductstable.setState({ askOtherSection: false })
                :
                this.refs.returnProductstable.setState({ askOtherSection: false })
        }
    }

    minusFromTotal = (tableId, pPrice) => {
        tableId === 'saleProductstable' ?
            this.refs.saleProducts.minusTotalValue(pPrice)
            :
            this.refs.returnProducts.minusTotalValue(pPrice)
    }

    addToTotal = (tableId, pPrice) => {
        tableId === 'saleProductstable' ?
            this.refs.saleProducts.addTotalValue(pPrice)
            :
            this.refs.returnProducts.addTotalValue(pPrice)

    }

    displayOtherSection = () => {
        this.setState({ displayReturnsSection: true })
    }

    displaySubmitButton = () => {
        this.setState({ isDisplaySubmitButton: true })
    }


    render() {

        return (
            <React.Fragment>
                <div style={{ marginTop: '72px' }}>
                    < NewTransaction
                        ref='saleProducts'
                        tableId={'saleProductstable'}
                        containerId={'saleProductsContainer'}
                        addProductToTbl={this.addProductToTbl}
                    />
                    <ProductsTable
                        ref='saleProductstable'
                        tableId={'saleProductstable'}
                        containerId={'saleProductsContainer'}
                        deleteProductFrmTbl={this.deleteProductFrmTbl}
                        minusFromTotal={this.minusFromTotal}
                        addToTotal={this.addToTotal}
                        displayOtherSection={this.displayOtherSection}
                        displaySubmitButton={this.displaySubmitButton}
                        isDisplaySubmitButton={this.state.isDisplaySubmitButton}
                    />
                </div>
                <div style={{ display: `${this.state.displayReturnsSection ? '' : 'none'}` }}>
                    < NewTransaction
                        ref='returnProducts'
                        tableId={'returnProductstable'}
                        containerId={'returnProductsContainer'}
                        addProductToTbl={this.addProductToTbl}
                    />
                    <ProductsTable
                        ref='returnProductstable'
                        tableId={'returnProductstable'}
                        containerId={'returnProductsContainer'}
                        askOtherSection={this.state.askOtherSection}
                        deleteProductFrmTbl={this.deleteProductFrmTbl}
                        minusFromTotal={this.minusFromTotal}
                        addToTotal={this.addToTotal}
                        isDisplaySubmitButton={!this.state.isDisplaySubmitButton}
                    />
                </div>
            </React.Fragment>
        );
    }
}


export default Home