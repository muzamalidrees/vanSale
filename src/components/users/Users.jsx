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
            // <div>
            //     <h1 style={{ marginTop: '80px' }}>
            //         Users Page
            //     </h1>
            // </div>
            <Switch>
                <Route path="/users/new" component={SecuredNewUser} />
                <Route path="/users/all" component={SecuredAllUsers} />
            </Switch>

        )
    }
}


export default Users