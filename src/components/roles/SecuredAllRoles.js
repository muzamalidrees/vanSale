import React, { Component } from 'react';
import AllRoles from './pages/AllRoles';
import { Redirect } from 'react-router'
import {Can} from '../../configs/Ability-context'

class SecuredAllRoles extends Component {
    loggedIn
    constructor() {
        super()
        this.user = localStorage.getItem('ui')

        if (this.user !== null) {
            this.loggedIn = true
        }
        else {
            this.loggedIn = false
        }
    }

    render() {
        if (this.loggedIn === false) {

            return <Redirect to='/home' />
        }
        else {
            return <Can I='read' a='role'>
                <AllRoles />
            </Can>
        }

    }
}



export default SecuredAllRoles