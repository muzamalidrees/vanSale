import React, { Component } from 'react';
import AllInvoices from './pages/AllInvoices';
import { Redirect } from 'react-router'


class SecuredAllInvoices extends Component {
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
            return <AllInvoices />
        }

    }
}



export default SecuredAllInvoices