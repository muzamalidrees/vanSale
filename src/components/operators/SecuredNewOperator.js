import React, { Component } from 'react';
import { Redirect } from 'react-router'
import NewPerson from '../misc/pages/NewPerson';
import { Can } from '../../configs/Ability-context'

class SecuredNewOperator extends Component {
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
            return <Can I='create' a='operator'> <NewPerson new={'Operator'} /></Can>
        }

    }
}



export default SecuredNewOperator