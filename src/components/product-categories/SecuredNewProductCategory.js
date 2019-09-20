import React, { Component } from 'react';
import NewProductCategory from './pages/NewProductCategory';
import { Redirect } from 'react-router'


class SecuredNewProductCategory extends Component {
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
            return <NewProductCategory />
        }

    }
}



export default SecuredNewProductCategory