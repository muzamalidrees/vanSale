import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Can } from "../../configs/Ability-context";
import SecuredNewUser from './SecuredNewUser';
import SecuredAllUsers from './SecuredAllUsers';



class Users extends Component {
    constructor() {
        super();
        this.state = {
            date: new Date(),
        };
    }

    render() {


        return (
            <Switch>
                <Route path="/users/new" component={SecuredNewUser} />
                <Route path="/users/all" component={SecuredAllUsers} />
            </Switch>

        )
    }
}


export default Users