import React, { Component } from 'react';
import { Can } from '../../../configs/Ability-context'
import NewSales from '../../sales/pages/NewSales'
import NewInventory from '../../inventory/pages/NewInventory';
import DriversCustomers from './sections/driver-section/DriversCustomers'

class Home extends Component {

    render() {
        return (
            <React.Fragment>
                <Can I='create' a='sales'>
                    {/* <NewSales
                        ref='newSales' /> */}
                    <DriversCustomers />
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