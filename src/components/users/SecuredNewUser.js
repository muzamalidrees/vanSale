import React, { Component } from 'react';
import NewUser from './pages/NewUser';
import { Redirect } from 'react-router'


class SecuredNewUser extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
    }
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
    componentWillUnmount() {
        this._isMounted = false;
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