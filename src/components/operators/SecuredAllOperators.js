import React, { Component } from 'react';
import { Redirect } from 'react-router'
import AllPersons from '../misc/pages/AllPersons';
import { Can } from '../../configs/Ability-context'

class SecuredAllOperators extends Component {
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
            return <Can I='read' a='operator'> <AllPersons all={'Operators'} /></Can>
        }

    }
}



export default SecuredAllOperators