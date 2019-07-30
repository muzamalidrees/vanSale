import React, { Component } from 'react';
import NewProduct from './pages/NewProduct';
import { Redirect } from 'react-router'


class SecuredNewProduct extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
    }
    constructor() {
        super()
        this._isMounted = true;
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
            return <NewProduct />
        }

    }
}



export default SecuredNewProduct