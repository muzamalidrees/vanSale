import React, { Component } from 'react';
import AllTransactions from '../misc/pages/AllTransactions';
import { Redirect } from 'react-router'
import { Can } from '../../configs/Ability-context'



class SecuredAllReturns extends Component {
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
            return <Can I='read' a='returns'> <AllTransactions trType='returns' /></Can>
        }

    }
}



export default SecuredAllReturns