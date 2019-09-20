import React, { Component } from 'react';
import NewProduct from './pages/NewProduct';
import { Redirect } from 'react-router'


class SecuredNewProduct extends Component {
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
            return <NewProduct />
        }

    }
}



export default SecuredNewProduct