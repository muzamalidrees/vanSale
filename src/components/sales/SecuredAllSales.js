import React, { Component } from 'react';
import AllTransactions from '../misc/pages/AllTransactions';
import { Redirect } from 'react-router'
import { Can } from '../../configs/Ability-context'

class SecuredAllSales extends Component {
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
            return <Can I='read' a='sales'> <AllTransactions trType='sales' /></Can>
        }

    }
}



export default SecuredAllSales