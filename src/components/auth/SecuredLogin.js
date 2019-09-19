import React, { Component } from 'react';
import Login from './pages/Login';
import { Redirect } from 'react-router-dom'



class SecuredLogin extends Component {
    loggedIn
    constructor() {
        super()
        this.user = localStorage.getItem('ui')

        if (this.user !== null) {
            this.loggedIn = true
        }
        else {
            this.loggedIn = false
        }
    }

    render() {
        if (this.loggedIn === true) {
            return <Redirect to='/home' />
        }
        else {
            return <Login changeUser={this.props.changeUser} />
        }

    }
}



export default SecuredLogin