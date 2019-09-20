import React, { Component } from 'react';
import { Redirect } from 'react-router'
import ReturnInventory from './pages/ReturnInventory';
import { Can } from '../../configs/Ability-context'


class SecuredReturnInventory extends Component {
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
                    <Can I='return' a='driverInventory'><ReturnInventory from='Driver' /></Can>
                    <Can I='return' a='operatorInventory'><ReturnInventory from='Operator' /></Can>
                </React.Fragment>
            )
        }

    }
}



export default SecuredReturnInventory