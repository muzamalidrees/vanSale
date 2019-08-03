import React, { Component } from 'react';
import { Redirect } from 'react-router'
import ReturnInventory from './pages/ReturnInventory';


class SecuredReturnInventory extends Component {
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
            return <ReturnInventory />
        }

    }
}



export default SecuredReturnInventory