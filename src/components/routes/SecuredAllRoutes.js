import React, { Component } from 'react';
import AllRoutes from './pages/AllRoutes';
import { Redirect } from 'react-router'


class SecuredAllRoutes extends Component {
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
            return <AllRoutes />
        }

    }
}



export default SecuredAllRoutes