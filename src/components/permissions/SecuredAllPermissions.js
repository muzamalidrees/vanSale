import React, { Component } from 'react';
import AllPermissions from './pages/AllPermissions';
import { Redirect } from 'react-router'


class SecuredAllPermissions extends Component {
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
            return <AllPermissions />
        }

    }
}



export default SecuredAllPermissions