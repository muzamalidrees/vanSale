import React, { Component } from 'react';
import AllRolesPermissions from './pages/AllRolesPermissions';
import { Redirect } from 'react-router'


class SecuredAllRolesPermissions extends Component {
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
            return <AllRolesPermissions />
        }

    }
}



export default SecuredAllRolesPermissions