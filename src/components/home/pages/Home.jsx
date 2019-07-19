import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewSale from '../../sales/pages/NewSale';
import ProductsTable from '../../sales/pages/sections/ProductsTable'


class Home extends Component {
    _isMounted = false
    constructor() {
        super();

        this.state = {
            displaySaleProductsTable: 'none',
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }
    render() {

        return (
            <div style={{ marginTop: '72px' }}>
                < NewSale
                    tableType={'sales'}
                />
                <ProductsTable
                    ref='saleProductstable'
                    display={this.state.displaySaleProductsTable}
                />
            </div>
        );
    }
}


export default Home