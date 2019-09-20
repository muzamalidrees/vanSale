import React, { Component } from 'react';
import NewPriceGroup from './pages/NewPriceGroup';
import { Redirect } from 'react-router'


class SecuredNewPriceGroup extends Component {
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
            return <NewPriceGroup />
        }

    }
}



export default SecuredNewPriceGroup