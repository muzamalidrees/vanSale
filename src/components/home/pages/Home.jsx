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
            <NewSales
                ref='newSales' />
        )
    }
}
export default Home