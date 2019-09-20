import React, { Component } from 'react';
import { Redirect } from 'react-router'
import AllInventory from './pages/AllInventory';
import { Can } from '../../configs/Ability-context'


class SecuredAllInventory extends Component {
    state = {
        loggedIn: ''
    }
    constructor() {
        super()

        this.user = localStorage.getItem('ui')
        this.user !== null ? this.loggedIn = true : this.loggedIn = false
    }


    render() {

        if (this.state.loggedIn === false) {
            return <Redirect to='/login' />
        }
        else {
            return (
                <React.Fragment>
                    <Can I='read' a='driverInventories'>
                        <AllInventory showWise='Driver' />
                    </Can>
                    <Can I='read' a='operatorInventories'>
                        <AllInventory showWise='Operator' />
                    </Can>
                </React.Fragment>
            )
        }

    }
}



export default SecuredAllInventory