import React, { Component } from 'react';
import AllUsers from './pages/AllUsers';
import { Redirect } from 'react-router'


class SecuredAllUsers extends Component {
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
            return <AllUsers />
        }

    }
}



export default SecuredAllUsers