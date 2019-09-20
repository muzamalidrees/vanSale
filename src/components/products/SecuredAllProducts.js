import React, { Component } from 'react';
import AllProducts from './pages/AllProducts';
import { Redirect } from 'react-router'


class SecuredAllProducts extends Component {
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
            return <AllProducts />
        }

    }
}



export default SecuredAllProducts