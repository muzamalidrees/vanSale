import React, { Component } from 'react';
import AllPriceGroups from './pages/AllPriceGroups';
import { Redirect } from 'react-router'


class SecuredAllPriceGroups extends Component {
  
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
            return <AllPriceGroups />
        }

    }
}



export default SecuredAllPriceGroups