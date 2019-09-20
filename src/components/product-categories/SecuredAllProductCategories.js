import React, { Component } from 'react';
import AllProductCategories from './pages/AllProductCategories';
import { Redirect } from 'react-router'


class SecuredAllProductCategories extends Component {
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
            return <AllProductCategories />
        }

    }
}



export default SecuredAllProductCategories