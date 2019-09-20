import React, { Component } from 'react';
import SetDriverRoutes from './pages/SetDriverRoutes';
import { Redirect } from 'react-router'


class SecuredSetDriverRoutes extends Component {
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
            return <SetDriverRoutes />
        }

    }
}



export default SecuredSetDriverRoutes