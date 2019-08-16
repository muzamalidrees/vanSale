import React, { Component } from 'react';
import AllRolesPermissions from './pages/AllRolesPermissions';
import { Redirect } from 'react-router'


class SecuredAllRolesPermissions extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
    }
    constructor() {
        super()
        this._isMounted = true;
        this.user = localStorage.getItem('ui')

        if (this.user !== null) {
            this.loggedIn = true
        }
        else {
            this.loggedIn = false
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        if (this.state.loggedIn === false) {
            return <Redirect to='/login' />
        }
        else {
            return <AllRolesPermissions />
        }

    }
}



export default SecuredAllRolesPermissions