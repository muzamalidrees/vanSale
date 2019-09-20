import React, { Component } from 'react';
import NewPermission from './pages/NewPermission';
import { Redirect } from 'react-router'


class SecuredNewPermission extends Component {
    
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
            return <NewPermission />
        }

    }
}



export default SecuredNewPermission