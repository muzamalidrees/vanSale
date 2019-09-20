import React, { Component } from 'react';
import NewDevice from './pages/NewDevice';
import { Redirect } from 'react-router'


class SecuredNewDevice extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
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
            return <NewDevice />
        }

    }
}



export default SecuredNewDevice