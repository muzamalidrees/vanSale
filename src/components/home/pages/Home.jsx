import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewSales from '../../sales/pages/NewSales'
import NewInventory from '../../inventory/pages/NewInventory';


class Home extends Component {

    productScannedInAndroid = (barcode) => {
        console.log(barcode);
        this.refs.newSales.productScannedInAndroid(barcode)
    }

    render() {
        return (
            <React.Fragment>
                <Can I='create' a='sales'>
                    <NewSales
                        ref='newSales' />
                </Can>
                <Can I='allocate' a='driverInventory' >
                    <NewInventory to='Driver' />
                </Can>
                <Can I='allocate' a='operatorInventory'>
                    <NewInventory to='Operator' />
                </Can>
            </React.Fragment>
        )
    }
}
export default Home