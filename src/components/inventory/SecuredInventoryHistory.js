import React, { Component } from 'react';
import { Redirect } from 'react-router'
import InventoryHistory from './pages/InventoryHistory';


class SecuredInventoryHistory extends Component {
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
            return <InventoryHistory />
        }

    }
}



export default SecuredInventoryHistory