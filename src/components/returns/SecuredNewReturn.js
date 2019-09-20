import React, { Component } from 'react';
import NewReturn from './pages/NewReturn';
import { Redirect } from 'react-router'


class SecuredNewReturn extends Component {
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
            return <NewReturn />
        }

    }
}



export default SecuredNewReturn