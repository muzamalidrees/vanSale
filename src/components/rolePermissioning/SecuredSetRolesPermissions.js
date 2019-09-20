import React, { Component } from 'react';
import SetRolesPermissions from './pages/SetRolesPermissions';
import { Redirect } from 'react-router'


class SecuredSetRolesPermissions extends Component {
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
            return <SetRolesPermissions />
        }

    }
}



export default SecuredSetRolesPermissions