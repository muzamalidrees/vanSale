import React, { Component } from 'react';
import AllDevices from './pages/AllDevices';
import { Redirect } from 'react-router'


class SecuredAllDevices extends Component {
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
            return <AllDevices />
        }

    }
}



export default SecuredAllDevices