import React, { Component } from 'react';
import { Redirect } from 'react-router'
import NewPerson from '../misc/pages/NewPerson';
import { Can } from '../../configs/Ability-context'

class SecuredNewOperator extends Component {

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
            return <Can I='create' a='operator'> <NewPerson new={'Operator'} /></Can>
        }

    }
}



export default SecuredNewOperator