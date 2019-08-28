import React, { Component } from 'react';
import { Redirect } from 'react-router'
import AllPersons from '../misc/pages/AllPersons';
import { Can } from '../../configs/Ability-context'


class SecuredAllDrivers extends Component {
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
            return <Can I='read' a='driver'> <AllPersons all={'Drivers'} /></Can>
        }

    }
}



export default SecuredAllDrivers