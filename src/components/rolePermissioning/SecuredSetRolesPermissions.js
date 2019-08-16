import React, { Component } from 'react';
import SetRolesPermissions from './pages/SetRolesPermissions';
import { Redirect } from 'react-router'


class SecuredSetRolesPermissions extends Component {
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
            return <SetRolesPermissions />
        }

    }
}



export default SecuredSetRolesPermissions