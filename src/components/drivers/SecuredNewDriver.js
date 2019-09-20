import React, { Component } from 'react';
import { Redirect } from 'react-router'
import NewPerson from '../misc/pages/NewPerson';
import { Can } from "../../configs/Ability-context";



class SecuredNewDriver extends Component {
    _isMounted = false
    state = {
        loggedIn: ''
    }
    constructor() {
        super()
        this._isMounted = true;
        this.user = localStorage.getItem('ui')
        this.user !== null ? this.loggedIn = true : this.loggedIn = false
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        if (this.state.loggedIn === false) {
            return <Redirect to='/login' />
        }
        else {
            return <Can I='create' a='driver'><NewPerson new={'Driver'} /></Can>
        }

    }
}



export default SecuredNewDriver