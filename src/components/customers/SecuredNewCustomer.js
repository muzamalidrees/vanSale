import React, { Component } from 'react';
import NewCustomer from './pages/NewCustomer';
import { Redirect } from 'react-router'


class SecuredNewCustomer extends Component {
    _isMounted = false
    state = {
        loggedIn: true
    }
    constructor() {
        super()
        this.user = localStorage.getItem('ui')
        this.user !== null ? this.loggedIn = true : this.loggedIn = false
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        if (this.state.loggedIn === false) {
            return <Redirect to='/login' />
        }
        else {
            return <NewCustomer />
        }

    }
}



export default SecuredNewCustomer