import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewSales from '../../sales/pages/NewSales'



class Home extends Component {

    productScannedInAndroid = (barcode) => {
        console.log(barcode);
        this.refs.newSales.productScannedInAndroid(barcode)
    }

    render() {
        return (
            <Can I='sale' a='product'>
                <NewSales
                    ref='newSales' />
            </Can>
        )
    }
}
export default Home