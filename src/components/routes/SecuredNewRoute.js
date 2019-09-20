import React, { Component } from 'react';
import NewRoute from './pages/NewRoute';
import { Redirect } from 'react-router'


class SecuredNewRoute extends Component {
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
            return <NewRoute />
        }

    }
}



export default SecuredNewRoute