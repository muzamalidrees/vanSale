import React, { Component } from 'react';
import Home from './pages/Home';
import { Redirect } from 'react-router'


class SecuredHome extends Component {
    loggedIn
    constructor() {
        super()
        this.user = localStorage.getItem('ui')
        // console.log(this.user);

        if (this.user !== null) {
            // console.log('user not null');
            this.loggedIn = true
        }
        else {
            // console.log('user null 2');
            this.loggedIn = false
        }

    }

    render() {

        if (this.loggedIn === false) {
            return <Redirect to='/login' />
        }
        else {
            return <Home />
        }

    }
}



export default SecuredHome