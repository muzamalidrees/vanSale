import React, { Component } from 'react';
import { Redirect } from 'react-router'
import NewInventory from './pages/NewInventory';
import {Can} from '../../configs/Ability-context'


class SecuredNewInventory extends Component {
    state = {
        loggedIn: ''
    }
    constructor() {
        super()

        this.user = localStorage.getItem('ui')
        if (this.user !== null) {
            this.loggedIn = true
        }
        else {
            this.loggedIn = false
        }
    }

    render() {

        if (this.state.loggedIn === false) {
            return <Redirect to='/login' />
        }
        else {
            return (
                <React.Fragment>
                    <Can I='allocate' a='driverInventory'><NewInventory to='Driver' /></Can>
                    <Can I='allocate' a='operatorInventory'><NewInventory to='Operator' /></Can>
                </React.Fragment>
            )
        }

    }
}



export default SecuredNewInventory