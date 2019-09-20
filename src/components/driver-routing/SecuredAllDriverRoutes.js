import React, { Component } from 'react';
import AllDriverRoutes from './pages/AllDriverRoutes';
import { Redirect } from 'react-router'


class SecuredAllDriverRoutes extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
    }
    constructor() {
        super()
        this._isMounted = true;
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
            return <AllDriverRoutes />
        }

    }
}



export default SecuredAllDriverRoutes