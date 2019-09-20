import React, { Component } from 'react';
import NewUser from './pages/NewUser';
import { Redirect } from 'react-router'


class SecuredNewUser extends Component {
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
            return <NewUser />
        }

    }
}



export default SecuredNewUser