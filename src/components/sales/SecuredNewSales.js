import React, { Component } from 'react';
import NewSales from './pages/NewSales';
import { Redirect } from 'react-router'


class SecuredNewSales extends Component {
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
            return <NewSales />
        }

    }
}



export default SecuredNewSales