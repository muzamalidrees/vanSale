import React, { Component } from 'react';
import { Redirect } from 'react-router'
import AllInventory from './pages/AllInventory';


class SecuredAllInventory extends Component {
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
            return <AllInventory />
        }

    }
}



export default SecuredAllInventory